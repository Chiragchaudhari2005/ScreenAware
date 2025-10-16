import os
import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware  
import traceback

# -------------------------------
# Paths
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# -------------------------------
# Mood scaling function (SAME AS TRAINING)
# -------------------------------
def map_to_1_5_scale(pred, min_pred, max_pred):
    if max_pred == min_pred:
        return 3
    scaled = 1 + (pred - min_pred) * 4 / (max_pred - min_pred)
    return int(round(np.clip(scaled, 1, 5)))

# -------------------------------
# Load Models & Artifacts
# -------------------------------
try:
    clf_model = joblib.load(os.path.join(MODEL_DIR, "risk_model.pkl"))
    scaler_clf = joblib.load(os.path.join(MODEL_DIR, "scaler_clf.pkl"))

    reg_model = joblib.load(os.path.join(MODEL_DIR, "mood_model.pkl"))
    scaler_reg = joblib.load(os.path.join(MODEL_DIR, "scaler_reg.pkl"))

    cluster_model = joblib.load(os.path.join(MODEL_DIR, "cluster_model.pkl"))
    scaler_cluster = joblib.load(os.path.join(MODEL_DIR, "scaler_cluster.pkl"))

    artifacts = joblib.load(os.path.join(MODEL_DIR, "artifacts.pkl"))
    clf_features = artifacts["clf_features"]
    reg_features = artifacts["reg_features"]
    cluster_features = artifacts["cluster_features"]
    
    # Load label encoder
    le = joblib.load(os.path.join(MODEL_DIR, "label_encoder_clf.pkl"))
    
    # 🔥 FIX: Use fallback values if mood ranges don't exist
    MOOD_MIN_RANGE = artifacts.get("mood_min_range", 1.65)  # From your training output
    MOOD_MAX_RANGE = artifacts.get("mood_max_range", 9.005) # From your training output
    
    print(f"✅ Loaded mood range: {MOOD_MIN_RANGE:.4f} to {MOOD_MAX_RANGE:.4f}")
    
except FileNotFoundError as e:
    print("-" * 50)
    print(f"FATAL STARTUP ERROR: Failed to load model file: {e}")
    print("Please ensure the 'models' directory exists and contains all required .pkl files.")
    print("-" * 50)
    raise
except KeyError as e:
    print("-" * 50)
    print(f"WARNING: Missing key in artifacts: {e}")
    print("Using fallback mood range values.")
    print("Please retrain your models with the updated training script.")
    print("-" * 50)
    # Fallback values based on your training output
    MOOD_MIN_RANGE = 1.65
    MOOD_MAX_RANGE = 9.005

# -------------------------------
# FastAPI Setup
# -------------------------------
app = FastAPI(
    title="Digital Wellness ML API",
    description="API for predicting risk level, mood rating, and addiction clusters",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "mood_range": f"{MOOD_MIN_RANGE:.4f} to {MOOD_MAX_RANGE:.4f}"}

@app.post("/send-data")
def send_data(data: dict):
    return {"received": data}

# -------------------------------
# User Input Schema
# -------------------------------
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

# -------------------------------
# Endpoints
# -------------------------------

