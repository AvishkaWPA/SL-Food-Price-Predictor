import React, { useState } from 'react';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const PriceForm = ({ commodities, districts, onSubmit, loading }) => {
  const [form, setForm] = useState({
    commodity: '',
    district: '',
    month: '',
    year: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Convert month name to number before sending
    const monthNum = monthNames.indexOf(form.month) + 1;
    onSubmit({ ...form, month: monthNum });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow flex flex-col gap-4">
      <select name="commodity" value={form.commodity} onChange={handleChange} required className="p-2 border rounded w-full">
        <option value="">Select Commodity</option>
        {commodities.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select name="district" value={form.district} onChange={handleChange} required className="p-2 border rounded w-full">
        <option value="">Select District</option>
        {districts.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <select name="month" value={form.month} onChange={handleChange} required className="p-2 border rounded w-full">
        <option value="">Select Month</option>
        {monthNames.map((m, idx) => <option key={m} value={m}>{m}</option>)}
      </select>
      <input name="year" type="number" min="2000" max="2100" value={form.year} onChange={handleChange} placeholder="Year" required className="p-2 border rounded w-full" />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
        {loading ? 'Predicting...' : 'Predict'}
      </button>
    </form>
  );
};

export default PriceForm;
