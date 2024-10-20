// RL quiz system with score penalties and rewards
let currentQuestionIndex = 0;
let score = 0;
let difficultyLevel = 1;  // Simulates adaptive difficulty (could increase if performance is good)
let totalQuestions = 3;   // You can expand this as needed
let rating = 1500;  // ELO-like rating system starts with 1500

// Define topics with questions
const questions = {
  ai: [
    { q: "What is AI?", options: ["Artificial Intelligence", "Automated Input", "Artificial Input", "Auto Intelligence"], correct: 0 },
    { q: "AI technique used for learning?", options: ["Supervised", "Unsupervised", "Reinforcement", "All"], correct: 3 },
    { q: "AI is?", options: ["A branch of Math", "A branch of Engineering", "A branch of Science", "A branch of CS"], correct: 3 },
    { q: "What is AI?", options: ["Artificial Intelligence", "Automated Input", "Artificial Input", "Auto Intelligence"], correct: 0 },
    { q: "Which of the following is a type of AI?", options: ["Weak AI", "Strong AI", "Narrow AI", "All of the Above"], correct: 3 },
    { q: "What is a neural network?", options: ["A type of computer network", "A system inspired by the human brain", "A network of neurons in biology", "A type of social network"], correct: 1 },
    { q: "What does NLP stand for?", options: ["Natural Language Processing", "Neural Language Programming", "Natural Learning Process", "None of the Above"], correct: 0 },
    { q: "Which algorithm is commonly used in AI?", options: ["Decision Trees", "Support Vector Machines", "Neural Networks", "All of the Above"], correct: 3 },
    { q: "What is the Turing Test used for?", options: ["Testing computer memory", "Measuring AI intelligence", "Evaluating computer speed", "Assessing data security"], correct: 1 },
    { q: "Which of these is an application of AI?", options: ["Voice Assistants", "Self-Driving Cars", "Recommendation Systems", "All of the Above"], correct: 3 },
    { q: "What is machine learning?", options: ["A subset of AI that allows systems to learn from data", "Learning how to code", "A type of software development", "None of the Above"], correct: 0 }
  ],
  ml: [
    { q: "Supervised learning uses?", options: ["Labeled Data", "Unlabeled Data", "Both", "Neither"], correct: 0 },
    { q: "Common ML library?", options: ["TensorFlow", "Hadoop", "Spark", "Kafka"], correct: 0 },
    { q: "What is overfitting?", options: ["High bias", "High variance", "Low bias", "None"], correct: 1 },
    { q: "What does ML stand for?", options: ["Machine Learning", "Manual Learning", "Mass Learning", "Major Learning"], correct: 0 },
    { q: "Which of the following is a type of supervised learning?", options: ["K-Means Clustering", "Linear Regression", "DBSCAN", "PCA"], correct: 1 },
    { q: "What is overfitting?", options: ["Model performs well on training data but poorly on unseen data", "Model is too simple", "Model has high bias", "None of the Above"], correct: 0 },
    { q: "What is a common algorithm used for classification?", options: ["K-Nearest Neighbors", "Linear Regression", "Principal Component Analysis", "None of the Above"], correct: 0 },
    { q: "What is the purpose of feature scaling?", options: ["To make sure all features contribute equally", "To reduce dimensionality", "To increase data size", "None of the Above"], correct: 0 },
    { q: "Which library is commonly used for ML in Python?", options: ["NumPy", "Pandas", "Scikit-Learn", "All of the Above"], correct: 3 },
    { q: "What is reinforcement learning?", options: ["Learning from data without supervision", "Learning by interacting with an environment", "Learning through labeled data", "None of the Above"], correct: 1 },
    { q: "Which evaluation metric is commonly used for classification tasks?", options: ["Mean Squared Error", "Accuracy", "R-Squared", "Precision"], correct: 1 }
  ],
  cc: [
    { q: "Which service is IaaS?", options: ["AWS EC2", "Google Drive", "Slack", "Zoom"], correct: 0 },
    { q: "Which service is SaaS?", options: ["Dropbox", "Google Compute Engine", "AWS Lambda", "Azure VMs"], correct: 0 },
    { q: "What is cloud computing?", options: ["On-demand resource", "Database service", "Virtualization", "Edge computing"], correct: 0 },
        { q: "What is Cloud Computing?", options: ["Storing data on local servers", "Storing data on the internet", "A type of software", "None of the Above"], correct: 1 },
        { q: "Which of the following is a Cloud Service Provider?", options: ["Google", "Amazon", "Microsoft", "All of the Above"], correct: 3 },
        { q: "What does IaaS stand for?", options: ["Infrastructure as a Service", "Information as a Service", "Internet as a Service", "Integration as a Service"], correct: 0 },
        { q: "Which of these is an example of SaaS?", options: ["Google Drive", "AWS EC2", "Azure", "Heroku"], correct: 0 },
        { q: "What is a key benefit of cloud computing?", options: ["Reduced IT costs", "Scalability", "Accessibility from anywhere", "All of the Above"], correct: 3 },
        { q: "What is the purpose of virtualization in cloud computing?", options: ["To run multiple OS on a single server", "To increase hardware costs", "To reduce performance", "None of the Above"], correct: 0 },
        { q: "What does PaaS stand for?", options: ["Platform as a Service", "Process as a Service", "Programming as a Service", "Performance as a Service"], correct: 0 },
        { q: "Which of these is a benefit of using a public cloud?", options: ["Complete control over hardware", "High costs", "Increased scalability", "None of the Above"], correct: 2 }  
  ]
};

function startQuiz(topic) {
  document.querySelector('.card-container').classList.add('hidden');
  document.getElementById('quiz').classList.remove('hidden');
  document.getElementById('topic-title').textContent = topic.toUpperCase();
  currentQuestionIndex = 0;
  score = 0;
  loadQuestion(topic);
}

function loadQuestion(topic) {
  const questionData = questions[topic][currentQuestionIndex];
  document.getElementById('question').textContent = questionData.q;
  const buttons = document.querySelectorAll('.options button');
  buttons.forEach((btn, index) => {
    btn.textContent = questionData.options[index];
  });
  document.getElementById('score-display').classList.remove('hidden');
  document.getElementById('score').textContent = score;
}

function checkAnswer(selectedOption) {
  const topic = document.getElementById('topic-title').textContent.toLowerCase();
  const questionData = questions[topic][currentQuestionIndex];

  // Reward/Punishment based on answer
  if (selectedOption === questionData.correct) {
    score += (10 * difficultyLevel); // reward based on difficulty level
    document.getElementById('result').textContent = 'Correct!';
  } else {
    score -= (5 * difficultyLevel);  // penalty for incorrect answer
    document.getElementById('result').textContent = 'Incorrect!';
  }

  document.getElementById('result').classList.remove('hidden');
  document.getElementById('score').textContent = score;
  currentQuestionIndex++;

  // Check if more questions are available
  if (currentQuestionIndex < questions[topic].length) {
    setTimeout(() => {
      document.getElementById('result').classList.add('hidden');
      loadQuestion(topic);
    }, 1000);
  } else {
    calculateRating();
  }
}

function calculateRating() {
  let performance = (score / (totalQuestions * 10)) * 100;  // Normalize score to percentage
  let eloChange = Math.floor((performance - 50) * 10);  // Simplified Elo rating calculation

  rating += eloChange;
  document.getElementById('result').textContent = `Quiz Over! Your final score is ${score}. Your new rating is ${rating}.`;
  document.getElementById('question-container').classList.add('hidden');
}
