from flask import Flask, jsonify, request
import json
import pandas as pd
from collections import defaultdict
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

def load_player_data():
    """Load and format player data"""
    with open("../data/player_data.json") as f:
        data = json.load(f)

    players = data["elements"]
    teams = data["teams"]
    positions = data["element_types"]

    df = pd.DataFrame(players)
    
    team_map = {team["id"]: team["name"] for team in teams}
    position_map = {pos["id"]: pos["singular_name_short"] for pos in positions}

    df["team_name"] = df["team"].map(team_map)
    df["position"] = df["element_type"].map(position_map)
    # FPL stores prices in tenths of £M (e.g., 55 = £5.5M)
    # Keep the original format for display

    return df, teams

def get_team_badge_url(team_name):
    """Get team badge URL from team name"""
    team_badges = {
        'Arsenal': 'https://resources.premierleague.com/premierleague/badges/t3.png',
        'Aston Villa': 'https://resources.premierleague.com/premierleague/badges/t7.png',
        'Bournemouth': 'https://resources.premierleague.com/premierleague/badges/t91.png',
        'Brentford': 'https://resources.premierleague.com/premierleague/badges/t94.png',
        'Brighton': 'https://resources.premierleague.com/premierleague/badges/t36.png',
        'Burnley': 'https://resources.premierleague.com/premierleague/badges/t90.png',
        'Chelsea': 'https://resources.premierleague.com/premierleague/badges/t8.png',
        'Crystal Palace': 'https://resources.premierleague.com/premierleague/badges/t31.png',
        'Everton': 'https://resources.premierleague.com/premierleague/badges/t11.png',
        'Fulham': 'https://resources.premierleague.com/premierleague/badges/t54.png',
        'Liverpool': 'https://resources.premierleague.com/premierleague/badges/t14.png',
        'Luton': 'https://resources.premierleague.com/premierleague/badges/t102.png',
        'Manchester City': 'https://resources.premierleague.com/premierleague/badges/t43.png',
        'Manchester United': 'https://resources.premierleague.com/premierleague/badges/t1.png',
        'Newcastle': 'https://resources.premierleague.com/premierleague/badges/t4.png',
        'Nottingham Forest': 'https://resources.premierleague.com/premierleague/badges/t17.png',
        'Sheffield United': 'https://resources.premierleague.com/premierleague/badges/t49.png',
        'Tottenham': 'https://resources.premierleague.com/premierleague/badges/t6.png',
        'West Ham': 'https://resources.premierleague.com/premierleague/badges/t21.png',
        'Wolves': 'https://resources.premierleague.com/premierleague/badges/t39.png'
    }
    return team_badges.get(team_name, 'https://resources.premierleague.com/premierleague/badges/t3.png')

def get_player_photo_url(player_id):
    """Get player photo URL from player ID"""
    # Try the official FPL photo URL, but it may be restricted
    # For now, we'll use a placeholder approach
    return f"https://resources.premierleague.com/premierleague/photos/players/110x140/p{player_id}.png"

def calculate_player_form(player_data):
    """Calculate player form based on recent performance"""
    # Mock form calculation based on total points and cost
    base_form = player_data.get('total_points', 0) / max(player_data.get('now_cost', 1), 1)
    recent_form = base_form * random.uniform(0.8, 1.2)  # Add some variation
    return round(recent_form, 1)

def generate_fixtures(team_name):
    """Generate upcoming fixtures for a team"""
    teams = ['Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton', 
             'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 
             'Liverpool', 'Luton', 'Manchester City', 'Manchester United', 
             'Newcastle', 'Nottingham Forest', 'Sheffield United', 'Tottenham', 
             'West Ham', 'Wolves']
    
    fixtures = []
    for i in range(5):  # Next 5 fixtures
        opponent = random.choice([t for t in teams if t != team_name])
        difficulty = random.choice(['H', 'A'])  # Home or Away
        fixture_difficulty = random.randint(1, 5)  # 1=easy, 5=hard
        fixtures.append({
            'opponent': opponent,
            'home_away': difficulty,
            'difficulty': fixture_difficulty,
            'week': i + 1
        })
    return fixtures

