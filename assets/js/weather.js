"use strict";

$(document).ready(function() {

    // Set up variables
    const APIKey = "881091f5dbf0a74515e188d5cd71376f";
    var weatherData, UVIndexData, forecastData;
    var units = {
        active: "metric",
        default: { temp: "K", speed: "m/s" },
        metric: { temp: "°C", speed: "m/s" },
        imperial: { temp: "°F", speed: "mph" }
    };
    var history = [];

    init();

    function init() {
        // Call all functions that set up the interface
        buildUI();
    }

    function lookupCity(city) {
        // Make API call to query for the location

        units.active = $("#lookup input[name='units']:checked").val();

        if (window.location.search.match(/test/gi)) {

            // Test mode for offline testing
            units.active = "default";
            weatherData = {"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"base":"stations","main":{"temp":280.56,"pressure":1016,"humidity":87,"temp_min":278.15,"temp_max":282.59},"visibility":6000,"wind":{"speed":1.5,"deg":110},"clouds":{"all":100},"dt":1572556926,"sys":{"type":1,"id":1414,"country":"GB","sunrise":1572504688,"sunset":1572539801},"timezone":0,"id":2643743,"name":"London","cod":200};
            forecastData = {"cod":"200","message":0,"cnt":40,"list":[{"dt":1572566400,"main":{"temp":281.35,"temp_min":281.35,"temp_max":283.13,"pressure":1013,"sea_level":1013,"grnd_level":1009,"humidity":86,"temp_kf":-1.78},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":2.56,"deg":154},"sys":{"pod":"n"},"dt_txt":"2019-11-01 00:00:00"},{"dt":1572577200,"main":{"temp":282.75,"temp_min":282.75,"temp_max":284.08,"pressure":1009,"sea_level":1009,"grnd_level":1004,"humidity":96,"temp_kf":-1.34},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":3.29,"deg":163},"rain":{"3h":0.25},"sys":{"pod":"n"},"dt_txt":"2019-11-01 03:00:00"},{"dt":1572588000,"main":{"temp":284.01,"temp_min":284.01,"temp_max":284.9,"pressure":1005,"sea_level":1005,"grnd_level":1001,"humidity":96,"temp_kf":-0.89},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":3.61,"deg":167},"rain":{"3h":0.44},"sys":{"pod":"n"},"dt_txt":"2019-11-01 06:00:00"},{"dt":1572598800,"main":{"temp":286.02,"temp_min":286.02,"temp_max":286.46,"pressure":1002,"sea_level":1002,"grnd_level":998,"humidity":90,"temp_kf":-0.45},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":5.42,"deg":184},"rain":{"3h":2},"sys":{"pod":"d"},"dt_txt":"2019-11-01 09:00:00"},{"dt":1572609600,"main":{"temp":287.72,"temp_min":287.72,"temp_max":287.72,"pressure":999,"sea_level":999,"grnd_level":995,"humidity":94,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":2.87,"deg":218},"rain":{"3h":0.13},"sys":{"pod":"d"},"dt_txt":"2019-11-01 12:00:00"},{"dt":1572620400,"main":{"temp":287.97,"temp_min":287.97,"temp_max":287.97,"pressure":996,"sea_level":996,"grnd_level":992,"humidity":77,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":3.66,"deg":225},"rain":{"3h":0.13},"sys":{"pod":"d"},"dt_txt":"2019-11-01 15:00:00"},{"dt":1572631200,"main":{"temp":286.83,"temp_min":286.83,"temp_max":286.83,"pressure":994,"sea_level":994,"grnd_level":990,"humidity":86,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":4.04,"deg":201},"sys":{"pod":"n"},"dt_txt":"2019-11-01 18:00:00"},{"dt":1572642000,"main":{"temp":287.32,"temp_min":287.32,"temp_max":287.32,"pressure":990,"sea_level":990,"grnd_level":986,"humidity":94,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":4.25,"deg":197},"rain":{"3h":1.19},"sys":{"pod":"n"},"dt_txt":"2019-11-01 21:00:00"},{"dt":1572652800,"main":{"temp":287.05,"temp_min":287.05,"temp_max":287.05,"pressure":988,"sea_level":988,"grnd_level":984,"humidity":86,"temp_kf":0},"weather":[{"id":501,"main":"Rain","description":"moderate rain","icon":"10n"}],"clouds":{"all":94},"wind":{"speed":5.1,"deg":231},"rain":{"3h":4.19},"sys":{"pod":"n"},"dt_txt":"2019-11-02 00:00:00"},{"dt":1572663600,"main":{"temp":286.7,"temp_min":286.7,"temp_max":286.7,"pressure":988,"sea_level":988,"grnd_level":984,"humidity":72,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":7.26,"deg":249},"rain":{"3h":0.19},"sys":{"pod":"n"},"dt_txt":"2019-11-02 03:00:00"},{"dt":1572674400,"main":{"temp":284.54,"temp_min":284.54,"temp_max":284.54,"pressure":988,"sea_level":988,"grnd_level":985,"humidity":61,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":98},"wind":{"speed":7.38,"deg":241},"rain":{"3h":0.06},"sys":{"pod":"n"},"dt_txt":"2019-11-02 06:00:00"},{"dt":1572685200,"main":{"temp":284.57,"temp_min":284.57,"temp_max":284.57,"pressure":988,"sea_level":988,"grnd_level":984,"humidity":62,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":7.02,"deg":227},"sys":{"pod":"d"},"dt_txt":"2019-11-02 09:00:00"},{"dt":1572696000,"main":{"temp":285.73,"temp_min":285.73,"temp_max":285.73,"pressure":987,"sea_level":987,"grnd_level":983,"humidity":53,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":93},"wind":{"speed":6.96,"deg":226},"rain":{"3h":0.19},"sys":{"pod":"d"},"dt_txt":"2019-11-02 12:00:00"},{"dt":1572706800,"main":{"temp":285.35,"temp_min":285.35,"temp_max":285.35,"pressure":985,"sea_level":985,"grnd_level":980,"humidity":53,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":69},"wind":{"speed":6.93,"deg":217},"sys":{"pod":"d"},"dt_txt":"2019-11-02 15:00:00"},{"dt":1572717600,"main":{"temp":283.51,"temp_min":283.51,"temp_max":283.51,"pressure":983,"sea_level":983,"grnd_level":979,"humidity":61,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":56},"wind":{"speed":5.58,"deg":212},"sys":{"pod":"n"},"dt_txt":"2019-11-02 18:00:00"},{"dt":1572728400,"main":{"temp":282.95,"temp_min":282.95,"temp_max":282.95,"pressure":982,"sea_level":982,"grnd_level":979,"humidity":60,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":38},"wind":{"speed":5.22,"deg":206},"sys":{"pod":"n"},"dt_txt":"2019-11-02 21:00:00"},{"dt":1572739200,"main":{"temp":282.77,"temp_min":282.77,"temp_max":282.77,"pressure":981,"sea_level":981,"grnd_level":977,"humidity":69,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":52},"wind":{"speed":4.92,"deg":193},"sys":{"pod":"n"},"dt_txt":"2019-11-03 00:00:00"},{"dt":1572750000,"main":{"temp":282.5,"temp_min":282.5,"temp_max":282.5,"pressure":979,"sea_level":979,"grnd_level":975,"humidity":78,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":6.34,"deg":213},"rain":{"3h":1},"sys":{"pod":"n"},"dt_txt":"2019-11-03 03:00:00"},{"dt":1572760800,"main":{"temp":282.96,"temp_min":282.96,"temp_max":282.96,"pressure":978,"sea_level":978,"grnd_level":973,"humidity":82,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":5.34,"deg":200},"rain":{"3h":1.88},"sys":{"pod":"n"},"dt_txt":"2019-11-03 06:00:00"},{"dt":1572771600,"main":{"temp":283.24,"temp_min":283.24,"temp_max":283.24,"pressure":977,"sea_level":977,"grnd_level":973,"humidity":68,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":3},"wind":{"speed":3.85,"deg":235},"sys":{"pod":"d"},"dt_txt":"2019-11-03 09:00:00"},{"dt":1572782400,"main":{"temp":283.28,"temp_min":283.28,"temp_max":283.28,"pressure":977,"sea_level":977,"grnd_level":974,"humidity":75,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":46},"wind":{"speed":6.5,"deg":247},"rain":{"3h":0.62},"sys":{"pod":"d"},"dt_txt":"2019-11-03 12:00:00"},{"dt":1572793200,"main":{"temp":284.47,"temp_min":284.47,"temp_max":284.47,"pressure":978,"sea_level":978,"grnd_level":975,"humidity":64,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":94},"wind":{"speed":6.66,"deg":260},"rain":{"3h":0.56},"sys":{"pod":"d"},"dt_txt":"2019-11-03 15:00:00"},{"dt":1572804000,"main":{"temp":283.08,"temp_min":283.08,"temp_max":283.08,"pressure":980,"sea_level":980,"grnd_level":976,"humidity":72,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":71},"wind":{"speed":4.63,"deg":260},"rain":{"3h":0.06},"sys":{"pod":"n"},"dt_txt":"2019-11-03 18:00:00"},{"dt":1572814800,"main":{"temp":282,"temp_min":282,"temp_max":282,"pressure":982,"sea_level":982,"grnd_level":978,"humidity":78,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":39},"wind":{"speed":4.29,"deg":251},"sys":{"pod":"n"},"dt_txt":"2019-11-03 21:00:00"},{"dt":1572825600,"main":{"temp":281.06,"temp_min":281.06,"temp_max":281.06,"pressure":982,"sea_level":982,"grnd_level":978,"humidity":82,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":43},"wind":{"speed":3.3,"deg":255},"sys":{"pod":"n"},"dt_txt":"2019-11-04 00:00:00"},{"dt":1572836400,"main":{"temp":280.49,"temp_min":280.49,"temp_max":280.49,"pressure":983,"sea_level":983,"grnd_level":979,"humidity":84,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":74},"wind":{"speed":1.97,"deg":257},"sys":{"pod":"n"},"dt_txt":"2019-11-04 03:00:00"},{"dt":1572847200,"main":{"temp":279.99,"temp_min":279.99,"temp_max":279.99,"pressure":983,"sea_level":983,"grnd_level":980,"humidity":85,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":38},"wind":{"speed":1.3,"deg":251},"sys":{"pod":"n"},"dt_txt":"2019-11-04 06:00:00"},{"dt":1572858000,"main":{"temp":281.15,"temp_min":281.15,"temp_max":281.15,"pressure":985,"sea_level":985,"grnd_level":981,"humidity":77,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":0},"wind":{"speed":1.43,"deg":286},"sys":{"pod":"d"},"dt_txt":"2019-11-04 09:00:00"},{"dt":1572868800,"main":{"temp":283.52,"temp_min":283.52,"temp_max":283.52,"pressure":986,"sea_level":986,"grnd_level":982,"humidity":62,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":43},"wind":{"speed":1.33,"deg":286},"sys":{"pod":"d"},"dt_txt":"2019-11-04 12:00:00"},{"dt":1572879600,"main":{"temp":283.59,"temp_min":283.59,"temp_max":283.59,"pressure":986,"sea_level":986,"grnd_level":983,"humidity":65,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":64},"wind":{"speed":1.18,"deg":340},"sys":{"pod":"d"},"dt_txt":"2019-11-04 15:00:00"},{"dt":1572890400,"main":{"temp":282.19,"temp_min":282.19,"temp_max":282.19,"pressure":987,"sea_level":987,"grnd_level":983,"humidity":79,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":58},"wind":{"speed":2.57,"deg":7},"sys":{"pod":"n"},"dt_txt":"2019-11-04 18:00:00"},{"dt":1572901200,"main":{"temp":281.84,"temp_min":281.84,"temp_max":281.84,"pressure":989,"sea_level":989,"grnd_level":985,"humidity":79,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":77},"wind":{"speed":4.26,"deg":9},"rain":{"3h":0.06},"sys":{"pod":"n"},"dt_txt":"2019-11-04 21:00:00"},{"dt":1572912000,"main":{"temp":280.03,"temp_min":280.03,"temp_max":280.03,"pressure":991,"sea_level":991,"grnd_level":987,"humidity":80,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":48},"wind":{"speed":4,"deg":345},"sys":{"pod":"n"},"dt_txt":"2019-11-05 00:00:00"},{"dt":1572922800,"main":{"temp":279.63,"temp_min":279.63,"temp_max":279.63,"pressure":992,"sea_level":992,"grnd_level":989,"humidity":77,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":37},"wind":{"speed":3.53,"deg":323},"sys":{"pod":"n"},"dt_txt":"2019-11-05 03:00:00"},{"dt":1572933600,"main":{"temp":279.54,"temp_min":279.54,"temp_max":279.54,"pressure":994,"sea_level":994,"grnd_level":991,"humidity":77,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":68},"wind":{"speed":4.06,"deg":307},"sys":{"pod":"n"},"dt_txt":"2019-11-05 06:00:00"},{"dt":1572944400,"main":{"temp":280.75,"temp_min":280.75,"temp_max":280.75,"pressure":997,"sea_level":997,"grnd_level":993,"humidity":74,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":92},"wind":{"speed":5.36,"deg":322},"sys":{"pod":"d"},"dt_txt":"2019-11-05 09:00:00"},{"dt":1572955200,"main":{"temp":282.33,"temp_min":282.33,"temp_max":282.33,"pressure":999,"sea_level":999,"grnd_level":996,"humidity":65,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":93},"wind":{"speed":5.39,"deg":325},"sys":{"pod":"d"},"dt_txt":"2019-11-05 12:00:00"},{"dt":1572966000,"main":{"temp":282.05,"temp_min":282.05,"temp_max":282.05,"pressure":1001,"sea_level":1001,"grnd_level":997,"humidity":67,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":5,"deg":318},"rain":{"3h":0.06},"sys":{"pod":"d"},"dt_txt":"2019-11-05 15:00:00"},{"dt":1572976800,"main":{"temp":281.22,"temp_min":281.22,"temp_max":281.22,"pressure":1003,"sea_level":1003,"grnd_level":999,"humidity":73,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":98},"wind":{"speed":5.06,"deg":324},"rain":{"3h":0.06},"sys":{"pod":"n"},"dt_txt":"2019-11-05 18:00:00"},{"dt":1572987600,"main":{"temp":281.04,"temp_min":281.04,"temp_max":281.04,"pressure":1005,"sea_level":1005,"grnd_level":1002,"humidity":70,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":4.2,"deg":335},"rain":{"3h":0.06},"sys":{"pod":"n"},"dt_txt":"2019-11-05 21:00:00"}],"city":{"id":2643743,"name":"London","coord":{"lat":51.5073,"lon":-0.1277},"country":"GB","population":1000000,"timezone":0,"sunrise":1572504687,"sunset":1572539801}};

            console.log("Today's Weather: ", weatherData);
            console.log("5-Day Forecast: ", forecastData);
            displayWeather();
            displayForecast();

        } else {

            getWeather(city, function() {
                getUVIndex(weatherData.coord.lat, weatherData.coord.lon, function() {
                    displayWeather();
                });
                getForecast(weatherData.id, function() {
                    displayForecast();
                })
            });

        }
        // Save to search history if not exists
    }

    function getWeather(city, callback) {
        // Get current weather by city
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units.active + "&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            weatherData = response;
            console.log("Today's Weather: ", weatherData);
            if (callback && typeof(callback) === "function") {
                callback();
            }
        });
    }

    function getUVIndex(lat, lon, callback) {
        // Get UV Index by latitude and longitude
        var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            UVIndexData = response;
            console.log("UV Index: ", UVIndexData);
            if (callback && typeof(callback) === "function") {
                callback();
            }
        });
    }

    function getForecast(id, callback) {
        // Get 5-day forecast by city ID to avoid ambiguity
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + id + "&units=" + units.active + "&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            forecastData = response;
            console.log("5-Day Forecast: ", forecastData);
            if (callback && typeof(callback) === "function") {
                callback();
            }
        });
    }


    // UI functions

    function buildUI() {
        // Set up UI
        $("#dashboard").append(
            // Lookup Field
            $("<div>").attr("id","lookup").append(
                $("<input>").attr("type","text").keydown(function(event) {
                    if ($(this).val() && event.key == "Enter") {
                        $(this).blur();
                        lookupCity($(this).val());
                    }
                }),
                $("<button>").text("Lookup").on("click", function() {
                    if ($("#lookup input").val()) {
                        lookupCity($("#lookup input").val());
                    }
                }),
                $("<input>").attr("type","radio").attr("name","units").val("metric").prop("checked",true),
                "&deg;C",
                $("<input>").attr("type","radio").attr("name","units").val("imperial"),
                "&deg;F"

            ),
            // Lookup History
            $("<div>").attr("id","history"),
            // Current Weather
            $("<div>").attr("id","weather"),
            // 5-Day Forecast
            $("<div>").attr("id","forecast")
        );
    }

    function displayWeather() {
        // Display weather of queried location
        $("#weather").empty().append(
            $("<h1>").text(weatherData.name),
            $("<p>").text(`Weather: ${weatherData.weather[0].description} ${weatherData.weather[0].icon}`),
            $("<p>").text(`Temperature: ${weatherData.main.temp + units[units.active].temp}`),
            $("<p>").text(`Humidity: ${weatherData.main.humidity}%`),
            $("<p>").text(`Wind Speed: ${weatherData.wind.speed} ${units[units.active].speed}`),
            $("<p>").text(`UV Index: ${UVIndexData.value}`)
        );
    }

    function displayForecast() {
        // Display 5-day forecast of queried location
        $("#forecast").empty();
        for (let i = 0; i < 5; i++) {
            var d = new Date(forecastData.list[i*8+5].dt*1000);
            $("#forecast").append(
                $("<h2>").text(`${d.getMonth()+1}/${d.getDate()}`),
                $("<p>").text(`Weather: ${forecastData.list[i].weather[0].description} ${forecastData.list[i].weather[0].icon}`),
                $("<p>").text(`Temperature: ${forecastData.list[i].main.temp + units[units.active].temp}`),
                $("<p>").text(`Humidity: ${forecastData.list[i].main.humidity}%`)
            );
            console.log(d);
        }
    }

    function getHistory() {
        // Check if lookup history exists
        if (localStorage.weather) {
            history = JSON.parse(localStorage.weather).history;
        }
    }

    function updateHistory(city) {
        // Add queried city to lookup history if not exists
    }

});
