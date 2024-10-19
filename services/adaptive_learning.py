import numpy as np
from models.user_performance import UserPerformance
from models.flashcard import Flashcard

def get_next_flashcard(user_id):
    user_performances = UserPerformance.query.filter_by(user_id=user_id).all()
    flashcards = Flashcard.query.all()
    
    if not user_performances:
        return np.random.choice(flashcards)
    
    flashcard_scores = {}
    for flashcard in flashcards:
        performances = [p for p in user_performances if p.flashcard_id == flashcard.id]
        if performances:
            correct_rate = sum(1 for p in performances if p.correct) / len(performances)
            avg_response_time = sum(p.response_time for p in performances) / len(performances)
            score = (1 - correct_rate) * 0.7 + (avg_response_time / 10) * 0.3
        else:
            score = 0.5
        flashcard_scores[flashcard.id] = score
    
    return max(flashcards, key=lambda f: flashcard_scores[f.id])