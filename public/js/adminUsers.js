$(document).on('load', getUsers())

function getUsers() {
    let users = fetch('/users').then(res => res.json()).then(users => {
        loadUsers(users)
    })
}
function searchUsers() {
    let searchText = $("#searchUsers").val()
    let users = fetch(`/users/search?search=${searchText}`).then(res => { console.log(res); res.json() }).then(response => {
        console.log(response)
    })
}
function updateUser() {
    let user = {
        "id": $("#um_user_id").val(),
        "firstname": $("#um_fname").val(),
        "lastname": $("#um_lname").val(),
        "phone": $("#um_phone").val(),
        "email": $("#um_email").val(),
        "password": "password",
        "role_id": 1,
        "city": $("#um_city").val(),
        "street": $("#um_street").val(),
        "streetnumber": $("#um_street_number").val(),
        "zipcode": $("#um_zip_code").val(),
        "country": $("#um_country").val()
    }
    console.log(user)
    $.post("/users/" + user.id, user, function (response) {
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
                $("#userDataModalClose").click()
                getUsers();
            }, 2000);
        }
    })
}
function createUser() {
    console.log("Creating a user")
    let user = {
        "firstname": $("#um_fname").val(),
        "lastname": $("#um_lname").val(),
        "phone": $("#um_phone").val(),
        "email": $("#um_email").val(),
        "password": "password",
        "role_id": 1,
        "city": $("#um_city").val(),
        "street": $("#um_street").val(),
        "streetnumber": $("#um_street_number").val(),
        "zipcode": $("#um_zip_code").val(),
        "country": $("#um_country").val()
    }
    console.log(user)
    $.post("/users", user, function (response) {
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
                $("#userDataModalClose").click()
                getUsers();
            }, 2000);
        }
    })
}

function emptyUserModal() {
    $("#um_fname").val("")
    $("#um_lname").val("")
    $("#um_email").val("")
    $("#um_phone").val("")
    $("#um_address").val("")
    $("#um_city").val("")
    $("#um_street").val("")
    $("#um_street_number").val("")
    $("#um_zip_code").val("")
    $("#um_country").val("")
    document.getElementById('saveUserModalBtn').setAttribute('onclick', 'createUser()')
}
function getUserData(user_id) {
    fetch(`/users/${user_id}`).then(res => res.json()).then(user => {
        console.log(user)
        document.getElementById("um_fname").value = user.firstname
        $("#um_lname").val(user.lastname)
        $("#um_email").val(user.email)
        $("#um_phone").val(user.phone)
        $("#um_address").val(user.address)
        $("#um_city").val(user.city)
        $("#um_street").val(user.street)
        $("#um_street_number").val(user.streetnumber)
        $("#um_zip_code").val(user.zipcode)
        $("#um_country").val(user.country)
        $("#um_user_id").val(user.id)
        document.getElementById('saveUserModalBtn').setAttribute('onclick', `updateUser(${user.id})`)
    })
}

function loadUsers(data) {
    $("#users").empty()
    let container = document.createElement('div')
    container.classList.add('row')

    data.forEach(user => {
        let date = new Date(user.created_at)
        date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        let element = document.createElement('div')
        element.classList.add('col-md-4', 'col-sm-6')

        element.innerHTML = `
                <div class="user data-container" data-user-id="user-${user.id}">
                <div class="dc-header">
                    <span>${user.firstname} ${user.lastname}</span>
                </div>
                <div class="dc-body">
                    <span>Number of reservations: TO-DO</span>
                    <span>Number of reviews: TO-DO</span>
                    <span>Number of forum inquiries: TO-DO</span>
                    <span>Date joined: ${date}</span>
                </div>
                <div class="dc-footer">
                    <button class=" btn-info" data-bs-toggle="modal" data-bs-target="#userDataModal" onclick = "getUserData(${user.id})"><i class = "fa-solid fa-database"></i></button>
                    <button class=" btn-warning" data-bs-toggle="modal" data-bs-target="#reviewsModal"><i class="fa-solid fa-comment"></i></button>
                    <button class=" btn-primary" data-bs-toggle="modal" data-bs-target="#reservationsModal"><i class="fa-solid fa-calendar"></i></button>
                    <button class=" btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick = 'startDelete(${user.id})'><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            `;
        container.appendChild(element)
    });
    $("#users").append(container)
}

function startDelete(user_id) {
    $("#deleteUserModalId").val(user_id)
}
function confirmDelete() {
    $.post("/deleteUser", { "user_id": $("#deleteUserModalId").val() }, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#deleteUserModalContainer").append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#deleteUserModalContainer").append(`
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

