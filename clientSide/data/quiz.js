// JavaScript source code
//for the homepage quiz

const authorsAPI = "https://localhost:7225/api/Authors";
const gameAPI = "https://localhost:7225/api/Score";

let gameScore = 0;
let allAuthors = [];
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

$(document).ready(function () {
    loadAuthors();
    $("#show-quiz").click(showQuiz);
    $(".closeQuizButton").click(closeQuiz);
    $(".start-quiz").click(startQuiz);
    $(".btn-next-back").hide();
    $(".btn-back").hide();
    $(".btn-back").click(backQuestion);
    $(".btn-next").click(nextQuestion);
    $(".clear-ans-btn").click(clearAnswersCheckBox);
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


function loadAuthors() {
    if (allAuthors.length == 0) {
        ajaxCall("GET", authorsAPI, null, SuccessLoadAuthors, errorLoadAuthors);
    }
}


function SuccessLoadAuthors(authors) {
    allAuthors = authors;
}

function errorLoadBooks(error) {
    console.log(error);
    Swal.fire('Error loading books. Please check the server connection.');
}

function errorLoadAuthors(error) {
    console.log('Error loading authors:', error);
    Swal.fire('Error loading authors. Please check the server connection.');
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
function showQuiz() {
    $("#quiz-container").addClass('active');
    $('#overlay').addClass('active');
    createQuiz();
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
    $(".end-quiz").html("");
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
            $(".end-quiz").html("<button class='btn btn-outline-dark btn-block pinkB my-sm-0' onclick='closeQuiz()'>End</button>");
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
        $(".end-quiz").html("<button class='btn btn-outline-dark btn-block pinkB my-sm-0' onclick='closeQuiz()'>End</button>");
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
        if (index == 1) { html += `<p>${index++}. <strong class='pink'>User: ${r.userName} time: ${r.time} score: ${r.scoreNum}</strong>` }
        else { html += `<p>${index++}. User: ${r.userName} time: ${r.time} score: ${r.scoreNum}` }
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