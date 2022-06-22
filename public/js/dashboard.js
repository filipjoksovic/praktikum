function getUserData() {
    $.get('/user', (response) => {
        console.log(response)
        if (!response.hasOwnProperty("status")) {
            $("#um_fname").val(response.firstname)
            $("#um_lname").val(response.lastname)
            $("#um_email").val(response.email)
            $("#um_phone").val(response.phone)
            $("#um_address").val(response.address)
            $("#um_city").val(response.city)
            $("#um_street").val(response.street)
            $("#um_street_number").val(response.streetnumber)
            $("#um_zip_code").val(response.zipcode)
            $("#um_country").val(response.country)
            $("#um_user_id").val(response.id)
            document.getElementById('updateUser').setAttribute('onclick', `updateUser()`)
        }
        else {
            $("#modalContainer").append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
    })
}

$(function () {
    getUserData()
    getReservations()
})
function updateUser() {
    let user = {
        "user_id": $("#um_user_id").val(),
        "firstname": $("#um_fname").val(),
        "lastname": $("#um_lname").val(),
        "phone": $("#um_phone").val(),
        "email": $("#um_email").val(),
        "password": "password",
        "role_id": 1,
        "city": $("#um_city").val(),
        "street": $("#um_street").val(),
        "street_number": $("#um_street_number").val(),
        "zipcode": $("#um_zip_code").val(),
        "country": $("#um_country").val()
    }
    console.log(user)
    $.post("/users/" + user.id + "/update", user, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#modalContainer").append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#modalContainer").append(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                getUserData()
            }, 2000);
        }
    })
}

function getUserId() {
    $.get('/getUserID', (response) => {
        console.log('usli smo')
        console.log(typeof response)
        console.log(response)
        $('#ocenaKorisnik').val(response.id)
    })
}

function getUserId2() {
    $('#userId')
        .find('option')
        .remove()
        .end();
    $.get('/getUserID', (response) => {
        let element = document.createElement('option')
        element.value = response.id
        element.innerHTML = `${response.username}`
        document.getElementById('userId').appendChild(element)
        return response
    })
}

function createRating() {

    let rating = {
        "text": $("#text").val(),
        "rating": $("#rating").val(),
        "offered_service_id": $("#offeredServiceId").val(),
        "user_id": $("#ocenaKorisnik").val(),
    }
    console.log(rating)
    $.post("/ratings", rating, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#ratingModal .modal-content .modal-body").prepend(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#ratingModal .modal-content .modal-body").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
    })
}



function getReservations() {
    $(".nav-pill").removeClass("active")
    $("#reservationsPill").addClass("active")
    $(".data-container").html('');
    let dataContainer = $(".data-container")
    let reservationContainer = document.createElement('div')
    reservationContainer.classList.add("row")

    $.get("/user/reservations", (response) => {
        if (response.status == 200) {
            let reservations = response.data
            if (reservations.length == 0) {
                dataContainer.append(`
            <h1 class = "text-center text-white pt-5"> ¯\\_(ツ)_/¯<br> Nimate nobene rezervacije</h1>`)
            }
            reservations.forEach(reservation => {

                let date = new Date(reservation.reservation_date)
                let date1 = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
                let hours = date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()

                let today = new Date();

                let a = date.getTime();
                let b = today.getTime();
                let reviewButton = (reservation.isReviewed == 1) ? `` : `<button class='btn primary' data-bs-toggle="modal" data-bs-target="#ratingModal" onclick="prepareOcena(${reservation.offered_service});getUserId()"><i class="fa-solid fa-comment"></i></button>`
                let expired = (a > b) ? "" : "expired";
                let actions = (a > b) ?
                    `
                <div class = 'reservation-actions'>
                    <button class = 'btn warning' data-bs-toggle="modal" data-bs-target="#reservationBookingModalDashboard" onclick="prepareReservationUpdate(${reservation.id})"><i class = "fa-solid fa-edit"></i></button>
                    <button class = "btn danger" data-bs-toggle="modal" data-bs-target="#deleteReservationModalDashboard" onclick="prepareReservationDelete(${reservation.id})"><i class = "fa-solid fa-times"></i></button>
                </div>
                `
                    :
                    `
                <div class = 'reservation-actions'>                                                 
                    ${reviewButton}
                 </div>
                `
                let element = `
                <div class="reservation-container ${expired}">
                <div class = "reservation-data ${expired}">
                <div class= 'reservation-title'>
                ${reservation.name}
                </div>
                <div class = 'reservation-dealership'>
                ${reservation.dealership}
                </div>
                <div class = 'reservation-date'>
                   ${date1} ob ${hours}
                </div>
                </div>
                    ${actions}
                    </div>
                 `
                $(dataContainer).append(element)


            }


            )
        }
        console.log(response)
    })
}


