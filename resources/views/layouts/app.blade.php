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
                <span class="logo-icon" style="font-size:1.5rem; display:inline-flex; align-items:center;"><svg class="inline-icon" width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>
                <div class="brand-text">
                    <h1 style="font-size:1.15rem; font-weight:800; margin:0; color:#F59E0B;">{{ config('app.name', 'COPY STAR KUBU') }}</h1>
                    <p class="tagline" style="font-size:0.72rem; margin:0; color:#9CA3AF;">Fotokopi Digital, Percetakan Foto & ATK - Laravel 13</p>
                </div>
            </a>
        </div>

        <!-- Menu Navigasi Silang Laravel -->
        <nav style="display:flex; gap:0.5rem; align-items:center;">
            <a href="{{ route('home') }}" class="btn-nav {{ request()->routeIs('home') ? 'active' : '' }}" style="display:flex; align-items:center; gap:0.35rem; text-decoration:none; color:#FFF; font-size:0.82rem; font-weight:600; padding:0.4rem 0.85rem; border-radius:6px; background:{{ request()->routeIs('home') ? '#F59E0B' : 'rgba(255,255,255,0.08)' }};">
                <svg class="inline-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> <span>Meja Kasir (POS)</span>
            </a>
            <a href="{{ route('transactions.index') }}" class="btn-nav {{ request()->routeIs('transactions.*') ? 'active' : '' }}" style="display:flex; align-items:center; gap:0.35rem; text-decoration:none; color:#FFF; font-size:0.82rem; font-weight:600; padding:0.4rem 0.85rem; border-radius:6px; background:{{ request()->routeIs('transactions.*') ? '#3B82F6' : 'rgba(255,255,255,0.08)' }};">
                <svg class="inline-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> <span>Riwayat Transaksi</span>
            </a>
            <a href="{{ route('transactions.export_excel') }}" class="btn-nav" style="display:flex; align-items:center; gap:0.35rem; text-decoration:none; color:#FFF; font-size:0.82rem; font-weight:600; padding:0.4rem 0.85rem; border-radius:6px; background:#10B981;">
                <svg class="inline-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> <span>Unduh Excel</span>
            </a>
            <a href="{{ route('owner') }}" class="btn-nav" style="display:flex; align-items:center; gap:0.35rem; text-decoration:none; color:#FFF; font-size:0.82rem; font-weight:600; padding:0.4rem 0.85rem; border-radius:6px; background:rgba(255,255,255,0.08);">
                <svg class="inline-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> <span>Dasbor Pemilik</span>
            </a>
            <a href="{{ route('pelanggan') }}" class="btn-nav" style="display:flex; align-items:center; gap:0.35rem; text-decoration:none; color:#FFF; font-size:0.82rem; font-weight:600; padding:0.4rem 0.85rem; border-radius:6px; background:rgba(255,255,255,0.08);">
                <svg class="inline-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> <span>Portal Pelanggan</span>
            </a>
        </nav>

        <div class="header-right" style="display:flex; align-items:center; gap:0.75rem;">
            <div class="user-pill" style="background:rgba(255,255,255,0.05); padding:0.35rem 0.75rem; border-radius:999px; border:1px solid rgba(255,255,255,0.1); font-size:0.75rem; color:#D1D5DB;">
                <span class="user-role" style="font-weight:700; color:#10B981;">● Online</span>
                <span class="user-name" style="margin-left:0.35rem;"><svg class="inline-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> {{ env('STORE_LOCATION', 'Meja Kasir 1') }}</span>
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
