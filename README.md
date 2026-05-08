# Watermark Detection System

A production-ready watermark detection system combining **FastAPI backend** (YOLOv8 inference) and **Next.js frontend** (React UI).

## Project Structure

```
Watermark-detector/
├── backend/
│   ├── src/
│   │   ├── inference.py       # YOLO model loading & detection
│   │   └── utils.py           # Image annotation & response formatting
│   ├── outputs/               # Saves annotated images here
│   ├── app.py                 # FastAPI server
│   ├── config.py              # Configuration (paths, thresholds)
│   ├── best.pt                # Trained YOLOv8 model
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Main upload interface
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   └── ResultDisplay.tsx  # Result visualization
│   ├── package.json           # Node dependencies
│   └── tsconfig.json          # TypeScript config
└── README.md                  # This file
```

---

## Backend Setup

### Prerequisites
- Python 3.8+
- `best.pt` model file in `backend/` directory

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Configuration
Edit `backend/config.py` to adjust:
- `MODEL_PATH` — Path to `best.pt`
- `CONFIDENCE_THRESHOLD` — Detection confidence (default: 0.5)
- `IOU_THRESHOLD` — Non-max suppression threshold (default: 0.5)
- `HOST` / `PORT` — Server address (default: `0.0.0.0:8000`)

### Running the Backend

```bash
cd backend
python app.py
```

The server starts at `http://localhost:8000`

**Endpoints:**
- `GET /` — API info
- `GET /health` — Health check
- `POST /detect` — Detect watermarks in image
  - Request: `{ "image_path": "/path/to/image.jpg" }`
  - Response: `{ "original_image", "annotated_image", "detection_count", "detections", "summary" }`

**API Documentation:**
- OpenAPI Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Frontend Setup

### Prerequisites
- Node.js 16+ (with npm or yarn)

### Installation

```bash
cd frontend
npm install
```

### Configuration
Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Running the Frontend

```bash
cd frontend
npm run dev
```

The UI starts at `http://localhost:3000`

---

## Usage

### 1. Start Backend
```bash
cd backend
python app.py
# Output: INFO:     Application startup complete [127.0.0.1:8000]
```

### 2. Start Frontend (in another terminal)
```bash
cd frontend
npm run dev
# Output: ▲ Next.js 14.0.0
#         - Local:        http://localhost:3000
```

### 3. Upload Image
- Go to `http://localhost:3000`
- Enter image file path (absolute or relative to backend root)
- Click **"Detect Watermarks"**
- View annotated image + detection results

### Example Image Paths
- **Absolute:** `/home/user/images/photo.jpg`
- **Relative (from backend root):** `../test-images/sample.png`
- **With best.pt directory:** `test-images/watermarked.jpg`

---

## How It Works

1. **Frontend Form**: User enters image path → sends to backend
2. **Backend Inference**: Loads `best.pt`, runs YOLOv8 detection
3. **Bounding Boxes**: Draws green boxes on detected watermarks
4. **Response**: Returns annotated image path + JSON metadata
5. **Display**: Frontend shows image + confidence scores table


## Future Enhancements

- [ ] Batch image processing
- [ ] Confidence threshold slider in UI
- [ ] Download annotated images
- [ ] Model performance metrics dashboard
- [ ] Support for video watermark detection
- [ ] Docker containerization
- [ ] Azure deployment
