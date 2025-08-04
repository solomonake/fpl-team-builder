import requests
import json
import os

print("📡 Fetching FPL data...")  # NEW

url = "https://fantasy.premierleague.com/api/bootstrap-static/"
response = requests.get(url)

print(f"Status Code: {response.status_code}")  # NEW

if response.status_code == 200:
    data = response.json()
    os.makedirs("data", exist_ok=True)  # CHANGED to "data" instead of "../data"

    with open("data/player_data.json", "w") as f:
        json.dump(data, f, indent=4)
    print("✅ FPL data saved to data/player_data.json")
else:
    print("❌ Failed to fetch data:", response.status_code)

