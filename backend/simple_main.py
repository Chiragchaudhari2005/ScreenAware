from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    daily_screen_time_hours: float
    sleep_duration_hours: float
    stress_level: float
    sleep_quality: float
    physical_activity_hours_per_week: float
    social_media_hours: float
    gaming_hours: float
    entertainment_hours: float
    work_related_hours: float

@app.get("/")
def read_root():
    return {"message": "ScreenAware Simple Backend", "status": "running", "type": "rule-based"}

@app.post("/predict_report")
def predict_report(user: UserInput):
    print(f"Received data: {user}")
    
    screen_time = user.daily_screen_time_hours
    
    # Calculate risk level (0-100 scale)
    if screen_time < 4:
        risk_level = 25
    elif screen_time < 7:
        risk_level = 55
    else:
        risk_level = 85
    
    # Calculate mood rating (1-5 scale)
    mood_rating = ((6 - user.stress_level) + user.sleep_quality) / 2
    mood_rating = round(min(5, max(1, mood_rating)), 1)
    
    # Determine cluster based on usage patterns
    if screen_time > 8 and user.stress_level > 3:
        cluster_label = "High Usage + High Stress"
    elif screen_time < 4 and user.physical_activity_hours_per_week > 5:
        cluster_label = "Balanced Lifestyle"
    elif user.social_media_hours > screen_time * 0.5:
        cluster_label = "Social Media Heavy"
    elif user.gaming_hours > screen_time * 0.5:
        cluster_label = "Gaming Focused"
    else:
        cluster_label = "Moderate Usage"
    
    response = {
        "risk_level": risk_level,
        "mood_rating": mood_rating,
        "cluster_label": cluster_label
    }
    
    print(f"Sending response: {response}")
    return response