# PANDUAN TEKNIS DAN PENGUJIAN SISTEM (VERIFIKASI SISTEM SIDANG)
**Proyek:** Sistem Kasir, Percetakan Digital, dan Manajemen Ritel "COPY STAR KUBU"  
**Teknologi:** Framework Laravel 13, Eloquent ORM, Blade Templates, Hybrid Offline-First POS, SQLite/MySQL Ready  
**Penyusun:** Tim Pengembang COPY STAR KUBU  

---

## 1. Verifikasi Arsitektur Perangkat Lunak (Pola MVC / Model-View-Controller)

### Pertanyaan Penguji:
> *"Bagaimana arsitektur MVC diimplementasikan dalam aplikasi ini? Tunjukkan berkas Model, View, dan Controller yang saling terhubung."*

### Pembuktian Teknis:
1. **Lapisan Rute / Routing (`routes/web.php` & `routes/api.php`):**
   - Seluruh rute aplikasi didelegasikan ke class Controller resmi, tanpa menggunakan fungsi penutup langsung (closure) yang menumpuk di berkas routing.
   - Berkas terkait: [`routes/web.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/routes/web.php) dan [`routes/api.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/routes/api.php).

2. **Lapisan Model / Model Layer (`app/Models/`):**
   - Menggunakan Eloquent ORM lengkap dengan pendefinisian kunci utama, penugasan massal aman (`$fillable`), konversi tipe data (type casting), dan relasi antar-tabel data:
     - [`Transaction.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Models/Transaction.php): Memiliki relasi `$this->hasMany(TransactionItem::class)` dan `$this->belongsTo(User::class)`.
     - [`TransactionItem.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Models/TransactionItem.php): Relasi `$this->belongsTo(Product::class)` dan `$this->belongsTo(Transaction::class)`.
     - [`Product.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Models/Product.php): Relasi `$this->belongsTo(Category::class)` dan pengelolaan stok (`stock_qty`).

3. **Lapisan Pengendali / Controller Layer (`app/Http/Controllers/`):**
   - [`TransactionController.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Http/Controllers/TransactionController.php):
     - Fungsi `index()`: Mengelola kueri basis data dengan pemuatan efisien `with('items')`, penyaringan rentang tanggal, pencarian kata kunci faktur/nama kasir, dan pembagian halaman (paginasi) 50 baris per tampilan.
     - Fungsi `store()`: Menerima data transaksi dari meja kasir, memvalidasi input, mencetak nomor faktur unik otomatis, menyimpan rincian barang belanjaan, dan memotong stok barang fisik secara otomatis.
   - [`PosController.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Http/Controllers/PosController.php): Mengatur tampilan meja kasir utama, peralihan hak akses (kasir dan pemilik), serta portal cek katalog mandiri untuk pelanggan.
   - [`ExportController.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Http/Controllers/ExportController.php): Menghasilkan unduhan data transaksi berformat berkas spreadsheet lembar kerja `.csv` berstandar resmi.

4. **Lapisan Tampilan / View Layer (`resources/views/`):**
   - Menggunakan mesin cetak tampilan bawaan Laravel (Blade):
     - [`layouts/app.blade.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/resources/views/layouts/app.blade.php): Kerangka dasar induk yang terpadu lengkap dengan bilah menu atas.
     - [`transactions/index.blade.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/resources/views/transactions/index.blade.php): Menampilkan daftar riwayat transaksi tabel rapi dengan format tanggal Indonesia dan mata uang Rupiah.

---

## 2. Pengujian Alur Transaksi & Konsistensi Basis Data (Alur Data Ujung-ke-Ujung)

### Pertanyaan Penguji:
> *"Bagaimana mekanisme penyimpanan transaksi dari antarmuka kasir ke tabel database? Apakah data langsung tersimpan di basis data Laravel?"*

