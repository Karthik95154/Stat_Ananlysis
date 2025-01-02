import React, { useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const InferentialStatisticsVisualiser = () => {
  const [selectedTopic, setSelectedTopic] = useState("Hypothesis Testing");

  const hypothesisTestingData = {
    labels: ["Z-Test", "T-Test", "Chi-Square Test", "ANOVA"],
    datasets: [
      {
        label: "Frequency of Use",
        data: [20, 25, 15, 30],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderWidth: 1,
      },
    ],
  };

  const pValuesData = {
    labels: ["0.01", "0.05", "0.1", "Others"],
    datasets: [
      {
        label: "Proportion of Use",
        data: [40, 35, 15, 10],
        backgroundColor: ["#4BC0C0", "#FF6384", "#36A2EB", "#FFCE56"],
        borderColor: ["#4BC0C0", "#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const confidenceIntervalsData = {
    labels: ["95%", "99%", "90%"],
    datasets: [
      {
        label: "Confidence Interval Usage",
        data: [50, 30, 20],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        borderColor: ["#36A2EB", "#FFCE56", "#FF6384"],
        borderWidth: 1,
      },
    ],
  };

  const samplingData = {
    labels: ["Random Sampling", "Stratified Sampling", "Cluster Sampling"],
    datasets: [
      {
        label: "Types of Sampling",
        data: [50, 30, 20],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const renderChart = () => {
    if (selectedTopic === "Hypothesis Testing") {
      return (
        <Bar
          data={hypothesisTestingData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
            },
          }}
        />
      );
    }
    if (selectedTopic === "P-values and Significance Levels") {
      return (
        <Pie
          data={pValuesData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "right" },
            },
          }}
        />
      );
    }
    if (selectedTopic === "Confidence Intervals") {
      return (
        <Bar
          data={confidenceIntervalsData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
            },
          }}
        />
      );
    }
    if (selectedTopic === "Sampling Methods") {
      return (
        <Pie
          data={samplingData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "right" },
            },
          }}
        />
      );
    }
    return null;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Inferential Statistics Visualization</h1>
      <div style={styles.dropdownContainer}>
        <label htmlFor="topic-select" style={styles.label}>
          Select Topic:
        </label>
        <select
          id="topic-select"
          style={styles.select}
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="Hypothesis Testing">Hypothesis Testing</option>
          <option value="P-values and Significance Levels">P-values and Significance Levels</option>
          <option value="Confidence Intervals">Confidence Intervals</option>
          <option value="Sampling Methods">Sampling Methods</option>
        </select>
      </div>
      <div style={styles.chartContainer}>{renderChart()}</div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    backgroundColor: "#f9f9f9",
  },
  title: {
    textAlign: "center",
    color: "#444",
    marginBottom: "20px",
  },
  dropdownContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  label: {
    fontSize: "16px",
    marginRight: "10px",
    color: "#333",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    cursor: "pointer",
  },
  chartContainer: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default InferentialStatisticsVisualiser;
