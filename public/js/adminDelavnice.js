function getDelavnice() {

    let dealerships = fetch('/carServices').then(res => res.json()).then(dealerships => {
        console.log(dealerships)

        loadDealerships(dealerships)
    })
}

function updateDealership() {
    let dealership = {
        "name": $("#dm_name").val(),
        "phone": $("#dm_phone").val(),
        "email": $("#dm_email").val(),
        "maxCapacity": $("#dm_max_capacity").val(),
        "isLicenced": $("#dm_is_licenced").val(),
        "city": $("#dm_city").val(),
        "street": $("#dm_street").val(),
        "streetnumber": $("#dm_street_number").val(),
        "zipcode": $("#dm_zip_code").val(),
        "country": $("#dm_country").val(),
        "id": $("#dm_id").val()

    }
    console.log(dealership)
    $.post("/dealerships/" + dealership.id, dealership, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#modalContainer3").append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#modalContainer3").append(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                $("#dealershipDataModalClose").click()
                getDelavnice();
            }, 2000);
        }
    })
}

function allowDealership(e,did) {
    
    $.post("/allowDealerships/" + did, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#dealerships").prepend(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                $("#dealerships").find('.alert').remove()
            }, 2000);
        }
        else {
            $("#dealerships").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                $("#dealerships").find('.alert').remove()                
            }, 2000);
        }
    })
    changeColor(e);
    document.getElementById('check').setAttribute('onclick', `disallowDealership(this,${did})`)
    }
//jos id 
function disallowDealership(e,did) {
    $.post("/disallowDealerships/" + did, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#dealerships").prepend(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                $("#dealerships").find('.alert').remove()
            }, 2000);
        }
        else {
            $("#dealerships").prepend(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                $("#dealerships").find('.alert').remove()
            }, 2000);
        }
    })
    changeColor(e);
    console.log(e);
    e.setAttribute('onclick', `allowDealership(this,${did})`)
    }

function changeColor(e) {
    $(e).toggleClass("fa-circle-xmark");
    $(e).toggleClass("fa-circle-check");
    $(e).toggleClass("unverified");
    $(e).toggleClass("verified");
    }

//$(document).on('load', setColor(this,1))


function createDealership() {
    let dealership = {
        "name": $("#dm_name").val(),
        "phone": $("#dm_phone").val(),
        "email": $("#dm_email").val(),
        "maxCapacity": $("#dm_max_capacity").val(),
        "isLicenced": $("#dm_is_licenced").val(),
        "city": $("#dm_city").val(),
        "street": $("#dm_street").val(),
        "streetnumber": $("#dm_street_number").val(),
        "zipcode": $("#dm_zip_code").val(),
        "country": $("#dm_country").val()
    }
    console.log(dealership)
    $.post("/dealerships", dealership, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#modalContainer3").append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#modalContainer3").append(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                $("#dealershipDataModalClose").click()
                getDelavnice();
            }, 2000);
        }
    })
}

function emptyDealershipModal() {
    $("#dm_name").val("")
    $("#dm_max_capacity").val("")
    $("#dm_email").val("")
    $("#dm_phone").val("")
    $("#dm_id").val("")
    $("#dm_city").val("")
    $("#dm_street").val("")
    $("#dm_street_number").val("")
    $("#dm_zip_code").val("")
    $("#dm_country").val("")
    document.getElementById('saveDealershipModalBtn').setAttribute('onclick', 'createDealership()')
}

function getDealershipData(did) {
    let dealership = fetch('/carService/' + did).then(res => res.json()).then(dealership => {
        console.log(dealership)
        $("#dm_name").val(dealership.name)
        $("#dm_street").val(dealership.street)
        $("#dm_street_number").val(dealership.streetnumber)
        $("#dm_city").val(dealership.city)
        $("#dm_zip_code").val(dealership.zipcode)
        $("#dm_country").val(dealership.country)
        $("#dm_phone").val(dealership.phone)
        $("#dm_email").val(dealership.email)
        $("#dm_id").val(dealership.id)
        $("#dm_max_capacity").val(dealership.maxCapacity)
        document.getElementById('saveDealershipModalBtn').setAttribute('onclick', `updateDealership(${dealership.id})`)
    })
}

function getDealerships() {
    getDelavnice()
}
function loadDealerships(dealerships) {
    $("#dealerships").empty()

    let container = document.createElement('div')
    container.classList.add('row')

    dealerships.forEach(dealership => {
        let date = new Date(dealership.created_at)
        console.log(date)
        date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        let element = document.createElement('div')
        let isAllowed = dealership.isAllowed;
        let dugmePrvo = `<button class=" verified fa-solid fa-circle-check" id = "check"  onclick = "allowDealership(this,${dealership.id})"></button>`       
        let dugmeDrugo = `<button class=" unverified fa-solid fa-circle-xmark" id = "check"  onclick = "disallowDealership(this,${dealership.id})"></button>`       
        let dugme = null;
        if(isAllowed==1){
            dugme = dugmeDrugo;
        }
        else if(isAllowed == 0){
            dugme = dugmePrvo;
        }
        element.classList.add('col-md-4', 'col-sm-6')
        element.innerHTML = `
                <div class="dealership data-container" data-dealership-id="dealership-${dealership.id} ">
                <div class="dc-header">
                    ${dugme}
                    <span>${dealership.name}</span>       
                </div>
                <div class="dc-body">
                   
                    <span>Date joined: ${date}</span>
                </div>
                <div class="dc-footer">
                    <button class=" btn-info" data-bs-toggle="modal" data-bs-target="#dealershipDataModal" onclick = "getDealershipData(${dealership.id})"><i class = "fa-solid fa-database"></i></button>
                    <a class="btn warning" href = 'https://www.google.com/maps/place/${dealership.street}+${dealership.streetnumber}+${dealership.zipcode}+${dealership.city}+${dealership.country}/' target = "_blank"><i class="fa-solid fa-map-location-dot"></i></a>
                    <button class=" btn-danger" data-bs-toggle="modal" data-bs-target="#deleteDealershipModal" onclick = 'startDeleteDealership(${dealership.id})'><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            `;
        container.appendChild(element)
        $("#dealerships").append(container)
    });
}

function startDeleteDealership(dealership_id) {
    $("#deleteDealershipModalId").val(dealership_id)
}
function confirmDeleteDealership() {
    $.post("/deleteDealership", { "dealership_id": $("#deleteDealershipModalId").val() }, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#deleteDealershipModalContainer").append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#deleteDealershipModalContainer").append(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                $("#dealershipDataModalClose").click()
                getDelavnice();
            }, 2000);
        }
    })
}