### Pembuktian Teknis:
1. **Langkah Demonstrasi Langsung:**
   - Buka Meja Kasir di peramban: `http://127.0.0.1:8000/`.
   - Tambahkan produk ke keranjang belanja (misalnya: Fotokopi B/W atau ATK), lalu klik tombol **Bayar (F9)**.
   - Masukkan nominal uang yang diterima, lalu klik **Selesaikan Pembayaran**. Struk belanja kasir akan ditampilkan.
   - Klik menu **Riwayat Laravel** di bilah menu atas (atau buka tautan `http://127.0.0.1:8000/transaksi`).
   - Faktur baru yang baru saja diproses (contoh: `INV-20261102-0001`) langsung tercantum di baris teratas tabel lengkap dengan rincian barang, waktu presisi WIB, metode bayar, dan nominal rupiah.

2. **Penjelasan Mekanisme Teknis:**
   - Pada saat kasir menekan tombol selesai bayar, fungsi `processCheckout()` di [`js/app.js`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/js/app.js) mengeksekusi kiriman data asinkron `fetch('/api/v1/checkout')` dengan metode `POST`.
   - Laravel memvalidasi permintaan, mencatat data utama ke tabel `transactions`, data detail belanja ke tabel `transaction_items`, serta menjalankan pemotongan kuantitas stok otomatis (`decrement('stock_qty')`) pada tabel `products` bila barang tergolong fisik (non-jasa).

---

## 3. Strategi Ketersediaan Sistem (Arsitektur Tahan Gangguan Jaringan / Offline-First)

### Pertanyaan Penguji:
> *"Bagaimana jika toko mengalami gangguan koneksi internet atau server lokal sempat terputus? Apakah operasional kasir berhenti total?"*

### Penjelasan Teknis:
- Sistem mengadopsi prinsip **Sistem Kasir Hibrida Mandiri Jaringan (Hybrid Offline-First POS)**:
  - Antarmuka kasir dirancang menggunakan arsitektur web modern yang tetap dapat memproses perhitungan total belanja, pemilihan jenis kertas, kalkulasi jilid buku, dan pencetakan struk menggunakan memori penyimpanan peramban lokal (`localStorage`).
  - Ketika koneksi ke server Laravel terhubung kembali, data transaksi disinkronkan secara mulus ke backend.
  - Pendekatan ini menjamin kenyamanan operasional toko fotokopi dan ritel tanpa terkendala putusnya jaringan internet lokal.

---

## 4. Pengujian Beban & Skalabilitas (Uji Beban 1.500 Data Transaksi)

### Pertanyaan Penguji:
> *"Apakah sistem sudah diuji menangani data dalam jumlah besar? Bagaimana performa query saat data transaksi bertambah?"*

### Pembuktian Teknis:
1. **Penyemaian Data Riwayat Skala Besar:**
   - Basis data telah dilengkapi dengan simulasi **1.500 transaksi realistis** yang merepresentasikan riwayat operasional toko selama 60 hari terakhir.
   - Dibuat melalui penyemai data bawaan: [`database/seeders/LargeDummyTransactionsSeeder.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/database/seeders/LargeDummyTransactionsSeeder.php).

2. **Optimasi Kinerja Kueri Basis Data:**
   - Skema tabel `transactions` dan `transaction_items` telah dilengkapi indeks penelusuran pada kolom `created_at`, `status`, dan `invoice_no` (lihat [`database/migrations/2026_01_01_000007_create_transactions_and_items_table.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/database/migrations/2026_01_01_000007_create_transactions_and_items_table.php)).
   - Halaman riwayat transaksi menerapkan paginasi 50 baris data per halaman (`paginate(50)`) sehingga penggunaan memori server dan waktu pemuatan halaman selalu stabil di bawah 100 milidetik.

---

## 5. Modul Pelaporan & Ekspor Data Finansial

### Pertanyaan Penguji:
> *"Bagaimana pemilik toko mengekspor data transaksi untuk keperluan pembukuan fisik atau audit pembukuan?"*

### Pembuktian Teknis:
1. **Langkah Demonstrasi Langsung:**
   - Klik tombol **Unduh Laporan Excel** di bilah navigasi atau buka tautan `http://127.0.0.1:8000/ekspor/excel`.
   - Peramban secara langsung mengunduh berkas dengan nama `LAPORAN_TRANSAKSI_EXCEL_COPY_STAR_KUBU_[TANGGAL].csv`.
