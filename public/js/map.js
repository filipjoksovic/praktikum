//url https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBsDFmWDBjBZOYOY7LPxscKl6aACI4W8OQ

function initMap(address) {
    // The location of Uluru
    $.get("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=AIzaSyBsDFmWDBjBZOYOY7LPxscKl6aACI4W8OQ",(response)=>{
        console.log(response)
        let lat = response.results[0].geometry.location.lat;
        let lng = response.results[0].geometry.location.lng;
        const location = { lat,lng};
        console.log(document.getElementById("map"))
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 17,
            center: location,
        });
        // The marker, positioned at location
        const marker = new google.maps.Marker({
            position: location,
            map: map,
        });
    
    })
    // The map, centered at Uluru
        // console.log("hello")
}

window.initMap = initMap;