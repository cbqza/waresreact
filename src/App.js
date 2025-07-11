import React, { useState, useEffect } from 'react';
import Producer from './components/Producer.js';
import Consumer from './components/Consumer.js';
import Stats from './components/Stats.js';

function App() {
  const [goods, setGoods] = useState(0);
  const [money, setMoney] = useState(0);

  const [productionRate, setProductionRate] = useState(1.00);
  const [consumerRate, setConsumerRate] = useState(1.00);
  const [sellPrice, setSellPrice] = useState(5);
  const [effectiveConsumerRate, setEffectiveConsumerRate] = useState(1.00); //* (100 - {priceLevel}) / 100;

  const [producerLevel, setProducerLevel] = useState(1);
  const [consumerLevel, setConsumerLevel] = useState(1);
  const [priceLevel, setPriceLevel] = useState(1);

    const setECR = React.useCallback(() => { 
      setEffectiveConsumerRate(consumerRate * (100-priceLevel)/100); 
    }, [consumerRate, priceLevel, setEffectiveConsumerRate]);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setGoods(prev => prev + productionRate);
      setECR();
      setGoods(prevGoods => {
        if (prevGoods > 0) {
          
          console.log('ConsumerRate: %.2f', effectiveConsumerRate);
          console.log('Goods: %d', prevGoods);
          const toSell = Math.min(prevGoods, effectiveConsumerRate ); // max so viele wie produziert
          setMoney(m => m + toSell * sellPrice);
          return prevGoods - toSell;
        }
        return prevGoods;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [productionRate, consumerRate, sellPrice, priceLevel, effectiveConsumerRate, setECR]);

  const upgradeProducer = () => {
    const cost = producerLevel * producerLevel * producerLevel * 20;
    if (money >= cost) {
      setMoney(m => m - cost);
      setProducerLevel(lvl => lvl + 1);
      setProductionRate(rate => rate * 1.1);
    }
  };

  const upgradeConsumerRate = () => {
    const cost = consumerLevel * consumerLevel * 30;
    if (money >= cost) {
      setMoney(m => m - cost);
      setConsumerLevel(lvl => lvl + 1);
      setConsumerRate(rate => rate * 1.1)
    }
  };

  const upgradeConsumerPrice = () => {
    const cost = priceLevel * priceLevel * priceLevel * 40;
    if (money >= cost) {
      setMoney(m => m - cost);
      setPriceLevel(lvl => lvl + 1);
      setSellPrice(price => price + 2);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🛠️ Produktionsspiel</h1>
      <Stats goods={goods} money={money} effectiveConsumerRate={effectiveConsumerRate} />
      <Producer
        level={producerLevel}
        rate={productionRate}
        onUpgrade={upgradeProducer}
        upgradeCost={producerLevel * producerLevel * producerLevel * 20}
        canUpgrade={money >= producerLevel * producerLevel * producerLevel * 20}
      />
      <Consumer
        level={consumerLevel}
        consumeRate={effectiveConsumerRate}
        plevel={priceLevel}
        price={sellPrice}
        onUpgradeRate={upgradeConsumerRate}
        upgradeCostRate={consumerLevel * consumerLevel * 30}
        canUpgradeRate={money >= consumerLevel * consumerLevel * 30}
        onUpgradePrice={upgradeConsumerPrice}
        upgradeCostPrice={priceLevel * priceLevel * priceLevel * 40}
        canUpgradePrice={money >= priceLevel * priceLevel * priceLevel * 40}
      />
    </div>
  );
}

export default App;
