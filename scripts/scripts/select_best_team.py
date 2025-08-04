import json
import pandas as pd
from collections import defaultdict

# Load data
with open("data/player_data.json") as f:
    data = json.load(f)

players = data["elements"]
teams = data["teams"]
positions = data["element_types"]

df = pd.DataFrame(players)

# Constants
TOTAL_BUDGET = 1000  # £100M, prices are ×10
POSITION_LIMITS = {1: 2, 2: 5, 3: 5, 4: 3}
TEAM_LIMIT = 3

# Map team ID to name
team_map = {team["id"]: team["name"] for team in teams}
# Map element_type ID to position name
position_map = {pos["id"]: pos["singular_name_short"] for pos in positions}

# Add helper columns
df["value_score"] = df["total_points"] / df["now_cost"]
df["team_name"] = df["team"].map(team_map)
df["position"] = df["element_type"].map(position_map)

# Sort by value efficiency
df_sorted = df.sort_values(by="value_score", ascending=False)

# Build team
team = []
budget_used = 0
position_count = defaultdict(int)
club_count = defaultdict(int)

for _, player in df_sorted.iterrows():
    cost = player["now_cost"]
    position = player["element_type"]
    club_id = player["team"]

    if (budget_used + cost > TOTAL_BUDGET or
        position_count[position] >= POSITION_LIMITS[position] or
        club_count[club_id] >= TEAM_LIMIT):
        continue

    team.append(player)
    budget_used += cost
    position_count[position] += 1
    club_count[club_id] += 1

    if len(team) == 15:
        break

# Create a DataFrame for the team
team_df = pd.DataFrame(team)

# Select columns to display
output = team_df[[
    "first_name", "second_name", "position", "team_name",
    "now_cost", "total_points", "value_score"
]].copy()

output["now_cost"] = output["now_cost"] / 10  # Convert cost to millions
output = output.rename(columns={
    "first_name": "First",
    "second_name": "Last",
    "position": "Pos",
    "team_name": "Club",
    "now_cost": "£M",
    "total_points": "Pts",
    "value_score": "Pts/£"
})

print("\n⚽️ Best Value FPL Team\n")
print(output.to_string(index=False))
print(f"\n💸 Total Cost: £{budget_used / 10:.1f}M")
print(f"📈 Total Points: {team_df['total_points'].sum()}")
