$(document).ready(function () {
    loadServicesData()
});
function loadHeader(text) {
    $(".action-frame.active").empty()
    let actiontitle = document.createElement("div")
    $(actiontitle).addClass("action-title")
    let header = document.createElement("h1")
    $(header).text(text)
    $(actiontitle).append(header)
    $(".action-frame.active").append(actiontitle)
}
function loadActionButton(type) {
    if (type == "service") {
        let button = `
        <div id = "actionSearch">
        <button class="search-icon" onclick="prepareServiceAdd()"><i class = "fa-solid fa-plus"></i></button>
        </div>`
        $(".action-title").append(button)
    }
}

function loadServicesData() {
    loadHeader("Prikaz storitev")
    loadActionButton("service")
    getServices()
}
function loadRatingsData() {
    loadHeader("Prikaz ocen")
    getRatings()

}
function loadReservationsData() {
    loadHeader("Prikaz rezervacij")
    getReservations()
}
//must contain action frame
//header is action title



function getServices() {
    console.log("getting services")
    $.get('/dealership/services', (response) => {
        console.log(response)
        displayServices(response)
    })
}
function displayServices(data) {
    if (!data) {
        $(".action-frame.active").append("<h1 class = 'text-center'>¯\\_(ツ)_/¯<br>Ni storitev</h1>")
        console.log("no services")
        return
    }
    let container = document.createElement("div")
    $(container).addClass("row");
    data.forEach(service => {
        let serviceContainer = `
        <div class="col-md-6">
            <div class="service-details flex-column" data-service-id=${service.id}>
                <span class="service-description">
                    <span class="service-name">
                        ${service.name}
                    </span>
                    <span class="service-category w-75">
                        ${service.description}
                    </span>
                    <span>€ ${service.price.toFixed(2)}</span>
                </span>
                <div class="service-click">
                    <button href="" class="btn" onclick = 'prepareServiceEdit(${service.id})'><i class = "fa-solid fa-edit"></i></button>
                    <button href="" class="btn danger"  onclick="prepareServiceDelete(${service.id})"><i class = "fa-solid fa-trash"></i></button> 
                </div>
            </div>
        </div>`
        $(container).append(serviceContainer)
    });
    $(".action-frame.active").append(container)
}
function getReservations() {
    $.get('/dealership/reservations', (response) => {
        console.log(response)
        displayReservations(response)
    })
}
function displayReservations(data) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    if (!data) {
        $(".action-frame.active").append("<h1 class = 'text-center'>¯\\_(ツ)_/¯<br>Ni rezervacij</h1>")
        console.log("no reservations")
        return
    }
    let container = document.createElement('div')
    container.classList.add('row')


    data.forEach(reservation => {
        let date = new Date(reservation.reservation_date)
        let date1 = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        let hours = date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        let element = `
        <div class = "col-md-6">
                <div class="reservation data-container" reservation-user-id="user-${reservation.user_id}">
                <div class="dc-header">
                
                    <span> ${reservation.name} </span>
                </div>
                <div class="dc-body">

                    <span>Uporabnik: ${reservation.firstname} ${reservation.lastname} </span>
                    <span>Reservation Date: ${date1} </span>
                    <span>Hours: ${hours} </span>
                </div>
                <div class="dc-footer">
                    <button class="buttonReserations btn-danger" onclick = 'prepareReservationDelete(${reservation.id})'><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            </div>
            `;
        $(container).append(element)
    });
    $(".action-frame.active").append(container)
}
function getRatings() {
    $.get('/dealership/reviews', (response) => {
        console.log(response)
        displayRatings(response)
    })
}
function displayRatings(data) {
    let container = document.createElement("div")
    $(container).addClass("row");
    if (!data) {
        $(".action-frame.active").append("<h1 class = 'text-center'>¯\\_(ツ)_/¯<br>Ni ocen</h1>")
        console.log("no services")
        return
    }
    data.forEach(review => {
        let date = new Date(review.created_at)
        date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        let ratingContainer = `
        <div class = "col-md-6">
            <div class="service-review">
                <div class="review-header">
                    <div class="userinfo-rewiew">
                        <span> ${review.firstname} ${review.lastname} </span>
                    </div>
                    <div class="review-stars">
                        ${getStars(review.rating)}
                    </div>
                </div>
                <div class="review-body">
                    <div class="review-text">
                        <span> ${review.text} </span>
                    </div>
                    <div class="review-date ">
                        <p class="m-0">  ${date} </p>
                    </div>
                </div>
            </div>
        </div>`
        $(container).append(ratingContainer);
    })
    $(".action-frame.active").append(container)
}



function getStars(rating) {
    let stars = ""
    for (let i = 0; i < rating; i++) {
        stars += `<i class="fa-solid fa-star mx-1"></i>`
    }
    for (let i = rating; i < 5; i++) {
        stars += `<i class="fa-regular fa-star"></i>`
    }
    return stars;
}

