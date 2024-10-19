import React from 'react';
import Quiz from '../components/Quiz';

const StudySession = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Study Session</h1>
      <Quiz />
    </div>
  );
};

export default StudySession;