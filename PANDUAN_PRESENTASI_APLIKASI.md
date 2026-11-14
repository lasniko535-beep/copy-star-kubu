# PANDUAN LANGKAH PRESENTASI SISTEM "COPY STAR KUBU"
**Panduan Praktis Urutan Demo Aplikasi Saat Sidang / Ujian / Presentasi Dosen**

Dokumen ini disusun agar Anda dapat melakukan demonstrasi sistem secara lancar, tenang, dan meyakinkan di depan dosen penguji. Ikuti alur langkah demi langkah berikut ini.

---

## 1. Persiapan Sebelum Presentasi Dimulai

1. **Jalankan Server Laravel:**
   - Cukup klik ganda berkas: `jalankan_laravel.bat` di folder proyek, ATAU
   - Buka PowerShell / Terminal dan ketik:
     ```powershell
     C:\xampp\php\php.exe artisan serve --host=0.0.0.0 --port=8000
     ```
2. **Buka Peramban (Browser Google Chrome / Microsoft Edge):**
   - Buka alamat: **`http://localhost:8000`**
3. **Pastikan Layar Penuh (F11):**
   - Tekan `F11` pada peramban agar tampilan meja kasir terlihat rapi, bersih, dan profesional seperti mesin POS kasir sesungguhnya.

---

## 2. Urutan Skenario Demonstrasi di Depan Dosen

### Tahap 1: Pembukaan & Pengenalan Antarmuka (30 Detik)
- **Yang Diucapkan:**
  > *"Selamat pagi/siang Bapak/Ibu Dosen Penguji. Pada kesempatan ini saya mendemonstrasikan aplikasi POS dan Manajemen Percetakan Digital COPY STAR KUBU. Aplikasi ini dibangun menggunakan Framework Laravel dengan arsitektur Model-View-Controller dan antarmuka kasir yang responsif serta mendukung operasi tanpa henti walau jaringan terputus."*
- **Yang Ditunjukkan di Layar:**
  - Tunjukkan katalog produk lengkap (75 item produk terbagi dalam kategori Fotokopi & Print, Jilid, ATK, Kertas, Foto & Desain, dan Layanan Digital).
  - Tunjukkan bilah alat atas kasir: tombol suara, tombol mode gelap/terang, dan indikator status kasir aktif.

---

### Tahap 2: Transaksi Kasir POS & Cetak Struk (1 Menit)
- **Yang Dilakukan di Layar:**
  1. Klik salah satu produk, misalnya **Fotokopi B/W** atau **Kertas HVS A4 75gr**. Produk langsung masuk ke keranjang belanja di sebelah kanan.
  2. Tambahkan kuantitasnya menggunakan tombol `+` atau ketik jumlah.
  3. Tekan tombol hijau **Bayar (F9)** di bawah keranjang belanja.
  4. Muncul jendela pembayaran: pilih metode **Tunai** atau **QRIS**.
  5. Masukkan nominal uang yang diterima (misalnya Rp 50.000), sistem otomatis menghitung uang kembalian.
  6. Klik **Selesaikan Transaksi**.
  7. Terdengar efek suara kasir dan langsung muncul jendela **Pratinjau Struk Belanja Kasir**.
- **Yang Diucapkan:**
  > *"Sistem kasir menghitung total belanja, diskon, dan kembalian secara presisi. Begitu pembayaran selesai, struk belanja siap dicetak ke printer thermal kasir dan data transaksi langsung dikirim ke backend Laravel."*

---

### Tahap 3: Kalkulator Cetak & Fotokopi F3 (Grosir Bertingkat) (1 Menit)
- **Yang Dilakukan di Layar:**
  1. Klik tombol **Kalkulator Cetak F3** di bilah alat atas.
  2. Masukkan parameter:
     - Jenis dokumen: Skripsi / Dokumen Kantor.
     - Jumlah Halaman: ketik misal `150` halaman.
     - Jumlah Rangkap/Buku: ketik `3` rangkap.
     - Pilihan Jilid: pilih **Jilid Hardcover Skripsi** atau **Jilid Spiral Kawat**.
     - Pilihan Kertas: **HVS 80gr** atau **HVS 70gr**.
  3. Tunjukkan ke dosen bagaimana harga grosir otomatis turun (Tiered Pricing) jika jumlah halaman bertambah banyak.
  4. Klik tombol **Masukkan ke Kasir**. Semua rincian langsung tersusun rapi di keranjang belanja kasir.
