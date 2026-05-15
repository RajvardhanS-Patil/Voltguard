# ⚡ VOLTEX — Electricity Theft Detection App

A production-ready React Native / Expo mobile app for real-time electricity theft detection using fuzzy logic inference and AI analytics.

---

## 📁 Project Structure

```
VoltexApp/
├── App.js                     # Root component + layout orchestration
├── app.json                   # Expo config
├── package.json               # Dependencies
├── babel.config.js            # Babel config
│
├── components/
│   ├── Header.js              # App navbar with logo + clock
│   ├── ModeToggle.js          # Basic/Advanced mode switcher
│   ├── StatusBar2.js          # Global system status bar
│   ├── AlertBanner.js         # Slide-in alert notifications
│   ├── Gauge.js               # Animated circular theft probability gauge
│   ├── StatCard.js            # Reusable metric card with progress bar
│   ├── NodeCard.js            # Network node status row
│   ├── NetworkTopology.js     # SVG network topology diagram
│   ├── ChartCard.js           # Native SVG sparkline chart
│   ├── FuzzyPanel.js          # Fuzzy logic membership breakdown
│   └── InsightPanel.js        # AI insight engine panel
│
├── hooks/
│   └── useSimulation.js       # Real-time sensor data simulation hook
│
└── utils/
    └── theme.js               # Design tokens, colors, spacing
```

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
cd VoltexApp
npm install
```

### 2. Start development server

```bash
npx expo start
```

Then press `a` to open in Android emulator, or scan the QR code with Expo Go.

### 3. Build for Android

```bash
# Using Expo's local build (requires Android Studio)
npx expo run:android

# Or using EAS Build (cloud)
npm install -g eas-cli
eas login
eas build --platform android
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `expo` | ~51.0.0 | Core Expo SDK |
| `react-native` | 0.74.5 | React Native framework |
| `react-native-svg` | 15.2.0 | SVG rendering (gauge, charts, network) |
| `expo-font` | ~12.0.5 | Custom font loading |
| `expo-linear-gradient` | ~13.0.2 | Gradient effects |

---

## 🎨 Features

### Basic Mode
- Circular theft probability gauge (0–100%)
- 4 stat cards: Supply, Load, Voltage, Power Loss
- Imbalance summary card with efficiency %
- 4 node status cards with live pulsing indicators
- Network topology diagram (SVG)
- Slide-in alert notifications

### Advanced Mode
- All Basic Mode features +
- 3 real-time sparkline charts (Current, Voltage, Theft Probability)
- Fuzzy logic membership breakdown (5 bars)
- Segment loss distribution bar
- AI Insight Engine panel (3 dynamic insights)
- Smooth fade + slide-up transition animations

---

## ⚡ Mode Switching Animation

1. Fade-out (200ms)
2. State update
3. Fade-in (300ms) + Advanced section slides up (spring)

---

## 🎯 Design Choices

- **Color system**: Cyan (#00E5FF) primary, Purple (#7C4DFF) accent, semantic Green/Amber/Danger
- **Dark-first**: Deep navy (#111827) Basic, near-black (#02040f) Advanced
- **No web APIs**: 100% React Native + SVG — no Canvas, no DOM, no web libraries
- **Native animations**: React Native `Animated` API only — hardware accelerated
- **Touch targets**: All buttons minimum 44px height
- **Typography**: System monospace for numbers, bold weights for hierarchy

---

## 📱 Android Compatibility

- `minSdkVersion`: 24 (Android 7.0+)
- Portrait orientation locked
- StatusBar styled dark
- SafeAreaView for notch/edge handling
- No web-only APIs used

---

## 🔧 Customization

### Change update interval (default 2s):
In `hooks/useSimulation.js`, change the `setInterval` delay:
```js
const interval = setInterval(() => { ... }, 2000); // <- change ms
```

### Add real sensor data:
Replace the simulation logic in `useSimulation.js` with your API calls.

### Modify color scheme:
Edit `utils/theme.js` — all colors are centralized.
