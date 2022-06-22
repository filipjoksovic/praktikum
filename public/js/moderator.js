$(document).ready(function () {
    getUserData()
    getNewAdvice()
});

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
function getNewAdvice() {
    $(".nav-pill").removeClass("active")
    $("#reservationsPill").addClass("active")
    $(".data-container").html('');
    let dataContainer = $(".data-container")
    let adviceContainer = document.createElement('div')
    adviceContainer.classList.add("row")

    let element = `
                <div id="questionModalErr">

                </div>
                <div class="advice-container">
                <div class="advice-header">
                    <h4 class="modal-title" id="exampleModalLabel">Objavi nasvet</h4>
                </div>
                <div class="modal-body question-modal">
                    <div class="form-group">
                        <label for="">Naslov</label>
                        <input type="text" class="form form-control" id="am_title">
                    </div>
                    <div class="form-group">
                        <label for="">Tekst nasveta</label>
                        <textarea id="am_text" class="form form-control" name="questionText" rows="4" cols="50"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                   <button type="button" class="btn btn-primary modal-save" 
                   onclick="createAdvice()">Objavi nasvet</button>
                </div>
                </div>
                 `
    $(dataContainer).append(element)
}


function createAdvice() {

    let question = {
        "title": $("#am_title").val(),
        "text": $("#am_text").val()
    }

    console.log(question)
    $.post("/advice", question, function (response) {
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

function getUnswQuestions() {
    $(".nav-pill").removeClass("active")
    $("#reviewsPill").addClass("active")
    $(".data-container").html('');

    let dataContainer = $(".data-container")
    let questions = document.createElement("div")
    questions.className = "questions"

    let posts = fetch('/unswPosts').then(res => res.json()).then(posts => {
        console.log(posts)
        if (posts.length > 0) {
            posts.forEach(post => {
                let date = new Date(post.created_at)
                date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()

                let element = `
            <div class="question moderator-question mt-3">
            <div class="question-text">
                <span class="post-title">${post.title}</span>
                <span class="post-info">${post.firstname} ${post.lastname}</span>
                <span class="post-time">${date}</span>
            </div>
            <div class="question-icon">
                <button class="question-details" type="button" onclick= "getQuestionInfo(${post.id})">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>
        `
                $(questions).append(element)
            });
            $("#data-container").append(questions)
        }
        else {
            $(dataContainer).append(`
        <h1 class = "text-center text-white"> ¯\\_(ツ)_/¯<br> Ni neodgovorenih vprasanj</h1>
    `)
        }
    })
}

function getQuestionInfo(pid){
    let parent = $("#data-container").addClass("moderator-data-container")
    let backButton = `<button class="navigation" onclick = "getUnswQuestions()">
    <div class="navigation-icon">
        <i class="fas fa-arrow-left"></i>
    </div>
    <span class="navigation-text">Back</span>
</button>`
    let questionContainer = document.createElement("div")
    $(questionContainer).addClass("responses-container")
    $(parent).empty()
    $(parent).append(backButton)

    let responsesContainer = document.createElement("div")
    $(responsesContainer).addClass("modal-responses ")
    let post = fetch('/posts/' + pid).then(res => res.json()).then(post => {
        console.log(post)
        let date = new Date(post.created_at)
        date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        let question = `
        <div class="modal-question title">
            ${post.title}
        </div>
        <div class="modal-question text">
            <span>${post.text}</span>
        </div>
        <div class = "modal-question footer w-100 d-flex justify-content-between align-items-center text-light">
            <span>${post.firstname} ${post.lastname}</span>
            <span>${date}</span>
        </div>
        `
        
        $(questionContainer).append(question)
        
        $(questionContainer).hide()
        $(questionContainer).append(responsesContainer)
        $(parent).append(questionContainer)
        $(questionContainer).fadeIn()
        let textArea=`<div class="moderator-qtext mt-3">
        <div class = "form-group">
        <textarea id="mt_text" class="form form-control" name="questionText" rows="4" cols="50"></textarea>
    </div>
    </div>
    `
        $(parent).append(textArea)
        let addButton = `
        <button type="button" class="btn btn-primary modal-save mt-3" onclick="createAnswer(${pid})">Objavi odgovor</button>`
        $(parent).append(addButton)
    })
   
}

function createAnswer(pid){
    let answer =  {
        "text": $("#mt_text").val(),
    }
    console.log(answer)
    $.post("/responses/"+pid ,answer, function (response) {
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
                $("#answerClose").click()
             
            }, 2000)
        }
    })
}

