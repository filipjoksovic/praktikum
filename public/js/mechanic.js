let socket = io()
socket.emit("join", 5)

$(document).ready(() => {
    loadActiveBookings()
})

function loadActiveBookings() {
    $.get("/mechanic/bookings/available", (response) => {
        console.log(response)
        if (response.status == 500) {
            $(".action-frame.active").empty()
            $(".action-frame.active").append(`<h1 class = "text-center">¯\\_(ツ)_/¯<br>Ups...Prišlo je do napake pri obdelavi zahteva.</h1>`)
        }
        else {
            if (response.data.length == 0) {
                $(".action-frame.active").empty()
                $(".action-frame.active").append(`<h1 class = "text-center">¯\\_(ツ)_/¯<br>Trenutno ni na voljo nobenih zahtev</h1>`)
            }
            else {
                displayBookings(response.data)
            }
        }
    })
}

function loadFinishedBookings() {
    $.get("/mechanic/bookings", (response) => {
        console.log(response)
        if (response.status == 500) {
            $(".action-frame.active").empty()
            $(".action-frame.active").append(`<h1 class = "text-center">¯\\_(ツ)_/¯<br>Ups...Prišlo je do napake pri obdelavi zahteva.</h1>`)
        }
        else {
            if (response.data.length == 0) {
                $(".action-frame.active").empty()
                $(".action-frame.active").append(`<h1 class = "text-center">¯\\_(ツ)_/¯<br>Trenutno ni na voljo nobenih zahtev</h1>`)
            }
            else {
                displayBookings(response.data)
            }
        }
    })
}

function displayBookings(data) {
    $(".action-frame.active").empty()
    data.forEach(booking => {
        let actionButton = ``
        if (booking.booking_status_id == 1) {
            actionButton = `<button class="btn success mx-2 p-4 fs-3" onclick="acceptBooking(${booking.id})"><i class="fa-solid fa-arrow-right"></i></button>`
        }
        else if (booking.booking_status_id == 2) {
            actionButton = `<button class="btn success mx-2 p-4 fs-3" onclick="finishBooking(${booking.id})"><i class="fa-solid fa-check"></i></button>`
        }
        else {
            actionButton = `<button disabled class="btn danger mx-2 p-4 fs-3"><i class="fa-solid fa-times"></i></button>`

        }

        let element = `
        <div class="booking">
            <div class="booking-data">
                <div class="booking-user">
                    ${booking.firstname} ${booking.lastname}
                </div>
                <div class="booking-contact">
                    ${booking.phone}<br>${booking.email}
                </div>
            </div>
            <div class="booking-btn">
                <button class="btn warning mx-2 p-4 fs-3" onclick="openMap(${booking.booking_latitude},${booking.booking_longitude})"><i class="fa-solid fa-map"></i></button>
                ${actionButton}
            </div>
        </div>`
        $(".action-frame.active").append(element)
    });
}
socket.on("newBooking", (data) => {
    loadActiveBookings()
})
function openMap(lat, lng) {
    $(".action-frame.active").empty()
    let backButton = `
    <button class="navigation" onclick = "loadActiveBookings()">
        <div class="navigation-icon">
            <i class="fas fa-arrow-left"></i>
        </div>
        <span class="navigation-text">Back</span>
    </button>`
    let mapDiv = document.createElement("div")
    mapDiv.className = "map"
    mapDiv.id = "map"
    $(".action-frame.active").append(backButton)
    $(".action-frame.active").append(mapDiv)
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: { lat, lng }
    });
    // The marker, positioned at {lat,lng}
    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
    });
}
window.openMap = openMap;

function acceptBooking(booking_id) {
    $.post('/acceptBooking/' + booking_id, (response) => {
        console.log(response)
        if (response.status == 500) {
            $(".action-frame.active").empty()
            $(".action-frame.active").append(`<h1 class = "text-center">¯\\_(ツ)_/¯<br>Ups...Prišlo je do napake pri obdelavi zahteva.</h1>`)
        }
        else {
            loadActiveBookings()
            socket.emit("bookingAccepted", booking_id)
        }
    })
}
function finishBooking(booking_id) {
    $.post('/finishBooking/' + booking_id, (response) => {
        console.log(response)
        if (response.status == 500) {
            $(".action-frame.active").empty()
            $(".action-frame.active").append(`<h1 class = "text-center">¯\\_(ツ)_/¯<br>Ups...Prišlo je do napake pri obdelavi zahteva.</h1>`)
        }
        else {
            loadActiveBookings()
            socket.emit("bookingFinished", booking_id)
        }
    })
}
