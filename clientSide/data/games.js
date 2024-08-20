// JavaScript source code

const gameAPI = "https://localhost:7225/api/Score";
const booksAPI = "https://localhost:7225/api/Books";
const authorsAPI = "https://localhost:7225/api/Authors";
let gameName;
let allBooks = [];
let wordList = [];
let allAuthors = [];

    $(document).ready(function () {

    getBooks();
    loadAuthors();
    $('.playBtn').click(openGame)
    $('.closeGameButton').click(closeGame);
    $(".btn-next-back").hide();
    $(".btn-back").hide();
    $(".btn-back").click(backQuestion);
    $(".btn-next").click(nextQuestion);
    $(".clear-ans-btn").click(clearAnswersCheckBox);
    $(".start-quiz").click(startQuiz)
    });

    function loadAuthors() {
            if (allAuthors.length == 0) {
        ajaxCall("GET", authorsAPI, null, SuccessLoadAuthors, errorLoadAuthors);
            }
        }


    function SuccessLoadAuthors(authors) {
        allAuthors = authors;
        }



    function errorLoadAuthors(error) {
        console.log('Error loading authors:', error);
        }
    function getBooks() {
            if (allBooks.length == 0) {
        ajaxCall("GET", booksAPI, null, getAllBooks, errorToLoadBooks);
            }
        }

    function getAllBooks(books) {
        allBooks = books;
    for (let i = 0; i < books.length; i++) {
        wordList.push(books[i].Title);
            }
        }

    function errorToLoadBooks() {
        console.error("The books could not be loaded.");
        }

function closeGame()
{
    $('#games').removeClass('active');
    $('#overlay').removeClass('active');
    clearHangMan();
    closeQuiz();
 
  }
    function openGame() {
    gameName = $(this).attr('id');
    $('#games').addClass('active');
    $('#overlay').addClass('active');

    console.log(gameName);
    switch (gameName) {
                case 'HangMan':
    {
       $('#container-quiz').hide()
       $('#container-Memorybody').hide()
         $('#container-hangMan').show()
    startHangManGame();
                    }
    break;
    case 'MemoryGame':
    {
       $('#container-quiz').hide()
      $('#container-Memorybody').show()
         $('#container-hangMan').hide()
    startMemoryGame();

                    }
    break;
    case 'BookQuiz': {
        $('#container-quiz').show()
                    $('#container-Memorybody').hide()
    $('#container-hangMan').hide()
    createQuiz();
                }
    break;
            }

    }


// Memory Game
let victoryTime = null;
let victoryAttempts = null;
let gameCards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let matches = 0;
let timer = null;
let time = 0;

function startMemoryGame() {
    $(".game-container" ).show();
    resetGame();
    createMemoryCards();
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameCards.forEach((card) => {
        const cardElement = createCardElement(card);
        gameBoard.appendChild(cardElement);
    });
    startTimer();
}

function createMemoryCards() {
    const selectedBooks = allBooks.sort(() => Math.random() - 0.5).slice(0, 4);
    gameCards = [];
    selectedBooks.forEach(book => {
        // Add cover card
        gameCards.push({ ...book, type: 'cover' });
        // Add author card
        gameCards.push({ ...book, type: 'author' });
    });
    gameCards.sort(() => Math.random() - 0.5);
}

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.classList.add('col-new-2');
    cardElement.dataset.name = card.Title;
    cardElement.dataset.type = card.type;
    cardElement.dataset.AuthorName = card.FirstAuthorName;

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');

    // Set the front side content
    if (card.type === 'cover') {
        cardFront.style.backgroundImage = `url(${card.SmallThumbnail})`;
        cardFront.style.backgroundSize = 'cover';
    } else if (card.type === 'author') {
        cardFront.style.backgroundColor = '#e6e6e6';
        cardFront.style.color = '#333';
        cardFront.style.display = 'flex';
        cardFront.style.justifyContent = 'center';
        cardFront.style.alignItems = 'center';
        cardFront.innerText = card.FirstAuthorName || "Unknown Author";
    }

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');

    cardElement.appendChild(cardFront);
    cardElement.appendChild(cardBack);

    cardElement.addEventListener('click', flipCard);
    return cardElement;
}