def select_best_team(budget: float = 1000):
    df, teams = load_player_data()
    
    TOTAL_BUDGET = budget  # Use provided budget (in tenths of £M)
    POSITION_LIMITS = {1: 2, 2: 5, 3: 5, 4: 3}
    TEAM_LIMIT = 3

    df["value_score"] = df["total_points"] / df["now_cost"]
    df_sorted = df.sort_values(by="value_score", ascending=False)

    team = []
    budget_used = 0
    position_count = defaultdict(int)
    club_count = defaultdict(int)

    for _, player in df_sorted.iterrows():
        cost = player["now_cost"]  # Keep in tenths format
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

    team_df = pd.DataFrame(team)
    team_df["now_cost"] = team_df["now_cost"] / 10
    output = team_df[[
        "first_name", "second_name", "position", "team_name",
        "now_cost", "total_points", "id"
    ]].rename(columns={
        "first_name": "firstName",
        "second_name": "secondName",
        "position": "position",
        "team_name": "club",
        "now_cost": "cost",
        "total_points": "points",
        "id": "playerId"
    })

    return output.to_dict(orient="records")

@app.route("/api/best-team")
def best_team():
    budget = float(request.args.get('budget', 100)) * 10  # Convert £M to tenths
    team = select_best_team(budget)
    return jsonify(team)

@app.route("/api/all-players")
def all_players():
    """Get all players for search functionality with enhanced data"""
    df, teams = load_player_data()
    
    # Add enhanced player data
    players_data = []
    for _, player in df.iterrows():
        player_dict = {
            "firstName": player["first_name"],
            "secondName": player["second_name"],
            "position": player["position"],
            "club": player["team_name"],
            "cost": player["now_cost"] / 10,  # Convert from tenths to £M
            "points": player["total_points"],
            "playerId": player["id"],
            "photo": get_player_photo_url(player["id"]),
            "teamBadge": get_team_badge_url(player["team_name"]),
            "form": calculate_player_form(player),
            "ownership": random.uniform(1, 60),
            "fixtures": generate_fixtures(player["team_name"]),
            "selected_by_percent": player.get("selected_by_percent", random.uniform(1, 60)),
            "transfers_in_event": player.get("transfers_in_event", random.randint(-1000, 1000)),
            "transfers_out_event": player.get("transfers_out_event", random.randint(-1000, 1000)),
            "goals_scored": player.get("goals_scored", 0),
            "assists": player.get("assists", 0),
            "clean_sheets": player.get("clean_sheets", 0),
            "goals_conceded": player.get("goals_conceded", 0),
            "own_goals": player.get("own_goals", 0),
            "penalties_saved": player.get("penalties_saved", 0),
            "penalties_missed": player.get("penalties_missed", 0),
            "yellow_cards": player.get("yellow_cards", 0),
            "red_cards": player.get("red_cards", 0),
            "saves": player.get("saves", 0),
            "bonus": player.get("bonus", 0),
            "bps": player.get("bps", 0),
            "influence": player.get("influence", 0),
            "creativity": player.get("creativity", 0),
            "threat": player.get("threat", 0),
            "ict_index": player.get("ict_index", 0)
        }
        players_data.append(player_dict)

    return jsonify(players_data)

