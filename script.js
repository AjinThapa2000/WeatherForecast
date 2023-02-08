let apiKey="a836acbd536c6ec3b05d3d1fcc35d97f";
let weatherByCity="api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}" +apiKey;
var cities=[];
var listOfCities;

if(localStorage.getItem("cities")){
    listOfCities=JSON.parse(localStorage.getItem("cities"));
    for(i=0;i<listOfCities.length;i++){
        lastCitySearched=listOfCities.length-1;
        var lastCity=listOfCities[lastCitySearched];
    }

} 
else{
    cities;
}  
getLastCityInfo();




//search city
$('#search-city').on("click", function(event){
    event.preventDefault();
    //capture value from input box
    var city=$("#search-input").val();

    console.log(city);

    var queryURL="https://api.openweathermap.org/data/2.5/weather?q="+city+ "&appid="+apiKey;

    //Ajax request to get data from source
    $.ajax({
        url:queryURL,
        method:'GET',
    }).then(function(response){
        console.log(response);
        lattitude=response.coord.lat;
        longitude=response.coord.lon;

        //Add city to array cities
        cities.push(city);
        console.log('City Name: '+city);
        //store city in local storage
        localStorage.setItem("cities", JSON.stringify(cities));

        var cityName=$('<li>');
        cityName.addClass("list-group-item city-item");
        cityName.text(response.name);
        cityName.attr("lattitude",response.coord.lat);
        cityName.attr("longitude",response.coord.lon);
        $('#city-name').prepend(cityName);

        //when i click city name in the list of city 
        cityName.on('click',function(){
            lattitude=$(this).attr("lattitude");
            longitude=$(this).attr("longitude");
            getCityName(response);
            getCityInfo(lattitude,longitude);
        });

        getCityName(response);
        getCityInfo(lattitude,longitude);
        
    })
 



})

//show search city name and weather icon

function getCityName(response){
    //current date
    var todaysDate=moment().format('L');
    //display city name current date and icon
    $('.card-title').text(`${response.name} (${todaysDate})`);

    var wIcon=$('<img>');
    var iconCode=response.weather[0].icon;
    var iconUrl="http://openweathermap.org/img/wn/" + iconCode + ".png";
    wIcon.attr('src', iconUrl);
    $('.card-title').append(wIcon);


}

//city information
function getCityInfo(lattitude, longitude){
    var queryURL2="https://api.openweathermap.org/data/2.5/onecall?lat=" + lattitude + "&lon=" + longitude +
    "&units=imperial&appid="+apiKey;

    $.ajax({
        url:queryURL2,
        method:'GET'
    }).then(function(response){
        //showing city weather info such as temprature, humidity wind-speed, uv index
        $("#temperature").text(`Temperature: ${response.current.temp} \xB0F`);
		$("#humidity").text(`Humidity: ${response.current.humidity}%`);
		$("#wind-speed").text(`Wind Speed: ${response.current.wind_speed} MPH`);
        $("#uv-index").text(`UV Index: `);

		// viewing uv index
		var uvIndex = $("<span>");
		uvIndex.text(`${response.current.uvi}`);
		// presenting conditions are favorable, moderate, or severe
		var uv = response.current.uvi;
		if (uv <= 2) {
			uvIndex.addClass("badge badge-success");
		} else if (uv <= 5) {
			uvIndex.addClass("badge badge-warning");
		} else if (uv <= 7) {
			uvIndex.addClass("badge");
			uvSpan.css("background-color", "orange");
		} else if (uv <= 9) {
			uvIndex.addClass("badge badge-danger");
		} else {
			uvIndex.addClass("badge");
			uvIndex.css("background-color", "purple");
			uvIndex.css("color", "white");
		}
		$("#uv-index").append(uvIndex);

        displayForecast(response);

    })
    

}

function getLastCityInfo() {
	$("#city-name").clear;
	var queryURL1 =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		lastCity +
		"&appid=" +
		apiKey;

	$.ajax({
		url: queryURL1,
		method: "GET",
	}).then(function (response) {
		console.log(response);
		lattitude = response.coord.lat;
		longitude = response.coord.lon;

		getCityName(response);
		getCityInfo(lattitude, longitude);
	});
}

//showing 5 days forecast

function displayForecast(response){
    //previous forecast must be empty before rendering new 
    $('#forecast').empty();
    var days=response.daily;
    console.log(days);

    var fDays=days.slice(1,6);
    for(i=0;i<fDays.length;i++){
        console.log(fDays[i]);
        var dayC=$("<div>");
        dayC.addClass("card col-md-4 dayC");
        dayC.css("background-color","lightblue");
        dayC.css("margin-right",'2px');
        dayC.css("margin-left",'15px');
        dayC.css("margin-bottom", '5px');
        dayC.css("font-size",'15px');

        var  cardBody=$("<div>");
        cardBody.addClass('card-body');
        dayC.append(cardBody);

        var cardName=$('<h6>');
        cardName.addClass('card-title');
        
        var dateStamp=moment.unix(fDays[i].dt);
        var forcastDate=dateStamp.format('L');
        cardName.text(forcastDate);
        cardBody.append(cardName);

        //icon

        var wIcon=$('<img>');
        var iconCode = fDays[i].weather[0].icon;
		var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
		wIcon.attr("src", iconUrl);
		cardBody.append(wIcon);
        //date showing (Temprature, humidity, weather and sunrise Time) of 5 days
        var tempOfDay = $("<p>");
		tempOfDay.text(`Temp: ${fDays[i].temp.max} \xB0F`);
		cardBody.append(tempOfDay);

		var humidityOfDay = $("<p>");
		humidityOfDay.text(`Humidity: ${fDays[i].humidity}%`);
		cardBody.append(humidityOfDay);

        var weatherOfDay = $("<p>");
		weatherOfDay.text(`Weather: ${fDays[i].weather[0].description}`);
		cardBody.append(weatherOfDay);

        var sunriseOfDay = $("<p>");
        let unix=fDays[i].sunrise;
        let sunriseTime=new Date(unix*1000);
		sunriseOfDay.text(`Sunrise: ${sunriseTime}`);
		cardBody.append(sunriseOfDay);

		$("#forecast").append(dayC);


    }

}



