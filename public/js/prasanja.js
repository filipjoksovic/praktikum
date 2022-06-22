function getPosts() {
    $("#posts").empty()

    let posts = fetch('').then(res => res.json()).then(posts => {
        console.log(posts)
        let container = document.createElement('div')

        posts.forEach(post => {
            let element = document.createElement('div')
           // let date = new Date(posts.created_at)
            
            element.innerHTML = `
            <div class="main-content">
            
                <div class="content">
                <div class="questionText">
                    <h1><span> ${post.title} <span> </h1>
                    <h3> ${post.text} </h3>
                    <h6> ${post.created_at} </h6>
                </div>
                <div class="questionPic">
                    <div class="eye">
                    <a href="posts/${post.id}">
                        <i class="fa-solid fa-eye fa-2x"></i>
                        </a>
                    </div>
                </div>
            </div>
            </div>

                `;
            container.appendChild(element)
            $("#posts").append(container)
        });
    })
}
function getPostsData(did) {
    let post = fetch('' + did).then(res => res.json()).then(posts => {
        console.log(posts)
        $("#post_title").val(post.title)
        $("#post_text").val(post.text)
        $("#post_user_id").val(post.user_id)
        $("#post_created_at").val(post.created_at)
        $("#post_updated_at").val(post.updated_at)
        
    })
}
