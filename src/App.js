import React, { useState, useEffect } from 'react';
import { format } from 'react-string-format';

import { toCurrency, toFormattedNumber } from './numberformat.js';
import Population from './components/Population.js';
import Producer from './components/Producer.js';
import Consumer from './components/Consumer.js';
import Stats from './components/Stats.js';

export default App;

function App() {
  const [goods, setGoods] = useState(0);
  const [money, setMoney] = useState(0);
  const [sellInfo, setSellInfo] = useState('');
  const [population, setPopulation] = useState(30);
  const [housing, setHousing] = useState(50);
  
  const [populationLevel, setPopulationLevel] = useState(1);
  const [popGrowRate, setPopGrowRate] = useState(0.025);
  const [popConsumerRate, setPopConsumerRate] = useState(0.015);

  const [housingLevel, setHousingLevel] = useState(1);

  const [producerLevel, setProducerLevel] = useState(1);
  const [productionRate, setProductionRate] = useState(0.05);
  const [productionPopDemand, setProductionPopDemand] = useState(13);
  
  const [consumerLevel, setConsumerLevel] = useState(1);
  const [consumerRate, setConsumerRate] = useState(0.12);
  const [consumerPopDemand, setConsumerPopDemand] = useState(11);

  const [priceLevel, setPriceLevel] = useState(1);
  const [sellPrice, setSellPrice] = useState(5);
  const [effectiveConsumerRate, setEffectiveConsumerRate] = useState(1.00); //* (100 - {priceLevel}) / 100;

  const [simPopulationConsume, setSimPopulationConsume] = useState(0.0);
  const [simPopulationDrain, setSimPopulationDrain] = useState(0.0);
  const [simConsumerToSell, setSimConsumerToSell] = useState(0.0);
  const [simConsumerPrice, setSimConsumerPrice] = useState(0.0);
  const [simConsumerTotal, setSimConsumerTotal] = useState(0.0);

    const setECR = React.useCallback(() => { 
      setEffectiveConsumerRate(consumerRate * ((100-priceLevel)/100) * getPopDemandFactor()); 
    }, [consumerRate, priceLevel, setEffectiveConsumerRate]);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setPopulation(p => Math.min(housing, p + popGrowRate));
      setECR();
      setGoods(prevGoods => {
        setSimPopulationConsume(p => population * 0.19); 
        setSimPopulationDrain(p => getPopDemandFactor());
        
        const producedGoods = productionRate * simPopulationDrain;
        prevGoods += producedGoods;

        setSimConsumerToSell(p => Math.min(effectiveConsumerRate, Math.max(0, prevGoods - simPopulationConsume)));
        setSimConsumerPrice(p => sellPrice);
        setSimConsumerTotal(p => simConsumerToSell  * simConsumerPrice);
        setSellInfo(`Verkauf: ${toCurrency(simConsumerTotal)} (${simConsumerToSell.toFixed(2)} zu ${toCurrency(sellPrice)})`);
                
        setMoney(m => m + simConsumerTotal);
        prevGoods = Math.max(0, prevGoods - simPopulationConsume - simConsumerToSell);
        if (prevGoods < 0) {
          prevGoods = 0;
        }
        return prevGoods;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [housing, population, popGrowRate, popConsumerRate, productionRate, productionPopDemand, consumerRate, consumerPopDemand, sellPrice, priceLevel, effectiveConsumerRate, setECR]);

    const getPopDemandFactor = () => {
    return Math.min(1.0, population / (productionPopDemand + consumerPopDemand));
  };

  const popEffectiveConsumerRate = () => {
    return population * 0.19;
  };

  const upgradeCostPop = () => {
    return Math.pow(populationLevel * 1.1, 1.9) * 45; 
  };

  const upgradeCostHousing = () => {
    return Math.pow((housingLevel + 1) * 0.75 , 1.9) * 45; 
  };

  const upgradeCostProducer = () => {
    return Math.pow(producerLevel * 0.7, 2.2) * 50;
  };
  
  const upgradeCostConsumer = () => {
    return Math.pow((consumerLevel + 2) * 0.67, 2.5) * 50;
  };

  const upgradeCostConsumerPrice = () => {
    return Math.pow(priceLevel * 0.85, 2.7) * 30;
  };

  const upgradePop = () => {
    const cost = upgradeCostPop();
    if(money >= cost) {
      setMoney(m => m - cost);
      setPopulationLevel(l => l + 1);
      setPopGrowRate(r => r * 1.12);
      setPopConsumerRate(r => r * 1.14);
    }
  };
  
  const upgradeHousing = () => {
    const cost = upgradeCostHousing();
    if(money >= cost) {
      setMoney(m => m - cost);
      setHousingLevel(l => l + 1);
      setHousing(h => h + housingLevel * 10);
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
      <Stats goods={goods} money={money} sellInfo={sellInfo} population={population} housing={housing} />
      <Population
	      level={populationLevel}
	      growRate={popGrowRate}
	      consumeRate={popEffectiveConsumerRate()}
	      onUpgrade={upgradePop}
	      upgradeCost={upgradeCostPop()}
	      canUpgrade={money >= upgradeCostPop()}
        housingLevel={housingLevel}
        onUpgradeHousing={upgradeHousing}
        upgradeCostHousing={upgradeCostHousing()}
        canUpgradeHousing={money >= upgradeCostHousing()}
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


