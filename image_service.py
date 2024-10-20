
# 1. Create a new file called 'image_service.py' in your project directory:
# image_service.py
from stability_sdk import client
import io
from PIL import Image
import base64
import os

def generate_image(prompt):
    try:
        # Create the stability api client
        stability_api = client.StabilityInference(
            key=os.getenv('STABILITY_API_KEY'),
            verbose=True,
        )
        
        # Generate the image
        answers = stability_api.generate(
            prompt=prompt,
            steps=30,
            cfg_scale=8.0,
            width=512,
            height=512,
            samples=1,
        )
        
        # Process the response
        for answer in answers:
            if answer.artifacts:
                for artifact in answer.artifacts:
                    if artifact.finish_reason == client.generation.FILTER:
                        raise Exception("NSFW content detected")
                    if artifact.type == client.generation.ARTIFACT_IMAGE:
                        # Convert to base64
                        img = Image.open(io.BytesIO(artifact.binary))
                        buffered = io.BytesIO()
                        img.save(buffered, format="PNG")
                        return base64.b64encode(buffered.getvalue()).decode()
        
        raise Exception("No image generated")
        
    except Exception as e:
        print(f"Image generation error: {str(e)}")
        return None