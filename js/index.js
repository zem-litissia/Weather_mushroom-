function getWeather() {
    const apiKey = "b5e3afac3f73e21be5d0d49a55b3ffee";
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Please enter a city');
        return;
    }
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Initially hide the weather icon
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'none'; 

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
        });
        
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon'); // Referencing weather icon here
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const button = document.getElementById('weather-button');
    const header = document.querySelector('h1');
    const input = document.getElementById('city');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${cityName} <span>  ${temperature}°C</span></p>
        `;

        const weatherHtml = `
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl; // Set the icon source dynamically
        weatherIcon.style.display = 'block'; // Display the weather icon after data is fetched
        button.style.width= '22%'; 
        button.style.marginLeft='10px'; // Hide the button
        header.style.display = 'none'; // Hide the <h1>
        input.style.display = 'none'; // Hide the input
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    
    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}
// Get references to the image and button elements for changing image
const image = document.getElementById('myImage'); // ID of your image
const settingsBtn = document.getElementById('settings-btn');
const themeSwitcher = document.getElementById('theme-switcher');
const settingsContainer = document.querySelector('.settings-container');

// Function to change the image based on selected style
function changeImageForStyle(style) {
  switch (style) {
    case './css/style.css':
      image.src = './css/img1.png';  // Replace with the image URL for style 1
      break;
    case './css/winter.css':
      image.src = './css/img3.png';  // Replace with the image URL for style 2
      break;
    default:
      image.src = './css/img3.png';  // Fallback to the default image
      break;
  }
}

// Handle settings button click to toggle the visibility of the theme switcher
settingsBtn.addEventListener('click', () => {
  settingsContainer.classList.toggle('moved');  // Toggle visibility of settings container
  if (themeSwitcher.classList.contains('active')) {
    themeSwitcher.classList.remove('active');
    setTimeout(() => (themeSwitcher.style.display = 'none'), 300); // Wait for animation to finish
  } else {
    themeSwitcher.style.display = 'block';
    setTimeout(() => themeSwitcher.classList.add('active'), 10); // Activate animation
  }
});

// Handle style selection and change the theme and image
// Generalize the style selection for all style options
document.querySelectorAll('[data-style]').forEach(button => {
  button.addEventListener('click', (e) => {
    const newStyle = e.target.getAttribute('data-style'); // Get the style file URL
    const stylesheet = document.getElementById('theme-stylesheet');
    stylesheet.setAttribute('href', newStyle); // Replace the stylesheet

    // Change the image based on the selected style
    changeImageForStyle(newStyle);
  });
});
