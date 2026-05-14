======================================================
  Personal Planet - Carbon Footprint Visualizer
======================================================

Thank you for reviewing my project for the HackRaid-2k25 hackathon!

This project consists of a React frontend and a Node.js backend that must be run concurrently.

--------------------
  HOW TO RUN
--------------------

1.  PREREQUISITES:
    - You must have Node.js and npm installed on your machine.

2.  INSTALL DEPENDENCIES:
    - Open your terminal or command prompt in this project folder (`personal-planet`).
    - Run the following command. This will download all the necessary libraries (it will recreate the `node_modules` folder).
      
      npm install

3.  RUN THE BACKEND SERVER:
    - In your terminal, run this command:
    
      node server.js
      
    - You should see the message: "✈️ Flight data server listening on http://localhost:3001"
    - **Leave this terminal window open.**

4.  RUN THE FRONTEND APP:
    - Open a SECOND, NEW terminal window.
    - Navigate to this same project folder again.
    - In the new terminal, run this command:
    
      npm start
      
    - The application should open automatically in your browser at http://localhost:3000

--------------------
  FEATURES
--------------------
- Interactive 3D Globe that visually changes based on carbon footprint.
- Flight URL Importer using a Node.js backend for live data scraping.
- Live Map Calculator for calculating trip distance and impact.
- Carbon Heat Signature visualization on the globe.
- A full-screen "Eco-Hub" dashboard with historical data, gamified achievements, and smart insights.
- Educational Wiki and a procedurally generated constellation background.