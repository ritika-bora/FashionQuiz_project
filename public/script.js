const questions = [
  {
    question: "Pick your go-to outfit:",
    answers: [
      { text: "Hoodie and sneakers", style: "Streetwear" },
      { text: "Floral dress", style: "Vintage" },
      { text: "Blazer and trousers", style: "Chic" }
    ]
  },
  {
    question: "Favorite fashion accessory:",
    answers: [
      { text: "Cap", style: "Streetwear" },
      { text: "Pearl necklace", style: "Vintage" },
      { text: "Designer handbag", style: "Chic" }
    ]
  },
  {
    question: "Choose your color palette:",
    answers: [
      { text: "Neutrals & blacks", style: "Chic" },
      { text: "Bright colors", style: "Streetwear" },
      { text: "Soft pastels", style: "Vintage" }
    ]
  }
];

let currentQuestionIndex = 0;
let scores = { Streetwear: 0, Vintage: 0, Chic: 0 };

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const resultContainer = document.getElementById("result");

function startQuiz() {
  currentQuestionIndex = 0;
  scores = { Streetwear: 0, Vintage: 0, Chic: 0 };
  resultContainer.innerHTML = "";
  nextButton.style.display = "none";
  showQuestion();
}

function showQuestion() {
  let currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  answerButtons.innerHTML = "";

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    button.addEventListener("click", () => selectAnswer(answer.style));
    answerButtons.appendChild(button);
  });
}

function selectAnswer(style) {
  scores[style]++;
  nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    nextButton.style.display = "none";
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  questionElement.innerText = "";
  answerButtons.innerHTML = "";
  nextButton.style.display = "none";

  let topStyle = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  resultContainer.innerHTML = `✨ Your style is: <strong>${topStyle}</strong>!`;

  // Save result to backend
  const email = localStorage.getItem("userEmail");
  if (email) {
    fetch("/save-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, result: topStyle })
    });
  }
}

startQuiz();
