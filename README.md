# WeatherApp
![Angular](https://img.shields.io/badge/Angular-20-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![RxJS](https://img.shields.io/badge/RxJS-7-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8)
![License](https://img.shields.io/badge/License-MIT-green)


A modern weather dashboard built with Angular, TypeScript, RxJS, Angular Signals, and Tailwind CSS.

The application allows users to search for cities, view current weather conditions, browse hourly and weekly forecasts, save favorite locations, and access weather information based on their current location.

---

## 🚀 Features

### 🔍 City Search

* Search weather data for any city worldwide
* Debounced search requests using RxJS
* Loading and error states

### 🌡️ Current Weather

* Current temperature
* Weather conditions
* Feels-like temperature
* Humidity
* Wind speed
* Pressure
* Visibility
* Last update information

### 📅 7-Day Forecast

* Daily weather overview
* Minimum and maximum temperatures
* Weather condition icons

### ⏰ Hourly Forecast

* Hour-by-hour weather data
* Scrollable forecast timeline
* Temperature trends throughout the day

### ⭐ Favorites

* Save favorite cities
* Quick access to frequently checked locations
* Persistent storage using LocalStorage

### 🕘 Search History

* Stores recent searches
* Quick reload of previous locations
* Persistent storage using LocalStorage

### 📍 Geolocation

* Detect user's current location
* Automatically load local weather conditions
* Browser Geolocation API integration

### 📊 Weather Analytics

* Temperature trend charts
* Visual weather statistics
* Chart.js integration

### 🌅 Additional Information

* Sunrise and sunset times
* UV Index
* Air Quality Index (AQI)

### 🌙 Theme Support

* Dark Mode
* Light Mode
* Theme persistence

---

## 🛠️ Tech Stack

### Frontend

* Angular 20+
* TypeScript
* Angular Signals
* RxJS
* Angular Router
* Angular HttpClient
* Tailwind CSS
* Chart.js

### APIs

* Open-Meteo API / WeatherAPI
* Browser Geolocation API

### State Management

* Angular Signals
* LocalStorage Persistence

---

## 📂 Project Structure

```text
src/app
├── core
│   ├── services
│   ├── models
│   └── interceptors
│
├── shared
│   ├── components
│   ├── directives
│   └── pipes
│
├── features
│   ├── dashboard
│   ├── weather
│   ├── forecast
│   ├── favorites
│   └── history
│
└── layouts
```

---

## 🎯 Angular Concepts Demonstrated

This project showcases:

* Standalone Components
* Angular Signals
* Dependency Injection
* Reactive Forms
* Lazy Loading
* Route Configuration
* HTTP Requests
* API Integration
* RxJS Operators
* Component Composition
* State Management
* Error Handling
* Responsive Design

---

## 🔄 RxJS Operators Used

```ts
debounceTime()
distinctUntilChanged()
switchMap()
catchError()
map()
tap()
```

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/weather-dashboard.git
```

Navigate to the project directory:

```bash
cd weather-dashboard
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
ng serve
```

Open:

```text
http://localhost:4200
```

---

## 🏗️ Build

```bash
ng build
```

Production files will be generated inside:

```text
dist/
```

---

## 📱 Responsive Design

The application is fully responsive and optimized for:

* Mobile devices
* Tablets
* Laptops
* Desktop screens

---

## 🎨 UI Design

Inspired by modern SaaS applications such as:

* Linear
* Vercel
* Notion
* Modern weather applications

Features include:

* Glassmorphism effects
* Smooth animations
* Modern card layouts
* Gradient accents
* Clean typography

---

## 🔮 Future Improvements

* Weather alerts and notifications
* Multi-language support
* PWA support
* Offline mode
* Weather maps
* User accounts
* Saved dashboards
* Weather widgets

---