function getReviews() {
    $(".nav-pill").removeClass("active")
    $("#reviewsPill").addClass("active")
    $(".data-container").html('');
    $.get('/user/reviews', (response) => {
        console.log(response)
        if (response.data.length == 0) {
            $(".data-container").append(`
        <h1 class = "text-center text-white pt-5"> ¯\\_(ツ)_/¯<br> Nimate nobene ocene</h1>`)
        }
        response.data.forEach(review => {
            let date = new Date(review.created_at)
            date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
            let element = `<div class="service-review user">
            <div class="review-header fs-5">
                <div class="userinfo-rewiew">
                     <span> ${review.dname} - ${review.sname} </span>
                </div>
                <div class="review-stars">
                    ${getStars(review.rating)}
                </div>
            </div>
            <div class="review-body">
                <div class="review-text">
                    <span> ${review.text} </span>
                </div>
                <div class = "review-footer">
                    <div class="review-date ">
                        <p class="m-0">  ${date} </p>
                    </div>
                    <div>
                    <input type="hidden" value="${review.id}" id="ratingId">
                    </div>
                    <div class = "review-actions">
                        <button class = "btn danger" data-bs-toggle="modal" data-bs-target="#deleteModalRating" onclick="startDeleteRating(${review.id})" ><i class = "fa-solid fa-times"></i></button>
                        <button class = "btn warning" data-bs-toggle="modal" data-bs-target="#ratingUpdateModal" onclick="prepareRating(${review.rating_id})"><i class = "fa-solid fa-edit"></i></button>
                </div>
                </div>
            </div> 
        </div>`
            $(".data-container").append(element)
        });

    })
}

function updateRating() {


    let rating = {
        "rating_id": $("#inputRatingId").val(),
        "text": $("#textUpdate").val(),                           //$("#ocenaIskusnje").val(),
        "rating": $("#ratingUpdate").val(),
    }


    $.post("/updateRating", rating, function (response) {
        console.log(response)
        if (response.status == 500) {
            console.log("Prislo je do napake")
            $("#ratingUpdateModal .modal-content .modal-body").prepend(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `)
        }
        else {
            console.log("Vspesno ste updateovali ocenu ")
            $("#ratingUpdateModal .modal-content .modal-body").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `)
            setTimeout(() => {
                $(".btn-close").click()

            }, 1000)
            setTimeout(() => {
                $("#nekimodal").click()

            }, 2000)
            // getUserCars();
        }
    })
}

function startDeleteRating(rating_id) {
    $("#deleteRatingModalId").val(rating_id)
}


function deleteRating() {



    $.post('/deleteRatings', { "rating_id": $("#deleteRatingModalId").val() }, function (response) {
        if (response.status == 500) {
            console.log("Niste vspeli da zbrisete oceno")
            $("#deleteModalRating .modal-content .modal-body").prepend(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            console.log("Vspesno ste izbrisali oceno")
            $("#deleteModalRating .modal-content .modal-body").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                // getUserCars();
            }, 2000);
        }
    })
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
function getQuestions() {
    $(".nav-pill").removeClass("active")
    $("#questionsPill").addClass("active")
    $(".data-container").html('');
    $.get("/user/posts", (response) => {
        if (response.data.length == 0) {
            $(".data-container").append(`
        <h1 class = "text-center text-white pt-5"> ¯\\_(ツ)_/¯<br> Nimate se vprasanja</h1>`)
        }

        let posts = response.data

        let dataContainer = $(".data-container")
        let reservationContainer = document.createElement('div')
        reservationContainer.classList.add("row")

        posts.forEach(post => {

            console.log(post)

            let element = `
            <div class="reservation-container">
            <div class = "reservation-data">
            <div class= 'reservation-title'>
            <span>
            ${post.title}
            <span>
            </div>
            <div class = 'reservation-dealership'>
            
            </div>
            <div class = 'reservation-date'>
            <span>
            ${post.text}
            <span>
            </div>
            </div>
            <div class = 'reservation-actions'>
                <button class = "btn danger" type="button"><i class = "fa-solid fa-times"></i></button>
            </div>
                </div>
             `
            $(dataContainer).append(element)
        })


    })
}

