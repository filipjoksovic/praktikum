function getQuestions(){
    $('#forum').empty();

    let container = document.createElement('div')
    container.classList.add('row')
    
    let questions = fetch('/posts').then(res => res.json()).then(questions => {
        console.log(questions)

        questions.forEach(question => {

            let date = new Date(question.created_at)
            date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()

            let element = document.createElement('div')

            element=`
            <div class="question mt-3">
            <div class="question-text">
                <span class="post-title">${question.title}</span>
                <span class="post-info">${question.firstname} ${question.lastname}</span>
                <span class="post-time">${date}</span>
            </div>
            <div class="question-icon">
                <button class="admin-trash" data-bs-toggle="modal" data-bs-target="#deletePostModal" onclick ='startDeletePost(${question.id})'>
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
        `;
        // container.appendChild(element)
        $('#forum').append(element)
        });
    })
}

function startDeletePost(post_id){
    $("#deletePostModalId").val(post_id)
}

function confirmPostDelete(){
    $.post('/deletePost', { "post_id": $("#deletePostModalId").val() }, function (response) {
        console.log(response)
        if (response.status == 500) {
            $("#deletePostModalContainer").append(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <strong>Tekst napake: </strong><span>${response.errors}</span>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
        }
        else {
            $("#deletePostModalContainer").append(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>${response.message}</strong><br>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`)
            setTimeout(() => {
                // $("#deletePostModalClose").click()
                getQuestions();
            }, 2000);
        }
    })
}