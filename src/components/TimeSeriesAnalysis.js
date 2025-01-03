import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import * as ss from "simple-statistics";

// Function to perform a basic stationarity check using rolling mean
const isStationary = (data) => {
  const windowSize = Math.floor(data.length / 2);
  const rollingMean1 = ss.mean(data.slice(0, windowSize));
  const rollingMean2 = ss.mean(data.slice(windowSize));
  return Math.abs(rollingMean1 - rollingMean2) < 1e-2; // Threshold for stationarity
};

function TimeSeriesAnalysis({ data, columnHeaders }) {
  const [dateColumn, setDateColumn] = useState(columnHeaders[0]);
  const [valueColumn, setValueColumn] = useState(columnHeaders[1]);
  const [chartData, setChartData] = useState(null);
  const [mae, setMae] = useState(null);
  const [mse, setMse] = useState(null);
  const [autocorrelation, setAutocorrelation] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState("Original Data");
  const [trendLine, setTrendLine] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [emaData, setEmaData] = useState(null);
  const [differencingData, setDifferencingData] = useState(null);
  const [stationarityTest, setStationarityTest] = useState(null);

  useEffect(() => {
    if (data.length === 0) return;

    const formattedData = data.map(row => {
      const date = row[columnHeaders.indexOf(dateColumn)];
      const value = row[columnHeaders.indexOf(valueColumn)];
      return { date, value };
    }).filter(row => row.date && row.value !== null && row.value !== undefined);

    if (formattedData.length === 0) {
      console.error("No valid data entries after filtering null or undefined values.");
      return;
    }

    const values = formattedData.map(row => row.value);

    // Moving Average
    const movingAverage = values.map((value, index, arr) => {
      if (index < 4) return null; // Assuming window size of 5
      const windowData = arr.slice(index - 4, index + 1);
      return ss.mean(windowData);
    });

    const actualValues = values.slice(4);
    const predictedValues = movingAverage.slice(4);

    // Exponential Moving Average (EMA)
    const alpha = 2 / (values.length + 1);
    const ema = values.reduce((acc, value, index) => {
      if (index === 0) return [value];
      const prevEma = acc[index - 1];
      const newEma = alpha * value + (1 - alpha) * prevEma;
      return [...acc, newEma];
    }, []);

    // Differencing
    const differencing = values.map((value, index, arr) => {
      if (index === 0) return null;
      return value - arr[index - 1];
    }).slice(1);

    // Trend Line Calculation
    const linReg = ss.linearRegression(values.map((value, index) => [index, value]));
    const linRegLine = ss.linearRegressionLine(linReg);
    const trendLineData = values.map((_, index) => linRegLine(index));

    // Simple ARIMA-like Forecasting (Using basic trend and seasonality)
    const forecast = [...values];
    for (let i = values.length; i < values.length + 12; i++) {
      const trend = linRegLine(i);
      const seasonalComponent = values[i % values.length]; // Repeat seasonal pattern
      forecast.push(trend + seasonalComponent - linRegLine(i % values.length));
    }

    // Chart Data
    const newChartData = {
      labels: formattedData.map((row) => row.date).concat(Array.from({ length: 12 }, (_, i) => `Forecast ${i + 1}`)),
      datasets: [
        {
          label: 'Original Data',
          data: values,
          borderColor: 'blue',
          fill: false,
        },
        {
          label: 'Moving Average',
          data: movingAverage,
          borderColor: 'red',
          fill: false,
        },
        {
          label: 'Trend Line',
          data: trendLineData,
          borderColor: 'green',
          fill: false,
        },
        {
          label: 'Forecast',
          data: forecast,
          borderColor: 'purple',
          fill: false,
        },
        {
          label: 'Exponential Moving Average (EMA)',
          data: ema,
          borderColor: 'orange',
          fill: false,
        },
        {
          label: 'Differencing',
          data: differencing,
          borderColor: 'gray',
          fill: false,
        }
      ],
    };

    // MAE and MSE Calculation
    const calculateMAE = (actual, predicted) => {
      return actual.reduce((sum, value, index) => sum + Math.abs(value - predicted[index]), 0) / actual.length;
    };

    const calculateMSE = (actual, predicted) => {
      return actual.reduce((sum, value, index) => sum + Math.pow(value - predicted[index], 2), 0) / actual.length;
    };

    const maeValue = calculateMAE(actualValues, predictedValues);
    const mseValue = calculateMSE(actualValues, predictedValues);

    // Autocorrelation Calculation
    const calculateAutocorrelation = (data, lag) => {
      const mean = ss.mean(data);
      const variance = ss.variance(data);
      let autoCovariance = 0;

      for (let i = 0; i < data.length - lag; i++) {
        autoCovariance += (data[i] - mean) * (data[i + lag] - mean);
      }

      return autoCovariance / (data.length - lag) / variance;
    };

    const acf = Array.from({ length: 20 }, (_, k) => calculateAutocorrelation(values, k + 1));

    // Stationarity Test
    const stationarity = isStationary(values) ? "Stationary" : "Non-Stationary";
    setStationarityTest(stationarity);

    setChartData(newChartData);
    setMae(maeValue);
    setMse(mseValue);
    setAutocorrelation(acf);
    setTrendLine(trendLineData);
    setForecastData(forecast);
    setEmaData(ema);
    setDifferencingData(differencing);

    console.log("New Chart Data: ", newChartData);
  }, [data, dateColumn, valueColumn, columnHeaders]);

  const handleDateColumnChange = (e) => setDateColumn(e.target.value);
  const handleValueColumnChange = (e) => setValueColumn(e.target.value);
  const handleAnalysisChange = (e) => setSelectedAnalysis(e.target.value);

  const renderSelectedAnalysis = () => {
    switch (selectedAnalysis) {
      case "Original Data":
        return <Line data={chartData} />;
      case "Moving Average":
        return <Line data={{
          labels: chartData.labels,
          datasets: [
            {
              label: 'Moving Average',
              data: chartData.datasets[1].data,
              borderColor: 'red',
              fill: false,
            }
          ]
        }} />;
      case "Autocorrelation":
        return <Line data={{
          labels: [...Array(20).keys()],
          datasets: [
            {
              label: 'Autocorrelation',
              data: autocorrelation,
              borderColor: 'black',
              fill: false,
            }
          ]
        }} />;
      case "Trend Line":
        return <Line data={{
          labels: chartData.labels,
          datasets: [
            {
              label: 'Trend Line',
              data: trendLine,
              borderColor: 'green',
              fill: false,
            }
          ]
        }} />;
      case "Forecast":
        return <Line data={{
          labels: chartData.labels,
          datasets: [
            {
              label: 'Forecast',
              data: forecastData,
              borderColor: 'purple',
              fill: false,
            }
          ]
        }} />;
      case "Exponential Moving Average (EMA)":
        return <Line data={{
          labels: chartData.labels,
          datasets: [
            {
              label: 'Exponential Moving Average (EMA)',
              data: emaData,
              borderColor: 'orange',
              fill: false,
            }
          ]
        }} />;
      case "Differencing":
        return <Line data={{
          labels: chartData.labels.slice(1), // Adjust labels for differencing
          datasets: [
            {
              label: 'Differencing',
              data: differencingData,
              borderColor: 'gray',
              fill: false,
            }
          ]
        }} />;
      case "Stationarity Test":
        return <div>{`The series is ${stationarityTest}`}</div>;
      case "All Graphs":
        return <Line data={chartData} />;
      default:
        return <p>Select an analysis to view.</p>;
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h2>Time Series Analysis</h2>
      <div>
        <label>
          Date Column:
          <select value={dateColumn} onChange={handleDateColumnChange}>
            {columnHeaders.map((header, index) => (
              <option key={index} value={header}>{header}</option>
            ))}
          </select>
        </label>
        <label>
          Value Column:
          <select value={valueColumn} onChange={handleValueColumnChange}>
            {columnHeaders.map((header, index) => (
              <option key={index} value={header}>{header}</option>
            ))}
          </select>
        </label>
        <label>
          Select Analysis:
          <select value={selectedAnalysis} onChange={handleAnalysisChange}>
            <option value="Original Data">Original Data</option>
            <option value="Moving Average">Moving Average</option>
            <option value="Autocorrelation">Autocorrelation</option>
            <option value="Trend Line">Trend Line</option>
            <option value="Forecast">Forecast</option>
            <option value="Exponential Moving Average (EMA)">Exponential Moving Average (EMA)</option>
            <option value="Differencing">Differencing</option>
            <option value="Stationarity Test">Stationarity Test</option>
            <option value="All Graphs">All Graphs</option>
          </select>
        </label>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p><b>Mean Absolute Error (MAE):</b> {mae}</p>
        <p><b>Mean Squared Error (MSE):</b> {mse}</p>
      </div>
      {chartData ? (
        <div style={{ width: '600px', height: '400px', display: 'flex', justifyContent: 'center' }}>
          {renderSelectedAnalysis()}
        </div>
      ) : (
        <p>No data available to plot the graph.</p>
      )}
    </div>
  );
}

export default TimeSeriesAnalysis;
