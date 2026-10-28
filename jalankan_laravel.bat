@echo off
title LARAVEL 13 - COPY STAR KUBU POS SYSTEM
color 0A
echo ==============================================================================
echo    LARAVEL 13 FRAMEWORK (PHP 8.2) - COPY STAR KUBU POS SYSTEM
echo    Aplikasi Kasir, Manajemen Toko & Simulasi 1.500 Transaksi Dummy
echo ==============================================================================
echo Menyinkronkan file aset statis (JS, CSS, Gambar) ke folder public...
xcopy /Y /E /I /Q "%~dp0js" "%~dp0public\js" >nul 2>&1
xcopy /Y /E /I /Q "%~dp0css" "%~dp0public\css" >nul 2>&1
xcopy /Y /E /I /Q "%~dp0img" "%~dp0public\img" >nul 2>&1
copy /Y "%~dp0logo.png" "%~dp0public\logo.png" >nul 2>&1
copy /Y "%~dp0manifest.json" "%~dp0public\manifest.json" >nul 2>&1

echo.
echo Membuka aplikasi di browser: http://localhost:8000 ...
start http://localhost:8000
echo.
echo Menjalankan server Laravel artisan serve...
echo.
if exist "C:\xampp\php\php.exe" (
    "C:\xampp\php\php.exe" artisan serve --port=8000
) else (
    php artisan serve --port=8000
)
pause
