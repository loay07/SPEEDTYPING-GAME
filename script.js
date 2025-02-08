////timer
function updateDisplay() {
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function startStopwatch() {
  updateDisplay();
  timerInterval = setInterval(() => {
    totalTime++;
    updateDisplay();
  }, 1000);
}
// function to take in spans and turn into words to be able to separate

function wordSpans(spansArray) {
  wrapperFatherElement = document.createElement("div");
  container = document.getElementById("static-sentence");
  container.innerHTML = "";
  spansArray.forEach((span, index) => {
    if (span.textContent === " " || index === spansArray.length - 1) {
      container.appendChild(wrapperFatherElement);
      wrapperFatherElement = document.createElement("div");
    } else {
      wrapperFatherElement.appendChild(span);
    }
  });
  return document.querySelectorAll("#static-sentence div");
}

/// function to calc number of correct whole words
let totalCorrectWords;
let totalCorrectKeystrokes;
let totalKeystrokes;

function calcCorrectWords(wordsArr) {
  totalCorrectKeystrokes = 0;
  totalCorrectWords = 0;
  totalKeystrokes = document.querySelectorAll("#static-sentence span").length;
  wordsArr.forEach((word) => {
    correctWord = true;
    word.querySelectorAll("span").forEach((span) => {
      span.style.color === "rgb(255, 61, 0)"
        ? (correctWord = false)
        : totalCorrectKeystrokes++;
    });
    if (correctWord) totalCorrectWords++;
  });
  return totalCorrectWords;
}

//////////////////////////////////////
let totalTime = 0;
let timerInterval;
/// initializing sentences
let easySent =
  "The little boy ran quickly down the street, laughing with his friends. They played with a ball, kicking it back and forth as they ran.";
let mediumSent =
  "The small dog bounded down the sidewalk, its tail wagging excitedly as it chased after a red ball. The children, giggling, ran behind it, calling for the dog to return the ball.";
let hardSent =
  "A spirited young terrier dashed across the cobblestone path, its fur gleaming under the fading light, as it pursued the scarlet ball with unbridled enthusiasm. The children, their faces alight with joy, followed in eager pursuit, their laughter echoing through the quiet street, as they tried to coax the dog into releasing its prized possession.";

// testarr = createSpan(easySent);
// console.log(calcCorrectWords(wordSpans(testarr)));
////// important containers
const winnerContainer = document.querySelector(".winner");
const gameContainer = document.querySelector(".text-display");
const timerDisplay = document.getElementById("timer");
/////////////////// difficulty part
const overlay = document.querySelector(".overlay");
const startModal = document.querySelector(".start");
const difficultyBtns = document.querySelectorAll(".difficulty");
//on load
overlay.classList.remove("hidden");
startModal.classList.remove("hidden");
gameContainer.classList.remove("hidden");
timerDisplay.classList.remove("hidden");
//// i need to initialize 'splittedSentence',
// 'letterNo', 'currentSpansArr'. to use them as global variables
let sentence;
let splittedSentence;
let letterNo;
let currentSpansArr;

let begin = false;
difficultyBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    startModal.classList.add("hidden");
    begin = true;
    currentDifficulty = btn.classList[0];
    if (currentDifficulty === "easy") {
      sentence = easySent;
    }
    if (currentDifficulty === "medium") {
      sentence = mediumSent;
    }
    if (currentDifficulty === "hard") {
      sentence = hardSent;
    }
    document.getElementById("static-sentence").textContent = sentence;
    splittedSentence = sentence.split("");
    letterNo = splittedSentence.length;
    currentSpansArr = createSpan(sentence);
    currentSpansArr[0].style.backgroundColor = "#FFED29";
  });
});

//splitting each letter into a span to be able to highlight

function createSpan(sent) {
  container = document.getElementById("static-sentence");
  container.innerHTML = "";
  sent.split("").forEach((letter) => {
    const span = document.createElement("span");
    span.textContent = letter;
    container.appendChild(span);
  });
  const spans = document.querySelectorAll("#static-sentence span");
  return spans;
}

// function to compare the two letters

function changeColor(correct, index, spansArr) {
  spansArr[index].style.color = correct ? "#4CAF50" : "#FF3D00";
}

// function to restart game
function restart() {
  window.location.reload(true);
}
// function to display results
// queries
const wpmScore = document.querySelector(".wpm-replace");
const accuracyScore = document.querySelector(".accuracy-replace");
const finalScore = document.querySelector(".final-replace");
const timeDisplay = document.querySelector(".time-replace");
const wordsDisplay = document.querySelector(".correct-replace");

function displayResults(wpm, accuracy, final, correctWords, elapsedTime) {
  wpmScore.textContent = wpm;
  accuracyScore.textContent = `${accuracy}%`;
  finalScore.textContent = final;
  timeDisplay.textContent = `${elapsedTime}s`;
  wordsDisplay.textContent = correctWords;
}
/// whole game logic
let index = -1;
//key press listener///////////////////

window.addEventListener("keypress", function (e) {
  e.preventDefault();
  if (begin === true) {
    if (index === -1) startStopwatch(); //start game
    buttonClicked = e.key;
    /// checking if game hasnt ended
    if (index !== letterNo) {
      index++;
      /// updating highlighted letter
      if (index !== letterNo - 1) {
        currentSpansArr[index].style.backgroundColor = "#ffffff20";
        currentSpansArr[index + 1].style.backgroundColor = "#FFED29";
      }
      /// check if letter is correct
      if (buttonClicked === splittedSentence[index]) {
        correct = true;
      } else {
        correct = false;
      }
      changeColor(correct, index, currentSpansArr);
    }

    //checking if game end to outro

    if (index === letterNo - 1) {
      begin = false;
      clearInterval(timerInterval);
      elapsedTime = totalTime / 60;
      correctWords = calcCorrectWords(wordSpans(currentSpansArr));
      accuracy = totalCorrectKeystrokes / totalKeystrokes;
      accuracyPercent = Math.floor(accuracy * 100);
      wpm = Math.floor(correctWords / elapsedTime);
      final = Math.floor(accuracy * wpm);
      gameContainer.classList.add("hidden");
      timerDisplay.classList.add("hidden");
      winnerContainer.classList.remove("hidden");
      displayResults(wpm, accuracyPercent, final, correctWords, totalTime);
      animateScores();
    }
  }
});
//// backspace listener and logic
window.addEventListener("keydown", function (e) {
  if (
    e.key === "Backspace" &&
    index !== -1 &&
    index !== letterNo &&
    begin === true
  ) {
    currentSpansArr[index].style.color = "#00000076";
    currentSpansArr[index + 1].style.backgroundColor = "#ffffff00";
    currentSpansArr[index].style.backgroundColor = "#FFED29";
    index--;
  }
});

// restart button
document.querySelector(".replay").addEventListener("click", restart);

////////////// animations////////////////
const scores = document.querySelectorAll(".score");
function animateScores() {
  scores.forEach((score, index) => {
    setTimeout(() => {
      score.classList.add("slide-in");
    }, index * 500);
  });
}
console.log(scores[0].classList);
