from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.flashcard import Flashcard
from app import db

flashcard_bp = Blueprint('flashcard', __name__)

@flashcard_bp.route('/flashcards', methods=['GET'])
@jwt_required()
def get_flashcards():
    flashcards = Flashcard.query.all()
    return jsonify([flashcard.to_dict() for flashcard in flashcards])

@flashcard_bp.route('/flashcards', methods=['POST'])
@jwt_required()
def create_flashcard():
    data = request.json
    new_flashcard = Flashcard(
        question=data['question'],
        answer=data['answer'],
        content_type=data.get('content_type', 'text'),
        content_url=data.get('content_url'),
        topic=data.get('topic')
    )
    db.session.add(new_flashcard)
    db.session.commit()
    return jsonify(new_flashcard.to_dict()), 201