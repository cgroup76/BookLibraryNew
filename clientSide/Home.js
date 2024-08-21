
   // var usersAPI = "https://localhost:7225/api/IUsers";
    //var booksAPI = "https://localhost:7225/api/Books";
var booksAPI = "https://proj.ruppin.ac.il/cgroup76/test2/tar1/api/Books";
var usersAPI = "https://proj.ruppin.ac.il/cgroup76/test2/tar1/api/IUsers";

        const rating = stars => '★★★★★☆☆☆☆☆'.slice(5 - stars, 10 - stars);

    var allBooks = [];
    let booksDict = { };
    var top5Books = [];

    var currentBookId;

    $(document).ready(function () {

        showBooks();

    //search book by title / author / text
    $(".search-book-btn").click(searchBook);

    $('.reset-search-book').click(showBooks);
    $('.reset-search-book').hide();
        })
    // page load animation
    window.addEventListener('load', function () {
            const blobs = document.querySelectorAll('.bubble-head');
            blobs.forEach(blob => {
        blob.style.animationPlayState = 'running'; // Trigger animation on load
            });
        });
    window.addEventListener('load', function () {
            const blobs = document.querySelectorAll('.bubble-head-left-s');
            blobs.forEach(blob => {
        blob.style.animationPlayState = 'running'; // Trigger animation on load
            });
        });

    // text to speach -> search bar : work on Google chrom / Opera / Samsung Internet

    const transcript = document.querySelector(".search-string");

        // Select the SVG element by its class and add a click event listener
        document.querySelector('.speech-to-text').addEventListener('click', () => {
        // Start speech recognition logic here
        transcript.value = "";  // Clear input field

    recognition = new webkitSpeechRecognition();  // Initialize speech recognition

    // Set up speech recognition options
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 10;

    recognition.start();  // Start speech recognition

            // Handle the results of speech recognition
            recognition.onresult = (event) => {
        let text = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i][0].confidence > 0.8) {
        text += event.results[i][0].transcript;
                    }
                }

    transcript.value = text.trim();  // Update input field with transcribed text
            };

            recognition.onend = () => {
        // Re-enable recognition or handle when recognition ends
    };

            recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    recognition.stop();
            };
        });

    //-----------------------


    // book info

    function showBookInfo(bookId) {

            const buyer = JSON.parse(localStorage.getItem("loginUserDetails"));

    ajaxCall("GET", booksAPI +`/getBookReviews?bookId=${bookId}`, null, seccessToLoadReviews, errorR)

            let book = allBooks.find((book) => book.Id === bookId);

    $('#book-info-container').addClass('active');
    $('#overlay').addClass('active');
    $('.book-info-img').attr('src', book.Thumbnail);
    $('.book-info-title').html(book.Title);
    $('.book-info-rating').html( rating(book.Rating) + "   " + (book.Rating).toFixed(1));
    $('.book-info-author').html(book.FirstAuthorName);
    $('.book-info-publish').html(book.PublishDate);
    $('.book-info-category').html(book.Category);
    $('.book-info-numOfPages').html(book.NumOfPages);

    if (buyer != null) {
                const buyerId = buyer.userId;

    // If someone already bought the book
    if (book.IsAvailable == 0) {
                    if (book.UserId == buyerId) { // The logged-in user bought this book
        $('.buy-the-book').html(`<a class='btn buyABookBtn pinkB ' id='notAllowed' disabled><s>Buy</s></a>`);

                    } else {
                        const userName = book.UserName ? book.UserName.toString() : ''; // Ensure userName exists and convert it to a string
                        $('.buy-the-book').html(`<a class='btn btn-outline-dark pinkB btn-request-${book.Id}' onclick='sendRequest(${buyerId}, ${book.UserId}, ${book.Id}, "${userName}")'>Buy</a>`);
                    }
                } else {
        // If the book is available for purchase
        $('.buy-the-book').html(`<a class='btn btn-outline-dark pinkB'  onclick='buyABook(${book.Id})'>Buy</a>`);
                }
            } else {
        // If the user is not logged in, there's no need to show the purchase option
        $('.buy-the-book').html(`<a class='btn btn-outline-dark pinkB'  onclick='buyABook(${book.Id})'>Buy</a>`);
            }

    if (book.IsEbook == 0) {$('.book-info-format').html('Hard Cover'); }
    else {$('.book-info-format').html('EBook'); }

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

    function errorR(err) {console.log(err)}

    function closeBookInfo() {
        $('#book-info-container').removeClass('active');
    $('#overlay').removeClass('active');
    $('#review-carosel').html("");
        }



    function showMyBooks() { }

        // show books


    function showBooks() {

            if (allBooks.length == 0) {
        ajaxCall("GET", booksAPI, null, showAllBooks, errorToLoadBooks);

            }
    else {BooksToShow(allBooks, 'allBooks'); }

    getTop5Books();
        }

    function showAllBooks(books) {
        allBooks = books;
    activateSreachBooksBar();
    BooksToShow(allBooks, 'allBooks');
        }

    function getTop5Books() {
            if (top5Books.length == 0) {
        ajaxCall("GET", booksAPI + '/showTop5BooksByRating', null, top5booksByRating, errorToLoadBooks);
            }
    else {showTop5Books(top5Books); }
        }

    function top5booksByRating(topBooks) {
        top5Books = topBooks;
    showTop5Books(top5Books);
        }
    function showTop5Books(books, container) {
        let html = "";
    let index = 0;

            books.forEach((book) => {

                if (index++ == 0) {

        html += ` <div class='carousel-item active '>
                            <div class='container'>
                                    <div class='top-books-container row'>
                                    <div class='col-md-5 col-xs-6'>
                                        <!--star-->
                                        <div class="top5-logo">
                                        <div class="star">
                                         <span class="top-5-star">Top 5</span>
                                      </div>
                                      </div>
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

    else {
        html += ` <div class='carousel-item  '>
                            <div class='container'>
                                    <div class='top-books-container row'>
                                    <div class='col-md-5 col-xs-6'>
                                        <!--star-->
                                        <div class="top5-logo">
                                        <div class="star">
                                         <span class="top-5-star">Top 5</span>
                                      </div>
                                      </div>
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
            })
    $("#top5Books").html(html);
        }
    // limit the length of the string
    function limitStringLength(str, maxLength) {
            if (str.length > maxLength) {
                return str.slice(0, maxLength) + "...";
            } else {
                return str;
            }
        }

    function BooksToShow(books, containerId) {
        $('.reset-search-book').hide();

    allBooks = books;
    const BooksContainer = document.getElementById('allBooks');
    if (BooksContainer.classList.contains('container')) {
        // If it has the class 'row', remove 'row' and add 'container'
        BooksContainer.classList.remove('container');
    BooksContainer.classList.add('row');
            }
    let booksHtml = '';
    const buyer = JSON.parse(localStorage.getItem("loginUserDetails"));

            books.forEach((book) => {
                if (book.IsActive == 1) {
        booksHtml += `<a onclick='showBookInfo(${book.Id})'>
                                                    <div class='col-lg-3 col-sm-4 book-info'>`

                    if (buyer != null && book.IsAvailable == 0 && buyer.userId == book.UserId) {booksHtml += `<div class='card mb-4 book-card book-${book.Id} bought'>`}
    else {booksHtml += `<div class='card mb-4 book-card book-${book.Id}'>`}

    booksHtml +=                          `  <img src='${book.SmallThumbnail}' class='card-img-top' alt='Book'>
        <div class='card-body w-100'>
            <h6 class='card-title'>${book.Title}</h6>
            <p id='pinkStars'>${rating(book.Rating)}  ${(book.Rating).toFixed(1)}</p>
            <span class='card-text'>${book.Price}$       </span>`;

            if (buyer != null) {
                        const buyerId = buyer.userId;

            // If someone already bought the book
            if (book.IsAvailable == 0) {
                            if (book.UserId == buyerId) { // The logged-in user bought this book
                booksHtml += `<a class='btn buyABookBtn pinkB ' id='notAllowed' disabled><s>Buy</s></a>
                                                                          </div>
                                                                          </div>
                                                                          </div></a>`;
                            } else {
                                const userName = book.UserName ? book.UserName.toString() : ''; // Ensure userName exists and convert it to a string
            booksHtml += `<a class='btn btn-outline-dark buyABookBtn pinkB btn-request-${book.Id}' onclick='sendRequest(${buyerId}, ${book.UserId}, ${book.Id}, "${userName}")'>Buy</a>
        </div>
    </div>
</div></a > `;
                            }
                        } else {
                            // If the book is available for purchase
                            booksHtml += `<a class='btn btn-outline-dark buyABookBtn pinkB' onclick = 'buyABook(${book.Id})' > Buy</a >
                                                                      </div >
                                                                      </div >
                                                                      </div ></a> `;
                        }
                    } else {
                        // If the user is not logged in, there's no need to show the purchase option
                        booksHtml += `<a class='btn btn-outline-dark buyABookBtn pinkB' onclick = 'buyABook(${book.Id})' > Buy</a >
                                                                  </div >
                                                                  </div >
                                                                  </div ></a> `;
                    }
                }
            });

            BooksContainer.innerHTML = booksHtml;
        }

        function errorToLoadBooks(message) { console.log(message); }

        // buy a book

        function buyABook(bookId) {

            currentBookId = bookId;

            var buyer = JSON.parse(localStorage.getItem("loginUserDetails"))

            if (buyer != null) {

                buyer = buyer.userId; // set the buyer id from the json

                ajaxCall("POST", usersAPI + '/addNewBookToUser?userId=' + buyer + '&bookId=' + bookId, null, successToBuyABook, errorBuyABook);
            }

            else { Swal.fire("Please login first"); }
        }

        function successToBuyABook(status) {
            Swal.fire('Success', "The book has been successfully purchased", 'success');
            closeBookInfo();
            $(`.book - ${ currentBookId } `).addClass('bought');
            setBooksDetails(allBooks);
            setBooksDetails(top5Books);

            showBooks();
        }

        function errorBuyABook(error) {
            if (error.status == 401) {

                Swal.fire("Connection time ended - Please login first");

                localStorage.clear();

                checkForLoginUser();

                showLoginForm();
            }
            else { Swal.fire("Error to buy a book"); }
        }
        // set the book details
        function setBooksDetails(books) {
            for (let i = 0; i < books.length; i++) {
                if (books[i].Id == currentBookId) {
                    books[i].IsAvailable = 0;
                    books[i].UserId = JSON.parse(localStorage.getItem("loginUserDetails")).userId;
                }
            }
        }
       

     
        //------------------------
        function activateSreachBooksBar() {

            allBooks.forEach((book) => {
                let text = book.Title + " " + book.FirstAuthorName + " " + book.SecondAuthorName + " " + book.TextSnippet + " " + book.Description;
                booksDict[JSON.stringify(book)] = text.toLowerCase();
            })
        }
        function searchBook() {
            let searchString = ($(".search-string").val()).toLowerCase();
            let bookList = []

            if (searchString == "") { }
            else {
                for (let key in booksDict) {

                    let index = booksDict[key].indexOf(searchString)

                    if (index != -1) {

                        let str = booksDict[key];
                        let section1 = str.substring(index - 50 - searchString.length, index);
                        let section2 = str.substring((index + searchString.length), (index + searchString.length + 200) );
                        let findSearchString = searchString

                        let book = JSON.parse(key);
                        book['foundString'] = `<p>...${ section1 } <strong class='pink'>${findSearchString}</strong>${ section2 }...</p > `;
                        bookList.push(book);

                    }
                }
                if (bookList.length == 0) {
                    document.getElementById("allBooks").innerHTML = "<h5>0 books was found...</h5>";
                }
                else {
                    const BooksContainer = document.getElementById('allBooks');
                    if (BooksContainer.classList.contains('row')) {
                        // If it has the class 'row', remove 'row' and add 'container'
                        BooksContainer.classList.remove('row');
                        BooksContainer.classList.add('container');
                    } 
                    const buyer = JSON.parse(localStorage.getItem("loginUserDetails"));
                    let booksHtml = '';

                    bookList.forEach((book) => {
                        booksHtml += `
                                        <div class='row'>
                                                        <div class=' mb-4 book-card-search col-xl-2 col-lg-3 col-md-4 col-12'>
                                                            <img src='${book.SmallThumbnail}' class='card-img-search' alt='Book'>
                                                            </div>
                                                            <div class='card-body w-100 col-xl-10 col-lg-9 col-md-8 col-12'>
                                                                <h3 class='card-title'>${book.Title}</h3>
                                                                ${book.foundString}
                                                                <p id='pinkStars'>${rating(book.Rating)}  ${(book.Rating).toFixed(1)}</p>
                                                                <span class='card-text'>${book.Price}$       </span>`;
                        if (buyer != null) {
                            const buyerId = buyer.userId;

                            // If someone already bought the book
                            if (book.IsAvailable == 0) {
                                if (book.UserId == buyerId) { // The logged-in user bought this book
                                    booksHtml += ` <a class='btn buyABookBtn pinkB ' id = 'notAllowed' disabled > <s>Buy</s></a >
                                                                          </div>
                                                                          </div>`;
                                } else {
                                    const userName = book.UserName ? book.UserName.toString() : ''; // Ensure userName exists and convert it to a string
                                    booksHtml += `<a class='btn btn-outline-dark buyABookBtn pinkB' onclick='showBookInfo(${book.Id})'>Info</a>
                                                                      </div>
                                                                      </div >
                                                                      </div > `;
                                }
                            } else {
                                // If the book is available for purchase
                                booksHtml += `< a class='btn btn-outline-dark buyABookBtn pinkB' onclick = 'showBookInfo(${book.Id})' > Info</a >
                                                                      </div >
                                                                      </div >
                                                                      </div > `;
                            }
                        } else {
                            // If the user is not logged in, there's no need to show the purchase option
                            booksHtml += `< a class='btn btn-outline-dark buyABookBtn pinkB' onclick = 'showBookInfo(${book.Id})' > Info</a >
                                                                        </div >
                                                                      </div >
                                                                      </div > `;
                        }
                    });
                    BooksContainer.innerHTML = booksHtml;
                }
                $('.reset-search-book').show();
            }
            return false;
        }

   