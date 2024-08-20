// JavaScript source code


var usersAPI = "https://localhost:7225/api/IUsers";


$(document).ready(function () {
    checkUserLogoutReason();
    checkForLoginUser();

    showAllRequests();
    // log in or sign up forms
    $('.login').click(showLoginForm);
    $('.signup').click(showSignupForm);

    // close form
    $('.closeLoginButton').click(closeLoginForm);

    // submit form
    $('#logInButton').click(loginUser);
    $('#signupButton').click(signupNewUser);

    // logout user
    $('.logout').click(logoutUser);
})
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
        $('.bookClubPage').show();
        //check if the login user is admin and open the access to admin page
        if (loginUser.userName == "admin") {
            $('.adminPage').show();
            $('.userNameBox').hide();
            $('.bookClubPage').hide();
            $('.userNameBox').hide();
            $('.myBooks').hide();
            $('.requestBox').hide(); 
        }

    }
    else {
        $('.bookClubPage').hide();
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
function ajaxCallSync(method, api, data, successCB, errorCB) {
    $.ajax({
        type: method,
        url: api,
        data: data,
        cache: false,
        async: false,
        contentType: "application/json",
        dataType: "json",
        success: successCB,
        error: errorCB
    });
}
//-----------------------
//log in //
// login or signup form

function showLoginForm() {
    $('#logInForm').addClass('active');
    $('#overlay').addClass('active');
    $('.loginQuestion').hide();
    $('.signupQuestion').show();
    $('.userNameDiv').hide();
    $('#signupButton').hide();
    $('#logInButton').show();
}
function closeLoginForm() {
    $('#logInForm').removeClass('active');
    $('#overlay').removeClass('active');
}
function showSignupForm() {
    $('.userNameDiv').show();
    $('#signupButton').show();
    $('.loginQuestion').show();
    $('#logInButton').hide();
    $('.signupQuestion').hide();
}

// login user

function loginUser() {

    var regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    var userEmail = $('#userEmail').val();
    var userPassword = $('#userPassword').val();

    // check email and password in the correct format
    if (regexEmail.test(userEmail) && userPassword.length >= 3) {

        let userLogin = {
            "id": 0,
            "userName": "",
            "eMail": userEmail,
            "password": userPassword,
            "isAdmin": false,
            "isActive": true,
            "isLogIn": true
        }

        ajaxCall("PUT", usersAPI + '/loginUser', JSON.stringify(userLogin), successLogin, error);
    }
    else {
        Swal.fire({
            title: "Invalide email or password",
            text: "Please check email in the correct format & password is more than 2 digits."
        });
    }

    return false;
}

function successLogin(userDetails) {

    localStorage.setItem("loginUserDetails", JSON.stringify(userDetails));
    console.log(userDetails);
    checkForLoginUser();

    showBooks();

    closeLoginForm();
}

function error(errorMassage) { console.log(errorMassage); Swal.fire("Incorrect email or password"); }


// signup new user

function signupNewUser() {

    var regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    var userEmail = $('#userEmail').val();
    var userPassword = $('#userPassword').val();
    var userName = $('#userName').val();

    if (userName == "") { Swal.fire("Please enter a user name"); return; }

    // check email and password in the correct format
    if (regexEmail.test(userEmail) && userPassword.length >= 3) {

        let newUser = {
            "id": 0,
            "userName": userName,
            "eMail": userEmail,
            "password": userPassword,
            "isAdmin": false,
            "isActive": true,
            "isLogIn": true
        }

        ajaxCall("POST", usersAPI + "/signUpNewUser", JSON.stringify(newUser), successLogin, errorSignup)
    }
    else {
        Swal.fire({
            title: "Invalide email or password",
            text: "Please check email in the correct format & password is more than 2 digits."
        });
    }

    return false;
}

function errorSignup(errorMassage) { console.log(errorMassage); }
//--------------
// logout user
let resonToLogout;
function logoutUser(reson) {
    resonToLogout = reson;
    let userIdToLogout = JSON.parse(localStorage.getItem("loginUserDetails")).userId

    ajaxCall("PUT", usersAPI + "/logoutUser", JSON.stringify(userIdToLogout), successLogout, errorLogout)
}

function successLogout(status) {

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

//requests

//send request
function sendRequest(buyerId, sellerId, bookId, sellerName) {

    var buyer = JSON.parse(localStorage.getItem("loginUserDetails"))

    if (buyer != null) { // check for login user

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: `The book already belong to ${sellerName}`,
            text: "Do you want to send him a request to purchase the book from him?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                ajaxCall("POST", usersAPI + "/insertNewRequest?sellerId=" + sellerId + "&buyerId=" + buyerId + "&bookId=" + bookId, null, successToSendRequest(sellerId), errorToSendRequest);

            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    icon: "error"
                });
            }
        });
    }

}
function successToSendRequest(sellerId) {
    Swal.fire({
        icon: "success",
        title: "The request has been sent",
        showConfirmButton: false,
        timer: 1500
    });
    sendNotificationToSeller(sellerId)
    showAllRequests();
    closeBookInfo();
}
function errorToSendRequest(error) {
    if (error.status == 401) {

        Swal.fire("Connection time ended - Please login first");

        localStorage.clear();

        checkForLoginUser();

        showLoginForm();
    }
    else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "There was a problem sending the request, please try again",

        });
    }

}
let requestCount = 0;
function showAllRequests() {
    showRequests();
    requestCount = 0;
}
function showRequests() {
    let userId = JSON.parse(localStorage.getItem("loginUserDetails"));

    if (userId != null) {
        userId = userId.userId
        ajaxCall("GET", usersAPI + `/GetRequestsPerUser?userId=${userId}`, null, showMyRequests, errorShowRequest);
    }
}


