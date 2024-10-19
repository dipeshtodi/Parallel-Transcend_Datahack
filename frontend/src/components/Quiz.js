import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import { getNextFlashcard, submitAnswer } from '../services/api';

const Quiz = () => {
  const [currentFlashcard, setCurrentFlashcard] = useState(null);

  const fetchNextFlashcard = async () => {
    try {
      const response = await getNextFlashcard();
      setCurrentFlashcard(response.data);
    } catch (error) {
      console.error('Error fetching next flashcard:', error);
    }
  };

  const handleAnswer = async (flashcardId, correct, responseTime) => {
    try {
      await submitAnswer(flashcardId, correct, responseTime);
      fetchNextFlashcard();
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  useEffect(() => {
    fetchNextFlashcard();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Quiz</h2>
      {currentFlashcard ? (
        <Flashcard flashcard={currentFlashcard} onAnswer={handleAnswer} />
      ) : (
        <p>Loading flashcard...</p>
      )}
    </div>
  );
};

export default Quiz;