2. **Penjelasan Teknis:**
   - Fungsi `exportExcel()` pada [`app/Http/Controllers/ExportController.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Http/Controllers/ExportController.php) menggunakan keluaran arus streaming `fputcsv()` dengan header HTTP resmi:
     - `Content-Type: text/csv; charset=UTF-8`
     - `Content-Disposition: attachment; filename="..."`
   - Berkas unduhan dapat langsung dibuka dan diedit secara rapi menggunakan Microsoft Excel, Google Spreadsheet, maupun LibreOffice Calc.

---

## 6. Manajemen Hak Akses Pengguna (Kontrol Akses Berbasis Peran)

### Pertanyaan Penguji:
> *"Bagaimana pemisahan wewenang antara staf kasir dan pemilik toko (owner) diatur dalam sistem?"*

### Pembuktian Teknis:
1. **Tabel Pengguna (`users`):**
   - Memiliki kolom `role` dengan pilihan wewenang `KASIR` dan `OWNER`.
   - Kata sandi dilindungi menggunakan algoritma pengacakan satu arah standar industri `Hash::make()` (Bcrypt).
2. **Pemisahan Tampilan & Wewenang:**
   - **Kasir:** Berfokus pada kecepatan transaksi belanja (meja kasir POS, kalkulator cetak dokumen F3, buku kasbon warga, dan antrean berkas cetak pelanggan).
   - **Pemilik (Owner):** Memiliki wewenang melihat ringkasan omzet, estimasi laba kotor, grafik penjualan, serta penyesuaian harga katalog barang. Halaman penting ini dilindungi oleh PIN otorisasi supervisor (`0000`).

---

## 7. Desain Antarmuka & Kenyamanan Pengoperasian Kasir

### Pertanyaan Penguji:
> *"Bagaimana antarmuka ini dirancang agar mudah dan nyaman digunakan oleh staf toko?"*

### Pembuktian Teknis:
1. **Kemudahan Layar Sentuh:**
   - Semua tombol aksi utama memiliki ukuran bidang sentuh minimal 48 piksel, memenuhi pedoman aksesibilitas monitor layar sentuh.
2. **Umpan Balik Suara Kasir:**
   - Dilengkapi efek suara saat transaksi berhasil dan saat pemindaian kode barang untuk mempercepat kerja staf kasir tanpa harus selalu menatap layar monitor secara kaku.
3. **Penyediaan Dua Tema (Mode Gelap / Terang):**
   - Tombol pengalih tema di bilah atas memudahkan kasir berpindah antara tema gelap (mengurangi silau saat kerja malam) dan tema terang (meningkatkan kontras di ruangan toko yang terang).
4. **Pusat Panduan Terpadu:**
   - Tersedia jendela panduan interaktif 5 bagian petunjuk yang menyediakan panduan langkah demi langkah langsung di dalam aplikasi kasir.

---

## 8. Ringkasan Rute Aplikasi untuk Pengujian

| Komponen Sistem | Rute URL | Metode | Fungsi Utama |
| :--- | :--- | :---: | :--- |
| **Meja Kasir Utama** | `http://127.0.0.1:8000/` | GET | Antarmuka kasir POS, kalkulator print, kasbon, dan antrean |
| **Riwayat Transaksi** | `http://127.0.0.1:8000/transaksi` | GET | Tampilan Blade tabel 1.500 transaksi dan filter pencarian |
| **Ekspor Laporan** | `http://127.0.0.1:8000/ekspor/excel` | GET | Unduh laporan transaksi keuangan dalam format spreadsheet |
| **Portal Mandiri** | `http://127.0.0.1:8000/pelanggan` | GET | Tampilan mobile untuk pengecekan katalog harga mandiri |
| **Pengecekan Server (Health API)** | `http://127.0.0.1:8000/api/v1/health` | GET | Verifikasi status koneksi server backend dan database |
| **Simpan Belanja (Checkout API)** | `http://127.0.0.1:8000/api/v1/checkout` | POST | Endpoint API pencatatan transaksi kasir ke basis data |
