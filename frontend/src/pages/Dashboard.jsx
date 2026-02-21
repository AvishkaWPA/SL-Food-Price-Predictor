import React, { useEffect, useState } from 'react';
import PriceForm from '../components/PriceForm';
import PredictionCard from '../components/PredictionCard';
import TrendChart from '../components/TrendChart';
import FeatureImportanceChart from '../components/FeatureImportanceChart';
import { getCommodities, getDistricts, predictPrice } from '../services/api';

const Dashboard = () => {
  const [commodities, setCommodities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [trend, setTrend] = useState([]);
  const [importance, setImportance] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCommodities().then(setCommodities);
    getDistricts().then(setDistricts);
  }, []);

  const handlePredict = async (form) => {
    setLoading(true);
    setError('');
    try {
      const res = await predictPrice({
        commodity: form.commodity,
        district: form.district,
        month: Number(form.month),
        year: Number(form.year)
      });
      setPrediction(res.predicted_price);
      setTrend(res.price_trend || []);
      setImportance(res.feature_importance || {});
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed');
      setPrediction(null);
      setTrend([]);
      setImportance({});
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
    <p className="text-2xl font-semibold text-gray-600 mt-4">Sri Lanka Food Price Predictor</p>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <PriceForm commodities={commodities} districts={districts} onSubmit={handlePredict} loading={loading} />
          <div className="mt-6">
            <PredictionCard price={prediction} error={error} />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <TrendChart data={trend} />
          <FeatureImportanceChart importance={importance} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
