@echo off
title COPY STAR KUBU - Web Server
cd /d "%~dp0"
echo ====================================================
echo Menjalankan Web Server COPY STAR KUBU...
echo ====================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
