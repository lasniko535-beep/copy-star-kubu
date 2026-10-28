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
8. **📊 Dashboard Analitik Owner Sederhana & StarBot AI Assistant**
   * Rekapitulasi omzet penjualan, laba bersih riil, transparansi metode bayar (Tunai, QRIS, Bank, Kasbon).
   * Fitur simulasi uji beban 1.000 - 2.000 transaksi dummy berbasis Laravel & MySQL sesuai arahan dosen.
   * Chatbot AI yang dapat diajak tanya jawab mengenai performa finansial toko dalam bahasa manusia yang ramah.
9. **🛡️ Pusat Cadangan & Pemulihan Database (*Backup & Restore*)**
   * 1-klik unduh seluruh database ke file JSON atau SQL untuk disimpan di flashdisk atau Google Drive.
   * Fitur pulihkan data (*restore*) jika berganti laptop kasir.
   * Fitur ganti PIN Supervisor Owner dan ekspor data ke format Microsoft Excel (.csv).

---

## 🛠️ Teknologi & Framework yang Digunakan

* **Frontend:** Blade Templates / HTML5, CSS3 Modern, JavaScript ES6+ (*Responsive POS & Management Dashboard*).
* **Backend:** Laravel 13 (PHP 8.x) Framework (`artisan`, Controllers, Eloquent Models, API Routes).
* **Database:** MySQL / MariaDB / PostgreSQL (7 Migrations, Seeders, dan SQL Dump 1.500 Transaksi Simulasi Dosen).
* **Format Ekspor:** Microsoft Excel Spreadsheet (`.csv` UTF-8 BOM lengkap hari, tanggal, jam presisi, dan tempat).
* **Offline-First Resilience:** LocalStorage Persistency jika internet di desa padam.

---

## 🚀 Cara Menjalankan Aplikasi

### Opsi 1: Menjalankan Server Resmi Laravel (Rekomendasi Dosen)
Klik ganda file `jalankan_laravel.bat` atau jalankan via terminal:
```bash
php artisan serve --port=8000
```
Aplikasi Laravel akan aktif di browser pada alamat:
`http://localhost:8000`

### Opsi 2: Menjalankan Server Lokal Cepat (Port 8080)
Klik ganda file `jalankan_server.bat` atau jalankan perintah:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Aplikasi akan otomatis terbuka di browser pada alamat:
`http://localhost:8080`

### Opsi 3: Langsung Buka di Browser (Mode Portabel Tanpa Server)
Cukup klik ganda file `index.html` menggunakan Google Chrome atau Microsoft Edge.

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
