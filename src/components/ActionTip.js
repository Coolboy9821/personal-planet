import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ActionTip.css'; // We'll create this CSS file next

const ActionTip = ({ tip }) => {
  return (
    <div className="tip-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={tip} // The key is crucial for AnimatePresence to detect changes
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="tip-box"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          <p>{tip}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ActionTip;