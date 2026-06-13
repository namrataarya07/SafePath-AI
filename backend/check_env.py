import os
from dotenv import load_dotenv

print("=== Checking .env file ===")

# Try different paths to load .env
candidates = [
    ".env",
    os.path.join(os.path.dirname(__file__), ".env"),
    os.path.join(os.getcwd(), ".env")
]

env_loaded = False
for candidate in candidates:
    if os.path.exists(candidate):
        print(f"Loading env file from: {candidate}")
        load_dotenv(candidate)
        env_loaded = True
        break
if not env_loaded:
    print("WARNING: Could not find .env file!")

gemini_key = os.getenv("GEMINI_API_KEY")

print(f"\nGEMINI_API_KEY: {'FOUND (len ' + str(len(gemini_key)) + ')' if gemini_key else 'NOT FOUND!'}")
if gemini_key:
    print(f"First 10 chars: {gemini_key[:10]}...")
