<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'COPY STAR KUBU - Sistem Kasir & Percetakan Digital')</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    
    <!-- CSS Assets -->
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    
    @yield('styles')
</head>
<body class="theme-dark">
    <!-- Navbar / Header Laravel Blade -->
    <header class="app-header">
        <div class="header-left">
            <div class="brand-logo">
                <span class="logo-icon">⭐</span>
                <div class="brand-text">
                    <h1>{{ config('app.name', 'COPY STAR KUBU') }}</h1>
                    <p class="tagline">Digital Photocopy, Photo Printing & ATK - Laravel 13</p>
                </div>
            </div>
        </div>
        <div class="header-right">
            <div class="user-pill">
                <span class="user-role">Sistem Aktif</span>
                <span class="user-name">📍 {{ env('STORE_LOCATION', 'Meja Kasir 1') }}</span>
            </div>
        </div>
    </header>

    <!-- Main Content Blade -->
    <main class="app-main-content">
        @yield('content')
    </main>

    <!-- Scripts -->
    <script src="{{ asset('js/data.js') }}"></script>
    <script src="{{ asset('js/app.js') }}"></script>
    @yield('scripts')
</body>
</html>
