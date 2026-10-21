# Script pembuat shortcut desktop untuk Kasir & Owner
$ErrorActionPreference = "Stop"
$desktop = [System.Environment]::GetFolderPath("Desktop")
$projectDir = $PSScriptRoot

# Bersihkan shortcut demo lama jika masih ada
$oldDemoBat = Join-Path $desktop "DEMO_DOSEN_COPY_STAR.bat"
$oldDemoLnk = Join-Path $desktop "Demo Dosen - COPY STAR KUBU.lnk"
if (Test-Path $oldDemoBat) { Remove-Item $oldDemoBat -Force -ErrorAction SilentlyContinue }
if (Test-Path $oldDemoLnk) { Remove-Item $oldDemoLnk -Force -ErrorAction SilentlyContinue }

# 1. Buat file .bat launcher langsung di Desktop
$batPath = Join-Path $desktop "Buka COPY STAR KUBU.bat"
$batLines = @(
    "@echo off",
    "title COPY STAR KUBU - Kasir & Owner",
    "cd /d `"$projectDir`"",
    "call `"$projectDir\buka_aplikasi.bat`""
)
[System.IO.File]::WriteAllLines($batPath, $batLines, [System.Text.Encoding]::ASCII)
Write-Host "File launcher dibuat: $batPath" -ForegroundColor Green

# 2. Buat Windows Shortcut .lnk di Desktop
try {
    $wscript = New-Object -ComObject WScript.Shell
    $shortcutPath = Join-Path $desktop "COPY STAR KUBU.lnk"
    $shortcut = $wscript.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = Join-Path $projectDir "buka_aplikasi.bat"
    $shortcut.WorkingDirectory = $projectDir
    $shortcut.Description = "Aplikasi Kasir & Dashboard Owner - COPY STAR KUBU"
    $shortcut.Save()
    Write-Host "Shortcut Windows dibuat: $shortcutPath" -ForegroundColor Green
} catch {
    Write-Host "Catatan: Pembuatan .lnk dilewati ($($_.Exception.Message))" -ForegroundColor Yellow
}

# 3. Buat file .bat launcher Portal Pelanggan di Desktop
$custBatPath = Join-Path $desktop "Portal Order Pelanggan - COPY STAR KUBU.bat"
$custBatLines = @(
    "@echo off",
    "title COPY STAR KUBU - Portal Order Pelanggan",
    "cd /d `"$projectDir`"",
    "call `"$projectDir\buka_portal_pelanggan.bat`""
)
[System.IO.File]::WriteAllLines($custBatPath, $custBatLines, [System.Text.Encoding]::ASCII)
Write-Host "File launcher Portal Pelanggan dibuat: $custBatPath" -ForegroundColor Green

