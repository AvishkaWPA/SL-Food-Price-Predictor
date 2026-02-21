import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const getCommodities = async () => {
  const res = await axios.get(`${API_BASE}/commodities`);
  return res.data.commodities;
};

export const getDistricts = async () => {
  const res = await axios.get(`${API_BASE}/districts`);
  return res.data.districts;
};

export const predictPrice = async (payload) => {
  const res = await axios.post(`${API_BASE}/predict`, payload);
  return res.data;
};