function flipCard() {
    if (lockBoard || this.classList.contains('flip') || (firstCard && secondCard)) return;

    this.classList.add('flip');

    if (!firstCard) {
        firstCard = this;
        console.log('First card set:', firstCard);
        return;
    }

    secondCard = this;
    console.log('Second card set:', secondCard);

    checkForMatch();
}

function checkForMatch() {
    if (!firstCard || !secondCard)
    {
        console.error("One or both cards are missing!", { firstCard, secondCard });
        resetBoard();
        return;
    }

    console.log('Checking match for:', firstCard.dataset.name, secondCard.dataset.name);

    const isMatch = firstCard.dataset.AuthorName === secondCard.dataset.AuthorName;
    const isCardAndAuthor = firstCard.dataset.type !== secondCard.dataset.type;
    console.log(isCardAndAuthor, firstCard.dataset.type, secondCard.dataset.type)
    if (isMatch && isCardAndAuthor)
    {
        disableCards();
        if (firstCard)
        {
            console.log('Adding correct class to first card');
            firstCard.classList.add('correct');
        }
        if (secondCard)
        {
            console.log('Adding correct class to second card');
            secondCard.classList.add('correct');
        }
        // Display message for correct match
        Swal.fire({
            icon: 'success',
            title: 'Good',
            text: 'you find a match!',
            timer: 1000,
            showConfirmButton: false
        });
    }
    else {
        unflipCards();
    }

    attempts++;
    document.getElementById('attempts').textContent = attempts;

    if (matches === gameCards.length / 2) {
        victoryTime = time;
        victoryAttempts = attempts
        let gameResult="";
        let user = JSON.parse(localStorage.getItem('loginUserDetails'));
        if (user != null) {
           
            gameResult = {
                "gameName": "MemoryCard",
                "userName": user.userName,
                "scoreNum": (100 - victoryAttempts),
                "time": victoryTime.toString()
            }
            postGameReasults(gameResult);
            getTop5GameReasults("MemoryCard");
        }
        else {
            gameResult = {
                "gameName": "MemoryCard",
                "userName": "",
                "scoreNum": (100 - victoryAttempts),
                "time": victoryTime.toString()
            }
            console.log(gameResult);
            postGameReasults(gameResult);
            getTop5GameReasults("MemoryCard");
        }
    }
}


function disableCards() {
    if (firstCard && secondCard) {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matches++;
        resetBoard();
    }
}

function unflipCards() {
    if (firstCard && secondCard) {
        lockBoard = true;
        setTimeout(() => {
            if (firstCard && secondCard) {
                firstCard.classList.remove('flip');
                secondCard.classList.remove('flip');
            }
            resetBoard();
        }, 1500);
    }
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function startTimer() {
    time = 0;
    document.getElementById('time').textContent = time;
    timer = setInterval(() => {
        time++;
        document.getElementById('time').textContent = time;
    }, 1000);
}


function resetGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    firstCard = secondCard = null;
    lockBoard = false;
    attempts = matches = time = 0;
    document.getElementById('attempts').textContent = attempts;
    document.getElementById('time').textContent = time;
    clearInterval(timer);
}

// HangMan
let choosenWord = "";
let incorrectGuess = [];
let correctGuess = [];
const maxIncorrectGuesses = 7;
const attemptHangMan = 0;

