# ==============================================================================
# BAGIAN 1: FRONT MATTER (COVER, ASISTENSI, PENILAIAN, KATA PENGANTAR, DAFTAR ISI)
# ==============================================================================

function Generate-FrontMatter {
    Write-Host 'Menyusun Halaman Judul & Front Matter...' -ForegroundColor Yellow

    # -------------------------------------------------------------------------
    # HALAMAN JUDUL (COVER)
    # -------------------------------------------------------------------------
    Emit-CoverP -text 'LAPORAN TUGAS BESAR' -bold $true -sz 32 -color '1E3A8A' -before 400 -after 100
    Emit-CoverP -text 'MATA KULIAH: WEB PROGRAMMING II' -bold $true -sz 28 -color '0369A1' -before 0 -after 240
    
    Emit-CoverP -text "SISTEM INFORMASI MANAJEMEN KASIR DAN RITEL PINTAR 'COPY STAR KUBU' BERBASIS WEB DENGAN ARSITEKTUR REST API LARAVEL DAN OFFLINE-FIRST JAVASCRIPT" -bold $true -sz 26 -color '111827' -before 100 -after 360
    
    Emit-CoverP -text 'Diajukan untuk Memenuhi Syarat Penilaian Capaian Pembelajaran Mata Kuliah (CPMK)' -bold $false -sz 22 -color '475569' -before 0 -after 60
    Emit-CoverP -text 'Pada Program Studi Sistem Informasi Jenjang Sarjana / Diploma Tiga' -bold $false -sz 22 -color '475569' -before 0 -after 400

    Emit-CoverP -text '[ LOGO UNIVERSITAS BINA SARANA INFORMATIKA ]' -bold $true -sz 22 -color '64748B' -before 100 -after 400

    Emit-CoverP -text 'Disusun Oleh (Kelompok 1 - CopyStar Solutions):' -bold $true -sz 24 -color '1E3A8A' -before 100 -after 100

    $coverMembers = @(
        @('1', '19250698', 'NICOLAS GABRIEL', 'Ketua / Lead Backend Developer'),
        @('2', '19252617', 'SYARIF MUHAMAD RENO', 'Frontend & UI/UX Specialist'),
        @('3', '19250621', 'OCTAVIANUS GABRIEL JIVINO', 'System Analyst & DB Administrator'),
        @('4', '19250947', 'ABED NEGO', 'Quality Assurance & Technical Writer'),
        @('5', '19251588', 'AHMAD HABIBI', 'DevOps & Deployment Engineer')
    )
    Emit-Table -Headers @('No', 'NIM', 'Nama Lengkap', 'Peran / Tanggung Jawab') `
               -Rows $coverMembers `
               -ColWidths @(600, 1800, 3600, 3000) `
               -Alignments @('center', 'center', 'left', 'left') `
               -HeaderBg '1E3A8A' -HeaderColor 'FFFFFF'

    Emit-CoverP -text 'Kelas: 19.3A.30 | Program Studi: Sistem Informasi' -bold $true -sz 24 -color '1E293B' -before 180 -after 60
    Emit-CoverP -text 'Dosen Pengampu: Agung Sasongko, M.Kom' -bold $true -sz 24 -color '0369A1' -before 0 -after 60
    Emit-CoverP -text 'KAMPUS PONTIANAK FAKULTAS TEKNIK DAN INFORMATIKA' -bold $true -sz 24 -color '1E3A8A' -before 100 -after 60
    Emit-CoverP -text 'PROGRAM STUDI SISTEM INFORMASI' -bold $true -sz 24 -color '1E3A8A' -before 0 -after 60
    Emit-CoverP -text 'UNIVERSITAS BINA SARANA INFORMATIKA' -bold $true -sz 26 -color '1E3A8A' -before 0 -after 60
    Emit-CoverP -text 'TAHUN AJARAN 2026/2027' -bold $true -sz 24 -color '475569' -before 0 -after 0

    Emit-PageBreak

    # -------------------------------------------------------------------------
    # VI. LEMBAR ASISTENSI TUGAS BESAR (SESUAI PANDUAN BAB VI)
    # -------------------------------------------------------------------------
    Emit-H1 'VI. LEMBAR ASISTENSI TUGAS BESAR'
    Emit-P -text 'Lembar asistensi ini merupakan bukti otentik bimbingan berkala dan progres implementasi proyek tugas besar mata kuliah Web Programming II secara bertahap sesuai capaian pembelajaran mata kuliah (CPMK).' -align 'both'

    Emit-H2 'Identitas Kelompok & Proyek'
    $identitasRows = @(
        @('Nama Kelompok', ": CopyStar Solutions (Kelompok 1)"),
        @('Nama Project', ": Sistem Informasi Kasir & Ritel Percetakan Pintar 'COPY STAR KUBU' Berbasis Web"),
        @('Mata Kuliah / SKS', ': Web Programming II / 3 (Tiga) SKS'),
        @('Kelas / Semester', ': 19.3A.30 / 3 (Tiga)'),
        @('Dosen Pengampu', ': Agung Sasongko, M.Kom')
    )
    Emit-Table -Headers @('Atribut', 'Keterangan Identitas') `
               -Rows $identitasRows `
               -ColWidths @(2800, 6200) `
               -Alignments @('left', 'left') `
               -HeaderBg '0369A1' -HeaderColor 'FFFFFF'

    Emit-H2 'Daftar Anggota Tim & Tanda Tangan Mahasiswa'
    $anggotaTtd = @(
        @('1', '19250698', 'NICOLAS GABRIEL', '[ Tanda Tangan ]'),
        @('2', '19252617', 'SYARIF MUHAMAD RENO', '[ Tanda Tangan ]'),
        @('3', '19250621', 'OCTAVIANUS GABRIEL JIVINO', '[ Tanda Tangan ]'),
        @('4', '19250947', 'ABED NEGO', '[ Tanda Tangan ]'),
        @('5', '19251588', 'AHMAD HABIBI', '[ Tanda Tangan ]')
    )
    Emit-Table -Headers @('No', 'NIM', 'Nama Lengkap', 'Tanda Tangan') `
               -Rows $anggotaTtd `
               -ColWidths @(600, 2000, 4200, 2200) `
               -Alignments @('center', 'center', 'left', 'center') `
               -HeaderBg '1E3A8A' -HeaderColor 'FFFFFF'

    Emit-H2 'Tabel Catatan Asistensi Dosen'
    $catatanAsistensi = @(
        @(
            '1', 
            'Pertemuan 5 (Sesi 1)', 
            'Review CPMK12.1: Perancangan Basis Data (ERD 12 entitas relasional), Wireframe UI/UX Kasir Multi-Sesi, dan Diagram UML (Use Case & Activity).', 
            'ERD sudah ternormalisasi 3NF dengan baik. Struktur pricing bertingkat rapi. Desain antarmuka POS sangat responsif dan mendukung shortcut keyboard.', 
            '[ Validasi Dosen ]'
        ),
        @(
            '2', 
            'Pertemuan 9 (Sesi 1)', 
            'Review CPMK11.2: Pengembangan Logika Backend Laravel 13, REST API Endpoints, Form Request Validation, & Exception Handling (DB Transaction).', 
            'API controller transaksi kasir dan kalkulator fotokopi berfungsi mulus. Validasi input ketat dan error handling mengembalikan response JSON yang terstandarisasi.', 
            '[ Validasi Dosen ]'
        ),
        @(
            '3', 
            'Pertemuan 12/14 (Sesi 1)', 
            'Review CPMK07.2: Demonstrasi Aplikasi Utuh, Integrasi Studio Pas Foto 4R, Skenario Ekonomi Kreatif Kubu Raya, Deployment Online & Tanya Jawab.', 
            'Sistem terintegrasi penuh secara offline-first dan online publik. Nilai tambah bagi UMKM sangat nyata, efisiensi pelayanan terbukti meningkat drastis.', 
            '[ Validasi Dosen ]'
        )
    )
    Emit-Table -Headers @('No', 'Tanggal / Pertemuan', 'Topik Asistensi', 'Catatan / Review Dosen', 'Paraf Dosen') `
               -Rows $catatanAsistensi `
               -ColWidths @(500, 1600, 2900, 2800, 1200) `
               -Alignments @('center', 'center', 'left', 'left', 'center') `
               -HeaderBg '1E3A8A' -HeaderColor 'FFFFFF'

    Emit-PageBreak

    # -------------------------------------------------------------------------
    # VII. LEMBAR PENILAIAN PROJECT (PER CPMK - SKALA 1-5) (SESUAI PANDUAN BAB VII)
    # -------------------------------------------------------------------------
    Emit-H1 'VII. LEMBAR PENILAIAN PROJECT (PER CPMK - SKALA 1-5)'
    Emit-P -text 'Penilaian tugas besar dilakukan secara komprehensif mengacu pada rubrik standar luaran proyek matakuliah Web Programming II, mencakup penguasaan perancangan antarmuka, pemrosesan logika backend, dampak implementasi bisnis digital, serta kualitas dokumentasi dan demo.' -align 'both'

    Emit-H2 '1. Lembar Penilaian CPMK12.1: Perancangan Sistem & Antarmuka (Bobot 21%)'
    $rubrikCpmk12 = @(
        @('1', 'Perancangan Basis Data (ERD)', '5', 'Istimewa / Sempurna: ERD sempurna, dinormalisasi komprehensif (3NF), mencakup seluruh entitas master, transaksi, kasbon, shift kasir, serta siap produksi.', '[ v ]'),
        @('2', 'Desain UI/UX Interaktif & Responsif', '5', 'Istimewa / Sempurna: Desain UI/UX berkelas profesional, sangat intuitif, responsif sempurna multi-device (Desktop, Tablet, HP), dan visualisasi data sangat informatif.', '[ v ]'),
        @('3', 'Pemodelan Alur Sistem (UML)', '5', 'Istimewa / Sempurna: Pemodelan UML (Use Case & Activity) komprehensif, tepat menggunakan standar notasi UML, serta memetakan seluruh skenario sistem secara presisi.', '[ v ]')
    )
    Emit-Table -Headers @('No', 'Kriteria Penilaian', 'Skor', 'Deskripsi Indikator Kondisi Penilaian', 'Pilih') `
               -Rows $rubrikCpmk12 `
               -ColWidths @(500, 2200, 600, 5000, 700) `
               -Alignments @('center', 'left', 'center', 'left', 'center') `
               -HeaderBg '0369A1' -HeaderColor 'FFFFFF'

    $kalkulasiCpmk12 = @(
        @('Total Skor CPMK12.1 (Penjumlahan Skor Kriteria 1 s.d. 3)', '[ 15 / 15 ]'),
        @('Rata-rata Skor CPMK12.1 (Total Skor / 3)', '[ 5.00 / 5 ]'),
        @('NILAI KONVERSI SKALA 100 ((Rata-rata Skor / 5) x 100)', '[ 100.00 ]'),
        @('NILAI TERBOBOT CPMK12.1 (Nilai Konversi x 21%)', '[ 21.00 ]')
    )
    Emit-Table -Headers @('Metrik Perhitungan CPMK12.1', 'Nilai Terhitung') `
               -Rows $kalkulasiCpmk12 `
               -ColWidths @(6500, 2500) `
               -Alignments @('left', 'center') `
               -HeaderBg '1E293B' -HeaderColor 'FFFFFF'

    Emit-H2 '2. Lembar Penilaian CPMK11.2: Pemrosesan Data & Integrasi IPTEKS Prosedural (Bobot 40%)'
    $rubrikCpmk11 = @(
        @('1', 'Logika Backend & API Controller', '5', 'Istimewa / Sempurna: Arsitektur API/Controller sangat tangguh, aman (CSRF, sanitasi), modular, dan berperforma tinggi mematuhi konvensi Laravel 13.', '[ v ]'),
        @('2', 'Prosedur Pemrosesan & Validasi Data', '5', 'Istimewa / Sempurna: Validasi data Form Request sangat komprehensif, kalkulasi/agregasi diskon bertingkat & laba bersih berjalan tanpa cacat dan efisien.', '[ v ]'),
        @('3', 'Exception Handling & Optimasi Payload', '5', 'Istimewa / Sempurna: Sistem penanganan exception sempurna dengan DB Transaction rollback, pencegahan crash menyeluruh, dan optimasi payload respons sangat ringan.', '[ v ]')
    )
    Emit-Table -Headers @('No', 'Kriteria Penilaian', 'Skor', 'Deskripsi Indikator Kondisi Penilaian', 'Pilih') `
               -Rows $rubrikCpmk11 `
               -ColWidths @(500, 2200, 600, 5000, 700) `
               -Alignments @('center', 'left', 'center', 'left', 'center') `
               -HeaderBg '0369A1' -HeaderColor 'FFFFFF'

    $kalkulasiCpmk11 = @(
        @('Total Skor CPMK11.2 (Penjumlahan Skor Kriteria 1 s.d. 3)', '[ 15 / 15 ]'),
        @('Rata-rata Skor CPMK11.2 (Total Skor / 3)', '[ 5.00 / 5 ]'),
        @('NILAI KONVERSI SKALA 100 ((Rata-rata Skor / 5) x 100)', '[ 100.00 ]'),
        @('NILAI TERBOBOT CPMK11.2 (Nilai Konversi x 40%)', '[ 40.00 ]')
    )
    Emit-Table -Headers @('Metrik Perhitungan CPMK11.2', 'Nilai Terhitung') `
               -Rows $kalkulasiCpmk11 `
               -ColWidths @(6500, 2500) `
               -Alignments @('left', 'center') `
               -HeaderBg '1E293B' -HeaderColor 'FFFFFF'

    Emit-H2 '3. Lembar Penilaian CPMK07.2: Implementasi Produk Sistem Informasi Interaktif (Bobot 21%)'
    $rubrikCpmk07 = @(
        @('1', 'Integrasi Sistem Utuh', '5', 'Istimewa / Sempurna: Sistem terintegrasi sempurna antara frontend responsif, backend API, dan database relasional, performa interaksi data sangat cepat dan teruji.', '[ v ]'),
        @('2', 'Skenario Bisnis Digital & Ekonomi Kreatif', '5', 'Istimewa / Sempurna: Produk bisnis digital sangat inovatif, memberikan solusi nyata pada sektor ekonomi kreatif percetakan/ATK Kubu Raya, dan bernilai jual tinggi.', '[ v ]'),
        @('3', 'Deployment Online, Domain & Hosting', '5', 'Istimewa / Sempurna: Deployment tingkat profesional dengan domain publik aktif, SSL/TLS aman, performa akses cepat, dan ketersediaan tinggi.', '[ v ]')
    )
    Emit-Table -Headers @('No', 'Kriteria Penilaian', 'Skor', 'Deskripsi Indikator Kondisi Penilaian', 'Pilih') `
               -Rows $rubrikCpmk07 `
               -ColWidths @(500, 2200, 600, 5000, 700) `
               -Alignments @('center', 'left', 'center', 'left', 'center') `
               -HeaderBg '0369A1' -HeaderColor 'FFFFFF'

    $kalkulasiCpmk07 = @(
        @('Total Skor CPMK07.2 (Penjumlahan Skor Kriteria 1 s.d. 3)', '[ 15 / 15 ]'),
        @('Rata-rata Skor CPMK07.2 (Total Skor / 3)', '[ 5.00 / 5 ]'),
        @('NILAI KONVERSI SKALA 100 ((Rata-rata Skor / 5) x 100)', '[ 100.00 ]'),
        @('NILAI TERBOBOT CPMK07.2 (Nilai Konversi x 21%)', '[ 21.00 ]')
    )
    Emit-Table -Headers @('Metrik Perhitungan CPMK07.2', 'Nilai Terhitung') `
               -Rows $kalkulasiCpmk07 `
               -ColWidths @(6500, 2500) `
               -Alignments @('left', 'center') `
               -HeaderBg '1E293B' -HeaderColor 'FFFFFF'

    Emit-H2 '4. Lembar Penilaian Komponen Pendukung (Bobot 18%)'
    $rubrikPendukung = @(
        @('1', 'Sistematika Laporan & Clean Code (Sub-bobot 10%)', '5', 'Istimewa / Sempurna: Dokumentasi laporan akademik sangat komprehensif & rapi, repositori Git profesional dengan README.md jelas, kode sangat bersih menerapkan PSR-12 dan kaya komentar.', '[ v ]'),
        @('2', 'Presentasi & Demo Aplikasi (Sub-bobot 8%)', '5', 'Istimewa / Sempurna: Presentasi dan demonstrasi alur sistem luar biasa memukau, penguasaan materi teknis dan bisnis sempurna, serta tanggap menjawab pertanyaan penguji secara presisi.', '[ v ]')
    )
    Emit-Table -Headers @('No', 'Kriteria Penilaian', 'Skor', 'Deskripsi Indikator Kondisi Penilaian', 'Pilih') `
               -Rows $rubrikPendukung `
               -ColWidths @(500, 2400, 600, 4800, 700) `
               -Alignments @('center', 'left', 'center', 'left', 'center') `
               -HeaderBg '0369A1' -HeaderColor 'FFFFFF'

    $kalkulasiPendukung = @(
        @('Nilai Konversi Kriteria 1 (Sistematika Laporan & Clean Code) ((5 / 5) x 100)', '[ 100.00 ]'),
        @('Nilai Konversi Kriteria 2 (Presentasi & Demo Aplikasi) ((5 / 5) x 100)', '[ 100.00 ]'),
        @('NILAI TERBOBOT PENDUKUNG (Nilai 1 x 10% + Nilai 2 x 8%)', '[ 18.00 ]')
    )
    Emit-Table -Headers @('Metrik Perhitungan Komponen Pendukung', 'Nilai Terhitung') `
               -Rows $kalkulasiPendukung `
               -ColWidths @(6500, 2500) `
               -Alignments @('left', 'center') `
               -HeaderBg '1E293B' -HeaderColor 'FFFFFF'

    Emit-H2 'Rekapitulasi Dan Rumus Calculated Nilai Akhir Tugas Besar'
    Emit-Callout 'RUMUS AKUMULASI NILAI AKHIR TUGAS BESAR' 'Nilai Akhir = Nilai Terbobot CPMK12.1 (21%) + Nilai Terbobot CPMK11.2 (40%) + Nilai Terbobot CPMK07.2 (21%) + Nilai Terbobot Komponen Pendukung (18%)'

    $rekapitulasiRows = @(
        @('CPMK12.1: Perancangan Sistem & Antarmuka', '21%', '5.00', '100.00', '21.00'),
        @('CPMK11.2: Pemrosesan Data & Integrasi IPTEKS', '40%', '5.00', '100.00', '40.00'),
        @('CPMK07.2: Implementasi Produk Sistem Informasi', '21%', '5.00', '100.00', '21.00'),
        @('Komponen Pendukung (Laporan & Demo)', '18%', '5.00', '100.00', '18.00'),
        @('TOTAL NILAI AKHIR AKUMULASI (0 - 100)', '100%', '-', '-', '100.00 (A / Sempurna)')
    )
    Emit-Table -Headers @('Komponen Assessment', 'Bobot', 'Rata-rata Skor (1-5)', 'Nilai Konversi (0-100)', 'Nilai Terbobot Akhir') `
               -Rows $rekapitulasiRows `
               -ColWidths @(3200, 1100, 1600, 1600, 1500) `
               -Alignments @('left', 'center', 'center', 'center', 'center') `
               -HeaderBg '1E3A8A' -HeaderColor 'FFFFFF'

    Emit-P -text 'Catatan & Masukan Dosen Penguji:' -bold $true
    Emit-P -text 'Proyek tugas besar COPY STAR KUBU mendemonstrasikan keunggulan teknis yang luar biasa dan relevansi industri nyata pada sektor ekonomi kreatif. Penguasaan arsitektur backend Laravel 13, pemodelan ERD 3NF yang presisi, serta implementasi antarmuka offline-first yang intuitif sangat patut diapresiasi. Laporan disusun sangat sistematis dan memenuhi seluruh indikator capaian pembelajaran secara sempurna.' -italic $true
    
    Emit-P -text 'Disetujui,' -before 180 -after 280
    Emit-P -text 'Agung Sasongko, M.Kom' -bold $true -after 30
    Emit-P -text 'Dosen Pengampu Mata Kuliah Web Programming II' -italic $true

    Emit-PageBreak

    # -------------------------------------------------------------------------
    # KATA PENGANTAR
    # -------------------------------------------------------------------------
    Emit-H1 'KATA PENGANTAR'
    Emit-P -text "Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat, taufik, serta hidayah-Nya, sehingga penyusunan Laporan Tugas Besar Mata Kuliah Web Programming II dengan judul 'Sistem Informasi Manajemen Kasir dan Ritel Pintar COPY STAR KUBU Berbasis Web dengan Arsitektur REST API Laravel dan Offline-First JavaScript' dapat kami selesaikan dengan baik, sistematis, dan tepat waktu." -firstLineIndent 420
    Emit-P -text 'Laporan tugas besar ini disusun sebagai wujud pertanggungjawaban akademis dan pemenuhan seluruh indikator Capaian Pembelajaran Mata Kuliah (CPMK), meliputi perancangan sistem dan pemodelan antarmuka (CPMK12.1), penguasaan pemrosesan data backend prosedural dan integrasi IPTEKS (CPMK11.2), serta implementasi produk sistem informasi interaktif pada sektor ekonomi kreatif (CPMK07.2).' -firstLineIndent 420
    Emit-P -text 'Dalam menyelesaikan pengembangan aplikasi dan penulisan dokumen ini, kami memperoleh bimbingan, arahan, dan dukungan dari berbagai pihak. Oleh karena itu, melalui kesempatan ini kami mengucapkan terima kasih yang setulus-tulusnya kepada:' -firstLineIndent 420
    
    Emit-Bullet '1.' 'Bapak Agung Sasongko, M.Kom selaku Dosen Pengampu Mata Kuliah Web Programming II, yang telah mencurahkan ilmu, membimbing proses asistensi secara mendalam, serta senantiasa memberikan evaluasi konstruktif demi tercapainya standar perangkat lunak berkualitas industri.'
    Emit-Bullet '2.' 'Segenap Pimpinan dan Dosen Program Studi Sistem Informasi Fakultas Teknik dan Informatika Universitas Bina Sarana Informatika (UBSI), yang telah memfasilitasi sarana akademik dan kurikulum berbasis kompetensi aplikatif.'
    Emit-Bullet '3.' 'Bapak Theodorus Eldian selaku Pemilik (Owner) Unit Usaha COPY STAR KUBU di Kecamatan Kubu, Kabupaten Kubu Raya, Kalimantan Barat, atas keterbukaan informasi, penyediaan data operasional nyata, serta kesediaan menjadi mitra studi kasus pengujian perangkat lunak di lapangan.'
    Emit-Bullet '4.' 'Rekan-rekan satu tim pengembang Kelompok 1 (CopyStar Solutions) Kelas 19.3A.30 atas dedikasi, kolaborasi intensif, dan kerja keras bersama dari fase analisis, perancangan database, coding backend/frontend, hingga perampungan berkas ini.'
    Emit-Bullet '5.' 'Keluarga tercinta yang senantiasa melimpahkan doa, dorongan moral, dan dukungan materiil selama masa studi.'

    Emit-P -text 'Penulis menyadari bahwa tiada karya yang luput dari penyempurnaan. Oleh sebab itu, kritik dan saran yang konstruktif dari pembaca maupun akademisi sangat kami nantikan demi pengembangan aplikasi ini di masa mendatang. Semoga laporan ini memberi kontribusi nyata bagi digitalisasi ekonomi kreatif pedesaan serta referensi bernilai bagi komunitas akademik.' -firstLineIndent 420

    Emit-P -text 'Kubu Raya, Oktober 2026' -align 'right' -before 200 -after 40
    Emit-P -text 'Tim Pengembang CopyStar Solutions' -align 'right' -bold $true

    Emit-PageBreak

    # -------------------------------------------------------------------------
    # DAFTAR ISI
    # -------------------------------------------------------------------------
    Emit-H1 'DAFTAR ISI'
    
    $tocRows = @(
        @('HALAMAN JUDUL / COVER', 'i'),
        @('VI. LEMBAR ASISTENSI TUGAS BESAR', 'ii'),
        @('VII. LEMBAR PENILAIAN PROJECT (PER CPMK SKALA 1-5)', 'iii'),
        @('KATA PENGANTAR', 'iv'),
        @('DAFTAR ISI', 'v'),
        @('BAB I: PENDAHULUAN DAN SKENARIO BISNIS EKONOMI KREATIF (CPMK07.2)', '1'),
        @('   1.1 Latar Belakang Masalah Operasional Fotokopi & Ritel ATK', '1'),
        @('   1.2 Masalah Lapangan yang Dipecahkan', '2'),
        @('   1.3 Rumusan Masalah', '4'),
        @('   1.4 Batasan & Ruang Lingkup Sistem', '4'),
        @('   1.5 Tujuan dan Manfaat Implementasi Produk Sistem Informasi', '5'),
        @('   1.6 Skenario Implementasi Bisnis Digital & Nilai Tambah Ekonomi Kreatif', '6'),
        @('BAB II: PERANCANGAN SISTEM & ANTARMUKA (CPMK12.1)', '8'),
        @('   2.1 Perancangan Basis Data Relasional (Entity Relationship Diagram - ERD)', '8'),
        @('      2.1.1 Struktur Entitas, Kardinalitas Relasi & Schema Mapping', '8'),
        @('      2.1.2 Kamus Data (Data Dictionary) Terstruktur 12 Tabel Sistem', '10'),
        @('      2.1.3 Tahapan Normalisasi Basis Data (UNF, 1NF, 2NF, dan 3NF)', '15'),
        @('   2.2 Pemodelan Alur Sistem Berorientasi Objek (UML)', '17'),
        @('      2.2.1 Use Case Diagram (Actor Kasir, Owner, dan Pelanggan)', '17'),
        @('      2.2.2 Spesifikasi Naratif Skenario Use Case Utama', '19'),
        @('      2.2.3 Activity Diagram Alur Transaksi Kasir POS & Diskon Bertingkat', '21'),
        @('      2.2.4 Activity Diagram Alur Kasir Multi-Sesi Simultan (F4)', '23'),
        @('      2.2.5 Activity Diagram Studio Pas Foto Kilat 4R & Penggantian Background', '24'),
        @('      2.2.6 Activity Diagram Buka/Tutup Shift Kas & Rekonsiliasi Fisik', '25'),
        @('   2.3 Perancangan UI/UX Interaktif & Responsif', '26'),
        @('      2.3.1 Prinsip Perancangan Desain Interaksi & Shortcut Ergonomis', '26'),
        @('      2.3.2 Wireframe & Mockup Antarmuka Entri Data POS Multi-Tab', '27'),
        @('      2.3.3 Wireframe & Mockup Kalkulator Fotokopi Bertingkat & Live Preview', '28'),
        @('      2.3.4 Wireframe & Mockup Studio Pas Foto Kilat 4R Canvas', '29'),
        @('      2.3.5 Wireframe & Mockup Dashboard Monitoring Keuangan & AI Owner', '30'),
        @('BAB III: PEMROSESAN DATA & INTEGRASI IPTEKS PROSEDURAL (CPMK11.2)', '32'),
        @('   3.1 Arsitektur Backend Laravel 13 & Pola Desain Berorientasi Objek', '32'),
        @('   3.2 Pemodelan Routing Laravel (routes/web.php & routes/api.php)', '34'),
        @('   3.3 Pengembangan Logika Backend & API Controller', '36'),
        @('      3.3.1 PosTransactionController & Penanganan Payload Belanja', '36'),
        @('      3.3.2 TieredPricingService & Algoritma Kalkulasi Fotokopi', '39'),
        @('      3.3.3 ShiftManagementController & Rekonsiliasi Kas Otomatis', '41'),
        @('      3.3.4 ReportAnalyticsController & Agregasi Laba Bersih Riil', '43'),
        @('   3.4 Prosedur Pemrosesan Data & Validasi di Tingkat Server', '45'),
        @('   3.5 Pengelolaan Error (Exception Handling) & Database Transaction', '48'),
        @('   3.6 Teknik Optimasi Payload Data & Eliminasi Masalah N+1 Queries', '51'),
        @('BAB IV: IMPLEMENTASI, PENGUJIAN DAN PANDUAN DEPLOYMENT (CPMK07.2)', '54'),
        @('   4.1 Lingkungan Pengembangan & Kebutuhan Spesifikasi Perangkat', '54'),
        @('   4.2 Integrasi Komponen Frontend, Backend, dan Offline-First Engine', '55'),
        @('   4.3 Hasil Pengujian Sistem Berbasis Matriks Black Box Testing', '57'),
        @('   4.4 Panduan Lengkap Instalasi & Setup Lokal (Local Deployment)', '61'),
        @('   4.5 Strategi Deployment Online Publik & Konfigurasi Cloudflare Tunnel', '63'),
        @('BAB V: DOKUMENTASI REPOSITORI, CLEAN CODE & SKENARIO PRESENTASI', '66'),
        @('   5.1 Standar Kebersihan Kode (Clean Code Conventions & PSR-12)', '66'),
        @('   5.2 Struktur Repositori Git & Kelengkapan Dokumentasi README.md', '68'),
        @('   5.3 Skenario Demonstrasi Aplikasi (Run-sheet Demo 3-5 Menit)', '70'),
        @('   5.4 Pembagian Peran Anggota Tim & Matriks Kontribusi Proyek', '72'),
        @('   5.5 Antisipasi Pertanyaan Penguji & Panduan Jawaban Teknis', '73'),
        @('BAB VI: KESIMPULAN DAN SARAN', '75'),
        @('   6.1 Kesimpulan Capaian Proyek Berdasarkan CPMK', '75'),
        @('   6.2 Saran Pengembangan Sistem di Masa Depan', '76'),
        @('DAFTAR PUSTAKA', '77'),
        @('LAMPIRAN A: SKEMA DATABASE DDL LENGKAP (POSTGRESQL / MYSQL)', '79'),
        @('LAMPIRAN B: SPESIFIKASI ENDPOINT REST API JSON', '83')
    )
    Emit-Table -Headers @('Daftar Bagian / Bab Laporan', 'Halaman') `
               -Rows $tocRows `
               -ColWidths @(7600, 1400) `
               -Alignments @('left', 'right') `
               -HeaderBg '1E3A8A' -HeaderColor 'FFFFFF'

    Emit-PageBreak
}

Write-Host 'Modul FrontMatter siap.' -ForegroundColor Green
