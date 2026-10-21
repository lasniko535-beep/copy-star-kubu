@echo off
title Upload COPY STAR KUBU ke GitHub
color 0b
echo ==============================================================
echo       UPLOAD PROYEK COPY STAR KUBU KE GITHUB
echo ==============================================================
echo.
echo Repositori Target:
echo https://github.com/lasniko535-beep/copy-star-kubu.git
echo.
echo Sedang melakukan sinkronisasi dan push ke branch main...
echo.

git branch -M main
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    color 0a
    echo ==============================================================
    echo    [SUKSES] Proyek berhasil di-upload ke GitHub!
    echo    Silakan buka repositori Anda di browser:
    echo    https://github.com/lasniko535-beep/copy-star-kubu
    echo ==============================================================
) else (
    color 0c
    echo ==============================================================
    echo    [PERHATIAN] Terjadi kendala saat upload.
    echo    Pastikan Anda telah login saat popup browser muncul.
    echo ==============================================================
)
echo.
pause
