import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder

def create_features(data):
	# Extract features
	# Extract month and year from date
	data = data.copy()
	data['month'] = pd.to_datetime(data['date']).dt.month
	data['year'] = pd.to_datetime(data['date']).dt.year
	features = ['commodity', 'admin2', 'month', 'year']
	target = 'price'
	X = data[features].copy()
	y = data[target].copy()

	# Encode categorical features
	encoders = {}
	for col in ['commodity', 'admin2']:
		le = LabelEncoder()
		X[col] = le.fit_transform(X[col].astype(str))
		encoders[col] = le

	return X, y, encoders

def preprocess_input(request, feature_encoder, df=None):
	# Prepare input for prediction
	features = ['commodity', 'admin2', 'month', 'year']
	input_dict = {
		'commodity': request.commodity,
		'admin2': request.district,
		'month': request.month,
		'year': request.year
	}
	X = pd.DataFrame([input_dict])
	for col in ['commodity', 'admin2']:
		le = feature_encoder[col]
		X[col] = le.transform(X[col].astype(str))

	# Generate price trend for selected commodity and district (normalize for robust matching)
	trend = []
	if df is not None:
		commodity = input_dict['commodity'].strip().lower()
		district = input_dict['admin2'].strip().lower()
		df = df.copy()
		df['commodity_norm'] = df['commodity'].astype(str).str.strip().str.lower()
		df['admin2_norm'] = df['admin2'].astype(str).str.strip().str.lower()
		# Ensure year and month columns exist
		if 'year' not in df.columns or 'month' not in df.columns:
			df['date'] = pd.to_datetime(df['date'])
			df['year'] = df['date'].dt.year
			df['month'] = df['date'].dt.month
		trend_df = df[(df['commodity_norm'] == commodity) & (df['admin2_norm'] == district)]
		trend = trend_df[['year', 'month', 'price']].sort_values(['year', 'month']).to_dict('records')
	return X, trend