- **Yang Diucapkan:**
  > *"Usaha percetakan memiliki perhitungan yang rumit seperti harga kertas, tinta warna vs hitam putih, serta ongkos jilid. Modul kalkulator cetak F3 ini mengotomatiskan seluruh perhitungan tersebut sehingga kasir tidak perlu menghitung manual dengan kalkulator meja."*

---

### Tahap 4: Studio Pas Foto Kilat 4R (1 Menit)
- **Yang Dilakukan di Layar:**
  1. Klik menu **Studio Foto 4R** di bilah navigasi.
  2. Tunjukkan fitur pratinjau pas foto instan:
     - Ganti warna latar belakang (Merah untuk KTP ganjil, Biru untuk KTP genap, atau Putih).
     - Atur tata letak cetak: ukuran 2x3, 3x4, 4x6, atau paket kombinasi lembaran 4R.
- **Yang Diucapkan:**
  > *"Toko fotokopi sering melayani kebutuhan pas foto kilat untuk lamaran kerja, buku nikah, atau ijazah. Fitur ini memungkinkan kasir mengganti latar belakang foto dan mengatur tata letak cetak pas foto ukuran standar hanya dalam hitungan detik."*

---

### Tahap 5: Buku Kasbon Warga & Fitur Tagih WhatsApp (1 Menit)
- **Yang Dilakukan di Layar:**
  1. Klik tombol **Buku Kasbon** di bilah menu.
  2. Tunjukkan daftar pelanggan yang memiliki catatan piutang atau kasbon belanja.
  3. Klik salah satu nama pelanggan untuk melihat rincian riwayat barang yang dikasbon beserta tanggal transaksinya.
  4. Klik tombol hijau berikon WhatsApp **Tagih via WA**.
  5. Tunjukkan bahwa sistem langsung menyusun pesan otomatis berisi rincian tagihan kasbon yang sopan dan siap dikirim ke nomor WhatsApp pelanggan.
- **Yang Diucapkan:**
  > *"Untuk menjaga hubungan baik dengan pelanggan langganan di sekitar ruko, sistem menyediakan pencatatan buku kasbon yang rapi lengkap dengan kemudahan penagihan langsung melalui pesan WhatsApp otomatis."*

---

### Tahap 6: Antrean Berkas Cetak WhatsApp / Email (1 Menit)
- **Yang Dilakukan di Layar:**
  1. Klik tombol **Antrean Berkas Cetak** di bilah menu.
  2. Tunjukkan daftar dokumen cetak yang dikirim pelanggan via WhatsApp atau email toko.
  3. Tunjukkan status pengerjaan: *Menunggu Cetak*, *Sedang Dicetak*, dan *Siap Diambil*.
- **Yang Diucapkan:**
  > *"Pelanggan tidak perlu berdesakan menunggu di toko. Mereka bisa mengirimkan berkas dari rumah, dan kasir dapat memantau serta memperbarui status cetak pada papan antrean digital ini."*

---

### Tahap 7: Pembuktian Backend Laravel & 1.500 Data Transaksi (2 Menit)
- **Ini adalah tahap paling krusial untuk membuktikan sisi Framework Laravel kepada Dosen!**
- **Yang Dilakukan di Layar:**
  1. Klik tombol **Riwayat Laravel** di bilah menu paling atas (membuka rute `/transaksi`).
  2. Tunjukkan ke dosen:
     - Halaman ini di-render menggunakan template **Blade Laravel** resmi (`resources/views/transactions/index.blade.php`).
     - Transaksi yang tadi Anda buat di Tahap 2 sudah langsung muncul di baris paling atas!
     - Tunjukkan bahwa basis data memuat **1.503 data transaksi** yang siap disaring berdasarkan rentang tanggal atau kata kunci invoice.
     - Tunjukkan fitur paginasi (halaman 1, 2, 3...) yang memuat data secara cepat tanpa lemot berkat indeks database.
  3. Klik tombol hijau **Unduh Laporan Excel (CSV)** di kanan atas.
  4. Tunjukkan berkas yang terunduh otomatis ke folder Downloads peramban. Buka berkas tersebut bila dosen meminta: seluruh data transaksi tersaji rapi dalam kolom spreadsheet.
