# SafePath AI
Google Maps tells you the fastest route. SafePath AI tells you the safest route.

## Tech Stack
- **Frontend**: React, Tailwind CSS, React Router, React Leaflet, Framer Motion
- **Backend**: FastAPI, Python, SQLite
- **AI**: Google Gemini
- **Maps**: Google Maps APIs + OpenStreetMap

## Features
- **Route Comparison**: Compare multiple routes with safety scores
- **AI Safety Scoring**: Dynamic safety score from 0-100 with detailed factors
- **AI Explanation**: Gemini explains why a route is safe
- **Safety Heatmap**: Visualize safe/dangerous zones
- **Community Reports**: Submit and view safety reports
- **Emergency SOS**: Quick access to emergency contacts

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- API Keys: [Google Maps API](https://console.cloud.google.com/), [Google Gemini API](https://aistudio.google.com/app/apikey)

### Backend Setup
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your API keys

# 4. Start the backend server
python main.py
```

### Frontend Setup
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

## Usage
1. Open the app at `http://localhost:3001` (or the URL shown in your terminal)
2. Enter a starting location and destination
3. Compare the safety scores of the available routes
4. View detailed AI analysis of your selected route
5. Start navigation with real-time safety alerts!

## Mock Mode
If you don't have API keys yet, SafePath AI will use realistic mock data!

## Architecture
### Backend
- `main.py`: FastAPI entry point
- `routes/`: API endpoints
- `services/`: Business logic (Google Maps, Gemini, Safety Engine)
- `models/`: Database models
- `schemas/`: Pydantic schemas
- `database/`: Database setup

### Frontend
- `src/pages/`: Main application pages
- `src/components/`: Reusable UI components
- `src/context/`: React context (app state)
- `src/main.jsx`: App entry point

## Created By
Namrata & Dikshita
