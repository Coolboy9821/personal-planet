import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = ({ footprintData }) => {
  const data = {
    labels: ['Travel', 'Electricity', 'Water'],
    datasets: [
      {
        label: 'CO2e kg',
        data: [footprintData.travel, footprintData.electricity, footprintData.water],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: {
              position: 'top',
              labels: {
                  color: '#c9d1d9'
              }
          }
      }
  }

  return (
    <div style={{height: '200px', marginTop: '2rem'}}>
        <Doughnut data={data} options={options}/>
    </div>
  );
};

export default Results;