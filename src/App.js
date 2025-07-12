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
  const [popGrowRate, setPopGrowRate] = useState(0.01);
  const [popConsumeRate, setPopConsumeRate] = useState(1.00);

  const [producerLevel, setProducerLevel] = useState(1);
  const [productionRate, setProductionRate] = useState(1.00);
  const [productionPopDemand, setProductionPopDemand] = useState(10);
  
  const [consumerLevel, setConsumerLevel] = useState(1);
  const [consumerRate, setConsumerRate] = useState(1.00);
  const [consumerPopDemand, setConsumerPopDemand] = useState(10);

  const [priceLevel, setPriceLevel] = useState(1);
  const [sellPrice, setSellPrice] = useState(5);
  const [effectiveConsumerRate, setEffectiveConsumerRate] = useState(1.00); //* (100 - {priceLevel}) / 100;


    const setECR = React.useCallback(() => { 
      setEffectiveConsumerRate(consumerRate * (100-priceLevel)/100); 
    }, [consumerRate, priceLevel, setEffectiveConsumerRate]);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setPopulation(() => population + population * 0.1 * popGrowRate);
      setGoods(() => productionRate + productionRate * 0.12 * productionRate);
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
  }, [popGrowRate, popConsumeRate, productionRate, productionPopDemand, consumerRate, consumerPopDemand, sellPrice, priceLevel, effectiveConsumerRate, setECR]);

  const upgradeCostPop = () => {
    return Math.pow(populationLevel, 1.8) * 70; 
  };

  const upgradeCostProducer = () => {
    return Math.pow(producerLevel, 2.2) * 50;
  };
  
  const upgradeCostConsumer = () => {
    return Math.pow(consumerLevel, 2.6) * 60;
  };

  const upgradeCostConsumerPrice = () => {
    return Math.pow(priceLevel, 3) * 40;
  };

  const upgradePop = () => {
    const cost = upgradeCostPop();
    if(money >= cost) {
      setMoney(m => m - cost);
      setPopulationLevel(l => l + 1);
      setPopGrowRate(r => r * 1.1);
      setPopConsumeRate(r => r * 1.1);
    }
  };



  const upgradeProducer = () => {
    const cost = upgradeCostProducer();
    if (money >= cost) {
      setMoney(m => m - cost);
      setProducerLevel(lvl => lvl + 1);
      setProductionRate(rate => rate * 1.12);
      setProductionPopDemand(demand => demand * 1.05);
    }
  };

  const upgradeConsumerRate = () => {
    const cost = upgradeCostConsumer();
    if (money >= cost) {
      setMoney(m => m - cost);
      setConsumerLevel(lvl => lvl + 1);
      setConsumerRate(rate => rate * 1.19);
      setConsumerPopDemand(demand => demand * 1.1);
      setECR(); // Update effective consumer rate after changing consumer rate
    }
  };

  const upgradeConsumerPrice = () => {
    const cost = upgradeCostConsumerPrice();
    if (money >= cost) {
      setMoney(m => m - cost);
      setPriceLevel(lvl => lvl + 1);

      var newprice = sellPrice + (priceLevel + 1)  
        - /*taxes*/ sellPrice * 0.011;
      setSellPrice(() => newprice);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🛠️ Produktionsspiel</h1>
      <Stats goods={goods} money={money} population={population} />
      <Population
	      level={popLevel}
	      growRate={popGrowRate}
	      consumeRate={popConsumeRate}
	      onUpgrade={upgradePop}
	      upgradeCost={upgradeCostPop}
	      canUpdate={money >= upgradeCostPop} 
      />
      <Producer
        level={producerLevel}
        rate={productionRate}
        onUpgrade={upgradeProducer}
        upgradeCost={upgradeCostProducer()}
        canUpgrade={money >= upgradeCostProducer()}
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