function getUserCars() {
    $(".nav-pill").removeClass("active")
    $("#userCarsPill").addClass("active")
    $(".data-container").html('');
    let dataContainer = $(".data-container")
    let reservationContainer = document.createElement('div')
    reservationContainer.classList.add("row")

    $.get("/user/cars", (response) => {
        if (response.status == 200) {
            let cars = response.data
            if (cars.length == 0) {
                dataContainer.append(`
            <h1 class = "text-center text-white pt-5"> ¯\\_(ツ)_/¯<br> Nimate dodanih avtomobila</h1>`)
            }
            cars.forEach(car => {


                let element = `
                <div class="reservation-container">
                <div class = "reservation-data">
                <div class= 'reservation-title'>
                <span>
                ${car.model}
                
                </div>
                <div class = 'reservation-dealership'>
                ${car.manufactured_year}
                </div>
                <div class = 'reservation-date'>
                </div>
                </div>
                <div class = 'reservation-actions'>
                    <button class = 'btn warning' type="button"  onclick="prepareCarEdit(${car.id})" ><i class = "fa-solid fa-edit"></i></button>
                    <button class = "btn danger" type="button" onclick="deleteCar(${car.id})"><i class = "fa-solid fa-times"></i></button>
                </div>
                    </div>
                 `
                $(dataContainer).append(element)
            })
        }
        console.log(response)
    })
}
function prepareCarEdit(cid) {
    getCarData(cid);
    getUserId();
    displayEditWindow(cid)
}
function displayEditWindow(cid) {
    $(".data-container").empty()
    $(".data-container").append(`
    <button class="navigation" onclick = "getUserCars()">
        <div class="navigation-icon">
            <i class="fas fa-arrow-left"></i>
        </div>
        <span class="navigation-text">Back</span>
    </button>
    `)
    $(".data-container").append(`
    <h1 class = "text-white">Sprememba podatkov o avtomobilu</h1>`)
    $(".data-container").append(`
    <div class="row">
    <div class="col-md-6">
    <div class="form-group">
    <label for="manufacturerCar">Manufacturer</label>
    <select class="form-control" id="manufacturerCar" name="manufacturer">
    </select>
    </div>
    </div>
    <div class="col-md-6">
    <div class="form-group">
    <label for="model">Model</label>
    <input type="text" class="form-control" id="model" name="model" placeholder="Model">
    </div>
    </div>
    </div>
    <div class="row">
    <div class="col-md-12">
    <div class="form-group">
    <label for="year">Year</label>
    <input type="text" class="form-control" id="year" name="year" placeholder="Year">
    </div>
    </div>
    <button class = "btn success mt-3" onclick = "updateCar(${cid})">Shrani</button>
    `)
    getManufacturers()
    fetch(`/cars/${cid}`).then(res => res.json()).then(car => {
        console.log(car)
        $("#model").val(car[0].model)
        $("#year").val(car[0].manufactured_year)
        //   $("#user_id").val(car.user_id)
        $("#manufacturerCar").val(car[0].manufacturer_id)
        // document.getElementById('carupdate').setAttribute('onclick', `updateCar(${did})`)
    })

}


// function getUserCars(){
//     $(".nav-pill").removeClass("active")
//     $("#userCarsPill").addClass("active")
//     $(".data-container").html('');

//     let dataContainer = $(".data-container")
//     let alertContainer = document.createElement('div')
//     alertContainer.id = "alertContainer"
//     $(dataContainer).append(alertContainer)
//     let cars = document.createElement("div")
//     cars.className = "cars"

//     let avtomobil = fetch('/cars/').then(res => res.json()).then(avtomobil => {
//         console.log(avtomobil)

//         if (avtomobil.length > 0) {

//             avtomobil.forEach(avtomobil => {
//                 let date = new Date(avtomobil.created_at)
//                 date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()

//                 let element = `
//                 <div class="reservation-container">
//                 <div class = "reservation-data">
//                 <div class= 'reservation-title'>
//                 ${avtomobil.model}
//                 </div>
//                 <div class = 'reservation-dealership'>
//                 ${avtomobil.name}
//                 </div>
//                 <div class = 'reservation-date'>
//                    ${date}
//                 </div>
//                 </div>
//                 <div class = 'reservation-actions'>
//                     <button class = 'btn warning'  ><i class = "fa-solid fa-edit"></i></button>
//                     <button class = "btn danger" type="button" onclick="deleteCar(${avtomobil.id})"><i class = "fa-solid fa-times"></i></button>
//                 </div>
//                     </div>
//                  `
//                 $(dataContainer).append(element)
//                 $(dataContainer).append(element)
//             });
//         }
//         else {
//             $(dataContainer).append(`
//                 <h1 class = "text-center text-white"> ¯\\_(ツ)_/¯<br> Ni avtomobilov</h1>
//             `)
//         }
//     })
// }

