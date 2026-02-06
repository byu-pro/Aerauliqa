# Aerauliqa - Indoor Air Quality Monitor App

A beautiful, modern mobile web app for monitoring Indoor Air Quality (IAQ) sensor readings. Designed for iOS and Android smartphones.

## 🌬️ Features

- **Real-time Air Quality Monitoring** - View sensor readings at a glance
- **4 Sensor Types Displayed:**
  - 🌡️ Temperature (°C)
  - 💧 Humidity (%)
  - 🧪 VOC - Volatile Organic Compounds (ppb)
  - 🫁 CO₂ - Carbon Dioxide (ppm)
- **Air Quality Score** - Combined 0-100 score based on all sensor readings
- **Status Indicators** - Color-coded levels matching the device LED:
  - 🔵 **Blue** - Excellent air quality
  - 🟢 **Green** - Normal air quality
  - 🟡 **Yellow** - Poor air quality
  - 🔴 **Red** - Very poor air quality
- **Progressive Web App (PWA)** - Install on your home screen for native-like experience
- **Offline Support** - Works even without internet connection

## 🎨 Design Philosophy

The app follows the principles outlined in the brief:
- **Fresh & Clean** - Light colors and ample whitespace
- **Intuitive** - Easy to understand at a glance, even for non-technical users
- **Modern & Technological** - Premium design with subtle animations
- **Clarity First** - Air quality status is immediately visible
- **Non-overlapping Colors** - Background colors don't interfere with status indicators

## 📱 Screenshots

Open `http://localhost:3000` in a mobile browser or use Chrome DevTools (F12) to simulate mobile viewport.

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   npx http-server -p 3000
   ```

2. **Open in browser:**
   Navigate to `http://localhost:3000`

3. **Mobile Preview:**
   - Use Chrome DevTools (F12) → Toggle Device Toolbar
   - Select iPhone 14 Pro or similar device
   - Or scan QR code with your phone (when on same network)

## 📁 Project Structure

```
Aerauliqa/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS with design system
├── app.js              # JavaScript application logic
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker for offline support
└── images/
    ├── AerauliqaApp_whitelogo.png    # White logo for dark theme
    └── AerauliqaApp_color logo-01.svg # Color logo
```

## 🔧 Air Quality Scoring

The app calculates an overall air quality score (0-100) based on:

| Sensor | Excellent | Normal | Poor | Very Poor |
|--------|-----------|--------|------|-----------|
| Temperature | 20-24°C | 18-26°C | 15-30°C | <15°C or >30°C |
| Humidity | 40-60% | 30-70% | 20-80% | <20% or >80% |
| VOC | <150 ppb | <300 ppb | <500 ppb | ≥500 ppb |
| CO₂ | <600 ppm | <1000 ppm | <1500 ppm | ≥1500 ppm |

VOC and CO₂ readings are weighted more heavily as they have a greater impact on perceived air quality.

## 🔌 Device Integration

Currently, the app runs in demo mode with simulated sensor updates. To connect to the actual Aerauliqa IAQ device:

1. **Bluetooth Low Energy (BLE):**
   - Use the Web Bluetooth API
   - The device would advertise sensor values via BLE characteristics

2. **WiFi/Network:**
   - Device exposes a local API endpoint
   - App polls for sensor data or uses WebSocket for real-time updates

## 📦 PWA Installation

The app can be installed on mobile devices:

1. Open the app in Safari (iOS) or Chrome (Android)
2. Tap the share button
3. Select "Add to Home Screen"
4. The app will function like a native mobile app

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --status-excellent: #00d4ff;  /* Blue */
    --status-normal: #00e676;     /* Green */
    --status-poor: #ffb300;       /* Yellow */
    --status-very-poor: #ff5252;  /* Red */
}
```

### Thresholds
Edit the sensor thresholds in `app.js`:
```javascript
const SENSOR_THRESHOLDS = {
    temperature: { excellent: { min: 20, max: 24 }, ... },
    // ...
};
```

## 📄 License

© 2026 Aerauliqa. All rights reserved.

## 🔗 Links

- Website: [www.aerauliqa.com](http://www.aerauliqa.com)
- Location: Montichiari (Bs), Italy
