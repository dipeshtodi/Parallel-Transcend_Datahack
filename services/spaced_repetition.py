from datetime import datetime, timedelta
from models.user_performance import UserPerformance
from models.flashcard import Flashcard

def get_due_flashcards(user_id):
    performances = UserPerformance.query.filter_by(user_id=user_id).all()
    flashcard_intervals = {}
    
    for performance in performances:
        if performance.flashcard_id not in flashcard_intervals:
            flashcard_intervals[performance.flashcard_id] = 1
        else:
            if performance.correct:
                flashcard_intervals[performance.flashcard_id] *= 2
            else:
                flashcard_intervals[performance.flashcard_id] = 1
    
    due_flashcards = []
    for flashcard_id, interval in flashcard_intervals.items():
        last_review = UserPerformance.query.filter_by(user_id=user_id, flashcard_id=flashcard_id).order_by(UserPerformance.timestamp.desc()).first()
        if last_review.timestamp + timedelta(days=interval) <= datetime.utcnow():
            due_flashcards.append(Flashcard.query.get(flashcard_id))
    
    return due_flashcards