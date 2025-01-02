import React, { useState } from "react";
import { Line, Bar, Radar, Doughnut, Pie, Bubble, Scatter, PolarArea } from 'react-chartjs-2'; // Import chart components
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, RadarController, RadialLinearScale, ArcElement, DoughnutController, PieController, ScatterController, PolarAreaController, BubbleController } from 'chart.js'; // Import necessary components

// Register the necessary components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  RadarController, 
  RadialLinearScale, 
  ArcElement, 
  DoughnutController, 
  PieController, 
  ScatterController, 
  PolarAreaController, 
  BubbleController
);

const ChartGenerator = ({ data, columnHeaders }) => {
  const [selectedColumns, setSelectedColumns] = useState([]);  // State for selected columns
  const [selectedChartType, setSelectedChartType] = useState("line"); // Default chart type
  const [chartData, setChartData] = useState(null); // Store chart data
  const [dropdownOpen, setDropdownOpen] = useState(false); // Manage dropdown visibility

  // Handle checkbox selection for columns
  const handleColumnSelection = (e) => {
    const { value, checked } = e.target;
    setSelectedColumns((prevSelected) => 
      checked ? [...prevSelected, value] : prevSelected.filter((col) => col !== value)
    );
  };

  // Generate chart data after selecting columns
  const generateChartData = () => {
    if (selectedColumns.length === 0 || !data.length) return;

    const datasets = selectedColumns.map((col) => {
      const colIndex = columnHeaders.indexOf(col);
      const colData = data.map((row) => parseFloat(row[colIndex])).filter((val) => !isNaN(val));
      return { label: col, data: colData, backgroundColor: generateRandomColor(), borderColor: generateRandomColor() };
    });

    // Dynamically generate labels based on row index or other logic
    const labels = data.map((_, i) => `Row ${i + 1}`);

    setChartData({
      labels: labels,
      datasets,
    });
  };

  // Generate random color for the chart
  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  // Render the appropriate chart based on selected chart type
  const renderChart = () => {
    if (!chartData) return null;

    switch (selectedChartType) {
      case "line":
        return <Line data={chartData} />;
      case "bar":
        return <Bar data={chartData} />;
      case "radar":
        return <Radar data={chartData} options={getRadarOptions()} />;
      case "pie":
        return <Pie data={chartData} />;
      case "doughnut":
        return <Doughnut data={chartData} />;
      case "bubble":
        return <Bubble data={chartData} options={getBubbleOptions()} />;
      case "scatter":
        return <Scatter data={chartData} options={getScatterOptions()} />;
      case "polarArea":
        return <PolarArea data={chartData} />;
      default:
        return <Line data={chartData} />;
    }
  };

  // Options for radar chart
  const getRadarOptions = () => {
    return {
      scale: {
        ticks: {
          beginAtZero: true,
          suggestedMin: 0,
        },
      },
      elements: {
        line: {
          tension: 0.4,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  };

  // Options for bubble chart
  const getBubbleOptions = () => {
    return {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        },
        y: {
          type: 'linear'
        },
        z: {
          min: 0,
        }
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  };

  // Options for scatter chart
  const getScatterOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
        },
        y: {
          type: 'linear',
        },
      },
    };
  };

  return (
    <div>
      {/* Column selection dropdown with checkboxes */}
      <div>
        <h4>Select Columns</h4>
        <div className="dropdown-container">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropdown-toggle">
            {selectedColumns.length === 0 ? "Select Columns" : `Selected ${selectedColumns.length} column(s)`}
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {columnHeaders.map((header) => (
                <label key={header} style={{ display: 'block' }}>
                  <input
                    type="checkbox"
                    value={header}
                    checked={selectedColumns.includes(header)}  // Make it checked if already selected
                    onChange={handleColumnSelection}
                  />
                  {header}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart type selection */}
      <div>
        <h4>Select Chart Type</h4>
        <select onChange={(e) => setSelectedChartType(e.target.value)} value={selectedChartType}>
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="radar">Radar Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="doughnut">Doughnut Chart</option>
          <option value="bubble">Bubble Chart</option>
          <option value="scatter">Scatter Chart</option>
          <option value="polarArea">Polar Area Chart</option>
        </select>
      </div>

      {/* Generate button */}
      <button onClick={generateChartData}>Generate Chart</button>

      {/* Display chart */}
      {renderChart()}
    </div>
  );
};

export default ChartGenerator;
