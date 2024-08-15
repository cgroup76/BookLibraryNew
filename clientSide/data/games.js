// JavaScript source code
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
let finalScoreMemory;

function updateScoreTable(gameResults) {
    let tableBody = $("table tbody");
    tableBody.empty();

    gameResults.forEach((result, index) => {
        let row = `<tr>
            <td>${index + 1}</td>
            <td>${result.hangManUserName}</td>
            <td>${result.hangManScore}</td>
            <td>${result.memoryGameUserName}</td>
            <td>${result.memoryGameScore}</td>
            <td>${result.quizUserName}</td>
            <td>${result.quizScore}</td>
        </tr>`;

        tableBody.append(row);
    });
}

function postGameResults(gameResult) {
    ajaxCall("POST", gameAPI, gameResult, successPost, errorTop5);
}

function getTop5GameResults(gameName) {
    ajaxCallSync("GET", gameAPI + `?gameName=${gameName}`, null, (topResults) => {
        updateScoreTable(topResults);
    }, errorTop5);
}

function startMemoryGame() {
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
        gameCards.push({ ...book, type: 'cover' });
        gameCards.push({ ...book, type: 'author' });
    });
    gameCards.sort(() => Math.random() - 0.5);
}

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card-memory');
    cardElement.dataset.name = card.Title;
    cardElement.dataset.type = card.type;
    cardElement.dataset.AuthorName = card.FirstAuthorName;

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');

    if (card.type === 'cover') {
        cardFront.style.backgroundImage = `url(${card.SmallThumbnail})`;
        cardFront.style.backgroundSize = 'cover';
    } else if (card.type === 'author') {
        cardFront.style.backgroundColor = '#e6e6e6';
        cardFront.style.color = '#333';
        cardFront.style.display = 'flex';
        cardFront.style.justifyContent = 'center';
        cardFront.style.alignItems = 'center';
        cardFront.style.fontSize = '16px';
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
        return;
    }

    secondCard = this;

    checkForMatch();
}

function checkForMatch() {
    if (!firstCard || !secondCard) {
        resetBoard();
        return;
    }

    const isMatchAuthor = firstCard.dataset.AuthorName === secondCard.dataset.AuthorName;
    const isMatchCover = firstCard.dataset.type !== secondCard.dataset.type;

    if (isMatchAuthor && isMatchCover) {
        console.log(firstCard)
        console.log(secondCard)
        disableCards();
        firstCard.classList.add('correct');
        secondCard.classList.add('correct');
        Swal.fire({
            icon: 'success',
            title: 'Good',
            text: 'You found a match!',
            timer: 1000,
            showConfirmButton: false
        });
    } else {
        unflipCards();
    }

    attempts++;
    document.getElementById('attempts').textContent = attempts;

    if (matches === gameCards.length / 2) {
        victoryTime = time;
        victoryAttempts = attempts;
        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: 'You Win!',
                text: `Attempts: ${ victoryAttempts }, Time: ${ victoryTime } seconds`,
                confirmButtonText: 'New Game',
                showCancelButton: true,
                cancelButtonText: 'Cancel'
            }).then((result) => {
                    if (result.isConfirmed) {
                        startMemoryGame();
                    }
                });
        clearInterval(timer);
    }, 500);
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

function getScore(attempts) {
    let score = 100 - attempts;
    let userName = JSON.parse(localStorage.getItem("loginUserDetails")).userName;
    let game = "MemoryGame";
    let time = null;
    finalScoreMemory = [game, userName, score, time];
    return finalScoreMemory;
}

// HangMan
let choosenWord = "";
let incorrectGuess = [];
let correctGuess = [];
const maxIncorrectGuesses = 7;

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
    document.getElementById('row-2').innerHTML = '';
    document.querySelector('.failedGuess').innerHTML =
        `Incorrect guesses: <b></b><br />`;
    getTop5GameResults('HangMan');
    postGameResults(getScore(incorrectGuess));
}

function startHangManGame() {
    choosenWord = pickRandomWord(wordList).toUpperCase();
    createAlphabetButtons();
    displayWord();
}

function pickRandomWord(array) {
    let randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

// create keyboard
function createAlphabetButtons() {
    const row1 = document.getElementById('row-1');
    const row2 = document.getElementById('row-2');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < alphabet.length; i++) {
        let letter = alphabet[i];
        let button = document.createElement('button');
        button.innerText = letter;
        button.id = 'button-' + letter;

        // Add click event listener to the button
        button.addEventListener('click', function () {
            handleGuess(letter);
            this.setAttribute("disabled", "disabled")
            this.style.backgroundColor = 'grey';
            this.style.cursor = 'not-allowed';

        });

        // Append button to the appropriate row
        if (i < 13) {
            row1.appendChild(button); // First 13 letters go to row 1
        } else {
            row2.appendChild(button); // Last 13 letters go to row 2
        }
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
        return letter == ' ' || letter == ',' || letter == ':' || letter == '#' || letter == '!' || correctGuess.includes(letter);
    });
    if (allGuessed) {
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
    let baseScore = 100;
    let finalScore = baseScore - incorrectGuess * 5;
    let userName = JSON.parse(localStorage.getItem("loginUserDetails")).userName;
    let game = "HangMan";
    let time = null;

    return {
        gameName: game,
        userName: userName,
        scoreNum: finalScore,
        time: time
    };
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
    $('#resultContainer').html("");
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
        if (index == 1) { html += `<p>${index++}. <strong class='pink'>User: ${r.userName} time: ${r.time} score: ${r.scoreNum}</strong> ` }
        else { html += `<p>${index++}. User: ${r.userName} time: ${r.time} score: ${r.scoreNum} ` }
    })

    $('#resultContainer').html(html);
}
function errorTop5(err) { console.log(err); }

function postGameReasults(gameResult) {
    ajaxCallSync("POST", gameAPI + ``, JSON.stringify(gameResult), successPost, errorTop5);
}
function successPost(status) {
    console.log(status)
}
