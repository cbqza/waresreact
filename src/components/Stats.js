import React from 'react';
import { toCurrency, toFormattedNumber } from '../numberformat.js';

function Stats({ timer, goods, money, sellInfo, population, housing }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>📊 Statistiken | {timer/10} Sekunden</h2>
      {sellInfo && <p>{sellInfo}</p>}
      <p>👥 Bevölkerung: <strong>{toFormattedNumber(population)} (🏠 Wohnraum: <strong>{toFormattedNumber(housing)}</strong>)</strong></p>
      <p>📦 Warenbestand: <strong>{toFormattedNumber(goods)}</strong></p>
      <p>💰 Geld: <strong>{toCurrency(money)}</strong></p>
    </div>
  );
}

export default Stats;