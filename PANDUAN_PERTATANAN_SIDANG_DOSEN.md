# PANDUAN TEKNIS DAN PENGUJIAN SISTEM (SYSTEM VERIFICATION GUIDE)
**Proyek:** Sistem Kasir, Percetakan Digital, dan Manajemen Ritel "COPY STAR KUBU"  
**Teknologi:** Framework Laravel 13, Eloquent ORM, Blade Templates, Hybrid Offline-First POS, SQLite/MySQL Ready  
**Penyusun:** Tim Pengembang COPY STAR KUBU  

---

## 1. Verifikasi Arsitektur Perangkat Lunak (Model-View-Controller)

### Pertanyaan Penguji:
> *"Bagaimana arsitektur MVC diimplementasikan dalam aplikasi ini? Tunjukkan berkas Model, View, dan Controller yang saling terhubung."*

### Pembuktian Teknis:
1. **Routing Layer (`routes/web.php` & `routes/api.php`):**
   - Seluruh rute aplikasi didelegasikan ke class Controller resmi, tanpa menggunakan logic closure yang menumpuk di file routing.
   - Berkas terkait: [`routes/web.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/routes/web.php) dan [`routes/api.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/routes/api.php).

2. **Model Layer (`app/Models/`):**
   - Menggunakan Eloquent ORM lengkap dengan pendefinisian primary key, mass assignment (`$fillable`), type casting, dan relasi antar-entitas:
     - [`Transaction.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Models/Transaction.php): Memiliki relasi `$this->hasMany(TransactionItem::class)` dan `$this->belongsTo(User::class)`.
     - [`TransactionItem.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Models/TransactionItem.php): Relasi `$this->belongsTo(Product::class)` dan `$this->belongsTo(Transaction::class)`.
     - [`Product.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Models/Product.php): Relasi `$this->belongsTo(Category::class)` dan pengelolaan stok (`stock_qty`).

3. **Controller Layer (`app/Http/Controllers/`):**
   - [`TransactionController.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Http/Controllers/TransactionController.php):
     - Method `index()`: Mengelola query builder dengan eager loading `with('items')`, filter tanggal, pencarian kata kunci, dan pagination data 50 baris per halaman.
     - Method `store()`: Menerima payload transaksi dari kasir, memvalidasi input, membuat nomor faktur unik, menyimpan rincian barang, dan memotong stok barang fisik secara otomatis.
   - [`PosController.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Http/Controllers/PosController.php): Menangani antarmuka meja kasir, pengalihan peran (kasir/owner), dan portal mandiri pelanggan.
   - [`ExportController.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Http/Controllers/ExportController.php): Menghasilkan stream berkas spreadsheet `.csv` berstandar MIME `text/csv`.

4. **View Layer (`resources/views/`):**
   - Menggunakan engine templating Blade:
     - [`layouts/app.blade.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/resources/views/layouts/app.blade.php): Layout induk modular lengkap dengan navigasi global.
     - [`transactions/index.blade.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/resources/views/transactions/index.blade.php): Menampilkan data tabular riwayat transaksi dengan format tanggal dan mata uang Rupiah.

---

## 2. Pengujian Alur Transaksi & Konsistensi Database (End-to-End Data Flow)

### Pertanyaan Penguji:
> *"Bagaimana mekanisme penyimpanan transaksi dari antarmuka kasir ke tabel database? Apakah data langsung tersimpan di basis data Laravel?"*

### Pembuktian Teknis:
1. **Langkah Demonstrasi Langsung:**
   - Buka Meja Kasir di browser: `http://127.0.0.1:8000/`.
   - Tambahkan produk ke keranjang (misalnya: Fotokopi B/W atau ATK), lalu klik tombol **Bayar (F9)**.
   - Masukkan nominal uang yang diterima, lalu klik **Selesaikan Pembayaran**. Struk digital akan muncul.
   - Klik menu **Riwayat Laravel** di bilah atas (atau buka `http://127.0.0.1:8000/transaksi`).
   - Faktur baru yang baru saja diproses (contoh: `INV-20261102-0001`) langsung tercantum di baris paling atas tabel dengan rincian barang, jam presisi WIB, metode bayar, dan nominal rupiah.

2. **Penjelasan Mekanisme:**
   - Pada saat kasir menekan tombol selesai bayar, fungsi `processCheckout()` di [`js/app.js`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/js/app.js) mengeksekusi asynchronous request `fetch('/api/v1/checkout')` dengan metode `POST`.
   - Laravel memvalidasi request, memasukkan record induk ke tabel `transactions`, record anak ke tabel `transaction_items`, dan melakukan `decrement('stock_qty')` pada tabel `products` bila produk berjenis fisik (non-jasa).

---

## 3. Strategi Ketersediaan Sistem (Offline-First Architecture)

### Pertanyaan Penguji:
> *"Bagaimana jika toko mengalami gangguan koneksi internet atau server lokal sempat terputus? Apakah operasional kasir berhenti total?"*

### Penjelasan Teknis:
- Sistem mengadopsi prinsip **Hybrid Offline-First POS**:
  - Antarmuka kasir dibangun sebagai Single Page Application (SPA) yang tetap dapat memproses perhitungan belanja, pemilihan kertas, kalkulasi jilid, dan pencetakan struk menggunakan cache data lokal (`localStorage`).
  - Ketika koneksi server tersedia, data transaksi disinkronkan secara mulus ke API Laravel backend.
  - Pendekatan ini memastikan operasional toko ritel dan percetakan di daerah tidak terganggu oleh fluktuasi stabilitas jaringan internet.

---

## 4. Pengujian Beban & Skalabilitas (Uji Beban 1.500 Data Transaksi)

