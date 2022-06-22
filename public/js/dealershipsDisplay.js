function toggleComponent(e) {
    $(".component").removeClass('active')
    $("." + $(e).attr('data-component')).addClass('active')

    // console.log($("." + $(e).attr('data-component')).attr('class'))
    // if($("." + $(e).attr('data-component')).attr('class').split(/\s+/).includes("dealership-map")){
    //     console.log("initting map")
    //     initMap();
    // }
}