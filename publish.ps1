# COPY STAR KUBU - One-Click Public Online Tunnel
$ErrorActionPreference = "SilentlyContinue"
$path = $PSScriptRoot

# 1. Pastikan Local Server berjalan di background
$serverJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    & powershell -NoProfile -ExecutionPolicy Bypass -File "$dir\server.ps1" -noBrowser
} -ArgumentList $path

Start-Sleep -Seconds 2

# 2. Jalankan cloudflared tunnel
$cloudflaredPath = Join-Path $path "cloudflared.exe"
if (-not (Test-Path $cloudflaredPath)) {
    Write-Host "Mengunduh komponen cloudflared..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile $cloudflaredPath -UseBasicParsing
}

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "     MEMBUAT LINK PUBLIK INTERNET UNTUK COPY STAR KUBU...       " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " Menghubungkan ke jaringan publik Cloudflare..." -ForegroundColor Gray

$pinfo = New-Object System.Diagnostics.ProcessStartInfo
$pinfo.FileName = $cloudflaredPath
$pinfo.Arguments = "tunnel --url http://127.0.0.1:8080"
$pinfo.RedirectStandardError = $true
$pinfo.UseShellExecute = $false
$p = New-Object System.Diagnostics.Process
$p.StartInfo = $pinfo
$p.Start() | Out-Null

$publicUrl = ""
$startTime = Get-Date

while (-not $p.HasExited -and [string]::IsNullOrEmpty($publicUrl)) {
    $line = $p.StandardError.ReadLine()
    if ($line -match 'https://[a-zA-Z0-9\-]+\.trycloudflare\.com') {
        $publicUrl = $matches[0]
        break
    }
    if (((Get-Date) - $startTime).TotalSeconds -gt 25) {
        break
    }
}

if ($publicUrl) {
    # Salin otomatis ke clipboard Windows
    try {
        Set-Clipboard -Value $publicUrl
    } catch {}

    Clear-Host
    Write-Host ""
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host "          WEBSITE BERHASIL DI-PUBLIKASIKAN KE INTERNET!          " -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  LINK ONLINE ANDA (Bisa dibuka dari HP mana saja):" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  👉 $publicUrl" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host "  [✓] Link sudah otomatis DI-COPY ke Clipboard laptop Anda!" -ForegroundColor White
    Write-Host "      Tinggal tekan Ctrl + V di WhatsApp untuk membagikannya." -ForegroundColor Gray
    Write-Host ""
    Write-Host "  [✓] Perangkat lain (HP, iPhone, Android, Laptop luar) dapat" -ForegroundColor White
    Write-Host "      membuka web ini sekarang selama jendela ini tidak ditutup." -ForegroundColor Gray
    Write-Host ""
    Write-Host "  (Tekan Ctrl + C di jendela ini jika ingin mematikan link online)" -ForegroundColor DarkGray
    Write-Host "=================================================================" -ForegroundColor Green

    # Buka juga di browser Chrome
    $chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
    if (Test-Path $chromePath) {
        Start-Process $chromePath $publicUrl
    } else {
        Start-Process $publicUrl
    }

    # Tunggu proses tunnel tetap aktif
    $p.WaitForExit()
} else {
    Write-Host "Gagal mendapatkan link publik. Pastikan terhubung ke internet." -ForegroundColor Red
}

# Bersihkan job server saat keluar
Stop-Job $serverJob -Force -ErrorAction SilentlyContinue
Remove-Job $serverJob -Force -ErrorAction SilentlyContinue
