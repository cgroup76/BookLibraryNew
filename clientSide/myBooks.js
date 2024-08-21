
    //var usersAPI = "https://localhost:7225/api/IUsers";
    //var booksAPI = "https://localhost:7225/api/Books";
var booksAPI = "https://proj.ruppin.ac.il/cgroup76/test2/tar1/api/Books";
var usersAPI = "https://proj.ruppin.ac.il/cgroup76/test2/tar1/api/IUsers";
    var allMyBooks = [];
    var allRecommendedBooks = [];

    var bookIdToRate;
    var bookRating;
    var currentBookId;
    const requestBox = $('.requestBox .dropdown-menu');
        const rating = stars => '★★★★★☆☆☆☆☆'.slice(5 - stars, 10 - stars);

    $(document).ready(function () {
    getRecommendedBooksForUser();
    showMyBooks();
    $('.requestBox').click(showAllRequests);
    $('.closeReviewButton').click(closeReviewForm);
        });

  //post review- allowed only 1 time and just in case the user read the book 
    function postReview() {
        if (document.querySelector('input[name="rating"]:checked') == null) {
            Swal.fire("Please add rating to the review");
            return;
        }
    else {
        bookRating = document.querySelector('input[name="rating"]:checked').value;
            }
    var comment = document.getElementById("comment").value;
    let userId = JSON.parse(localStorage.getItem("loginUserDetails")).userId;

        if (comment == "") {
            Swal.fire("Please add comment to the review");
            return;
        }
    ajaxCall("PUT", booksAPI + `/RateBook?bookID=${bookIdToRate}&newRating=${bookRating}&userID=${userId}&review=${comment}`, null, successRating, errorRating);

    return false;
        }

    //make sure the user write review not longer than 255 characters
    function updateCharacterCount() {
            const textInput = document.getElementById('comment');
    const charCount = document.getElementById('charCount');
    const currentLength = textInput.value.length;

    charCount.textContent = `${currentLength}/255 characters`;
}
    // show review form per book 
    function showReviewForm(id) {
        bookIdToRate = id;
            let bookToReview = allMyBooks.find((book) => book.Id === id);

    $("#reviewABook").addClass('active');
    $("#overlay").addClass('active');
    $('.reviewABook-book-img').attr('src', bookToReview.SmallThumbnail);
    $('.reviewABook-book-title').html(bookToReview.Title);

        }
    function closeReviewForm() {
        $("#reviewABook").removeClass('active');
    $("#overlay").removeClass('active');

    // Clear the rating selection
    $('input[name="rating"]').prop('checked', false);

    // Clear the text in the comment box
    $('#comment').val('');

    // Reset the character count display
    $('#charCount').text('0/255 characters');
        }

    //------------

    function errorRating(error) {
            if (error.status == 401) {

        logoutUser('endSession');
            }
    else {
        Swal.fire('Error', "Could not submit your raitng - please try again later", 'error');
            }
        }

    function successRating() {

        closeReviewForm();

    Swal.fire('Success', "Thank you for submiting a review for this book!", 'success');

    $(`#rating-${bookIdToRate}`).hide();

    for (let i = 0; i < allMyBooks.length; i++) {

                if (allMyBooks[i].Id == bookIdToRate) {

        allMyBooks[i].WasRated = 1;

    let munOfRatings = allMyBooks[i].NumOfReviews;
    let oldRating = allMyBooks[i].Rating;
    allMyBooks[i].Rating = ((oldRating * munOfRatings) + bookRating) / (munOfRatings + 1);
                }

            }
    showMyBooks();
        }

        //show user books 
    function showMyBooks() {

        let userDetails = JSON.parse(localStorage.getItem("loginUserDetails"));

    if (allMyBooks.length == 0) {

        ajaxCall("GET", `${usersAPI}?userId=${userDetails.userId}`, null, BooksToShow, errorToLoadBooks);
            }
    else {

        BooksToShow(allMyBooks);
            }
        }
    var currentBookTitle = "";

    function BooksToShow(books) {
            const booksContainer = document.getElementById('myBooks');
    let booksHtml = "";
    allMyBooks = books;

            allMyBooks.forEach((book) => {

        booksHtml += `<div class='col-lg-3 col-sm-4 col-12'>`

                if (book.IsRead == 'True') {booksHtml += `<div class='card mb-4 book-card book-${book.Id} readTheBook read'>`}
    else {booksHtml += `<div class='card mb-4 book-card book-${book.Id} '>`}

    booksHtml += `<img src='${book.SmallThumbnail}' class='card-img-top' alt='Book'>
        <div class='card-body' id='markAsRead-${book.Id}'>
            <h5 class='card-title'>${book.Title}</h5>
            <p>Written by: ${book.FirstAuthorName}</p>`;
            if (book.IsRead == 'False') {
                booksHtml += `<a class='btn btn-outline-dark pinkB' onclick="ReadTheBook(${book.UserId}, ${book.Id})">Mark as read</a>`;
                } else if (book.WasRated == 0) {
                booksHtml += `<a class='btn btn-outline-dark pinkB ' onclick='showReviewForm(${book.Id})''>Review</a>
                                                        </div>`;
                }
            else { }
            booksHtml += `
        </div>
    </div>
</div>`;
            });

            booksContainer.innerHTML = booksHtml;
        }

        function errorToLoadBooks(errorMessage) {
            console.log(errorMessage);
            Swal.fire('Error', 'Failed to load books. Please try again.', 'error');
        }
        //let the user mark the book as read 
        function ReadTheBook(userId, bookId) {
            currentBookId = bookId;

            let currentBook = allMyBooks.find(book => book.Id === bookId);
            currentBookTitle = currentBook.Title;

            ajaxCall("PUT", `${usersAPI}/readBookByUser?bookId=${bookId}&userId=${userId}`, null, successToMarkAsRead, errorToMarkAsRead);
        }

