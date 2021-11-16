from requests.adapters import HTTPAdapter
from urllib3.util.ssl_ import create_urllib3_context
import random,requests

class DESAdapter(HTTPAdapter):
    def __init__(self, *args, **kwargs):
        self.CIPHERS = self.get_ciphers()
        super().__init__(*args, **kwargs)

    def get_ciphers(self):
        ORIGIN_CIPHERS = ('ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+HIGH:'
                          'DH+HIGH:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+HIGH:RSA+3DES')
        CIPHERS = ORIGIN_CIPHERS.split(':')
        random.shuffle(CIPHERS)
        CIPHERS = ':'.join(CIPHERS)
        CIPHERS = CIPHERS + ':!aNULL:!eNULL:!MD5'
        return CIPHERS

    def init_poolmanager(self, *args, **kwargs):
        context = create_urllib3_context(ciphers=self.CIPHERS)
        kwargs['ssl_context'] = context
        return super(DESAdapter, self).init_poolmanager(*args, **kwargs)


if __name__ == '__main__':
    sess = requests.Session()
    while 1:
        sess.mount('https://ja3er.com', DESAdapter())
        res = sess.get('https://ja3er.com/json').json()
        print(res)