### Pertanyaan Penguji:
> *"Apakah sistem sudah diuji menangani data dalam jumlah besar? Bagaimana performa query saat data transaksi bertambah?"*

### Pembuktian Teknis:
1. **Penyemaian Data Dummy Skala Besar:**
   - Database telah dilengkapi dengan simulasi **1.500 transaksi realistis** yang merepresentasikan riwayat operasional toko selama 60 hari terakhir.
   - Dibuat melalui seeder resmi: [`database/seeders/LargeDummyTransactionsSeeder.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/database/seeders/LargeDummyTransactionsSeeder.php).

2. **Optimasi Kinerja Query:**
   - Skema tabel `transactions` dan `transaction_items` telah diberi index database pada kolom `created_at`, `status`, dan `invoice_no` (lihat [`database/migrations/2026_01_01_000007_create_transactions_and_items_table.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/database/migrations/2026_01_01_000007_create_transactions_and_items_table.php)).
   - Halaman riwayat transaksi menerapkan paginasi 50 data per halaman (`paginate(50)`) sehingga konsumsi memori server dan waktu pemuatan halaman tetap stabil di bawah 100 milidetik.

---

## 5. Modul Pelaporan & Ekspor Data Finansial

### Pertanyaan Penguji:
> *"Bagaimana pemilik toko mengekspor data transaksi untuk keperluan pembukuan fisik atau audit pembukuan?"*

### Pembuktian Teknis:
1. **Langkah Demonstrasi Langsung:**
   - Akses rute ekspor melalui tombol **Unduh Laporan Excel** di bilah navigasi atau halaman `http://127.0.0.1:8000/ekspor/excel`.
   - Browser secara otomatis mengunduh berkas dengan format nama `LAPORAN_TRANSAKSI_EXCEL_COPY_STAR_KUBU_[TANGGAL].csv`.
2. **Penjelasan Teknis:**
   - Method `exportExcel()` pada [`app/Http/Controllers/ExportController.php`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/app/Http/Controllers/ExportController.php) menggunakan stream response `fputcsv()` dengan header HTTP:
     - `Content-Type: text/csv; charset=UTF-8`
     - `Content-Disposition: attachment; filename="..."`
   - Berkas output kompatibel langsung dibuka dengan Microsoft Excel, Google Sheets, maupun LibreOffice Calc dengan pemisahan kolom yang rapi.

---

## 6. Manajemen Hak Akses Pengguna (Role-Based Access Control)

### Pertanyaan Penguji:
> *"Bagaimana pemisahan wewenang antara staf kasir dan pemilik toko (owner) diatur dalam sistem?"*

### Pembuktian Teknis:
1. **Tabel Pengguna (`users`):**
   - Memiliki kolom `role` dengan nilai `KASIR` dan `OWNER`.
   - Kredensial kata sandi dienkripsi menggunakan hashing satu arah standar industri `Hash::make()` (Bcrypt).
2. **Pemisahan Antarmuka:**
   - **Kasir:** Berfokus pada kecepatan pelayanan (POS kasir, kalkulator print dokumen, pencatatan kasbon, dan pemantauan antrean berkas cetak).
   - **Owner:** Memiliki wewenang melihat ringkasan omzet, estimasi laba kotor, grafik tren penjualan mingguan, serta pengubahan master harga katalog produk. Halaman sensitif ini diproteksi oleh PIN otorisasi supervisor (`0000`).

---

## 7. Desain Antarmuka & Ergonomi Kasir (UI/UX)

### Pertanyaan Penguji:
> *"Bagaimana antarmuka ini dirancang agar mudah dan nyaman digunakan oleh staf toko?"*

### Pembuktian Teknis:
1. **Ergonomi Layar Sentuh:**
   - Semua tombol aksi utama memiliki ukuran target sentuh minimal 48 piksel, memenuhi pedoman aksesibilitas antarmuka sentuh (touchscreen monitor).
2. **Umpan Balik Audio (Audio Feedback):**
   - Terdapat efek suara konfirmasi transaksi selesai dan scan barcode untuk mempercepat verifikasi kasir tanpa harus selalu menatap layar monitor.
3. **Penyediaan Dua Tema (Light/Dark Mode):**
   - Tombol pengalih tema di bilah atas memungkinkan kasir beralih antara tema gelap (mengurangi kelelahan mata saat shift malam) dan tema terang (meningkatkan kontras di ruangan terang).
4. **Pusat Panduan Operasional:**
   - Fitur modal panduan interaktif 5 tab menyediakan petunjuk langkah demi langkah pengoperasian sistem langsung di dalam aplikasi.

---

## 8. Ringkasan Rute Aplikasi untuk Pengujian

| Komponen Sistem | Rute URL | Metode | Fungsi Utama |
| :--- | :--- | :---: | :--- |
| **Meja Kasir Utama** | `http://127.0.0.1:8000/` | GET | Antarmuka kasir POS, kalkulator print, kasbon, dan antrean |
| **Riwayat Transaksi** | `http://127.0.0.1:8000/transaksi` | GET | Tampilan Blade tabel 1.500 transaksi dan filter pencarian |
| **Ekspor Laporan** | `http://127.0.0.1:8000/ekspor/excel` | GET | Unduh laporan transaksi keuangan dalam format spreadsheet |
| **Portal Mandiri** | `http://127.0.0.1:8000/pelanggan` | GET | Tampilan mobile untuk pengecekan katalog harga mandiri |
| **Health API** | `http://127.0.0.1:8000/api/v1/health` | GET | Verifikasi status koneksi server backend dan database |
| **Checkout API** | `http://127.0.0.1:8000/api/v1/checkout` | POST | Endpoint API pencatatan transaksi kasir ke database |
