document.addEventListener('DOMContentLoaded', () => {
    const topicInput = document.getElementById('topicInput');
    const generateBtn = document.getElementById('generateBtn');
    const flashcardsContainer = document.getElementById('flashcardsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let currentCards = [];

    generateBtn.addEventListener('click', generateFlashcards);
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => filterCards(btn.dataset.type));
    });

    async function generateFlashcards() {
        const topic = topicInput.value.trim();
        if (!topic) return;

        loadingSpinner.style.display = 'flex';
        flashcardsContainer.innerHTML = '';
        generateBtn.disabled = true;

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic }),
            });

            if (!response.ok) throw new Error('Failed to generate flashcards');

            const data = await response.json();
            currentCards = data.cards;
            displayFlashcards(currentCards);
        } catch (error) {
            console.error('Error:', error);
            flashcardsContainer.innerHTML = `
                <div class="error-message">
                    Failed to generate flashcards. Please try again.
                </div>
            `;
        } finally {
            loadingSpinner.style.display = 'none';
            generateBtn.disabled = false;
        }
    }

    function displayFlashcards(cards) {
        flashcardsContainer.innerHTML = '';
        
        cards.forEach(card => {
            const flashcard = document.createElement('div');
            flashcard.className = 'flashcard';
            flashcard.dataset.type = card.type;

            let mediaContent = '';
            switch (card.type) {
                case 'image':
                    mediaContent = `
                        <div class="media-container">
                            <img src="data:image/png;base64,${card.image}" alt="Flashcard illustration">
                        </div>
                    `;
                    break;
                case 'audio':
                    mediaContent = `
                        <div class="media-container">
                            <audio controls src="${card.audio}"></audio>
                        </div>
                    `;
                    break;
                case 'video':
                    mediaContent = `
                        <div class="media-container">
                            <video controls src="${card.video}"></video>
                        </div>
                    `;
                    break;
            }

            flashcard.innerHTML = `
                <div class="content-type">
                    <i class="fas fa-${getTypeIcon(card.type)}"></i>
                    ${card.type.charAt(0).toUpperCase() + card.type.slice(1)}
                </div>
                <div class="flashcard-content">
                    <div class="front">
                        <h3>${card.question}</h3>
                        ${mediaContent}
                        <p class="hint">Click to reveal answer</p>
                    </div>
                    <div class="back">
                        <p>${card.answer}</p>
                        <p class="hint">Click to hide answer</p>
                    </div>
                </div>
            `;

            flashcard.addEventListener('click', () => {
                flashcard.classList.toggle('flipped');
            });

            flashcardsContainer.appendChild(flashcard);
        });
    }

    function filterCards(type) {
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });

        const filteredCards = type === 'all' 
            ? currentCards 
            : currentCards.filter(card => card.type === type);
        
        displayFlashcards(filteredCards);
    }

    function getTypeIcon(type) {
        const icons = {
            text: 'text',
            image: 'image',
            audio: 'volume-up',
            video: 'video'
        };
        return icons[type] || 'card';
    }
});