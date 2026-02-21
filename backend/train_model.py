import pandas as pd
import numpy as np
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import LabelEncoder
import joblib
import shap
import os
from utils.feature_engineering import create_features


# Load your dataset
data = pd.read_csv('data/wfp_food_prices_lka.csv')


# Feature engineering
X, y, encoders = create_features(data)

# Time-based train/test split
split_idx = int(len(X) * 0.8)
X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

# Model training
model = HistGradientBoostingRegressor()
model.fit(X_train, y_train)


# Save model and encoders
os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/price_model.pkl')
joblib.dump(encoders, 'models/feature_encoder.pkl')
# If you have a target encoder, save it here (for regression, usually not needed)
joblib.dump(None, 'models/target_encoder.pkl')

# Evaluate
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f"Test MSE: {mse:.2f}")

# SHAP summary
explainer = shap.Explainer(model)
shap_values = explainer(X_test)
shap.summary_plot(shap_values, X_test, show=False)
