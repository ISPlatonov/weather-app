import React, { useState } from "react";
import { fetchWeather } from "./api/fetchWeather";

const App = () => {
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [tempUnit, setTempUnit] = useState(localStorage.getItem('tempUnit') || 'C');
  const [recentSearches, setRecentSearches] = useState([]);

  const toggleTempUnit = () => {
    setTempUnit((prevUnit) => (prevUnit === 'C' ? 'F' : 'C'));
    // save the tempUnit to localStorage
    localStorage.setItem('tempUnit', tempUnit === 'C' ? 'F' : 'C');
  };

  const fetchAndDisplayWeather = async (city = cityName) => {
    try {
      const data = await fetchWeather(city, tempUnit); // Assuming fetchWeather can take tempUnit as an argument
      setWeatherData(data);
      setCityName("");
      setError(null);

      const updatedSearches = [city, ...recentSearches.filter(c => c !== city)].slice(0, 5);
      setRecentSearches(updatedSearches);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchData = async (e) => {
    if (e.key === "Enter") {
      await fetchAndDisplayWeather();
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name..."
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        onKeyDown={fetchData}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      {weatherData && (
        <div>
          <h2>
            {weatherData.location.name}, {weatherData.location.region}, {weatherData.location.country}
          </h2>
          <p>
            Temperature: {tempUnit === 'C' ? `${weatherData.current.temp_c} °C` : `${weatherData.current.temp_f} °F`}
          </p>
          <p>Condition: {weatherData.current.condition.text}</p>
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
          />
          <p>Humidity: {weatherData.current.humidity} %</p>
          <p>Pressure: {weatherData.current.pressure_mb} mb</p>
          <p>Visibility: {weatherData.current.vis_km} km</p>
        </div>
      )}
      <div>
        <h3>Recent Searches:</h3>
        <ul>
          {recentSearches.map((city, index) => (
            <li key={index} onClick={() => { setCityName(city); fetchAndDisplayWeather(city); }}>
              {city}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={toggleTempUnit}>
        Switch to {tempUnit === 'C' ? 'Fahrenheit' : 'Celsius'}
      </button>
    </div>
  );
};

export default App;
