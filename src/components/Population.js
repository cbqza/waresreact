import React from 'react';

function Population({level, growRate, consumeRate, onUpgrade, upgradeCost, canUpgrade }){
  var nf = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
	
  var nf2 = new Intl.NumberFormat("de-DE", { maximumSignificantDigits: 3 });

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>👥 Bevölkerung Level {level}</h2>
      <p>Wächst {nf2.format(growRate)}</p>
      <p>Konsumiert {nf2.format(consumeRate)}</p>
      <button onClick={onUpgrade} disabled={!canUpgrade}>
        Upgrade für {nf.format(upgradeCost)}
      </button>
    </div>
  );
}

export default Population;

