@echo off
title COPY STAR KUBU - Portal Order Pelanggan
echo ====================================================
echo Membuka Portal Order Pelanggan Mandiri COPY STAR KUBU...
echo Mode: Order Online / Self-Service Kiosk Pelanggan
echo ====================================================

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "%~dp0index.html?mode=customer"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "%~dp0index.html?mode=customer"
) else (
    start "" "%~dp0index.html?mode=customer"
)

exit