function showIncorrectPhotos() {
    const container = document.getElementById('image-container');
    switch (incorrectGuess.length) {
        case 1:
            container.innerHTML = hmPicture0;
            break;
        case 2:
            container.innerHTML = hmPicture1;
            break;
        case 3:
            container.innerHTML = hmPicture2;
            break;
        case 4:
            container.innerHTML = hmPicture3;
            break;
        case 5:
            container.innerHTML = hmPicture4;
            break;
        case 6:
            container.innerHTML = hmPicture5;
            break;
        case 7:
            container.innerHTML = hmPicture6;
            break;
    }
}

function clearHangMan() {
    correctGuess = [];
    incorrectGuess = [];
    document.querySelector('.word-display').innerHTML = '';
    document.getElementById('image-container').innerHTML = '';
    document.getElementById('row-1').innerHTML = '';
    document.querySelector('.failedGuess').innerHTML =
        `Incorrect guesses: <b></b><br />`;
   
}

function startHangManGame() {
    $('.game-box').show();
    choosenWord = pickRandomWord(wordList).toUpperCase();
    createAlphabetButtons();
    displayWord();
}

function pickRandomWord(array) {
    let randomIndex = Math.floor(Math.random() * array.length);
    console.log(array[randomIndex]);
    return array[randomIndex];
}

// create keyboard
function createAlphabetButtons() {
    const row1 = document.getElementById('row-1');
    //const row2 = document.getElementById('row-2');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < alphabet.length; i++) {
        let letter = alphabet[i];
        let divBtn = document.createElement('div');
        divBtn.classList.add('col-lg-1');
        divBtn.classList.add('col-2');
        let button = document.createElement('button');
        divBtn.appendChild(button);
        button.innerText = letter;
        button.id = 'button-' + letter;

        // Add click event listener to the button
        button.addEventListener('click', function () {
            handleGuess(letter);
            this.setAttribute("disabled", "disabled")
            this.style.backgroundColor = 'grey';
            this.style.cursor = 'not-allowed';

        });
        row1.appendChild(divBtn); // First 13 letters go to row 1

        //// Append button to the appropriate row
        //if (i < 13) {
        //    row1.appendChild(button); // First 13 letters go to row 1
        //} else {
        //    row2.appendChild(button); // Last 13 letters go to row 2
        //}
    }
}



//updates the display of the letters being guessed and showing correctly guessed letters
function displayWord() {
    const wordDisplay = document.querySelector('.word-display');
    wordDisplay.innerHTML = '';

    for (let i = 0; i < choosenWord.length; i++) {
        let span = document.createElement('span');
        span.className = 'letter';
        if (choosenWord[i] == ' ') {
            span.innerText = ' ';
        }
        else if (choosenWord[i] == ',') {
            span.innerText = ',';
        }
        else if (choosenWord[i] == ':') {
            span.innerText = ':';
        }
        else if (choosenWord[i] == '#') {
            span.innerText = '#';
        }
        else if (choosenWord[i] == '!') {
            span.innerText = '!';
        }
        else if (choosenWord[i] == '(') {
            span.innerText = '(';
        }
        else if (choosenWord[i] == ')') {
            span.innerText = ')';
        }
        else if (choosenWord[i] == 1) {
            span.innerText = 1;
        }
        else if (choosenWord[i] == 2) {
            span.innerText = 2;
        }
        else if (choosenWord[i] == 3) {
            span.innerText = 2;
        }
        else if (choosenWord[i] == 4) {
            span.innerText = 2;
        }
        else if (choosenWord[i] == 5) {
            span.innerText = 2;
        }
        else if (choosenWord[i] == 6) {
            span.innerText = 2;
        }
        else if (choosenWord[i] == 7) {
            span.innerText = 2;
        }
        else if (choosenWord[i] == 8) {
            span.innerText = 2;
        }
        else if (choosenWord[i] == 9) {
            span.innerText = 2;
        }

        else {
            span.innerText = correctGuess.includes(choosenWord[i]) ? choosenWord[i] : '_';
        }
        wordDisplay.appendChild(span);
    }
}

