from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGO_URI)
db = client.screenaware_db

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        # Pydantic v2 custom schema for ObjectId
        json_schema = handler(core_schema)
        json_schema.update(type="string", examples=["507f1f77bcf86cd799439011"])
        return json_schema

class UserDataPoint(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    timestamp: datetime = Field(default_factory=datetime.now)
    daily_screen_time_hours: float
    sleep_duration_hours: float
    stress_level: float
    sleep_quality: float
    physical_activity_hours_per_week: float
    social_media_hours: float
    gaming_hours: float
    entertainment_hours: float
    work_related_hours: float
    risk_level: str
    mood_rating: float
    cluster_label: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserDataResponse(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    timestamp: datetime
    daily_screen_time_hours: float
    sleep_duration_hours: float
    stress_level: float
    sleep_quality: float
    physical_activity_hours_per_week: float
    social_media_hours: float
    gaming_hours: float
    entertainment_hours: float
    work_related_hours: float
    risk_level: str
    mood_rating: float
    cluster_label: str

    class Config:
        allow_population_by_field_name = True

class AnalyticsOverview(BaseModel):
    average_screen_time: float
    average_mood: float
    average_sleep: float
    risk_level_distribution: dict
    most_common_cluster: str
    screen_time_trend: List[dict]
    category_distribution: dict

class DetailedAnalytics(BaseModel):
    daily_data: List[UserDataResponse]
    weekly_averages: List[dict]
    monthly_averages: List[dict]