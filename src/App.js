import React, { useState, useEffect } from 'react';
import { format } from 'react-string-format';

import { toCurrency, toFormattedNumber } from './numberformat.js';
import Population from './components/Population.js';
import Producer from './components/Producer.js';
import Consumer from './components/Consumer.js';
import Stats from './components/Stats.js';

export default App;

function App() {
  const [timer, setTimer] = useState(0);
  const [goods, setGoods] = useState(10);
  const [money, setMoney] = useState(10000);
  const [sellInfo, setSellInfo] = useState('');
  const [population, setPopulation] = useState(30);
  const [housing, setHousing] = useState(50);

  const usableMoney = () => money + Math.pow(population * 0.66, 0.66) * 444; // Allow for a buffer in calculations

  const [populationLevel, setPopulationLevel] = useState(1);
  const [popGrowRate, setPopGrowRate] = useState(0.025);

  const [housingLevel, setHousingLevel] = useState(1);

  const [producerLevel, setProducerLevel] = useState(1);
  const [productionRate, setProductionRate] = useState(0.25);
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
      if(timer >= 4200){
        clearInterval(interval);
        return;
      }
      setPopulation(p => Math.min(housing, p + popGrowRate));
      setECR();
      setGoods(prevGoods => {
        setSimPopulationConsume(p => population * 0.001);
        setSimPopulationDrain(p => getPopDemandFactor());
        
        const producedGoods = productionRate * simPopulationDrain;
        prevGoods += producedGoods;

        setSimConsumerToSell(p => Math.min(effectiveConsumerRate, Math.max(0, prevGoods - simPopulationConsume)));
        setSimConsumerPrice(p => sellPrice);
        setSimConsumerTotal(p => simConsumerToSell  * simConsumerPrice);
        setSellInfo(`${simPopulationDrain.toFixed(2)} PopulationDrain`);
                
        setMoney(m => m + simConsumerTotal);
        prevGoods = Math.max(0, prevGoods - simPopulationConsume - simConsumerToSell);
        if (prevGoods < 0) {
          prevGoods = 0;
        }
        return prevGoods;
      });
      setTimer(t=> t + 1);      
    }, 100);

    return () => clearInterval(interval);
  }, [housing, population, popGrowRate, simPopulationConsume, simPopulationDrain, simConsumerPrice, simConsumerToSell, simConsumerTotal, productionRate, productionPopDemand, consumerRate, consumerPopDemand, sellPrice, priceLevel, effectiveConsumerRate, setECR]);

    const getPopDemandFactor = () => {
    return Math.min(1.0, population / (productionPopDemand + consumerPopDemand));
  };

  const upgradeCostPop = () => {
    return Math.pow(populationLevel * 1.1, 1.9) * 45; 
  };

  const canUpgradePop = () => {
    return usableMoney() >= upgradeCostPop();
  };

  const upgradeCostHousing = () => {
    return Math.pow((housingLevel + 5) * 0.75 , 2.3) * 45; 
  };

  const canUpgradeHousing = () => {
    return usableMoney() >= upgradeCostHousing();
  };

  const upgradeCostProducer = () => {
    return Math.pow(producerLevel * 0.7, 2.2) * 50;
  };

  const canUpgradeProducer = () => {
    return usableMoney() >= upgradeCostProducer();
  };
  
  const upgradeCostConsumer = () => {
    return Math.pow((consumerLevel + 2) * 0.67, 2.5) * 50;
  };

  const canUpgradeConsumer = () => {
    return usableMoney() >= upgradeCostConsumer();
  };

  const upgradeCostConsumerPrice = () => {
    return Math.pow(priceLevel * 0.85, 2.7) * 30;
  };

  const canUpgradeConsumerPrice = () => {
    return usableMoney() >= upgradeCostConsumerPrice();
  };
  

  const upgradePop = () => {
    const cost = upgradeCostPop();
    if (canUpgradePop()) {
      setMoney(m => m - cost);
      setPopulationLevel(l => l + 1);
      setPopGrowRate(r => r * 1.12);
    }
  };
  
  const upgradeHousing = () => {
    const cost = upgradeCostHousing();
    if(canUpgradeHousing()) {
      setMoney(m => m - cost);
      setHousingLevel(l => l + 1);
      setHousing(h => h + housingLevel * 10);
      setPopulation(p => p + housingLevel * 2);
    }
  };

  const upgradeProducer = () => {
    const cost = upgradeCostProducer();
    if (canUpgradeProducer()) {
      setMoney(m => m - cost);
      setProducerLevel(lvl => lvl + 1);
      setProductionRate(rate => rate * 1.12);
      setProductionPopDemand(demand => 13 + producerLevel * 10 + Math.pow(producerLevel * 8, 0.9) * 0.8);
    }
  };

  const upgradeConsumerRate = () => {
    const cost = upgradeCostConsumer();
    if (canUpgradeConsumer()) {
      setMoney(m => m - cost);
      setConsumerLevel(lvl => lvl + 1);
      setConsumerRate(rate => rate * 1.19);
      setConsumerPopDemand(demand => 11 + (consumerLevel+0.3) * 11 
        + Math.pow(priceLevel * 10, 1.02) * 0.8);
      setECR(); // Update effective consumer rate after changing consumer rate
    }
  };

  const upgradeConsumerPrice = () => {
    const cost = upgradeCostConsumerPrice();
    if (canUpgradeConsumerPrice()) {
      setMoney(m => m - cost);
      setPriceLevel(lvl => lvl + 1);
      setConsumerPopDemand(demand => 11 + (consumerLevel+0.3) * 11 
        + Math.pow(priceLevel * 10, 1.02) * 0.8 );
      var newprice = sellPrice + (priceLevel + 1)  
        - /*taxes*/ sellPrice * 0.011;
      setSellPrice(() => newprice);
      setECR(); // Update effective consumer rate after changing consumer rate
    }
  };



  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🛠️ Produktionsspiel</h1>
      <Stats timer={timer} goods={goods} money={money} sellInfo={sellInfo} population={population} housing={housing} />
      <Population
	      level={populationLevel}
	      growRate={popGrowRate}
	      consumeRate={simPopulationConsume}
	      onUpgrade={upgradePop}
	      upgradeCost={upgradeCostPop()}
	      canUpgrade={canUpgradePop()}
        housingLevel={housingLevel}
        onUpgradeHousing={upgradeHousing}
        upgradeCostHousing={upgradeCostHousing()}
        canUpgradeHousing={canUpgradeHousing()}
      />
      <Producer
        level={producerLevel}
        rate={productionRate * simPopulationDrain}
        productionPopDemand={productionPopDemand}
        onUpgrade={upgradeProducer}
        upgradeCost={upgradeCostProducer()}
        canUpgrade={canUpgradeProducer()}
      />
      <Consumer
        level={consumerLevel}
        consumeRate={consumerRate * ((100-priceLevel)/100) * getPopDemandFactor()}
        consumerPopDemand={consumerPopDemand}
        plevel={priceLevel}
        price={sellPrice}
        onUpgradeRate={upgradeConsumerRate}
        upgradeCostRate={upgradeCostConsumer()}
        canUpgradeRate={canUpgradeConsumer()}
        onUpgradePrice={upgradeConsumerPrice}
        upgradeCostPrice={upgradeCostConsumerPrice()}
        canUpgradePrice={canUpgradeConsumerPrice()}
      />
    </div>
  );
}


