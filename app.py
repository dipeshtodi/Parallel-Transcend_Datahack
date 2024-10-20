from flask import Flask, request, jsonify, render_template
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import openai
import os
from gtts import gTTS
from ai_service import FlashcardGenerator
from image_service import generate_image  # Add this import

app = Flask(__name__)

# Initialize AI models with proper configuration
tokenizer = AutoTokenizer.from_pretrained('gpt2')
model = AutoModelForCausalLM.from_pretrained('gpt2')
text_generator = pipeline('text-generation', 
                        model=model, 
                        tokenizer=tokenizer,
                        truncation=True)

# API key handling
openai.api_key = os.getenv('OPENAI_API_KEY')

def generate_audio(text):
    try:
        tts = gTTS(text=text, lang='en')
        audio_path = os.path.join("static", "temp", "audio.mp3")
        os.makedirs(os.path.dirname(audio_path), exist_ok=True)
        tts.save(audio_path)
        return audio_path
    except Exception as e:
        print(f"Audio generation error: {str(e)}")
        return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    topic = request.json.get('topic')
    if not topic:
        return jsonify({'error': 'No topic provided'}), 400

    try:
        flashcard_gen = FlashcardGenerator()
        base_cards = flashcard_gen.generate_content(topic)
        
        enhanced_cards = []
        for i, card in enumerate(base_cards):
            enhanced_card = {
                'id': i,
                'type': ['text', 'image', 'audio'][i % 3],
                'question': card['question'],
                'answer': card['answer'],
                'difficulty': card['difficulty']
            }
            
            # Add multimedia content based on type
            if enhanced_card['type'] == 'image':
                image_prompt = f"Educational illustration about {enhanced_card['question']}"
                image = generate_image(image_prompt)
                if image:
                    enhanced_card['image'] = image
                else:
                    # Fallback to text type if image generation fails
                    enhanced_card['type'] = 'text'
            elif enhanced_card['type'] == 'audio':
                audio = generate_audio(enhanced_card['answer'])
                if audio:
                    enhanced_card['audio'] = audio
                else:
                    # Fallback to text type if audio generation fails
                    enhanced_card['type'] = 'text'
                    
            enhanced_cards.append(enhanced_card)
            
        return jsonify({'cards': enhanced_cards})
    except Exception as e:
        print(f"Generation error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)