function successToMarkAsRead() {
    const bookElement = document.getElementById(`markAsRead-${currentBookId}`);
    let bookHtml = `
                                                            <h5 class='card-title'>${currentBookTitle}</h5>
                                                             <a class='btn btn-outline-dark pinkB ' onclick='showReviewForm(${currentBookId})''>Review</a>
                                                            </div>`;
    bookElement.innerHTML = bookHtml;

    $(`.book-${currentBookId}`).addClass('readTheBook');
    $(`.book-${currentBookId}`).addClass('read');
    Swal.fire('Success', 'Book marked as read.', 'success');

    for (let i = 0; i < allMyBooks.length; i++) {
        if (allMyBooks[i].Id == currentBookId) { allMyBooks[i].IsRead = "True"; }
    }
}

function errorToMarkAsRead(errorMessage) {
    if (errorMessage.status == 401) {
        logoutUser('endSession');
    } else {
        Swal.fire('Error', 'Failed to mark the book as read. Please try again.', 'error');
    }
}
//reccommended book, calculate by using knn algorithm
function getRecommendedBooksForUser() {

    userId = JSON.parse(localStorage.getItem("loginUserDetails")).userId;

    ajaxCall("GET", usersAPI + "/getRecommendedBook?userId=" + userId, null, successRecommendedBooks, errorToLoadBooks)
}
function successRecommendedBooks(recommended) {
    allRecommendedBooks = recommended;
    let recomendedBooksId = [];
    let html = "";
    let index = 0;
    const buyerId = (JSON.parse(localStorage.getItem("loginUserDetails"))).userId;

    recommended.forEach((book) => {

        if (index++ == 0) {

            recomendedBooksId.push(book.Id);

            html += ` <div class='carousel-item active '>
                                <div class='container'>
                                        <div class='top-books-container row recommended-book' onclick='showBookInfo(${book.Id})'>
                                        <div class='col-md-5 col-xs-6'>
                                        <img class='d-block  top-5-img'  alt='First slide' src='${book.Thumbnail}'>
                                        </div>
                                        <div class='top-info col-md-7 col-xs-6'>
                                        <h2>${book.Title}</h2>
                                        <h5 class='pink'>${rating(book.Rating)}  ${(book.Rating).toFixed(1)}</h5>
                                        <p>${limitStringLength(book.Description, 122)}</p>
                                        </div>
                                        </div>
                                        </div>
                                        </div >`;

        }

        else if (!recomendedBooksId.includes(book.Id)) {  // check if the book was not already added

            recomendedBooksId.push(book.Id);

            html += ` <div class='carousel-item  '>
                                <div class='container'>
                                        <div class='top-books-container row recommended-book' onclick='showBookInfo(${book.Id})'>
                                        <div class='col-md-5 col-xs-6'>
                                        <img class='d-block  top-5-img '  alt='First slide' src='${book.Thumbnail}'>
                                        </div>
                                        <div class='top-info col-md-7 col-xs-6'>
                                        <h2>${book.Title}</h2>
                                        <h5 class='pink'>${rating(book.Rating)}  ${(book.Rating).toFixed(1)}</h5>
                                        <p>${limitStringLength(book.Description, 122)}</p>
                                        </div>
                                        </div>
                                        </div>
                                        </div >`;
        }
    })
    $("#recommendedBooks").html(html);
}
// limit the length of the string
function limitStringLength(str, maxLength) {
    if (str.length > maxLength) {
        return str.slice(0, maxLength) + "...";
    } else {
        return str;
    }
}

