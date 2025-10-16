from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from typing import List
import pandas as pd
from ..models.user_data import (
    UserDataPoint,
    UserDataResponse,
    AnalyticsOverview,
    DetailedAnalytics,
    db
)

router = APIRouter()

@router.post("/user-data", response_model=UserDataResponse)
async def store_user_data(data: UserDataPoint):
    import traceback
    try:
        user_data = data.dict(by_alias=True)
        result = db.user_data.insert_one(user_data)
        stored_data = db.user_data.find_one({"_id": result.inserted_id})
        if stored_data and "_id" in stored_data:
            stored_data["_id"] = str(stored_data["_id"])
        return UserDataResponse(**stored_data)
    except Exception as e:
        print("Error in /api/user-data:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/overview/{user_id}", response_model=AnalyticsOverview)
async def get_user_analytics_overview(user_id: str):
    try:
        # Get last 30 days of data
        thirty_days_ago = datetime.now() - timedelta(days=30)
        cursor = db.user_data.find({
            "user_id": user_id,
            "timestamp": {"$gte": thirty_days_ago}
        }).sort("timestamp", -1)
        
        data = list(cursor)
        if not data:
            raise HTTPException(status_code=404, detail="No data found for user")
        
        # Convert _id to string for all documents
        for d in data:
            if "_id" in d:
                d["_id"] = str(d["_id"])
        df = pd.DataFrame(data)

        # Calculate analytics
        overview = {
            "average_screen_time": df["daily_screen_time_hours"].mean(),
            "average_mood": df["mood_rating"].mean(),
            "average_sleep": df["sleep_duration_hours"].mean(),
            "risk_level_distribution": df["risk_level"].value_counts().to_dict(),
            "most_common_cluster": df["cluster_label"].mode()[0],
            "screen_time_trend": df[["timestamp", "daily_screen_time_hours"]]
                .sort_values("timestamp")
                .tail(7)
                .to_dict("records"),
            "category_distribution": {
                "social_media": df["social_media_hours"].mean(),
                "gaming": df["gaming_hours"].mean(),
                "entertainment": df["entertainment_hours"].mean(),
                "work": df["work_related_hours"].mean()
            }
        }

        return AnalyticsOverview(**overview)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/detailed/{user_id}", response_model=DetailedAnalytics)
async def get_detailed_analytics(user_id: str):
    try:
        # Get last 30 days of data
        thirty_days_ago = datetime.now() - timedelta(days=30)
        cursor = db.user_data.find({
            "user_id": user_id,
            "timestamp": {"$gte": thirty_days_ago}
        }).sort("timestamp", -1)
        
        data = list(cursor)
        if not data:
            raise HTTPException(status_code=404, detail="No data found for user")
        
        # Convert _id to string for all documents
        for d in data:
            if "_id" in d:
                d["_id"] = str(d["_id"])
        df = pd.DataFrame(data)

        # Daily data
        daily_data = [UserDataResponse(**d) for d in data]

        # Weekly averages
        df["week"] = df["timestamp"].dt.isocalendar().week
        weekly_avg = df.groupby("week").agg({
            "daily_screen_time_hours": "mean",
            "mood_rating": "mean",
            "sleep_duration_hours": "mean"
        }).reset_index().to_dict("records")

        # Monthly averages
        df["month"] = df["timestamp"].dt.month
        monthly_avg = df.groupby("month").agg({
            "daily_screen_time_hours": "mean",
            "mood_rating": "mean",
            "sleep_duration_hours": "mean"
        }).reset_index().to_dict("records")

        return DetailedAnalytics(
            daily_data=daily_data,
            weekly_averages=weekly_avg,
            monthly_averages=monthly_avg
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user-data/{user_id}/latest", response_model=UserDataResponse)
async def get_latest_user_data(user_id: str):
    try:
        data = db.user_data.find_one(
            {"user_id": user_id},
            sort=[("timestamp", -1)]
        )
        if not data:
            raise HTTPException(status_code=404, detail="No data found for user")
        return UserDataResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))