import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { MapPin, Plane } from "lucide-react";
import './Modal.css'; // We will create this file next

// A custom component to handle map clicks
function LocationMarker({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Emission factors (kg CO2e per passenger-km). Simplified for the demo.
const EMISSION_FACTORS = {
  car: 0.14,
  train: 0.04,
  plane: 0.25, // Short-haul flight
};

const TravelCalculatorModal = ({ onClose, onConfirm }) => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(0);
  const [transportMode, setTransportMode] = useState('car');

  // Handle clicks on the map to set origin and destination
  const handleMapClick = (latlng) => {
    if (!origin) {
      setOrigin(latlng);
    } else if (!destination) {
      setDestination(latlng);
    }
  };

  // Calculate distance when both points are set
  useEffect(() => {
    if (origin && destination) {
      const distInMeters = origin.distanceTo(destination);
      setDistance(distInMeters / 1000); // Convert to km
    }
  }, [origin, destination]);

  const carbonEmission = useMemo(() => {
    return distance * EMISSION_FACTORS[transportMode];
  }, [distance, transportMode]);

  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setDistance(0);
  };

  const handleConfirm = () => {
    onConfirm(distance);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Travel Calculator</h2>
        <div className="map-container">
          <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <LocationMarker onMapClick={handleMapClick} />
            {origin && <Marker position={origin}><Popup>Origin</Popup></Marker>}
            {destination && <Marker position={destination}><Popup>Destination</Popup></Marker>}
          </MapContainer>
        </div>
        <div className="controls-container">
            <h3>{!origin ? 'Click map to set Origin' : !destination ? 'Click map to set Destination' : 'Trip Details'}</h3>
            <div className="stats">
                <p>Distance: <strong>{distance.toFixed(2)} km</strong></p>
                <div className="transport-select">
                    <label htmlFor="transport">Transport:</label>
                    <select id="transport" value={transportMode} onChange={(e) => setTransportMode(e.target.value)}>
                        <option value="car">Car</option>
                        <option value="train">Train</option>
                        <option value="plane">Plane</option>
                    </select>
                </div>
                <p>Est. CO₂e: <strong>{carbonEmission.toFixed(2)} kg</strong></p>
            </div>
            <div className="buttons">
                <button onClick={handleReset} className="btn-secondary">Reset</button>
                <button onClick={handleConfirm} className="btn-primary" disabled={!destination}>Confirm Travel</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TravelCalculatorModal;