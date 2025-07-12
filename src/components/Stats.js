import React from 'react';
import { toCurrency, toFormattedNumber } from '../numberformat.js';

function Stats({ goods, money, population }) {
    
  return (
    <div style={{ marginBottom: '1rem' }}>
      <p>👥 Bevölkerung: <strong>{toFormattedNumber(population)}</strong></p>
      <p>📦 Warenbestand: <strong>{toFormattedNumber(goods)}</strong></p>
      <p>💰 Geld: <strong>{toCurrency(money)}</strong></p>
    </div>
  );
}

export default Stats;