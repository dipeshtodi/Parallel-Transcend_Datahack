const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const openAIAPIKey = "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";

app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Root endpoint to avoid "Cannot GET /" error
app.get('/', (req, res) => {
    res.send('Welcome to the Flashcard API. Use /api/flashcards to generate flashcards.');
});

app.post('/api/flashcards', async (req, res) => {
    try {
        const { topic } = req.body;
        
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        const flashcards = await generateFlashcards(topic);
        res.json(flashcards);
    } catch (error) {
        console.error('Error generating flashcards:', error);
        res.status(500).json({ error: 'Failed to generate flashcards' });
    }
});

async function generateFlashcards(topic) {
    try {
        // Generate 5 flashcards for testing
        const flashcards = [];
        for (let i = 0; i < 5; i++) {
            const question = await generateQuestion(topic);
            const imageUrl = await generateImage(question);
            
            flashcards.push({
                question,
                image: imageUrl
            });
        }
        return flashcards;
    } catch (error) {
        console.error('Error in generateFlashcards:', error);
        throw error;
    }
}

async function generateQuestion(topic) {
    // Implementation using Claude API
    // For testing, you can return sample questions:
    const sampleQuestions = [
        `What is the main concept of ${topic}?`,
        `How does ${topic} work in practice?`,
        `What are the key components of ${topic}?`,
        `Why is ${topic} important?`,
        `What are the applications of ${topic}?`
    ];
    return sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
}

async function generateImage(question) {
    // Implementation using DALL-E API
    // For testing, return a placeholder image:
    return `https://via.placeholder.com/400x300?text=${encodeURIComponent(question)}`;
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
