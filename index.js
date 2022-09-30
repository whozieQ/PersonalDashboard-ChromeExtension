
//Dynamically pull a background image
fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=disney")
.then( res => res.json())
.then( data => {
    document.body.style.backgroundImage = `url(${data.urls.regular})`
    document.getElementById("backgroundDescription").textContent = `Photo by: ${data.user.name}` 
})
.catch(err => {
    console.log(err)
    document.body.style.backgroundImage = `url("default-disney.jpg")`
    document.getElementById("backgroundDescription").textContent = "Photo by: Brian McGowan" 
})

//get the Stock widget info and populate it
const stockIDs = ["HD","DIS"]
getStock()
startClock()
const myLocation = navigator.geolocation.getCurrentPosition(data=>{getWeather(data.coords.latitude, data.coords.longitude)})
daysToChristmas()

async function getStock(){
    let stockHTML = await Promise.all(stockIDs.map(async (item) => {
        return   `<div class="quoteContainer">` + await getQuote(item) + "</div>"
    }))

    document.getElementById("stock").innerHTML = stockHTML.join('')
}

async function getQuote(stockID){
    let  msg = `<p>Unable to retrieve stock data for ${stockID} at this time</p>`
    try{
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockID}&apikey=YQ6D53E6ZH3U8US2`)
        if (!response.ok){
            throw Error("Something went wrong - response not ok")
        }
        const data = await response.json()
        const quote = data["Global Quote"]
        const price = Number(quote["05. price"]).toFixed(3)
        const changeIcon = Number(quote["08. previous close"]) < price ? "&#128316;" : "&#128315;"
        msg =  `<div class="stockSymbol">${stockID}</div><div class="stockPrice">${price}</div><div class="changeIcon">${changeIcon}</div>`
    }
    catch(err){
        console.log(err)
    }
    return msg
}

//get the TIME info 
function startClock(){
    updateClock()
    setInterval(()=>{
        updateClock()
    },1000)
 }
 function updateClock(){
    const data = new Date()
    const hours = data.getHours() % 12 || 12
    const minutes = data.getMinutes().toString().padStart(2,"0") 
    const amPm = data.getHours() < 12 ? "AM" : "PM"
    document.getElementById("time").textContent = `${hours}:${minutes}`
    document.getElementById("ampm").textContent = amPm
 }



//get the Weather info

function getWeather(lat,lon){
    // Hoschton
    // lat = "34.077896"
    // lon = "-83.83"
    const url = `https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial`
    fetch(url).then(response => {
        if (!response.ok) {
            throw Error("Weather data not available")
        }
        return response.json()})
    .then(data=>{
        console.log(data)
        document.getElementById("weather").innerHTML = `<div class="weatherTop"><img class="weatherSymbol" 
            src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"></img>
            <p class="temp">${Math.round(data.main.temp)}&deg;</p></div>
            <p class="weatherBottom">${data.name}</p>`
    })
    .catch(err => console.error(err) )

}

function daysToChristmas(){
    const today = new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDate())
    const todayCount = Math.round(today.getTime()/(1000*60*60*24))
    const christmas = new Date(today.getFullYear(),11,25)
    const birthday = new Date(today.getFullYear(), 6, 12)
    const halloween = new Date(today.getFullYear(), 9, 31)

    const events = [ 
        // {"day": test, "name": "test"}, 
        {"day": christmas, "name": "Christmas", "icon": String.fromCodePoint(0x1F385)}, 
        {"day": birthday,  "name": "your birthday", "icon": String.fromCodePoint(0x1F382)}, 
        {"day": halloween, "name": "Halloween", "icon": String.fromCodePoint(0x1F9DB)}
    ]
    let dayCounts = events.map(element=>{
        let count = Math.round(element.day.getTime()/(1000*60*60*24)) 
        if (count < todayCount) { element.day.setFullYear(element.day.getFullYear()+1)}
        count = Math.round(element.day.getTime()/(1000*60*60*24)) 
        element.count = count
        return element
    })
    dayCounts.sort((a,b) =>{
        return Number(a.count) <= Number(b.count) ? -1 : 1
    })
    const daysUntil = dayCounts[0].count - todayCount
    document.getElementById("bonus").textContent =  `${dayCounts[0].icon} ${daysUntil} days until ${dayCounts[0].name}!`
}
//0x2728 retro twinkle stars
//0x2B50 simple star
//0x1F385 santa
//0x1F9DB vampire String.fromCodePoint(0x1F9DB)
//0x1F382 birthday cake String.fromCodePoint(0x1F382)
//0x1F39E movie clapboard
//0x1F4C5 generic calendar