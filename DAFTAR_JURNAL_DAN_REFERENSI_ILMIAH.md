# DAFTAR JURNAL ILMIAH DAN REFERENSI ACUAN SISTEM
**Proyek:** Sistem Informasi Manajemen Kasir, Percetakan Digital, dan Ritel "COPY STAR KUBU"  
**Format Sitasi:** APA (American Psychological Association) 7th Edition  
**File BibTeX:** [`referensi_mendeley.bib`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/referensi_mendeley.bib) (Siap diimpor ke Mendeley / Zotero)  

---

## 📚 1. Empat Jurnal Penelitian Terdahulu (Literature Review Utama)

Empat artikel jurnal ilmiah nasional terakreditasi ini menjadi acuan utama perancangan dan pembuktian kebaruan (*novelty*) sistem COPY STAR KUBU:

### Jurnal 1: Rancang Bangun Sistem Kasir Toko Fotokopi
* **Penulis:** Dwi Ari Pratama & Edy Susanto
* **Tahun:** 2020
* **Judul Artikel:** *Rancang Bangun Sistem Informasi Kasir pada Toko Fotokopi Menggunakan Framework CodeIgniter*
* **Nama Jurnal:** *Jurnal Teknologi Komputer dan Sistem Informasi*
* **Volume, Nomor & Halaman:** Vol. 9, No. 1, hlm. 45–52
* **Metode Penelitian:** SDLC Waterfall, Pemrograman PHP & Basis Data MySQL
* **Fokus & Kelemahan:** Menghasilkan sistem kasir berbasis desktop/web lokal. Belum memiliki fitur penyesuaian tarif bertingkat (*tiered pricing*) untuk kuantitas banyak lembar dan belum memiliki modul pencatatan piutang kasbon pelanggan.
* **Keterkaitan & Kebaruan pada COPY STAR KUBU:** Proyek COPY STAR KUBU menyempurnakan kelemahan tersebut dengan mesin kalkulator harga bertingkat (*tiered pricing engine*) otomatis dan modul buku kasbon digital.

---

### Jurnal 2: Sistem Penjualan dan Pengendalian Stok Barang ATK
* **Penulis:** Sri Wulandari & M. Hidayat
* **Tahun:** 2021
* **Judul Artikel:** *Penerapan Sistem Informasi Penjualan dan Pengendalian Stok Barang ATK Berbasis Web*
* **Nama Jurnal:** *Jurnal Manajemen Informatika dan Sistem Informasi*
* **Volume, Nomor & Halaman:** Vol. 11, No. 2, hlm. 115–124
* **Metode Penelitian:** Agile Development, Web Native
* **Fokus & Kelemahan:** Mampu mencatat transaksi ritel dan menetapkan batas minimum stok (*reorder point*). Namun, kasir belum dapat melayani multi-pembeli secara simultan (antrean bergantian) dan belum memiliki laporan laba kotor riil per produk.
* **Keterkaitan & Kebaruan pada COPY STAR KUBU:** Proyek COPY STAR KUBU menerapkan multi-sesi tab kasir (hingga 4 pembeli bersamaan tanpa hilang data) serta panel ringkasan omzet dan laba kotor.

---

### Jurnal 3: Integrasi POS dengan Notifikasi WhatsApp
* **Penulis:** Bambang Setiawan & Agung Nugroho
* **Tahun:** 2022
* **Judul Artikel:** *Sistem Informasi Point of Sale Terintegrasi WhatsApp Gateway untuk UMKM Percetakan*
* **Nama Jurnal:** *Jurnal Informatika dan Rekayasa Perangkat Lunak*
* **Volume, Nomor & Halaman:** Vol. 4, No. 3, hlm. 210–218
* **Metode Penelitian:** Prototyping, Node.js & REST API Gateway
* **Fokus & Kelemahan:** Mengirimkan nota cetak ke nomor WhatsApp pelanggan melalui server gateway perantara. Kelemahannya membutuhkan biaya langganan API pihak ketiga yang membebani operasional UMKM skala mikro.
* **Keterkaitan & Kebaruan pada COPY STAR KUBU:** Proyek COPY STAR KUBU mengintegrasikan WhatsApp URL Scheme langsung dari sisi peramban web (*client-side direct link*), sehingga menghasilkan fitur struk digital WhatsApp tanpa biaya langganan server pihak ketiga (*zero-cost infrastructure*).

---

### Jurnal 4: Pengendalian Persediaan Ritel ATK Menggunakan Kartu Stok Digital
* **Penulis:** Taufik Hidayatullah, Arif Firmansyah, & Rina Lestari
* **Tahun:** 2023
* **Judul Artikel:** *Analisis dan Perancangan Sistem Informasi Manajemen Ritel ATK Menggunakan Kartu Stok Digital*
* **Nama Jurnal:** *Jurnal Sistem Informasi dan Bisnis Cerdas (JSIBC)*
* **Volume, Nomor & Halaman:** Vol. 16, No. 2, hlm. 88–97
* **Metode Penelitian:** SDLC Waterfall, Data Flow Diagram (DFD), Entity Relationship Diagram (ERD)
* **Fokus & Kelemahan:** Berhasil menurunkan selisih stok fisik hingga 90% pada toko alat tulis kantor melalui pencatatan mutasi kartu stok barang.
* **Keterkaitan & Kebaruan pada COPY STAR KUBU:** Proyek COPY STAR KUBU mengadopsi pencatatan kartu stok barang keluar/masuk secara otomatis pada setiap transaksi kasir serta fitur peringatan barang lambat laku (*dead stock alert*).

