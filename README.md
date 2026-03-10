# 🚀 GNC Telemetry AI Dashboard
### Aerospace GNC Analysis with Llama 3.3 & Cloudflare Edge Computing

An intelligent telemetry analysis platform that bridges high-fidelity flight simulations with modern LLM-driven diagnostics. This dashboard allows engineers to ingest flight telemetry, visualize control system performance (Step responses), and receive automated GNC insights via Llama 3.3.

## 🛠️ The Tech Stack
- **Intelligence:** Meta Llama 3.3-70B (via Cloudflare Workers AI)
- **Persistent State:** Cloudflare Durable Objects (SQLite-backed)
- **Visualization:** Chart.js (Dual-Axis GNC Dashboard)
- **Markdown Parsing:** Marked.js
- **Backend:** Cloudflare Workers (TypeScript / Edge Runtime)

## ✨ Key Features
- **Automated Anomaly Detection:** Upon CSV upload, the AI automatically scans for exactly 5 critical Points of Interest (POIs).
- **Interactive Graph Labeling:** Critical GNC events (Saturation, Overshoot, Aero-Torque) are labeled directly on the graph with hoverable AI-generated insights.
- **Dual-Axis Visualization:** Real-time tracking of Rocket Roll (deg) vs. Fin Actuator Angle (deg) to identify control lag and hardware saturation.
- **Persistent Flight Memory:** Uses Durable Objects to store flight data across sessions, allowing for long-form engineering dialogue.

## 🚀 Getting Started

### 1. Prepare Flight Data
To use the dashboard, you need flight telemetry in CSV format. 
- **Example Data Provided:** I have included `example_data/flight_001_nominal.csv` and `example_data/flight_002_anomaly.csv` in this repository for testing.
- **Expected Columns:** `timestamp`, `actual_roll`, `cmd_roll`, `baro_alt`, `roll_rate`, `vert_vel`, `servo_cmd`, `servo_act`.

### 2. Launch the Dashboard
Ensure you have the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed.
```bash
# Install dependencies
npm install

# Start the local development server
npx wrangler dev