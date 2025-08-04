# 🏆 FPL Team Builder API

A powerful Flask-based REST API for Fantasy Premier League team building, featuring AI-powered team generation, player analytics, and comprehensive FPL data.

## 🚀 Features

- **AI-Powered Team Generation** - Smart algorithms for optimal team selection
- **Player Analytics** - Comprehensive player statistics and form analysis
- **Multiple Strategies** - Balanced, attacking, and defensive team approaches
- **Real-time Data** - Live player data and team statistics
- **CORS Enabled** - Ready for frontend integration
- **Deployment Ready** - Optimized for Render, Replit, and other platforms

## 📋 API Endpoints

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information and available endpoints |
| `/api/all-players` | GET | Get all players with detailed statistics |
| `/api/best-team` | GET | Generate optimal team based on budget |
| `/api/smart-team` | GET | AI-powered team generation with reasoning |
| `/api/player/<id>` | GET | Get detailed player information |
| `/api/form-players` | GET | Get players in good form |
| `/api/top-teams` | GET | Popular team strategies from FPL community |

### Query Parameters

#### `/api/best-team`
- `budget` (float): Team budget in £M (default: 100)

#### `/api/smart-team`
- `budget` (float): Team budget in £M (default: 100)
- `strategy` (string): Team strategy - 'balanced', 'attacking', 'defensive' (default: 'balanced')

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- pip

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/solomonake/fpl-backend.git
cd fpl-backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run the application**
```bash
python app.py
```

The API will be available at `http://localhost:5001`

## 🌐 Deployment

### Render Deployment

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure the service:**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Environment**: Python 3

### Replit Deployment

1. **Import the GitHub repository to Replit**
2. **Install dependencies** (Replit will auto-detect requirements.txt)
3. **Run the application** using the Run button

### Railway Deployment

1. **Connect your GitHub repository to Railway**
2. **Railway will auto-detect the Python app**
3. **Deploy automatically**

### Heroku Deployment

1. **Create a `Procfile`**:
```
web: python app.py
```

2. **Deploy to Heroku**:
```bash
heroku create your-app-name
git push heroku main
```

## 📊 Data Structure

### Player Object
```json
{
  "firstName": "Mohamed",
  "secondName": "Salah",
  "position": "MID",
  "club": "Liverpool",
  "cost": 13.0,
  "points": 200,
  "playerId": 1,
  "photo": "https://resources.premierleague.com/premierleague/photos/players/110x140/p1.png",
  "teamBadge": "https://resources.premierleague.com/premierleague/badges/t14.png",
  "form": 8.5,
  "ownership": 45.2,
  "fixtures": [...],
  "selected_by_percent": 45.2,
  "transfers_in_event": 1500,
  "transfers_out_event": -200,
  "goals_scored": 15,
  "assists": 10,
  "clean_sheets": 0,
  "goals_conceded": 0,
  "own_goals": 0,
  "penalties_saved": 0,
  "penalties_missed": 0,
  "yellow_cards": 2,
  "red_cards": 0,
  "saves": 0,
  "bonus": 25,
  "bps": 450,
  "influence": 85.5,
  "creativity": 78.2,
  "threat": 92.1,
  "ict_index": 85.3
}
```

### Team Response
```json
{
  "team": [...],
  "strategy": "balanced",
  "totalCost": 98.5,
  "expectedPoints": 1850,
  "reasoning": [...]
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5001 |
| `FLASK_ENV` | Flask environment | production |

### CORS Configuration

The API is configured with CORS enabled for all origins, making it ready for frontend integration.

## 📈 Performance

- **Response Time**: < 200ms for most endpoints
- **Data Size**: ~2.3MB player database
- **Concurrent Requests**: Handles multiple simultaneous requests
- **Memory Usage**: Optimized for cloud deployment

## 🧪 Testing

### Manual Testing

Test the API endpoints using curl:

```bash
# Get all players
curl https://your-api-url.herokuapp.com/api/all-players

# Generate best team
curl "https://your-api-url.herokuapp.com/api/best-team?budget=100"

# Generate smart team
curl "https://your-api-url.herokuapp.com/api/smart-team?budget=100&strategy=attacking"
```

### API Testing Tools

- **Postman**: Import the endpoints for testing
- **Insomnia**: REST client for API testing
- **curl**: Command-line testing

## 🔒 Security

- **CORS**: Configured for cross-origin requests
- **Input Validation**: All parameters are validated
- **Error Handling**: Comprehensive error responses
- **Rate Limiting**: Ready for production rate limiting

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: [Your Email]
- Documentation: [Your Docs URL]

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/solomonake/fpl-backend.git
cd fpl-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

# Test the API
curl http://localhost:5001/
```

---

**Built with ❤️ for the FPL community** 