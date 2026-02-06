/**
 * Aerauliqa IAQ Monitor App
 * Real-time Indoor Air Quality Monitoring
 */

// Air Quality Status Thresholds
const AIR_QUALITY_LEVELS = {
    EXCELLENT: { name: 'Excellent', class: 'excellent', minScore: 80 },
    NORMAL: { name: 'Normal', class: 'normal', minScore: 60 },
    POOR: { name: 'Poor', class: 'poor', minScore: 40 },
    VERY_POOR: { name: 'Very Poor', class: 'very-poor', minScore: 0 }
};

// Sensor thresholds for determining air quality contribution
const SENSOR_THRESHOLDS = {
    temperature: {
        excellent: { min: 20, max: 24 },
        normal: { min: 18, max: 26 },
        poor: { min: 15, max: 30 },
        range: { min: 15, max: 30 }
    },
    humidity: {
        excellent: { min: 40, max: 60 },
        normal: { min: 30, max: 70 },
        poor: { min: 20, max: 80 },
        range: { min: 0, max: 100 }
    },
    voc: {
        excellent: { max: 150 },
        normal: { max: 300 },
        poor: { max: 500 },
        range: { min: 0, max: 500 }
    },
    co2: {
        excellent: { max: 600 },
        normal: { max: 1000 },
        poor: { max: 1500 },
        range: { min: 400, max: 2000 }
    }
};

// Quality descriptions
const QUALITY_DESCRIPTIONS = {
    excellent: 'Your indoor air quality is excellent. The air is fresh and clean.',
    normal: 'Your indoor air quality is good. Consider ventilating if needed.',
    poor: 'Air quality is poor. Please open windows or turn on ventilation.',
    'very-poor': 'Air quality is very poor! Immediate ventilation recommended.'
};

// App State
let currentData = {
    temperature: 23.5,
    humidity: 45,
    voc: 125,
    co2: 420
};

// DOM Elements
const elements = {
    // Air Quality Card
    airQualityCard: document.getElementById('airQualityCard'),
    qualityRing: document.getElementById('qualityRing'),
    qualityStatus: document.getElementById('qualityStatus'),
    qualityScore: document.getElementById('qualityScore'),
    qualityDescription: document.getElementById('qualityDescription'),
    
    // Sensor Values
    tempValue: document.getElementById('tempValue'),
    humidityValue: document.getElementById('humidityValue'),
    vocValue: document.getElementById('vocValue'),
    co2Value: document.getElementById('co2Value'),
    
    // Range Fills
    tempFill: document.getElementById('tempFill'),
    humidityFill: document.getElementById('humidityFill'),
    vocFill: document.getElementById('vocFill'),
    co2Fill: document.getElementById('co2Fill'),
    
    // Status
    connectionStatus: document.getElementById('connectionStatus'),
    lastUpdate: document.getElementById('lastUpdate')
};

/**
 * Calculate overall air quality score (0-100)
 */
function calculateAirQualityScore(data) {
    const scores = [];
    
    // Temperature score
    const temp = data.temperature;
    const tempThresh = SENSOR_THRESHOLDS.temperature;
    if (temp >= tempThresh.excellent.min && temp <= tempThresh.excellent.max) {
        scores.push(100);
    } else if (temp >= tempThresh.normal.min && temp <= tempThresh.normal.max) {
        scores.push(75);
    } else if (temp >= tempThresh.poor.min && temp <= tempThresh.poor.max) {
        scores.push(50);
    } else {
        scores.push(25);
    }
    
    // Humidity score
    const humidity = data.humidity;
    const humThresh = SENSOR_THRESHOLDS.humidity;
    if (humidity >= humThresh.excellent.min && humidity <= humThresh.excellent.max) {
        scores.push(100);
    } else if (humidity >= humThresh.normal.min && humidity <= humThresh.normal.max) {
        scores.push(75);
    } else if (humidity >= humThresh.poor.min && humidity <= humThresh.poor.max) {
        scores.push(50);
    } else {
        scores.push(25);
    }
    
    // VOC score
    const voc = data.voc;
    const vocThresh = SENSOR_THRESHOLDS.voc;
    if (voc <= vocThresh.excellent.max) {
        scores.push(100);
    } else if (voc <= vocThresh.normal.max) {
        scores.push(75);
    } else if (voc <= vocThresh.poor.max) {
        scores.push(50);
    } else {
        scores.push(25);
    }
    
    // CO2 score
    const co2 = data.co2;
    const co2Thresh = SENSOR_THRESHOLDS.co2;
    if (co2 <= co2Thresh.excellent.max) {
        scores.push(100);
    } else if (co2 <= co2Thresh.normal.max) {
        scores.push(75);
    } else if (co2 <= co2Thresh.poor.max) {
        scores.push(50);
    } else {
        scores.push(25);
    }
    
    // Calculate weighted average (VOC and CO2 weighted more heavily)
    const weights = [1, 1, 1.5, 1.5];
    const weightedSum = scores.reduce((sum, score, i) => sum + score * weights[i], 0);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    return Math.round(weightedSum / totalWeight);
}

