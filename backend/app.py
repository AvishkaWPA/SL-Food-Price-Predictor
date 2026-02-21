from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas.request_schema import PredictRequest
from pydantic import BaseModel
import joblib
import numpy as np
import shap
import os
from utils.feature_engineering import preprocess_input

MODEL_PATH = os.path.join('models', 'price_model.pkl')
FEATURE_ENCODER_PATH = os.path.join('models', 'feature_encoder.pkl')
TARGET_ENCODER_PATH = os.path.join('models', 'target_encoder.pkl')
DATA_PATH = os.path.join('data', 'wfp_food_prices_lka.csv')

app = FastAPI(title="Sri Lanka Food Price Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load(MODEL_PATH)
feature_encoder = joblib.load(FEATURE_ENCODER_PATH)
target_encoder = joblib.load(TARGET_ENCODER_PATH)

import pandas as pd
try:
    df = pd.read_csv(DATA_PATH)
    COMMODITIES = sorted(df['commodity'].dropna().unique().tolist())
    DISTRICTS = sorted(df['admin2'].dropna().unique().tolist())
except Exception:
    COMMODITIES = []
    DISTRICTS = []



class PredictResponse(BaseModel):
    predicted_price: float
    feature_importance: dict
    price_trend: list
    shap_values: list
    shap_base_value: float

@app.get("/commodities")
def get_commodities():
    return {"commodities": COMMODITIES}

@app.get("/districts")
def get_districts():
    return {"districts": DISTRICTS}

@app.post("/predict", response_model=PredictResponse)
def predict_price(request: PredictRequest):
    try:
        # Preprocess input
        X, trend = preprocess_input(request, feature_encoder, df)
        # Predict
        pred = model.predict(X)[0]
        # SHAP explainability
        explainer = shap.Explainer(model)
        shap_values = explainer(X)
        feature_importance = dict(zip(X.columns, shap_values.values[0]))
        return PredictResponse(
            predicted_price=float(pred),
            feature_importance=feature_importance,
            price_trend=trend,
            shap_values=shap_values.values[0].tolist(),
            shap_base_value=float(shap_values.base_values[0])
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
