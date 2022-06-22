$(function () {
    $.get('/isLoggedIn', (response) => {
        if (response == true) {
            sessionStorage.setItem('loggedIn', true)
        }
        else {
            sessionStorage.setItem('loggedIn', false)
        }
    })
});
function expandPage() {
    $(".header.dark.lower").addClass('unround')
    $("#pageContent").addClass('active')
    removeSearchBar()
}
function reducePage() {
    $(".header.dark.lower").removeClass('unround')
    $("#pageContent").removeClass('active')
    setTimeout(function () {
        $(".header.dark.lower button.active").click()
    }, 700)
}
function removeSearchBar() {
    $("#pageContent").find(".row").remove()

}
function toggleFilter(e, type) {
    $(e).parent().toggleClass('active')
    if ($(e).parent().hasClass('active') && type == 'dealerships') {
        loadDealershipsFilter();
    }
    else if ($(e).parent().hasClass('active') && type == 'groupedServices') {
        loadGroupedServicesFilter();
    }
    else if ($(e).parent().hasClass('active') && type == "questions") {
        loadQuestionsFilter();
    }
}

function loadDealershipsFilter() {
    console.log("loading filters for dealerships")
    $(".filter-container .content").empty()
    let filters = `
        <div class = "text-white dark p-2">
            <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
            <label class="form-check-label" for="flexCheckDefault">
            Je licenciran
            </label>
      </div>
        </div>
        
    `
    $(".filter-container .content").append(filters)
}
function loadGroupedServicesFilter() {
    console.log("loading filters for grouped services")
}
function loadQuestionsFilter() {
    console.log("loading filters for questions")
}

