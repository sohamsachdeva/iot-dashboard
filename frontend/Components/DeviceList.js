import React from "react";

function formatLastSeen(timestamp, now) {
  if (!timestamp) return "Never";
  const time = new Date(timestamp);
  if (Number.isNaN(time.getTime())) return "Unknown";

  const diffSeconds = Math.max(0, Math.floor((now - time.getTime()) / 1000));
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  return `${Math.floor(diffSeconds / 86400)}d ago`;
}

const DeviceList = ({ devices, selectedDevice, onSelect, now }) => {
  if (!devices.length) {
    return (
      <aside className="device-list">
        <h3>Devices</h3>
        <p className="device-empty">No devices found.</p>
      </aside>
    );
  }

  return (
    <aside className="device-list">
      <h3>Devices</h3>
      {devices.map((device) => {
        const id = device.deviceId || device.id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={selectedDevice === id ? "active" : ""}
          >
            <span>{id}</span>
            <small>{formatLastSeen(device.lastSeen, now || Date.now())}</small>
          </button>
        );
      })}
    </aside>
  );
};

export default DeviceList;
