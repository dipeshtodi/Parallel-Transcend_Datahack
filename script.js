// OpenAI API Key
const openAIAPIKey = "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";

// DOM Elements
const topicInput = document.getElementById('topic');
const generateButton = document.getElementById('generate');
const flashcardContainer = document.getElementById('flashcard-container');
const questionElement = document.getElementById('question');
const imageElement = document.getElementById('flashcard-image');
const nextButton = document.getElementById('next');
const quizEndContainer = document.getElementById('quiz-end');
const recommendationElement = document.getElementById('recommendation');

// Global variables
let flashcards = [];
let currentFlashcard = 0;
let userPerformance = { correct: 0, incorrect: 0 };

// Function to fetch text content from OpenAI for a specific topic
async function fetchFlashcardText(topic) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIAPIKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `Generate a flashcard question about ${topic}:`
            }],
            max_tokens: 100
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch flashcard text: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// Function to fetch an image from DALL·E based on the flashcard text
async function fetchFlashcardImage(flashcardText) {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${openAIAPIKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: `Create an image related to this text: "${flashcardText}"`,
            n: 1,
            size: "1024x1024"
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch flashcard image: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();
    return data.data[0].url;
}

// Function to generate 10-15 flashcards based on the user's topic input
async function generateFlashcards(topic) {
    const numFlashcards = Math.floor(Math.random() * 6) + 10; // Random between 10 and 15

    try {
        flashcards = [];
        for (let i = 0; i < numFlashcards; i++) {
            const flashcardText = await fetchFlashcardText(topic);
            const flashcardImage = await fetchFlashcardImage(flashcardText);

            flashcards.push({
                question: flashcardText,
                image: flashcardImage
            });
        }

        currentFlashcard = 0;
        showFlashcard();
    } catch (error) {
        console.error('Error generating flashcards:', error);
        alert('Failed to generate flashcards. Please try again.');
    }
}

// Function to display the current flashcard
function showFlashcard() {
    if (currentFlashcard < flashcards.length) {
        const flashcard = flashcards[currentFlashcard];
        questionElement.innerText = flashcard.question;
        imageElement.src = flashcard.image;
        flashcardContainer.style.display = 'block';
        quizEndContainer.style.display = 'none';
    } else {
        showQuizEnd();
    }
}

// Function to handle when the flashcards are completed
function showQuizEnd() {
    flashcardContainer.style.display = 'none';
    quizEndContainer.style.display = 'block';

    // Generate a recommendation based on performance
    const totalQuestions = flashcards.length;
    const correctPercentage = (userPerformance.correct / totalQuestions) * 100;

    let recommendation = "You did well! Keep up the good work!";
    if (correctPercentage < 50) {
        recommendation = "You might need to focus more on certain topics. We recommend revisiting the flashcards!";
    } else if (correctPercentage < 70) {
        recommendation = "Good job! But you can still improve in some areas.";
    }

    recommendationElement.innerText = recommendation;
}

// Event listener for generating flashcards
generateButton.addEventListener('click', () => {
    const topic = topicInput.value;
    if (topic.trim()) {
        flashcards = [];
        userPerformance = { correct: 0, incorrect: 0 };
        generateFlashcards(topic);
    }
});

// Event listener for moving to the next flashcard
nextButton.addEventListener('click', () => {
    currentFlashcard++;
    showFlashcard();
});

// Initially hide the flashcard container
flashcardContainer.style.display = 'none';