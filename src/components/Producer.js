import React from 'react';

function Producer({ level, rate, onUpgrade, upgradeCost, canUpgrade }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>🏭 Produktionseinheit (Level {level})</h2>
      <p>Produziert {parseInt(rate * 100, 10)} Waren pro Sekunde.</p>
      <button onClick={onUpgrade} disabled={!canUpgrade}>
        Upgrade für {upgradeCost*100} €
      </button>
    </div>
  );
}

export default Producer;
