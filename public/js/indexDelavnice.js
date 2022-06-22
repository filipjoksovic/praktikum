document.onload = getDelavnice();
//gets all car services on main
function getDelavnice() {
    loadSearchBar('dealerships')
    $.get('/carServices', (response) => {
        loadDealerships(response)
    })

}


function loadDealerships(dealerships) {
    $("#pageContent").empty()
    let parent = document.createElement("div")
    parent.id = "data-container"
    let rowContainer = document.createElement("div")
    rowContainer.className = "row"
    $(parent).empty()
    $(parent).hide()
    let loggedIn = sessionStorage.getItem('loggedIn')
    console.log(loggedIn)
    dealerships.forEach(dealership => {
        let buttonNotAdded = (loggedIn == "true") ? `<button class="favorite-add fa-regular fa-heart" id = "heart" type="button"
        onclick = "addToFavorites(this,${dealership.id})"></button>` : " "
        let buttonAdded = (loggedIn == "true") ? `<button class="favorite-add fa-solid fa-heart" id = "heart" type="button"
        onclick = "removeFromFavorites(this,${dealership.id})"></button>` : " "
        $.get('/isFavorite/' + dealership.id, (response) => {
            let fav_button = (response.favorite == 1) ? buttonAdded : buttonNotAdded;
            let isLicensed = (dealership.isLicenced) ? ` <i class="fa-solid fa-circle-check verified ml-3"></i>` : ``
            let stars = ``
            let isAllowed = dealership.isAllowed;
            if (isAllowed == 1) {
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
            <div class="dealership">
                <div class="dealership-data">
                    <span class="dealership-name">${dealership.name} ${isLicensed}</span>
                    <span class="dealership-address">${dealership.street} ${dealership.streetnumber}, ${dealership.city}, ${dealership.country}</span>
                    <span class="dealership-services">Top services: service 1, service 2,
                        service
                        3</span>
                </div>
                ${fav_button}
                <button class="view-details" type="button"
                     onclick = "getDealershipServices(${dealership.id})"><i class="fa-solid fa-eye"></i></button>
                <div class="review">
                ${stars} <span class="rating"> (${(response.hasOwnProperty('count')) ? response.count : "0"})</span>
                </div>
            </div>
        </div>`
                    $(rowContainer).append(element)
                })
            }
        })
    });
    if (dealerships.length == 0) {
        parent.append(`
    <h1 class = "text-center text-black pt-5"> ¯\\_(ツ)_/¯<br> Ni odobrenih delavnic</h1>
`)
    }
    $("#pageContent").append(parent)
    $(parent).append(rowContainer)
    $(parent).fadeIn(250)
}

//services that a single car service offers 
function getDealershipServices(did) {
    expandPage()
    $("#data-container").empty()
    let parent = $("#data-container");
    let dealershipContainer = document.createElement("div")
    dealershipContainer.className = "dealership-container"
    $(parent).slideUp()
    displayCarServiceData(did, parent, dealershipContainer)
}

// grouped services in main display
function getGroupedServices() {
    $("#pageContent").empty()
    let parent = document.createElement("div")
    parent.id = "data-container"
    $(parent).empty()

    loadSearchBar('groupedServices')
    $(parent).append(`
        <div id = 'services-container'></div>
    `)
    $("#pageContent").append(parent)
    $.get('/services', (response) => {
        loadServices(response)
    })
}
function loadSearchBar(type) {
    let parent = $("#pageContent")
    $(parent).find(".row").remove()
    let rowContainer = document.createElement('div')
    rowContainer.classList = 'row'
    console.log(type)
    let addButton = (type == 'questions') ?
        `<button type="button" class="search-icon" data-bs-toggle="modal" data-bs-target="#questionModal" onclick="loadQuestionUser()"><i class="fa-solid fa-plus"></i></button>
        <button type="button" class="search-icon"  onclick="choseFoum()" ><i class="fa-solid fa-comment"></i></button>`
        : "";
    let filterButton = (type != "map") ? `
        <button class="search-icon filter">
            <i class="fa-solid fa-filter" onclick="toggleFilter(this,'${type}')"></i>
            <div class="filter-container">
                <div class="content"></div>  
            </div>
        </button>` : ``
    $(rowContainer).append(`
    <div class="col-md-8"></div>
    <div class = "col-md-4">
        <div id="actionSearch">
            ${filterButton}
            ${addButton}
            <div class="search-icon" onclick="search('${type}')">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <div class="form-group">
                <input type="text" class="form-control dark" onkeyup = "search('${type}') "placeholder="Search" id="searchUsers">
            </div>
        </div>
    </div>
    `)
    $(parent).prepend(rowContainer)
    $(rowContainer).hide()
    $(rowContainer).fadeIn(250)
}
//function to load and display services during or not during search
function loadServices(services) {
    $("#services-container").empty()
    $("#services-container").hide()
    let rowContainer = document.createElement('div')
    rowContainer.className = 'row'
    services.forEach(service => {
        let element = `
        <div class = 'col-md-6'>
            <div class = 'dealership'>
                <div class="dealership-data">
                    <span class="dealership-name">${service.name}</span>
                    <span class="dealership-address">Stevilo servisa ki ponujajo to storitev: <b>${service.count}</b></span>
                </div>
            <button class="view-details" type="button"  onclick = 'getOfferedServices(${service.id},${service.count},"${service.name}");'><i class="fa-solid fa-eye"></i></button>
            </div>
    </div>
    `
        $(rowContainer).append(element)

    })
    console.log(rowContainer)
    $("#services-container").append(rowContainer)
    $("#services-container").fadeIn()
}
//gets the grouped car services for a single service
function getOfferedServices(sid, count, name) {
    expandPage()
    let parent = $('#data-container')
    $(parent).empty()
    let serviceContainer = document.createElement('div')
    let navigation = null;
    $(serviceContainer).addClass('service-container')
    navigation = `
        <button class="navigation" onclick = "reducePage()">
        <div class="navigation-icon">
            <i class="fas fa-arrow-left"></i>
        </div>
        <span class="navigation-text">Back</span>
    </button>
    <div class="service-information">
                                <h1 class="service-name">${name}</h1>
                                
                                <h4 class="service-count"><span>Stevilo servisa ki ponujajo to storitev: <b>${count}</b></span></h4>
                            </div>`
    $(serviceContainer).append(navigation)
    let search = `
        <div id="actionSearch">
        <button class="search-icon filter">
            <i class="fa-solid fa-filter" onclick="toggleFilter(this,'user')"></i>
            <div class="filter-container">
                <div class="content roles">

                </div>
            </div>
        </button>
        <div class="search-icon" onclick="searchUsers()">
            <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <div class="form-group">
            <input type="text" class="form-control dark" placeholder="Search" id="searchUsers">
        </div>
    </div>
    `
    $(serviceContainer).append(search)
    let serviceData = document.createElement('div')
    serviceData.className = 'service-data'



    $.get('/services/' + sid, (response) => {
        response.forEach(dealership => {
            $.get('/offeredServicesRating/' + dealership.offered_service_id, (ratings) => {
                console.log(ratings)
                console.log("Rating: " + ratings.avg_rating)
                let stars = ratings.hasOwnProperty("avg_rating") ? getStars(ratings.avg_rating) : getStars(0)
                let element = `<div class="service-details flex-column" data-service-id=${dealership.id}>
                            <span class="dealership-data">
                                <span class="dealership-name text-center w-100 d-block">
                                    ${dealership.name}
                                </span>
                                <div class = "dealership-description p-3">
                                    ${dealership.description}
                                </div>
                                <div class="dealership-rating w-25 mx-auto">
                                ${stars}
                                </div>
                            </span>
                            <div class="service-click justify-content-around">
                                <a href="" class="btn w-25"><i class = "fa-solid fa-euro"></i>${dealership.price}</a>
                                <a href="" class="btn danger w-25" data-bs-toggle="modal" data-bs-target="#reservationBookingModal2" onclick="prepareReservation2(${dealership.offered_service_id})">Book</a>
                            </div>
                        </div>`

                $(serviceData).append(element)
                console.log(dealership.offered_service_id)
            })

        })

    })

    $(serviceContainer).append(serviceData)
    $(parent).append(serviceContainer)



}



//function for displaying average ratings int the car service container
function displayAvgRating(dealership_id, parent, container) {
    $.get('/avgRating/' + dealership_id, (ratings) => {
        if (ratings.hasOwnProperty("rating")) {
            $(container).find(".dealership-rating").append(getStars(Math.round(ratings.rating)));
            $(parent).append(container)
        }
        else {
            $(container).find(".dealership-rating").append(getStars(0));
            $(parent).append(container)
        }
    })
}

//main function for displaying the cat service container
function displayCarServiceData(dealership_id, parent, container) {
    $.get('/carService/' + dealership_id, (dealership) => {
        console.log(dealership)
        let address = `${dealership.street} ${dealership.streetnumber}, ${dealership.city}, ${dealership.country}`
        let dealershipInfo = `
        <button class="navigation" onclick = "reducePage()">
            <div class="navigation-icon">
                <i class="fas fa-arrow-left"></i>
            </div>
            <span class="navigation-text">Back</span>
        </button>
            <div id="actionSearch">
                <div class="search-icon" onclick="searchUsers()">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control dark" onkeyup = "search('services') "placeholder="Search" id="searchUsers">
                </div>
            </div>
        <div class="dealership-information d-flex justify-content-between py-3 flex-column">
        <div>
            <h1 class="dealership-name">${dealership.name}</h1>
            <h3 class="dealership-address">${address}</h3>
            </div>
            <div class="dealership-rating">
               
            
            </div>
        </div>
        <div class="component-selector">
            <div class="select-item" data-component="dealership-services" onclick = "toggleComponent(this)">
                <i class="fas fa-bell-concierge"></i>
            </div>
            <div class="select-item" data-component="dealership-reviews" onclick = "toggleComponent(this)">
                <i class="fas fa-comment"></i>
            </div>
            <div class="select-item" data-component="dealership-map" onclick = "toggleComponent(this);initMap('${address}')">
                <i class="fas fa-map"></i>
            </div>
        </div>
        <div class="dealership-data">
                             <div class="component dealership-services active">
                             </div>
                             <div class="component dealership-reviews">
                             </div>
                             <div class="component dealership-map">
                             <div id="map" class = "map"></div>

                             </div>
                         </div>
                     </div>
        `
        $(container).append(dealershipInfo)
        displayServices(dealership_id, parent, container)
        displayReviews(dealership_id, parent, container)
        displayAvgRating(dealership_id, parent, container)
    })
}
//function for displaying services in the car service container
function displayServices(dealership_id, parent, container) {
    console.log('displaying services')
    $.get('/carService/' + dealership_id + '/services', (services) => {
        console.log(services)
        // console.log(services.offered_id)
        if (services) {
            services.forEach(service => {
                let serviceContainer = `
                <div class="service-details" data-service-id=${service.id}>
                    <span class="service-description">
                        <span class="service-name">
                            ${service.name}
                        </span>
                        <span class="service-category w-75">
                            ${service.description}
                        </span>
                    </span>
                    <div class="service-click">
                        <a href="" class="btn ">€ ${service.price.toFixed(2)}</a>
                        <a href="" class="btn danger w-25" data-bs-toggle="modal" data-bs-target="#reservationBookingModal"  onclick="prepareReservation(${service.id})" >Book</a> 
                    </div>
                </div>`
                $(container).find(".dealership-services").append(serviceContainer);
            });
        }
        else {
            $(container).find(".dealership-services").append(`<h1 class = "text-center">¯\\_(ツ)_/¯<br>Ta delavnica še ne ponuja storitev.</h1>`)
        }
        $(parent).append(container)
        $(parent).fadeIn(250)
        // loadOfferedServiceData(${service.id}) BAKIIIIII
    })
}
//function for displaying reviews in the service container
function displayReviews(dealership_id, parent, container) {
    $.get('/reviews/' + dealership_id, (reviews) => {
        if (reviews.length > 0) {
            reviews.forEach(review => {
                displayDealershipReview(container, review)
            });
            $(parent).append(container)
        }
        else {
            $(container).find(".dealership-reviews").append(`<h1 class = "text-center">¯\\_(ツ)_/¯<br>Ta delavnica še ni ocenjena.</h1>`)
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
//function for displaying all dealership reviews in the car service container
function displayDealershipReview(parent, review) {
    let date = new Date(review.created_at)
    date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    let serviceContainer2 = `
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
        </div>`
    $(parent).find(".dealership-reviews").append(serviceContainer2);
}
function addToFavorites(e, dealership_id) {
    $.post('/addFavoriteDealership/' + dealership_id, (response) => {
        if (response.status == 200) {
            $("#pageContent").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>${response.message}</strong><br>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `)
        }
        else {
            $("#pageContent").prepend(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Prišlo je do napaka pri dodajanju delavnice v priljubljene.</strong><br>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `)
        }
    })
    changeHeart(e)
    e.setAttribute('onclick', `removeFromFavorites(this,${dealership_id})`)
}
function removeFromFavorites(e, dealership_id) {
    $.post('/removeFavoriteDealership/' + dealership_id, (response) => {
        console.log(response.errors)
        if (response.status == 200) {
            $("#pageContent").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Vspeh!</strong> ${response.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `)
        }
        else {
            alert("Prislo je do napake pri brisanju")
        }
    })
    changeHeart(e)
    e.setAttribute('onclick', `addToFavorites(this,${dealership_id})`)
}

function changeHeart(e) {
    $(e).toggleClass("fa-solid");
    $(e).toggleClass("fa-regular");
}

function prepareReservation(service_id) {
    $("#modal_service_id").val(service_id)
}

function prepareReservation2(offered_service_id) {
    console.log(offered_service_id)
    $("#serviceIdZasebaj").val(offered_service_id)
}

function createReservation() {
    let reservation = {
        "offered_service_id": $("#modal_service_id").val(),
        "reservation_date": $("#reservation_date").val(),
    }
    $.post('/reservations', reservation, (response) => {
        console.log(response)
        if (response.status == 200) {
            let alert = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Vspeh!</strong> ${response.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `
            $("#reservationModalContainer").append(alert)
        }
        else {
            let alert = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Napaka!</strong> ${response.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `
            $("#reservationModalContainer").append(alert)
        }
        setTimeout(() => {
            $("#reservationBookingModal").modal('hide')
        }, 2000);
    })
}


function createReservation2() {
    let reservation = {
        "offered_service_id": $("#serviceIdZasebaj").val(),
        "reservation_date": $("#reservation_date2").val(),
    }
    $.post('/reservations', reservation, (response) => {
        console.log(response)
        if (response.status == 500) {
            $("#reservationBookingModal2 .modal-content .modal-body").prepend(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#reservationBookingModal2 .modal-content .modal-body").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            // setTimeout(() => {
            //     $("#reservationDataModalClose").click()
            //     getReservations();
            // }, 2000);
        }
        setTimeout(() => {
            $("#reservationBookingModal").modal('hide')
        }, 2000);
    })
}
