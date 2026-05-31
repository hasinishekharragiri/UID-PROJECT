const apiKey = "1b69d1255c4522917f3b8a0cd755d60b";

/* ELEMENTS */

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const temperature = document.getElementById("temperature");
const cityName = document.getElementById("cityName");
const weatherCondition = document.getElementById("weatherCondition");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const feelsLike = document.getElementById("feelsLike");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const forecastContainer = document.getElementById("forecastContainer");
const bgVideo = document.getElementById("bgVideo");
const weatherIcon = document.getElementById("weatherIcon");

/* HOURLY ELEMENT (NEW) */
const hourlyContainer = document.getElementById("hourlyContainer");


/* LIVE TIME */
function updateTime(){
const now = new Date();

document.getElementById("dateTime").innerHTML =
now.toLocaleString("en-US",{
weekday:"long",
hour:"numeric",
minute:"numeric"
});
}

setInterval(updateTime,1000);
updateTime();


/* SEARCH */
searchBtn.onclick = function(){
const city = cityInput.value.trim();
if(city !== ""){
getWeather(city);
}
};


/* ENTER KEY */
cityInput.addEventListener("keydown",function(e){
if(e.key === "Enter"){
const city = cityInput.value.trim();
if(city !== ""){
getWeather(city);
}
}
});


/* CURRENT LOCATION */
locationBtn.addEventListener("click",()=>{

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(async(position)=>{

const lat = position.coords.latitude;
const lon = position.coords.longitude;

const url =
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

const response = await fetch(url);
const data = await response.json();

updateWeather(data);
getForecast(data.name);
getHourly(data.name); // ✅ ADDED

});

}

});


/* GET WEATHER */
async function getWeather(city){

try{

const url =
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

const response = await fetch(url);
const data = await response.json();

if(data.cod != 200){
alert("City not found");
return;
}

updateWeather(data);
getForecast(city);
getHourly(city); // ✅ ADDED HERE

}

catch(error){
alert("Error loading weather");
}

}


/* UPDATE WEATHER */
function updateWeather(data){

const temp = Math.round(data.main.temp);

let condition = data.weather[0].main.toLowerCase();

/* SMART CONDITION */
if(temp >= 38){
condition = "sunny";
}
else if(temp <= 18){
condition = "cold";
}

/* TEXT */
temperature.innerHTML = temp + "°C";
cityName.innerHTML = data.name;

/* CONDITION */
if(condition === "sunny"){
weatherCondition.innerHTML = "Sunny";
bgVideo.src = "videos/sunny.mp4";
weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
}
else if(condition.includes("rain")){
weatherCondition.innerHTML = "Rainy";
bgVideo.src = "videos/rain.mp4";
weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/414/414974.png";
}
else if(condition.includes("cloud")){
weatherCondition.innerHTML = "Cloudy";
bgVideo.src = "videos/clouds.mp4";
weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/414/414825.png";
}
else if(condition.includes("haze")){
weatherCondition.innerHTML = "Hazy";
bgVideo.src = "videos/haze.mp4";
weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1197/1197102.png";
}
else{
weatherCondition.innerHTML = data.weather[0].main;
bgVideo.src = "videos/night.mp4";
weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/1146/1146869.png";
}

/* DETAILS */
humidity.innerHTML = data.main.humidity + "%";
windSpeed.innerHTML = Math.round(data.wind.speed) + " km/h";
pressure.innerHTML = data.main.pressure + " hPa";
visibility.innerHTML = (data.visibility / 1000) + " km";
feelsLike.innerHTML = Math.round(data.main.feels_like) + "°C";

/* SUN */
sunrise.innerHTML = new Date(data.sys.sunrise * 1000)
.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});

sunset.innerHTML = new Date(data.sys.sunset * 1000)
.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});

}


/* 🔥 HOURLY WEATHER (ADDED FULL FEATURE) */
async function getHourly(city){

try{

const url =
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

const response = await fetch(url);
const data = await response.json();

hourlyContainer.innerHTML = "";

/* next 24 hours (8 * 3hr steps) */
const hourlyData = data.list.slice(0, 8);

hourlyData.forEach(item => {

const time = new Date(item.dt_txt);
const hour = time.getHours();

hourlyContainer.innerHTML += `
<div class="hourly-card">

<h3>${hour}:00</h3>

<p>${Math.round(item.main.temp)}°C</p>

<i class="fa-solid fa-cloud"></i>

</div>
`;
});

}

catch(error){
console.log("Hourly error:", error);
}

}


/* FORECAST */
async function getForecast(city){

try{

const url =
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

const response = await fetch(url);
const data = await response.json();

forecastContainer.innerHTML = "";

/* FILTER 12PM DATA */
const dailyData = data.list.filter(item =>
item.dt_txt.includes("12:00:00"));

dailyData.slice(0,5).forEach(day => {

const date = new Date(day.dt_txt);

const dayName = date.toLocaleDateString("en-US",{weekday:"short"});

let forecastIcon = "☀️";

if(day.weather[0].main.toLowerCase().includes("rain")){
forecastIcon = "🌧️";
}
else if(day.weather[0].main.toLowerCase().includes("cloud")){
forecastIcon = "☁️";
}

forecastContainer.innerHTML += `
<div class="forecast-card">

<h3>${dayName}</h3>

<div class="forecast-icon">${forecastIcon}</div>

<p>${Math.round(day.main.temp)}°C</p>

</div>
`;
});

}

catch(error){
console.log(error);
}

}


/* DEFAULT */
getWeather("Hyderabad");