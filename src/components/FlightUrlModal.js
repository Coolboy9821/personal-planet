import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Modal.css'; // We'll reuse our modal CSS and add to it

const FlightUrlModal = ({ onClose, onConfirm }) => {
  const [url, setUrl] = useState('');
  const [flightData, setFlightData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError('');
    setFlightData(null);
    try {
      const response = await fetch('http://localhost:3001/api/scrape-flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setFlightData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConfirm = () => {
    if (flightData) {
      // We pass both distance and the calculated emission in kg
      onConfirm({ distance: flightData.distance, emission: parseFloat(flightData.carbonEmission) });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Analyze Flight Itinerary</h2>
        <p className="modal-subtitle">Paste a flight URL from a supported site to automatically calculate its impact.</p>
        
        <div className="url-input-group">
          <input 
            type="text" 
            placeholder="e.g., https://flights.booking.com/..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={handleAnalyze} disabled={isLoading || !url}>
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {flightData && (
          <motion.div 
            className="flight-ticket"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="ticket-header">
              <span>BOARDING PASS</span>
              <span>{flightData.flightClass}</span>
            </div>
            <div className="ticket-body">
              <div className="ticket-airports">
                <div>
                  <h3>{flightData.origin}</h3>
                  <p>Origin</p>
                </div>
                <svg width="40" height="40" viewBox="0 0 24 24"><path fill="currentColor" d="M22 14.5c0 .28-.22.5-.5.5h-2.58l-3.3-3.3l.1-.1c.32-.32.58-.73.74-1.16l2.16 2.16c.19.19.44.29.71.29s.52-.1.71-.29c.39-.39.39-1.02 0-1.41L17.71 9.5c-.39-.39-1.02-.39-1.41 0l-2.16 2.16c-.43.16-.84.42-1.16.74l-.1.1l-3.3-3.3V6.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5v2.58l-1.92-1.92c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l11.4 11.4c.19.19.44.29.71.29s.52-.1.71-.29c.39-.39.39-1.02 0-1.41L12.58 15H15l5.58 5.58c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-5.3-5.3l.1-.1c.32-.32.58-.73.74-1.16l2.16 2.16c.19.19.44.29.71.29s.52-.1.71-.29c.39-.39.39-1.02 0-1.41l-2.16-2.16c-.43.16-.84.42-1.16.74l-.1.1L15 12.58V10l-1.67-1.67L2 19.59c-.39.39-.39 1.02 0 1.41c.19.19.44.29.71.29s.52-.1.71-.29L19.59 4.41c.39-.39.39-1.02 0-1.41s-1.02-.39-1.41 0L6.5 14.67L4.41 12.58c-.39-.39-1.02-.39-1.41 0s-.39 1.02 0 1.41l2.16 2.16c.43-.16.84-.42 1.16-.74l.1-.1l3.3 3.3H6.5c-.28 0-.5.22-.5.5s.22.5.5.5h2.58l1.92 1.92c.19.19.44.29.71.29s.52-.1.71-.29l1.41-1.41l-1.16-1.16c-.16.43-.42.84-.74 1.16l-.1.1l-3.3 3.3H2.5c-.28 0-.5.22-.5.5s.22.5.5.5h19c.28 0 .5-.22.5-.5Z"/></svg>
                <div>
                  <h3>{flightData.destination}</h3>
                  <p>Destination</p>
                </div>
              </div>
              <div className="ticket-details">
                <p><strong>Distance:</strong> {flightData.distance} km</p>
                <p><strong>Passengers:</strong> {flightData.passengers}</p>
                <p><strong>Total Emissions:</strong> {flightData.carbonEmission} kg CO₂e</p>
              </div>
            </div>
            <div className="ticket-footer">
              <button onClick={handleConfirm} className="btn-primary">Use This Trip</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FlightUrlModal;