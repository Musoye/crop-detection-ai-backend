# Crop-Test: AI-Powered Disease Detection & Farm Management

**AI Model:** YOLO11 Nano | **Mobile:** React Native (Expo) | **Accuracy:** 89.6%

Crop-Test is a cross-platform mobile application designed to empower farmers with instant, offline-capable crop disease diagnosis and digital farm record-keeping. By leveraging the state-of-the-art **YOLO11** architecture, we bring laboratory-grade diagnostics to a farmer's pocket.

---

## Key Features

* **Instant Disease Detection:** Users can capture an image of a crop leaf (Maize, Tomato, Cashew, Cassava) and receive an immediate diagnosis.
* **Generative AI Advisory:** Integrated with **Google Gemini 2.5 Flash** to analyze the detection results and provide actionable, context-aware treatment recommendations.
* **Cross-Platform Mobile App:** Built with **Expo (React Native)** to ensure seamless performance on both Android and iOS devices.
* **Offline Farm Records:** Utilizes local storage (AsyncStorage) to securely persist farm logs and history on the device, ensuring critical data is accessible even without an internet connection.
* **Real-Time Edge Performance:** Optimized for mobile use with an inference speed of approximately **0.6ms** per image.

---

## Supported Crops & Diseases

Our AI model has been trained to detect **22 specific conditions** across 4 major African crops, differentiating between healthy and diseased states with high precision.

| **Cashew** | **Cassava** |
| :--- | :--- |
| ✅ Anthracnose | ✅ Bacterial Blight |
| ✅ Gumosis | ✅ Brown Spot |
| ✅ Leaf Miner | ✅ Green Mite |
| ✅ Red Rust | ✅ Mosaic Disease |
| 🌿 Healthy | 🌿 Healthy |

| **Maize** | **Tomato** |
| :--- | :--- |
| ✅ Fall Armyworm | ✅ Leaf Blight |
| ✅ Grasshopper | ✅ Leaf Curl |
| ✅ Leaf Beetle | ✅ Septoria Leaf Spot |
| ✅ Leaf Blight | ✅ Verticillium Wilt |
| ✅ Leaf Spot | 🌿 Healthy |
| ✅ Streak Virus | |
| 🌿 Healthy | |

### Technical Class Mapping (Model Output)

The YOLO11 model outputs a class ID (0-21). The system maps these IDs to the following disease names for the frontend and GenAI processing:

```json
{
  "0": "Cashew anthracnose",
  "1": "Cashew gumosis",
  "2": "Cashew healthy",
  "3": "Cashew leaf miner",
  "4": "Cashew red rust",
  "5": "Cassava bacterial blight",
  "6": "Cassava brown spot",
  "7": "Cassava green mite",
  "8": "Cassava healthy",
  "9": "Cassava mosaic",
  "10": "Maize fall armyworm",
  "11": "Maize grasshoper",
  "12": "Maize healthy",
  "13": "Maize leaf beetle",
  "14": "Maize leaf blight",
  "15": "Maize leaf spot",
  "16": "Maize streak virus",
  "17": "Tomato healthy",
  "18": "Tomato leaf blight",
  "19": "Tomato leaf curl",
  "20": "Tomato septoria leaf spot",
  "21": "Tomato verticulium wilt"
}
```
---

## Technical Architecture: The AI Model

At the core of Crop-Test is a custom fine-tuned image classification model built upon the **Ultralytics YOLO11** architecture.

### Why YOLO11?

We selected the **YOLO11n-cls (Nano Classification)** model for this project. Unlike traditional heavy convolutional neural networks (CNNs), YOLO11 is architected specifically for "Edge AI"—meaning it is designed to run efficiently on devices with limited computational power, such as mobile phones, without sacrificing accuracy.

### Training Methodology

We employed **Transfer Learning** to achieve high accuracy within a limited timeframe.

1. **Pre-training:** The model started with weights pre-trained on the massive ImageNet dataset, giving it a fundamental understanding of features like edges, textures, and shapes.
2. **Fine-tuning:** We retrained the final classification layers on our specific dataset of **20,168 training images**. This allowed the model to specialize in distinguishing between subtle differences in crop diseases (e.g., differentiating *Maize Leaf Blight* from *Maize Leaf Spot*).
3. **Environment:** Training was conducted on a **Tesla T4 GPU** (16GB VRAM) using mixed-precision training (AMP) to accelerate convergence.

### Performance Metrics

Our model was validated against a separate set of 5,052 images. The final metrics demonstrate robust reliability for field use:

| Metric | Result | Explanation |
| --- | --- | --- |
| **Top-1 Accuracy** | **89.6%** | The model correctly identifies the exact disease as its primary prediction nearly 90% of the time. |
| **Top-5 Accuracy** | **99.9%** | The correct disease is consistently present within the model's top 5 probability scores. |
| **Inference Speed** | **0.6ms** | The time taken to process a single image. This ultra-low latency ensures the app feels instant to the user. |
| **Loss Convergence** | **0.29** | The consistent decrease in loss (error rate) over 10 epochs indicates the model learned effectively without overfitting. |

**Resources:**

* **Dataset Source:** [https://www.kaggle.com/datasets/nirmalsankalana/crop-pest-and-disease-detection]
* **Training Notebook:** [https://colab.research.google.com/drive/1j1lOGqXfrpTJDnHmUZwqJyShDTp_2sKQ#scrollTo=8geQPk42wQfs]

---

##  System Architecture

![System Architecture](architecture.png)

*The architecture flows from the React Native mobile app through a secure Ngrok tunnel to the Python Flask backend, where YOLO11 performs inference and Gemini provides agronomic advice.*

---

## Tech Stack

* **Frontend:** React Native, Expo, TypeScript.
* **Backend API:** Python, Flask.
* **AI/ML Frameworks:** PyTorch, Ultralytics YOLO11.
* **Intelligence Layer:** Google Gemini API (Generative AI).
* **Network Tunneling:** Ngrok (For exposing the local development server to mobile devices).
* **Data Persistence:** AsyncStorage (Local Storage).

---

## Installation & Setup Guide

Follow these steps to run the project locally for presentation or development.

### 1. Backend Setup (Python/Flask)

The backend handles the image processing and AI inference.

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment (Recommended)
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install required dependencies
pip install -r requirements.txt

# Start the Flask Server
python app.py

```

**Expose Backend to Mobile:**
Open a new terminal window and run ngrok to create a secure tunnel to the Flask server.

```bash
ngrok http 5000

```

*Note: Copy the forwarding URL (e.g., `https://xxxx-xx-xx.ngrok-free.app`) and update the API_URL configuration in your frontend code.*

### 2. Frontend Setup (React Native/Expo)

The mobile application interface.

```bash
# Navigate to the frontend directory
cd frontend

# Install Node modules
npm install

# Start the application with Tunneling enabled
# (This resolves common network issues on WSL or restricted LANs)
npx expo start --tunnel -c

```

*Scan the QR code displayed in the terminal using the **Expo Go** app on your physical mobile device to launch the application.*

---

## Contributors

* **Mustapha Oyebamiji (Musoye)** - AI Engineer & Backend Developer
* **[Name 2]** - Frontend Developer
* **[Name 3]** - Project Manager / Designer

---

## License

This project is licensed under the MIT License.