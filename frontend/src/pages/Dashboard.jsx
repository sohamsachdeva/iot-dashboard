import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import DeviceList from "../components/DeviceList";
import DataChart from "../components/DataChart";
import "../dashboard.css";

const STALE_TELEMETRY_MS = 60 * 1000;

function Dashboard() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [useFakeData, setUseFakeData] = useState(false);

  useEffect(() => {
    let mounted = true;

    api
      .get("/devices")
      .then((res) => {
        if (!mounted) return;

        const normalized = (res.data || []).map((d) => ({
          ...d,
          id: d.id || d.deviceId,
        }));

        setDevices(normalized);
        if (normalized.length) {
          setSelectedDevice(normalized[0].id);
        }
      })
      .catch(() => {
        if (mounted) setError("Failed to load devices.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedDevice) return undefined;

    let mounted = true;

    const fetchData = () => {
      api
        .get(`/data/${selectedDevice}`)
        .then((res) => {
          if (!mounted) return;
          const incoming = res.data || [];
          if (!incoming.length) {
            setUseFakeData(true);
            return;
          }

          const latestIncoming = incoming[incoming.length - 1];
          const latestTs = latestIncoming?.timestamp
            ? new Date(latestIncoming.timestamp).getTime()
            : NaN;
          const isStale =
            Number.isNaN(latestTs) || Date.now() - latestTs > STALE_TELEMETRY_MS;

          if (isStale) {
            // Keep generated samples once demo mode is active.
            setData((prev) => (useFakeData && prev.length ? prev : incoming));
            setUseFakeData(true);
          } else {
            setData(incoming);
            setUseFakeData(false);
          }
        })
        .catch(() => {
          if (!mounted) return;
          setError("Failed to fetch telemetry.");
          setUseFakeData(true);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [selectedDevice, useFakeData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selectedDevice || !useFakeData) return undefined;

    const randomBetween = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      setData((prev) => {
        const previous = prev.length ? prev[prev.length - 1] : null;
        const temperature = Number(
          (
            (previous?.temperature ?? 24) + randomBetween(-1.5, 1.5)
          ).toFixed(1)
        );
        const humidity = Number(
          ((previous?.humidity ?? 52) + randomBetween(-3, 3)).toFixed(1)
        );
        const battery = Math.max(
          5,
          Number(((previous?.battery ?? 95) - randomBetween(0.1, 0.8)).toFixed(1))
        );

        const sample = {
          deviceId: selectedDevice,
          temperature,
          humidity,
          battery,
          timestamp: new Date().toISOString(),
        };

        return [...prev.slice(-29), sample];
      });

      setDevices((prev) =>
        prev.map((d) =>
          (d.id || d.deviceId) === selectedDevice
            ? { ...d, lastSeen: new Date().toISOString() }
            : d
        )
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedDevice, useFakeData]);

  const latest = data.length ? data[data.length - 1] : null;
  const previous = data.length > 1 ? data[data.length - 2] : null;

  const tempTrend = useMemo(() => {
    if (!latest || !previous) return "";
    if (latest.temperature > previous.temperature) return "up";
    if (latest.temperature < previous.temperature) return "down";
    return "flat";
  }, [latest, previous]);

  const metric = (value, suffix) =>
    value === null || value === undefined ? "--" : `${value}${suffix}`;

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "--";
    const time = new Date(timestamp).getTime();
    if (Number.isNaN(time)) return "--";

    const diffSeconds = Math.max(0, Math.floor((now - time) / 1000));

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Unified IoT Dashboard</h1>
          <p>Live device telemetry via MQTT</p>
        </div>
        <button type="button" className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      {error ? <p className="error-banner">{error}</p> : null}
      {loading ? <p className="loading-banner">Loading dashboard...</p> : null}

      <div className="dashboard-grid">
        <DeviceList
          devices={devices}
          selectedDevice={selectedDevice}
          onSelect={setSelectedDevice}
          now={now}
        />

        <section className="metrics-panel">
          <div className="metrics-grid">
            <article className="metric-card">
              <h3>Temperature</h3>
              <p>{metric(latest?.temperature, " C")}</p>
              <small>Trend: {tempTrend || "--"}</small>
            </article>

            <article className="metric-card">
              <h3>Humidity</h3>
              <p>{metric(latest?.humidity, "%")}</p>
              <small>Latest telemetry sample</small>
            </article>

            <article className="metric-card">
              <h3>Battery</h3>
              <p>{metric(latest?.battery ?? null, "%")}</p>
              <small>Device battery level</small>
            </article>

            <article className="metric-card">
              <h3>Last Update</h3>
              <p>{new Date(now).toLocaleTimeString()}</p>
              <small>
                {latest?.timestamp
                  ? `Telemetry: ${formatRelativeTime(latest.timestamp)}`
                  : "No telemetry yet"}
              </small>
            </article>
          </div>

          {useFakeData ? (
            <p className="loading-banner">Demo mode: fake telemetry updates every 10s.</p>
          ) : null}

          <DataChart data={data.slice(-30)} />
        </section>
      </div>

      <footer style={{ marginTop: 18, color: "#64748b", textAlign: "center" }}>
        Made by Soham Sachdeva
      </footer>
    </div>
  );
}

export default Dashboard;