function getCarForm() {

    $(".nav-pill").removeClass("active")
    $("#carsPill").addClass("active")
    $(".data-container").html('');
    let dataContainer = $(".data-container")
    let adviceContainer = document.createElement('div')
    adviceContainer.classList.add("row")

    let element = `
                <div id="questionModalErr">

                </div>
                <div class="advice-container">
                <div class="advice-header">
                    <h4 class="modal-title" id="exampleModalLabel">Dodaj automobil</h4>
                </div>
                <div class="modal-body question-modal">
                
                    <div class="form-group">
                        <label for="">Proizvodjac</label>
                        <select name="manufacturers" id="manufacturerCar" onchange="onChangeId()" class="form-control">
                        </select>
                    </div>

                    <div class="form-group">
                    <label for="">Model</label>
                    <input type="text" class="form form-control" id="modelCar">
                </div>

                <div class="form-group">
                        <label for="">Leto proizvodnje</label>
                        <input type="number" min="1900" max="2099" class="form form-control" id="yearCar">
                    </div>

                    <div class="form-group" style="visibility: hidden">
                        <label for="">Korisnik</label>
                        <select name="manufacturers" id="userId" class="form-control">
                        </select>
                    </div>

                    
                </div>
                <div class="modal-footer">
                   <button type="button" class="btn btn-primary modal-save" 
                   onclick="createAutomobil()">Dodaj</button>
                </div>
                </div>
                 `
    $(dataContainer).append(element)
}

function getCarData(did) {
    // fetch(`/cars/${did}`).then(res => res.json()).then(car => {
    // console.log(car)
    //  $("#modelCar").val(car.model)
    //   $("#yearCar").val(car.manufactured_year)
    //   $("#user_id").val(car.user_id)
    //   $("#manufacturerCar").val(car.manufacturer_id)   
    // document.getElementById('carupdate').setAttribute('onclick', `updateCar(${did})`)
    //  })
}

function emptyCarModal() {
    $("#modelCar").val("")
    $("#yearCar").val("")
    $("#manufacturerCar").val("")
    $("#user_id").val("")

}

function onChangeId() {

    var id = $(manufacturerCar).val();
    $("#manufacturerCarId").val(id);


}

function prepareOcena(offered_service_id) {
    console.log(offered_service_id)
    $("#offeredServiceId").val(offered_service_id)
}

function prepareRating(rating_id) {
    console.log(rating_id)
    $("#inputRatingId").val(rating_id)
}

