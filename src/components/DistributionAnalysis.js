import React, { useState } from "react";
import * as ss from "simple-statistics";
import { Line } from "react-chartjs-2"; // Import Chart.js Line chart
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DistributionAnalysis = ({ data, columnHeaders }) => {
  const [selectedColumn, setSelectedColumn] = useState("");
  const [statistics, setStatistics] = useState({});
  const [chartData, setChartData] = useState(null);

  const handleColumnChange = (event) => {
    const column = event.target.value;
    setSelectedColumn(column);
    
    if (column) {
      // Calculate statistics and update chart data
      const colIndex = columnHeaders.indexOf(column);
      const columnData = data
        .map((row) => parseFloat(row[colIndex]))
        .filter((val) => !isNaN(val));

      if (columnData.length === 0) return;

      const meanVal = ss.mean(columnData);
      const stdDevVal = ss.standardDeviation(columnData);
      const medianVal = ss.median(columnData);
      const varianceVal = ss.variance(columnData);
      
      setStatistics({
        mean: meanVal.toFixed(2),
        median: medianVal.toFixed(2),
        variance: varianceVal.toFixed(2),
        stdDev: stdDevVal.toFixed(2),
      });

      // Generate chart data
      setChartData({
        labels: Array.from({ length: columnData.length }, (_, index) => index + 1),
        datasets: [
          {
            label: `${column} Distribution`,
            data: columnData,
            fill: false,
            borderColor: "rgba(75,192,192,1)",
            tension: 0.1,
          },
        ],
      });
    }
  };

  return (
    <div>
      <select onChange={handleColumnChange}>
        <option value="">Select a column</option>
        {columnHeaders.map((header) => (
          <option key={header} value={header}>
            {header}
          </option>
        ))}
      </select>

      {selectedColumn && (
        <div>
          <h3>Statistics for {selectedColumn}</h3>
          <p>Mean: {statistics.mean}</p>
          <p>Median: {statistics.median}</p>
          <p>Variance: {statistics.variance}</p>
          <p>Standard Deviation: {statistics.stdDev}</p>
        </div>
      )}

      {/* Render chart */}
      {chartData && (
        <div style={{ width: "80%", margin: "auto" }}>
          <Line data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: `Distribution of ${selectedColumn}` } } }} />
        </div>
      )}
    </div>
  );
};

export default DistributionAnalysis;
