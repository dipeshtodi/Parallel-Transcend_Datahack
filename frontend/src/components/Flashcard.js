import React, { useState } from 'react';

const Flashcard = ({ flashcard, onAnswer }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState(null);

  const handleSubmit = () => {
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000;
    const isCorrect = userAnswer.toLowerCase() === flashcard.answer.toLowerCase();
    onAnswer(flashcard.id, isCorrect, responseTime);
    setIsFlipped(true);
  };

  React.useEffect(() => {
    setStartTime(Date.now());
  }, [flashcard]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 m-4 w-full max-w-lg">
      <div className={`${isFlipped ? 'hidden' : 'block'}`}>
        <h3 className="text-xl font-bold mb-4">{flashcard.question}</h3>
        {flashcard.content_type !== 'text' && (
          <div className="mb-4">
            {flashcard.content_type === 'image' && <img src={flashcard.content_url} alt="Flashcard content" className="w-full h-auto" />}
            {flashcard.content_type === 'video' && <video src={flashcard.content_url} controls className="w-full" />}
            {flashcard.content_type === 'audio' && <audio src={flashcard.content_url} controls className="w-full" />}
          </div>
        )}
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer"
          className="w-full p-2 border rounded mb-4"
        />
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>
      <div className={`${isFlipped ? 'block' : 'hidden'}`}>
        <h3 className="text-xl font-bold mb-4">Correct Answer:</h3>
        <p className="mb-4">{flashcard.answer}</p>
        <button onClick={() => setIsFlipped(false)} className="bg-green-500 text-white px-4 py-2 rounded">
          Next
        </button>
      </div>
    </div>
  );
};

export default Flashcard;