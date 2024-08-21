
//var usersAPI = "https://localhost:7225/api/IUsers";
// var booksAPI = "https://localhost:7225/api/Books";
//var authorsAPI = "https://localhost:7225/api/Authors";
var authorsAPI = "https://proj.ruppin.ac.il/cgroup76/test2/tar1/api/Authors";
var usersAPI = "https://proj.ruppin.ac.il/cgroup76/test2/tar1/api/IUsers";
var booksAPI = "https://proj.ruppin.ac.il/cgroup76/test2/tar1/api/Books";

    var allBooksForAdmin = [];
    var allUsersForAdmin = [];
    var allAuthorForAdmin = [];

    $(document).ready(function () {
        $('.closeTable').click(closeTable);
    $("#bookTableContainer").hide();
    $("#usersTableContainer").hide();
    $("#authorTableContainer").hide();
    showBooksForAdmin();

        });

    function ajaxCall(method, api, data, successCB, errorCB) {
        $.ajax({
            type: method,
            url: api,
            data: JSON.stringify(data),
            cache: false,
            contentType: "application/json",
            dataType: "json",
            success: successCB,
            error: errorCB
        });
        }

        //load all books for admin table
    function showBooksForAdmin() {

        ajaxCall("GET", booksAPI, null, BooksForAdmin, errorToLoad);
        }


    function BooksForAdmin(books) {
        allBooksForAdmin = books
            const BooksContainer = document.getElementById('booksTableInput');
    let booksHtml = "";

            allBooksForAdmin.forEach((book) => {
        booksHtml += `
                                    <tr>
                                        <td><img src='${book.SmallThumbnail}' alt='Thumbnail' width='50' height='75'></td>
                                        <td>
                                            ${book.Title} <br>
                                            ${book.Description}
                                        </td>
                                        <td>
                                            ${book.FirstAuthorName} <br>
                                            ${book.SecondAuthorName}
                                        </td>
                                        <td>${book.UserName}</td>`
                if (book.IsAvailable == 1 && book.IsActive == 1) {
        booksHtml +=
        `<td> Active </br>
                                                 <button id="activityBtn" onclick="changeActivtiy(${book.Id})">Mark as inactive</button>
                                                 </td>
                                                </tr>`;
                }
    else if ((book.IsAvailable == 1 && book.IsActive == 0)) {
        booksHtml +=
        `<td> Inactive </br>
                              <button id="activityBtn" onclick="changeActivtiy(${book.Id})">Mark as active</button>
                              </td>
                             </tr>`;
                }
    else if (book.IsAvailable == 0) {
        booksHtml +=
        `<td> Active  </td>
                             </tr>`;

                }

            });

    booksHtml += '</tbody></table ></div > ';
BooksContainer.innerHTML = booksHtml;
        }
function changeActivtiy(bookId) {
    ajaxCall("PUT", `${booksAPI}/changeBookActivity?bookId=${bookId}`, null, successToChange, errorToChange)
}

function successToChange() {

    Swal.fire({
        icon: "success",
        title: "the status successfully change",

    });
    showTable('Book Table');

}
function errorToChange() {
    Swal.fire({
        icon: "error",
        title: "the status faild to change",
        text: "pleas try again",

    });
}


//show all authores at admin page
function showAuthorForAdmin() {
    if (allAuthorForAdmin.length == 0) {
        ajaxCall("GET", authorsAPI + "/GetLibrariesPerAuthor", null, AuthorToShowForAdmin, errorToLoad);
    }
    else {
        AuthorToShowForAdmin(allAuthorForAdmin);
    }
}


function AuthorToShowForAdmin(authors) {
    allAuthorForAdmin = authors;
    const authorsContainer = document.getElementById('authorsTableInput');
    let authorsHtml = "";

    authors.forEach((author) => {
        authorsHtml += `
                         <tr>
                             <td>
                                 ${author.Name}
                             </td>
                             <td>
                                 ${author.numOfLibarries}
                             </td>
                         </tr>`;
    });

    authorsHtml += '</tbody></table></div>';
    authorsContainer.innerHTML = authorsHtml;
}

//show all users at admon page
function showUsersForAdmin() {
    ajaxCall("GET", usersAPI + "/GetAllIusers", null, userToShowForAdmin, errorToLoad);
}



function userToShowForAdmin(users) {
    allUsersForAdmin = users
    const UserContainer = document.getElementById('usersTableInput');
    let usersHtml = "";

    allUsersForAdmin.forEach((user) => {
        var counter = 1;
        usersHtml += `
                            <tr id="user-${user.Id}">
                                <td>${user.UserName}</td>
                                <td>${user.Email}</td>
                                <td id="userBooksAdminPage">`
        allBooksForAdmin.forEach((book) => {
            if (book.UserId == user.Id) {
                usersHtml += `${counter++}. ${book.Title} </br >`
            }
        });
        usersHtml += ` </td > </tr>`
    });

    UserContainer.innerHTML = usersHtml
}




function errorToLoad(message) {
    console.log(message);
}


//create table for admin page for user, author, books
function showTable(table) {
    if (table === 'Book Table') {

        $("#bookTableContainer").show();
        $(".userTable").hide();
        $(".authersTable").hide();
        $(".booksTable").hide();
        showBooksForAdmin()();

    }
    else if (table === 'User Table') {
        $("#usersTableContainer").show();
        $(".userTable").hide();
        $(".authersTable").hide();
        $(".booksTable").hide();
        showUsersForAdmin();
    }
    else if (table === 'Authers Table') {
        $("#authorTableContainer").show();
        $(".userTable").hide();
        $(".authersTable").hide();
        $(".booksTable").hide();
        showAuthorForAdmin();
    }
}

function closeTable() {
    $("#bookTableContainer").hide();
    $("#usersTableContainer").hide();
    $("#authorTableContainer").hide();
    $(".userTable").show();
    $(".authersTable").show();
    $(".booksTable").show();
}
        
      

