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
                        <th style="padding:0.75rem; text-align:center;">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($transactions as $t)
                    @php
                        $dayName = 'Hari ini';
                        $dateStr = '-';
                        $timeStr = '00:00:00';
                        if ($t->created_at) {
                            try {
                                $c = \Carbon\Carbon::parse($t->created_at);
                                $dayName = $c->locale('id')->isoFormat('dddd');
                                $dateStr = $c->format('d M Y');
                                $timeStr = $c->format('H:i:s');
                            } catch (\Throwable $e) {}
                        }
                    @endphp
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:0.75rem; font-family:monospace; font-weight:700; color:var(--primary);">
                            {{ $t->invoice_no }}
                        </td>
                        <td style="padding:0.75rem;">
                            <strong>{{ $dayName }}</strong><br>
                            <small style="color:var(--text-muted);">{{ $dateStr }}</small>
                        </td>
                        <td style="padding:0.75rem; color:#F59E0B; font-weight:600;">
                            <svg class="inline-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> {{ $timeStr }} WIB
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
                        <td style="padding:0.75rem; text-align:center;">
                            <button type="button" class="btn-secondary-sm" onclick="showInvoiceDetail('{{ $t->invoice_no }}')" style="padding:0.25rem 0.6rem; font-size:0.75rem; border-radius:6px; background:rgba(59,130,246,0.15); color:#60A5FA; border:1px solid rgba(59,130,246,0.35); cursor:pointer; font-weight:600;">
                                <svg class="inline-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Detail
                            </button>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="8" style="text-align:center; padding:2rem; color:var(--text-muted);">
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

<!-- Modal Detail Nota Transaksi Blade -->
<div id="bladeInvoiceModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.75); z-index:9999; align-items:center; justify-content:center; padding:1rem;">
    <div style="background:#1F2937; border:1px solid rgba(255,255,255,0.15); border-radius:12px; width:100%; max-width:520px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.5); overflow:hidden;">
        <div style="padding:1rem 1.25rem; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center;">
            <h3 style="margin:0; font-size:1.1rem; color:#FFF; display:flex; align-items:center; gap:0.5rem;">
                <svg class="inline-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                Rincian Nota Transaksi
            </h3>
            <button type="button" onclick="closeInvoiceDetail()" style="background:none; border:none; color:var(--text-muted); font-size:1.4rem; cursor:pointer; line-height:1;">&times;</button>
        </div>
        <div id="bladeInvoiceContent" style="padding:1.25rem; max-height:70vh; overflow-y:auto; font-size:0.85rem; color:#E5E7EB;">
            Memuat rincian nota...
        </div>
        <div style="padding:0.75rem 1.25rem; border-top:1px solid rgba(255,255,255,0.1); display:flex; justify-content:flex-end; gap:0.5rem; background:rgba(0,0,0,0.2);">
            <button type="button" onclick="window.print()" class="btn-primary" style="background:#3B82F6; color:#FFF; border:none; padding:0.4rem 1rem; border-radius:6px; cursor:pointer; font-weight:600;">
                <svg class="inline-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> Cetak Struk
            </button>
            <button type="button" onclick="closeInvoiceDetail()" class="btn-secondary" style="background:rgba(255,255,255,0.1); color:#FFF; border:none; padding:0.4rem 1rem; border-radius:6px; cursor:pointer;">
                Tutup
            </button>
        </div>
    </div>
</div>

<script>
function showInvoiceDetail(invoiceNo) {
    const modal = document.getElementById('bladeInvoiceModal');
    const content = document.getElementById('bladeInvoiceContent');
    if (!modal || !content) return;
    modal.style.display = 'flex';
    content.innerHTML = '<div style="text-align:center; padding:1.5rem;">Memuat rincian transaksi...</div>';

    fetch('/transaksi/' + encodeURIComponent(invoiceNo), {
        headers: { 'Accept': 'application/json' }
    })
    .then(r => r.json())
    .then(res => {
        if (!res.success || !res.data) {
            content.innerHTML = '<div style="color:var(--danger); padding:1rem;">Gagal mengambil data nota.</div>';
            return;
        }
        const d = res.data;
        let itemsHtml = (d.items || []).map(it => `
            <div style="display:flex; justify-content:space-between; padding:0.35rem 0; border-bottom:1px dashed rgba(255,255,255,0.08);">
                <div>
                    <div><strong>${it.product_name}</strong></div>
                    <small style="color:var(--text-muted);">${it.qty} x Rp ${Number(it.unit_sell_price).toLocaleString('id-ID')}</small>
                </div>
                <div style="font-weight:700;">Rp ${Number(it.subtotal).toLocaleString('id-ID')}</div>
            </div>
        `).join('');

        content.innerHTML = `
            <div style="margin-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.75rem;">
                <div style="font-family:monospace; font-size:1.1rem; font-weight:800; color:#F59E0B;">${d.invoice_no}</div>
                <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">${d.day}, ${d.date} • ${d.time}</div>
                <div style="font-size:0.8rem; color:var(--text-muted);">${d.location}</div>
            </div>
            <div style="margin-bottom:1rem;">
                <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:0.5rem;">Daftar Item Belanja:</div>
                ${itemsHtml}
            </div>
            <div style="background:rgba(0,0,0,0.3); padding:0.75rem; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                    <span>Subtotal</span><span>Rp ${Number(d.subtotal).toLocaleString('id-ID')}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem; color:#EF4444;">
                    <span>Diskon</span><span>- Rp ${Number(d.discount).toLocaleString('id-ID')}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:1.05rem; font-weight:800; color:#10B981; border-top:1px solid rgba(255,255,255,0.1); padding-top:0.35rem;">
                    <span>Total Akhir</span><span>Rp ${Number(d.final_total).toLocaleString('id-ID')}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-top:0.35rem; color:var(--text-muted);">
                    <span>Metode Bayar</span><span style="font-weight:700; color:#FFF;">${d.payment_method}</span>
                </div>
            </div>
        `;
    })
    .catch(err => {
        content.innerHTML = '<div style="color:var(--danger); padding:1rem;">Terjadi kesalahan: ' + err.message + '</div>';
    });
}
function closeInvoiceDetail() {
    const modal = document.getElementById('bladeInvoiceModal');
    if (modal) modal.style.display = 'none';
}
</script>
@endsection
