// src/utils/currency.js
export const formatPrice = (price) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `₹${numPrice.toFixed(2)}`;
};

export const formatPriceWithUnit = (price, unit) => {
  return `${formatPrice(price)}/${unit}`;
};