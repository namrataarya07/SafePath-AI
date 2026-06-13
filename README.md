# 🛡️ SafePath AI

> **Google Maps tells you the fastest route. SafePath AI tells you the safest route.**

SafePath AI is an AI-powered navigation platform that helps users choose routes not only based on distance and travel time, but also on safety. By combining real-time route data, AI analysis, community intelligence, and safety scoring, SafePath AI empowers users to make smarter travel decisions.

---

# 🚀 Problem Statement

Traditional navigation applications optimize for:

* Fastest route
* Shortest distance
* Least traffic

However, they do not answer critical questions such as:

* Is this route safe at night?
* Does this area have poor lighting?
* Are there recent incidents reported nearby?
* Is there enough public activity along the route?

For students, women, late-night commuters, tourists, and solo travelers, safety is often more important than speed.

---

# 💡 Our Solution

SafePath AI introduces a new navigation paradigm:

### Fastest ≠ Safest

Instead of recommending routes solely based on ETA, SafePath AI evaluates multiple route options and generates a Safety Score using AI-driven analysis.

Users receive:

* Multiple route alternatives
* AI-generated safety explanations
* Community-reported incidents
* Safety heatmaps
* Real-time navigation assistance

---

# ✨ Key Features

## 🛣 Route Comparison Engine

Compare multiple routes based on:

* Distance
* ETA
* Safety Score
* Risk Level

Users can instantly understand tradeoffs between speed and safety.

---

## 🤖 AI Route Explanation

SafePath AI explains route decisions in human language.

Example:

> Route 1 is recommended because it has better lighting, higher foot traffic, nearby hospitals, and fewer reported incidents compared to Route 3.

This creates trust and transparency.

---

## 🟢 Safety Score System

Every route receives a score between:

```text
0 - 100
```

Factors considered:

### Positive Signals

* Street lighting
* Public activity
* Population density
* Police stations nearby
* Hospitals nearby
* Commercial zones

### Risk Signals

* Poor lighting
* Isolated roads
* Low foot traffic
* Reported incidents
* High-risk zones

---

## 🔥 Interactive Safety Heatmap

Visual safety intelligence across the city.

Color Coding:

🟢 Safe Zone

🟡 Moderate Risk

🔴 High Risk

Users can proactively avoid unsafe areas.

---

## 👥 Community Reports

Crowdsourced safety intelligence.

Users can report:

* Poor lighting
* Harassment incidents
* Road blockages
* Suspicious activities
* Unsafe locations

This creates a constantly improving safety network.

---

## 🧭 Smart Navigation

Navigation enhanced with:

* Route Safety Score
* AI Recommendations
* Incident Awareness
* Community Insights

---

## 📱 Modern UI/UX

Designed specifically for:

* Students
* Women travelers
* Solo commuters
* Tourists
* Night travelers

Features:

* Dark futuristic theme
* Neon safety indicators
* Glowing heatmaps
* Mobile-first design
* Intuitive navigation flow

---

# 🏗 System Architecture

```text
User
 │
 ▼
Frontend (React + Vite)
 │
 ▼
FastAPI Backend
 │
 ├── Google Maps APIs
 │     ├── Geocoding
 │     ├── Directions
 │     └── Places
 │
 ├── Safety Engine
 │
 ├── AI Analysis Layer
 │
 └── Community Intelligence
```

---

# ⚙️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Framer Motion
* React Router
* React Leaflet

---

## Backend

* FastAPI
* Python
* Pydantic
* Requests

---

## APIs

### Google Maps Platform

* Geocoding API
* Directions API
* Places API

### AI

* Google Gemini API

---

# 🧠 AI Layer

Gemini is used for:

* Route explanation generation
* Safety reasoning
* User-friendly insights
* Risk interpretation

Example Output:

> Route 1 is safer because it passes through well-lit commercial areas with higher public activity and fewer reported incidents.

---

# 📊 Safety Score Formula

```text
Safety Score =
(
Lighting × 0.25
+
Foot Traffic × 0.20
+
Public Infrastructure × 0.15
+
Police Presence × 0.15
+
Hospital Access × 0.10
+
Community Trust × 0.15
)
× 100
```

Penalty Factors:

```text
Crime Reports
Poor Visibility
Isolation
Unsafe Community Reports
```

---

# 🎯 Target Users

* Women commuters
* College students
* Solo travelers
* Tourists
* Night-shift employees
* Delivery personnel

---

# 🌍 Impact

SafePath AI aims to:

* Improve travel safety
* Increase route transparency
* Reduce risk during navigation
* Empower safer mobility decisions
* Build safer communities through crowdsourcing

---

# 🔮 Future Scope

### Phase 2

* Real-time crime integration
* CCTV density mapping
* Emergency SOS routing
* Live crowd density detection
* Weather-aware safety analysis

### Phase 3

* Predictive risk modeling
* Smart city integration
* Public transport safety scoring
* AI-powered anomaly detection

---

# 📸 Application Flow

```text
Home
   ↓
Route Comparison
   ↓
AI Explanation
   ↓
Route Selection
   ↓
Live Navigation
   ↓
Safety Heatmap
   ↓
Community Reports
   ↓
Profile
```

---

# 👩‍💻 Team

### Namrata 

Co-Founder & Developer

### Dikshita

Co-Founder & Developer

---

# 🏆 Built For

**AM HACKS 2.0**

Theme:
AI-Powered Smart Mobility & Safety Innovation

---

# ❤️ SafePath AI

### Because reaching faster means nothing if you don't reach safely.
