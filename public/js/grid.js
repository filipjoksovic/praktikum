$(".actions .action").click(function () {
    let action = $(this).attr("data-action-parent");
        console.log(action)
        if(action == undefined){
            $(".main-content").toggleClass("collapsed")
            $(this).find("i").toggleClass("fa-arrow-left")
            $(this).find("i").toggleClass("fa-arrow-right")

            return;
        }
        $(".actions .action").removeClass("active")
        $(this).addClass("active");
        $(".content .action-frame").removeClass("active");
        $(action).addClass("active");
})
