let searchTimeout = window.setTimeout(() => {}, 500)
window.clearTimeout(searchTimeout)

function search(type) {
    let searchText = $(event.target).val()
    console.log(type)
    window.clearTimeout(searchTimeout)
    searchTimeout = window.setTimeout(() => {
        if (type == 'dealerships') {
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
                getDelavnice()
            }
        }
        else if (type == 'groupedServices') {
            if (searchText != "" && searchText != " ") {
                $.get('/search', {
                    text: searchText,
                    type: type
                }, (response) => {
                    console.log('groupServices')
                    console.log(response)
                    loadServices(response)
                })
            }
            else {
                getGroupedServices()
            }
        }
        else if(type == "map"){
            initMap(searchText)
        }
    }, 500)
}