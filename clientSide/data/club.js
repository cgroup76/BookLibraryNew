// JavaScript source code


    $(document).ready(function () {

        loadBooks();

    getClubs();

    $('#search-club-btn').click(searchClub);

    $('.post-btn').click(sendPost);

    $('.add-image-btn').click(addImageToPost);

    $('.add-ai-btn').click(showTextToImage);

    $('.generate-btn').click(TextToImage);

    $("#clear-search-club-btn").hide();

    $("#clear-search-club-btn").click(getClubs);
        });

    var booksAPI = "https://localhost:7225/api/Books";
    var clubBooksAPI = "https://localhost:7225/api/BookClub";
    var uploadFilesAPI = 'https://localhost:7225/api/upload';
    var usersAPI = "https://localhost:7225/api/IUsers";
    var imageFolder = "https://localhost:7225/Images";
    var allBooks = [];
    var allClubs = [];
    let booksDict = [];
    let clubsDict = [];
    let currentClub;
    let imageLink = "";
    let currentLikeBtn;
    let imageCounter = 0;


    function searchClub() {
        let searchstring = $('.search-string').val();
    console.log(searchstring);
    let searchClub = [];
            allClubs.forEach((club) => {
                if (club.ClubName == searchstring) {
        searchClub.push(club);
                }
            })

    const clubsContainer = document.getElementById("container-clubs");
    let clubsHtml = '';
    if (!clubsContainer) {
        console.error("Container for clubs not found.");
    return;
            }

            searchClub.forEach(club => {
        clubsHtml += `
            <a id="club-info" onclick="showclubInfo(${club.ClubId})">
                <div class="col-lg-3 col-sm-4 ">
                    <div class="card mb-4 club-card">
                    <h5 class="pink">Book Club:</h5>
                        <img src="${club.ClubImage}" class="book-club-image-card" alt="Club Image for ${club.ClubName}">
                         <h6 class="card-title">${club.ClubName}</h6>
                        <br/>
                        <p>Members in club:  ${club.ClubMembers}</p>
                    </div>
                </div>
            </a>`;
            });
    clubsContainer.innerHTML = clubsHtml;
    $("#clear-search-club-btn").show();
        }
    // Function to initialize clubsDict
    function activateSearchBooksBar() {
        allClubs.forEach((club) => {
            let text = club.Title;
            clubsDict[JSON.stringify(club)] = text;
        });
        }

    // create a new club

    function createNewClub() {
        document.getElementById('overlay').style.display = 'block';
    document.getElementById('form-modal').style.display = 'block';

    const clubTitleSelect = document.getElementById('club-title');//make dropdown with book titles
    clubTitleSelect.innerHTML = '';//clear previous select
            booksDict.forEach(bookTitle => {
                const option = document.createElement('option');
    option.value = bookTitle;
    option.textContent = bookTitle;
    clubTitleSelect.appendChild(option);
            });
    document.getElementById('create-club-form').onsubmit =
    async function (event) {
        event.preventDefault(); //prevent from the browser to do the default action, like in this case to load the browser again
    let selectedTitle = clubTitleSelect.value;

    var userId = JSON.parse(localStorage.getItem("loginUserDetails"))

    if (userId != null) {

        userId = userId.userId; // set the user id from the json

    await ajaxCall("POST", clubBooksAPI + `/creatClub?clubName=${selectedTitle}&userId=${userId}`, null, successCreateBookClub, errorCreateBookClub);
    closeForm();
                    }
    else {Swal.fire("Please login to create a club"); }
                }
        }
    function closeForm() {
        console.log("Closing form");
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('form-modal').style.display = 'none';
        }

    function successCreateBookClub() {
        Swal.fire("Success Create Book Club");
    ajaxCallSync("GET", clubBooksAPI + "/getAllClubs", null, showAllClubs, errorR);
        }
    function errorCreateBookClub(error) {
            if (error.status == 401) {

        Swal.fire("Connection time ended - Please login first");

    logoutUser("endSession");
            }
    else {Swal.fire("Error to create book club"); }
        }
    function errorR(err) {
        console.log(err);
        }

    function getClubs() {
            if (allClubs.length == 0) {
        ajaxCall("GET", clubBooksAPI + "/getAllClubs", null, showAllClubs, errorR);

            }
    else {
        showAllClubs(allClubs);
            }
    $("#clear-search-club-btn").hide();
        }
    function successjoinClub() {
        Swal.fire("success join club");
    $(".create-post").show();
    $("#join-club").hide();
        }

    // join club

    function joinClub() {

            var userId = JSON.parse(localStorage.getItem("loginUserDetails"))

    if (userId != null) {

        userId = userId.userId; // set the user id from the json
    ajaxCall("POST", clubBooksAPI + `/joinClub?clubId=${currentClub.ClubId}&userId=${userId}`, null, successjoinClub, errorR);
            }

        }
    // show all clubs

    function showAllClubs(response) {

        allClubs = response;

    const clubsContainer = document.getElementById("container-clubs");
    let clubsHtml = '';

    if (!clubsContainer) {
        console.error("Container for clubs not found.");
    return;
            }

            allClubs.forEach(club => {
        clubsHtml += `
            <a id="club-info" onclick="showclubInfo(${club.ClubId})">
                <div class="col-lg-3 col-sm-4 ">
                    <div class="card mb-4 club-card">
                    <h5 class="pink">Book Club:</h5>
                        <img src="${club.ClubImage}" class="book-club-image-card" alt="Club Image for ${club.ClubName}">
                         <h6 class="card-title">${club.ClubName}</h6>
                        <br/>
                        <p>Members in club:  ${club.ClubMembers}</p>
                    </div>
                </div>
            </a>`;
            });
    clubsContainer.innerHTML = clubsHtml;

    var clubNameSearchBar = "";
            allClubs.forEach((club) => {
        clubNameSearchBar += `<option value='${club.ClubName}'>`
    })
    $("#clubSearch").html(clubNameSearchBar);
        }

    function loadBooks() {
          
            if (allBooks.length == 0) {
        ajaxCall("GET", booksAPI, null, showAllBooks, errorToLoadBooks);
            }
    else {showAllBooks(allBooks); }
        }

    function showAllBooks(response) {
        allBooks = response;

    activateSearchBooksBar();
    populateDropdown(booksDict);
        }

    function errorToLoadBooks() {
        console.log("Error loading books");
        }

    function activateSearchBooksBar() {
        allBooks.forEach((book) => {
            let text = book.Title;
            booksDict.push(text);
        });
        }

    function populateDropdown(items) {
            var dropdownMenu = document.getElementById('create');
    dropdownMenu.innerHTML = '';
            items.forEach(item => {
                var listItem = document.createElement('a');
    listItem.className = 'dropdown-item';
    listItem.href = '#';
    listItem.textContent = item;

    listItem.addEventListener('click', function () {
        document.querySelector('.text-input').value = item;  // Make sure this element exists
                });

    dropdownMenu.appendChild(listItem);
            });
        }

    // Text to Image

    function showTextToImage() {
        $(".text-input-to-image").val("");
    $(".text-to-image-div").toggleClass("d-none");
        }

    async function queryTEXTtoIMG(text) {
            const response = await fetch(
    "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4",
    {
        headers: {Authorization: "Bearer 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" },
    method: "POST",
    body: JSON.stringify({inputs: text }),
                }
    );
    if (!response.ok) {
                throw new Error("Image generation failed. Please try again.");
            }
    return response.blob();
        }

    let currentImageBlob;

    async function TextToImage() {
            const textInput = document.querySelector(".text-input-to-image").value.trim(); // ����� ����� �� ��� ������ �������

    console.log("Text input value:", textInput); // Debugging line

    if (!textInput) {
        alert("Please enter a description.");
    return;
            }

    try {
        // Show the loading spinner
        loadingSpinner.style.display = "block";

    const imageBlob = await queryTEXTtoIMG(textInput);
    currentImageBlob = imageBlob;

    // Hide the loading spinner once the image is generated
    loadingSpinner.style.display = "none";

    const imageUrl = URL.createObjectURL(imageBlob);
    $('.add-post-image').show();
    $(".add-post-image").attr("src", imageUrl);
    $(".text-to-image-div").addClass("d-none");
    $(".text-input-to-image").val("");
    $(".add-image-btn").attr("disabled", "disabled");

            } catch (error) {
        // Hide the loading spinner once the image is generated
        loadingSpinner.style.display = "none";

    alert(error.message);

            }
        }

    //function that show club extra information
    function closeclubInfo() {
        $('#club-info-container').removeClass('active');
    $('#overlay').removeClass('active');

    document.querySelector('textarea').value = "";
        }

    // open club info 

    function showclubInfo(clubId) {
        let currentUser = JSON.parse(localStorage.getItem("loginUserDetails")).userName;
    const postsContainer = document.querySelector('.posts-container');
    postsContainer.innerHTML = "";
    $(".add-image-btn").removeAttr("disabled");
    $('.add-post-image').hide();

    $("#join-club").show();

    ajaxCall("GET", clubBooksAPI + `/getAllClubMembers?clubId=${clubId}`, null, seccessToshowclubMembers, errorToshowclubMembers)

    loadPosts(clubId);

            allClubs.forEach((club) => {
                if (club.ClubId == clubId) {
        currentClub = club;
                }
            })


    $('#club-info-container').addClass('active');
    $('#overlay').addClass('active');
    $('.club-info-title').html(currentClub.ClubName);
    $('.user-name').html(currentUser);
    $('.club-image-info').attr("src", currentClub.ClubImage);

        }

    function loadPosts(clubId) {
        let currenUserId = JSON.parse(localStorage.getItem("loginUserDetails")).userId
    ajaxCall("GET", clubBooksAPI + `/getPostPerClub?clubId=${clubId}&userId=${currenUserId}`, null, successToLoadPost, errorToshowclubMembers)
        }

    // show posts

    function successToLoadPost(posts) {
            const postsContainer = document.querySelector('.posts-container');
    postsContainer.innerHTML = "";

            posts.forEach((post) => {
                // Create elements for the post
                const postDiv = document.createElement('div');
    postDiv.classList.add('post');
    postDiv.classList.add('col-12');

    const postHeader = document.createElement('div');
    postHeader.classList.add('post-header');

    const postUserInfo = document.createElement('div');
    postUserInfo.classList.add('post-user-info');

    const postUserName = document.createElement('span');
    postUserName.classList.add('post-user-name');
    postUserName.textContent = post.UserCreateName;

    const postTimestamp = document.createElement('span');
    postTimestamp.classList.add('post-timestamp');
    postTimestamp.textContent = (post.PostDate).split(" ")[0]; // Adds current timestamp

    postUserInfo.appendChild(postUserName);
    postUserInfo.appendChild(postTimestamp);

    // Create a container for the SVG
    postHeader.innerHTML += `
    <svg class="user-image-info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free -->
        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
    </svg>
    `;

    postHeader.appendChild(postUserInfo);

    const postContentDiv = document.createElement('div');
    postContentDiv.classList.add('post-content');
    postContentDiv.textContent = post.Description;

    const likeButton = document.createElement('button');
    likeButton.classList.add('like-btn');
    likeButton.innerHTML = '<i class="fas fa-heart"></i> ';

    const likeNum = document.createElement('span');
    likeNum.classList.add('num-of-likes');
    likeNum.innerHTML = post.Likes;

    const postLikesDiv = document.createElement('div');
    postLikesDiv.classList.add('post-likes');
    postLikesDiv.appendChild(likeNum)
    postLikesDiv.appendChild(likeButton)

    const postPic = document.createElement('img');
    postPic.src = post.Image;
    postPic.alt = 'post picture';
    postPic.classList.add('post-pic');

    if (post.userLike == 0) { // the user didnt like the post in the past

        // Add on click for the like button
        likeButton.onclick = function () {

            postLike(post.UserCreateId, post.PostId, this, this.parentElement);
        };
                }
    else {
        likeButton.classList.add("liked");
    likeButton.disabled = true;;
                }

    // Append all elements to the post div
    postDiv.appendChild(postHeader);
    postDiv.appendChild(postPic);
    postDiv.appendChild(postContentDiv);
    postDiv.appendChild(postLikesDiv);

    // Append the post to the posts container
    postsContainer.prepend(postDiv); // Adds the post at the top of the container
            })
        }

    function errorToshowclubMembers(err) {
        console.log(err);
        }
    function seccessToshowclubMembers(members) {
        let currentUserId = JSON.parse(localStorage.getItem("loginUserDetails")).userId
    let html = "";
    let status = false;

            members.forEach((member) => {
        html += ` <div class="user-profile">
                                <div class="user-circle">
                                    <i class="fas fa-user profile-image-member"></i>
                                </div>
                                <div class="user-name-member">${member.userName}</div>
                            </div>`;

    if (currentUserId == member.userId) {
        $("#join-club").hide();
    status = true;
                }
            })

    if (status) {$(".create-post").show(); }
    else {$(".create-post").hide(); }

    $(".club-members").html(html);
        }
    function postReviewClub() {
            if (document.querySelector('input[name="rating"]:checked') == null) { }
    else {
        bookRating = document.querySelector('input[name="rating"]:checked').value;
            }
    var comment = document.getElementById("comment").value;
    let userId = JSON.parse(localStorage.getItem("loginUserDetails")).userId;


    ajaxCall("PUT", booksAPI + `/RateBook?bookID=${bookIdToRate}&newRating=${bookRating}&userID=${userId}&review=${comment}`, null, successRating, errorRating);

    return false;
        }

    ///
    function showMyBooks() { };
    function closeBookInfo() { };
    ///

    function updateCharacterCount() {
            const textInput = document.getElementById('comment');
    const charCount = document.getElementById('charCount');
    const currentLength = textInput.value.length;

    charCount.textContent = `${currentLength}/255 characters`;
        }


    // emoji

    const emojiBtn = document.querySelector('.emoji-btn');
    const emojiPicker = document.querySelector('.emoji-picker');
    const emojis = document.querySelectorAll('.emoji');
    const textarea = document.querySelector('textarea');

        // Toggle emoji picker visibility
        emojiBtn.addEventListener('click', () => {
        emojiPicker.classList.toggle('hidden');
        });

        // Add selected emoji to the textarea
        emojis.forEach(emoji => {
        emoji.addEventListener('click', () => {
            textarea.value += emoji.textContent;
            updateCharacterCount();
            textarea.focus(); // Keep focus on the textarea after inserting emoji
        });
        });

        // Close the emoji picker when clicking outside of it
        document.addEventListener('click', (event) => {
            if (!emojiBtn.contains(event.target) && !emojiPicker.contains(event.target)) {
        emojiPicker.classList.add('hidden');
            }
        });

    // send post
    function sendPost() {

        let text = document.querySelector('textarea').value;
    console.log(text)
    if (text == "") {
        Swal.fire('Error', "Could not submit your post - please add description", 'error');
    return;
            }

    let userId = JSON.parse(localStorage.getItem("loginUserDetails")).userId;
    let image = imageLink;
    let date = new Date().toJSON();
    date = date.split("T")[0];

    if (image == "") {

        let formDataTextToImage = new FormData();
    formDataTextToImage.append('file', currentImageBlob, `generated-image${userId}-${date}-${imageCounter++}.png`);

    $.ajax({
        type: "POST",
    url: uploadFilesAPI + "/upload",
    contentType: false,
    processData: false,
    async: false,
    data: formDataTextToImage,
    success: showImage,
    error: errorR
                });


    ajaxCallSync("POST", clubBooksAPI + `/addNewPost?clubId=${currentClub.ClubId}&userId=${userId}&description=${text}&image=${imageLink}`, null, successToPost, errorToPost);

            }
    else {
        ajaxCall("POST", clubBooksAPI + `/addNewPost?clubId=${currentClub.ClubId}&userId=${userId}&description=${text}&image=${image}`, null, successToPost, errorToPost);
            }
    imageLink = "";
        }
    function successToPost() {
        Swal.fire("Post Was Published!");
    $(".add-post-image").attr("src", "");
    imageLink = "";
    imageBlob = "";
    $("#comment").val("");
    $(".add-image-btn").removeAttr("disabled");
    loadPosts(currentClub.ClubId);
        }
    function errorToPost(error) {
            if (error.status == 401) {

        logoutUser('endSession');
            }
    else {
        Swal.fire('Error', "Could not submit your post - please try again later", 'error');
            }
        }

    // add like to post
    let currentLikeDiv;

    function postLike(userId, postId, likeBtn, likeDiv) {
        currentLikeBtn = likeBtn;
    currentLikeDiv = likeDiv;
    ajaxCall("PUT", clubBooksAPI + `/addLikeToPost?postId=${postId}&userId=${userId}`, null, successToLike, errorLike)
        }
    function successToLike() {

        // add 1 more like to the post
        let oldLikeNum = Number(currentLikeDiv.querySelector('span').innerHTML);

    currentLikeDiv.querySelector('span').innerHTML = oldLikeNum + 1;

    currentLikeBtn.classList.add("liked");
    currentLikeBtn.disabled = true;
        }
    function errorLike(error) {
            if (error.status == 401) {

        logoutUser('endSession');
            }
    else {
        Swal.fire('Error', "Could not submit your like - please try again later", 'error');
            }
        }
    function addImageToPost() {

            const fileInput = document.querySelector('.image-input');

    fileInput.click();

    fileInput.addEventListener('change', function () {
                const Data = new FormData();
    const files = $("#uploadImage").get(0).files;

                // Add the uploaded file to the form data collection
                if (files.length > 0) {
                    for (let f = 0; f < files.length; f++) {
        Data.append("files", files[f]);
                    }
    // Ajax upload  
    $.ajax({
        type: "POST",
    url: uploadFilesAPI,
    contentType: false,
    processData: false,
    async: false,
    data: Data,
    success: showImage,
    error: errorR
                    });
                }      
            });
        }

    function showImage(data) {

        imageLink = imageFolder + "/" + data;
    console.log(imageLink)
    $('.add-post-image').show();
    $(".add-post-image").attr("src", imageLink);
    $(".add-image-btn").attr("disabled", "disabled");
        }

    // scroll members
    const scrollContainer = document.querySelector('.scroll-container');

    function scrollLeft() {
        scrollContainer.scrollBy({
            left: -300,  // Adjust the value to control scroll amount
            behavior: 'smooth'
        });
        }

    function scrollRight() {
        scrollContainer.scrollBy({
            left: 300,  // Adjust the value to control scroll amount
            behavior: 'smooth'
        });
        }