function showMyRequests(listOfRequest) {
    requestCount = listOfRequest.length;
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
                                                    <button class="btn btn-success" onclick="handleRequest('${request.buyerId}','${sellerId}','${request.bookId}','${approved}','${request.bookName}')">Approve</button>
                                                    <button class="btn btn-danger" onclick="handleRequest('${request.buyerId}','${sellerId}','${request.bookId}','${denied}','${request.bookName}')">Reject</button>
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
    requestCount += listOfRequest.length;

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
    updateMessageCount(requestCount);
}

function errorShowRequest(error) {
    logoutUser('endSession');
}


function handleRequest(buyerId, sellerId, bookId, requestStatus, bookName) {
    console.log(buyerId, sellerId, bookId, requestStatus);
    ajaxCall("PUT", `${usersAPI}/requestHandling?sellerId=${sellerId}&buyerId=${buyerId}&bookId=${bookId}&requeststatus=${requestStatus}`, null,
        function (response) { successToHandle(requestStatus, buyerId, bookName); },
        errorToHandle
    );
}
function successToHandle(requestStatus,buyerId,bookName) {
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

    // Send notification to the buyer
    sendNotificationToBuyer(bookName, buyerId, requestStatus);
    showAllRequests();
    allBooks = []
    showBooks();
    allMyBooks = [];
    showMyBooks();
    closeBookInfo();
}

function errorToHandle() {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error handling the request. Please try again.'
    });
}


//connect to hub chat for live message

let connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7225/chatHub")
    .build();

connection.on("ReceiveMessage", function (user, message) {
    var currentUser = JSON.parse(localStorage.getItem('loginUserDetails'));
    console.log(currentUser)
    if (currentUser != null) {
        let userId = (currentUser.userId).toString(); // Ensure this is a string comparison
        if (userId === user) {
            showAllRequests();
            Swal.fire({
                title: message,
                background: "#fff",
                color: "#121212",
                html: `
                <div style="text-align: center;">
                <iframe src="https://giphy.com/embed/3tESFsOZxN9qAJbfK8" width="300" height="300" style="" frameBorder="0" class="giphy-embed"></iframe>
                </div>`,
                timer: 3000, 
                showConfirmButton: false, 
                allowOutsideClick: false
                
            });
            allBooks = [];
            showBooks();
            allMyBooks = [];
            showMyBooks();
        }
    } else {
        console.log("User is not logged in or localStorage is empty.");
    }
});

function startConnection() {

    connection.start()
        .then(() => {
            console.log("SignalR Connected.");
        })
        .catch(err => console.error("SignalR Connection Error:", err));
}

startConnection();


function sendNotificationToBuyer(bookName, buyerId, requestStatus) {
    if (connection.state === signalR.HubConnectionState.Connected) {
       
        let messageToBuyer = `Your request for the book '${bookName}' has been ${requestStatus}.`
      
        connection.invoke("SendMessage", buyerId.toString(), messageToBuyer).catch(err => console.error("Error sending message:", err));
    } else {
        console.error("Connection is not established.");
    }
}
function sendNotificationToSeller(sellerId) {
    if (connection.state === signalR.HubConnectionState.Connected) {
       
        let messageToSeller = `You have new request! check your message box'.`
        connection.invoke("SendMessage",sellerId.toString(), messageToSeller).catch(err => console.error("Error sending message:", err));
    } else {
        console.error("Connection is not established.");
    }
}
// set the requests


// Function to update the message count
function updateMessageCount(count) {
    const badge = document.getElementById("message-count");

    // Always show the count, even if it's 0
    badge.textContent = count;
}


