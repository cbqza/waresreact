import React from 'react';

function Stats({ goods, money, effectiveConsumerRate }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <p>📦 Warenbestand: <strong>{parseInt(goods*100,10)}</strong></p>
      <p>     -&gt; Effective-Rate: {effectiveConsumerRate} </p>
      <p>💰 Geld: <strong>{parseInt(money*100,10)} €</strong></p>
    </div>
  );
}

export default Stats;