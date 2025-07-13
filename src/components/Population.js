import React from 'react';
import { toCurrency, toFormattedNumber } from '../numberformat.js';

function Population({level, growRate, consumeRate, onUpgrade, upgradeCost, canUpgrade,
  housingLevel, onUpgradeHousing, upgradeCostHousing, canUpgradeHousing
 }){
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h3>👥 Bevölkerung (Level {level})</h3>
      <p>Wächst {toFormattedNumber(growRate*10)}</p>
      <p>Konsumiert {toFormattedNumber(consumeRate*10)}</p>
      <button onClick={onUpgrade} disabled={!canUpgrade}>
        Upgrade für {toCurrency(upgradeCost)}
      </button>
      <h3>🏠 Behausung (Level {housingLevel})</h3>
      <button onClick={onUpgradeHousing} disabled={!canUpgradeHousing}>
        Upgrade für {toCurrency(upgradeCostHousing)}
      </button>
    </div>
  );
}

export default Population;

