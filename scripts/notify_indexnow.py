"""Notify participating engines of deployed sitemap URLs; dry-run by default.
The IndexNow ownership token is intentionally public, not an account credential.
"""
import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
HOST = 'brandnamechanges.com'
ENDPOINT = 'https://api.indexnow.org/indexnow'

def payload_for(urls, root=ROOT):
    config = json.loads((root/'indexnow.json').read_text())
    key = config['key']
    if len(key) != 32 or any(c not in '0123456789abcdef' for c in key):
        raise ValueError('Invalid public ownership token')
    allowed = {e.text for e in ET.parse(root/'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
    unique = list(dict.fromkeys(urls))
    if not unique or len(unique) > 10000:
        raise ValueError('Provide 1–10000 URLs')
    for url in unique:
        parts = urlsplit(url)
        if parts.scheme != 'https' or parts.netloc != HOST or parts.query or parts.fragment or url not in allowed:
            raise ValueError('Only canonical URLs from the committed sitemap may be submitted')
    return {'host': HOST, 'key': key, 'keyLocation': f'https://{HOST}/{key}.txt', 'urlList': unique}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('urls', nargs='+')
    parser.add_argument('--submit', action='store_true')
    args = parser.parse_args()
    payload = payload_for(args.urls)
    if not args.submit:
        print(json.dumps({'mode':'dry-run', 'urls':payload['urlList']}, indent=2))
        return
    # Publication must precede submission. Verify ownership and each canonical URL.
    with urlopen(payload['keyLocation'], timeout=30) as response:
        if response.read(256).decode().strip() != payload['key']:
            raise ValueError('Public verification token is not deployed')
    for url in payload['urlList']:
        with urlopen(Request(url, method='HEAD'), timeout=30) as response:
            if response.status != 200 or response.url != url:
                raise ValueError('URL must return 200 without redirect: '+url)
    request = Request(ENDPOINT, data=json.dumps(payload).encode(), headers={'Content-Type':'application/json'}, method='POST')
    with urlopen(request, timeout=30) as response:
        print(json.dumps({'status':response.status,'submitted':len(payload['urlList']),'urls':payload['urlList'],'meaning':'Received or pending validation; indexing and ranking are not confirmed.'}))

if __name__ == '__main__':
    main()
