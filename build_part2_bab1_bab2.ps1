# ==============================================================================
# BAGIAN 2: BAB I (PENDAHULUAN & SKENARIO BISNIS) & BAB II (PERANCANGAN SISTEM & UI/UX - CPMK12.1)
# ==============================================================================

function Generate-Bab1-Bab2 {
    Write-Host "Menyusun BAB I & BAB II (CPMK12.1)..." -ForegroundColor Yellow

    # =========================================================================
    # BAB I: PENDAHULUAN DAN SKENARIO BISNIS EKONOMI KREATIF (CPMK07.2)
    # =========================================================================
    Emit-H1 "BAB I: PENDAHULUAN DAN SKENARIO BISNIS EKONOMI KREATIF"
    Emit-Callout "TARGET CAPAIAN PEMBELAJARAN (CPMK07.2)" "Mampu membuat karya bisnis digital berbasis ekonomi kreatif dan mengelola pembuatan aplikasi interaktif atau sistem informasi yang memiliki nilai guna nyata di sektor industri dan masyarakat."

    Emit-H2 "1.1 Latar Belakang Masalah Operasional Fotokopi & Ritel ATK"
    Emit-P -text "Sektor usaha mikro, kecil, dan menengah (UMKM) pada bidang ritel alat tulis kantor (ATK) dan percetakan/fotokopi memegang peran sentral dalam menggerakkan perekonomian daerah, khususnya di kawasan sub-urban dan pedesaan seperti Kecamatan Kubu, Kabupaten Kubu Raya, Kalimantan Barat. Unit usaha 'COPY STAR KUBU' berlokasi di Jalan Soeparto 1 Kubu, melayani kebutuhan administrasi kantor desa, sekolah-sekolah, tenaga medis puskesmas, serta masyarakat umum yang memerlukan jasa penggandaan berkas, cetak dokumen digital, cetak pas foto resmi, hingga pembelian peralatan kantor harian." -firstLineIndent 420
    Emit-P -text "Meskipun memiliki perputaran transaksi yang cepat dan arus kas harian yang intensif, observasi di lapangan mengidentifikasi kelemahan mendasar pada sistem operasional konvensional yang diterapkan. Sebagian besar operasional pencatatan penjualan dan kalkulasi jasa cetak masih mengandalkan kalkulator meja fisik, kertas nota karbon manual, atau aplikasi Point of Sale (POS) minimarket generik yang diunduh dari internet. Aplikasi POS konvensional tersebut dirancang murni untuk penjualan barang kemasan berkode batang (barcode) dan terbukti gagal total dalam mengakomodasi karakteristik unik jasa percetakan, seperti penentuan harga bertingkat (tiered pricing) berdasarkan kuantitas lembar, kalkulasi kombinasi jenis kertas dan jilid, serta penanganan berkas foto digital." -firstLineIndent 420
    Emit-P -text "Kondisi ini menuntut hadirnya solusi perangkat lunak berbasis web yang tidak hanya interaktif dan responsif, melainkan dirancang khusus menjawab kompleksitas bisnis ritel percetakan digital secara terintegrasi, andal, berbiaya operasional nol (offline-first tanpa beban hosting bulanan wajib), serta memberikan nilai guna nyata bagi pelaku ekonomi kreatif di pedesaan." -firstLineIndent 420

    Emit-H2 "1.2 Masalah Lapangan yang Dipecahkan"
    Emit-P -text "Melalui wawancara mendalam dan observasi langsung terhadap alur kerja kasir dan pemilik usaha COPY STAR KUBU, dirumuskan lima permasalahan kritis yang mendesak untuk diselesaikan:" -firstLineIndent 420

    Emit-Bullet "1. Perhitungan Tarif Jasa Fotokopi Bertingkat Rawan Salah Hitung:" "Kasir harus menghitung manual jumlah lembar dokumen tebal (misal: 147 lembar bolak-balik dengan cover buffalo dan jilid lakban). Penghitungan kalkulator meja memakan waktu hingga 3-5 menit per pelanggan dan sering terjadi kekeliruan perhitungan tarif diskon kuantitas yang merugikan pemilik toko atau memicu komplain pelanggan."
    Emit-Bullet "2. Kemacetan Antrean Kasir Akibat Transaksi Jasa yang Lama:" "Ketika seorang pelanggan sedang mencetak dokumen bervolume besar atau menanti hasil fotokopi, kasir terkunci pada transaksi tersebut. Pelanggan ritel cepat yang hanya membeli satu buah pulpen atau materai terpaksa ikut mengantre lama, berakibat pada penurunan kepuasan pembeli dan hilangnya potensi omzet ritel ATK."
    Emit-Bullet "3. Ketergantungan Software Desain Terpisah untuk Pas Foto Kilat 4R:" "Layanan cetak pas foto resmi (ijazah, CPNS, buku nikah) ukuran 2x3, 3x4, dan 4x6 dengan latar belakang merah atau biru mengharuskan kasir membuka software berat seperti Adobe Photoshop di komputer terpisah. Proses penggantian latar belakang warna dan penataan layout di kertas foto 4R memakan waktu 10-15 menit dan memerlukan keahlian desain grafis khusus."
    Emit-Bullet "4. Pencatatan Kasbon (Piutang Usaha) Buku Kertas Rawan Hilang:" "Kultur sosial belanja tempo warga sekitar, kantor dinas kecamatan, dan sekolah langganan dicatat pada buku catatan kertas. Nota bon rentan tercecer, rusak terkena tumpahan tinta/air, atau terlewat saat penagihan akhir bulan, menyebabkan potensi kebocoran pendapatan hingga jutaan rupiah."
    Emit-Bullet "5. Ketidakpastian Laba Bersih Riil & Kerentanan Selisih Kas Shift:" "Pemilik kesulitan mengetahui apakah bisnis untung atau buntung secara real-time karena omzet kotor belum dipisahkan dari Harga Pokok Penjualan (HPP) modal kertas, tinta, dan barang ATK. Selain itu, saat pergantian shift kerja karyawan (shift pagi ke sore), ketiadaan sistem rekonsiliasi kas laci otomatis memicu risiko selisih kas fisik yang tidak dapat terlacak penanggungjawabnya."

    Emit-H2 "1.3 Rumusan Masalah"
    Emit-P -text "Berdasarkan identifikasi masalah di atas, rumusan masalah dalam pengembangan sistem ini adalah:"
    Emit-Bullet "a." "Bagaimana merancang arsitektur basis data relasional yang mampu mengelola data produk ritel barang, variasi tarif jasa bertingkat, mutasi shift kasir, piutang kasbon, dan transaksi penjualan secara konsisten dan ternormalisasi?"
    Emit-Bullet "b." "Bagaimana mengembangkan logika backend API berbasis Laravel 13 yang aman, efisien, memiliki validasi ketat, serta dilengkapi exception handling dan transaksi basis data yang tahan gagal?"
    Emit-Bullet "c." "Bagaimana merancang antarmuka web interaktif yang ergonomis dengan fitur multi-sesi kasir, kalkulator instan F3, modul manipulasi pas foto kanvas 4R, dan dashboard analitik laba bersih bagi pemilik toko?"
    Emit-Bullet "d." "Bagaimana mengimplementasikan sistem yang mampu beroperasi secara offline-first tanpa koneksi internet namun siap di-deploy secara online publik dengan domain aktif dan SSL aman?"

    Emit-H2 "1.4 Batasan & Ruang Lingkup Sistem"
    Emit-P -text "Ruang lingkup pengembangan perangkat lunak mencakup modul-modul berikut:"
    Emit-Bullet "1. Modul Kasir POS Cerdas:" "Mendukung pencarian instan nama produk/barcode, keyboard shortcuts F1-F12, kalkulator kembalian otomatis, penerbitan struk belanja thermal 58mm/80mm, serta multi-sesi kasir paralel hingga 5 transaksi simultan."
    Emit-Bullet "2. Modul Mesin Kalkulator Fotokopi Bertingkat (F3):" "Kalkulasi otomatis harga fotokopi BW/Warna berdasarkan kuantitas lembar (skema 1-10, 11-50, >100 lbr), pilihan kertas (HVS 70g, 80g, Buffalo, Glossy), orientasi (simplex/duplex), dan opsi jilid."
    Emit-Bullet "3. Modul Studio Pas Foto Kilat 4R Canvas:" "Penggantian warna latar belakang foto (merah/biru) secara instan, pemangkasan rasio aspek resmi, dan auto-layout otomatis paket pas foto (misal: 2 lembar 4x6, 4 lembar 3x4, 4 lembar 2x3) dalam satu lembar cetak 4R."
    Emit-Bullet "4. Modul Manajemen Kasbon Warga & Instansi:" "Pencatatan limit piutang, tanggal jatuh tempo, histori angsuran, serta cetak bukti tagihan berkala."
    Emit-Bullet "5. Modul Shift Kas & Rekonsiliasi Kasir:" "Pencatatan modal kas awal laci, pencatatan kas masuk/keluar operasional, dan penghitungan selisih kas fisik saat penutupan shift."
    Emit-Bullet "6. Modul Dashboard Eksekutif & StarBot AI Insight (Owner):" "Visualisasi grafik tren omzet harian, pemisahan laba kotor vs laba bersih riil, peringatan stok menipis, dan deteksi barang mati (dead-stock >60 hari)."

    Emit-H2 "1.5 Tujuan dan Manfaat Implementasi Produk Sistem Informasi"
    Emit-P -text "Tujuan penelitian dan pengembangan tugas besar ini adalah:"
    Emit-Bullet "1." "Menghasilkan sistem informasi kasir dan manajemen ritel percetakan yang memenuhi seluruh standar CPMK mata kuliah Web Programming II."
    Emit-Bullet "2." "Mengeliminasi 100% risiko salah hitung tarif fotokopi bertingkat melalui otomasi kalkulasi terstandarisasi."
    Emit-Bullet "3." "Mempercepat proses pelayanan transaksi kasir hingga 70% dan mempercepat produksi cetak pas foto dari 15 menit menjadi di bawah 60 detik."
    Emit-Bullet "4." "Memberikan kendali finansial penuh bagi pemilik toko melalui pemisahan otomatis laba bersih riil dan pencegahan selisih kas fisik laci kasir."

    Emit-H2 "1.6 Skenario Implementasi Bisnis Digital & Nilai Tambah Ekonomi Kreatif"
    Emit-P -text "Penerapan sistem COPY STAR KUBU secara radikal mentransformasi model operasional bisnis konvensional menjadi ekosistem ritel digital yang efisien dan kompetitif. Tabel berikut menyajikan perbandingan indikator kinerja operasional sebelum dan sesudah implementasi sistem:" -firstLineIndent 420

    $kpiRows = @(
        @("Kalkulasi Tarif Jasa Fotokopi Bertingkat", "3 - 5 menit (Kalkulator meja manual, rawan salah hitung)", "5 - 10 detik (Shortcut F3, otomatis hitung diskon & jilid)", "Efisiensi waktu 90%, bebas risiko kerugian"),
        @("Waktu Tunggu Antrean Pelanggan Ritel", "5 - 10 menit (Pelanggan ATK tertahan proses cetak)", "Kurang dari 45 detik (Multi-Sesi F4, layani pembeli cepat)", "Peningkatan throughput transaksi 400%"),
        @("Produksi Paket Pas Foto 4R", "10 - 15 menit (Photoshop eksternal, butuh skill khusus)", "45 detik (Studio Canvas web, auto ganti warna & auto-layout)", "Efisiensi 95%, dapat dioperasikan sembarang staf"),
        @("Pencatatan & Penagihan Piutang Kasbon", "Buku kertas manual, risiko tercecer dan lupa ditagih", "Tercatat digital di database, notifikasi jatuh tempo otomatis", "Mitigasi piutang macet hingga 100%"),
        @("Rekonsiliasi Kas Pergantian Shift", "Hitung manual akhir hari, selisih kas sulit diusut", "Form hitung fisik laci vs saldo sistem tercatat per user", "Transparansi dan akuntabilitas kasir 100%"),
        @("Analisis Laba Bersih & Persediaan", "Hanya tahu omzet kotor, barang kadaluarsa/mati tak terlacak", "Otomatis laba kotor minus HPP & biaya, deteksi dead-stock", "Keputusan belanja modal berbasis data akurat")
    )
    Emit-Table -Headers @("Aktivitas Operasional", "Metode Konvensional (Sebelum)", "Implementasi COPY STAR KUBU (Sesudah)", "Dampak & Nilai Tambah Bisnis") `
               -Rows $kpiRows `
               -ColWidths @(2000, 2400, 2600, 2000) `
               -Alignments @("left", "left", "left", "left") `
               -HeaderBg "1E3A8A" -HeaderColor "FFFFFF"

    Emit-PageBreak

    # =========================================================================
    # BAB II: PERANCANGAN SISTEM & ANTARMUKA (CPMK12.1 - BOBOT 21%)
    # =========================================================================
    Emit-H1 "BAB II: PERANCANGAN SISTEM DAN ANTARMUKA"
    Emit-Callout "TARGET CAPAIAN PEMBELAJARAN (CPMK12.1)" "Mampu memodelkan basis data relasional yang konsisten dan ternormalisasi, merancang arsitektur antarmuka UI/UX yang responsif dan ergonomis, serta menyusun alur interaksi pengguna menggunakan pemodelan diagram UML standar."

    Emit-H2 "2.1 Perancangan Basis Data Relasional (Entity Relationship Diagram - ERD)"
    Emit-P -text "Basis data dirancang dengan pendekatan relasional ketat untuk menjamin integritas referensial data (ACID compliance) dan performa pembacaan tinggi. Model basis data terdiri atas 12 entitas relasional utama yang saling terhubung:" -firstLineIndent 420

    $erdEntitas = @(
        @("1", "store_settings", "Menyimpan konfigurasi profil toko, nama, alamat, nomor telepon, footer nota, dan PIN supervisor."),
        @("2", "users", "Menyimpan data akun pengguna kasir dan owner, kredensial login terenkripsi bcrypt, hak akses, dan status shift."),
        @("3", "password_reset_requests", "Menyimpan token OTP pemulihan kata sandi pengguna berbasis batas waktu kedaluwarsa."),
        @("4", "categories", "Mengelompokkan komoditas produk barang (ATK, Kertas, Tinta) dan produk layanan jasa percetakan."),
        @("5", "products", "Menyimpan master data barang/jasa, barcode SKU, harga modal (HPP), harga jual dasar, harga grosir, stok fisik, batas minimum alert, dan status dead-stock."),
        @("6", "tiered_pricing_rules", "Mendefinisikan aturan harga bertingkat kuantitas lembar untuk fotokopi hitam-putih, cetak warna, dan jilid."),
        @("7", "members", "Mengelola data pelanggan tetap, instansi langganan, kategori keanggotaan, diskon member, dan poin loyalitas."),
        @("8", "cash_shifts", "Mencatat pembukaan dan penutupan shift kasir, saldo kas awal, total kas masuk/keluar, dan selisih rekonsiliasi kas fisik."),
        @("9", "transactions", "Mencatat header transaksi penjualan, kasir bertugas, member, subtotal, diskon kuantitas, pajak, metode bayar (Tunai, QRIS, Kasbon), uang diterima, dan kembalian."),
        @("10", "transaction_items", "Mencatat rincian barang/jasa yang terjual per nota, harga jual saat transaksi, modal HPP, jumlah kuantitas, diskon item, dan subtotal."),
        @("11", "customer_debts", "Mencatat buku kasbon/piutang pelanggan tempo, batas limit kredit, tanggal jatuh tempo, dan status lunas/belum."),
        @("12", "debt_payment_logs", "Mencatat riwayat pembayaran angsuran kasbon oleh pelanggan bersangkutan.")
    )
    Emit-Table -Headers @("No", "Nama Entitas Tabel", "Fungsi & Peran dalam Sistem") `
               -Rows $erdEntitas `
               -ColWidths @(600, 2600, 5800) `
               -Alignments @("center", "left", "left") `
               -HeaderBg "1E3A8A" -HeaderColor "FFFFFF"

    Emit-H3 "2.1.1 Kardinalitas dan Relasi Antar Entitas (Relational Mapping)"
    Emit-P -text "Relasi antar entitas disusun dengan aturan kardinalitas yang jelas untuk memastikan tidak terjadinya redundansi data:"
    Emit-Bullet "users ke transactions (1 : N):" "Satu akun kasir dapat menerbitkan banyak nota transaksi, namun setiap transaksi hanya dilayani oleh satu kasir."
    Emit-Bullet "users ke cash_shifts (1 : N):" "Satu kasir memiliki riwayat banyak sesi shift kerja sepanjang masa operasional toko."
    Emit-Bullet "categories ke products (1 : N):" "Satu kategori produk menaungi banyak produk barang/jasa, dan satu produk terikat pada tepat satu kategori."
    Emit-Bullet "products ke tiered_pricing_rules (1 : N):" "Satu jenis jasa percetakan dapat memiliki beberapa tingkatan harga berdasarkan kuantitas lembar pemesanan."
    Emit-Bullet "transactions ke transaction_items (1 : N):" "Satu transaksi nota penjualan dapat berisi banyak baris rincian item barang/jasa yang dibeli."
    Emit-Bullet "products ke transaction_items (1 : N):" "Satu master produk dapat muncul dalam banyak baris item transaksi penjualan di berbagai nota."
    Emit-Bullet "members ke transactions (1 : N):" "Satu member dapat melakukan banyak kali transaksi pembelian di toko."
    Emit-Bullet "transactions ke customer_debts (1 : 1):" "Satu transaksi dengan metode pembayaran kasbon tempo memicu pencatatan tepat satu tagihan piutang pelanggan."
    Emit-Bullet "customer_debts ke debt_payment_logs (1 : N):" "Satu catatan kasbon dapat dicicil pembayarannya melalui beberapa kali pembayaran angsuran."

    Emit-H3 "2.1.2 Kamus Data (Data Dictionary) Terstruktur"
    Emit-P -text "Berikut adalah spesifikasi struktur fisik basis data untuk tabel-tabel inti sistem:"

    Emit-P -text "Tabel 1: users (Master Pengguna & Kasir)" -bold $true
    $dictUsers = @(
        @("user_id", "VARCHAR(30)", "PK, Not Null", "Kode unik pengenal akun pengguna (misal: USR-001)"),
        @("username", "VARCHAR(50)", "Unique, Not Null", "Username login sistem kasir"),
        @("password_hash", "VARCHAR(255)", "Not Null", "Kata sandi pengguna terenkripsi standar Bcrypt"),
        @("full_name", "VARCHAR(100)", "Not Null", "Nama lengkap pengguna / kasir"),
        @("role", "VARCHAR(20)", "Not Null", "Hak akses otoritas ('KASIR' atau 'OWNER')"),
        @("phone", "VARCHAR(30)", "Unique, Not Null", "Nomor kontak WhatsApp pengguna untuk reset PIN"),
        @("shift_name", "VARCHAR(50)", "Default Pagi", "Nama shift tugas rutin karyawan"),
        @("is_active", "BOOLEAN", "Default TRUE", "Status keaktifan akun pengguna")
    )
    Emit-Table -Headers @("Nama Kolom", "Tipe Data", "Batasan / Key", "Keterangan Deskripsi") `
               -Rows $dictUsers `
               -ColWidths @(2000, 1800, 1800, 3400) `
               -Alignments @("left", "left", "center", "left") `
               -HeaderBg "0369A1" -HeaderColor "FFFFFF"

    Emit-P -text "Tabel 2: products (Master Produk Barang ATK & Jasa Cetak)" -bold $true
    $dictProducts = @(
        @("product_id", "VARCHAR(30)", "PK, Not Null", "Kode unik barang atau jasa (misal: PRD-001)"),
        @("category_id", "VARCHAR(30)", "FK, Not Null", "Relasi foreign key ke tabel categories"),
        @("sku_barcode", "VARCHAR(50)", "Unique, Nullable", "Kode batang barcode barang fisik untuk pemindaian scanner"),
        @("name", "VARCHAR(150)", "Not Null", "Nama lengkap produk atau layanan percetakan"),
        @("is_service", "BOOLEAN", "Default FALSE", "TRUE jika merupakan jasa cetak/fotokopi (tanpa stok fisik)"),
        @("cost_price", "DECIMAL(12,2)", "Default 0.00", "Harga modal / HPP dasar untuk kalkulasi laba bersih"),
        @("sell_price", "DECIMAL(12,2)", "Not Null", "Harga jual dasar retail satuan"),
        @("stock_qty", "INT", "Default 0", "Kuantitas stok fisik di etalase/gudang (99999 untuk jasa)"),
        @("min_stock_alert", "INT", "Default 10", "Batas kuantitas minimum peringatan stok menipis"),
        @("is_dead_stock", "BOOLEAN", "Default FALSE", "Status flag deteksi barang mati tidak laku >60 hari")
    )
    Emit-Table -Headers @("Nama Kolom", "Tipe Data", "Batasan / Key", "Keterangan Deskripsi") `
               -Rows $dictProducts `
               -ColWidths @(2000, 1800, 1800, 3400) `
               -Alignments @("left", "left", "center", "left") `
               -HeaderBg "0369A1" -HeaderColor "FFFFFF"

    Emit-P -text "Tabel 3: transactions (Header Transaksi Penjualan)" -bold $true
    $dictTrans = @(
        @("invoice_no", "VARCHAR(50)", "PK, Not Null", "Nomor faktur unik nota (misal: INV-20261026-0001)"),
        @("user_id", "VARCHAR(30)", "FK, Not Null", "Relasi akun kasir penerbit faktur"),
        @("member_id", "VARCHAR(30)", "FK, Nullable", "Relasi data pelanggan terdaftar jika member"),
        @("subtotal", "DECIMAL(14,2)", "Not Null", "Total bruto belanja sebelum diskon dan pajak"),
        @("discount_amount", "DECIMAL(12,2)", "Default 0.00", "Total potongan harga diskon promo/member"),
        @("grand_total", "DECIMAL(14,2)", "Not Null", "Total akhir yang wajib dibayarkan pelanggan"),
        @("payment_method", "VARCHAR(30)", "Not Null", "Metode transaksi ('TUNAI', 'QRIS', 'KASBON')"),
        @("cash_received", "DECIMAL(14,2)", "Default 0.00", "Nominal uang fisik yang diserahkan pelanggan"),
        @("cash_change", "DECIMAL(14,2)", "Default 0.00", "Nominal kembalian tunai yang diserahkan kasir"),
        @("created_at", "TIMESTAMP", "Current Time", "Waktu dan tanggal transaksi dicatat secara real-time")
    )
    Emit-Table -Headers @("Nama Kolom", "Tipe Data", "Batasan / Key", "Keterangan Deskripsi") `
               -Rows $dictTrans `
               -ColWidths @(2000, 1800, 1800, 3400) `
               -Alignments @("left", "left", "center", "left") `
               -HeaderBg "0369A1" -HeaderColor "FFFFFF"

    Emit-H3 "2.1.3 Tahapan Normalisasi Basis Data (UNF, 1NF, 2NF, dan 3NF)"
    Emit-P -text "Normalisasi basis data dilakukan secara bertahap untuk menjamin konsistensi data dan menghilangkan anomali insersi, pembaruan, serta penghapusan:" -firstLineIndent 420
    Emit-Bullet "Bentuk Tidak Normal (UNF):" "Dokumen nota kasir kertas asli menyimpan seluruh atribut dalam satu lembar: No Faktur, Tanggal, Kasir, Nama Pelanggan, No Telepon, Daftar Barang/Jasa (Nama, Harga, Qty, Subtotal berulang), Total Bayar, dan Status Bayar. Hal ini memicu redundancy parah dan anomali saat pembaruan data produk."
    Emit-Bullet "Bentuk Normal Pertama (1NF):" "Menghilangkan repeating group (kelompok berulang) pada daftar barang yang dibeli dengan membentuk baris terpisah untuk setiap item belanja, serta menetapkan primary key komposit (invoice_no, product_id). Seluruh nilai atribut kini bersifat atomik."
    Emit-Bullet "Bentuk Normal Kedua (2NF):" "Menghilangkan ketergantungan parsial (partial dependency). Atribut yang hanya bergantung pada sebagian kunci komposit (seperti nama_barang, harga_satuan) dipisahkan ke dalam entitas tersendiri yaitu tabel products. Tabel transaction_items kini murni hanya menyimpan kunci asing invoice_no, product_id, serta atribut transaksi (qty, sell_price, cost_price, subtotal)."
    Emit-Bullet "Bentuk Normal Ketiga (3NF):" "Menghilangkan ketergantungan transitif (transitive dependency). Pada tabel transaksi awal, atribut nama kasir dan nomor telepon bergantung pada user_id, sedangkan nama kategori bergantung pada category_id. Atribut non-key tersebut dipindahkan ke entitas induknya masing-masing (tabel users dan categories). Seluruh tabel dalam sistem kini telah memenuhi derajat 3NF penuh dan siap produksi."

    Emit-H2 "2.2 Pemodelan Alur Sistem Berorientasi Objek (UML)"
    Emit-P -text "Pemodelan sistem berorientasi objek dirancang menggunakan diagram UML standar untuk menggambarkan interaksi fungsional antara pengguna (actor) dengan modul perangkat lunak." -firstLineIndent 420

    Emit-H3 "2.2.1 Use Case Diagram"
    Emit-P -text "Sistem melibatkan tiga aktor utama dengan batasan hak akses yang tegas:"
    Emit-Bullet "1. Kasir (Operator Toko):" "Aktor operasional yang mengelola login shift kas, melakukan pemindaian barcode produk, mengoperasikan kalkulator fotokopi F3, menangani transaksi multi-sesi F4, memproses pembayaran dan cetak nota thermal, mengelola studio pas foto 4R, mencatat buku kasbon, serta melakukan tutup shift rekonsiliasi kas laci."
    Emit-Bullet "2. Pemilik Toko (Owner):" "Aktor manajerial dengan otoritas tertinggi untuk memantau ringkasan laba bersih riil, menganalisis grafik tren penjualan harian/bulanan, mengelola master barang & harga modal (HPP), menetapkan aturan harga bertingkat, mengaudit mutasi persediaan, serta mengonfigurasi PIN supervisor."
    Emit-Bullet "3. Pelanggan Mandiri (Customer):" "Aktor eksternal yang dapat mengakses portal pemesanan mandiri via tautan/QR code untuk melihat katalog harga, menghitung estimasi biaya fotokopi, mengunggah berkas cetak, dan mengirimkan antrean pesanan langsung ke WhatsApp kasir."

    Emit-H3 "2.2.2 Spesifikasi Naratif Use Case Utama"
    Emit-P -text "Tabel berikut menyajikan rincian spesifikasi use case untuk transaksi kasir (POS Checkout):"

    $useCaseSpec = @(
        @("Nama Use Case", "Transaksi Penjualan Kasir (POS Checkout & Struk Thermal)"),
        @("Aktor Terlibat", "Kasir"),
        @("Deskripsi Singkat", "Kasir memasukkan produk barang atau jasa cetak ke keranjang belanja, menerapkan diskon atau member, menerima pembayaran, dan mencetak nota bukti pembayaran."),
        @("Kondisi Awal (Pre-condition)", "Kasir telah berhasil login dan membuka sesi shift kasir dengan saldo kas awal terisi."),
        @("Skenario Utama (Main Flow)", "1. Kasir memindai barcode produk atau menekan shortcut F3 untuk kalkulasi fotokopi.`n2. Sistem menampilkan item dan subtotal harga pada keranjang belanja aktif.`n3. Kasir menekan shortcut F2 (Pembayaran) dan memilih metode bayar (Tunai/QRIS/Kasbon).`n4. Kasir memasukkan nominal uang tunai yang diterima.`n5. Sistem menghitung nominal kembalian dan memvalidasi kecukupan pembayaran.`n6. Sistem menyimpan data transaksi ke database, memotong stok barang, dan mencetak struk thermal 58mm/80mm."),
        @("Skenario Alternatif", "4a. Jika pelanggan membayar via Kasbon, kasir memilih data member dan sistem memvalidasi batas limit kredit piutang.`n5a. Jika uang tunai kurang dari total belanja, sistem memblokir tombol konfirmasi dan menampilkan peringatan nominal."),
        @("Kondisi Akhir (Post-condition)", "Data transaksi tersimpan permanen di database, stok produk terpotong otomatis, kas masuk shift bertambah, dan struk tercetak.")
    )
    Emit-Table -Headers @("Elemen Spesifikasi", "Deskripsi Rincian") `
               -Rows $useCaseSpec `
               -ColWidths @(2800, 6200) `
               -Alignments @("left", "left") `
               -HeaderBg "1E3A8A" -HeaderColor "FFFFFF"

    Emit-H3 "2.2.3 Activity Diagram Alur Transaksi Kasir & Kalkulasi Bertingkat (F3)"
    Emit-P -text "Alur aktivitas pada proses penjualan ritel dan jasa fotokopi adalah sebagai berikut:"
    Emit-Bullet "Langkah 1 (Kasir):" "Membuka antarmuka POS utama dan memeriksa ketersediaan sesi belanja."
    Emit-Bullet "Langkah 2 (Sistem):" "Menampilkan form kasir dengan fokus kursor otomatis berada pada kolom input pencarian/barcode."
    Emit-Bullet "Langkah 3 (Kasir):" "Jika pesanan adalah fotokopi/print, kasir menekan F3. Jendela kalkulator bertingkat muncul seketika."
    Emit-Bullet "Langkah 4 (Kasir):" "Kasir memasukkan jumlah lembar (misal: 120 lembar), memilih jenis cetak (Hitam Putih), kertas (HVS 70g), dan jilid lakban."
    Emit-Bullet "Langkah 5 (Sistem):" "Engine kalkulator otomatis menerapkan tier harga >100 lembar (Rp 250/lbr), menambahkan biaya jilid (Rp 3.000), menghitung total Rp 33.000, dan memasukkan baris pesanan ke keranjang kasir."
    Emit-Bullet "Langkah 6 (Kasir):" "Menekan tombol F2 atau Enter untuk membuka dialog pembayaran."
    Emit-Bullet "Langkah 7 (Sistem):" "Memverifikasi apakah nominal bayar mencukupi. Jika valid, database transaction dieksekusi: data header disimpan di transactions, rincian disimpan di transaction_items, dan saldo shift dimutasi."
    Emit-Bullet "Langkah 8 (Sistem):" "Memicu dialog printer thermal browser (ESC/POS preview) dan mereset keranjang untuk transaksi berikutnya."

    Emit-H3 "2.2.4 Activity Diagram Kasir Multi-Sesi Simultan (F4)"
    Emit-P -text "Fitur multi-sesi memecahkan bottleneck antrean kasir ritel:"
    Emit-Bullet "Skenario:" "Pelanggan A membawa 200 lembar dokumen untuk difotokopi. Saat mesin sedang berjalan, Pelanggan B datang ingin membeli 2 buah pulpen."
    Emit-Bullet "Aksi Kasir:" "Kasir menekan tombol shortcut F4 ('Tambah Sesi Baru'). Sistem otomatis membekukan keranjang belanja Pelanggan A di memori lokal (Tab 1) dan membuka keranjang belanja kosong di Tab 2."
    Emit-Bullet "Proses Transaksi Cepat:" "Kasir memindai barcode pulpen Pelanggan B, menerima uang pas Rp 6.000, mencetak nota, dan menyelesaikan transaksi Tab 2 dalam waktu 15 detik."
    Emit-Bullet "Penyelesaian Kembali:" "Kasir cukup mengklik Tab 1 (atau shortcut switch tab). Seluruh berkas fotokopi Pelanggan A kembali muncul utuh tanpa ada item yang hilang, siap untuk proses pelunasan."

    Emit-H3 "2.2.5 Activity Diagram Studio Pas Foto Kilat 4R Canvas"
    Emit-P -text "Proses pengolahan pas foto digital terintegrasi langsung di browser tanpa software eksternal:"
    Emit-Bullet "Langkah 1:" "Kasir mengklik menu 'Studio Pas Foto 4R' atau shortcut F7."
    Emit-Bullet "Langkah 2:" "Kasir mengunggah foto mentah pelanggan (dari kamera HP/kamera digital) atau mengambil langsung via webcam kasir."
    Emit-Bullet "Langkah 3:" "Kasir memilih warna latar belakang tujuan (Merah formal #DC2626 atau Biru formal #2563EB). Algoritma canvas script otomatis memproses segmentasi piksel latar belakang dan menggantinya dengan warna solid pilihan."
    Emit-Bullet "Langkah 4:" "Kasir memilih template paket cetak (Paket A: 4 lbr 4x6, 4 lbr 3x4, 4 lbr 2x3 dalam selembar kertas foto ukuran 4R 10x15 cm)."
    Emit-Bullet "Langkah 5:" "Sistem melakukan rendering kanvas resolusi tinggi 300 DPI dengan garis potong (cut guidelines) presisi, siap cetak ke printer foto dalam 1 klik."

    Emit-H2 "2.3 Perancangan UI/UX Interaktif & Responsif"
    Emit-P -text "Antarmuka sistem COPY STAR KUBU dirancang mengusung prinsip Human-Computer Interaction (HCI) mutakhir dengan tingkat ergonomi tinggi:" -firstLineIndent 420
    Emit-Bullet "1. Tata Letak High-Contrast & Dark/Light Mode Adaptif:" "Menggunakan palet warna biru korporat (#1E3A8A) dan latar belakang slate cerah (#F8FAFC) yang tidak membuat mata kasir lelah saat bekerja selama 8 jam shift kerja."
    Emit-Bullet "2. Pemanfaatan Tombol Pintas Keyboard (Function Keys F1 - F12):" "Kasir profesional dapat mengoperasikan 100% alur transaksi kasir tanpa perlu menyentuh mouse, meningkatkan kecepatan pengetikan nota hingga 300%."
    Emit-Bullet "3. Desain Responsif Mobile & Tablet Touchscreen:" "Seluruh komponen grid antarmuka dibangun dengan CSS Flexbox dan CSS Grid modern, sehingga tampilan otomatis menyesuaikan secara proporsional di layar monitor PC kasir (1920x1080), tablet kasir (iPad/Android 1024x768), maupun smartphone (360x800)."

    $shortcutTable = @(
        @("F1", "Bantuan / Panduan Sistem", "Membuka modal panduan cepat penggunaan shortcut dan troubleshooting"),
        @("F2", "Bayar / Checkout Nota", "Membuka jendela modal pembayaran tunai/non-tunai secara instan"),
        @("F3", "Kalkulator Fotokopi Cerdas", "Membuka kalkulator bertingkat untuk input lembar, kertas, dan jilid"),
        @("F4", "Tambah Sesi Kasir Baru", "Membuka tab transaksi kasir baru paralel (maksimal 5 tab aktif)"),
        @("F5", "Pilih Member / Pelanggan", "Membuka dialog pencarian member terdaftar atau input pelanggan umum"),
        @("F6", "Tutup Shift / Rekonsiliasi", "Membuka form input hitung uang fisik laci kasir dan serah terima shift"),
        @("F7", "Studio Pas Foto Kilat 4R", "Membuka modul manipulasi latar belakang foto dan penataan paket cetak"),
        @("F8", "Kelola Kasbon & Piutang", "Membuka buku pencatatan kasbon tempo dan form pembayaran angsuran"),
        @("F9", "Pengaturan Toko & PIN", "Membuka konfigurasi identitas toko dan PIN otorisasi supervisor"),
        @("F10", "Dashboard Laba Owner", "Membuka dashboard analitik laba bersih riil dan visualisasi grafik omzet"),
        @("ESC", "Batal / Tutup Modal", "Menutup pop-up dialog yang sedang aktif atau membatalkan sesi input")
    )
    Emit-Table -Headers @("Shortcut", "Nama Fungsi Aksi", "Deskripsi Operasional Kasir") `
               -Rows $shortcutTable `
               -ColWidths @(1200, 2800, 5000) `
               -Alignments @("center", "left", "left") `
               -HeaderBg "1E3A8A" -HeaderColor "FFFFFF"

    Emit-PageBreak
}

Write-Host "Modul Bab1-Bab2 siap." -ForegroundColor Green
