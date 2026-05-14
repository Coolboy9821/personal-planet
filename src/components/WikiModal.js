import React from 'react';
import { motion } from 'framer-motion';
import './WikiModal.css'; // This will be our new stylesheet

const WikiModal = ({ onClose }) => {
  return (
    // The overlay now handles the fade-in of the backdrop
    <motion.div 
      className="wiki-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* The content container has its own pop-up animation */}
      <motion.div
        className="wiki-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <button className="wiki-close" onClick={onClose}>&times;</button>
        
        <div className="wiki-article">
          <h2>Carbon Footprint Wiki</h2>
          
          <h3>What is a Carbon Footprint?</h3>
          <p>
            A carbon footprint is the total amount of greenhouse gases—primarily carbon dioxide—released into the atmosphere as a result of the activities of a particular individual, organization, or community. It's a critical metric for understanding our impact on climate change.
          </p>
          
          <h3>Primary vs. Secondary Footprints</h3>
          <p>Your footprint is often divided into two parts:</p>
          <ul>
            <li><strong>Primary Footprint:</strong> Measures direct emissions from burning fossil fuels, including energy consumption for electricity and heating, and transportation via cars and airplanes.</li>
            <li><strong>Secondary Footprint:</strong> Measures indirect emissions associated with the entire lifecycle of products we use—from their manufacturing process to their eventual disposal.</li>
          </ul>

          <blockquote>
            "The greatest threat to our planet is the belief that someone else will save it." – Robert Swan
          </blockquote>
          
          <h3>Why Tracking Matters</h3>
          <p>
            Understanding and tracking your carbon footprint is the essential first step toward reducing it. By making informed and conscious choices in high-impact areas like travel, diet, and home energy use, individuals can collectively contribute to a significant reduction in global emissions. This app is designed to empower you with that knowledge, turning abstract data into actionable insights for a sustainable future.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WikiModal;