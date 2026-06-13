import os
from dotenv import load_dotenv

# Load environment variables FIRST!
print("=== SAFEPATH AI STARTUP ===")
load_dotenv()
print("Loaded .env file:")
print(f"GEMINI_API_KEY: {os.getenv('GEMINI_API_KEY')[:10] if os.getenv('GEMINI_API_KEY') else 'MISSING'}...")
print(f"OPENROUTESERVICE_API_KEY: {'LOADED' if os.getenv('OPENROUTESERVICE_API_KEY') else 'MISSING'}")

# Now import everything else!
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import engine, Base
from routes import analyze_route, explain_route, heatmap, reports, sos, geocode

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_route.router)
app.include_router(explain_route.router)
app.include_router(heatmap.router)
app.include_router(reports.router)
app.include_router(sos.router)
app.include_router(geocode.router)

@app.get("/")
def root():
    return {"message": "SafePath AI API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
