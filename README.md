# دماج للقرآن الكريم - Dammaj Al-Quran

Complete Quran application built with Electron, Next.js, and FastAPI.

## Features

- 📖 Complete Quran reader with all Surahs
- 🔍 Search functionality
- 🎨 Beautiful UI with dark mode support
- 🖥️ Desktop application (Windows, macOS, Linux)
- ⚡ Fast and responsive
- 🌐 Offline capable

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Desktop**: Electron
- **Backend**: Python FastAPI
- **Build**: electron-builder

## Prerequisites

- Node.js v20+ (current: v20.20.0)
- npm v11+
- Python 3.9+

## Development Setup

### 1. Install Node.js dependencies

```bash
npm install
```

### 2. Install Python dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Run in Development Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

**Terminal 3 - Start Electron (optional):**
```bash
npm run electron
```

Or use the combined command:
```bash
npm run electron:dev
```

## Building for Production

### Build Frontend
```bash
npm run build
```

This will:
- Build Next.js application
- Export static files to `out/` directory

### Build Backend (Windows)
```bash
cd backend
pip install pyinstaller
pyinstaller --onefile --name dammaj-backend main.py
```

### Build Windows Installer
```bash
npm run build:win
```

This will create:
- `dist/dammaj-quran-setup-1.0.0.exe` (NSIS Installer)
- `dist/dammaj-quran-1.0.0.exe` (Portable executable)
- `dist/latest.yml` (Update manifest)

## Build Configuration

The build is configured in `package.json` under the `build` section:

```json
{
  "build": {
    "appId": "com.dammaj.quran",
    "productName": "دماج للقرآن الكريم",
    "directories": {
      "buildResources": "assets",
      "output": "dist"
    },
    "win": {
      "target": ["nsis", "portable"]
    }
  }
}
```

## Project Structure

```
dammaj-quran/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main Quran reader component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── electron/              # Electron main process
│   ├── main.js           # Electron entry point
│   └── preload.js        # Preload script
├── backend/              # Python FastAPI backend
│   ├── main.py          # FastAPI application
│   └── requirements.txt  # Python dependencies
├── assets/              # Build resources (icons)
├── out/                # Next.js build output
├── dist/               # Final electron build output
├── package.json        # Node.js dependencies & scripts
└── next.config.ts      # Next.js configuration
```

## Scripts

- `npm run dev` - Start Next.js dev server
- `npm run build` - Build Next.js application
- `npm run build:frontend` - Build and export frontend
- `npm run build:backend` - Build Python backend
- `npm run build:win` - Build Windows installer
- `npm run electron` - Start Electron app
- `npm run electron:dev` - Start dev mode with hot reload
- `npm run pack` - Test build without creating installer
- `npm run dist` - Create distribution packages

## API Endpoints

The backend provides the following endpoints:

- `GET /` - API status
- `GET /api/surahs` - List all surahs
- `GET /api/surah/{number}` - Get specific surah
- `GET /api/surah/{number}/ayahs` - Get ayahs of a surah
- `GET /api/ayah/{number}` - Get specific ayah
- `GET /api/search?q={query}` - Search in Quran

## Distribution

### Windows
The Windows installer includes:
- ✅ NSIS installer with custom installation options
- ✅ Desktop shortcut creation
- ✅ Start menu shortcut
- ✅ Uninstaller
- ✅ Bundled Electron app
- ✅ Bundled Python backend

### System Requirements
- Windows 10/11 (64-bit)
- 100 MB disk space
- 4 GB RAM recommended

## License

Copyright © 2025 Dammaj

## Contributing

This is a private project. For questions or issues, please contact the development team.

## Version History

### v1.0.0 (2025)
- Initial release
- Complete Quran reader
- Search functionality
- Windows installer
- Electron desktop application
- FastAPI backend integration
