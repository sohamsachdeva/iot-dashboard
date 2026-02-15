import React from "react";

function DataChart({ data }) {
  if (!data.length) {
    return <p className="chart-empty">No telemetry to display yet.</p>;
  }

  const temps = data.map((d) => Number(d.temperature ?? 0));
  const humidities = data.map((d) => Number(d.humidity ?? 0));

  const max = Math.max(...temps, ...humidities, 1);
  const min = Math.min(...temps, ...humidities, 0);
  const range = max - min || 1;

  const toPath = (values) =>
    values
      .map((value, i) => {
        const x = (i / Math.max(values.length - 1, 1)) * 100;
        const y = ((max - value) / range) * 100;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

  return (
    <div className="chart-card">
      <h4>Recent Trend</h4>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="chart-svg">
        <path d={toPath(temps)} className="chart-line chart-temp" />
        <path d={toPath(humidities)} className="chart-line chart-humidity" />
      </svg>
      <div className="chart-legend">
        <span><i className="dot dot-temp" /> Temperature</span>
        <span><i className="dot dot-humidity" /> Humidity</span>
      </div>
    </div>
  );
}

export default DataChart;
