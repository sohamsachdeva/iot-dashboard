# Unified IoT Dashboard

A full-stack IoT monitoring dashboard built with **React + Node.js + Express + MongoDB + MQTT**.

It supports user authentication, device-wise telemetry viewing, role-based access, and single-URL deployment (frontend + backend served together).

---

## Features

- User authentication (Register/Login) with JWT
- Role-ready backend (`admin`, `viewer`, `operator`)
- Device list with last-seen status
- Live dashboard metrics:
  - Temperature
  - Humidity
  - Battery
  - Last update time
- Telemetry trend chart
- Auto refresh every 10s
- Demo/fake telemetry mode (updates every 10s when real data is stale/missing)
- One-domain deployment support (Express serves React build)

---

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Custom CSS

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT + bcrypt
- MQTT (HiveMQ / Mosquitto scripts)

---

## Project Structure

```bash
iot-dashboard/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   └── App.js
│   └── package.json
└── .gitignore
echo "##Author" >> README.md

      
