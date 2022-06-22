function getPosts() {
    $("#pageContent").empty();

    let parent = document.createElement("div")
    parent.id = "data-container"
    let questions = document.createElement("div")
    questions.className = "questions"

    let posts = fetch('/posts').then(res => res.json()).then(posts => {
        console.log(posts)
        posts.forEach(post => {
            let date = new Date(post.created_at)
            date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()

            let element = `
            <div class="question mt-3">
            <div class="question-text">
                <span class="post-title">${post.title}</span>
                <span class="post-info">${post.firstname} ${post.lastname}</span>
                <span class="post-time">${date}</span>
            </div>
            <div class="question-icon" onclick = "getResponses(${post.id})">
                <button class="question-details" type="button"  >
                    <i class="fa-solid fa-eye"></i>
                </button>
            </div>
        </div>
        `
            $(questions).append(element)
        });
        // $('#data-container').hide()
        loadSearchBar("questions")
        $(parent).append(questions)
        $("#pageContent").append(parent)
        $('#pageContent').fadeOut()
        $('#pageContent').fadeIn()

    })
}

function getResponses(pid) {
    expandPage()
    let parent = $("#data-container")
    let backButton = `<button class="navigation" onclick = "reducePage()">
    <div class="navigation-icon">
        <i class="fas fa-arrow-left"></i>
    </div>
    <span class="navigation-text">Back</span>
</button>`
    let questionContainer = document.createElement("div")
    $(questionContainer).addClass("responses-container .modal-questions")
    $(parent).empty()
    $(parent).append(backButton)

    let responsesContainer = document.createElement("div")
    $(responsesContainer).addClass("modal-responses")
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
        let responses = fetch('/responses/' + pid).then(res => res.json()).then(responses => {
            console.log(responses)
            $(".modal-responses").empty()

            responses.forEach(response => {
                let date = new Date(response.created_at)
                date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()

                let element = `<div class="modal-response">
                <div class="response-data">
                    <span> ${response.text} </span><br>
                </div>
                <div class = "response-footer d-flex w-100 justify-content-between mt-3">
                    <span>${response.firstname} ${response.lastname} ${(response.role_id == 2) ? "<i>(Moderator)</i>" : ""}</span>
                    <span> ${date} </span>
                    </div>
            </div>`

                $(responsesContainer).append(element)
            });
        })
        $(questionContainer).hide()
        $(questionContainer).append(responsesContainer)
        $(parent).append(questionContainer)
        $(questionContainer).fadeIn()
    })
}

function createQuestions() {
    // $("#qm_user").val()
    // $("#qm_title").val()
    // $("#qm_text").val()

    let question = {
        "user": $("#qm_user").val(),
        "title": $("#qm_title").val(),
        "text": $("#qm_text").val()
    }

    console.log(question)
    $.post("/posts", question, function (response) {
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
                getPosts();
            }, 2000)
        }
    })
}

function loadQuestionUser(){
    $.get('/users',(response)=>{
    response.forEach(user =>{
        let element = document.createElement('option')
        element.value = user.id;
        element.innerHTML = `${user.firstname} ${user.lastname}`;
        document.getElementById("qm_user").appendChild(element)
    })
})}

let cl = 0;
function choseFoum(){
    
    if(cl == 0){
        getAdviceForum()
        cl++
    }
    else{
        getQuestionForum()
        cl--
    }
}

function getAdviceForum(){
    $("#pageContent").empty();

    let parent = document.createElement("div")
    parent.id = "data-container"
    let questions = document.createElement("div")
    questions.className = "questions"

    let posts = fetch('/advicesForum').then(res => res.json()).then(posts => {
        console.log(posts)
        posts.forEach(post => {
            let date = new Date(post.created_at)
            date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()

            let element = `
            <div class="question mt-3">
            <div class="question-text">
                <span class="post-title">${post.title}</span>
                <span class="post-info">${post.firstname} ${post.lastname}</span>
                <span class="post-time">${date}</span>
            </div>
            <div class="question-icon" onclick = "getResponses(${post.id})">
                <button class="question-details" type="button"  >
                    <i class="fa-solid fa-eye"></i>
                </button>
            </div>
        </div>
        `
            $(questions).append(element)
        });
        // $('#data-container').hide()
        loadSearchBar("questions")
        $(parent).append(questions)
        $("#pageContent").append(parent)
        $('#pageContent').fadeOut()
        $('#pageContent').fadeIn()

    })
}

function getQuestionForum(){
    $("#pageContent").empty();

    let parent = document.createElement("div")
    parent.id = "data-container"
    let questions = document.createElement("div")
    questions.className = "questions"

    let posts = fetch('/postsForum').then(res => res.json()).then(posts => {
        console.log(posts)
        posts.forEach(post => {
            let date = new Date(post.created_at)
            date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()

            let element = `
            <div class="question mt-3">
            <div class="question-text">
                <span class="post-title">${post.title}</span>
                <span class="post-info">${post.firstname} ${post.lastname}</span>
                <span class="post-time">${date}</span>
            </div>
            <div class="question-icon" onclick = "getResponses(${post.id})">
                <button class="question-details" type="button"  >
                    <i class="fa-solid fa-eye"></i>
                </button>
            </div>
        </div>
        `
            $(questions).append(element)
        });
        // $('#data-container').hide()
        loadSearchBar("questions")
        $(parent).append(questions)
        $("#pageContent").append(parent)
        $('#pageContent').fadeOut()
        $('#pageContent').fadeIn()

    })
}
