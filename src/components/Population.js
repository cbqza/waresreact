import React from 'react';
import { toCurrency, toFormattedNumber } from '../numberformat.js';

function Population({level, growRate, consumeRate, onUpgrade, upgradeCost, canUpgrade }){
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>👥 Bevölkerung (Level {level})</h2>
      <p>Wächst {toFormattedNumber(growRate)}</p>
      <p>Konsumiert {toFormattedNumber(consumeRate)}</p>
      <button onClick={onUpgrade} disabled={!canUpgrade}>
        Upgrade für {toCurrency(upgradeCost)}
      </button>
    </div>
  );
}

export default Population;

