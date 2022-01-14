# -*- coding: utf-8 -*-
from typing import Optional

from twisted.internet.defer import Deferred

from scrapy import signals
from scrapy.http import Request, Response, Headers
from scrapy.spiders import Spider
from scrapy.settings import Settings
from scrapy.crawler import Crawler
from scrapy.utils.defer import deferred_from_coro, deferred_f_from_coro_f
from scrapy.responsetypes import responsetypes
from scrapy.core.downloader.handlers.http import HTTPDownloadHandler
import httpx


class HttpxDownloadHandler(HTTPDownloadHandler):
    def __init__(self, settings: Settings, crawler: Optional[Crawler] = None):
        super().__init__(settings, crawler)
        self.client = None
        crawler.signals.connect(self._engine_started, signals.engine_started)

    @deferred_f_from_coro_f
    async def _engine_started(self, signal, sender):
        client = httpx.AsyncClient(http2=True)
        self.client = await client.__aenter__()

    def download_request(self, request: Request, spider: Spider) -> Deferred:
        if request.meta.get("h2"):
            return deferred_from_coro(self._download_request(request, spider))
        return super().download_request(request, spider)  # 普通下载

    async def _download_request(self, request: Request, spider: Spider) -> Response:
        """httpx下载逻辑"""
        response = await self.client.request(request.method,
                                             request.url,
                                             content=request.body,
                                             headers=request.headers.to_unicode_dict(),
                                             cookies=request.cookies)
        headers = Headers(response.headers)
        respcls = responsetypes.from_args(headers=headers,
                                          url=response.url,
                                          body=response.content)
        return respcls(url=str(response.url),
                       status=response.status_code,
                       headers=headers,
                       body=response.content,
                       flags=["httpx"],
                       request=request,
                       protocol=response.http_version)

    @deferred_f_from_coro_f
    async def close(self):
        await self.client.__aexit__()
        await super().close()