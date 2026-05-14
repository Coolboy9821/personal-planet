import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Planet from './components/Planet';
import Calculator from './components/Calculator';
import Results from './components/Results';
import TravelCalculatorModal from './components/TravelCalculatorModal';
import ActionTip from './components/ActionTip';
import FlightUrlModal from './components/FlightUrlModal';
import EcoHub from './components/EcoHub';
import WikiModal from './components/WikiModal';
import ConstellationCanvas from './components/ConstellationCanvas';
import HeatmapModal from './components/HeatmapModal';
import './App.css';
import './components/Calculator.css';

// Factors for calculation
const factors = {
  travel: { car_avg: 0.14, suv: 0.18, ev: 0.05, train: 0.04 },
  electricity: 0.45,
  water: 0.001,
};

// Simulate some historical data for the chart in the Eco-Hub
const simulatedHistoricalData = [
  { label: 'Week 1', value: 4.5 }, { label: 'Week 2', value: 4.8 },
  { label: 'Week 3', value: 4.2 }, { label: 'Week 4', value: 3.5 },
  { label: 'Week 5', value: 3.8 }, { label: 'Week 6', value: 3.1 },
];

function App() {
  // State for all modals and the Eco-Hub
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [isWikiOpen, setIsWikiOpen] = useState(false);
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);

  // State for user input data
  const [data, setData] = useState({ travel: 50, electricity: 30, water: 1000 });
  const [vehicleType, setVehicleType] = useState('car_avg');

  // Memoized calculation for the user's carbon footprint
  const footprint = useMemo(() => {
    const travelFootprint = data.travel * factors.travel[vehicleType];
    const electricityFootprint = data.electricity * factors.electricity;
    const waterFootprint = data.water * factors.water;
    const total = travelFootprint + electricityFootprint + waterFootprint;
    const annualTonnes = (total * 52) / 1000;
    return {
      total: annualTonnes,
      breakdown: { travel: travelFootprint, electricity: electricityFootprint, water: waterFootprint }
    }
  }, [data, vehicleType]);
  
  const currentHistoricalData = [...simulatedHistoricalData, { label: 'This Week', value: footprint.total }];

  // Memoized logic to generate a personalized action tip
  const actionTip = useMemo(() => {
    const { travel, electricity, water } = footprint.breakdown;
    const maxImpact = Math.max(travel, electricity, water);
    if (maxImpact === 0) return "Your impact is minimal. Keep up the great work!";
    if (maxImpact === travel) return "Travel is your biggest impact area. Consider public transport or carpooling for your next trip.";
    if (maxImpact === electricity) return "Pro Tip: Switching to LED bulbs and unplugging devices can significantly lower your electricity usage.";
    if (maxImpact === water) return "Reducing shower times and fixing leaks are powerful ways to conserve water and reduce your footprint.";
  }, [footprint.breakdown]);

  const getImpactLevel = (score) => {
    if (score < 4) return { text: "Excellent!", color: 'var(--green)' };
    if (score < 10) return { text: "Good", color: 'var(--yellow)' };
    return { text: "High Impact", color: 'var(--red)' };
  }
  const impact = getImpactLevel(footprint.total);
  
  const handleTravelFromMap = (km) => {
    setData(prevData => ({ ...prevData, travel: Math.round(km) }));
    setIsMapModalOpen(false);
  };
  
  const handleTravelFromFlight = ({ emission }) => {
    const weeklyEmission = emission / 52;
    const equivalentKm = weeklyEmission / factors.travel[vehicleType];
    setData(prevData => ({ ...prevData, travel: Math.round(equivalentKm) }));
    setIsFlightModalOpen(false);
  };

  return (
    <>
      <ConstellationCanvas />

      <div className="App" style={{ filter: isHubOpen || isWikiOpen || isMapModalOpen || isFlightModalOpen || isHeatmapOpen ? 'blur(5px)' : 'none', transition: 'filter 0.3s' }}>
        <motion.div 
          className="calculator-container"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Calculator data={data} setData={setData} vehicleType={vehicleType} setVehicleType={setVehicleType} />
          <Results footprintData={footprint.breakdown} />
          <ActionTip tip={actionTip} /> 
        </motion.div>

        <motion.div 
          className="planet-container"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Planet footprintScore={footprint.total} />
          <div className="top-right-buttons">
            <button className="map-button" onClick={() => setIsMapModalOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                 Calculate Trip
            </button>
            <button className="map-button" onClick={() => setIsFlightModalOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                Import Flight
            </button>
            <button className="map-button" onClick={() => setIsHeatmapOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"></path><path d="M12 19a7 7 0 0 0-7 7"></path><path d="M12 12a3 3 0 0 0 3-3"></path></svg>
                Heat Signature
            </button>
          </div>
          <div className="total-footprint">
              <AnimatePresence mode="wait">
                  <motion.h2 key={footprint.total.toFixed(2)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                      {footprint.total.toFixed(2)}
                      <span> Tonnes CO₂e / year</span>
                  </motion.h2>
              </AnimatePresence>
              <motion.p style={{ color: impact.color }}>{impact.text}</motion.p>
          </div>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {!isHubOpen && !isWikiOpen && !isMapModalOpen && !isFlightModalOpen && !isHeatmapOpen && (
          <motion.div
            className="hub-button-container"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
          >
            <button className="hub-button" onClick={() => setIsHubOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              My Eco-Hub
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isMapModalOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><TravelCalculatorModal onClose={() => setIsMapModalOpen(false)} onConfirm={handleTravelFromMap} /></motion.div>}
        {isFlightModalOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FlightUrlModal onClose={() => setIsFlightModalOpen(false)} onConfirm={handleTravelFromFlight} /></motion.div>}
        {isHubOpen && <EcoHub historicalData={currentHistoricalData} onClose={() => setIsHubOpen(false)} onLearnMoreClick={() => setIsWikiOpen(true)} />}
        {isWikiOpen && <WikiModal onClose={() => setIsWikiOpen(false)} />}
        {isHeatmapOpen && <HeatmapModal footprintData={footprint.breakdown} onClose={() => setIsHeatmapOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export default App;