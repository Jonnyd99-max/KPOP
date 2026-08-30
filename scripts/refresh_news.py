import datetime as dt
import email.utils
import html
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

QUERY = 'K-pop OR BLACKPINK OR "Stray Kids" OR aespa OR SEVENTEEN OR ILLIT OR ENHYPEN OR KATSEYE when:2d'
URL = 'https://news.google.com/rss/search?' + urllib.parse.urlencode({
    'q': QUERY,
    'hl': 'en-GB',
    'gl': 'GB',
    'ceid': 'GB:en',
})

request = urllib.request.Request(URL, headers={'User-Agent': 'KPOP-News-Updater/1.0'})
with urllib.request.urlopen(request, timeout=30) as response:
    root = ET.fromstring(response.read())

items = []
for node in root.findall('./channel/item'):
    raw_title = node.findtext('title', '').strip()
    link = node.findtext('link', '').strip()
    published_raw = node.findtext('pubDate', '').strip()
    source_node = node.find('source')
    source = source_node.text.strip() if source_node is not None and source_node.text else 'Google News'
    title = re.sub(r'\s+-\s+[^-]+$', '', raw_title).strip()
    description = html.unescape(re.sub('<[^>]+>', ' ', node.findtext('description', '')))
    description = re.sub(r'\s+', ' ', description).strip()
    if len(description) > 180:
        description = description[:177].rsplit(' ', 1)[0] + '…'
    try:
        published_dt = email.utils.parsedate_to_datetime(published_raw)
        published = published_dt.strftime('%-d %b %Y')
    except (TypeError, ValueError):
        published = 'Recently'
    items.append({
        'label': 'REPORTED',
        'title': title,
        'summary': description or 'Open the original report for the full story and context.',
        'source': source,
        'published': published,
        'url': link,
    })
    if len(items) == 8:
        break

if not items:
    raise SystemExit('No news items returned; preserving the current feed.')

payload = {'updatedAt': dt.datetime.now(dt.timezone.utc).isoformat(), 'items': items}
Path('news.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

