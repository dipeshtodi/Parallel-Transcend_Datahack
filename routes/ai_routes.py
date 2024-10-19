from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.adaptive_learning import get_next_flashcard
from services.content_generation import generate_flashcard
from services.knowledge_graph import get_related_topics
from services.spaced_repetition import get_due_flashcards
from utils.recommendation_engine import get_recommendations

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/next-flashcard', methods=['GET'])
@jwt_required()
def next_flashcard():
    user_id = get_jwt_identity()
    flashcard = get_next_flashcard(user_id)
    return jsonify(flashcard.to_dict())

@ai_bp.route('/generate-flashcard', methods=['POST'])
@jwt_required()
def create_generated_flashcard():
    data = request.json
    flashcard = generate_flashcard(data['topic'])
    return jsonify(flashcard.to_dict()), 201

@ai_bp.route('/related-topics', methods=['GET'])
@jwt_required()
def related_topics():
    topic = request.args.get('topic')
    related = get_related_topics(topic)
    return jsonify(related)

@ai_bp.route('/due-flashcards', methods=['GET'])
@jwt_required()
def due_flashcards():
    user_id = get_jwt_identity()
    flashcards = get_due_flashcards(user_id)
    return jsonify([flashcard.to_dict() for flashcard in flashcards])

@ai_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_user_recommendations():
    user_id = get_jwt_identity()
    recommendations = get_recommendations(user_id)
    return jsonify(recommendations)