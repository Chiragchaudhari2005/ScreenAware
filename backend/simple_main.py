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

@app.get("/api/analytics/overview/{user_id}")
def get_analytics_overview(user_id: str):
    """Get analytics overview for a user"""
    # Mock data - replace with actual database queries
    return {
        "totalScreenTime": 32.5,
        "averageDaily": 4.6,
        "weeklyTrend": "+12%",
        "riskLevel": "Medium",
        "moodTrend": 3.2,
        "activeGoals": 2,
        "streakDays": 5
    }

@app.get("/api/analytics/detailed/{user_id}")
def get_analytics_detailed(user_id: str):
    """Get detailed analytics for a user"""
    # Mock data - replace with actual database queries
    return {
        "weeklyData": [
            {"day": "Mon", "screenTime": 4.5, "mood": 3, "sleep": 7},
            {"day": "Tue", "screenTime": 5.2, "mood": 2, "sleep": 6.5},
            {"day": "Wed", "screenTime": 3.8, "mood": 4, "sleep": 8},
            {"day": "Thu", "screenTime": 6.1, "mood": 2, "sleep": 6},
            {"day": "Fri", "screenTime": 4.2, "mood": 4, "sleep": 7.5},
            {"day": "Sat", "screenTime": 7.0, "mood": 3, "sleep": 8},
            {"day": "Sun", "screenTime": 3.5, "mood": 5, "sleep": 9}
        ],
        "categoryBreakdown": {
            "social_media": 2.1,
            "gaming": 1.5,
            "entertainment": 1.8,
            "work": 0.8
        },
        "insights": [
            "Your screen time increased by 15% this week",
            "Best mood was on Sunday with 9 hours of sleep",
            "Social media usage is your dominant category"
        ]
    }

@app.post("/api/user-data")
def store_user_data(data: dict):
    """Store user data - currently just returns success"""
    print(f"Storing user data: {data}")
    return {"status": "success", "message": "Data stored successfully"}