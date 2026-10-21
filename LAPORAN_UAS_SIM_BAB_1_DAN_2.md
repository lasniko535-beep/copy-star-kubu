# LAPORAN PROYEK UAS SISTEM INFORMASI MANAJEMEN (SIM)
# SISTEM INFORMASI KASIR & MANAJEMEN RITEL PINTAR "COPY STAR KUBU" BERBASIS WEB

---

## IDENTITAS MAHASISWA & MATA KULIAH
* **Mata Kuliah:** Sistem Informasi Manajemen (SIM)
* **Program Studi:** Sistem Informasi / Teknik Informatika (Universitas Bina Sarana Informatika - UBSI)
* **Topik Proyek:** Perancangan dan Implementasi Sistem Informasi Manajemen Penjualan, Jasa Fotokopi, dan Inventaris Berbasis Web pada Usaha Ritel "COPY STAR KUBU"
* **Style Sitasi:** APA (American Psychological Association) 6th Edition — Mendeley Compatible

---

# BAB I: PENDAHULUAN

### 1.1 Latar Belakang Masalah
Perkembangan teknologi informasi dan komunikasi saat ini telah mendorong transformasi fundamental dalam tata kelola operasional berbagai sektor usaha, termasuk usaha mikro, kecil, dan menengah (UMKM) di bidang ritel dan jasa (Laudon & Laudon, 2018). Usaha ritel modern dituntut untuk menyajikan proses transaksi yang cepat, akurat, serta mampu menyediakan data terintegrasi yang dapat mendukung pimpinan dalam proses pengambilan keputusan strategis (*Decision Support System*) (O'Brien & Marakas, 2011).

COPY STAR KUBU merupakan unit usaha ritel yang berlokasi di Jalan Soeparto 1 Kubu, Desa Kubu, Kecamatan Kubu Raya, Kalimantan Barat, yang bergerak dalam bidang penyediaan jasa *digital photocopy*, cetak foto kilat (*photo printing*), penjilidan dokumen, serta penjualan Alat Tulis Kantor (ATK). Berbeda dengan minimarket konvensional yang hanya menjual barang dagangan fisik berkode batang (*barcode*), unit usaha fotokopi dan ATK memiliki karakteristik operasional yang sangat kompleks dan dinamis (Kadir, 2014):

1. **Perhitungan Tarif Jasa Bertingkat (*Tiered Pricing*):** Layanan fotokopi dan cetak dokumen menerapkan harga berjenjang berdasarkan kuantitas pesanan. Pada mekanisme manual saat ini, kasir menghitung nominal biaya menggunakan kalkulator konvensional yang memakan waktu dan berisiko tinggi menimbulkan selisih salah hitung.
2. **Kondisi Antrean Beririsan (*Concurrent Queue*):** Dalam operasional sehari-hari, sering kali terjadi situasi di mana seorang pelanggan sedang menunggu proses cetak berkas puluhan lembar, sementara pelanggan lain di antrean belakang hanya ingin membeli satu produk alat tulis sederhana. Ketiadaan sistem multi-sesi kasir (*multi-tab*) memaksa kasir menunda pelanggan berikutnya atau menghapus draft transaksi yang sedang berlangsung.
3. **Pengelolaan Stok Barang Varian Tinggi (*High-Variant Inventory*):** Toko ATK memiliki ratusan jenis varian barang berukuran kecil (kertas, pena, map, binder). Sistem pencatatan manual sering memicu terjadinya *dead stock* (barang mengendap tanpa perputaran) serta kekosongan persediaan mendadak (*stockout*) pada komoditas utama tanpa peringatan dini.
4. **Karakteristik Pembukuan Kasbon / Piutang Warga Ritel Desa:** Di wilayah pedesaan dan instansi lokal, transaksi tempo/kasbon merupakan hal lumrah. Ketiadaan pencatatan piutang digital terstruktur menimbulkan risiko piutang tak tertagih dan kesulitan rekonsiliasi kas.
5. **Keterbatasan Informasi untuk Pengambilan Keputusan Pemilik (*Owner*):** Pemilik usaha kesulitan menganalisis tren omzet harian, margin laba bersih riil, serta jam-jam sibuk (*peak hours*) karena data transaksi tercecer dalam nota kertas konvensional.

Berdasarkan permasalahan tersebut, dibutuhkan sebuah **Sistem Informasi Manajemen Kasir & Manajemen Toko Pintar** berbasis web pada COPY STAR KUBU. Sistem ini tidak hanya berfungsi sebagai alat pencatat transaksi penjualan (*Point of Sale*), melainkan sebagai sistem informasi manajemen terintegrasi yang mengelola persediaan barang, perhitungan otomatis biaya bertingkat, pembukuan kasbon warga, portal antrean pesanan via WhatsApp, serta penyajian laporan analitik performa toko bagi pemilik (*owner*) secara *real-time*.

---

### 1.2 Identifikasi Masalah
Berdasarkan latar belakang di atas, identifikasi masalah yang dihadapi oleh COPY STAR KUBU adalah sebagai berikut:
1. Proses transaksi kasir dan kalkulasi harga bertingkat (*tiered pricing*) fotokopi masih dilakukan secara manual menggunakan kalkulator, sehingga memperlambat pelayanan dan rawan kekeliruan perhitungan.
2. Kasir tidak memiliki mekanisme penanganan multi-transaksi simultan ketika melayani pelanggan jasa cetak yang memerlukan waktu pengerjaan lama bersamaan dengan pembeli produk ATK cepat.
3. Pengendalian stok barang belum terotomatisasi, sehingga rawan terjadi kehabisan stok mendadak (*out-of-stock*) pada kertas dan tinta, serta penumpukan barang yang tidak laku (*dead stock*).
4. Pengelolaan transaksi kasbon/piutang pelanggan warga lokal masih mengandalkan buku catatan manual yang rentan hilang, rusak, atau terlewat ditagih.
5. Pemilik usaha (*owner*) tidak memiliki akses langsung terhadap laporan laba bersih, grafik tren omzet, dan informasi jam transaksi terpadat untuk evaluasi kinerja operasional toko.

---

### 1.3 Rumusan Masalah
Berdasarkan latar belakang dan identifikasi masalah, maka rumusan masalah dalam penelitian dan pengembangan proyek ini adalah:
1. Bagaimana merancang dan membangun Sistem Informasi Manajemen Kasir dan Ritel pintar pada COPY STAR KUBU berbasis web yang mampu mempercepat transaksi dan mengotomatisasi perhitungan harga bertingkat?
2. Bagaimana mengimplementasikan sistem multi-sesi kasir, kartu stok otomatis (*stock ledger*), dan pencatatan buku kasbon warga desa untuk meningkatkan akurasi data operasional?
3. Bagaimana menyajikan dashboard analitik bisnis bagi pemilik toko (*owner*) guna mendukung pengambilan keputusan manajerial secara efektif dan berbasis data?

---

### 1.4 Ruang Lingkup Masalah
Agar pembahasan terarah dan tidak menyimpang dari tujuan penelitian, ruang lingkup pada proyek Sistem Informasi Manajemen COPY STAR KUBU dibatasi sebagai berikut:
1. **Objek Penelitian:** Toko "COPY STAR KUBU", beralamat di Jln. Soeparto 1 Kubu, Desa Kubu, Kabupaten Kubu Raya, Kalimantan Barat.
2. **Modul Pengguna:** Terbagi menjadi 3 tingkat akses hak pengguna, yaitu Kasir (*Front Office*), Pemilik/Owner (*Back Office* & Analitik), dan Pelanggan (*Customer Order Portal*).
3. **Fitur Transaksi & Kasir:** Pencatatan penjualan barang dan jasa, kalkulator cetak bertingkat otomatis, multi-sesi tab kasir, diskon member (mahasiswa & kantor), tombol uang pas (*quick cash*), pembayaran tunai/QRIS/kasbon, dan cetak struk termal.
4. **Fitur Manajemen Stok:** Pencatatan master produk ATK, peringatan batas minimum stok (*low stock alert*), pencatatan barang masuk (*procurement*), deteksi *dead stock*, dan kartu mutasi stok otomatis.
5. **Fitur Pengelolaan Kasbon Desa:** Pencatatan tempo nama warga, nominal piutang, tanggal jatuh tempo, histori angsuran, serta integrasi tombol pengingat tagihan santun via WhatsApp.
6. **Fitur Dashboard Analitik:** Grafik tren pendapatan dan estimasi laba bersih, matriks jam transaksi terpadat (*heatmap*), dan interaksi asisten analitik toko ("StarBot AI").
7. **Teknologi Implementasi:** Dibangun menggunakan teknologi web modern (HTML5, Vanilla CSS3 Modern Glassmorphism, JavaScript ES6+ State Machine, LocalStorage Persistency, serta Skema Relasional SQL).

---

### 1.5 Tujuan dan Manfaat

#### 1.5.1 Tujuan Proyek
Adapun tujuan yang ingin dicapai melalui perancangan sistem ini adalah:
1. Menghasilkan Sistem Informasi Manajemen Kasir & Ritel berbasis web yang terintegrasi untuk mempercepat dan meningkatkan akurasi operasional transaksi pada COPY STAR KUBU.
2. Mengotomatisasi pengelolaan inventaris barang, riwayat mutasi stok, serta perhitungan kalkulasi tarif jasa fotokopi dan percetakan secara presisi.
3. Menyediakan modul pembukuan kasbon digital dan portal antrean berkas cetak via WhatsApp guna mempermudah hubungan layanan dengan warga sekitar.
4. Menyediakan *Dashboard Business Intelligence* bagi pemilik usaha (*owner*) sebagai dasar pendukung keputusan manajerial dalam perencanaan stok dan penataan shift kerja.

#### 1.5.2 Manfaat Proyek
Penelitian dan pengembangan sistem ini diharapkan memberikan manfaat sebagai berikut:
1. **Bagi Pemilik Usaha (Owner):**
   - Memberikan visibilitas penuh terhadap laba kotor, laba bersih, serta status kas harian secara transparan dan *real-time*.
   - Mencegah kerugian finansial akibat selisih kas fisik di laci kasir melalui fitur audit buka/tutup shift kasir.
   - Membantu perencanaan restock barang yang akurat berdasarkan data mutasi stok dan deteksi *dead stock*.
2. **Bagi Kasir / Karyawan:**
   - Mempercepat proses pelayanan konsumen dan meminimalisir kesalahan perhitungan tarif jasa atau kembalian uang.
   - Memudahkan penanganan antrean ramai melalui fitur multi-sesi transaksi tanpa risiko data tertukar atau terhapus.
3. **Bagi Pelanggan / Masyarakat:**
   - Memperoleh pelayanan yang lebih cepat, transparan, dan bukti transaksi berupa struk resmi atau nota digital WhatsApp.
   - Memberikan kenyamanan dalam memesan layanan cetak dari rumah melalui portal antrean WhatsApp.
4. **Bagi Penulis / Akademisi:**
   - Mengaplikasikan teori mata kuliah Sistem Informasi Manajemen (SIM) dan Pemrograman Web ke dalam studi kasus nyata di dunia industri UMKM.
   - Sebagai rujukan ilmiah bagi penelitian serupa dalam digitalisasi sistem manajemen toko fotokopi dan ritel ATK.

---

# BAB II: LANDASAN TEORI & TINJAUAN PUSTAKA

### 2.1 Konsep Dasar Sistem
#### 2.1.1 Pengertian Sistem
Secara etimologis, sistem berasal dari bahasa Yunani *systema*, yang berarti suatu kesatuan yang terdiri dari komponen-komponen atau elemen-elemen yang saling dihubungkan bersama untuk memudahkan aliran informasi, materi, atau energi guna mencapai suatu tujuan tertentu (Jogiyanto, 2017). Menurut Sutabri (2012), sistem dapat didefinisikan sebagai suatu kumpulan atau himpunan dari unsur, komponen, atau variabel yang terorganisir, saling berinteraksi, saling tergantung satu sama lain, dan terpadu untuk mencapai sasaran tertentu.

Dalam pandangan O'Brien dan Marakas (2011), sebuah sistem merupakan sekelompok komponen yang saling berhubungan, bekerja bersama menuju tujuan bersama dengan menerima masukan (*input*) dan menghasilkan keluaran (*output*) dalam proses transformasi yang terorganisasi.

#### 2.1.2 Karakteristik Sistem
Menurut Mulyanto (2009) dan Sutabri (2012), suatu sistem memiliki karakteristik tertentu yang mencirikan strukturnya, antara lain:
1. **Komponen Sistem (*Components*):** Terdiri dari subsistem yang saling berinteraksi dan menjalankan fungsi tertentu.
2. **Batas Sistem (*Boundary*):** Pemisah antara suatu sistem dengan sistem lain atau dengan lingkungan luarnya.
3. **Lingkungan Luar Sistem (*Environment*):** Apapun di luar batas sistem yang memengaruhi operasi sistem.
4. **Penghubung Sistem (*Interface*):** Media perantara yang menghubungkan antar komponen subsistem.
5. **Masukan Sistem (*Input*):** Energi atau data yang dimasukkan ke dalam sistem untuk diproses.
6. **Pengolahan Sistem (*Process*):** Bagian yang memproses masukan menjadi keluaran yang berguna.
7. **Keluaran Sistem (*Output*):** Hasil olahan energi atau data berupa informasi yang dapat dimanfaatkan.
8. **Sasaran atau Tujuan (*Goal/Objective*):** Titik akhir atau hasil yang ingin dicapai oleh keberadaan sistem tersebut.

---

### 2.2 Konsep Dasar Informasi
#### 2.2.1 Pengertian Informasi
Data merupakan representasi fakta mentah dari suatu kejadian yang belum memiliki makna bagi penerimanya (Kadir, 2014). Ketika data tersebut diklasifikasikan, diproses, dan disusun ke dalam konteks yang berarti, maka terciptalah apa yang disebut sebagai informasi. Menurut Laudon dan Laudon (2018), informasi adalah sekumpulan data yang telah dibentuk menjadi wujud yang memiliki arti dan bermanfaat bagi manusia. Informasi yang berkualitas merupakan fondasi utama bagi para pengambil keputusan di lingkungan organisasi maupun bisnis ritel.

#### 2.2.2 Kualitas Informasi
Kualitas suatu informasi sangat ditentukan oleh tiga pilar utama menurut Davis dalam Jogiyanto (2017):
1. **Akurat (*Accurate*):** Informasi harus bebas dari kesalahan, tidak bias, serta jelas mencerminkan maksudnya.
2. **Tepat Waktu (*Timeliness*):** Informasi yang datang kepada penerima tidak boleh terlambat, karena informasi yang usang tidak lagi memiliki nilai strategis dalam proses pengambilan keputusan.
3. **Relevan (*Relevance*):** Informasi harus memiliki keterkaitan langsung dengan permasalahan atau kebutuhan pihak pengambil keputusan.

---

### 2.3 Konsep Sistem Informasi Manajemen (SIM)
#### 2.3.1 Pengertian Sistem Informasi Manajemen
Sistem Informasi Manajemen (*Management Information System* / SIM) adalah suatu sistem informasi terintegrasi berbasis komputer yang menyediakan informasi bagi pengelola organisasi guna mendukung fungsi operasi, manajemen, dan pengambilan keputusan di dalam suatu organisasi (O'Brien & Marakas, 2011).

Menurut Laudon dan Laudon (2018), SIM merupakan kajian mengenai sistem informasi yang berfokus pada penggunaannya dalam bisnis dan manajemen, yang mengintegrasikan aspek teknologi komputer (*hardware*, *software*, jaringan), data, serta prosedur manusia untuk menghasilkan wawasan manajerial yang bermanfaat. Dalam konteks UMKM ritel, SIM berperan sebagai jembatan yang menghubungkan transaksi harian kasir di tingkat operasional dengan analisis keuangan dan strategi pengadaan barang di tingkat pemilik (*owner*).

#### 2.3.2 Peran SIM dalam Pengambilan Keputusan Bisnis Ritel
Menurut Turban, McLean, dan Wetherbe (2010), SIM memberikan dukungan penting pada tiga tingkatan manajerial:
1. **Tingkat Operasional (*Operational Level*):** Membantu aktivitas rutin harian seperti pemrosesan transaksi kasir, kalkulasi harga, cetak struk, dan rekonsiliasi uang laci kasir.
2. **Tingkat Taktis / Manajerial (*Tactical/Managerial Level*):** Memberikan laporan periodik mengenai mutasi stok, status stok menipis, peringatan *dead stock*, dan kontrol piutang kasbon pelanggan.
3. **Tingkat Strategis (*Strategic Level*):** Memberikan rangkuman metrik bisnis jangka panjang seperti grafik tren pendapatan, analisis jam sibuk operasional, dan margin laba bersih untuk ekspansi usaha dan kebijakan promosi.

---

### 2.4 Sistem Penjualan Kasir (*Point of Sale*) dan Pengendalian Persediaan
#### 2.4.1 Sistem Point of Sale (POS)
Menurut Kadir (2014), *Point of Sale* (POS) adalah sistem terkomputerisasi yang mencakup perangkat keras dan perangkat lunak yang ditempatkan di lokasi kasir untuk menangani pembayaran, pencatatan transaksi pembelian pelanggan, pemutakhiran data inventaris secara otomatis, dan pencetakan bukti bayar (struk). POS modern berbasis web menawarkan keunggulan berupa portabilitas, kemudahan akses lintas perangkat (PC kasir, tablet, maupun *smartphone*), serta biaya pemeliharaan yang terjangkau bagi unit UMKM.

#### 2.4.2 Pengendalian Persediaan (*Inventory Control*) & Tiered Pricing
Manajemen persediaan bertujuan untuk memastikan ketersediaan barang pada tingkat optimal guna memenuhi permintaan pelanggan dengan meminimalisir biaya penyimpanan dan risiko barang kedaluwarsa/rusak (Assauri, 2016):
- **Kartu Stok (*Stock Ledger*):** Catatan historis mutasi barang masuk, keluar, dan koreksi stok opname yang menjamin akuntabilitas fisik barang.
- **Deteksi *Dead Stock*:** Identifikasi stok barang yang tidak mengalami pergerakan penjualan selama periode tertentu (misal: >60 hari), sehingga pengelola dapat mengambil tindakan berupa diskon cuci gudang (*bundling*).
- **Penetapan Harga Bertingkat (*Tiered Pricing*):** Strategi penetapan harga di mana harga satuan unit barang/jasa mengalami penurunan seiring meningkatnya volume kuantitas pembelian (Kotler & Armstrong, 2016). Konsep ini sangat relevan dalam industri jasa fotokopi dan cetak digital untuk merangsang pesanan massal.

---

### 2.5 Perangkat Lunak & Teknologi Pengembangan Berbasis Web
1. **HTML5 (*HyperText Markup Language 5*):** Standar bahasa markah generasi terkini yang digunakan untuk menyusun kerangka struktural halaman web dengan dukungan elemen semantik modern (Duckett, 2014).
2. **Vanilla CSS3 (*Cascading Style Sheets 3*):** Bahasa desain lembar gaya yang digunakan untuk mengatur tata letak, tipografi, warna, dan visual antarmuka modern seperti efek *glassmorphism* dan animasi mikro interaktif tanpa ketergantungan *framework* pihak ketiga (Robbins, 2018).
3. **JavaScript (ES6+):** Bahasa pemrograman tingkat tinggi berorientasi objek yang dijalankan di peramban web (*client-side*) untuk menciptakan antarmuka yang reaktif, manajemen *state* multi-sesi kasir, manipulasi DOM dinamis, serta kalkulasi harga otomatis (Flanagan, 2020).
4. **Penyimpanan Lokal Web (*Web LocalStorage*):** Antarmuka pemrograman aplikasi (*API*) pada peramban web modern yang memungkinkan penyimpanan data transaksi secara lokal di sisi klien dengan kapasitas persisten tanpa memerlukan koneksi internet aktif setiap saat (Nixon, 2021).
5. **Relational Database Management System (RDBMS) & SQL:** Skema basis data terstruktur yang mendefinisikan relasi antar entitas (produk, kategori, mutasi stok, transaksi, karyawan, kasbon) dengan kaidah integritas referensial (Connolly & Begg, 2015).

---

### 2.6 Tinjauan Pustaka / Penelitian Terdahulu
Untuk memperkuat orisinalitas dan kebaruan penelitian proyek ini, berikut disajikan tabel pemetaan penelitian terdahulu yang relevan:

| No | Peneliti & Tahun | Judul Penelitian | Metode / Pendekatan | Hasil Penelitian & Kelemahan | Keterkaitan dengan Proyek COPY STAR KUBU |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | **Pratama & Susanto (2020)** | *Rancang Bangun Sistem Informasi Kasir pada Toko Fotokopi Menggunakan Framework CodeIgniter* | Waterfall, PHP & MySQL | Menghasilkan sistem kasir berbasis desktop/web lokal. Belum memiliki fitur harga bertingkat otomatis dan tidak ada modul kasbon warga. | Proyek COPY STAR KUBU menyempurnakan dengan *tiered pricing engine* fotokopi otomatis dan modul kasbon ritel desa. |
| 2 | **Wulandari & Hidayat (2021)** | *Penerapan Sistem Informasi Penjualan dan Pengendalian Stok Barang ATK Berbasis Web* | Agile Development, Web Native | Mampu mencatat transaksi dan stok minimum. Namun, belum memiliki fitur multi-sesi kasir simultan dan belum ada dashboard analitik laba bersih. | Proyek COPY STAR KUBU mengadopsi sistem tab multi-sesi kasir dan analitik visual grafik laba bersih pemilik toko. |
| 3 | **Setiawan & Nugroho (2022)** | *Sistem Informasi Point of Sale Terintegrasi WhatsApp Gateway untuk UMKM Percetakan* | Prototype, Node.js & REST API | Pelanggan menerima notifikasi nota lewat WhatsApp. Membutuhkan infrastruktur server backend berbiaya langganan. | Proyek COPY STAR KUBU mengintegrasikan URL Scheme WhatsApp langsung dari sisi peramban web (*zero-cost infrastructure*). |
| 4 | **Hidayatullah, dkk. (2023)** | *Analisis dan Perancangan Sistem Informasi Manajemen Ritel ATK Menggunakan Kartu Stok Digital* | SDLC Waterfall | Berhasil mengeliminasi selisih stok fisik hingga 90% melalui kartu stok digital. | Proyek COPY STAR KUBU menerapkan kartu mutasi stok real-time (tipe masuk/keluar) serta deteksi *dead stock*. |

---

# DAFTAR PUSTAKA (STYLE APA 6th EDITION)

Assauri, S. (2016). *Manajemen Operasi dan Produksi: Pencapaian Sasaran Organisasi Berkesinambungan* (Edisi 3). Jakarta: PT RajaGrafindo Persada.

Connolly, T. M., & Begg, C. E. (2015). *Database Systems: A Practical Approach to Design, Implementation, and Management* (6th ed.). Boston: Pearson Education.

Duckett, J. (2014). *HTML and CSS: Design and Build Websites*. Indianapolis: John Wiley & Sons.

Flanagan, D. (2020). *JavaScript: The Definitive Guide: Master the World's Most-Used Programming Language* (7th ed.). Sebastopol: O'Reilly Media.

Hidayatullah, T., Firmansyah, A., & Lestari, R. (2023). Analisis dan Perancangan Sistem Informasi Manajemen Ritel ATK Menggunakan Kartu Stok Digital. *Jurnal Sistem Informasi dan Bisnis Cerdas (JSIBC)*, 16(2), 88–97.

Jogiyanto, H. M. (2017). *Analisis dan Desain Sistem Informasi: Pendekatan Terstruktur Teori dan Praktik Aplikasi Bisnis* (Edisi 4). Yogyakarta: Andi Offset.

Kadir, A. (2014). *Pengenalan Sistem Informasi Edisi Revisi*. Yogyakarta: Andi Offset.

Kotler, P., & Armstrong, G. (2016). *Principles of Marketing* (16th ed.). Boston: Pearson Higher Education.

Laudon, K. C., & Laudon, J. P. (2018). *Management Information Systems: Managing the Digital Firm* (15th ed.). Harlow: Pearson Education Limited.

Mulyanto, A. (2009). *Sistem Informasi Konsep & Aplikasi*. Yogyakarta: Pustaka Pelajar.

Nixon, R. (2021). *Learning PHP, MySQL & JavaScript: With jQuery, CSS & HTML5* (6th ed.). Sebastopol: O'Reilly Media.

O'Brien, J. A., & Marakas, G. M. (2011). *Management Information Systems* (10th ed.). New York: McGraw-Hill/Irwin.

Pratama, D. A., & Susanto, E. (2020). Rancang Bangun Sistem Informasi Kasir pada Toko Fotokopi Menggunakan Framework CodeIgniter. *Jurnal Teknologi Komputer dan Sistem Informasi*, 9(1), 45–52.

Robbins, J. N. (2018). *Learning Web Design: A Beginner's Guide to HTML, CSS, JavaScript, and Web Graphics* (5th ed.). Sebastopol: O'Reilly Media.

Setiawan, B., & Nugroho, A. (2022). Sistem Informasi Point of Sale Terintegrasi WhatsApp Gateway untuk UMKM Percetakan. *Jurnal Informatika dan Rekayasa Perangkat Lunak*, 4(3), 210–218.

Sutabri, T. (2012). *Konsep Sistem Informasi*. Yogyakarta: Andi Offset.

Turban, E., McLean, E., & Wetherbe, J. (2010). *Information Technology for Management: Transforming Organizations in the Digital Economy* (7th ed.). Hoboken: John Wiley & Sons.

Wulandari, S., & Hidayat, M. (2021). Penerapan Sistem Informasi Penjualan dan Pengendalian Stok Barang ATK Berbasis Web. *Jurnal Manajemen Informatika dan Sistem Informasi*, 11(2), 115–124.
