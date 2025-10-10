# backend_app.py
import os
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

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
