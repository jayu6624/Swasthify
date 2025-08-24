#!/usr/bin/env python3
"""
Setup script for SnapMeal Python dependencies
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required Python packages"""
    try:
        print("Installing Python dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Python dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def test_imports():
    """Test if all required modules can be imported"""
    try:
        import google.generativeai
        import PIL
        import requests
        import dotenv
        import absl.logging
        print("✅ All Python modules imported successfully!")
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

def main():
    print("🔧 Setting up SnapMeal Python environment...")
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Test imports
    if not test_imports():
        print("Please install missing dependencies manually:")
        print("pip install -r requirements.txt")
        sys.exit(1)
    
    print("🎉 SnapMeal Python environment is ready!")

if __name__ == "__main__":
    main() 