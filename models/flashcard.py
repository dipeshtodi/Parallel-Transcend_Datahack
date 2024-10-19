from app import db

class Flashcard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(500), nullable=False)
    answer = db.Column(db.String(500), nullable=False)
    difficulty = db.Column(db.Float, default=0.5)
    content_type = db.Column(db.String(50), default='text')
    content_url = db.Column(db.String(500))
    topic = db.Column(db.String(100))
