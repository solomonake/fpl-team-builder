from flask import Flask, jsonify
from flask_cors import CORS
import json
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/players')
def get_players():
    with open("data/player_data.json", "r") as f:
        data = json.load(f)
    players = data["elements"]
    # Optionally, filter/transform fields here
    return jsonify(players)

# Load data
with open("data/player_data.json", "r") as f:
    data = json.load(f)

players = data["elements"]  # This is where player data lives
df = pd.DataFrame(players)

# See the top 10 performing players
top = df.sort_values(by="total_points", ascending=False).head(10)
print(top[["first_name", "second_name", "now_cost", "total_points", "minutes", "team", "element_type"]])

if __name__ == "__main__":
    app.run(debug=True)
