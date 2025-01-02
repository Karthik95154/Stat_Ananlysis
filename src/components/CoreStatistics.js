import React from "react";
import * as ss from "simple-statistics";

const CoreStatistics = ({ data, columnHeaders }) => {
  const calculateStatistics = (column) => {
    const colIndex = columnHeaders.indexOf(column);
    const columnData = data.map((row) => parseFloat(row[colIndex])).filter((val) => !isNaN(val));
    if (columnData.length === 0) return {};

    return {
      mean: ss.mean(columnData).toFixed(2),
      median: ss.median(columnData).toFixed(2),
      mode: ss.mode(columnData),
      variance: ss.variance(columnData).toFixed(2),
      stdDev: ss.standardDeviation(columnData).toFixed(2),
    };
  };

  const [selectedColumn, setSelectedColumn] = React.useState("");
  const stats = selectedColumn ? calculateStatistics(selectedColumn) : {};

  return (
    <div>
      <select onChange={(e) => setSelectedColumn(e.target.value)}>
        <option value="">Select a column</option>
        {columnHeaders.map((header) => <option key={header}>{header}</option>)}
      </select>
      {selectedColumn && (
        <div>
          <p>Mean: {stats.mean}</p>
          <p>Median: {stats.median}</p>
          <p>Mode: {stats.mode}</p>
          <p>Variance: {stats.variance}</p>
          <p>StdDev: {stats.stdDev}</p>
        </div>
      )}
    </div>
  );
};

export default CoreStatistics;