/**
 * Get air quality level based on score
 */
function getAirQualityLevel(score) {
    if (score >= AIR_QUALITY_LEVELS.EXCELLENT.minScore) return AIR_QUALITY_LEVELS.EXCELLENT;
    if (score >= AIR_QUALITY_LEVELS.NORMAL.minScore) return AIR_QUALITY_LEVELS.NORMAL;
    if (score >= AIR_QUALITY_LEVELS.POOR.minScore) return AIR_QUALITY_LEVELS.POOR;
    return AIR_QUALITY_LEVELS.VERY_POOR;
}

/**
 * Update the ring progress based on score
 */
function updateRingProgress(score) {
    const ringProgress = document.querySelector('.ring-progress');
    const circumference = 2 * Math.PI * 90; // r = 90
    const offset = circumference - (score / 100) * circumference;
    ringProgress.style.strokeDashoffset = offset;
}

/**
 * Update sensor range fills
 */
function updateRangeFills(data) {
    // Temperature (15-30°C range)
    const tempRange = SENSOR_THRESHOLDS.temperature.range;
    const tempPercent = ((data.temperature - tempRange.min) / (tempRange.max - tempRange.min)) * 100;
    elements.tempFill.style.width = `${Math.min(100, Math.max(0, tempPercent))}%`;
    
    // Humidity (0-100%)
    elements.humidityFill.style.width = `${data.humidity}%`;
    
    // VOC (0-500 ppb)
    const vocRange = SENSOR_THRESHOLDS.voc.range;
    const vocPercent = (data.voc / vocRange.max) * 100;
    elements.vocFill.style.width = `${Math.min(100, vocPercent)}%`;
    
    // CO2 (400-2000 ppm)
    const co2Range = SENSOR_THRESHOLDS.co2.range;
    const co2Percent = ((data.co2 - co2Range.min) / (co2Range.max - co2Range.min)) * 100;
    elements.co2Fill.style.width = `${Math.min(100, Math.max(0, co2Percent))}%`;
}

/**
 * Update all UI elements with new data
 */
function updateUI(data) {
    // Update sensor values
    elements.tempValue.textContent = data.temperature.toFixed(1);
    elements.humidityValue.textContent = Math.round(data.humidity);
    elements.vocValue.textContent = Math.round(data.voc);
    elements.co2Value.textContent = Math.round(data.co2);
    
    // Calculate and update air quality
    const score = calculateAirQualityScore(data);
    const level = getAirQualityLevel(score);
    
    // Update quality status
    elements.qualityScore.textContent = score;
    elements.qualityStatus.textContent = level.name;
    elements.qualityStatus.className = `quality-status ${level.class}`;
    
    // Update quality card background
    elements.airQualityCard.className = `air-quality-card ${level.class}`;
    
    // Update quality ring
    elements.qualityRing.className = `quality-ring ${level.class}`;
    updateRingProgress(score);
    
    // Update description
    elements.qualityDescription.textContent = QUALITY_DESCRIPTIONS[level.class];
    
    // Update range fills
    updateRangeFills(data);
    
    // Update last update time
    elements.lastUpdate.textContent = 'Just now';
}

/**
 * Simulate sensor data updates (for demo purposes)
 * In production, this would receive data from the actual device via Bluetooth/WiFi
 */
function simulateSensorUpdate() {
    // Add small random variations to simulate real sensor behavior
    currentData = {
        temperature: Math.max(15, Math.min(30, currentData.temperature + (Math.random() - 0.5) * 0.5)),
        humidity: Math.max(0, Math.min(100, currentData.humidity + (Math.random() - 0.5) * 2)),
        voc: Math.max(0, Math.min(500, currentData.voc + (Math.random() - 0.5) * 10)),
        co2: Math.max(400, Math.min(2000, currentData.co2 + (Math.random() - 0.5) * 20))
    };
    
    updateUI(currentData);
}

/**
 * Format time for last update
 */
function updateLastUpdateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    elements.lastUpdate.textContent = timeStr;
}

/**
 * Initialize the app
 */
function init() {
    // Initial UI update
    updateUI(currentData);
    
    // Simulate data updates every 5 seconds (demo mode)
    setInterval(simulateSensorUpdate, 5000);
    
    // Update timestamp every minute
    setInterval(updateLastUpdateTime, 60000);
    
    console.log('Aerauliqa IAQ Monitor initialized');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
