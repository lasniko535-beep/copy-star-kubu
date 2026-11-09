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
    <header class="app-header" style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 1.5rem; background:#111827; border-bottom:1px solid rgba(255,255,255,0.08);">
        <div class="header-left" style="display:flex; align-items:center; gap:0.75rem;">
            <a href="{{ route('home') }}" style="display:flex; align-items:center; gap:0.75rem; text-decoration:none; color:inherit;">
                <span class="logo-icon" style="font-size:1.5rem;">⭐</span>
                <div class="brand-text">
                    <h1 style="font-size:1.15rem; font-weight:800; margin:0; color:#F59E0B;">{{ config('app.name', 'COPY STAR KUBU') }}</h1>
                    <p class="tagline" style="font-size:0.72rem; margin:0; color:#9CA3AF;">Fotokopi Digital, Percetakan Foto & ATK - Laravel 13</p>
                </div>
            </a>
        </div>

        <!-- Menu Navigasi Silang Laravel -->
        <nav style="display:flex; gap:0.5rem; align-items:center;">
            <a href="{{ route('home') }}" class="btn-nav {{ request()->routeIs('home') ? 'active' : '' }}" style="display:flex; align-items:center; gap:0.35rem; text-decoration:none; color:#FFF; font-size:0.82rem; font-weight:600; padding:0.4rem 0.85rem; border-radius:6px; background:{{ request()->routeIs('home') ? '#F59E0B' : 'rgba(255,255,255,0.08)' }};">
                🖥️ <span>Meja Kasir (POS)</span>
            </a>
            <a href="{{ route('transactions.index') }}" class="btn-nav {{ request()->routeIs('transactions.*') ? 'active' : '' }}" style="display:flex; align-items:center; gap:0.35rem; text-decoration:none; color:#FFF; font-size:0.82rem; font-weight:600; padding:0.4rem 0.85rem; border-radius:6px; background:{{ request()->routeIs('transactions.*') ? '#3B82F6' : 'rgba(255,255,255,0.08)' }};">
                📋 <span>Riwayat Transaksi</span>
            </a>
            <a href="{{ route('transactions.export_excel') }}" class="btn-nav" style="display:flex; align-items:center; gap:0.35rem; text-decoration:none; color:#FFF; font-size:0.82rem; font-weight:600; padding:0.4rem 0.85rem; border-radius:6px; background:#10B981;">
                📥 <span>Unduh Excel</span>
            </a>
            <a href="{{ route('owner') }}" class="btn-nav" style="display:flex; align-items:center; gap:0.35rem; text-decoration:none; color:#FFF; font-size:0.82rem; font-weight:600; padding:0.4rem 0.85rem; border-radius:6px; background:rgba(255,255,255,0.08);">
                📊 <span>Dasbor Pemilik</span>
            </a>
            <a href="{{ route('pelanggan') }}" class="btn-nav" style="display:flex; align-items:center; gap:0.35rem; text-decoration:none; color:#FFF; font-size:0.82rem; font-weight:600; padding:0.4rem 0.85rem; border-radius:6px; background:rgba(255,255,255,0.08);">
                📱 <span>Portal Pelanggan</span>
            </a>
        </nav>

        <div class="header-right" style="display:flex; align-items:center; gap:0.75rem;">
            <div class="user-pill" style="background:rgba(255,255,255,0.05); padding:0.35rem 0.75rem; border-radius:999px; border:1px solid rgba(255,255,255,0.1); font-size:0.75rem; color:#D1D5DB;">
                <span class="user-role" style="font-weight:700; color:#10B981;">● Online</span>
                <span class="user-name" style="margin-left:0.35rem;">📍 {{ env('STORE_LOCATION', 'Meja Kasir 1') }}</span>
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
