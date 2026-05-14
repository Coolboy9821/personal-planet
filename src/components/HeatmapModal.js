import React from 'react';
import { motion } from 'framer-motion';
import './HeatmapModal.css'; // We'll create this next

// Helper function to map a value to a color (blue -> yellow -> red)
const getHeatColor = (value, maxValue) => {
  const ratio = Math.min(value / maxValue, 1);
  // Hue goes from blue (240) to red (0)
  const hue = 240 * (1 - ratio);
  // Lightness decreases as impact grows for more intensity
  const lightness = 60 - ratio * 20;
  return `hsl(${hue}, 90%, ${lightness}%)`;
};

// Variants for the staggered animation of the grid cells
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const HeatmapModal = ({ footprintData, onClose }) => {
  // We'll create some logical sub-categories to make the heatmap richer.
  // In a real app, these would come from more detailed inputs.
  const heatData = {
    Travel: [
      { name: 'Daily Commute', value: footprintData.travel * 0.6 },
      { name: 'Long Distance', value: footprintData.travel * 0.4 },
    ],
    Electricity: [
      { name: 'Appliances', value: footprintData.electricity * 0.5 },
      { name: 'Lighting', value: footprintData.electricity * 0.2 },
      { name: 'Heating/Cooling', value: footprintData.electricity * 0.3 },
    ],
    Water: [
      { name: 'Sanitation', value: footprintData.water * 0.7 },
      { name: 'Consumption', value: footprintData.water * 0.3 },
    ],
  };

  const maxValue = Math.max(
    footprintData.travel,
    footprintData.electricity,
    footprintData.water
  );

  return (
    <motion.div 
      className="wiki-overlay" // Reusing overlay style for consistency
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="heatmap-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <button className="wiki-close" onClick={onClose}>&times;</button>
        <h2>Carbon Heat Signature</h2>
        <p className="heatmap-subtitle">Visualizing the intensity of your weekly carbon emissions by category.</p>

        <motion.div 
          className="heatmap-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(heatData).map(([category, items]) => (
            <React.Fragment key={category}>
              {items.map(item => (
                <motion.div
                  key={item.name}
                  className="heatmap-cell"
                  variants={itemVariants}
                  style={{ 
                    background: getHeatColor(item.value, maxValue),
                    borderColor: getHeatColor(item.value, maxValue + 10)
                  }}
                >
                  <span className="cell-name">{item.name}</span>
                  <span className="cell-value">{item.value.toFixed(1)} kg CO₂e</span>
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeatmapModal;