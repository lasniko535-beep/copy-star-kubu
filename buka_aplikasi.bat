@echo off
title COPY STAR KUBU - Smart POS System
echo ====================================================
echo Membuka Aplikasi Kasir & Manajemen COPY STAR KUBU...
echo ====================================================

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "%~dp0index.html"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "%~dp0index.html"
) else (
    start "" "%~dp0index.html"
)

exit
