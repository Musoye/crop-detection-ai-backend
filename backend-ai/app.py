import os
import json
import time
from flask import Flask, request, jsonify, url_for
from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

model = YOLO('best.pt') 

GENAI_API_KEY = os.getenv("GEMINI_API_KEY") 

def get_gemini_recommendation(disease_name):
    """
    Asks Gemini via direct HTTP request.
    """
    if "healthy" in disease_name.lower():
        return {
            "severity": "low",
            "description": "The crop appears healthy and vigorous.",
            "recommendations": ["Continue regular monitoring.", "Maintain current irrigation."]
        }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GENAI_API_KEY}"
    
    prompt = f"""
    You are an expert plant pathologist.
    The detected crop disease is "{disease_name}".
    
    Return a valid JSON object with exactly these fields:
    - severity: "low", "medium", or "high"
    - description: A short 1-sentence explanation of the disease.
    - recommendations: A list of 3 actionable steps to treat it.
    
    Do not use markdown formatting. Just return the raw JSON.
    """
    
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    headers = {'Content-Type': 'application/json'}

    try:
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code != 200:
            print(f"API Error {response.status_code}: {response.text}")
            return {"severity": "unknown", "description": "API Limit or Error", "recommendations": ["Check API Key"]}

        data = response.json()
        
        raw_text = data['candidates'][0]['content']['parts'][0]['text']
        
        clean_text = raw_text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_text)

    except Exception as e:
        print(f"Gemini Connection Error: {e}")
        return {
            "severity": "unknown",
            "description": "Could not retrieve details.",
            "recommendations": ["Consult a local agronomist."]
        }
def create_annotated_image(image_path, text, output_path):
    """
    Since Classification models don't draw boxes, we manually draw 
    a text banner at the top of the image using PIL.
    """
    try:
        img = Image.open(image_path)
        draw = ImageDraw.Draw(img)
        
        draw.rectangle([(0, 0), (img.width, 60)], fill="red")
        
        try:
            font = ImageFont.truetype("arial.ttf", 40)
        except IOError:
            font = ImageFont.load_default()

        draw.text((10, 10), text, fill="white", font=font)
        
        img.save(output_path)
        return True
    except Exception as e:
        print(f"Annotation Error: {e}")
        return False

@app.route('/health', methods=['GET'])
def health_check():
    """
    Simple endpoint to check if the server is running.
    """
    return jsonify({
        "status": "online",
        "service": "Crop Disease Detection API",
        "model_loaded": True
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400

    filename = f"{int(time.time())}_{file.filename}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    img = Image.open(filepath)
    
    results = model(img)
    result = results[0]
    
    top1_index = result.probs.top1
    confidence = result.probs.top1conf.item()
    disease_name = result.names[top1_index]
    
    annotated_filename = f"annotated_{filename}"
    annotated_path = os.path.join(app.config['UPLOAD_FOLDER'], annotated_filename)

    label_text = f"{disease_name} ({round(confidence*100, 1)}%)"
    create_annotated_image(filepath, label_text, annotated_path)
    
    ai_data = get_gemini_recommendation(disease_name)
    
    image_url = url_for('static', filename=f'uploads/{annotated_filename}', _external=True)
    
    width, height = img.size
    
    response_data = {
        "success": True,
        "disease_name": disease_name,
        "confidence": round(confidence, 2),
        "severity": ai_data.get("severity"),
        "description": ai_data.get("description"),
        "recommendations": ai_data.get("recommendations"),
        "total_detections": 1,
        "detections": [
            {
                "class": disease_name,
                "confidence": round(confidence, 2),
                "bbox": [0, 0, width, height]
            }
        ],
        "annotated_url": image_url 
    }
    
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)