// book info

function showBookInfo(bookId) {

    ajaxCall("GET", booksAPI + `/getBookReviews?bookId=${bookId}`, null, seccessToLoadReviews, errorR)

    let book = allRecommendedBooks.find((book) => book.Id === bookId);
    const buyerId = (JSON.parse(localStorage.getItem("loginUserDetails"))).userId;

    $('#book-info-container').addClass('active');
    $('#overlay').addClass('active');
    $('.book-info-img').attr('src', book.Thumbnail);
    $('.book-info-title').html(book.Title);
    $('.book-info-rating').html(rating(book.Rating) + "   " + (book.Rating).toFixed(1));
    $('.book-info-author').html(book.FirstAuthorName);
    $('.book-info-publish').html(book.PublishDate);
    $('.book-info-category').html(book.Category);
    $('.book-info-numOfPages').html(book.NumOfPages);

    if (book.IsEbook == 0) { $('.book-info-format').html('Hard Cover'); }
    else { $('.book-info-format').html('EBook'); }

    $('.book-info-lang').html('English');

}
function seccessToLoadReviews(reviews) {
    let html = '';
    let index = 1;

    if (reviews.length > 0) {
        reviews.forEach((review) => {
            if (index++ == 1) {
                html += `<div class="carousel-item active">
                        <div class='padding'>
                        <div class='book-review'>
                        <svg class='user-image-info' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
                                <h5 class='review-user'>${review.UserName}</h5>
                                <h5 class='review-rating pink'>${rating(review.Rating)}  ${(review.Rating).toFixed(1)}</h5>
                                <p class='review-text'>${review.Review}</p>
                                </div>
                                </div>
                                </div>`;
            }
            else {
                html += `<div class="carousel-item">
                        <div class='padding'>
                                <div class='book-review'>
                                <svg class='user-image-info' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
                                <h5 class='review-user'>${review.UserName}</h5>
                                <h5 class='review-rating'>${rating(review.Rating)}  ${(review.Rating).toFixed(1)}</h5>
                                <p class='review-text'>${review.Review}</p>
                                </div>
                                </div>
                                </div>`;
            }

        })
        $('#review-carosel').html(html);
    }
}

function errorR(err) { console.log(err) }

function closeBookInfo() {
    $('#book-info-container').removeClass('active');
    $('#overlay').removeClass('active');
    $('#review-carosel').html("");
}
  