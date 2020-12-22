$(document).ready(function () {
    var weatherDescription = $(".description");
    // declaring the api keys and the url
    const API_KEY = "fc9e88949e28cc08af027d20a1eb0bc1";


    // listening to the form to display the weather
    $("form").submit(displayWeather);

    // function to display the weather
    function displayWeather(event) {
        event.preventDefault();

        //getting the input value and adding it to the api url
        var searchValue = $(".form-control").val();
        weatherDescription.empty();
        getCurrentWeatherApi(searchValue).then(getCurrentWeather);
        getFiveDayForecastApi(searchValue).then(getFiveDayWeather);
        //storeValue(searchValue);


    }



    // function that return a object with the current weather
    async function getCurrentWeatherApi(queryParameter) {
        const QUERY_URL_CURRENT_WEATHER = `http://api.openweathermap.org/data/2.5/weather?q=${queryParameter}&units=imperial&appid=${API_KEY}`;
        // api call
        return await $.ajax({ url: QUERY_URL_CURRENT_WEATHER, method: "GET" });
    }


    function getCurrentWeather(weatherData) {

        // declaring the varibales for the HTML elements
        let weatherInformationContainer = $(".weather-information-container");
        let cityName = $(".city-name");



        // declaring the current weather object
        let currentWeather = {
            cityname: '',
            currentTemp: 0,
            currentHumidity: 0,
            weatherDescription: '',
            windSpeed: 0,
            coord:
            {
                lat: 0,
                lon: 0
            },
            uvIndex: 0,
            date: 0
        }

        currentWeather.cityname = weatherData.name;
        currentWeather.currentTemp = `Temprature: ${weatherData.main.temp} °F`;
        currentWeather.currentHumidity = `${weatherData.main.humidity}%`;
        currentWeather.weatherDescription = weatherData.weather[0].description;
        currentWeather.windSpeed = `${weatherData.wind.speed} MPH`;
        currentWeather.coord.lat = weatherData.coord.lat;
        currentWeather.coord.lon = weatherData.coord.lon;

        cityName.text(currentWeather.cityname);
        weatherDescription.append($("<li>").text(currentWeather.currentTemp), $("<li>").text(currentWeather.currentHumidity), $("<li>").text(currentWeather.windSpeed));
        weatherInformationContainer.css("display", "block");


        getUvIndex(currentWeather.coord.lat, currentWeather.coord.lon).then((response) => {
            currentWeather.uvIndex = response.value;
            weatherDescription.append($("<li>").text(currentWeather.uvIndex))

        });

    }

    // function that accepts the latitude and the longtitude as parameters to return the uvindex
    async function getUvIndex(lat, lon) {
        const QUERY_URL_UV_INDEX = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

        // calling the uvindex api
        return await $.get(QUERY_URL_UV_INDEX)


    }

    async function getFiveDayForecastApi(searchValue) {
        const QUERY_URL = `http://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&units=imperial&appid=${API_KEY}`
        return await $.ajax({ url: QUERY_URL, method: "GET" });
    }

    function getFiveDayWeather(fiveDayData) {

        var row = $("<div class='row'>");
        $(".5-day-weather-container").append(row)
        row.append("<span class='weather5day-title'>5-Day Forecast</span>")
        for (var i = 0; i < 40; i += 8) {
            console.log(fiveDayData.list[i])
            row.append($(`
             <div class="card col-2 bg-primary" style="margin: 10px; padding: 5px;">
                 <div class="card-body">
                    <p class="card-title text-white" style="font-size: 15px; font-weight: bold;">${moment(fiveDayData.list[i].dt_txt).format('DD/MM/YYYY')}</p>
                    <p class="card-text text-white">Temp: ${fiveDayData.list[i].main.temp}</p>
                    <p class="card-text text-white">Humidity: ${fiveDayData.list[i].main.humidity}</p>

                  </div>
                </div>`))



        }


    }

})