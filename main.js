document.addEventListener("DOMContentLoaded", function() {

    const myKey = config.API_KEY;

    const climaFormEl = document.querySelector('.clima-form');
    const cardWrapperEl = document.querySelector('.card-wrapper');
    const climaCardEl = document.querySelector('.clima-card');
    const climaCityEl = document.querySelector('.clima-card-city');
    const temperatureEl = document.querySelector('.temperature');
    const weatherConditionEl = document.querySelector('.weather-condition');
    const humidityEl = document.querySelector('.humidity');
    const windSpeedEl = document.querySelector('.wind-speed');
    const errorMsgEl = document.querySelector('#error-message');
    const toggleTempButton = document.getElementById('toggleTemp');

    cardWrapperEl.classList.add('hidden');    //trying to hide weather card

    let isFahrenheit = true;    //default format provided is F
    let currentTempInKelvin = null;     //init current Kelvin

    function kelvinToF(kelvin) {
        return ((kelvin - 273.15) * 9/5 + 32).toFixed(1);   //rounds to 1 decimal
    }

    function kelvinToC(kelvin) {
        return ((kelvin - 273.15)).toFixed(1);
    }

    function updateTemp(tempInKelvin) {     //takes temp in K and alters the temp element to either F or C
        if (isFahrenheit) {
            temperatureEl.textContent = `${kelvinToF(tempInKelvin)}°F`;
        } else {
            temperatureEl.textContent = `${kelvinToC(tempInKelvin)}°C`;
        }
    }

    
    climaFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();     // no refresh
        cardWrapperEl.classList.add('hidden');    //attempting to hide the card again

        const city = climaFormEl.querySelector('input').value;
        const data = await getWeatherData(city);

        if (data) {
            currentTempInKelvin = data.main.temp;
            updateTemp(currentTempInKelvin);    // passes API K value to function for conversion
        }

        const iconUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`; // pulls a weather condition icon
        document.querySelector('.clima-card-pic').src = iconUrl;
    });


    toggleTempButton.addEventListener('click', () => {
        isFahrenheit = !isFahrenheit;  // sets isF to not isF
    
        // updates display 
        updateTemp(currentTempInKelvin);
    
        // changes text on button for opposite temp
        if (isFahrenheit) {
            toggleTempButton.textContent = 'Switch to Celsius';
        } else {
            toggleTempButton.textContent = 'Switch to Fahrenheit';
        }
    });


    const getWeatherData = async (city) => {
        try {
            cardWrapperEl.classList.add('hidden');

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}`);
            // hiding API key from github
            console.log(response);

            if (!response.ok) {
                throw new Error('City not found');
            }
            
            const data = await response.json();
            console.log(data);

            cardWrapperEl.classList.remove('hidden');     //attempting to show card

            climaCityEl.textContent = `${data.name}, ${data.sys.country}`;  // city, country code
            weatherConditionEl.textContent = `${data.weather[0].description}`;
            humidityEl.textContent = `${data.main.humidity}%`;
            windSpeedEl.textContent = `${data.wind.speed} km/h`;

            errorMsgEl.textContent = '';    // hide error message
            climaCardEl.classList.remove('hidden'); //show the card at the end of api call

            return data;

        } catch (error) {
            errorMsgEl.textContent = 'There was an error retrieving the weather data.';
            climaCityEl.textContent = "";
            temperatureEl.textContent = "";
            weatherConditionEl.textContent = "";
            humidityEl.textContent = "";
        }
    }
})