@app.route("/api/player/<int:player_id>")
def player_details(player_id):
    """Get detailed player information"""
    df, teams = load_player_data()
    player = df[df["id"] == player_id].iloc[0] if len(df[df["id"] == player_id]) > 0 else None
    
    if player is None:
        return jsonify({"error": "Player not found"}), 404
    
    player_data = {
        "firstName": player["first_name"],
        "secondName": player["second_name"],
        "position": player["position"],
        "club": player["team_name"],
        "cost": float(player["now_cost"]) / 10,  # Convert from tenths to £M
        "points": int(player["total_points"]),
        "playerId": int(player["id"]),
        "photo": get_player_photo_url(player["id"]),
        "teamBadge": get_team_badge_url(player["team_name"]),
        "form": calculate_player_form(player),
        "ownership": random.uniform(1, 60),
        "fixtures": generate_fixtures(player["team_name"]),
        "selected_by_percent": player.get("selected_by_percent", random.uniform(1, 60)),
        "transfers_in_event": int(player.get("transfers_in_event", random.randint(-1000, 1000))),
        "transfers_out_event": int(player.get("transfers_out_event", random.randint(-1000, 1000))),
        "goals_scored": int(player.get("goals_scored", 0)),
        "assists": int(player.get("assists", 0)),
        "clean_sheets": int(player.get("clean_sheets", 0)),
        "goals_conceded": int(player.get("goals_conceded", 0)),
        "own_goals": int(player.get("own_goals", 0)),
        "penalties_saved": int(player.get("penalties_saved", 0)),
        "penalties_missed": int(player.get("penalties_missed", 0)),
        "yellow_cards": int(player.get("yellow_cards", 0)),
        "red_cards": int(player.get("red_cards", 0)),
        "saves": int(player.get("saves", 0)),
        "bonus": int(player.get("bonus", 0)),
        "bps": int(player.get("bps", 0)),
        "influence": float(player.get("influence", 0)),
        "creativity": float(player.get("creativity", 0)),
        "threat": float(player.get("threat", 0)),
        "ict_index": float(player.get("ict_index", 0))
    }
    
    return jsonify(player_data)

@app.route("/api/smart-team")
def smart_team():
    """Generate smart team with AI reasoning"""
    budget = float(request.args.get('budget', 100)) * 10
    strategy = request.args.get('strategy', 'balanced')  # balanced, attacking, defensive
    
    df, teams = load_player_data()
    
    # Ensure all numeric columns are properly typed
    df["total_points"] = pd.to_numeric(df["total_points"], errors='coerce').fillna(0)
    df["goals_scored"] = pd.to_numeric(df["goals_scored"], errors='coerce').fillna(0)
    df["assists"] = pd.to_numeric(df["assists"], errors='coerce').fillna(0)
    df["threat"] = pd.to_numeric(df["threat"], errors='coerce').fillna(0)
    df["clean_sheets"] = pd.to_numeric(df["clean_sheets"], errors='coerce').fillna(0)
    df["saves"] = pd.to_numeric(df["saves"], errors='coerce').fillna(0)
    df["bonus"] = pd.to_numeric(df["bonus"], errors='coerce').fillna(0)
    df["ict_index"] = pd.to_numeric(df["ict_index"], errors='coerce').fillna(0)
    
    # Apply different strategies
    if strategy == 'attacking':
        df["smart_score"] = (df["total_points"] * 0.4 + df["goals_scored"] * 0.3 + 
                            df["assists"] * 0.2 + df["threat"] * 0.1) / df["now_cost"]
    elif strategy == 'defensive':
        df["smart_score"] = (df["total_points"] * 0.4 + df["clean_sheets"] * 0.3 + 
                            df["saves"] * 0.2 + df["bonus"] * 0.1) / df["now_cost"]
    else:  # balanced
        # Calculate form for each player
        df["form"] = df.apply(calculate_player_form, axis=1)
        df["form"] = pd.to_numeric(df["form"], errors='coerce').fillna(0)
        df["smart_score"] = (df["total_points"] * 0.5 + df["ict_index"] * 0.3 + 
                            df["form"] * 0.2) / df["now_cost"]
    
    df_sorted = df.sort_values(by="smart_score", ascending=False)
    
    # Build team with reasoning
    team = []
    budget_used = 0
    position_count = defaultdict(int)
    club_count = defaultdict(int)
    reasoning = []

    for _, player in df_sorted.iterrows():
        cost = player["now_cost"]  # Keep in tenths format
        position = player["element_type"]
        club_id = player["team"]

        if (budget_used + cost > budget or
            position_count[position] >= {1: 2, 2: 5, 3: 5, 4: 3}[position] or
            club_count[club_id] >= 3):
            continue

        team.append(player)
        budget_used += cost
        position_count[position] += 1
        club_count[club_id] += 1

        # Generate reasoning
        reason = f"{player['first_name']} {player['second_name']} ({player['team_name']}) - "
        reason += f"Cost: £{player['now_cost']:.1f}M, Points: {player['total_points']}, "
        reason += f"Form: {calculate_player_form(player):.1f}, "
        reason += f"Strategy: {'High attacking potential' if strategy == 'attacking' else 'Solid defensive option' if strategy == 'defensive' else 'Balanced performer'}"

        reasoning.append(reason)

        if len(team) == 15:
            break

    team_df = pd.DataFrame(team)
    team_df["now_cost"] = team_df["now_cost"] / 10
    
    output = []
    for i, (_, player) in enumerate(team_df.iterrows()):
        player_data = {
            "firstName": player["first_name"],
            "secondName": player["second_name"],
            "position": player["position"],
            "club": player["team_name"],
            "cost": player["now_cost"],
            "points": player["total_points"],
            "playerId": player["id"],
            "photo": get_player_photo_url(player["id"]),
            "teamBadge": get_team_badge_url(player["team_name"]),
            "reasoning": reasoning[i] if i < len(reasoning) else "Selected for team balance"
        }
        output.append(player_data)

    return jsonify({
        "team": output,
        "strategy": strategy,
        "totalCost": budget_used / 10,
        "expectedPoints": sum(player["total_points"] for _, player in team_df.iterrows()),
        "reasoning": reasoning
    })

