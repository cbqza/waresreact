import React from 'react';

function Consumer({ level, consumeRate, plevel, price, 
  onUpgradeRate, upgradeCostRate, canUpgradeRate,
    onUpgradePrice, upgradeCostPrice, canUpgradePrice }) {

    return (
    <div>
      <h2>🛒 Verbrauchereinheit (Level {level}/{plevel})</h2>
      <p>Kauft {parseInt(consumeRate*100, 10)} Waren für {price} € pro Stück.</p>
      <button onClick={onUpgradeRate} disabled={!canUpgradeRate}>
        Rate-Upgrade für {upgradeCostRate*100} €
      </button>
      <button onClick={onUpgradePrice} disabled={!canUpgradePrice}>
        Price-Upgrade für {upgradeCostPrice*100} €
      </button>
    </div>
  );
}

export default Consumer;