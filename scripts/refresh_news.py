import datetime as dt
import email.utils
import html
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

TOPICS = ["K-pop", "BLACKPINK", '"Stray Kids"', "aespa", "SEVENTEEN", "ILLIT", "ENHYPEN", "KATSEYE"]
MAX_AGE = dt.timedelta(days=4)
now = dt.datetime.now(dt.timezone.utc)

def load(topic):
    query = f"{topic} when:4d"
    url = "https://news.google.com/rss/search?" + urllib.parse.urlencode({
        "q": query, "hl": "en-GB", "gl": "GB", "ceid": "GB:en"
    })
    request = urllib.request.Request(url, headers={"User-Agent": "KPOP-News-Updater/2.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return ET.fromstring(response.read()).findall("./channel/item")

candidates = []
for topic in TOPICS:
    try:
        nodes = load(topic)
    except Exception as error:
        print(f"Skipping {topic}: {error}")
        continue
    for node in nodes[:15]:
        raw_title = node.findtext("title", "").strip()
        source_node = node.find("source")
        source = source_node.text.strip() if source_node is not None and source_node.text else "Google News"
        try:
            published_dt = email.utils.parsedate_to_datetime(node.findtext("pubDate", "")).astimezone(dt.timezone.utc)
        except (TypeError, ValueError):
            continue
        if now - published_dt > MAX_AGE:
            continue
        title = re.sub(r"\s+-\s+[^-]+$", "", raw_title).strip()
        description = html.unescape(re.sub("<[^>]+>", " ", node.findtext("description", "")))
        description = re.sub(r"\s+", " ", description).strip()
        if len(description) > 180:
            description = description[:177].rsplit(" ", 1)[0] + "…"
        candidates.append({
            "label": "OFFICIAL" if any(name in source.lower() for name in ("weverse", "jype", "yg", "smtown")) else "LATEST",
            "title": title,
            "summary": description or "Open the original report for the full story and context.",
            "source": source,
            "published": published_dt.strftime("%-d %b %Y"),
            "publishedIso": published_dt.isoformat(),
            "url": node.findtext("link", "").strip(),
            "topic": topic.replace('"', ""),
        })

seen_titles, source_counts, topic_counts, selected = set(), {}, {}, []
for item in sorted(candidates, key=lambda row: row["publishedIso"], reverse=True):
    key = re.sub(r"[^a-z0-9]", "", item["title"].lower())[:100]
    source_key = item["source"].lower()
    if key in seen_titles or source_counts.get(source_key, 0) >= 2 or topic_counts.get(item["topic"], 0) >= 3:
        continue
    seen_titles.add(key)
    source_counts[source_key] = source_counts.get(source_key, 0) + 1
    topic_counts[item["topic"]] = topic_counts.get(item["topic"], 0) + 1
    item.pop("publishedIso", None)
    item.pop("topic", None)
    selected.append(item)
    if len(selected) == 18:
        break

if len(selected) < 3:
    raise SystemExit("Too few fresh news items returned; preserving the current feed.")

payload = {"updatedAt": now.isoformat(), "items": selected}
Path("news.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

