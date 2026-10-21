# 🌟 COPY STAR KUBU - Sistem Informasi Kasir & Ritel Pintar Berbasis Web

> **Sistem Informasi Manajemen (SIM) Kasir & Manajemen Toko Pintar** untuk unit usaha jasa fotokopi digital, percetakan pas foto kilat, penjilidan, dan penjualan Alat Tulis Kantor (ATK) pada **COPY STAR KUBU** (Jln. Soeparto 1 Kubu, Kab. Kubu Raya, Kalimantan Barat).

---

## 📌 Ringkasan Proyek

COPY STAR KUBU Smart Retail & POS System dirancang untuk menjawab kompleksitas usaha fotokopi dan ATK yang memiliki karakteristik transaksi beririsan, perhitungan tarif jasa bertingkat (*Tiered Pricing*), kultur pembukuan kasbon warga pedesaan, serta kebutuhan asisten analitik bagi pemilik (*owner*).

Sistem ini dibangun dengan arsitektur **100% Offline-First** tanpa ketergantungan server berbayar, aman dari pemadaman sinyal internet, dan hemat biaya operasional bagi UMKM.

---

## ✨ Fitur-Fitur Unggulan

1. **⚡ Kalkulator Cetak & Fotokopi Cerdas (`F3` - Tiered Pricing Engine)**
   * Perhitungan otomatis tarif grosir berjenjang (1-10 lbr, 11-50 lbr, >100 lbr).
   * Pilihan bahan lengkap: HVS 70g, HVS 80g, Buffalo, Glossy Foto.
   * Finishing otomatis: Jilid lakban, spiral, mika, dan laminating.
2. **🗂️ Kasir Multi-Sesi Simultan (`F4` - Concurrent POS Tabs)**
   * Menampung hingga 5 transaksi pelanggan sekaligus tanpa kehilangan item keranjang belanja.
   * Memecah antrean ketika pelanggan cetak dokumen banyak menunggu proses cetak.
3. **📸 Studio Pas Foto Kilat & Layout Cetak 4R Otomatis**
   * Editor *crop* foto dan ganti warna latar belakang resmi (Merah KTP ganjil / Biru KTP genap).
   * Otomatis menata paket pas foto (2x3, 3x4, 4x6) dalam satu lembar foto 4R siap cetak dalam 2 menit.
4. **📲 Portal Pesanan Mandiri & Auto-Count Halaman PDF via WhatsApp**
   * Pelanggan dapat mengunggah berkas PDF dari rumah; jumlah halaman dihitung otomatis.
   * Diteruskan ke WhatsApp resmi toko tanpa biaya sewa API (*Zero-Cost Gateway*).
5. **📒 Modul Buku Kasbon Warga Pedesaan & Pengingat Tagihan Santun**
   * Pencatatan piutang tempo warga, jatuh tempo, dan riwayat angsuran.
   * Tombol 1-klik kirim pengingat WhatsApp dengan bahasa penagihan yang santun dan ramah.
6. **📦 Manajemen Persediaan & Kartu Stok Otomatis (*Stock Ledger*)**
   * Mutasi stok otomatis (Masuk, Keluar, Koreksi Opname).
   * Notifikasi stok menipis (*Low Stock Alert*) dan deteksi barang lambat laku (*Dead Stock*).
7. **💰 Audit Shift Kasir & Rekonsiliasi Laci Kasir (*Cash Drawer*)**
   * Pengecekan selisih uang fisik laci (*cash variance*) saat tutup giliran kerja staf.
8. **📊 Dashboard Business Intelligence & Asisten StarBot AI**
   * Grafik tren omzet harian, estimasi HPP, margin laba bersih riil, dan *heatmap* jam-jam sibuk toko.
   * Chatbot AI yang dapat diajak tanya jawab mengenai performa finansial toko.
9. **🛡️ Pusat Cadangan & Pemulihan Database (*Backup & Restore*)**
   * 1-klik unduh seluruh database ke file JSON untuk disimpan di flashdisk atau Google Drive.
   * Fitur pulihkan data (*restore*) jika berganti laptop kasir.
   * Fitur ganti PIN Supervisor Owner dan ekspor data ke format Microsoft Excel (.csv).

---

## 🛠️ Teknologi yang Digunakan

* **Front-End:** HTML5 Semantic, Modern Vanilla CSS3 (Glassmorphism & Responsive Layout), JavaScript ES6+ State Machine.
* **Penyimpanan Data:** Web LocalStorage Persistency (*Offline-First Architecture*).
* **Database Schema:** SQL Relational Schema (`schema.sql`).
* **Desktop Launcher:** PowerShell & Batch Scripts (`buka_aplikasi.bat`, `server.ps1`).

---

## 🚀 Cara Menjalankan Aplikasi

### Opsi 1: Langsung Buka di Browser (Paling Mudah)
Cukup klik ganda (double-click) file `index.html` menggunakan Google Chrome, Microsoft Edge, atau browser modern lainnya.

### Opsi 2: Menggunakan Server Lokal
Klik ganda file `jalankan_server.bat` atau jalankan perintah berikut di terminal:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Aplikasi akan otomatis terbuka di browser pada alamat:
`http://localhost:8080`

---

## 👥 Akun Akses Pengguna (Default)

* **Kasir 1 (Niko):** Login Cepat via Tombol "Niko" (PIN Kasir)
* **Kasir 2 (Owen Kevin):** Login Cepat via Tombol "Owen Kevin"
* **Kasir 3 (Thomas):** Login Cepat via Tombol "Thomas"
* **Pemilik Toko (Owner):** Login via Tombol "Owner" / PIN Supervisor: `0000` *(dapat diubah di menu Cadangan & Keamanan)*
* **Portal Pelanggan:** Akses Mandiri Bebas Password

---

## 📄 Lisensi & Hak Cipta
Dikembangkan untuk **Unit Usaha COPY STAR KUBU**  
Jln. Soeparto 1 Kubu, Desa Kubu, Kec. Kubu, Kab. Kubu Raya, Kalimantan Barat.  
© 2026 Tim Proyek UAS Sistem Informasi Manajemen (SIM) - UBSI.
