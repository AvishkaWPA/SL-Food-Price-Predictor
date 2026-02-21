## Backend Implementation Details

### Structure
The backend is organized for clarity and modularity:

- `app.py`: Main FastAPI application, handles API endpoints and loads model/encoders.
- `train_model.py`: Script for training the regression model and saving encoders.
- `models/`: Stores trained model and encoder files.
- `data/`: Contains the historical food price dataset.
- `utils/feature_engineering.py`: Feature engineering and preprocessing utilities.
- `schemas/request_schema.py`: Pydantic schema for request validation.

### API Endpoints
- `POST /predict`: Receives commodity, district, month, year. Returns predicted price, feature importance, price trend, SHAP values.
- `GET /commodities`: Returns available commodities from the dataset.
- `GET /districts`: Returns available districts from the dataset.

### Model Training
1. Loads data from `data/wfp_food_prices_lka.csv`.
2. Extracts features: commodity, district (admin2), month, year.
3. Encodes categorical features using `LabelEncoder`.
4. Splits data by time (first 80% for training, last 20% for testing).
5. Trains a `HistGradientBoostingRegressor` model.
6. Saves model and encoders to `models/` using `joblib`.
7. Evaluates model performance (prints test MSE).
8. Computes SHAP values for explainability.

### Data Processing
- Input is validated using Pydantic schemas.
- Features are encoded using saved encoders.
- For prediction, input is transformed to match training features.
- Price trend is generated from historical data for the selected commodity and district.

### Explainability
- SHAP values are computed for each prediction.
- Feature importance is returned as a dictionary and visualized in the frontend.
- SHAP base value and per-feature values are included in the response.

### Error Handling
- All endpoints use try/except blocks to catch and return errors as HTTP 400 responses.
- CORS is enabled for frontend communication.
- If model or encoders are missing, or input is invalid, clear error messages are returned.

### Best Practices
- Modular code structure for maintainability.
- Separation of training and API scripts.
- Use of Pydantic for validation and FastAPI for rapid API development.
- Model loading on startup for fast inference.

---

# Sri Lanka Food Price Prediction System

## Overview
This project is a full-stack web application that predicts the expected monthly price of a selected food commodity in a selected Sri Lankan district and month using a trained machine learning regression model. It provides interactive visualizations and explainability features for users.

---

## How It Works

### 1. Data Flow
- **User selects:** commodity, district, month, year in the frontend dashboard.
- **Frontend (React):** Sends a POST request to the backend API (`/predict`).
- **Backend (FastAPI):**
  - Receives the request.
  - Preprocesses the input using label encoders.
  - Predicts price using a trained regression model.
  - Computes SHAP values for feature importance.
  - Returns predicted price, feature importance, price trend, and SHAP summary.
- **Frontend:** Displays the predicted price, feature importance (bar chart), price trend (line chart), and SHAP summary.

---

### 2. Algorithms Used

#### Backend
- **HistGradientBoostingRegressor** (from scikit-learn):
  - A tree-based ensemble regression algorithm.
  - Handles missing values, categorical features, and is robust for tabular data.
  - Trained on historical food price data with a time-based train/test split.
- **LabelEncoder:**
  - Encodes categorical features (commodity, district) into numeric values for model input.
- **SHAP (SHapley Additive exPlanations):**
  - Provides feature importance and explainability for model predictions.
  - Shows how each input feature contributed to the predicted price.

#### Frontend
- **React (Vite):**
  - Modular, component-based UI.
  - Uses Axios for API calls.
  - Uses Recharts for interactive visualizations.
  - Tailwind CSS for modern, responsive styling.

---

### 3. API Endpoints
- `POST /predict`: Predicts price for given commodity, district, month, year.
- `GET /commodities`: Returns available commodities.
- `GET /districts`: Returns available districts.

---

### 4. Model Training
- Data is loaded from `backend/data/wfp_food_prices_lka.csv`.
- Features: commodity, district (admin2), month, year.
- Target: price.
- Model is trained using a time-based split (first 80% for training, last 20% for testing).
- Model and encoders are saved in `backend/models/`.

---

### 5. Explainability
- SHAP values are computed for each prediction.
- Feature importance is shown as a bar chart in the dashboard.
- Price trend chart shows historical prices for the selected commodity and district.

---

### 6. Limitations
- Model predicts future values by extrapolating past trends.
- Accuracy decreases for dates far beyond the training data.
- Does not account for external factors (policy, climate, etc.) not present in the dataset.

---

## Setup Instructions

### Backend
1. Create and activate a Python virtual environment:
   ```
   python -m venv venv
   venv\Scripts\activate
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Train the model:
   ```
   python train_model.py
   ```
4. Start the API server:
   ```
   uvicorn app:app --reload
   ```

### Frontend
1. Go to the frontend folder:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend:
   ```
   npm run dev
   ```

---

## Usage
- Open http://localhost:5173/ in your browser.
- Select commodity, district, month, year, and click Predict.
- View predicted price, feature importance, price trend, and SHAP summary.

---

## Project Structure
```
food-price-predictor/
├── backend/
│   ├── app.py
│   ├── train_model.py
│   ├── requirements.txt
│   ├── data/
│   │   └── wfp_food_prices_lka.csv
│   ├── models/
│   │   ├── price_model.pkl
│   │   ├── feature_encoder.pkl
│   │   └── target_encoder.pkl
│   ├── utils/
│   │   └── feature_engineering.py
│   └── schemas/
│       └── request_schema.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
├── README.md
└── demo-video.mp4
```

---

## Author
- [Your Name]

## License
MIT
