"""Audit the published HTML graph without requiring JavaScript or network access."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = 'https://brandnamechanges.com'


class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.anchors, self.assets, self.ids, self.canonicals = [], [], set(), []
        self.noindex = False
        self.feed(text)

    def handle_starttag(self, tag, attributes):
        a = dict(attributes)
        if a.get('id'):
            self.ids.add(a['id'])
        if tag == 'a' and a.get('href'):
            self.anchors.append(a['href'])
        if tag in ('img', 'source', 'script') and a.get('src'):
            self.assets.append(a['src'])
        if tag == 'link':
            if a.get('rel') == 'canonical':
                self.canonicals.append(a.get('href'))
            if a.get('rel') in ('stylesheet', 'icon') and a.get('href'):
                self.assets.append(a['href'])
        if tag == 'meta' and a.get('name', '').lower() in ('robots', 'googlebot'):
            self.noindex |= 'noindex' in a.get('content', '').lower()


def file_for(route):
    path = ROOT / unquote(route).lstrip('/')
    if path.is_dir():
        return path / 'index.html'
    if path.is_file():
        return path
    return path.with_suffix('.html')


def audit():
    urls = [node.text for node in ET.parse(ROOT / 'sitemap.xml').findall('.//{*}loc')]
    errors = []
    if len(urls) != len(set(urls)):
        errors.append('Duplicate sitemap URLs')
    documents = {}
    for url in urls:
        file = file_for(urlsplit(url).path)
        if not file.is_file():
            errors.append(f'Missing sitemap destination: {url}')
            continue
        doc = Document(file.read_text())
        documents[url] = doc
        if doc.canonicals != [url]:
            errors.append(f'Canonical mismatch: {url}: {doc.canonicals}')
        if doc.noindex:
            errors.append(f'Noindex sitemap destination: {url}')
    graph = {url: set() for url in urls}
    for url, doc in documents.items():
        for raw in doc.anchors + doc.assets:
            target = urlsplit(urljoin(url, raw))
            if target.netloc != 'brandnamechanges.com':
                continue
            file = file_for(target.path)
            if not file.is_file():
                errors.append(f'Broken internal target: {url} -> {raw}')
                continue
            dest = DOMAIN + target.path
            if raw in doc.anchors and dest in graph:
                graph[url].add(dest)
            if target.fragment and file.suffix == '.html':
                target_doc = documents.get(dest) or Document(file.read_text())
                if unquote(target.fragment) not in target_doc.ids:
                    errors.append(f'Broken fragment: {url} -> {raw}')
    seen, pending = set(), [DOMAIN + '/cadence/']
    while pending:
        current = pending.pop()
        if current in seen:
            continue
        seen.add(current)
        pending.extend(graph.get(current, set()) - seen)
    for url in urls:
        if '/cadence/' in url and url not in seen:
            errors.append(f'No anchor path from product page: {url}')
    robots = (ROOT/'robots.txt').read_text()
    if 'Sitemap: ' + DOMAIN + '/sitemap.xml' not in robots:
        errors.append('robots.txt lacks the production sitemap')
    return {'sitemap_urls':len(urls), 'reachable_cadence_urls':len([u for u in seen if '/cadence/' in u]), 'errors': sorted(set(errors))}


if __name__ == '__main__':
    result = audit()
    print(json.dumps(result, indent=2))
    raise SystemExit(bool(result['errors']))
