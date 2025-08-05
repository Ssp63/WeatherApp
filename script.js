//
// --- NEW CODE: DOM Element References ---
//
// Get references to all the HTML elements we will be interacting with.
// We select them once and store them in constants for performance and readability.
// The `document.querySelector()` method finds the first element that matches a CSS selector.

// Reference for the element that will display the city's name.
const cityNameEl = document.querySelector('#city-name-date');
// Reference for the span that will hold the temperature value.
const temperatureEl = document.querySelector('#temperature');
// Reference for the span that will hold the humidity value.
const humidityEl = document.querySelector('#humidity');
// Reference for the span that will hold the wind speed value.
const windSpeedEl = document.querySelector('#wind-speed');

// Reference for the container where we will dynamically create and add the 5-day forecast cards.
const forecastContainerEl = document.querySelector('#forecast-container');

// NOTE: We'll add references for the search form and input field in a later step
// when we're ready to handle user input.

// Store the API key in a constant variable.
const API_KEY = '87415672d3bdc34168fabf1f45e5698a';

function displayCurrentWeather(data) {
   // Update the text content of the element that displays the city name.
  // We also get the current date and format it for display.
  const currentDate = new Date().toLocaleDateString();
  cityNameEl.textContent = `${data.name} (${currentDate})`;

  // Update the temperature. We use Math.round() to get a whole number
  // and a template literal to add the "°C" unit.
  temperatureEl.textContent = `${Math.round(data.main.temp)}`;

  // Update the humidity.
  humidityEl.textContent = `${data.main.humidity}`;

  // Update the wind speed. We'll add the "m/s" unit for clarity.
  windSpeedEl.textContent = `${data.wind.speed}`;
}


// This function is responsible for creating and displaying the 5-day forecast cards.
function displayForecast(forecastList) {
  // We loop through the forecast list, jumping 8 indexes at a time to get one forecast per day.

    forecastContainerEl.innerHTML = '';

  for (let i = 0; i < forecastList.length; i += 8) {
    const dailyForecast = forecastList[i];

    const card = document.createElement('div');
    card.classList.add('forecast-card');

    // --- NEW CODE STARTS HERE ---

    // Create and populate the child elements for the card.

    // 1. Create the date element (h3).
    // The API gives us a `dt_txt` field (e.g., "2023-10-27 12:00:00").
    // We create a new Date object from it and use toLocaleDateString() for a friendly format.
    const date = new Date(dailyForecast.dt_txt);
    const dateEl = document.createElement('h3');
    dateEl.textContent = date.toLocaleDateString();

    // 2. Create the weather icon element (img).
    // The API provides an icon code in `dailyForecast.weather[0].icon`.
    // We use this to build the full URL to the weather icon image.
    const iconCode = dailyForecast.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const iconEl = document.createElement('img');
    iconEl.setAttribute('src', iconUrl);
    // CRITICAL for accessibility: The alt attribute describes the image for screen readers
    // or if the image fails to load.
    iconEl.setAttribute('alt', dailyForecast.weather[0].description);

    // 3. Create the temperature element (p).
    // We round the temperature and add the unit symbol.
    const tempEl = document.createElement('p');
    tempEl.textContent = `Temp: ${Math.round(dailyForecast.main.temp)} °C`;

    // 4. Create the humidity element (p).
    const humidityEl = document.createElement('p');
    humidityEl.textContent = `Humidity: ${dailyForecast.main.humidity}%`;

    // 5. Append all the newly created child elements to the parent `card` div.
    // The `.append()` method can take multiple elements at once.
    card.append(dateEl, iconEl, tempEl, humidityEl);

    // Let's log the fully assembled card to see the result in the console.
    // It should now be a div containing an h3, img, and two p tags.
    // console.log(card);
    forecastContainerEl.append(card);

    // --- NEW CODE ENDS HERE ---
  }
}

async function fetchWeather(city) {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    const responses = await Promise.all([
    fetch(apiUrl),
    fetch(forecastUrl)
    ]);

    for (const res of responses) {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    }

    const [currentWeather, forecast] = await Promise.all(
      responses.map(response => response.json())
    );

    // Now we have both data objects and can call our display functions.
    displayCurrentWeather(currentWeather);
    // We pass the `list` property of the forecast data to our display function.
    displayForecast(forecast.list);

  } catch (error) {
    console.error('Failed to fetch weather data:', error);
  }
}

// We are still calling the function with a default city to test it.
fetchWeather('sangli');

