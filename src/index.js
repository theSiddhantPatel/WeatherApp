// DOM Elements
const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const dateTime = document.getElementById("date-time");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weather-description");
const windSpeed = document.getElementById("wind-speed");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feels-like");
const pressure = document.getElementById("pressure");
const errorMessage = document.getElementById("error-message");

// Update date and time
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  dateTime.textContent = now.toLocaleDateString("en-US", options);
}

async function getWeatherData(city) {
  try {
    const response = await fetch(`/api/weather?q=${city}`);

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    showError("Error: " + error.message);
    return null;
  }
}

// Update UI with weather data
function updateWeatherUI(data) {
  cityName.textContent = data.name;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;

  // Update weather icon
  const iconCode = data.weather[0].icon;
  const iconClass = getWeatherIconClass(iconCode);
  weatherIcon.innerHTML = `<i class="${iconClass}"></i>`;

  // Update details
  windSpeed.textContent = `${data.wind.speed} km/h`;
  humidity.textContent = `${data.main.humidity}%`;
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  pressure.textContent = `${data.main.pressure} hPa`;

  // Hide error message if shown
  errorMessage.style.display = "none";
}

// Get weather icon class based on condition code
function getWeatherIconClass(iconCode) {
  const iconMap = {
    "01d": "fas fa-sun",
    "01n": "fas fa-moon",
    "02d": "fas fa-cloud-sun",
    "02n": "fas fa-cloud-moon",
    "03d": "fas fa-cloud",
    "03n": "fas fa-cloud",
    "04d": "fas fa-cloud",
    "04n": "fas fa-cloud",
    "09d": "fas fa-cloud-showers-heavy",
    "09n": "fas fa-cloud-showers-heavy",
    "10d": "fas fa-cloud-sun-rain",
    "10n": "fas fa-cloud-moon-rain",
    "11d": "fas fa-bolt",
    "11n": "fas fa-bolt",
    "13d": "fas fa-snowflake",
    "13n": "fas fa-snowflake",
    "50d": "fas fa-smog",
    "50n": "fas fa-smog",
  };

  return iconMap[iconCode] || "fas fa-cloud";
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

// Search weather function
function searchWeather() {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city).then((data) => {
      if (data) {
        updateWeatherUI(data);
      }
    });
  } else {
    showError("Please enter a city name");
  }
}

// Allow Enter key to trigger search
cityInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchWeather();
  }
});

// Initialize with default city and update time
updateDateTime();
getWeatherData("New Delhi").then((data) => {
  if (data) {
    updateWeatherUI(data);
  }
});

// Update time every minute
setInterval(updateDateTime, 60000);
