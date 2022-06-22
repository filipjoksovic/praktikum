$(".header-nav-link").click(function () {
    let nextActive = $(this).attr('data-nav-container')
    $(".header-nav-link").removeClass("active");
    $(this).addClass("active");
    $(".content-holder").removeClass("active")
    $(nextActive).addClass("active");
});

