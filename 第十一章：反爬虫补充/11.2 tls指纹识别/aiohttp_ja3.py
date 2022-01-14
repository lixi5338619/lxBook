import random
import ssl
# aiohttp 修改 ja3

class DESAdapter():
    def __init__(self):
        self.ORIGIN_CIPHERS = ('ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+HIGH:DH+HIGH:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+HIGH:RSA+3DES')

    def __call__(self):
        CIPHERS = self.ORIGIN_CIPHERS.split(':')
        random.shuffle(CIPHERS)
        CIPHERS = ':'.join(CIPHERS)
        CIPHERS = CIPHERS + ':!aNULL:!eNULL:!MD5'
        context = ssl.create_default_context()
        context.set_ciphers(CIPHERS)
        return context

import aiohttp,asyncio
async def main():
    async with aiohttp.ClientSession() as session:
        for req in range(5):
            async with session.get("https://ja3er.com/json",ssl=Adapter()) as res:
                data = await res.json()
                print(data)

if __name__ == '__main__':
    Adapter = DESAdapter()
    m = asyncio.get_event_loop()
    m.run_until_complete(main())