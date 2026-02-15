Unified IoT Dashboard
A full-stack IoT monitoring dashboard built with React + Node.js + Express + MongoDB + MQTT.

It supports user authentication, device-wise telemetry viewing, role-based access, and single-URL deployment (frontend + backend served together).

Features
User authentication (Register/Login) with JWT
Role-ready backend (admin, viewer, operator)
Device list with last-seen status
Live dashboard metrics:
Temperature
Humidity
Battery
Last update time
Telemetry trend chart
Auto refresh every 5s
Demo/fake telemetry mode (updates every 10s when real data is stale/missing)
One-domain deployment support (Express serves React build)
Tech Stack
Frontend
React
React Router
Axios
Custom CSS
Backend
Node.js
Express
MongoDB + Mongoose
JWT + bcrypt
MQTT (HiveMQ / Mosquitto scripts)
Project Structure
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
Environment Variables
Create backend/.env:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
PORT=5000
Local Development
1) Install dependencies
# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
2) Run backend
cd backend
npm start
3) Run frontend (dev mode)
cd frontend
npm start
Frontend: http://localhost:3000
Backend: http://localhost:5000

One-URL Production Run (Same Domain)
Build frontend and serve it from backend:

cd backend
npm run build:client
npm start
Open:

http://localhost:5000
Deployment (Render)
Build Command
npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend
Start Command
npm start --prefix backend
Required Environment Variables on Render
MONGO_URI
JWT_SECRET
MQTT Utilities (Optional)
Inside backend/:

mqttPublisher.js → publishes sample data for device_001
mqttSimulator.js → publishes data for multiple devices
mqttClient.js → subscribes and stores data in MongoDB
API Overview
POST /api/auth/register
POST /api/auth/login
GET /api/devices (auth required)
GET /api/data/:deviceId (auth required)
Notes
Default new users are assigned: device_001
If no fresh telemetry is available, dashboard enters demo mode
Frontend automatically uses:
http://localhost:5000/api in local dev
/api in production same-domain deploy
Author
Made by Soham Sachdeva


