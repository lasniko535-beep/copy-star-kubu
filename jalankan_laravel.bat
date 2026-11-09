@echo off
title LARAVEL 13 - COPY STAR KUBU POS SYSTEM
color 0A
echo ==============================================================================
echo    LARAVEL 13 FRAMEWORK (PHP 8.2) - COPY STAR KUBU POS SYSTEM
echo    Sistem Kasir, Percetakan, Manajemen Toko & Riwayat Transaksi Laravel
echo ==============================================================================
echo [1/3] Menyinkronkan file sistem & aset statis (JS, CSS, Gambar, HTML)...
xcopy /Y /E /I /Q "%~dp0js" "%~dp0public\js" >nul 2>&1
xcopy /Y /E /I /Q "%~dp0css" "%~dp0public\css" >nul 2>&1
xcopy /Y /E /I /Q "%~dp0img" "%~dp0public\img" >nul 2>&1
copy /Y "%~dp0index.html" "%~dp0public\index.html" >nul 2>&1
copy /Y "%~dp0logo.png" "%~dp0public\logo.png" >nul 2>&1
copy /Y "%~dp0manifest.json" "%~dp0public\manifest.json" >nul 2>&1
copy /Y "%~dp0ui-ux-prototype.html" "%~dp0public\ui-ux-prototype.html" >nul 2>&1

echo [2/3] Memeriksa status port 8000 server Laravel...
netstat -ano | findstr :8000 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo       Server Laravel sudah berjalan aktif di port 8000.
    echo [3/3] Membuka aplikasi kasir di browser...
    start http://localhost:8000
    echo.
    echo ==============================================================================
    echo  APLIKASI SIAP DIPRESENTASIKAN!
    echo  - Kasir POS & 75 Produk:   http://localhost:8000
    echo  - Riwayat Transaksi Blade: http://localhost:8000/transaksi
    echo  - Ekspor Laporan Excel:    http://localhost:8000/ekspor/excel
    echo ==============================================================================
    echo Tekan tombol apa saja untuk menutup jendela ini (server tetap berjalan).
    pause >nul
    exit
)

echo [3/3] Menyiapkan pembukaan browser otomatis...
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:8000"

echo.
echo ==============================================================================
echo  MENJALANKAN SERVER LARAVEL (artisan serve)...
echo  Jangan tutup jendela hitam ini selama presentasi / demo aplikasi!
echo  - Kasir POS & 75 Produk:   http://localhost:8000
echo  - Riwayat Transaksi Blade: http://localhost:8000/transaksi
echo  - Ekspor Laporan Excel:    http://localhost:8000/ekspor/excel
echo ==============================================================================
echo.

if exist "C:\xampp\php\php.exe" (
    "C:\xampp\php\php.exe" artisan serve --host=0.0.0.0 --port=8000
) else (
    php artisan serve --host=0.0.0.0 --port=8000
)

pause
