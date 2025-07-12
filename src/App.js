import React, { useState, useEffect } from 'react';

import Population from './components/Population.js';
import Producer from './components/Producer.js';
import Consumer from './components/Consumer.js';
import Stats from './components/Stats.js';

export default App;

function App() {
  const [goods, setGoods] = useState(0);
  const [money, setMoney] = useState(0);
  const [population, setPopulation] = useState(30); 
  
  const [populationLevel, setPopulationLevel] = useState(1);
  const [popGrowRate, setPopGrowRate] = useState(0.025);
  const [popConsumerRate, setPopConsumerRate] = useState(0.015);

  const [producerLevel, setProducerLevel] = useState(1);
  const [productionRate, setProductionRate] = useState(0.05);
  const [productionPopDemand, setProductionPopDemand] = useState(13);
  
  const [consumerLevel, setConsumerLevel] = useState(1);
  const [consumerRate, setConsumerRate] = useState(0.12);
  const [consumerPopDemand, setConsumerPopDemand] = useState(11);

  const [priceLevel, setPriceLevel] = useState(1);
  const [sellPrice, setSellPrice] = useState(5);
  const [effectiveConsumerRate, setEffectiveConsumerRate] = useState(1.00); //* (100 - {priceLevel}) / 100;


    const setECR = React.useCallback(() => { 
      setEffectiveConsumerRate(consumerRate * (100-priceLevel)/100); 
    }, [consumerRate, priceLevel, setEffectiveConsumerRate]);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setPopulation(p => p + popGrowRate);
      setGoods((s) => s + productionRate);
      setECR();
      setGoods(prevGoods => {        
        prevGoods += productionRate;
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
  }, [population, popGrowRate, popConsumerRate, productionRate, productionPopDemand, consumerRate, consumerPopDemand, sellPrice, priceLevel, effectiveConsumerRate, setECR]);

  const upgradeCostPop = () => {
    return Math.pow(populationLevel * 1.1, 1.9) * 45; 
  };

  const upgradeCostProducer = () => {
    return Math.pow(producerLevel * 0.7, 2.2) * 50;
  };
  
  const upgradeCostConsumer = () => {
    return Math.pow(consumerLevel + 2 * 0.67, 2.5) * 50;
  };

  const upgradeCostConsumerPrice = () => {
    return Math.pow(priceLevel * 0.85, 2.7) * 30;
  };

  const upgradePop = () => {
    const cost = upgradeCostPop();
    if(money >= cost) {
      setMoney(m => m - cost);
      setPopulationLevel(l => l + 1);
      setPopGrowRate(r => r * 1.1);
      setPopConsumerRate(r => r * 1.1);
    }
  };

  const upgradeProducer = () => {
    const cost = upgradeCostProducer();
    if (money >= cost) {
      setMoney(m => m - cost);
      setProducerLevel(lvl => lvl + 1);
      setProductionRate(rate => rate * 1.12);
      setProductionPopDemand(demand => demand + demand * 0.3);
    }
  };

  const upgradeConsumerRate = () => {
    const cost = upgradeCostConsumer();
    if (money >= cost) {
      setMoney(m => m - cost);
      setConsumerLevel(lvl => lvl + 1);
      setConsumerRate(rate => rate * 1.19);
      setConsumerPopDemand(demand => demand + demand * 0.4);
      setECR(); // Update effective consumer rate after changing consumer rate
    }
  };

  const upgradeConsumerPrice = () => {
    const cost = upgradeCostConsumerPrice();
    if (money >= cost) {
      setMoney(m => m - cost);
      setPriceLevel(lvl => lvl + 1);
      setConsumerPopDemand(demand => demand * 1.15);
      var newprice = sellPrice + (priceLevel + 1)  
        - /*taxes*/ sellPrice * 0.011;
      setSellPrice(() => newprice);
      setECR(); // Update effective consumer rate after changing consumer rate
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🛠️ Produktionsspiel</h1>
      <Stats goods={goods} money={money} population={population} />
      <Population
	      level={populationLevel}
	      growRate={popGrowRate}
	      consumeRate={popConsumerRate}
	      onUpgrade={upgradePop}
	      upgradeCost={upgradeCostPop()}
	      canUpgrade={money >= upgradeCostPop()}
      />
      <Producer
        level={producerLevel}
        rate={productionRate}
        productionPopDemand={productionPopDemand}
        onUpgrade={upgradeProducer}
        upgradeCost={upgradeCostProducer()}
        canUpgrade={money >= upgradeCostProducer()}
      />
      <Consumer
        level={consumerLevel}
        consumeRate={effectiveConsumerRate}
        consumerPopDemand={consumerPopDemand}
        plevel={priceLevel}
        price={sellPrice}
        onUpgradeRate={upgradeConsumerRate}
        upgradeCostRate={upgradeCostConsumer()}
        canUpgradeRate={money >= upgradeCostConsumer()}
        onUpgradePrice={upgradeConsumerPrice}
        upgradeCostPrice={upgradeCostConsumerPrice()}
        canUpgradePrice={money >= upgradeCostConsumerPrice()}
      />
    </div>
  );
}


