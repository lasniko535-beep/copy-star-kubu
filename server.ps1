# COPY STAR KUBU - Local Web Server (Pure PowerShell / .NET HttpListener)
param(
    [string]$query = "",
    [switch]$noBrowser
)
$port = 8080
$path = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
} catch {
    Write-Host "Port $port sedang digunakan. Mencoba port 8081..." -ForegroundColor Yellow
    $port = 8081
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Prefixes.Add("http://127.0.0.1:$port/")
    $listener.Start()
}

# Dapatkan IP Wi-Fi / LAN lokal untuk info tampilan
$localIp = ""
try {
    $localIp = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object { 
        $_.InterfaceAlias -notlike "*Loopback*" -and 
        $_.InterfaceAlias -notlike "*vEthernet*" -and 
        $_.IPAddress -notlike "169.254*" 
    } | Select-Object -First 1).IPAddress
} catch {}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       COPY STAR KUBU - WEB SERVER AKTIF                 " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Link di Komputer ini : http://localhost:$port/" -ForegroundColor Yellow
Write-Host "  Link Alternatif      : http://127.0.0.1:$port/" -ForegroundColor Yellow
if ($localIp) {
    Write-Host "  Link Kasir & Owner   : http://$($localIp):$port/" -ForegroundColor Cyan
    Write-Host "  Link Portal Pelanggan: http://$($localIp):$port/?mode=customer" -ForegroundColor Green
}
Write-Host "----------------------------------------------------------" -ForegroundColor DarkGray
if (-not $noBrowser) {
    Write-Host "  Membuka Google Chrome otomatis..." -ForegroundColor Gray
}
Write-Host "  Tekan Ctrl + C di jendela ini jika ingin mematikan server." -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Cyan

# Buka otomatis di Google Chrome
if (-not $noBrowser) {
    $targetUrl = "http://localhost:$port/$query"
    $chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
    if (Test-Path $chromePath) {
        Start-Process $chromePath $targetUrl
    } else {
        Start-Process $targetUrl
    }
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".txt"  = "text/plain; charset=utf-8"
    ".sql"  = "text/plain; charset=utf-8"
    ".md"   = "text/plain; charset=utf-8"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $request = $context.Request
            $response = $context.Response

            $reqPath = $request.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrEmpty($reqPath)) {
                $reqPath = "index.html"
            }
            $reqPath = [System.Uri]::UnescapeDataString($reqPath).Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $filePath = Join-Path $path $reqPath

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                $response.ContentType = $mime
                $response.Headers.Add("Access-Control-Allow-Origin", "*")
                $buffer = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $buffer.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            } else {
                $response.StatusCode = 404
                $errBuffer = [System.Text.Encoding]::UTF8.GetBytes("<html><body><h2>404 - File Not Found</h2><p>$reqPath</p></body></html>")
                $response.ContentType = "text/html"
                $response.ContentLength64 = $errBuffer.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($errBuffer, 0, $errBuffer.Length)
                }
            }
            $response.Close()
        } catch {
            try { $context.Response.Abort() } catch {}
        }
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }
}
