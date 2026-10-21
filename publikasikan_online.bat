@echo off
title COPY STAR KUBU - Publikasikan Website ke Internet
cd /d "%~dp0"
echo ====================================================
echo Menyiapkan Link Publik Internet COPY STAR KUBU...
echo ====================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0publish.ps1"
pause
