import json
from datetime import date, datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOURS = ROOT / "tours.json"

data = json.loads(TOURS.read_text(encoding="utf-8"))
today = date.today().isoformat()
data["events"] = sorted(
    (event for event in data.get("events", []) if event.get("end", event["start"]) >= today),
    key=lambda event: (event["start"], event["artist"]),
)
data["updatedAt"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
TOURS.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