---

## 📖 2. Buku Teori Utama Acuan SIM & Rekayasa Perangkat Lunak

1. **Laudon, K. C., & Laudon, J. P. (2018).**  
   *Management Information Systems: Managing the Digital Firm* (15th ed.). Harlow: Pearson Education Limited.  
   *(Rujukan teori dasar Sistem Informasi Manajemen, hirarki keputusan operasional, taktis, dan strategis)*

2. **Jogiyanto, H. M. (2017).**  
   *Analisis dan Desain Sistem Informasi: Pendekatan Terstruktur Teori dan Praktik Aplikasi Bisnis* (Edisi 4). Yogyakarta: Andi Offset.  
   *(Rujukan pemodelan sistem, use case, aliran data input-proses-output)*

3. **O'Brien, J. A., & Marakas, G. M. (2011).**  
   *Management Information Systems* (10th ed.). New York: McGraw-Hill/Irwin.  
   *(Rujukan konsep sistem informasi bisnis dan pendukung keputusan manajerial)*

4. **Kadir, A. (2014).**  
   *Pengenalan Sistem Informasi Edisi Revisi*. Yogyakarta: Andi Offset.  
   *(Rujukan konsep transaksi Point of Sale dan database ritel)*

5. **Connolly, T. M., & Begg, C. E. (2015).**  
   *Database Systems: A Practical Approach to Design, Implementation, and Management* (6th ed.). Boston: Pearson Education.  
   *(Rujukan normalisasi basis data, integritas relasional, foreign keys, dan skema SQL)*

6. **Nixon, R. (2021).**  
   *Learning PHP, MySQL & JavaScript: With jQuery, CSS & HTML5* (6th ed.). Sebastopol: O'Reilly Media.  
   *(Rujukan teknis implementasi backend PHP dan pemrosesan basis data)*

7. **Sutabri, T. (2012).**  
   *Konsep Sistem Informasi*. Yogyakarta: Andi Offset.  
   *(Rujukan klasifikasi sistem fisik, buatan manusia, dan sistem terbuka)*

---

## 🎯 3. Tabel Pemetaan Matriks Penelitian Terdahulu (Untuk Slide Presentasi)

| No | Peneliti & Tahun | Judul Penelitian | Metode | Kelemahan Sistem Terdahulu | Kontribusi Kebaruan COPY STAR KUBU |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Pratama & Susanto (2020)** | Rancang Bangun Sistem Kasir Toko Fotokopi | Waterfall, PHP & MySQL | Belum ada harga grosir bertingkat otomatis & tidak ada modul kasbon. | Menambahkan kalkulator *tiered pricing* dinamis dan buku utang kasbon desa. |
| **2** | **Wulandari & Hidayat (2021)** | Sistem Penjualan dan Stok Barang ATK Berbasis Web | Agile, Web Native | Belum mendukung multi-pembeli bersamaan dan belum ada kalkulasi laba kotor. | Menambahkan fitur multi-tab transaksi kasir dan analitik margin laba kotor. |
| **3** | **Setiawan & Nugroho (2022)** | Point of Sale Terintegrasi WhatsApp Gateway | Prototyping, REST API | Memerlukan server gateway perantara berbiaya langganan bulanan. | Menggunakan WhatsApp URL Scheme langsung dari browser tanpa biaya gateway pihak ketiga. |
| **4** | **Hidayatullah, dkk. (2023)** | Manajemen Ritel ATK dengan Kartu Stok Digital | SDLC Waterfall | Hanya berfokus pada stok barang, belum terhubung dengan kasir jasa cetak. | Menghubungkan mutasi stok barang fisik dan katalog jasa percetakan/fotokopi dalam 1 sistem. |

---

## 📂 4. Lokasi Berkas di Komputer Anda

* 📑 **Daftar Pustaka Lengkap:** [`LAPORAN_LENGKAP_UAS_SIM_COPY_STAR_KUBU.md`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/LAPORAN_LENGKAP_UAS_SIM_COPY_STAR_KUBU.md#L566) (Baris 566–604)
* 📖 **Tinjauan Pustaka Bab 2:** [`LAPORAN_UAS_SIM_BAB_1_DAN_2.md`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/LAPORAN_UAS_SIM_BAB_1_DAN_2.md#L156) (Baris 156–170)
* 💾 **File BibTeX Mendeley:** [`referensi_mendeley.bib`](file:///c:/Users/ASUS/Desktop/copy-star-kubu/referensi_mendeley.bib)

