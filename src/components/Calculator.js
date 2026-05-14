import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Calculator.css'; // Make sure this is imported

const InputSlider = ({ label, value, onChange, min, max, unit }) => (
  <motion.div className="slider-group" layout>
    <label>{label}</label>
    <div className="slider-input">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
      <span>{value} {unit}</span>
    </div>
  </motion.div>
);

// NEW: This is our advanced options panel component
const AdvancedTravelOptions = ({ vehicleType, setVehicleType }) => {
  return (
    <motion.div
      className="advanced-panel"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor="vehicle-type">Vehicle Type</label>
      <select 
        id="vehicle-type" 
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value)}
      >
        <option value="car_avg">Average Car</option>
        <option value="suv">SUV</option>
        <option value="ev">Electric Vehicle</option>
        <option value="train">Train</option>
      </select>
    </motion.div>
  );
};

const Calculator = ({ data, setData, vehicleType, setVehicleType }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTravelChange = (e) => setData({ ...data, travel: Number(e.target.value) });
  const handleElectricityChange = (e) => setData({ ...data, electricity: Number(e.target.value) });
  const handleWaterChange = (e) => setData({ ...data, water: Number(e.target.value) });

  return (
    <>
      <h1>Your Weekly Impact</h1>
      
      {/* Travel Slider with Advanced Button */}
      <div className="input-with-advanced">
        <InputSlider 
          label="Travel" 
          value={data.travel}
          onChange={handleTravelChange}
          min={0} max={500} unit="km" 
        />
        <button className="advanced-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? 'Hide' : 'Advanced'}
        </button>
      </div>

      <AnimatePresence>
        {showAdvanced && (
          <AdvancedTravelOptions 
            vehicleType={vehicleType} 
            setVehicleType={setVehicleType} 
          />
        )}
      </AnimatePresence>

      <InputSlider 
        label="Electricity" 
        value={data.electricity}
        onChange={handleElectricityChange}
        min={0} max={200} unit="kWh" 
      />
      <InputSlider 
        label="Water" 
        value={data.water}
        onChange={handleWaterChange}
        min={0} max={5000} unit="liters" 
      />
    </>
  );
};

export default Calculator;