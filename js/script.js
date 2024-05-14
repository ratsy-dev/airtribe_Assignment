// Sample questions. DONT touch this data
const questions = [
 {
  text: "Which language is primarily used for web app development?",
  options: ["C#", "Python", "JavaScript", "Swift"],
  correct: 2,
 },
 {
  text: "Which of the following is a relational database management system?",
  options: ["Oracle", "Scala", "Perl", "Java"],
  correct: 0,
 },
 {
  text: "What does HTML stand for?",
  options: [
   "Hyperlink and Text Markup Language",
   "High Technology Modern Language",
   "Hyper Text Markup Language",
   "Home Tool Markup Language",
  ],
  correct: 2,
 },
 {
  text: "What does CSS stand for?",
  options: [
   "Cascading Stylesheets",
   "Cascading Styling Styles",
   "Cascading Sheets for Stylings",
   "Cascaded Stylesheets",
  ],
  correct: 0,
 },
 {
  text:
   "Which of the following is not an object-oriented programming language?",
  options: ["Java", "C#", "Scala", "C"],
  correct: 3,
 },
 {
  text: "Which tool is used to ensure code quality in JavaScript?",
  options: ["JSLint", "TypeScript", "Babel", "Webpack"],
  correct: 0,
 },
 {
  text: "What is the primary use of the Git command 'clone'?",
  options: [
   "To stage changes",
   "To copy a repository",
   "To switch to a different branch",
   "To list all the files in a repository",
  ],
  correct: 1,
 },
 {
  text: "What does API stand for in the context of programming?",
  options: [
   "Apple Pie Interface",
   "Application Programming Interface",
   "Advanced Peripheral Integration",
   "Application Process Integration",
  ],
  correct: 1,
 },
 {
  text: "Javascript is a single threaded programming language",
  options: ["True", "False"],
  correct: 0,
 },
 {
  text: "API calls in Javascript can be done using the following method",
  options: ["setTimeout()", "setInterval()", "fetch()", "get()"],
  correct: 2,
 },
];

let currentQuestionIndex = 0;
let correctAns = 0;

function isAnyOptionSelected() {
 const radioButtons = document.querySelectorAll('input[type="radio"]');
 for (const radioButton of radioButtons) {
  if (radioButton.checked) {
   return true;
  }
 }
 return false;
}

function updateButtonState() {
 const submitButton = document.getElementById("submit");

 const anyOptionSelected =
  document.querySelector('input[type="radio"]:checked') !== null;

 submitButton.disabled = !anyOptionSelected;
}

function loadQuestion(questionIndex, correctAnswer) {
 if (questionIndex < 10) {
  const questionContainer = document.getElementById("question");

  const answerList = document.getElementById("answer-list");

  questionContainer.textContent = "";
  answerList.innerHTML = "";

  const currentQuestion = questions[questionIndex];

  questionContainer.textContent = currentQuestion.text;

  currentQuestion.options.forEach((option, index) => {
   const optionContainer = document.createElement("div");
   optionContainer.style.marginBottom = "16px";

   const radioInput = document.createElement("input");
   radioInput.setAttribute("type", "radio");
   radioInput.setAttribute("name", "answer");
   radioInput.setAttribute("value", index);
   radioInput.style.marginRight = "8px";

   const label = document.createElement("label");
   label.textContent = option;
   label.setAttribute("for", `option${index}`);

   optionContainer.appendChild(radioInput);
   optionContainer.appendChild(label);

   answerList.appendChild(optionContainer);

   label.addEventListener("click", () => {
    radioInput.click();
   });

   const radioButtons = document.querySelectorAll('input[type="radio"]');
   radioButtons.forEach((radioButton) => {
    radioButton.addEventListener("change", updateButtonState);
   });
  });
 } else {
  const nextButton = document.getElementById("next");
  nextButton.disabled = true;
  alert(`You scored ${correctAnswer} / 10`);
  window.location.reload();
 }
}

const submitButton = document.getElementById("submit");
submitButton.disabled = true;
const nextButton = document.getElementById("next");
nextButton.disabled = true;

submitButton.addEventListener("click", () => {
 const selectedRadioButton = document.querySelector(
  'input[type="radio"]:checked'
 );

 if (selectedRadioButton) {
  const selectedLabel = selectedRadioButton.parentElement;

  const selectedOptionIndex = parseInt(selectedRadioButton.value);

  const correctOptionIndex = questions[currentQuestionIndex].correct;

  if (selectedOptionIndex === correctOptionIndex) {
   selectedLabel.style.backgroundColor = "#2dfe54";
   correctAns = correctAns + 1;
  } else {
   selectedLabel.style.backgroundColor = "red";
  }

  const radioButtons = document.querySelectorAll(
   '#answer-list input[type="radio"]'
  );

  radioButtons.forEach((radioButton) => {
   if (parseInt(radioButton.value) === correctOptionIndex) {
    const correctLabel = radioButton.parentElement;

    if (correctLabel) {
     correctLabel.style.backgroundColor = "#2dfe54";
    }
   }
  });
 }

 submitButton.disabled = true;
 nextButton.disabled = false;
});

nextButton.addEventListener("click", () => {
 submitButton.disabled = true;
 nextButton.disabled = true;

 if (currentQuestionIndex < questions.length) {
  loadQuestion(currentQuestionIndex + 1, correctAns);
  currentQuestionIndex++;
 }
});

loadQuestion(0, 0);
