from transformers import pipeline
from models.flashcard import Flashcard
from app import db

generator = pipeline('text-generation', model='gpt2')

def generate_flashcard(topic):
    prompt = f"Create a flashcard about {topic}. Question:"
    question = generator(prompt, max_length=50, num_return_sequences=1)[0]['generated_text']
    question = question.split("Question:")[1].strip()
    
    answer_prompt = f"Question: {question}\nAnswer:"
    answer = generator(answer_prompt, max_length=100, num_return_sequences=1)[0]['generated_text']
    answer = answer.split("Answer:")[1].strip()
    
    new_flashcard = Flashcard(
        question=question,
        answer=answer,
        difficulty=0.5,
        content_type='text',
        topic=topic
    )
    db.session.add(new_flashcard)
    db.session.commit()
    
    return new_flashcard