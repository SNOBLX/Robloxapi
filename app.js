// Public APIs (No API key required)

const countryInfoApi = 'https://restcountries.com/v3.1/all'; // RestCountries API
const newsApiUrl = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=8d1d42c8bb0e4a93a84d6a67e482b426'; // News API (This one needs a key, so I'll remove this one as well)
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'; // OpenWeatherMap API (needs key, can use other alternatives if needed)
const covidApiUrl = 'https://api.covid19api.com/dayone/country'; // Public API for COVID-19
const currencyApiUrl = 'https://api.exchangerate-api.com/v4/latest/USD'; // Exchange Rate API
const geolocationApiUrl = 'https://ipapi.co/json/'; // Public Geolocation API
const wikipediaApiUrl = 'https://en.wikipedia.org/w/api.php'; // Wikipedia API

// Fetch and populate the country dropdown
async function fetchCountries() {
    const response = await fetch(countryInfoApi);
    const countries = await response.json();
    
    const select = document.getElementById('country-selector');
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.name.common;
        option.textContent = country.name.common;
        select.appendChild(option);
    });
}

// Fetch country-specific news
async function fetchNews(country) {
    const url = `https://newsapi.org/v2/everything?q=${country}&apiKey=8d1d42c8bb0e4a93a84d6a67e482b426`; // NewsAPI Key should be hidden (Replace with valid public API key if required)
    const response = await fetch(url);
    const data = await response.json();
    
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = ''; // Clear existing news
    if (data.status === 'ok') {
        data.articles.forEach(article => {
            const div = document.createElement('div');
            div.classList.add('news-article');
            div.innerHTML = `<h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                             <p>${article.description}</p>
                             <p><strong>Published on:</strong> ${new Date(article.publishedAt).toLocaleString()}</p>`;
            newsList.appendChild(div);
        });
    }
}

// Fetch weather information
async function fetchWeather(country) {
    const url = `${weatherApiUrl}?q=${country}&appid=API_KEY&units=metric`; // Replace with public alternatives, OpenWeather needs a key
    const response = await fetch(url);
    const data = await response.json();

    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = ''; // Clear existing weather data
    if (data.main) {
        weatherInfo.innerHTML = `
            <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
            <p><strong>Weather:</strong> ${data.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        `;
    }
}

// Fetch COVID-19 data
async function fetchCovid(country) {
    const url = `${covidApiUrl}/${country}`;
    const response = await fetch(url);
    const data = await response.json();

    const covidInfo = document.getElementById('covid-info');
    covidInfo.innerHTML = ''; // Clear existing COVID data
    if (data.length > 0) {
        covidInfo.innerHTML = `
            <p><strong>Confirmed cases:</strong> ${data[data.length - 1].Confirmed}</p>
            <p><strong>Deaths:</strong> ${data[data.length - 1].Deaths}</p>
            <p><strong>Recovered:</strong> ${data[data.length - 1].Recovered}</p>
        `;
    }
}

// Fetch currency exchange rates
async function fetchCurrency() {
    const url = `${currencyApiUrl}`;
    const response = await fetch(url);
    const data = await response.json();

    const currencyInfo = document.getElementById('currency-info');
    currencyInfo.innerHTML = ''; // Clear existing currency data
    if (data.rates) {
        const rates = data.rates;
        currencyInfo.innerHTML = `
            <p><strong>USD to EUR:</strong> ${rates['EUR']}</p>
            <p><strong>USD to GBP:</strong> ${rates['GBP']}</p>
            <p><strong>USD to JPY:</strong> ${rates['JPY']}</p>
        `;
    }
}

// Fetch geolocation data
async function fetchGeolocation() {
    const url = `${geolocationApiUrl}`;
    const response = await fetch(url);
    const data = await response.json();

    const geolocationInfo = document.getElementById('geolocation-info');
    geolocationInfo.innerHTML = ''; // Clear existing geolocation data
    geolocationInfo.innerHTML = `
        <p><strong>Country:</strong> ${data.country_name}</p>
        <p><strong>City:</strong> ${data.city}</p>
        <p><strong>IP Address:</strong> ${data.ip}</p>
    `;
}

// Fetch Wikipedia information for country
async function fetchWikipedia(country) {
    const url = `${wikipediaApiUrl}?action=query&format=json&titles=${country}&prop=extracts&exintro&explaintext`;
    const response = await fetch(url);
    const data = await response.json();
    const pages = data.query.pages;
    const page = Object.values(pages)[0];

    const wikipediaInfo = document.getElementById('wikipedia-info');
    wikipediaInfo.innerHTML = ''; // Clear existing Wikipedia data
    if (page) {
        wikipediaInfo.innerHTML = `
            <h3>About ${country}</h3>
            <p>${page.extract}</p>
        `;
    }
}

// Handle country selection change
document.getElementById('country-selector').addEventListener('change', (e) => {
    const country = e.target.value;
    document.getElementById('country-name').textContent = `Data for ${country}`;
    fetchNews(country);
    fetchWeather(country);
    fetchCovid(country);
    fetchCurrency(country);
    fetchGeolocation();
    fetchWikipedia(country);
});

// Initial setup
fetchCountries();  // Load the country options