@app.route("/api/form-players")
def form_players():
    """Get players in form for the current week"""
    df, teams = load_player_data()
    
    # Calculate form based on recent performance
    df["form"] = df.apply(calculate_player_form, axis=1)
    df["form"] = pd.to_numeric(df["form"], errors='coerce').fillna(0)
    
    # Get top form players by position
    form_players = []
    for position in [1, 2, 3, 4]:  # GKP, DEF, MID, FWD
        position_players = df[df["element_type"] == position].nlargest(10, "form")
        for _, player in position_players.iterrows():
            form_players.append({
                "firstName": player["first_name"],
                "secondName": player["second_name"],
                "position": player["position"],
                "club": player["team_name"],
                "cost": player["now_cost"] / 10,
                "points": player["total_points"],
                "playerId": player["id"],
                "photo": get_player_photo_url(player["id"]),
                "teamBadge": get_team_badge_url(player["team_name"]),
                "form": player["form"],
                "ownership": random.uniform(1, 60)
            })
    
    return jsonify(form_players)

@app.route("/api/top-teams")
def top_teams():
    """Get top ranking teams from FPL community"""
    # Mock top teams based on popular FPL strategies
    top_teams = [
        {
            "name": "Template Team",
            "description": "Most popular FPL template",
            "players": [
                {"name": "Alisson", "position": "GKP", "club": "Liverpool", "cost": 5.5},
                {"name": "Trent Alexander-Arnold", "position": "DEF", "club": "Liverpool", "cost": 8.5},
                {"name": "Virgil van Dijk", "position": "DEF", "club": "Liverpool", "cost": 6.5},
                {"name": "Mohamed Salah", "position": "MID", "club": "Liverpool", "cost": 13.0},
                {"name": "Erling Haaland", "position": "FWD", "club": "Manchester City", "cost": 14.0}
            ]
        },
        {
            "name": "Differential Team",
            "description": "High-risk, high-reward differentials",
            "players": [
                {"name": "Emiliano Martínez", "position": "GKP", "club": "Aston Villa", "cost": 5.0},
                {"name": "Matty Cash", "position": "DEF", "club": "Aston Villa", "cost": 5.0},
                {"name": "Douglas Luiz", "position": "MID", "club": "Aston Villa", "cost": 5.5},
                {"name": "Ollie Watkins", "position": "FWD", "club": "Aston Villa", "cost": 8.0}
            ]
        },
        {
            "name": "Budget Team",
            "description": "Value-focused team under £90M",
            "players": [
                {"name": "Jordan Pickford", "position": "GKP", "club": "Everton", "cost": 4.5},
                {"name": "Tino Livramento", "position": "DEF", "club": "Southampton", "cost": 4.0},
                {"name": "Conor Gallagher", "position": "MID", "club": "Crystal Palace", "cost": 5.5},
                {"name": "Ivan Toney", "position": "FWD", "club": "Brentford", "cost": 7.0}
            ]
        }
    ]
    
    return jsonify(top_teams)

if __name__ == "__main__":
    app.run(debug=True, port=5001)