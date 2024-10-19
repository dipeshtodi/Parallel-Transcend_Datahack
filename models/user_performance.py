from app import db
from datetime import datetime

class UserPerformance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    flashcard_id = db.Column(db.Integer, db.ForeignKey('flashcard.id'), nullable=False)
    correct = db.Column(db.Boolean, nullable=False)
    response_time = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)