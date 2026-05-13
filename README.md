# 🛡️ Watermark Detector

A high-performance, stateless AI solution for identifying and locating watermarks in images. Built with **FastAPI**, **Next.js**, and **YOLOv8**, this project provides a premium, minimalist interface for professional watermark analysis.

[![View Notebook](https://img.shields.io/badge/📔_Google_Colab-View_Notebook-blue?style=for-the-badge&logo=google-colab)](https://colab.research.google.com/drive/1Wi0WIWEEI8F01RMjBwU3f_aLDvORrRnV?usp=sharing)

## ✨ Key Features

- **🚀 Stateless Architecture**: Images are processed entirely in memory. No persistent storage or database is required, making deployment seamless and secure.
- **🧠 YOLOv8 Powered**: Leverages the state-of-the-art YOLOv8 model for high-accuracy watermark detection.
- **💎 Premium Minimalist UI**: A clean, high-contrast workspace built with Next.js (App Router) and Tailwind CSS, designed for professional focus.
- **⚡ Real-time Feedback**: Instant analysis with side-by-side comparison and detailed confidence metrics.
- **🔌 Base64 Integration**: Annotated results are returned as Base64 data URIs, eliminating the need for static file hosting.

---

## 🏗️ Architecture

The system follows a modern, stateless flow designed for speed and portability:

1. **Upload**: User selects an image in the browser.
2. **Transfer**: Raw image bytes are streamed to the FastAPI backend.
3. **In-Memory Processing**: OpenCV decodes the bytes directly into a pixel matrix.
4. **AI Inference**: YOLOv8 scans the matrix and identifies watermark coordinates.
5. **Annotation**: Results are drawn directly onto the matrix in RAM.
6. **Delivery**: The final image is Base64 encoded and returned to the UI for instant rendering.

---

## 📂 Project Structure

```text
Watermark-detector/
├── backend/
│   ├── src/
│   │   ├── inference.py       # YOLOv8 model engine & in-memory logic
│   │   └── utils.py           # Base64 encoding & CV2 annotation utilities
│   ├── app.py                 # FastAPI server & API orchestration
│   ├── config.py              # System configuration & thresholds
│   ├── best.pt                # Trained weights for watermark detection
│   └── requirements.txt       # Python environment dependencies
├── frontend/
│   ├── src/app/
│   │   ├── page.tsx           # Minimalist workspace UI
│   │   ├── layout.tsx         # Root application structure
│   │   └── globals.css        # Premium design system foundation
│   ├── package.json           # Node.js dependencies
│   └── tsconfig.json          # TypeScript configuration
└── README.md                  # Professional documentation
```

---

## 🛠️ Setup & Installation

### 🐍 Backend (FastAPI)

1. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure (Optional)**:
   Edit `backend/config.py` to adjust confidence thresholds or server ports.

3. **Run Server**:
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:8000`.

### ⚛️ Frontend (Next.js)

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Access the workspace at `http://localhost:3000`.

---

## 🚀 Usage

1. **Start both servers** (Backend and Frontend).
2. **Select an Image** in the minimalist dropzone.
3. **Click 'Analyze'**: The system will perform in-memory analysis.
4. **Review Results**: Compare the original vs. annotated output and check the confidence table.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/)
- **AI/CV**: [Ultralytics YOLOv8](https://ultralytics.com/yolov8), [OpenCV](https://opencv.org/), [NumPy](https://numpy.org/)

---

## 🗺️ Roadmap

- [ ] **Batch Processing**: Support for multiple image analysis in one session.
- [ ] **Interactive Thresholds**: Adjust detection confidence in real-time via the UI.
- [ ] **Export Options**: Download annotated results in various formats (PNG, PDF).
- [ ] **Video Support**: Real-time watermark detection for video streams.
- [ ] **Cloud Ready**: One-click deployment templates for Docker and Vercel.

---

> **Note**: This project is optimized for deployment in environments with limited persistent storage, as it doesn't rely on a local filesystem for processing images.
