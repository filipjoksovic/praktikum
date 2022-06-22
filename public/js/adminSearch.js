let searchTimeout = window.setTimeout(() => {
    let searchText = $("#searchUsers").val()
    let users = fetch(`/search?text=${searchText}`).then(res => res.json()).then(response => {
        console.log(response)
    })
}, 500)
window.clearTimeout(searchTimeout)

function search(type) {
    let searchText = $(event.target).val()
    console.log(type)
    window.clearTimeout(searchTimeout)
    searchTimeout = window.setTimeout(() => {
        if (type == 'users') {
            if (searchText != "" && searchText != " ") {
                $.get('/search', {
                    text: searchText,
                    roles: getSelectedRoles(),
                    type: type,
                }, (response) => {
                    console.log('here')
                    console.log(response)
                    loadUsers(response)
                })
            }
            else {
                getUsers()
            }
        }
        else if (type = 'dealerships') {
            if (searchText != "" && searchText != " ") {
                $.get('/search', {
                    text: searchText,
                    type: type
                }, (response) => {
                    console.log('dealerships')
                    console.log(response)
                    loadDealerships(response)
                })
            }
            else {
                getDealerships()
            }
        }
    }, 500)
}
function toggleFilter(e, type) {
    $(e).parent().toggleClass('active')
    if ($(e).parent().hasClass('active') && type == 'user') {
        let roles = $.get("/roles", (response) => {
            loadRoles(response)
        })
    }
}
function loadRoles(roles) {
    console.log('SEARCHING')
    let parent = $(".content.roles")
    parent.empty()
    let element = document.createElement('p')
    element.innerHTML = `Izbira vlog:`
    element.classList.add('text-center')
    parent.append(element)
    roles.forEach(role => {
        let element = `
        <div class="form-check">
            <input class="form-check-input role-select" type="checkbox" value="${role.id}" id="role-${role.id}" onchange = "filter()">
            <label class="form-check-label" for="role-${role.id}">
                ${role.name.charAt(0).toUpperCase() + role.name.slice(1)}
            </label>
        </div>
        `
        parent.append(element)
    });
}
function getSelectedRoles() {
    let selected = $("input.role-select:checked")
    let selectedValues = []
    $(selected).each(function () {
        selectedValues.push($(this).val())
    })
    selectedValues = selectedValues.join(',')
    return selectedValues
}
function filter() {
    $.get('/search', {
        text: $("#searchUsers").val(),
        roles: getSelectedRoles,
        type: "user",
    }, (response) => {
        console.log(response)
        loadUsers(response)
    })
}
