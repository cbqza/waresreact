import React from 'react';
import { toCurrency, toFormattedNumber } from '../numberformat.js';

function Producer({ level, rate, productionPopDemand, onUpgrade, upgradeCost, canUpgrade }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>🏭 Produktionseinheit (Level {level})</h2>
      <p>Produziert {toFormattedNumber(rate*10)} Waren.</p>
      <p>👥 Bedarf: {toFormattedNumber(productionPopDemand)}</p>
      <button onClick={onUpgrade} disabled={!canUpgrade}>
        Upgrade für {toCurrency(upgradeCost)}
      </button>
    </div>
  );
}

export default Producer;
