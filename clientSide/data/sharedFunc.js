// JavaScript source code
function checkForLoginUser() {
    var loginUser = JSON.parse(localStorage.getItem("loginUserDetails"))

    if (loginUser != null) {
        $('.userNameBox').show();
        $('.logoutBox').show();
        $('.loginBox').hide();
        $('.userName').text(loginUser.userName);
        $('.myBooks').show();
        $('.requestBox').show();
        $('.adminPage').hide();
        //check if the login user is admin and open the access to admin page
        if (loginUser.userName == "admin") {
            $('.adminPage').show();
            $('.userNameBox').hide();
        }

    }
    else {
        $('.userNameBox').hide();
        $('.logoutBox').hide();
        $('.loginBox').show();
        $('.userName').text("");
        $('.myBooks').hide();
        $('.requestBox').hide();
        $('.adminPage').hide();
    }
}
//-----------------------
// JavaScript source code
function ajaxCall(method, api, data, successCB, errorCB) {
    $.ajax({
        type: method,
        url: api,
        data: data,
        cache: false,
        contentType: "application/json",
        dataType: "json",
        success: successCB,
        error: errorCB
    });
}
//-----------------------

// logout user

function logoutUser() {

    let userIdToLogout = JSON.parse(localStorage.getItem("loginUserDetails")).userId

    ajaxCall("PUT", usersAPI + "/logoutUser", JSON.stringify(userIdToLogout), successLogout, errorLogout)
}

function successLogout(status) {

    if (status) {

        Swal.fire({
            title: "See you later alligator",
            width: 600,
            padding: "3em",
            color: "#716add",
            confirmButtonText: "Meet you in a while crocodail",
            background: "#fff url(/images/trees.png)",
            backdrop: `
                                rgba(0,0,123,0.4)
                                url("/alligator.png")
                                center top
                                no-repeat
                                `
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                checkForLoginUser();
                window.location.href = "HTMLPage1.html";
            }
        })

    }
}

function errorLogout(errorMassage) { console.log(errorMassage); }
//-----------------------