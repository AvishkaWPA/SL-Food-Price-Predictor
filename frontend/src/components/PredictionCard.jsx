import React from 'react';

const PredictionCard = ({ price, error }) => (
  <div className="bg-green-50 p-6 rounded shadow text-center">
    {error ? (
      <div className="text-red-600 font-semibold">{error}</div>
    ) : (
      <>
        <div className="text-gray-500">Predicted Price</div>
        <div className="text-3xl font-bold text-green-700">{price ? `Rs. ${price.toFixed(2)}` : '--'}</div>
      </>
    )}
  </div>
);

export default PredictionCard;
