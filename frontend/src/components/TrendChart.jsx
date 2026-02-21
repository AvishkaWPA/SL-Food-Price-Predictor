import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TrendChart = ({ data }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="mb-2 font-semibold">Price Trend</h3>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data.map(item => ({ ...item, yearMonth: `${item.year}-${String(item.month).padStart(2, '0')}` }))}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="yearMonth" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default TrendChart;
