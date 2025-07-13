import React from 'react';
import { toCurrency, toFormattedNumber } from '../numberformat.js';

function Consumer({ level, consumeRate, consumerPopDemand, plevel, price, 
  onUpgradeRate, upgradeCostRate, canUpgradeRate,
    onUpgradePrice, upgradeCostPrice, canUpgradePrice }) {

    return (
    <div>
      <h2>🛒 Verbrauchereinheit (Level {level}/{plevel})</h2>
      <p>Verkauft {toFormattedNumber(consumeRate*10)} Waren für {toCurrency(price)} pro Stück.</p>
      <p>💰 Profit: {toCurrency(consumeRate * price * 10)}</p>
      <p>👥 Bedarf: {toFormattedNumber(consumerPopDemand)}</p>
      <button onClick={onUpgradeRate} disabled={!canUpgradeRate}>
        Rate-Upgrade für {toCurrency(upgradeCostRate)}
      </button>
      <button onClick={onUpgradePrice} disabled={!canUpgradePrice}>
        Price-Upgrade für {toCurrency(upgradeCostPrice)}
      </button>
    </div>
  );
}

export default Consumer;