import React from 'react';

function Stats({ goods, money, population }) {
    var nf = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
	
  var nf2 = new Intl.NumberFormat("de-DE", { maximumSignificantDigits: 3 });
  
  return (
    <div style={{ marginBottom: '1rem' }}>
      <p>👥 Bevölkerung: <strong>{nf.format(population)}</strong></p>
      <p>📦 Warenbestand: <strong>{nf.format(goods)}</strong></p>
      <p>💰 Geld: <strong>{nf.format(money)} €</strong></p>
    </div>
  );
}

export default Stats;