//chhose what to do in winning\ looseing situation
function handleGuess(letter) {
   
    const incorrectGuessDisplay = document.querySelector('.failedGuess b');
    if (choosenWord.includes(letter)) {
        for (let i = 0; i < choosenWord.length; i++) {
            correctGuess.push(letter);
        }
        
        displayWord();
        checkWin();
        
    } else {
        incorrectGuess.push(letter);
        incorrectGuessDisplay.innerText = incorrectGuess.join(', ');
        showIncorrectPhotos();
        
        checkLoss();
    }

}


//check if the user win
function checkWin() {
    let allGuessed = choosenWord.split('').every(letter => {
        return letter == ' ' || letter == ',' || letter == ':' || letter == '#' || letter == '!' || letter == ')' || letter == '(' || letter == '1' || letter == '2' || letter == '3' || letter == '4' || letter == '5' || letter == '6' || letter == '7' || letter == '8' || letter == '9' || correctGuess.includes(letter);
    });
    if (allGuessed) {
        getScore(incorrectGuess);
        Swal.fire('Congratulations!', 'You guessed the word!', 'success');
    }

}

//check if the user loss

function checkLoss() {
    if (incorrectGuess.length >= maxIncorrectGuesses) {
        Swal.fire('Game Over', `The correct word was: ${ choosenWord }`);
    }
}

function getScore(incorrectGuess) {
    let finalScore = 100 - incorrectGuess;
    let user = JSON.parse(localStorage.getItem("loginUserDetails"));
    let game = "HangMan";

    if (user != null)
    {

        gameResult = {
            "gameName": game,
            "userName": user.userName,
            "scoreNum": finalScore,
            "time": ""
        }
        
        postGameReasults(gameResult);
        getTop5GameReasults("HangMan");
    }
    else {
        gameResult = {
            "gameName": game,
            "userName":"",
            "scoreNum": finalScore,
            "time": ""
        }
       
        postGameReasults(gameResult);
        getTop5GameReasults("HangMan");
    }
   
}

//quiz
// JavaScript source code

let gameScore = 0;
let questions = ['Who is the author of the book', 'When was the book'];
let numOFQuestion = 0;
const NUMOFQ = 4;
const NUMOFA = 4;
const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
let finalQuiz = [];
let userQuizAnswers = [];
let QuizCorrectAnswers = [];
let questionNumInQuiz = 0;
let topGameResults = [];