@app.post("/predict_report")
def predict_report(user: UserInput):
    print(f"\n🔍 PREDICT_REPORT - Received user input:")
    print(f"   Screen Time: {user.daily_screen_time_hours}h")
    print(f"   Sleep: {user.sleep_duration_hours}h")
    print(f"   Stress: {user.stress_level}/10")
    print(f"   Sleep Quality: {user.sleep_quality}/10")
    print(f"   Physical Activity: {user.physical_activity_hours_per_week}h/week")
    
    df = pd.DataFrame([user.dict()])
    
    # Load artifacts
    artifacts = joblib.load(os.path.join(MODEL_DIR, "artifacts.pkl"))
    cluster_name_map = artifacts["cluster_name_map"]
    
    # Risk Prediction
    X_risk = scaler_clf.transform(df[clf_features])
    risk_pred_encoded = clf_model.predict(X_risk)[0]
    risk_pred_label = le.inverse_transform([risk_pred_encoded])[0]
    print(f"✅ RISK PREDICTION: Encoded={risk_pred_encoded}, Label='{risk_pred_label}'")
    
    # Mood Prediction with PROPER scaling
    df_mood = df.copy()
    df_mood["screen_sleep_ratio"] = df_mood["daily_screen_time_hours"] / (df_mood["sleep_duration_hours"] + 1)
    df_mood["stress_x_sleep"] = df_mood["stress_level"] * df_mood["sleep_quality"]
    df_mood["activity_balance"] = df_mood["physical_activity_hours_per_week"] / (df_mood["daily_screen_time_hours"] + 1)
    
    X_mood = scaler_reg.transform(df_mood[reg_features])
    mood_pred_raw = reg_model.predict(X_mood)[0]
    
    # Use the mood range values
    mood_mapped = map_to_1_5_scale(mood_pred_raw, MOOD_MIN_RANGE, MOOD_MAX_RANGE)
    
    print(f"🎯 MOOD PREDICTION:")
    print(f"   Raw Prediction: {mood_pred_raw:.4f}")
    print(f"   Mapped to 1-5 Scale: {mood_mapped}")
    
    # Cluster Prediction
    X_cluster = scaler_cluster.transform(df[cluster_features])
    cluster_pred = cluster_model.predict(X_cluster)[0]
    cluster_name = cluster_name_map.get(cluster_pred, "Unknown")
    print(f"📊 CLUSTER PREDICTION: ID={cluster_pred}, Name='{cluster_name}'")
    
    # Determine dominant category
    screen_categories = {
        "social_media_hours": "Social Media",
        "gaming_hours": "Gaming", 
        "entertainment_hours": "Entertainment",
        "work_related_hours": "Work"
    }
    dominant_category = max(screen_categories.keys(), 
                           key=lambda x: user.dict()[x])
    
    print(f"📦 FINAL RESPONSE:")
    print(f"   Risk Level: {risk_pred_label}")
    print(f"   Mood Rating: {mood_mapped}/5")
    print(f"   Cluster Label: {cluster_name}")
    print(f"   Dominant Category: {screen_categories[dominant_category]}")
    print("-" * 50)
    
    return {
        "risk_level": risk_pred_label,
        "mood_rating": mood_mapped,
        "cluster_label": cluster_name,
        "dominant_category": screen_categories[dominant_category]
    }

@app.post("/predict_risk")
def predict_risk(user: UserInput):
    df = pd.DataFrame([user.dict()])
    X = scaler_clf.transform(df[clf_features])
    pred_encoded = clf_model.predict(X)[0]
    pred_label = le.inverse_transform([pred_encoded])[0]
    return {"risk_level": pred_label}

@app.post("/predict_mood")
def predict_mood(user: UserInput):
    df = pd.DataFrame([user.dict()])

    # feature engineering
    df["screen_sleep_ratio"] = df["daily_screen_time_hours"] / (df["sleep_duration_hours"] + 1)
    df["stress_x_sleep"] = df["stress_level"] * df["sleep_quality"]
    df["activity_balance"] = df["physical_activity_hours_per_week"] / (df["daily_screen_time_hours"] + 1)

    X = scaler_reg.transform(df[reg_features])
    pred_raw = reg_model.predict(X)[0]
    
    mood_mapped = map_to_1_5_scale(pred_raw, MOOD_MIN_RANGE, MOOD_MAX_RANGE)
    
    return {"mood_rating": mood_mapped}

@app.post("/predict_cluster")
def predict_cluster(user: UserInput):
    df = pd.DataFrame([user.dict()])
    X = scaler_cluster.transform(df[cluster_features])
    cluster_pred = cluster_model.predict(X)[0]
    
    artifacts = joblib.load(os.path.join(MODEL_DIR, "artifacts.pkl"))
    cluster_name_map = artifacts["cluster_name_map"]
    cluster_name = cluster_name_map.get(cluster_pred, "Unknown")
    
    return {"cluster_label": cluster_name}

# -------------------------------
# Run command:
# uvicorn backend.app.main:app --reload
# -------------------------------