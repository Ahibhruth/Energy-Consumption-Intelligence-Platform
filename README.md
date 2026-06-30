# EnergyIQ Analytics Dashboard

A modern, interactive analytics dashboard for energy consumption forecasting and anomaly detection, powered by Databricks.

## Features

- 📊 **Overview Dashboard**: Real-time energy consumption metrics and KPIs
- 🔍 **Anomaly Detection**: Statistical outlier detection with z-score and spike analysis
- ⚠️ **Alerts Page**: High-risk household identification
- 📈 **Cluster Analysis**: Household segmentation and consumption patterns
- 📉 **Model Metrics**: ML model performance tracking

## Project Structure

```
energy-ai-dashboard/
├── energyiq-backend/          # Backend proxy server
│   ├── src/
│   │   ├── server.js          # Main server with Databricks proxy
│   │   └── routes/
│   │       └── anomalies.js
│   └── package.json
├── src/                       # Frontend React app
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Main dashboard pages
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API services and queries
│   ├── utils/                 # Utility functions
│   └── styles/                # CSS stylesheets
└── package.json
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Databricks workspace with:
  - SQL Warehouse
  - Databricks personal access token
  - Required tables: `energy_predictions`, `model_metrics`, `household_cluster_mapping`

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd energy-ai-dashboard
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd energyiq-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `energyiq-backend` directory:

```env
DATABRICKS_HOST=
DATABRICKS_TOKEN=
DATABRICKS_HTTP_PATH=
PORT=5000
```

**How to get these values:**
- `DATABRICKS_HOST`: Your Databricks workspace URL 
- `DATABRICKS_TOKEN`: Create a personal access token in Databricks → Settings → User Settings → Access tokens
- `DATABRICKS_HTTP_PATH`: Go to SQL Warehouses → Select your warehouse → Connection details → HTTP Path

### 3. Frontend Setup

Open a new terminal, navigate to the project root:

```bash
cd energy-ai-dashboard
```

Install dependencies:

```bash
npm install
```

### 4. Start the Application

**First, start the backend server** (in `energyiq-backend` directory):

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

**Then, start the frontend** (in project root):

```bash
npm start
```

The app will open automatically at `http://localhost:3000`

## Configuration

On first launch, you'll see a configuration modal. Enter your Databricks credentials (same as in backend `.env` file). These are stored locally in your browser.

## Usage

### Pages

1. **Overview**: See total predictions, peak demand hours, and cluster-wise consumption
2. **Anomaly Detection**: View statistical anomalies and consumption spikes
3. **Alerts**: Identify high-risk households
4. **Cluster Analysis**: Compare consumption patterns across clusters
5. **Model Metrics**: Track ML model performance (RMSE, MAE)

### Database Tables Required

Ensure these tables exist in your Databricks workspace:

- `workspace.default.energy_predictions`: Time-series energy predictions
- `workspace.default.model_metrics`: Model performance metrics
- `workspace.default.household_cluster_mapping`: Household cluster assignments

## Technology Stack

**Frontend:**
- React 18
- Chart.js + react-chartjs-2
- Lucide React (icons)

**Backend:**
- Express.js
- CORS
- dotenv
- Databricks SQL API

## Troubleshooting

- **Backend won't start**: Check if ports 3000/5000 are in use
- **No data loading**: Verify Databricks credentials and table existence
- **Anomalies not showing**: Ensure `energy_predictions` table has recent data

## License

ISC