function shuffle(array) {
    let index = array.length - 1;

    while (index != 0) {

        let randomIndex = randomIntegerInRange(0, index);

        if (randomIndex != undefined) {
            [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
            index--;
        }
    }

    return array;
}


function generateAnswers(correctBook, questionInfo) {
    let Answers = [];
    Answers.push(correctBook[questionInfo]);

    while (Answers.length < NUMOFA) {
        let randomBookIndex = randomIntegerInRange(0, allBooks.length - 1);
        let wrongAnswer = (allBooks[randomBookIndex])[questionInfo];

        if (Answers.indexOf(wrongAnswer) == -1) {
            Answers.push(wrongAnswer);
        }
    }
    console.log(Answers)
    return Answers;
}

function createQuiz() {
    while (numOFQuestion++ < NUMOFQ) {
        let questionHTML = "";
        let chooseRandomQuestion = randomIntegerInRange(0, questions.length - 1);
        let generateRandomBook = allBooks[randomIntegerInRange(0, allBooks.length - 1)];
        let answerRandomIndex = shuffle([0, 1, 2, 3])
        let index = 0;

        switch (questions[chooseRandomQuestion]) {
            case 'Who is the author of the book':
                {
                    let Answers = generateAnswers(generateRandomBook, 'FirstAuthorName');
                    QuizCorrectAnswers[numOFQuestion - 1] = Answers[0];
                    questionHTML += "<div class='question'><div class='question-" + numOFQuestion + " w-100 clear-Q-div'>" +
                        "<h5 class='pink'>" + questions[chooseRandomQuestion] + " '" + generateRandomBook.Title + "'?</h5></div><div class='answers'>"

                    Answers.forEach((ans) => {
                        let answer = Answers[answerRandomIndex[index++]];

                        if (answer == undefined) { } // do nothing
                        else {
                            questionHTML += " <div class='form-check'>" +
                                "<input class='form-check-input' type='checkbox' value='" + answer + "' name='answer'>" +
                                "<label class='form-check-label' for='answer'>" + answer + "</label> </div>";
                        }
                    })
                    questionHTML += "<button class='btn btn-outline-dark btn-block pinkB clear-ans-btn my-sm-0' onclick='clearAnswersCheckBox()'>Clear</button></div></div>";
                    finalQuiz.push(questionHTML);
                    break;
                }
            case 'When was the book':
                {
                    let Answers = generateAnswers(generateRandomBook, 'PublishDate');
                    QuizCorrectAnswers[numOFQuestion - 1] = Answers[0];

                    questionHTML += "<div class='question'><div class='question-" + numOFQuestion + " w-100 clear-Q-div'>" +
                        "<h5 class='pink'>" + questions[chooseRandomQuestion] + " '" + generateRandomBook.Title + "' published?</h5></div><div class='answers'>"

                    Answers.forEach((ans) => {
                        let answer = Answers[answerRandomIndex[index++]];

                        if (answer == undefined) { } // do nothing
                        else {
                            questionHTML += " <div class='form-check'>" +
                                "<input class='form-check-input' type='checkbox' value='" + answer + "' name='answer'>" +
                                "<label class='form-check-label' for='answer'>" + answer + "</label> </div>";
                        }
                    })
                    questionHTML += "<button class='btn btn-outline-dark btn-block pinkB clear-ans-btn my-sm-0' onclick='clearAnswersCheckBox()'>Clear</button></div></div>";
                    finalQuiz.push(questionHTML);
                    break;
                }
        }

    }

    numOFQuestion = 0;
}

var intervalId; // to stop the intervals

function closeQuiz() {
    console.log("hey");
    clearInterval(intervalId); // stop th interval
    $(".question").remove();
    $("#quiz-container").removeClass('active');
    $(".quis-instruction").show();
    $(".start-quiz").show();
    $('.timer').html(" ");
    $(".btn-next-back").hide();
    $(".btn-back").hide();
    document.getElementById("questionContainer").innerHTML = "";
    questionNumInQuiz = 0;
    finalQuiz = [];
    $('.timer').removeClass('bold');
    $('.timer').removeClass('pink');
    $('.resultContainer').html("");
    $('#overlay').removeClass('active');
}
function startQuiz() {
    let quizTimer = 60;

    $(".quis-instruction").hide();
    $(".start-quiz").hide();

    intervalId = setInterval(() => {

        $('.timer').html(quizTimer--)

        if (quizTimer < 15) { $('.timer').addClass('pink'); }
        if (quizTimer < 10) { $('.timer').addClass('bold'); }
        if (quizTimer < 0) {
            clearInterval(intervalId); // stop th interval

            let correctAns = checkQuizResults();

            getTop5GameReasults('BookQuiz');

            $(".question").remove();
            document.getElementById("questionContainer").innerHTML += "<h1>Times Up - Game Over</h1>";
            document.getElementById("questionContainer").innerHTML += "<h3>you had " + correctAns + " correct answers!</h3>";
            $(".btn-next-back").hide();

        }

    }, 1000);

    showQuestion(questionNumInQuiz);

    $(".btn-next-back").show();
}
function showQuestion(indexQuestionToShow) {

    if (indexQuestionToShow == NUMOFQ) {  //end quiz//

        clearInterval(intervalId); // stop th interval
        let timer = document.querySelector(".timer").innerHTML
        document.querySelector(".timer").innerHTML = "Final time: " + timer;

        let correctAns = checkQuizResults();

        getTop5GameReasults('BookQuiz');

        document.getElementById("questionContainer").innerHTML += "<h1>Game Over</h1>";
        document.getElementById("questionContainer").innerHTML = "you had " + correctAns + " correct answers!";
        $(".btn-next-back").hide();

    }

    else {

        if (indexQuestionToShow == 0) { $(".btn-back").hide(); }

        document.getElementById("questionContainer").innerHTML = finalQuiz[indexQuestionToShow];
        enableSingleCheckbox();
    }
}
function nextQuestion() {

    // Get the checked radio button with a specific name
    var checkedRadio = $('input[name="answer"]:checked');

    // Check if a radio button is checked and get the user answer
    if (checkedRadio.length) {
        userQuizAnswers[questionNumInQuiz] = checkedRadio.val();
    }

    finalQuiz[questionNumInQuiz] = document.querySelector(".question").outerHTML; // set the user choise

    $(".question").remove();

    showQuestion(++questionNumInQuiz);

    $(".btn-back").show();
}
function backQuestion() {

    $(".question").remove();

    showQuestion(--questionNumInQuiz);
}

function enableSingleCheckbox() {
    // Listen for checkbox changes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {

            checkboxes.forEach(chk => {

                if (chk !== checkbox && checkbox.checked) {
                    chk.disabled = true;
                } else {
                    chk.disabled = true;
                    chk.setAttribute("checked", "checked");
                }
            });
        });
    });
}
function clearAnswersCheckBox() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.disabled = false;
        checkbox.checked = false;
        checkbox.removeAttribute("checked");
    })

}
function checkQuizResults() {
    let index = 0;
    let numOfCorrectAns = 0;
    let gameResult;
    let user = JSON.parse(localStorage.getItem('loginUserDetails'));

    while (index < NUMOFA) {
        if (userQuizAnswers[index] == QuizCorrectAnswers[index]) { numOfCorrectAns++ }
        index++;
    }

    if (user != null) {
        gameResult = {
            "gameName": "BookQuiz",
            "userName": user.userName,
            "scoreNum": numOfCorrectAns,
            "time": ($('.timer').html()).split(" ")[2]
        }
    }
    else {
        gameResult = {
            "gameName": "BookQuiz",
            "userName": "",
            "scoreNum": numOfCorrectAns,
            "time": ($('.timer').html()).split(" ")[2]
        }
    }

    postGameReasults(gameResult);
    return numOfCorrectAns;
}
function getTop5GameReasults(gameName) {
    ajaxCallSync("GET", gameAPI + `?gameName=${gameName}`, null, successTop5, errorTop5);
}
function successTop5(topResult) {
    topGameResults = topResult;
    let html = "<h3>Top Results</h3>";
    let index = 1;

    topGameResults.forEach((r) => {
        
        if (index == 1) {
            if (gameName = 'HangMan') {
                html += `<p>${index++}. <strong class='pink'>User: ${r.userName} score: ${r.scoreNum}</strong> `

            }
            else {
                html += `<p>${index++}. <strong class='pink'>User: ${r.userName} time: ${r.time} score: ${r.scoreNum}</strong> `
            }
        }
        else {
            if (gameName = 'HangMan') { html += `<p>${index++}. User: ${r.userName} score: ${r.scoreNum} ` }
            else {
                html += `<p>${index++}. User: ${r.userName} time: ${r.time} score: ${r.scoreNum} `
            }
        }
    })
    $('.game-container').hide();
    $('.game-box').hide();
    $('.resultContainer').show();
    $('.resultContainer').html(html);
}
function errorTop5(err) { console.log(err); }

function postGameReasults(gameResult) {
    ajaxCallSync("POST", gameAPI, JSON.stringify(gameResult), successPost, errorTop5);
}
function successPost(status) {
    console.log(status)
}
///
function showBooks() { };
function showMyBooks() { };
function closeBookInfo() { };