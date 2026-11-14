@extends('layouts.app')

@section('title', 'Riwayat Transaksi Detail - COPY STAR KUBU')

@section('content')
<div class="container-fluid" style="padding: 1.5rem;">
    <div class="card-panel">
        <div class="panel-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem;">
            <div>
                <h2 style="margin:0; font-size:1.25rem; color:#FFF;"><svg class="inline-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Riwayat Transaksi Kasir & Cetak Nota</h2>
                <p style="margin:0.25rem 0 0 0; font-size:0.85rem; color:var(--text-muted);">
                    Data tercatat otomatis per hari, tanggal, jam presisi, dan lokasi kasir fisik.
                </p>
            </div>
            
            <!-- Tombol Ekspor Excel Laravel -->
            <div style="display:flex; gap:0.5rem; align-items:center;">
                <form method="GET" action="{{ route('transactions.export_excel') }}" style="display:inline;">
                    @if(request('date'))
                        <input type="hidden" name="date" value="{{ request('date') }}">
                    @endif
                    <button type="submit" class="btn-primary" style="background:#10B981; color:#FFF; font-weight:600; padding:0.45rem 1rem; border-radius:8px; border:none; cursor:pointer;">
                        <svg class="inline-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Unduh Laporan Excel (.csv)
                    </button>
                </form>
            </div>
        </div>

        <!-- Filter Form Blade -->
        <form method="GET" action="{{ route('transactions.index') }}" style="background:rgba(255,255,255,0.04); padding:1rem; border-radius:10px; margin-bottom:1rem; display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
            <div style="display:flex; align-items:center; gap:0.4rem;">
                <label for="date" style="font-size:0.82rem; color:#D1D5DB; font-weight:600;"><svg class="inline-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Tanggal:</label>
                <input type="date" name="date" id="date" value="{{ request('date') }}" style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); color:#FFF; padding:0.35rem 0.6rem; border-radius:6px; font-size:0.82rem;">
            </div>

            <div style="display:flex; align-items:center; gap:0.4rem; flex:1; min-width:200px;">
                <input type="text" name="search" placeholder="Cari Faktur / Nama Pelanggan / Catatan..." value="{{ request('search') }}" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); color:#FFF; padding:0.35rem 0.6rem; border-radius:6px; font-size:0.82rem;">
            </div>

            <button type="submit" class="btn-secondary" style="padding:0.35rem 0.85rem; font-size:0.82rem; border-radius:6px; background:rgba(255,255,255,0.1); color:#FFF; border:none; cursor:pointer;">
                <svg class="inline-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> Filter Data
            </button>
            <a href="{{ route('transactions.index') }}" class="btn-link" style="color:var(--text-muted); font-size:0.82rem; text-decoration:none;">Reset</a>
        </form>

        <!-- Tabel Transaksi Blade -->
        <div class="table-responsive" style="overflow-x:auto;">
            <table class="modern-table" style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.1); text-align:left;">
                        <th style="padding:0.75rem;">No. Faktur</th>
                        <th style="padding:0.75rem;">Hari & Tanggal</th>
                        <th style="padding:0.75rem;">Jam Presisi</th>
                        <th style="padding:0.75rem;">Tempat / Lokasi</th>
                        <th style="padding:0.75rem;">Rincian Barang</th>
                        <th style="padding:0.75rem;">Metode</th>
                        <th style="padding:0.75rem; text-align:right;">Total Belanja</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($transactions as $t)
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:0.75rem; font-family:monospace; font-weight:700; color:var(--primary);">
                            {{ $t->invoice_no }}
                        </td>
                        <td style="padding:0.75rem;">
                            <strong>{{ \Carbon\Carbon::parse($t->created_at)->locale('id')->isoFormat('dddd') }}</strong><br>
                            <small style="color:var(--text-muted);">{{ \Carbon\Carbon::parse($t->created_at)->format('d M Y') }}</small>
                        </td>
                        <td style="padding:0.75rem; color:#F59E0B; font-weight:600;">
                            <svg class="inline-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> {{ \Carbon\Carbon::parse($t->created_at)->format('H:i:s') }} WIB
                        </td>
                        <td style="padding:0.75rem;">
                            <strong><svg class="inline-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> {{ $t->location_place ?? 'COPY STAR KUBU - Meja Kasir 1' }}</strong><br>
                            <small style="color:var(--text-muted);">Jln. Soeparto 1 Kubu</small>
                        </td>
                        <td style="padding:0.75rem; max-width:250px;">
                            @if($t->items->count() > 0)
                                <div style="font-size:0.8rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                                    {{ $t->items->count() }} Item ({{ $t->items->pluck('product_name')->take(2)->implode(', ') }}...)
                                </div>
                            @else
                                <span style="font-size:0.8rem; color:var(--text-muted);">Layanan Fotokopi / Percetakan</span>
                            @endif
                        </td>
                        <td style="padding:0.75rem;">
                            <span class="badge" style="padding:0.2rem 0.5rem; border-radius:4px; font-size:0.75rem; font-weight:700; background:rgba(255,255,255,0.08);">
                                {{ $t->payment_method }}
                            </span>
                        </td>
                        <td style="padding:0.75rem; text-align:right; font-weight:700; color:#10B981;">
                            Rp {{ number_format($t->final_amount, 0, ',', '.') }}
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">
                            Tidak ada transaksi ditemukan pada filter yang dipilih.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div style="margin-top:1rem;">
            {{ $transactions->links() }}
        </div>
    </div>
</div>
@endsection
