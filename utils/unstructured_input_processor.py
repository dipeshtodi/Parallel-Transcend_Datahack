import pytesseract
from PIL import Image
import PyPDF2
from models.flashcard import Flashcard
from app import db

def process_image(image_path, topic):
    image = Image.open(image_path)
    text = pytesseract.image_to_string(image)
    create_flashcards_from_text(text, topic, 'image', image_path)

def process_pdf(pdf_path, topic):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
    create_flashcards_from_text(text, topic, 'pdf', pdf_path)

def create_flashcards_from_text(text, topic, content_type, content_url):
    sentences = text.split('.')
    for i in range(0, len(sentences) - 1, 2):
        question = sentences[i].strip() + '?'
        answer = sentences[i+1].strip()
        new_flashcard = Flashcard(
            question=question,
            answer=answer,
            difficulty=0.5,
            content_type=content_type,
            content_url=content_url,
            topic=topic
        )
        db.session.add(new_flashcard)
    db.session.commit()
