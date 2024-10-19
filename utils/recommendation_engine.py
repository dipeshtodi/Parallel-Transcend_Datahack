from models.user_performance import UserPerformance
from models.flashcard import Flashcard
from collections import defaultdict

def get_recommendations(user_id):
    user_performances = UserPerformance.query.filter_by(user_id=user_id).all()
    topic_performance = defaultdict(list)
    
    for performance in user_performances:
        flashcard = Flashcard.query.get(performance.flashcard_id)
        topic_performance[flashcard.topic].append(performance.correct)
    
    recommendations = []
    for topic, results in topic_performance.items():
        success_rate = sum(results) / len(results)
        if success_rate < 0.7:
            recommendations.append({
                'topic': topic,
                'message': f"Practice more flashcards on {topic}",
                'success_rate': success_rate
            })
        elif success_rate > 0.9:
            recommendations.append({
                'topic': topic,
                'message': f"You're doing great on {topic}! Try more advanced content.",
                'success_rate': success_rate
            })
    
    return sorted(recommendations, key=lambda x: x['success_rate'])
