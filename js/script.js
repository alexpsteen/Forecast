window.onload = function(){
    setDays();
    getWoeids("Atlanta, GA");
}

function setDays() {
    var date = new Date();
    var day = date.getDay();
    
    for (var i = 0; i < 7; ++i) {
        var a = (day + i) % 7;
        var n = dayName(a);
        document.getElementById("day" + i).innerHTML = ("<p>"+n+"</p>");
    }
}

function dayName(a) {
    // alert(a);
    switch(a) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "&23869";
    }
}


function displayData() {
    
    for (var i = 0; i < 7; ++i) {
        var icon = document.getElementById("icon"+i);
        var weath = getWeather(text[i]);
        icon.innerHTML = weath;
    }
    displayGraph();
}

function getWeather(type) {
    
    if (type.includes("Cloudy")) {
        return "<p>Cloudy</p> <img class='weatherIcon' src='../img/cloudy.ico'/>";
    } else if (type.includes("Sunny")) {
        return "<p>Sunny</p> <img class='weatherIcon' src='../img/sunny.png'/>";
    } else if (type.includes("Thunderstorms")) {
        return "<p>Thunderstorms</p> <img class='weatherIcon' src='../img/thunderstorms.ico'/>";
    } else if (type.includes("Showers") || type == "Rain") {
        return "<p>Showers</p> <img class='weatherIcon' src='../img/showers.png'/>";
    } else if (type.includes("Breezy")){
        return "<p>Breezy</p> <img class='weatherIcon' src='../img/breezy.jpg'/>";
    } else if (type.includes("Snow")){
        return "<p>Snow</p> <img class='weatherIcon' src='../img/snow.png'/>";
    } else {
        return "<p>" + type + "</p>";
    }
}


function getWoeids(name){
    document.getElementById("day7").innerHTML = "<h3>7 Day Forecast for " + name + "</h3>";
    resetArrs();
    var query = "https://query.yahooapis.com/v1/public/yql?q=select%20woeid%20from%20geo.places%20where%20text%20in%20(";
    var b = name.split(", ");
    var city = b[0]; var state = b[1];
    var c = city.replace(" ","%20") + "%2C" + state;
    query += "%22" + c + "%22";
    query += ")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            runWeatherQuery(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", query, true);
    xhttp.send();
    
}

function runWeatherQuery(woeidObj) {
    var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(";
    
    query += woeidObj.query.results.place.woeid + ")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            showWeather(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", query, true);
    xhttp.send();    
}

var high, low, text;

function resetArrs(){
    high = [];
    low = [];
    text = [];
}

function showWeather(weatherObj){
    for(var i = 0; i < 7; i++) {
        high[i] = weatherObj.query.results.channel.item.forecast[i].high;
        low[i] = weatherObj.query.results.channel.item.forecast[i].low;
        text[i] = weatherObj.query.results.channel.item.forecast[i].text;
    }
    
    displayData();
}

function displayGraph() {
    var max_h = 220;
    var big = -Infinity;
    var smol = Infinity;
    
    for (var i = 0; i < 7; ++i) {
        if (high[i] > big) {
            big = high[i];
        }
        if (low[i] < smol) {
            smol = low[i];
        }
    }
    var dy = (big - smol);
    
    for (var i = 0; i < 7; ++i) {
        // alert(high[i]);
        var hi = (max_h / 2)*(2 + ((high[i]-big) / dy));
        var lo = (max_h / 2)*(2 + ((low[i]-big) / dy));
        var h = document.getElementById('hbar' + i).style.height = hi * .8;
        var l = document.getElementById('lbar' + i).style.height = lo * .8;
        
        document.getElementById("hib" + i).innerHTML = high[i];
        document.getElementById("lob" + i).innerHTML = low[i];
    }
        // alert(d);
    
    // alert(big + " " + smol + ": dy = " + dy);
}