function getNasveti() {
    $(".nav-pill").removeClass("active")
    $("#nasvetiPill").addClass("active")
    $("div.data-container").html('');
    let dataContainer = $(".data-container")
    let alertContainer = document.createElement('div')
    alertContainer.id = "alertContainer"
    $(dataContainer).append(alertContainer)
    let questions = document.createElement("div")
    questions.className = "questions"

    let nasveti = fetch('/nasveti').then(res => res.json()).then(nasveti => {
        console.log(nasveti)
        if (nasveti.length > 0) {
            nasveti.forEach(nasveti => {

                let element = `
            <div class="question2 mt-3">
            <div class="question-text">
                <span class="post-title">${nasveti.title}</span>
                <span class="post-info">${nasveti.firstname} ${nasveti.lastname}</span>
                <span class="post-text">${nasveti.text}</span>
                
            </div>

            <div class="question-icon">
                <button class="question-details" type="button" onclick="openSpremeniNasvet(${nasveti.id})"  >
                <i class="fas fa-pen"></i>
                </button>
                <button class="question-details" type="button" onclick="zbrisiNasvet(${nasveti.id})"  >
                <i class="fa fa-trash" aria-hidden="true"></i>
                </button>            
            </div>
        </div>
        `
                $(dataContainer).append(element)
            });
        }
        else {
            $(dataContainer).append(`
                <h1 class = "text-center text-white"> ¯\\_(ツ)_/¯<br> Ni nasvetov</h1>
            `)
        }
    })

}

function zbrisiNasvet(nasvet_id) {
    let a = nasvet_id;
    $.post('/deleteNasvet', { "nasvet_id": a }, function (response) {
        console.log(response)
        console.log(nasvet_id)
        if (response.status == 500) {
            $("#alertContainer").append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#alertContainer").append(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                getNasveti();
            }, 2000);
        }
    })
}

function openSpremeniNasvet(nasvet_id) {

    let parent = $("#data-container")
    let backButton = `<button class="navigation" onclick = "getNasveti()">
    <div class="navigation-icon">
        <i class="fas fa-arrow-left"></i>
    </div>
    <span class="navigation-text">Back</span>
</button>`
    let questionContainer = document.createElement("div")
    $(questionContainer).addClass("responses-container .modal-questions2")
    $(parent).empty()
    $(parent).append(backButton)

    let alertContainer = document.createElement("div")
    alertContainer.id = "alertContainer"
    $(parent).append(alertContainer)
    $.get("/nasveti/" + nasvet_id, (response) => {
        console.log(response)
        response.forEach(nasvet => {
            console.log(nasvet)
            let element = `
                <div class="advice-container">
                <div class="advice-header">
                    <h4 class="modal-title" id="exampleModalLabel"><span> ${nasvet.title} </span> </h4>
                </div>
                <div class="modal-body question-modal">
                    
                    <div class="form-group">
                        <label for="titleNasvet">Naslov</label>
                        <textarea id="titleNasvet" class="form form-control" name="questionText" rows="1" cols="50">${nasvet.title}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="textNasvet">Tekst nasveta</label>
                        <textarea id="textNasvet" class="form form-control" name="questionText" rows="4" cols="50">${nasvet.text}</textarea>
                    </div>
                    </div>
                <div class="modal-footer">
                   <button type="button" class="btn btn-primary" onclick="spremeniNasvet(${nasvet.id})">Uredi</button>
                </div>
                `
            $(parent).append(element)
        })
    })

}


function spremeniNasvet(nasvet_id) {
    let nasvet = {
        "title": $("#titleNasvet").val(),
        "text": $("#textNasvet").val(),
    }
    $.post("/nasveti/" + nasvet_id, nasvet, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#alertContainer").append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Text napake: ${response.errors} <strong> <br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#alertContainer").append(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
    })
}
