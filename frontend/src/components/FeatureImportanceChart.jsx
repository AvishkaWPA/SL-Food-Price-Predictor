import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const FeatureImportanceChart = ({ importance }) => {
  const data = Object.entries(importance || {}).map(([feature, value]) => ({
    feature: feature === 'admin2' ? 'district' : feature,
    value
  }));
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="mb-2 font-semibold">Feature Importance (SHAP)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="feature" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="value" fill="#f59e42" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureImportanceChart;
