#!/usr/bin/env python3
"""
Dammaj Al-Quran Video Editor - Launcher Script
Comprehensive Quran video editing application with all features
"""

import subprocess
import sys
import os
import signal
import time
from pathlib import Path

def run_command(cmd, cwd=None, description=""):
    """Run shell command and handle errors"""
    try:
        if description:
            print(f"🚀 {description}...")
        
        result = subprocess.run(
            cmd, 
            shell=True, 
            cwd=cwd, 
            capture_output=True, 
            text=True
        )
        
        if result.returncode != 0:
            print(f"❌ Error: {result.stderr}")
            return False
        
        if result.stdout:
            print(result.stdout)
        
        if description:
            print(f"✅ {description} completed!")
        
        return True
        
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return False

def install_frontend_deps():
    """Install frontend dependencies"""
    return run_command(
        "npm install",
        description="Installing frontend dependencies"
    )

def install_backend_deps():
    """Install backend dependencies"""
    if not Path("backend/requirements.txt").exists():
        print("⚠️  Backend requirements.txt not found, creating...")
        create_requirements_file()
    
    return run_command(
        "pip install -r requirements.txt",
        cwd="backend",
        description="Installing backend dependencies"
    )

def create_requirements_file():
    """Create requirements.txt for backend"""
    requirements = """fastapi==0.115.4
uvicorn[standard]==0.34.0
python-multipart==0.0.20
pydantic==2.10.4
numpy==2.1.3
pillow==11.0.0
moviepy==1.0.3
opencv-python==4.10.0.84
librosa==0.10.2
pydub==0.25.1
websockets==14.1
websockets-client==0.1.0
sqlalchemy==2.0.36
alembic==1.14.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-magic==0.4.27
requests==2.32.3
aiofiles==24.1.0"""
    
    with open("backend/requirements.txt", "w") as f:
        f.write(requirements)
    
    print("✅ Created backend/requirements.txt")

def build_frontend():
    """Build Next.js frontend"""
    return run_command(
        "npm run build",
        description="Building frontend"
    )

def start_backend():
    """Start FastAPI backend server"""
    print("🔄 Starting backend server...")
    
    # Create uploads and output directories
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("output", exist_ok=True)
    
    backend_process = subprocess.Popen(
        ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
        cwd="backend"
    )
    
    print("✅ Backend server started on http://localhost:8000")
    return backend_process

def start_frontend():
    """Start Next.js frontend"""
    print("🔄 Starting frontend development server...")
    
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"]
    )
    
    print("✅ Frontend server starting on http://localhost:3000")
    return frontend_process

def start_electron():
    """Start Electron app"""
    print("🔄 Starting Electron app...")
    
    # Wait for Next.js to be ready
    print("⏳ Waiting for Next.js to build...")
    time.sleep(5)
    
    electron_process = subprocess.Popen(
        ["npx", "electron", "."]
    )
    
    print("✅ Electron app started")
    return electron_process

def check_system_deps():
    """Check for required system dependencies"""
    print("🔍 Checking system dependencies...")
    
    required_tools = ["ffmpeg", "ffprobe"]
    missing = []
    
    for tool in required_tools:
        if not run_command(f"which {tool}", description=f"Checking {tool}"):
            missing.append(tool)
    
    if missing:
        print(f"⚠️  Missing dependencies: {', '.join(missing)}")
        print("📋 Please install FFmpeg:")
        print("   Ubuntu/Debian: sudo apt-get install ffmpeg")
        print("   macOS: brew install ffmpeg")
        print("   Windows: Download from https://ffmpeg.org/download.html")
        return False
    
    print("✅ All system dependencies found!")
    return True

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ required")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
    return True

def check_node_version():
    """Check Node.js version"""
    result = subprocess.run(["node", "--version"], capture_output=True, text=True)
    if result.returncode != 0:
        print("❌ Node.js not found")
        return False
    
    version = result.stdout.strip()
    print(f"✅ Node.js {version} detected")
    return True

def display_banner():
    """Display application banner"""
    banner = """
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   دَِّمَّجَ الْقُرْآن[0m              ║
║   [1;32mDammaj Al-Quran Video Editor	n[0m                 ║
║   [33mComplete Quran Video Editing Suite	
[0m                     ║
║                                                              ║
║   Features:                                                  ║
║   • Automatic Speech Recognition (Whisper)              ║
║   • Quran Verse Matching (6236 verses)               ║
║   • 20+ Fonts & Arabic Typography                    ║
║   • 10+ Professional Templates                         ║
║   • Timeline Editor with Effects                     ║
║   • Multi-format Export (MP4, WebM, MOV)              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"""
    print(banner)

def main():
    """Main launcher function"""
    display_banner()
    
    print("\n🚀 Launching Dammaj Al-Quran Video Editor...\n")
    
    # Check prerequisites
    if not check_python_version():
        sys.exit(1)
    
    if not check_node_version():
        sys.exit(1)
    
    if not check_system_deps():
        print("\n⚠️  Continuing without system dependencies...")
        print("   Note: Video processing features will be limited")
    
    # Ask user what to run
    print("\n📋 What would you like to run?")
    print("1. Full Application (Backend + Frontend + Electron)")
    print("2. Backend Server Only")
    print("3. Frontend Only")
    
    try:
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == "1":
            print("\n🏗️  Starting full application...")
            
            # Install dependencies
            if not install_frontend_deps():
                print("❌ Frontend dependencies failed to install")
                sys.exit(1)
            
            if not install_backend_deps():
                print("❌ Backend dependencies failed to install")
                sys.exit(1)
            
            # Start backend
            backend_process = start_backend()
            time.sleep(2)  # Give backend time to start
            
            # Build frontend
            if not build_frontend():
                print("❌ Frontend build failed")
                backend_process.terminate()
                sys.exit(1)
            
            # Start frontend and Electron
            frontend_process = start_frontend()
            
            print("\n✅ All systems started successfully!")
            print("\n📍 Backend: http://localhost:8000")
            print("📍 Frontend: http://localhost:3000")
            print("🖥️  Electron app launched")
            
            # Wait for shutdown
            print("\n⚡ Press Ctrl+C to shutdown...")
            
            def signal_handler(sig, frame):
                print("\n🛑 Shutting down...")
                backend_process.terminate()
                frontend_process.terminate()
                sys.exit(0)
            
            signal.signal(signal.SIGINT, signal_handler)
            signal.pause()
            
        elif choice == "2":
            print("\n🏗️  Starting backend server only...")
            if not install_backend_deps():
                sys.exit(1)
            
            backend_process = start_backend()
            print("\n✅ Backend server started!")
            print("📍 http://localhost:8000")
            
            print("\n⚡ Press Ctrl+C to shutdown...")
            try:
                backend_process.wait()
            except KeyboardInterrupt:
                print("\n🛑 Shutting down...")
                backend_process.terminate()
                
        elif choice == "3":
            print("\n🏗️  Starting frontend only...")
            if not install_frontend_deps():
                sys.exit(1)
            
            if not build_frontend():
                sys.exit(1)
            
            frontend_process = start_frontend()
            print("\n✅ Frontend server started!")
            print("📍 http://localhost:3000")
            
            print("\n⚡ Press Ctrl+C to shutdown...")
            try:
                frontend_process.wait()
            except KeyboardInterrupt:
                print("\n🛑 Shutting down...")
                frontend_process.terminate()
                
        else:
            print("❌ Invalid choice")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Shutdown requested...")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()