function prepareServiceEdit(sid) {
    $(".action-frame.active").empty()
    loadHeader("Spremeni servis")
    $.get("/dealership/offeredServices/" + sid, (service) => {
        console.log(service)
        let options = ""
        $.get("/services", (response) => {
            console.log(response)

            response.forEach(service => {
                options += `<option value = "${service.id}">${service.name}</option>`
            });
            let container = `
        <div class="row">
            <div class="col-md-6">
                <div class = "form-group">
                    <label for = "service-name">Ime storitve</label>
                    <select type="text" class="form-control" id="service-name" placeholder="Ime storitve">
                        ${options}
                    </select>
                </div>
            </div>
            <div class = "col-md-6">
                <div class = "form-group">
                    <label for = "service-price">Cena storitve</label>
                    <input type="number" class="form-control" id="service-price" placeholder="Cena storitve" value = "${service.price}">
                </div>
            </div>
            <div class = "col-md-12">
                <div class = "form-group">
                    <label for = "service-description">Opis storitve</label>
                    <textarea class="form-control" id="service-description"  rows = "7">${service.description}</textarea>
                </div>
            </div>
        </div>
        <div class = "row mt-3">
            <div class = "col-md-6">
                <button class="btn w-100" onclick = 'editService(${sid})'>Spremeni</button>
            </div>
            <div class = "col-md-6">
                <button class = "btn danger w-100" onclick = 'loadServicesData()'>Prekliči</button> 
            </div>
        </div>
    `
            $(".action-frame.active").append(container)
        })

    })
}
function editService(sid) {
    let data = {
        id: sid,
        name: $("#service-name").val(),
        price: $("#service-price").val(),
        description: $("#service-description").val()
    }
    $.post("/dealership/offeredServices/" + sid, data, (response) => {
        if (response.status == 500) {
            $(".action-frame.active").prepend(
                `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 <strong>Napaka!</strong> ${response.message}
                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `
            )
        }
        else {
            $(".action-frame.active").prepend(
                `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                 <strong>Uspeh!</strong> ${response.message}
                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `
            )
        }
        setTimeout(() => {
            loadServicesData();
        }, 1000);
    })
}
function prepareServiceDelete(sid) {
    $(".action-frame.active").empty()
    loadHeader("Izbriši servis")
    $(".action-frame.active").append(`
        <h1 class = "text-center">
        (•‿•)<br>
        Ta storitev bo za vedno izbrisiana!
        Nadaljujte z brisanjem?
        </h1>
    `)
    $(".action-frame.active").append(`
        <div class = "row mt-3">
            <div class = "col-md-6">
                <button class = "btn danger w-100" onclick = 'deleteService(${sid})'>Izbriši</button>
            </div>
            <div class = "col-md-6">
                <button class = "btn w-100" onclick = 'loadServicesData()'>Prekliči</button>
            </div>
        </div>`)
}
function deleteService(sid) {
    $.ajax({
        url: "/dealership/offeredServices/" + sid,
        type: "DELETE",
        success: function (response) {
            $(".action-frame.active").prepend(
                `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                 <strong>Uspeh!</strong> ${response.message}
                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `
            )
            setTimeout(() => {
                loadServicesData();
            }, 1000);
        }
    })
}
function prepareReservationDelete(rid) {
    $(".action-frame.active").empty()
    loadHeader("Izbriši servis")
    $(".action-frame.active").append(`
        <h1 class = "text-center">
        (•‿•)<br>
        Ta rezervacija bo za vedno izbrisiana!
        Nadaljujte z brisanjem?
        </h1>
    `)
    $(".action-frame.active").append(`
    <div class = "row mt-3">
        <div class = "col-md-6">
            <button class = "btn danger w-100" onclick = 'deleteReservation(${rid})'>Izbriši</button>
        </div>
        <div class = "col-md-6">
            <button class = "btn w-100" onclick = 'loadReservationsData()'>Prekliči</button>
        </div>
    </div>`)
}
function deleteReservation(rid) {
    $.ajax({
        url: "/dealership/reservations/" + rid,
        type: "DELETE",
        success: function (response) {
            $(".action-frame.active").prepend(
                `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                 <strong>Uspeh!</strong> ${response.message}
                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `
            )
            setTimeout(() => {
                loadReservationsData();
            }, 1000);
        }
    })
}
function prepareServiceAdd() {
    $(".action-frame.active").empty()
    loadHeader("Dodaj servis")
    let options = ""
    $.get('/services', (response) => {
        console.log(response)

        response.forEach(service => {
            options += `<option value = "${service.id}">${service.name}</option>`
        });
        $(".action-frame.active").append(`
        <div class = "row">
            <div class = "col-md-6">
                <div class = "form-group">
                    <label for = "service-name">Ime servisa</label>
                    <select type="text" class="form-control" id="service-name" placeholder="Ime servisa">
                        ${options}
                    </select>
                </div>
            </div>
            <div class = "col-md-6">
                <div class = "form-group">
                    <label for = "service-price">Cena servisa</label>
                    <input type="number" class="form-control" id="service-price" placeholder="Cena servisa">
                </div>
            </div>
            <div class = "col-md-12">
                <div class = "form-group">
                    <label for = "service-description">Opis servisa</label>
                    <textarea class="form-control" id="service-description"  rows = "7"></textarea>
                </div>
            </div>
        </div>
        <div class = "row mt-3">
            <div class = "col-md-6">
                <button class="btn w-100" onclick = 'addService()'>Dodaj</button>
            </div>
            <div class = "col-md-6">
                <button class = "btn danger w-100" onclick = 'loadServicesData()'>Prekliči</button> 
            </div>
        </div>
    `)
    })
}
function addService() {
    let data = {
        service_id: $("#service-name :selected").val(),
        price: $("#service-price").val(),
        description: $("#service-description").val()
    }
    $.post("/dealership/services", data, (response) => {
        if (response.status == 500) {
            $(".action-frame.active").prepend(
                `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                 <strong>Napaka!</strong> ${response.message}
                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `
            )
        }
        else {
            $(".action-frame.active").prepend(
                `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                 <strong>Uspeh!</strong> ${response.message}
                 <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `
            )
        }
        setTimeout(() => {
            loadServicesData();
        }, 1000);
    })
}