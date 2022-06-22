const res = require("express/lib/response");

$(document).on('load')


function getFixedOfferedService(offered_id) {
    $('#fixedOfferedService')
    .find('option')
    .remove()
    .end();
    $.get(`/offeredServices/${offered_id}`,(response)=>{
        response.forEach(offered_service =>{
            let element = document.createElement('option')
            element.value = offered_service.id;
            element.innerHTML = `${offered_service.id}`;
            document.getElementById("fixedOfferedService").appendChild(element) // PITANJE
        })
    })
}
function getFixedCarService(offered_id) {
    $('#fixedCarService')
    .find('option')
    .remove()
    .end();
    $.get(`/offeredServices/${offered_id}`,(response)=>{
        console.log('ovo je response')
        console.log(response)
        response.forEach(offered_service =>{
            console.log(offered_service)
            let element = document.createElement('option')
            element.value = offered_service.car_service_id;
            element.innerHTML = `${offered_service.name}`;
            document.getElementById("fixedCarService").appendChild(element) // PITANJE
        })
    })
}

function getUserId () {
    $('#userId')
    .find('option')
    .remove()
    .end();
    $.get('/getUserID', (response)=> {
        console.log('usli smo')
        console.log(typeof response)
        console.log(response)
        let element = document.createElement('option')
        element.value = response.id
        element.innerHTML = `${response.username}`
        document.getElementById('userId').appendChild(element)
        
    })
}

function createReservationUser() {

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    console.log(date)
    
    let reservation = {
        "reservation_date": $("#userReservationDate").val(),
        "user_id": $("#userId").val(), 
        "offered_service_id":$("#fixedOfferedService").val(),
    }
    console.log(reservation)
    $.post("/reservations", reservation, function (response) {
        console.log(response)
        // if (response.status == 500) {
        //     $("#modalContainer2").append(`
        //     <div class="alert alert-danger alert-dismissible fade show" role="alert">
        //         <strong>${response.message}</strong><br>
        //         <strong>Tekst napake: </strong><span>${response.errors}</span>
        //         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        //     </div>`)
        // }
        // else {
        //     $("#modalContainer2").append(`
        //     <div class="alert alert-success alert-dismissible fade show" role="alert">
        //         <strong>${response.message}</strong><br>
        //         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        //     </div>`)
        //     setTimeout(() => {
        //         $("#reservationDataModalClose").click()
        //         getReservations();
        //     }, 2000);
        // }
    })
}
