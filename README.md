<div align="center">

# دماج للقرآن الكريم
## Dammaj Al-Quran

**Professional Quran Video Editing Desktop Application**

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)
![License](https://img.shields.io/badge/license-MIT-purple)

</div>

## 📖 Overview

Dammaj Al-Quran is a professional desktop application for creating and editing Quranic video content. It combines powerful video editing tools with AI-powered features specifically designed for Islamic content creators.

### ✨ Key Features

- **Professional Video Editing**
  - Multi-track timeline with clip manipulation
  - Real-time video preview
  - Drag & drop media import
  - Keyboard shortcuts support

- **AI-Powered Tools**
  - Automatic transcription with Whisper
  - Arabic text-to-speech (TTS) dubbing
  - Auto subtitle generation
  - Audio noise reduction

- **Quran-Specific Features**
  - Quran verse recognition
  - Built-in Quran text with tashkeel
  - Beautiful Arabic fonts
  - Islamic design elements

- **Subtitle Management**
  - Create and edit subtitles
  - Font styling and effects
  - Export as SRT/VTT
  - Burn subtitles to video

- **Audio Processing**
  - Multi-track audio mixing
  - Volume control and normalization
  - Audio effects
  - Voice recording

- **Export Options**
  - Multiple resolutions (720p, 1080p, 4K)
  - Various formats (MP4, WebM)
  - Quality presets
  - Real-time progress tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Python 3.9+
- FFmpeg

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mimotoufik11-stack/dammaj-quran.git
cd dammaj-quran
```

2. Install frontend dependencies:
```bash
npm install
```

3. Set up the backend:
```bash
cd backend
pip install -r requirements.txt
```

4. Set up the database:
```bash
npm run setup:database
```

5. Download AI models (optional):
```bash
npm run download:models
```

6. Start the application:
```bash
npm run dev
```

## 📁 Project Structure

```
dammaj-quran/
├── src/                 # Frontend (React)
│   ├── main/           # Electron main process
│   ├── renderer/       # React application
│   ├── pages/          # Application pages
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── store/          # Zustand state management
│   ├── services/       # API services
│   ├── styles/         # CSS styles
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── backend/            # FastAPI backend
│   ├── routers/        # API routes
│   ├── models/         # Database models
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   └── database/       # Database configuration
├── shared/             # Shared types and constants
├── docs/               # Documentation
└── public/             # Static assets
```

## 🎨 Screenshots

![Main Dashboard](docs/screenshots/dashboard.png)
![Video Editor](docs/screenshots/editor.png)
![AI Tools](docs/screenshots/ai-tools.png)

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run dist` - Create distributable packages
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests

### Backend Development

```bash
cd backend
uvicorn main:app --reload
```

### Database Management

```bash
# Create migration
alembic revision --autogenerate -m "message"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 📚 Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [User Guide](docs/USER_GUIDE.md)
- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [API Documentation](docs/API_ENDPOINTS.md)

## 🌍 Localization

The application supports full Arabic localization with RTL (right-to-left) layout. Supported languages:

- 🇸🇦 Arabic (العربية)
- 🇬🇧 English

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](docs/CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI Whisper for transcription
- Coqui TTS for text-to-speech
- FFmpeg for video processing
- The entire open-source community

## 📞 Support

For support, please contact:
- Email: support@dammajquran.com
- GitHub Issues: [mimotoufik11-stack/dammaj-quran](https://github.com/mimotoufik11-stack/dammaj-quran/issues)

---

<div align="center">

Made with ❤️ for the Quran

**بسم الله الرحمن الرحيم**

</div>
