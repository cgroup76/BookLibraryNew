    var usersAPI = "https://localhost:7225/api/IUsers";
    var booksAPI = "https://localhost:7225/api/Books";
    var authorsAPI = "https://localhost:7225/api/Authors";
    var allAuthors = '';
    let messageCount = 0;

    $(document).ready(function () {

        /*checkForLoginUser();*/

        showAuthors();

    /*  $('.logout').click(logoutUser);*/

    updateMessageCount(0);
        });
        // search author by name
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('authorsNamesInput');
    var selectedAuthor = "";

            searchInput.addEventListener('input', () => {
                const selectedValue = searchInput.value;
                allAuthors.forEach(author => {
                    if (author.name === selectedValue) {
        selectedAuthor = author;
                    }
                });
    if (selectedAuthor == "") {$(".author-details").html(''); } // If no author name was selected
    else {
        showSearchedAuthor(selectedAuthor);
    loadAthourBooks(selectedAuthor.id);
    selectedAuthor = "";
                }
            });
        });
    //---------------
    function showSearchedAuthor(author) {
            var html = "";
    html += `
    <div class=''>
        <div class='card-body'>
            <h2 class='card-text'>${author.name}</h2>`;
            if (author.dateOfBirth == undefined || author.dateOfBirth == "") { }
            else {
                html += `<p class='card-text'><strong>Born:</strong> ${author.dateOfBirth}</p>`
            }
            if (author.dateOfDeath == undefined || author.dateOfDeath == "") { }
            else {
                html += `<p class='card-text'><strong>Died:</strong> ${author.dateOfDeath}</p>`
            }
            if (author.age == undefined || author.age == "") { }
            else {
                html += `<p class='card-text'><strong>Age:</strong> ${author.age}</p>`
            }
            if (author.nationality == undefined || author.nationality == "") { }
            else {
                html += `<p class='card-text'><strong>Nationality:</strong> ${author.nationality}</p>`
            }
            if (author.notableWork == undefined || author.notableWork == "") { }
            else {
                html += `<p class='card-text'><strong>Notable Work:</strong> ${author.notableWork}</p>`
            }
            if (author.awards == undefined || author.awards == "") { }
            else {
                html += `<p class='card-text'><strong>Awards:</strong> ${author.awards}</p>`
            }
            if (author.description == undefined || author.description == "") { }
            else {
                html += `<p class='card-text'><strong>Description:</strong> ${author.description}</p>`
            }
            html += `  <h4 class='authorBooksTitle'></h4>  <div class="row authour-books"></div> </div>
    </div>`;
    $(".author-details").html(html)
        }
    // load all the books by author
    function loadAthourBooks(selectedAuthor) {

        ajaxCall("GET", authorsAPI + `/findBookByAuthor/?authorId=${selectedAuthor}`, null, successToLoadBooks, errorToLoadAuthors)
    }

    function successToLoadBooks(authorBooks) {
            var html = "";
            const rating = stars => '★★★★★☆☆☆☆☆'.slice(5 - stars, 10 - stars);

    document.querySelector(".authorBooksTitle").innerHTML += 'Books By ' + authorBooks[0].FirstAuthorName + ':';

            authorBooks.forEach((book) => {

        html += `
                                <div class='col-md-3'>
                                    <div class='card mb-4 book-card'>
                                        <img src='${book.SmallThumbnail}' class='card-img-top' alt='Book'>
                                        <div class='card-body w-100'>
                                            <h6 class='card-title'>${book.Title}</h6>
                                            <p id='pinkStars'>${rating(book.Rating)}  ${(book.Rating).toFixed(1)}</p>
                                            <span class='card-text'>${book.Price}$</span></div></div></div>`;
            })
    $(".authour-books").html(html);
        }

    function showAuthors() {
            if (allAuthors.length == 0) {
        ajaxCall("GET", authorsAPI, null, authorsToShow, errorToLoadAuthors);
            } else {
        authorsToShow(allAuthors);
            }
        }

    function errorToLoadAuthors(err) {
        console.log(err);
        }

    function authorsToShow(authors) {
            var authorNameSearchBar = "";

    allAuthors = authors;

            allAuthors.forEach((author) => {authorNameSearchBar += `<option value='${author.name}'>`})

    $("#authorsNames").html(authorNameSearchBar);
        }
    function updateMessageCount(count) {
            const badge = document.getElementById("message-count");

    // Always show the count, even if it's 0
    badge.textContent = count;
        }

    ///
    function showBooks() { };
    function showMyBooks() { };
    function closeBookInfo() { };
