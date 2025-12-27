# CyberShield IDS 🛡️

**Real-time Network Intrusion Detection System (PIDS) powered by Machine Learning.**

> **Note:** This repository hosts the **Demo** version of our Final Year Project. It is designed to detect and classify network attacks in real-time using a decoupled architecture (React + Django).

## 📖 Project Overview
CyberShield IDS is a network security tool that captures live traffic, analyzes it using a 2-stage Machine Learning pipeline, and visualizes potential threats on a dashboard. It is designed to identify malicious patterns (like DDoS attacks) instantly, moving beyond static datasets to handle live network environments.

## 🚀 Key Features
* **Live Packet Sniffing:** Integrated **Scapy** and **Npcap** to capture network traffic in real-time.
* **Dual-Stage ML Engine:**
    * **Detection (Stage 1):** Uses **XGBoost** to classify traffic as *Normal* or *Attack* (~98% Accuracy).
    * **Classification (Stage 2):** Uses **LightGBM** to identify specific attack types (e.g., *DDoS-LOIC-UDP*, *Probe*, *Brute Force*) (~95% Accuracy).
* **Interactive Dashboard:** A responsive **ReactJS** frontend that displays traffic statistics, live alerts, and confidence scores.
* **Stress Tested:** Validated against real-world attack simulations (e.g., LOIC UDP Floods).

## 🛠️ Tech Stack

### Backend
* **Framework:** Django REST Framework (DRF)
* **Language:** Python 3.x
* **Packet Capture:** Scapy & Npcap
* **Machine Learning:** XGBoost, LightGBM, Scikit-learn, Joblib
* **Database:** SQLite (Demo) / PostgreSQL (Production)

### Frontend
* **Library:** ReactJS
* **HTTP Client:** Axios
* **Styling:** CSS / Material UI

## ⚙️ Installation Guide

### Prerequisites
1.  **Python 3.10+** installed.
2.  **Node.js & npm** installed.
3.  **Npcap** (Required for Windows users for packet capturing) - [Download Npcap](https://npcap.com/)

### 1. Clone the Repository
```bash
git clone [https://github.com/UsmanShahab18/FYP_Demo_PIDS.git](https://github.com/UsmanShahab18/FYP_Demo_PIDS.git)
cd FYP_Demo_PIDS

# At Terminal 1
cd backend
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
# Install Python dependencies
pip install -r requirements.txt
# Apply database migrations
python manage.py migrate
# Start the Django server (Runs on port 8000)
python manage.py runserver

# At Terminal 2
python manage.py start_sniffer

# At Terminal 3
cd frontend
# Install Node modules
npm install
# Start the React application (Runs on port 3000)
npm start
