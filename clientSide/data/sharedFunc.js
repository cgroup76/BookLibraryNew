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
let resonToLogout;

function logoutUser(reson) {
    resonToLogout = reson;
    let userIdToLogout = JSON.parse(localStorage.getItem("loginUserDetails")).userId

    ajaxCall("PUT", usersAPI + "/logoutUser", JSON.stringify(userIdToLogout), successLogout, errorLogout)
}

function successLogout(status) {
    console.log(resonToLogout);
    if (status && resonToLogout == 'endSession') {
        localStorage.setItem('logoutReason', 'endSession');
        localStorage.removeItem('loginUserDetails');
        window.location.href = "HTMLPage1.html";
    }

    else if (status) {

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

function checkUserLogoutReason() {
    let reason = localStorage.getItem('logoutReason');
    if (reason != null) {
        Swal.fire("Connection time ended - Please login first");
        showLoginForm();
        localStorage.removeItem('logoutReason');
    }
}
// show requests
function showAllRequests() {
    showRequests();
}
function showRequests() {
    let userId = JSON.parse(localStorage.getItem("loginUserDetails")).userId;

    ajaxCall("GET", usersAPI + `/GetRequestsPerUser?userId=${userId}`, null, showMyRequests, errorShowRequest);
}

function showMyRequests(listOfRequest) {
    ShowRequestToBuy();

    let requestBox = document.querySelector('.requestBox .dropdown-menu .got')
    let htmlGot = "";
    let approved = "approved";
    let denied = "denied";
    htmlGot += '<h3> Request you got </h3>';

    if (listOfRequest.length === 0) {
        htmlGot += '<a class="dropdown-item" href="#">No requests was sent to you</a>';
    }
    else {
        let sellerId = JSON.parse(localStorage.getItem("loginUserDetails")).userId;
        listOfRequest.forEach((request) => {
            htmlGot += `
                                                <div class="dropdown-item">
                                                    <strong>Book:</strong> ${request.bookName} <br>
                                                    <strong>Want to buy:</strong> ${request.buyerName} <br>
                                                    <strong>Status:</strong> ${request.status} <br>
                                                    <button class="btn btn-success" onclick="handleRequest('${request.buyerId}','${sellerId}','${request.bookId}','${approved}')">Approve</button>
                                                    <button class="btn btn-danger" onclick="handleRequest('${request.buyerId}','${sellerId}','${request.bookId}','${denied}')">Reject</button>
                                                </div>`;
        });
    }
    requestBox.innerHTML = htmlGot;
}
function ShowRequestToBuy() {
    let userId = JSON.parse(localStorage.getItem("loginUserDetails")).userId;

    ajaxCall("GET", usersAPI + `/getMyRequestToBuyPerUser?userId=${userId}`, null, ShowMyRequestToBuy, errorShowRequest);
}

function ShowMyRequestToBuy(listOfRequest) {
    let requestBox = document.querySelector('.requestBox .dropdown-menu .send');
    let htmlSend = "";
    htmlSend += `<h3> Request you send </h3>`
    if (listOfRequest.length === 0) {
        htmlSend += '<a class="dropdown-item" href="#">You wasnt send any request</a>';
    }
    else {

        listOfRequest.forEach((request) => {
            htmlSend += `<div class="dropdown-item">
                                                <strong>Book:</strong> ${request.bookName} <br>
                                                <strong>you ask to buy from:</strong> ${request.sellerName} <br>
                                                <strong>Status:</strong> ${request.status} <br>
                                                </div>`
        });
    }
    requestBox.innerHTML = htmlSend;
}

function errorShowRequest(error) {
    logoutUser('endSession');
}

function handleRequest(buyerId, sellerId, bookId, requestStatus) {
    console.log(buyerId, sellerId, bookId, requestStatus);
    ajaxCall("PUT", `${usersAPI}/requestHandling?sellerId=${sellerId}&buyerId=${buyerId}&bookId=${bookId}&requeststatus=${requestStatus}`, null, successToHandle(requestStatus), errorToHandle);
}

function successToHandle(requestStatus) {
    if (requestStatus == 'approved') {
        Swal.fire({
            icon: "success",
            title: "The request was successfully approved"
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "The request was successfully rejected"
        });
    }
    showAllRequests();
}

function errorToHandle() {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error handling the request. Please try again.'
    });
}