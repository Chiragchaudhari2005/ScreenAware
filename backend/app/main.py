# backend_app.py
import os
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware  

# -------------------------------
# Paths
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# -------------------------------
# Load Models & Artifacts
# -------------------------------
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
    allow_origins=["http://localhost:5173"],  # your React URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

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
    df = pd.DataFrame([user.dict()])
    # Risk
    X_risk = scaler_clf.transform(df[clf_features])
    risk_pred = clf_model.predict(X_risk)[0]
    # Mood
    df_mood = df.copy()
    df_mood["screen_sleep_ratio"] = df_mood["daily_screen_time_hours"] / (df_mood["sleep_duration_hours"] + 1)
    df_mood["stress_x_sleep"] = df_mood["stress_level"] * df_mood["sleep_quality"]
    df_mood["activity_balance"] = df_mood["physical_activity_hours_per_week"] / (df_mood["daily_screen_time_hours"] + 1)
    X_mood = scaler_reg.transform(df_mood[reg_features])
    mood_pred = reg_model.predict(X_mood)[0]
    # Cluster
    X_cluster = scaler_cluster.transform(df[cluster_features])
    cluster_pred = cluster_model.predict(X_cluster)[0]
    return {
        "risk_level": risk_pred,
        "mood_rating": round(float(mood_pred), 2),
        "cluster_label": int(cluster_pred)
    }

@app.post("/predict_risk")
def predict_risk(user: UserInput):
    df = pd.DataFrame([user.dict()])
    X = scaler_clf.transform(df[clf_features])
    pred = clf_model.predict(X)[0]
    return {"risk_level": pred}


@app.post("/predict_mood")
def predict_mood(user: UserInput):
    df = pd.DataFrame([user.dict()])

    # feature engineering
    df["screen_sleep_ratio"] = df["daily_screen_time_hours"] / (df["sleep_duration_hours"] + 1)
    df["stress_x_sleep"] = df["stress_level"] * df["sleep_quality"]
    df["activity_balance"] = df["physical_activity_hours_per_week"] / (df["daily_screen_time_hours"] + 1)

    X = scaler_reg.transform(df[reg_features])
    pred = reg_model.predict(X)[0]
    return {"mood_rating": round(float(pred), 2)}


@app.post("/predict_cluster")
def predict_cluster(user: UserInput):
    df = pd.DataFrame([user.dict()])
    X = scaler_cluster.transform(df[cluster_features])
    pred = cluster_model.predict(X)[0]
    return {"cluster_label": int(pred)}

# -------------------------------
# Run command:
# uvicorn backend.app.backend_app:app --reload
# -------------------------------
