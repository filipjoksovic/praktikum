$(document).on('load', getReservations())

function getReservations() {
    let reservations = fetch('/reservations').then(res => res.json()).then(reservations => {
        loadReservations(reservations)
    })
}

function emptyReservationsModal() {
    $("#rmU_userId").empty();
    $("#rmU_carServiceId").empty();
    $("#rmU_offeredServiceId").empty();
    $("#rm_userId").empty();
    $("#rm_carServiceId").empty();
    $("#rm_offeredServiceId").empty();
}

function createReservation() {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    console.log(date)
    
    let reservation = {
        "reservation_date": $("#rm_date").val(),
        "user_id": $("#rm_userId").val(), 
        "offered_service_id":$("#rm_offeredServiceId").val(),
    }
    console.log(reservation)
    $.post("/reservations", reservation, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#modalContainer2").append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#modalContainer2").append(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                $("#reservationDataModalClose").click()
                getReservations();
            }, 2000);
        }
    })
}

function loadUserOption(){
    $.get('/users',(response)=>{
    response.forEach(user =>{
        let element = document.createElement('option')
        element.value = user.id;
        element.innerHTML = `${user.firstname} ${user.lastname} - ${user.email}`;
        document.getElementById("rm_userId").appendChild(element)
        
    })
})}

function loadCarServiceOption(){
    $.get('/carServices',(response)=>{
    response.forEach(service =>{
        let element = document.createElement('option')
        element.value = service.id;
        element.innerHTML = `${service.name} ${service.phone} - ${service.email}, (${service.maxCapacity})`;
        document.getElementById("rm_carServiceId").appendChild(element)
        
    }) 
 })
}

function loadUserOption2(){
    $.get('/users',(response)=>{
    response.forEach(user =>{
        let element = document.createElement('option')
        element.value = user.id;
        element.innerHTML = `${user.firstname} ${user.lastname} - ${user.email}`;
        document.getElementById("rmU_userId").appendChild(element)
        
    })
})}


function loadCarServiceOption2(){
    $.get('/carServices',(response)=>{
    response.forEach(service =>{
        let element = document.createElement('option')
        element.value = service.id;
        element.innerHTML = `${service.name} ${service.phone} - ${service.email}, (${service.maxCapacity})`;
        document.getElementById("rmU_carServiceId").appendChild(element)
        
    }) 
 })
}

function onChangeId() {
    $('#rm_offeredServiceId')
    .find('option')
    .remove()
    .end();
    var id = $(rm_carServiceId).val();
    $("#rm_reservation_id").val(id);
    
    $.get('/carService/' + id + '/services',(response)=>{
        response.forEach(services =>{
            let element = document.createElement('option')
            element.value = services.id;
            element.innerHTML = `${services.name} - (${services.price}$)`;
            document.getElementById("rm_offeredServiceId").appendChild(element) // PITANJE
        })
    })

}

function onChangeId2() {
    $('#rmU_offeredServiceId')
    .find('option')
    .remove()
    .end()
;
    var id = $(rmU_carServiceId).val();
    $("#rmU_reservation_id").val(id);
    $.get('/carService/' + id + '/services',(response)=>{
        response.forEach(services =>{
            let element = document.createElement('option')
            element.value = services.id;
            element.innerHTML = `${services.name} - (${services.price}$)`;
            document.getElementById("rmU_offeredServiceId").appendChild(element) // PITANJE
        })
    })
}

function getReservationData(reservation_id) {
    loadCarServiceOption2();
    loadUserOption2();
    fetch(`/reservations/${reservation_id}`).then(res => res.json()).then(reservation => {
        console.log(reservation)
        document.getElementById("rmU_date").value = reservation.date
        $("#rmU_userId").val(reservation.user_id)
        $("#rmU_serviceId").val(reservation.service_id)
        $("#rmU_offeredServiceId").val(reservation.offered_service_id)
        $("#rmU_reservation_id").val(reservation_id)
    })
}
function updateReservation () {
         let reservation = {
        "reservation_id": $("#rmU_reservation_id").val(),
        "reservation_date": $("#rmU_date").val(),
        "user_id": $("#rmU_userId").val(),
        "offered_service_id":$("#rmU_offeredServiceId").val(),
    }
    console.log(reservation)
    $.post("/reservations/" + reservation.id, reservation, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#aa").append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#aaa").append(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                $("#userDataModalClose").click()
                getUsers();
            }, 2000);
        }
    })
}

function loadReservations(data) {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    console.log(date)
    console.log("aa");

    $("#reservations").empty()
    let container = document.createElement('div')
    container.classList.add('row')


    data.forEach(reservation => {
        let element = document.createElement('div')
        element.classList.add('col-md-4', 'col-sm-6')
        let date = new Date(reservation.reservation_date)
        let date1 = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        let hours =date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes()
        element.innerHTML = `
                <div class="reservation data-container" reservation-user-id="user-${reservation.user_id}">
                <div class="dc-header">
                
                    <span> ${reservation.name} </span>
                </div>
                <div class="dc-body">

                    <span>User Data: ${reservation.firstname} ${reservation.lastname} </span>
                    <span> Car Service Data: ${reservation.car_service}</span>
                    <span>Reservation Date: ${date1} </span>
                    <span>Hours: ${hours} </span>
                    <span> ID reservation: ${reservation.id} </span>
                    
        
                </div>
                <div class="dc-footer">
                    <button class="buttonReserations btn-info" data-bs-toggle="modal" onclick ='getReservationData(${reservation.id})' data-bs-target="#reservationsModalUpdate"><i class = "fa-solid fa-database"></i></button>
                    <button class="buttonReserations btn-danger" data-bs-toggle="modal" onclick = 'startDeleteReservation(${reservation.id})' data-bs-target="#deleteReservationModal"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            `;
        container.appendChild(element)
    });
    $("#reservations").append(container)
}

function startDeleteReservation(reservation_id) {
    $("#deleteReservationModalId").val(reservation_id)
}

function confirmDeleteReservation() {
    $.post("/deleteReservation", {"reservation_id": $("#deleteReservationModalId").val() }, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#deleteReservationModalContainer").append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#deleteReservationModalContainer").append(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                $("#userDataModalClose").click()
                getReservations();
            }, 2000);
        }

    })
    getReservations();
}