function createAutomobil() {

    let car = {
        "model": $("#modelCar").val(),
        "manufactured_year": $("#yearCar").val(),
        "manufacturer_id": $("#manufacturerCar").find("option:selected").val(),
        "user_id": $("#userId").val(),
    }

    console.log(car)
    $.post("/cars", car, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#questionModalErr").append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `)
        }
        else {
            $("#questionModalErr").append(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `)
            setTimeout(() => {
                $("#questionCreateModalClose").click()

            }, 2000)
        }
    })
}

function updateCar(car_id) {

    let car = {
        "model": $("#model").val(),
        "manufactured_year": $("#year").val(),
        "manufacturer_id": $("#manufacturerCar").find("option:selected").val(),
        "id": car_id
    }

    console.log(car)
    console.log(car_id)
    $.post("/updateCars/:id" + car.id, car, function (response) {
        console.log(response)
        if (response.status == 500) {
            $(".data-container").prepend(`
            <div class="alert alert-danger alert-dismissible fade show my-2" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `)
        }
        else {
            $(".data-container").prepend(`
            <div class="alert alert-success alert-dismissible fade show my-2" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `)
            setTimeout(() => {
                getUserCars();
            }, 2000)
        }
    })
}

function prepareReservationDelete(reservation_id) {

    $("#deleteRatingModalIdDashboard").val(reservation_id);
    console.log(reservation_id)
}

function prepareReservationUpdate(reservation_id) {
    $("#reservation_id_dashboard").val(reservation_id);
    console.log(reservation_id)
}


function updateReservation2() {

    let reservation = {
        "reservation_id": $("#reservation_id_dashboard").val(),
        "reservation_date": $("#reservation_date_dashboard").val(),
    }


    $.post("/updateReservation", reservation, function (response) {
        console.log(reservation)
        console.log(response)
        if (response.status == 200) {

            $("#reservationBookingModalDashboard .modal-content .modal-body").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="success" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#reservationBookingModalDashboard").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)

        }
        getReservations()
        setTimeout(() => {
            $("#reservationBookingModalDashboard").modal('hide')
        }, 2000);
    })
}



function deleteReservation() {

    $.post("/deleteReservation", { "reservation_id": $("#deleteRatingModalIdDashboard").val() }, function (response) {
        console.log(response)
        if (response.status == 200) {

            $("#deleteReservationModalDashboard .modal-content .modal-body").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="success" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#deleteRatingModalIdDashboard").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)

        }
        getReservations()
        setTimeout(() => {
            $("#deleteReservationModalDashboard").modal('hide')
        }, 2000);
    })
}



function deleteCar(car_id) {
    let a = car_id

    let dataContainer = $(".data-container")
    let alertContainer = document.createElement('div')
    alertContainer.id = "alertContainer"
    $(dataContainer).prepend(alertContainer)

    $.post('/deleteCar', { "car_id": a }, function (response) {
        if (response.status == 500) {
            $("#alertContainer").prepend(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#alertContainer").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                getUserCars();
            }, 2000);
        }
    })
}

function deleteUserPost(post_id) {
    let a = post_id
    let dataContainer = $(".data-container")
    let alertContainer = document.createElement('div')
    alertContainer.id = "alertContainer"
    $(dataContainer).prepend(alertContainer)

    $.post('/deletePost', { "post_id": a }, function (response) {
        if (response.status == 500) {
            $("#alertContainer").prepend(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#alertContainer").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                getQuestions();
            }, 2000);
        }
    })
}

function getManufacturers() {
    $('#manufacturerCar')
        .find('option')
        .remove()
        .end();


    $.get('/manufacturers', (response) => {
        response.forEach(manufacturers => {
            let element = document.createElement('option')
            element.value = manufacturers.id;
            element.innerHTML = `${manufacturers.name}`;
            document.getElementById("manufacturerCar").appendChild(element) // PITANJE
        })
    })

}

function getFavorites() {
    $(".nav-pill").removeClass("active")
    $("#favoritesPill").addClass("active")
    let dataContainer = $(".data-container")
    $(".data-container").html('');
    let rowContainer = document.createElement('div')
    rowContainer.classList.add("row")
    $.get("/user/favorites", (response) => {
        console.log(response)
        if (response.status == 200) {
            let dealerships = response.data
            if (dealerships.length == 0) {
                $(".data-container").append(`
            <h1 class = "text-center text-white pt-5"> ¯\\_(ツ)_/¯<br> Nimate se favorite</h1>`)
            }
            dealerships.forEach(dealership => {
                let isLicensed = (dealership.isLicenced) ? ` <i class="fa-solid fa-circle-check verified ml-3"></i>` : ``
                let stars = ``

                $.get('/avgRating/' + dealership.id, (response) => {
                    console.log(response)
                    let rating = (response.hasOwnProperty("rating")) ? Math.round(response.rating) : 0
                    for (let i = 0; i < rating; i++) {
                        stars += `<i class = 'fa-solid fa-star'></i>`
                    }
                    for (let i = rating; i < 5; i++) {
                        stars += `<i class = 'fa-regular fa-star'></i>`
                    }
                    let element = `
                <div class="col-md-6">
                <div class="dealership light">
                    <div class="dealership-data">
                        <span class="dealership-name">${dealership.name} ${isLicensed}</span>
                        <span class="dealership-address">${dealership.street} ${dealership.street_number}, ${dealership.city}, ${dealership.country}</span>
                    </div>
                    <button class="view-details danger text-white" type="button"
                         onclick = "removeFromFavorites(${dealership.cid})"><i class="fa-solid fa-times"></i></button>
                    <div class="review">
                        ${stars} <span class="rating"> (${(response.hasOwnProperty('count')) ? response.count : "0"})</span>
                    </div>
                </div>
            </div>`
                    $(rowContainer).append(element)
                })

            });
            $(dataContainer).append(rowContainer)
        }
    })
}
function removeFromFavorites(did) {
    $.post("/removeFavoriteDealership/" + did, (response) => {
        if (response.status == 200) {
            $(".data-container").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $(".data-container").prepend(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        setTimeout(() => {
            getFavorites()
        }, 2000);
    })
}