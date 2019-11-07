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
    var histy = {
        units: "metric",
        limit: 5,
        lookups: []
    };

    // Test mode for offline testing
    var test = window.location.search.match(/test/gi) ? true : false;

    init();

    function init() {
        // Call all functions that set up the interface
        buildUI();
        getHistory();
        displayHistory();
        if (histy.lookups[0]) {
            lookupCity(histy.lookups[0]);
        }

        if (test) {
            // Test mode
            $("#lookup input").val("London");
            lookupCity();
        }
    }

    function lookupCity(city) {
        // Make API call to query for the location

        $("#lookup input[type='text']").val(city);
        units.active = $("#lookup input[name='units']:checked").val();

        if (test) {
            // Test mode
            loadTestData();
            displayWeather();
            displayForecast();
            saveHistory(weatherData.name);
            displayHistory();

        } else {

            getWeather(city, function() {
                getUVIndex(weatherData.coord.lat, weatherData.coord.lon, function() {
                    displayWeather();
                });
                getForecast(weatherData.id, function() {
                    displayForecast();
                });

                saveHistory(weatherData.name);
                displayHistory();
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
            console.log("Today's Weather:", weatherData);
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
            console.log("UV Index:", UVIndexData);
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
            console.log("5-Day Forecast:", forecastData);
            if (callback && typeof(callback) === "function") {
                callback();
            }
        });
    }


    // UI functions

    function buildUI() {
        // Set up UI
        $("#dashboard").append(
            $("<aside>").append(
                $("<div>", { id: "lookup" })
                .append(
                    // Lookup Field
                    $("<input>", {
                        type: "text",
                        class: "form-control"
                    })
                    .keydown(function(event) {
                        if ($(this).val() && event.key == "Enter") {
                            $(this).blur();
                            lookupCity($(this).val());
                        }
                    }),
                    // Lookup Button
                    $("<button>", { class: "btn btn-primary" })
                    .html(`<i class="fas fa-search"></i>`)
                    .on("click", function() {
                        if ($("#lookup input").val()) {
                            lookupCity($("#lookup input").val());
                        }
                    }),
                    // Unit Options
                    $("<div>", { id: "units" })
                    .append(

                        $("<div>", { class: "form-check form-check-inline" })
                        .append(
                            $("<input>", {
                                type: "radio",
                                name: "units",
                                id: "metric",
                                class: "form-check-input",
                                value: "metric",
                                checked: true
                            }),
                            $("<label>", {
                                for: "metric",
                                class: "form-check-label"
                            }).text("°C")
                        ),
                        $("<div>", { class: "form-check form-check-inline" })
                        .append(
                            $("<input>", {
                                type: "radio",
                                name: "units",
                                id: "imperial",
                                class: "form-check-input",
                                value: "imperial"
                            }),
                            $("<label>", {
                                for: "imperial",
                                class: "form-check-label"
                            }).text("°F")
                        )
                    )
                ),
                // Lookup History
                $("<div>", { id: "history" })
            ),
            $("<main>").append(
                // Current Weather
                $("<div>", { id: "weather" }),
                // 5-Day Forecast
                $("<div>", { id: "forecast" })
            )
        );
    }

    function displayWeather() {
        // Display weather of queried location
        $("#weather").empty().append(
            $("<h1>").text(weatherData.name + ", " + weatherData.sys.country),
            $("<p>").append(
                $("<img>")
                .attr("src", `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`)
                .attr("alt", `${titleCase(weatherData.weather[0].description)}`)
                .attr("title", `${titleCase(weatherData.weather[0].description)}`)
            ),
            $("<p>").text(`Temperature: ${weatherData.main.temp + units[units.active].temp}`),
            $("<p>").text(`Humidity: ${weatherData.main.humidity}%`),
            $("<p>").text(`Wind Speed: ${weatherData.wind.speed} ${units[units.active].speed}`),
            $("<p>").text(`UV Index: ${UVIndexData.value}`)
        );
    }

    function displayForecast() {
        // Display 5-day forecast of queried location
        $("#forecast").empty();
        for (let i = 0; i < forecastData.list.length; i++) {
            var d = new Date(forecastData.list[i].dt*1000);
            var t = d.getUTCHours() + forecastData.city.timezone/60/60;
            if (t >= 11 && t <= 13) {
                $("#forecast").append(
                    $("<div>").append(
                        $("<h2>").text(`${d.getMonth()+1}/${d.getDate()}`),
                        $("<p>").append(
                            $("<img>")
                            .attr("src", `http://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}.png`)
                            .attr("alt", `${titleCase(forecastData.list[i].weather[0].description)}`)
                            .attr("title", `${titleCase(forecastData.list[i].weather[0].description)}`)
                        ),
                        $("<p>").text(`Temperature: ${forecastData.list[i].main.temp + units[units.active].temp}`),
                        $("<p>").text(`Humidity: ${forecastData.list[i].main.humidity}%`)
                    )
                );
                console.log(`Forecast[${i}]:`, "\n  dt_txt: " + forecastData.list[i].dt_txt, "\n  local: " + d);
            }
        }
    }


    // History functions

    function getHistory() {
        // Check if lookup history exists
        console.log("Getting history...");
        if (localStorage.getItem('weather')) {
            histy = JSON.parse(localStorage.getItem('weather'));
        }
    }

    function displayHistory() {
        if (histy.lookups.length > 0) {
            $("#history").empty().append(
                $("<b>").text("Recent Lookups"),
                $("<span>", { class: "clear" }).text("Clear").click(function() { clearHistory(); })
            );
            $.each(histy.lookups, function(index, item) {
                $("#history").append(
                    $("<li>").text(item).click(function() {
                        lookupCity(item);
                    })
                );
            });
            $("#history").append(

            );
        }
    }

    function saveHistory(city) {
        // Add queried city to lookup history if not exists
        if (!histy.lookups.includes(city)) {
            histy.lookups.unshift(city);
            if (histy.lookups.length > histy.limit) {
                histy.lookups.pop();
            }
            localStorage.setItem("weather", JSON.stringify(histy));
        }
    }

    function clearHistory() {
        histy.lookups.splice(0, histy.lookups.length);
        localStorage.setItem("weather", JSON.stringify(histy));
        $("#history").empty();
    }


    // Misc functions

    function titleCase(str) {
        var words = str.split(" ");
        for (let i = 0; i < words.length; i++) {
            var letters = words[i].split("");
            letters[0] = letters[0].toUpperCase();
            words[i] = letters.join("");
        }
        return words.join(" ");
    }

    function loadTestData() {
        units.active = "default";
        weatherData = {"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":501,"main":"Rain","description":"moderate rain","icon":"10d"}],"base":"stations","main":{"temp":10.45,"pressure":978,"humidity":81,"temp_min":8.89,"temp_max":12.22},"visibility":10000,"wind":{"speed":9.3,"deg":180,"gust":15.4},"rain":{"1h":2.29},"clouds":{"all":56},"dt":1572690932,"sys":{"type":1,"id":1414,"country":"GB","sunrise":1572677701,"sunset":1572712383},"timezone":0,"id":2643743,"name":"London","cod":200};
        UVIndexData = {"lat":51.51,"lon":-0.13,"date_iso":"2019-11-02T12:00:00Z","date":1572696000,"value":1.01};
        forecastData = {"cod":"200","message":0,"cnt":40,"list":[{"dt":1572696000,"main":{"temp":10.85,"temp_min":10.85,"temp_max":12.32,"pressure":977,"sea_level":977,"grnd_level":973,"humidity":77,"temp_kf":-1.48},"weather":[{"id":501,"main":"Rain","description":"moderate rain","icon":"10d"}],"clouds":{"all":56},"wind":{"speed":10.4,"deg":212},"rain":{"3h":4.06},"sys":{"pod":"d"},"dt_txt":"2019-11-02 12:00:00"},{"dt":1572706800,"main":{"temp":11.49,"temp_min":11.49,"temp_max":12.59,"pressure":976,"sea_level":976,"grnd_level":972,"humidity":77,"temp_kf":-1.11},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":7.74,"deg":227},"rain":{"3h":0.56},"sys":{"pod":"d"},"dt_txt":"2019-11-02 15:00:00"},{"dt":1572717600,"main":{"temp":11.47,"temp_min":11.47,"temp_max":12.21,"pressure":978,"sea_level":978,"grnd_level":974,"humidity":72,"temp_kf":-0.74},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":9.58,"deg":229},"rain":{"3h":0.5},"sys":{"pod":"n"},"dt_txt":"2019-11-02 18:00:00"},{"dt":1572728400,"main":{"temp":10.97,"temp_min":10.97,"temp_max":11.34,"pressure":978,"sea_level":978,"grnd_level":975,"humidity":69,"temp_kf":-0.37},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":8.06,"deg":233},"sys":{"pod":"n"},"dt_txt":"2019-11-02 21:00:00"},{"dt":1572739200,"main":{"temp":10.34,"temp_min":10.34,"temp_max":10.34,"pressure":979,"sea_level":979,"grnd_level":975,"humidity":67,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":6.31,"deg":239},"sys":{"pod":"n"},"dt_txt":"2019-11-03 00:00:00"},{"dt":1572750000,"main":{"temp":9.15,"temp_min":9.15,"temp_max":9.15,"pressure":979,"sea_level":979,"grnd_level":975,"humidity":66,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":88},"wind":{"speed":5.65,"deg":231},"sys":{"pod":"n"},"dt_txt":"2019-11-03 03:00:00"},{"dt":1572760800,"main":{"temp":9.21,"temp_min":9.21,"temp_max":9.21,"pressure":980,"sea_level":980,"grnd_level":976,"humidity":65,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":94},"wind":{"speed":5.1,"deg":229},"sys":{"pod":"n"},"dt_txt":"2019-11-03 06:00:00"},{"dt":1572771600,"main":{"temp":10.16,"temp_min":10.16,"temp_max":10.16,"pressure":981,"sea_level":981,"grnd_level":977,"humidity":68,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":4.53,"deg":222},"sys":{"pod":"d"},"dt_txt":"2019-11-03 09:00:00"},{"dt":1572782400,"main":{"temp":10.43,"temp_min":10.43,"temp_max":10.43,"pressure":982,"sea_level":982,"grnd_level":977,"humidity":85,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":4.45,"deg":196},"rain":{"3h":1.88},"sys":{"pod":"d"},"dt_txt":"2019-11-03 12:00:00"},{"dt":1572793200,"main":{"temp":12.31,"temp_min":12.31,"temp_max":12.31,"pressure":981,"sea_level":981,"grnd_level":977,"humidity":72,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":56},"wind":{"speed":3.59,"deg":276},"rain":{"3h":0.25},"sys":{"pod":"d"},"dt_txt":"2019-11-03 15:00:00"},{"dt":1572804000,"main":{"temp":10.23,"temp_min":10.23,"temp_max":10.23,"pressure":983,"sea_level":983,"grnd_level":979,"humidity":75,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":50},"wind":{"speed":2.2,"deg":240},"sys":{"pod":"n"},"dt_txt":"2019-11-03 18:00:00"},{"dt":1572814800,"main":{"temp":9.55,"temp_min":9.55,"temp_max":9.55,"pressure":984,"sea_level":984,"grnd_level":980,"humidity":85,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":26},"wind":{"speed":4.13,"deg":223},"sys":{"pod":"n"},"dt_txt":"2019-11-03 21:00:00"},{"dt":1572825600,"main":{"temp":9.05,"temp_min":9.05,"temp_max":9.05,"pressure":984,"sea_level":984,"grnd_level":980,"humidity":71,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":53},"wind":{"speed":3.91,"deg":231},"rain":{"3h":0.37},"sys":{"pod":"n"},"dt_txt":"2019-11-04 00:00:00"},{"dt":1572836400,"main":{"temp":8.76,"temp_min":8.76,"temp_max":8.76,"pressure":983,"sea_level":983,"grnd_level":978,"humidity":88,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":32},"wind":{"speed":4.39,"deg":164},"rain":{"3h":2.5},"sys":{"pod":"n"},"dt_txt":"2019-11-04 03:00:00"},{"dt":1572847200,"main":{"temp":9.27,"temp_min":9.27,"temp_max":9.27,"pressure":982,"sea_level":982,"grnd_level":978,"humidity":81,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":62},"wind":{"speed":3.87,"deg":237},"rain":{"3h":0.69},"sys":{"pod":"n"},"dt_txt":"2019-11-04 06:00:00"},{"dt":1572858000,"main":{"temp":9.98,"temp_min":9.98,"temp_max":9.98,"pressure":983,"sea_level":983,"grnd_level":980,"humidity":68,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":55},"wind":{"speed":2.66,"deg":231},"sys":{"pod":"d"},"dt_txt":"2019-11-04 09:00:00"},{"dt":1572868800,"main":{"temp":12.32,"temp_min":12.32,"temp_max":12.32,"pressure":984,"sea_level":984,"grnd_level":980,"humidity":62,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":73},"wind":{"speed":2.82,"deg":177},"sys":{"pod":"d"},"dt_txt":"2019-11-04 12:00:00"},{"dt":1572879600,"main":{"temp":12.06,"temp_min":12.06,"temp_max":12.06,"pressure":984,"sea_level":984,"grnd_level":980,"humidity":66,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":3.5,"deg":171},"rain":{"3h":0.81},"sys":{"pod":"d"},"dt_txt":"2019-11-04 15:00:00"},{"dt":1572890400,"main":{"temp":10.97,"temp_min":10.97,"temp_max":10.97,"pressure":985,"sea_level":985,"grnd_level":981,"humidity":71,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":1.7,"deg":172},"rain":{"3h":0.63},"sys":{"pod":"n"},"dt_txt":"2019-11-04 18:00:00"},{"dt":1572901200,"main":{"temp":9.96,"temp_min":9.96,"temp_max":9.96,"pressure":987,"sea_level":987,"grnd_level":983,"humidity":76,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":1.43,"deg":132},"sys":{"pod":"n"},"dt_txt":"2019-11-04 21:00:00"},{"dt":1572912000,"main":{"temp":9.2,"temp_min":9.2,"temp_max":9.2,"pressure":989,"sea_level":989,"grnd_level":985,"humidity":79,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":61},"wind":{"speed":1.14,"deg":96},"sys":{"pod":"n"},"dt_txt":"2019-11-05 00:00:00"},{"dt":1572922800,"main":{"temp":8.51,"temp_min":8.51,"temp_max":8.51,"pressure":990,"sea_level":990,"grnd_level":986,"humidity":81,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":1.62,"deg":29},"sys":{"pod":"n"},"dt_txt":"2019-11-05 03:00:00"},{"dt":1572933600,"main":{"temp":7.83,"temp_min":7.83,"temp_max":7.83,"pressure":992,"sea_level":992,"grnd_level":988,"humidity":85,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":1.53,"deg":16},"sys":{"pod":"n"},"dt_txt":"2019-11-05 06:00:00"},{"dt":1572944400,"main":{"temp":9.25,"temp_min":9.25,"temp_max":9.25,"pressure":995,"sea_level":995,"grnd_level":991,"humidity":82,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":74},"wind":{"speed":3.16,"deg":13},"sys":{"pod":"d"},"dt_txt":"2019-11-05 09:00:00"},{"dt":1572955200,"main":{"temp":11.56,"temp_min":11.56,"temp_max":11.56,"pressure":997,"sea_level":997,"grnd_level":994,"humidity":73,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":75},"wind":{"speed":3.73,"deg":352},"sys":{"pod":"d"},"dt_txt":"2019-11-05 12:00:00"},{"dt":1572966000,"main":{"temp":12.54,"temp_min":12.54,"temp_max":12.54,"pressure":999,"sea_level":999,"grnd_level":994,"humidity":67,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":42},"wind":{"speed":3.57,"deg":357},"rain":{"3h":0.56},"sys":{"pod":"d"},"dt_txt":"2019-11-05 15:00:00"},{"dt":1572976800,"main":{"temp":10.6,"temp_min":10.6,"temp_max":10.6,"pressure":1001,"sea_level":1001,"grnd_level":997,"humidity":78,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":67},"wind":{"speed":5.95,"deg":2},"rain":{"3h":0.5},"sys":{"pod":"n"},"dt_txt":"2019-11-05 18:00:00"},{"dt":1572987600,"main":{"temp":9.86,"temp_min":9.86,"temp_max":9.86,"pressure":1003,"sea_level":1003,"grnd_level":999,"humidity":80,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":96},"wind":{"speed":5.53,"deg":343},"sys":{"pod":"n"},"dt_txt":"2019-11-05 21:00:00"},{"dt":1572998400,"main":{"temp":9.83,"temp_min":9.83,"temp_max":9.83,"pressure":1004,"sea_level":1004,"grnd_level":1000,"humidity":84,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":95},"wind":{"speed":5.3,"deg":350},"rain":{"3h":0.25},"sys":{"pod":"n"},"dt_txt":"2019-11-06 00:00:00"},{"dt":1573009200,"main":{"temp":9.6,"temp_min":9.6,"temp_max":9.6,"pressure":1005,"sea_level":1005,"grnd_level":1001,"humidity":78,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":5.35,"deg":5},"rain":{"3h":1.31},"sys":{"pod":"n"},"dt_txt":"2019-11-06 03:00:00"},{"dt":1573020000,"main":{"temp":7.8,"temp_min":7.8,"temp_max":7.8,"pressure":1006,"sea_level":1006,"grnd_level":1002,"humidity":82,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":88},"wind":{"speed":4.09,"deg":349},"sys":{"pod":"n"},"dt_txt":"2019-11-06 06:00:00"},{"dt":1573030800,"main":{"temp":7.55,"temp_min":7.55,"temp_max":7.55,"pressure":1007,"sea_level":1007,"grnd_level":1003,"humidity":76,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":35},"wind":{"speed":3.42,"deg":349},"sys":{"pod":"d"},"dt_txt":"2019-11-06 09:00:00"},{"dt":1573041600,"main":{"temp":9.15,"temp_min":9.15,"temp_max":9.15,"pressure":1007,"sea_level":1007,"grnd_level":1003,"humidity":67,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":63},"wind":{"speed":2.21,"deg":341},"sys":{"pod":"d"},"dt_txt":"2019-11-06 12:00:00"},{"dt":1573052400,"main":{"temp":9.25,"temp_min":9.25,"temp_max":9.25,"pressure":1006,"sea_level":1006,"grnd_level":1002,"humidity":64,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":1.55,"deg":312},"sys":{"pod":"d"},"dt_txt":"2019-11-06 15:00:00"},{"dt":1573063200,"main":{"temp":8.59,"temp_min":8.59,"temp_max":8.59,"pressure":1005,"sea_level":1005,"grnd_level":1001,"humidity":66,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":1.54,"deg":271},"sys":{"pod":"n"},"dt_txt":"2019-11-06 18:00:00"},{"dt":1573074000,"main":{"temp":7.43,"temp_min":7.43,"temp_max":7.43,"pressure":1005,"sea_level":1005,"grnd_level":1001,"humidity":74,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":68},"wind":{"speed":1.19,"deg":195},"sys":{"pod":"n"},"dt_txt":"2019-11-06 21:00:00"},{"dt":1573084800,"main":{"temp":6.77,"temp_min":6.77,"temp_max":6.77,"pressure":1002,"sea_level":1002,"grnd_level":998,"humidity":79,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":62},"wind":{"speed":2.04,"deg":148},"sys":{"pod":"n"},"dt_txt":"2019-11-07 00:00:00"},{"dt":1573095600,"main":{"temp":6.99,"temp_min":6.99,"temp_max":6.99,"pressure":1000,"sea_level":1000,"grnd_level":996,"humidity":86,"temp_kf":0},"weather":[{"id":501,"main":"Rain","description":"moderate rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":2.79,"deg":140},"rain":{"3h":3.31},"sys":{"pod":"n"},"dt_txt":"2019-11-07 03:00:00"},{"dt":1573106400,"main":{"temp":7.22,"temp_min":7.22,"temp_max":7.22,"pressure":999,"sea_level":999,"grnd_level":995,"humidity":84,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":99},"wind":{"speed":3.18,"deg":230},"rain":{"3h":0.38},"sys":{"pod":"n"},"dt_txt":"2019-11-07 06:00:00"},{"dt":1573117200,"main":{"temp":7.13,"temp_min":7.13,"temp_max":7.13,"pressure":1000,"sea_level":1000,"grnd_level":996,"humidity":67,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":96},"wind":{"speed":6.37,"deg":269},"sys":{"pod":"d"},"dt_txt":"2019-11-07 09:00:00"}],"city":{"id":2643743,"name":"London","coord":{"lat":51.5085,"lon":-0.1258},"country":"GB","timezone":0,"sunrise":1572677700,"sunset":1572712382}};
        console.log("Today's Weather:", weatherData);
        console.log("5-Day Forecast:", forecastData);
    }

});
