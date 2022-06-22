let pos = null;
let socket = io();
socket.emit("join", 1)

socket.on("bookingAccepted", (data) => {
    console.log(data)
    $("#pageContent").prepend(`
    <div class="alert alert-success alert-dismissible fade show" role="alert">
             ${data}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
    `)
    setTimeout(() => {
        $("#pageContent .alert").remove()
    }, 2000);
})

function findMechanic() {


}

function getMechanics() {
    console.log("getting mechanics")
    loadMechanics()

}
function loadMechanics() {
    let parent = $("#pageContent")
    $(parent).empty()
    loadSearchBar("map")

    let submitForm = `
        <button class = "btn primary w-100 mt-1 text-dark" onclick = "bookMechanic()">Proišči mehanika.</button>
    `
    initMechanicMap()
    $(parent).append(submitForm)

}
function bookMechanic() {
    console.log(pos)
    let data = {
        latitude: pos.lat,
        longitude: pos.lng
    }
    $.post("/bookMechanic", data, (response) => {
        if (response.status == 500) {
            $("#pageContent").prepend(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
             <strong>Napaka!</strong> ${response.message}<br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `)
        }
        else {
            $("#pageContent").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
             <strong>Uspeh</strong>Uspešno kreiran zahtev za mehanika.<br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `)
            // socket.emit("createBooking", pos)
            socket.emit("bookMechanic", pos)
        }
    })
}
let map, infoWindow;

function initMechanicMap() {
    $("#pageContent").append(`
        <div class = "map" id = "map"></div>
    `)
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15,
    });
    infoWindow = new google.maps.InfoWindow();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(pos);
                const marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                });
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

window.initMechanicMap = initMechanicMap;