- **Yang Diucapkan:**
  > *"Seluruh transaksi yang diproses di kasir tersimpan secara persisten ke dalam basis data backend Laravel menggunakan Eloquent ORM. Kami juga menyematkan 1.500 data simulasi untuk membuktikan bahwa kueri paginasi dan ekspor data ke format spreadsheet tetap berjalan cepat di bawah 100 milidetik."*

---

### Tahap 8: Dasbor Pemilik Toko / Supervisor (1 Menit)
- **Yang Dilakukan di Layar:**
  1. Kembali ke meja kasir, lalu klik tombol **Mode Pemilik (Owner)** di bilah atas.
  2. Masukkan PIN keamanan: `0000`.
  3. Layar berubah menampilkan dasbor statistik finansial:
     - Total omzet harian dan mingguan.
     - Estimasi margin laba kotor.
     - Peringatan stok menipis (Low Stock Alert).
     - Log aktivitas staf kasir.
- **Yang Diucapkan:**
  > *"Sistem menerapkan pemisahan hak akses berbasis peran (RBAC). Data omzet harian, estimasi keuntungan, dan stok kritis dilindungi dengan otorisasi PIN sehingga staf kasir biasa tidak dapat sembarangan mengakses data keuangan internal toko."*

---

### Tahap 9: Pusat Panduan Interaktif Aplikasi
- **Yang Dilakukan di Layar:**
  1. Klik tombol ikon tanda tanya `(?)` **Panduan** di bilah atas kasir.
  2. Tunjukkan jendela modal panduan 5 tab yang telah berbahasa Indonesia:
     - Panduan 1: Meja Kasir POS & Transaksi
     - Panduan 2: Kalkulator Cetak & Fotokopi F3
     - Panduan 3: Studio Pas Foto Kilat 4R
     - Panduan 4: Buku Kasbon & Antrean Cetak
     - Panduan 5: Riwayat Transaksi Laravel & Ekspor Excel
- **Yang Diucapkan:**
  > *"Untuk mempermudah pelatihan staf kasir baru, kami juga menyediakan pusat bantuan interaktif 5 bagian di dalam sistem yang seluruhnya disajikan dalam Bahasa Indonesia."*

---

## 3. Jawaban Cepat Pertanyaan Dosen Penguji

| Pertanyaan Kemungkinan dari Dosen | Jawaban Singkat & Tepat |
| :--- | :--- |
| **"Di mana arsitektur MVC-nya?"** | *"Model ada di `app/Models/Transaction.php` dan `Product.php`. Controller ada di `app/Http/Controllers/TransactionController.php`. View ada di `resources/views/transactions/index.blade.php`."* |
| **"Bagaimana jika koneksi internet mati?"** | *"Sistem kasir mengadopsi prinsip Offline-First. Transaksi tetap bisa dihitung dan dicetak struknya menggunakan penyimpanan lokal peramban, lalu disinkronkan saat server terhubung."* |
| **"Bagaimana keamanan hak aksesnya?"** | *"Password dienkripsi satu arah menggunakan algoritma Bcrypt standar Laravel (`Hash::make`), dan menu sensitif omzet pemilik dilindungi PIN otorisasi."* |
| **"Apakah tabel database memiliki relasi?"** | *"Ya, tabel `transactions` berelasi One-to-Many dengan `transaction_items` via `hasMany`, dan `transaction_items` berelasi dengan tabel `products` via `belongsTo`."* |

---

*Semoga sukses presentasi dan sidang ujiannya! Sistem Anda sudah lengkap, stabil, dan teruji dengan sangat baik.*

