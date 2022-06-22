
let curStep = 1;

function setupNextStep() {
    curStep++
    console.log(curStep)

    if (curStep <= 3) {
        $("#arrow-right").css("visibility", "visible")
        $("#arrow-left").css("visibility", "visible")

        $(".setup-step.active").removeClass("active")
        $(".setup-step[data-setup-step='" + curStep + "']").addClass("active")
        let activenav = $(".nav-circles .circle.active")
        $(".nav-circles .circle.active").next().addClass("active")
        $(activenav).removeClass("active")
        if (curStep == 3) {
            $("#arrow-right").css("display", "none")
            $("#arrow-left").css("visibility", "visible")
            $("#finish-setup").addClass('active')

        }
    }
}
function setupPrevStep() {
    curStep--
    console.log(curStep)
    if (curStep >= 1) {
        $("#arrow-left").css("visibility", "visible")
        // $("#arrow-right").css("visibility", "visible")
        $("#arrow-right").css("display", "flex")
        $("#finish-setup").css("display", "none")
        $(".setup-step.active").removeClass("active")
        $(".setup-step[data-setup-step='" + curStep + "']").addClass("active")
        let activenav = $(".nav-circles .circle.active")
        $(".nav-circles .circle.active").prev().addClass("active")
        $(activenav).removeClass("active")
        if (curStep == 1) {
            curStep = 1
            $("#arrow-left").css("visibility", "hidden")
            $("#arrow-right").css("display", "flex")
        }
    }
}
function finishSetup() {
    let user = {
        "user_id": $("#setup_uid").val(),
        "firstname": $("#setup_firstname").val(),
        "lastname": $("#setup_lastname").val(),
        "phone": $("#setup_phone").val(),
        "city": $("#setup_city").val(),
        "street": $("#setup_street").val(),
        "street_number": $("#setup_street_number").val(),
        "country": $("#setup_country").val(),
        "zipcode": $("#setup_zipcode").val()
    }
    $.post("/users/" + $("#setup_uid").val() + "/update", user, (response) => {
        console.log(response)
        if (response.errors.length != 0) {
            $("#setup-modal-container").append(
                `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>${response.message}!</strong> ${response.errors.join('\r\n')}.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>  
            `)
        }
        else {
            $("#setup-modal-container").append(
                `<div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>${response.message}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`
            )
            setTimeout(() => {
                location.href = "/"
            }, 2500);
        }
    })
}