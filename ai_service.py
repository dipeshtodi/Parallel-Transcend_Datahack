from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import random

class FlashcardGenerator:
    def __init__(self, model_name="gpt2-large"):
        """Initialize with a larger model and structured prompting"""
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)
        self.generator = pipeline('text-generation',
                                model=self.model,
                                tokenizer=self.tokenizer,
                                truncation=True)
        
    def create_structured_prompt(self, topic):
        """Create a more specific prompt to guide generation"""
        return f"""Generate 3 educational flashcards about {topic}.
Format each flashcard as:
Q: [specific question about {topic}]
A: [clear, concise answer]

Example:
Q: What is machine learning?
A: Machine learning is a subset of AI that enables systems to learn and improve from experience without explicit programming.

Now generate 3 different flashcards about {topic}:"""

    def parse_response(self, text):
        """Parse the generated text into structured flashcards"""
        cards = []
        segments = text.split('Q:')
        
        for segment in segments[1:]:  # Skip the first empty segment
            try:
                # Split into question and answer parts
                qa_parts = segment.split('A:')
                if len(qa_parts) == 2:
                    question = qa_parts[0].strip()
                    answer = qa_parts[1].split('\n')[0].strip()
                    
                    # Calculate difficulty based on complexity
                    difficulty = self.calculate_difficulty(question, answer)
                    
                    cards.append({
                        'question': question,
                        'answer': answer,
                        'difficulty': difficulty
                    })
            except Exception as e:
                print(f"Parsing error for segment: {str(e)}")
                continue
                
        return cards

    def calculate_difficulty(self, question, answer):
        """Calculate difficulty based on content complexity"""
        total_length = len(question) + len(answer)
        complex_words = len([w for w in (question + answer).split() 
                           if len(w) > 8])  # Words longer than 8 chars
        
        if complex_words > 3 or total_length > 200:
            return 'hard'
        elif complex_words > 1 or total_length > 100:
            return 'medium'
        return 'easy'

    def generate_content(self, topic):
        """Generate flashcards with improved error handling and validation"""
        try:
            # Generate content with structured prompt
            prompt = self.create_structured_prompt(topic)
            responses = self.generator(
                prompt,
                max_length=500,  # Increased for more complete responses
                num_return_sequences=1,
                pad_token_id=self.tokenizer.eos_token_id,
                temperature=0.7  # Add some randomness while keeping coherence
            )
            
            # Process and validate the generated content
            cards = self.parse_response(responses[0]['generated_text'])
            
            # Validate and filter cards
            valid_cards = []
            for card in cards:
                if (len(card['question']) > 10 and 
                    len(card['answer']) > 10 and 
                    topic.lower() in (card['question'] + card['answer']).lower()):
                    valid_cards.append(card)
            
            return valid_cards if valid_cards else self.generate_content(topic)  # Retry if no valid cards
            
        except Exception as e:
            print(f"Content generation error: {str(e)}")
            return []

    def validate_topic(self, topic):
        """Validate if the topic is suitable for flashcard generation"""
        return (
            isinstance(topic, str) and 
            len(topic) > 2 and 
            len(topic) < 100 and 
            not topic.isdigit()
        )