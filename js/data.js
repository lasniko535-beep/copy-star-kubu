/**
 * COPY STAR KUBU - Digital Photocopy, Photo Printing & ATK
 * Initial Database State & Default Configuration
 */

const INITIAL_DATA = {
  storeInfo: {
    name: "COPY STAR KUBU",
    tagline: "Digital Photocopy, Photo Printing & ATK",
    address: "Jln. Soeparto 1 Kubu, Desa Kubu, Kec. Kubu, Kabupaten Kubu Raya",
    phone: "0812-5345-3440",
    waNumber: "6281253453440",
    waName: "Star Copy",
    instagram: "https://www.instagram.com/copystarkubu?obrf=YnByeXZsYnozb3dt",
    igHandle: "@copystarkubu",
    receiptFooter: "Terima kasih atas kunjungan Anda!\nKirim Berkas WA: 0812-5345-3440 (Star Copy)\nOrder IG: @copystarkubu\nBarang yang sudah dibeli tidak dapat ditukar kecuali perjanjian.",
    taxRate: 0, // 0% default
    supervisorPin: "0000"
  },

  // Akun Pengguna Sistem (Login & Autentikasi)
  users: [
    {
      id: "USR-001",
      username: "niko",
      password: "password123",
      name: "Niko",
      role: "KASIR", // 'KASIR' atau 'OWNER'
      phone: "0812-4433-2211",
      email: "niko@copystarkubu.com",
      shift: "Pagi (08:00 - 16:00)"
    },
    {
      id: "USR-002",
      username: "owner",
      password: "0000",
      name: "Theodorus Eldian (Star Copy)",
      role: "OWNER",
      phone: "0812-5345-3440",
      email: "owner@copystarkubu.com",
      shift: "Semua Akses & Laporan"
    },
    {
      id: "USR-003",
      username: "owen",
      password: "password123",
      name: "Owen Kevin",
      role: "KASIR",
      phone: "0813-8899-7766",
      email: "owen@copystarkubu.com",
      shift: "Siang (13:00 - 21:00)"
    },
    {
      id: "USR-004",
      username: "thomas",
      password: "password123",
      name: "Thomas",
      role: "KASIR",
      phone: "0857-1122-4455",
      email: "thomas@copystarkubu.com",
      shift: "Sore (15:00 - 22:00)"
    }
  ],

  categories: [
    { id: "all", name: "Semua Produk", icon: "grid" },
    { id: "print_copy", name: "Jasa Print & Copy", icon: "printer" },
    { id: "kertas", name: "Kertas & Buku", icon: "book-open" },
    { id: "atk", name: "Alat Tulis", icon: "edit-3" },
    { id: "jilid", name: "Jilid & Finishing", icon: "layers" },
    { id: "elektronik", name: "Aksesoris & Lainnya", icon: "hard-drive" }
  ],

  // Pricing Tiers untuk Fotokopi & Cetak (Tiered Pricing)
  printTiers: {
    copy_bw: [
      { min: 1, max: 10, price: 500, label: "1-10 lbr: Rp 500" },
      { min: 11, max: 50, price: 400, label: "11-50 lbr: Rp 400" },
      { min: 51, max: 100, price: 350, label: "51-100 lbr: Rp 350" },
      { min: 101, max: 99999, price: 250, label: ">100 lbr: Rp 250 (Super Hemat)" }
    ],
    copy_color: [
      { min: 1, max: 10, price: 1500, label: "1-10 lbr: Rp 1.500" },
      { min: 11, max: 50, price: 1200, label: "11-50 lbr: Rp 1.200" },
      { min: 51, max: 100, price: 1000, label: "51-100 lbr: Rp 1.000" },
      { min: 101, max: 99999, price: 800, label: ">100 lbr: Rp 800" }
    ],
    print_doc_bw: [
      { min: 1, max: 10, price: 1000, label: "1-10 lbr: Rp 1.000" },
      { min: 11, max: 50, price: 750, label: "11-50 lbr: Rp 750" },
      { min: 51, max: 100, price: 600, label: "51-100 lbr: Rp 600" },
      { min: 101, max: 99999, price: 500, label: ">100 lbr: Rp 500" }
    ],
    print_doc_color: [
      { min: 1, max: 10, price: 2500, label: "1-10 lbr: Rp 2.500" },
      { min: 11, max: 50, price: 2000, label: "11-50 lbr: Rp 2.000" },
      { min: 51, max: 99999, price: 1500, label: ">50 lbr: Rp 1.500" }
    ]
  },

  products: [
    {
      id: "PRD-001",
      name: "Fotokopi B/W (Hitam Putih)",
      category: "print_copy",
      isService: true,
      price: 500, // base price
      costPrice: 85,
      stock: 9999,
      minStock: 100,
      unit: "Lembar",
      tieredKey: "copy_bw",
      image: "copy",
      photo: "img/products/fotokopi_bw.jpg",
      badge: "Layanan Cepat",
      description: "Fotokopi dokumen resolusi tinggi mesin Canon digital IR series."
    },
    {
      id: "PRD-002",
      name: "Fotokopi Warna",
      category: "print_copy",
      isService: true,
      price: 1500,
      costPrice: 450,
      stock: 9999,
      minStock: 100,
      unit: "Lembar",
      tieredKey: "copy_color",
      image: "printer-color",
      photo: "img/products/print_warna.jpg",
      badge: "Warna Tajam",
      description: "Fotokopi full color laser toner tahan air."
    },
    {
      id: "PRD-003",
      name: "Print Dokumen B/W",
      category: "print_copy",
      isService: true,
      price: 1000,
      costPrice: 150,
      stock: 9999,
      minStock: 100,
      unit: "Lembar",
      tieredKey: "print_doc_bw",
      image: "file-text",
      photo: "img/products/fotokopi_bw.jpg",
      badge: "Print Cepat",
      description: "Cetak dokumen PDF/Word/Excel dari HP / Flashdisk / WA."
    },
    {
      id: "PRD-004",
      name: "Print Warna / Full Color",
      category: "print_copy",
      isService: true,
      price: 2500,
      costPrice: 650,
      stock: 9999,
      minStock: 100,
      unit: "Lembar",
      tieredKey: "print_doc_color",
      image: "printer",
      photo: "img/products/print_warna.jpg",
      badge: "Vivid Color",
      description: "Cetak makalah, brosur, diagram full color."
    },
    {
      id: "PRD-005",
      name: "Cetak Foto Glossy 4R",
      category: "print_copy",
      isService: true,
      price: 3500,
      costPrice: 1100,
      stock: 500,
      minStock: 50,
      unit: "Lembar",
      image: "image",
      photo: "img/products/cetak_foto.jpg",
      badge: "Kertas Foto Tebal",
      description: "Kertas foto Ultra Glossy 230gsm tahan pudar 10 tahun."
    },
    {
      id: "PRD-006",
      name: "Jilid Lakban + Mika Bening",
      category: "jilid",
      isService: true,
      price: 4000,
      costPrice: 1200,
      stock: 350,
      minStock: 30,
      unit: "Buku",
      image: "layers",
      photo: "img/products/jilid.jpg",
      badge: "Finishing",
      description: "Jilid rapi cover mika bening depan dan buffalo belakang."
    },
    {
      id: "PRD-007",
      name: "Jilid Spiral Kawat",
      category: "jilid",
      isService: true,
      price: 8000,
      costPrice: 3200,
      stock: 80,
      minStock: 15,
      unit: "Buku",
      image: "disc",
      photo: "img/products/jilid_spiral.jpg",
      badge: "Elegan",
      description: "Spiral kawat ring besi kokoh untuk modul & portofolio."
    },
    {
      id: "PRD-008",
      name: "Laminating Panas Presisi",
      category: "jilid",
      isService: true,
      price: 3000,
      costPrice: 700,
      stock: 220,
      minStock: 40,
      unit: "Lembar",
      image: "shield",
      photo: "img/products/laminating.jpg",
      badge: "Anti Air",
      description: "Plastik laminasi 100 micron anti gelembung untuk KTP, piagam, ijazah."
    },
    {
      id: "PRD-009",
      name: "Kertas HVS PaperOne A4 70gr (Rim)",
      category: "kertas",
      isService: false,
      price: 48000,
      wholesalePrice: 45000,
      wholesaleMinQty: 5,
      costPrice: 40000,
      stock: 38,
      minStock: 10,
      unit: "Rim",
      image: "box",
      photo: "img/products/kertas_hvs.jpg",
      badge: "Grosir Min 5",
      variants: ["PaperOne A4 70g", "PaperOne A4 80g (+Rp 5.000)"],
      description: "Kertas putih bersih bebas macet 500 lembar per rim."
    },
    {
      id: "PRD-010",
      name: "Kertas HVS PaperOne F4/Folio 70gr (Rim)",
      category: "kertas",
      isService: false,
      price: 53000,
      wholesalePrice: 50000,
      wholesaleMinQty: 5,
      costPrice: 44000,
      stock: 6, // STOK MENIPIS!
      minStock: 10,
      unit: "Rim",
      image: "box",
      photo: "img/products/kertas_hvs.jpg",
      badge: "Stok Menipis!",
      description: "Kertas ukuran Folio (21.5 x 33 cm) paling sering dipakai kantor & skripsi."
    },
    {
      id: "PRD-011",
      name: "Buku Tulis Sinar Dunia 38 Lembar",
      category: "kertas",
      isService: false,
      price: 4500,
      wholesalePrice: 4000,
      wholesaleMinQty: 10,
      costPrice: 3200,
      stock: 120,
      minStock: 25,
      unit: "Pcs",
      image: "book",
      photo: "img/products/buku_tulis.jpg",
      badge: "Laris Sekolah",
      description: "Buku tulis bergaris kertas tebal halus SIDU."
    },
    {
      id: "PRD-012",
      name: "Pulpen Gel Pilot G2 0.5mm",
      category: "atk",
      isService: false,
      price: 18000,
      costPrice: 13500,
      stock: 8, // RESTOCK PREDICTION: 4 hari lagi habis
      minStock: 15,
      unit: "Pcs",
      image: "pen-tool",
      photo: "img/products/atk_pulpen.jpg",
      badge: "Cepat Habis",
      variants: ["Tinta Hitam", "Tinta Biru"],
      description: "Pulpen gel ergonomis nomor 1 paling digemari."
    },
    {
      id: "PRD-013",
      name: "Pulpen Standard AE7 0.5mm",
      category: "atk",
      isService: false,
      price: 2500,
      wholesalePrice: 2200,
      wholesaleMinQty: 12,
      costPrice: 1700,
      stock: 145,
      minStock: 30,
      unit: "Pcs",
      image: "edit-2",
      photo: "img/products/pulpen_standard.jpg",
      badge: "Best Seller",
      description: "Pulpen bola sejuta umat anti bocor lancar menulis."
    },
    {
      id: "PRD-014",
      name: "Map Plastik Clear Holder 20 Pocket",
      category: "jilid",
      isService: false,
      price: 12000,
      costPrice: 8500,
      stock: 35,
      minStock: 10,
      unit: "Pcs",
      image: "folder",
      photo: "img/products/map_clear_holder.jpg",
      badge: "Cross-Sell",
      description: "Map dokumen isi 20 lembar plastik bening untuk berkas rapi."
    },
    {
      id: "PRD-015",
      name: "Map Snelhechter Plastik Folio",
      category: "jilid",
      isService: false,
      price: 4000,
      costPrice: 2400,
      stock: 80,
      minStock: 20,
      unit: "Pcs",
      image: "folder-plus",
      photo: "img/products/map_snelhechter.jpg",
      badge: "Paling Dicari",
      description: "Map jepit tengah transparan aneka warna (Biru, Merah, Hijau, Kuning)."
    },
    {
      id: "PRD-016",
      name: "Paper Clip / Klip Kertas Joyko No. 3",
      category: "atk",
      isService: false,
      price: 3500,
      costPrice: 2100,
      stock: 45,
      minStock: 10,
      unit: "Kotak",
      image: "paperclip",
      photo: "img/products/paper_clip.jpg",
      badge: "Pelengkap",
      description: "Klip kertas kecil isi 100 pcs untuk merapikan print out."
    },
    {
      id: "PRD-017",
      name: "Tipe-X Kertas Correction Tape Joyko",
      category: "atk",
      isService: false,
      price: 8500,
      costPrice: 5800,
      stock: 28,
      minStock: 10,
      unit: "Pcs",
      image: "slash",
      photo: "img/products/tipex_tape.jpg",
      badge: "Favorit Mahasiswa",
      description: "Pita penghapus kering langsung bisa ditulis kembali tanpa noda."
    },
    {
      id: "PRD-018",
      name: "Stapler HD-10 Kangaro",
      category: "atk",
      isService: false,
      price: 16000,
      costPrice: 11500,
      stock: 18,
      minStock: 5,
      unit: "Pcs",
      image: "check-square",
      photo: "img/products/stapler.jpg",
      badge: "Awet",
      description: "Stapler besi kuat sampai 20 lembar kertas."
    },
    {
      id: "PRD-019",
      name: "Flashdisk SanDisk Cruzer 32GB USB 2.0",
      category: "elektronik",
      isService: false,
      price: 58000,
      costPrice: 45000,
      stock: 12,
      minStock: 5,
      unit: "Unit",
      image: "hard-drive",
      photo: "img/products/flashdisk.jpg",
      badge: "Garansi 5 Thn",
      description: "Flashdisk original untuk simpan tugas kuliah dan file print."
    },
    {
      id: "PRD-020",
      name: "Pulpen Gel Pastel Warna Warni 12 Pcs",
      category: "atk",
      isService: false,
      price: 24000,
      costPrice: 17000,
      stock: 22,
      minStock: 5,
      unit: "Set",
      image: "feather",
      photo: "img/products/pulpen_pastel.jpg",
      badge: "Dead Stock (>60 Hari)",
      isDeadStock: true,
      lastSoldDaysAgo: 64,
      description: "Pulpen warna pastel estetik. Perlu bundling diskon agar cepat laku!"
    },
    {
      id: "PRD-021",
      name: "Jilid Hardcover Skripsi (Emboss Emas)",
      category: "jilid",
      isService: false,
      price: 35000,
      wholesalePrice: 30000,
      wholesaleMinQty: 5,
      costPrice: 14000,
      stock: 60,
      minStock: 10,
      unit: "Buku",
      image: "book",
      photo: "img/products/jilid_hardcover.jpg",
      badge: "Musim Skripsi",
      description: "Jilid hardcover tebal berlapis linen mewah dengan tulisan emboss foil emas standar universitas."
    },
    {
      id: "PRD-022",
      name: "Scan Dokumen ke PDF / Email",
      category: "print_copy",
      isService: true,
      price: 2000,
      costPrice: 300,
      stock: 9999,
      minStock: 100,
      unit: "Lembar",
      image: "copy",
      photo: "img/products/scan_dokumen.jpg",
      badge: "Tanpa Antri",
      description: "Pindai dokumen fisik resolusi tinggi ke format PDF atau langsung kirim via Email / WhatsApp."
    },
    {
      id: "PRD-023",
      name: "Cetak Pas Foto (3x4 / 4x6 Satu Set)",
      category: "print_copy",
      isService: false,
      price: 15000,
      costPrice: 4500,
      stock: 200,
      minStock: 30,
      unit: "Set",
      image: "printer",
      photo: "img/products/cetak_pasfoto.jpg",
      badge: "Siap Cepat",
      description: "Paket cetak pas foto kertas doff/glossy ukuran 3x4 dan 4x6 untuk ijazah dan berkas lamaran."
    },
    {
      id: "PRD-024",
      name: "Kertas HVS A3 70gr (Lembar)",
      category: "kertas",
      isService: false,
      price: 1500,
      wholesalePrice: 1200,
      wholesaleMinQty: 10,
      costPrice: 600,
      stock: 200,
      minStock: 30,
      unit: "Lembar",
      image: "box",
      photo: "img/products/kertas_a3.jpg",
      badge: "Grosir Min 10",
      description: "Kertas HVS ukuran besar A3 putih bersih untuk cetak denah, tabel lebar, dan gambar arsitektur."
    },
    {
      id: "PRD-025",
      name: "Amplop Coklat Folio (Isi 10)",
      category: "atk",
      isService: false,
      price: 12000,
      costPrice: 7500,
      stock: 40,
      minStock: 10,
      unit: "Pack",
      image: "folder",
      photo: "img/products/amplop_coklat.jpg",
      badge: "Pelengkap Berkas",
      description: "Amplop coklat tebal ukuran folio isi 10 lembar untuk kelengkapan berkas lamaran dan dokumen resmi."
    },
    {
      id: "PRD-026",
      name: "Materai 10.000",
      category: "atk",
      isService: false,
      price: 12000,
      costPrice: 10500,
      stock: 50,
      minStock: 10,
      unit: "Lembar",
      image: "edit-2",
      photo: "img/products/materai.jpg",
      badge: "Selalu Dicari",
      description: "Meterai tempel nominal 10.000 resmi untuk keabsahan surat perjanjian, dokumen skripsi, dan kontrak."
    },
    {
      id: "PRD-027",
      name: "Cetak Banner / Spanduk (per Meter)",
      category: "print_copy",
      isService: true,
      price: 25000,
      costPrice: 12000,
      stock: 9999,
      minStock: 10,
      unit: "m²",
      image: "image",
      photo: "img/products/banner.jpg",
      badge: "Desain Gratis",
      description: "Cetak banner / spanduk bahan flexi outdoor resolusi tinggi. Harga per meter persegi, termasuk desain gratis untuk teks sederhana. Finishing mata ayam (eyelet) dan tali.",
      variants: ["Flexi China (Rp 25.000/m²)", "Flexi Korea Premium (Rp 35.000/m²)", "Albatros Indoor (Rp 30.000/m²)"]
    },
    {
      id: "PRD-028",
      name: "Jasa Desain & Cetak Undangan Nikah",
      category: "print_copy",
      isService: true,
      price: 150000,
      costPrice: 70000,
      stock: 9999,
      minStock: 5,
      unit: "100 lbr",
      image: "heart",
      photo: "img/products/undangan_nikah.jpg",
      badge: "Elegan & Cepat",
      description: "Paket desain + cetak undangan pernikahan / walimahan full color kertas art paper 230gsm. Harga per 100 lembar sudah termasuk desain eksklusif, amplop, dan tali pita. Revisi desain 3x.",
      variants: ["Paket 100 lbr (Rp 150.000)", "Paket 200 lbr (Rp 280.000)", "Paket 500 lbr (Rp 650.000)", "Undangan Digital (WhatsApp) (Rp 75.000)"]
    },
    {
      id: "PRD-029",
      name: "Jasa Desain & Cetak Undangan Acara / Penting",
      category: "print_copy",
      isService: true,
      price: 85000,
      costPrice: 40000,
      stock: 9999,
      minStock: 5,
      unit: "50 lbr",
      image: "mail",
      photo: "img/products/undangan_nikah.jpg",
      badge: "Cetak Cepat",
      description: "Desain + cetak undangan acara penting: khitanan, syukuran, rapat, seminar, wisuda, ulang tahun. Kertas art paper 210gsm full color. Harga per 50 lembar termasuk desain + revisi 2x.",
      variants: ["Paket 50 lbr (Rp 85.000)", "Paket 100 lbr (Rp 150.000)", "Paket 200 lbr (Rp 275.000)"]
    },
    {
      id: "PRD-030",
      name: "Jasa Desain & Cetak Sertifikat",
      category: "print_copy",
      isService: true,
      price: 8000,
      costPrice: 3500,
      stock: 9999,
      minStock: 10,
      unit: "Lembar",
      image: "award",
      photo: "img/products/sertifikat.jpg",
      badge: "Profesional",
      description: "Desain + cetak sertifikat / piagam penghargaan kertas linen / fancy paper 210gsm. Tersedia desain template atau custom sesuai permintaan. Cetak per lembar, cocok untuk sekolah, lomba, pelatihan, dan organisasi.",
      variants: ["Kertas HVS Biasa (Rp 5.000/lbr)", "Kertas Linen Fancy (Rp 8.000/lbr)", "Kertas Linen + Laminasi Doff (Rp 12.000/lbr)", "Frame + Sertifikat (Rp 35.000)"]
    },

    // ─── JASA CETAK PREMIUM ─────────────────────────────────
    {
      id: "PRD-031",
      name: "Cetak Kartu Nama (Desain + Cetak)",
      category: "print_copy",
      isService: true,
      price: 35000,
      costPrice: 15000,
      stock: 9999,
      minStock: 10,
      unit: "100 lbr",
      image: "credit-card",
      photo: "img/products/kartu_nama.jpg",
      badge: "Desain Gratis",
      description: "Desain + cetak kartu nama profesional art carton 260gsm full color 2 sisi. Termasuk desain eksklusif, revisi 2x. Selesai 1–2 hari kerja.",
      variants: ["Art Carton 260gsm (Rp 35.000/100lbr)", "Laminasi Doff (Rp 45.000/100lbr)", "Laminasi Glossy (Rp 43.000/100lbr)", "Soft Touch / Beludru (Rp 60.000/100lbr)"]
    },
    {
      id: "PRD-032",
      name: "Cetak Stiker Label Custom",
      category: "print_copy",
      isService: true,
      price: 15000,
      costPrice: 6000,
      stock: 9999,
      minStock: 10,
      unit: "Lembar A4",
      image: "tag",
      photo: "img/products/stiker_label.jpg",
      badge: "UMKM Friendly",
      description: "Cetak stiker label custom untuk produk UMKM, packaging, atau undangan. Bahan stiker vinyl / kertas glossy A4. Potong per lembar atau cutting custom.",
      variants: ["Stiker Kertas Glossy A4 (Rp 15.000/lbr)", "Stiker Vinyl Waterproof A4 (Rp 25.000/lbr)", "Stiker Transparan A4 (Rp 28.000/lbr)", "Roll Stiker (Rp 120.000/m)"]
    },
    {
      id: "PRD-033",
      name: "Cetak Nota / Kwitansi 2 Rangkap",
      category: "print_copy",
      isService: true,
      price: 45000,
      costPrice: 22000,
      stock: 9999,
      minStock: 5,
      unit: "Buku (50 set)",
      image: "file-text",
      photo: "img/products/nota_kwitansi.jpg",
      badge: "Custom Nama Toko",
      description: "Cetak nota / kwitansi 2 rangkap NCR carbonless custom nama toko / usaha. 50 set per buku, dijilid rapi. Bisa upload desain sendiri atau kami buatkan gratis.",
      variants: ["Nota 2 Rangkap - 50 set (Rp 45.000/buku)", "Nota 3 Rangkap - 50 set (Rp 60.000/buku)", "Faktur Pajak Custom (Rp 75.000/buku)"]
    },
    {
      id: "PRD-034",
      name: "Cetak Kalender Dinding Custom",
      category: "print_copy",
      isService: true,
      price: 25000,
      costPrice: 12000,
      stock: 9999,
      minStock: 5,
      unit: "Pcs",
      image: "calendar",
      photo: "img/products/kalender.jpg",
      badge: "Musiman Nov–Jan",
      description: "Cetak kalender dinding 12 bulan custom foto/logo perusahaan. Kertas art paper 150gsm full color. Cocok untuk souvenir, promosi usaha, atau hadiah akhir tahun.",
      variants: ["Kalender Foto A3 1 lembar (Rp 25.000)", "Kalender 12 Lembar A3 (Rp 85.000)", "Kalender Meja 13 Lembar (Rp 45.000)"]
    },
    {
      id: "PRD-035",
      name: "Cetak Poster / Foto Besar A3 & A2",
      category: "print_copy",
      isService: true,
      price: 12000,
      costPrice: 5000,
      stock: 9999,
      minStock: 10,
      unit: "Lembar",
      image: "image",
      photo: "img/products/poster_a3.jpg",
      badge: "Warna Vivid",
      description: "Cetak poster, foto besar, atau infografis ukuran A3 (29.7x42cm) dan A2 (42x59.4cm) full color resolusi tinggi. Kertas foto glossy atau doff.",
      variants: ["Poster A3 - Kertas HVS (Rp 8.000)", "Poster A3 - Foto Glossy (Rp 12.000)", "Poster A3 - Foto Doff (Rp 13.000)", "Poster A2 - Foto Glossy (Rp 22.000)"]
    },
    {
      id: "PRD-036",
      name: "Cetak ID Card / Kartu Anggota / Pelajar",
      category: "print_copy",
      isService: true,
      price: 10000,
      costPrice: 4500,
      stock: 9999,
      minStock: 10,
      unit: "Pcs",
      image: "user-check",
      photo: "img/products/id_card.jpg",
      badge: "Laminasi Termasuk",
      description: "Desain + cetak ID Card / kartu anggota / kartu pelajar ukuran standar 8.5x5.4cm, full color 2 sisi, sudah termasuk laminasi glossy dan tali gantung.",
      variants: ["ID Card PVC Polos (Rp 10.000/pcs)", "ID Card + Desain Custom (Rp 15.000/pcs)", "Paket 10 ID Card (Rp 85.000)", "Paket 50 ID Card (Rp 380.000)"]
    },
    {
      id: "PRD-037",
      name: "Jasa Ketik & Edit Dokumen",
      category: "print_copy",
      isService: true,
      price: 5000,
      costPrice: 1000,
      stock: 9999,
      minStock: 100,
      unit: "Halaman",
      image: "edit",
      photo: "img/products/jasa_ketik.jpg",
      badge: "Cepat & Rapi",
      description: "Jasa ketik dokumen, surat, skripsi, formulir, atau tabel dari tulisan tangan / foto. Termasuk format rapi, font standar. Siap cetak langsung setelah selesai.",
      variants: ["Ketik Biasa per Halaman (Rp 5.000)", "Ketik + Format Surat Resmi (Rp 8.000/hal)", "Edit & Revisi Dokumen (Rp 10.000/hal)", "Konversi PDF ke Word (Rp 15.000/file)"]
    },

    // ─── ATK BARU ────────────────────────────────────────────
    {
      id: "PRD-038",
      name: "Stabilo / Highlighter Faber-Castell",
      category: "atk",
      isService: false,
      price: 8500,
      wholesalePrice: 7500,
      wholesaleMinQty: 6,
      costPrice: 5800,
      stock: 55,
      minStock: 12,
      unit: "Pcs",
      image: "edit-3",
      photo: "img/products/stabilo.jpg",
      badge: "Pelajar Wajib",
      description: "Stabilo / marker highlighter Faber-Castell warna neon cerah. Anti luntur, tinta water-based aman. Tersedia warna Kuning, Hijau, Pink, Biru, Orange.",
      variants: ["Kuning", "Hijau", "Pink / Merah Muda", "Biru", "Orange"]
    },
    {
      id: "PRD-039",
      name: "Spidol Whiteboard Snowman",
      category: "atk",
      isService: false,
      price: 9000,
      wholesalePrice: 8000,
      wholesaleMinQty: 4,
      costPrice: 6200,
      stock: 42,
      minStock: 10,
      unit: "Pcs",
      image: "pen-tool",
      photo: "img/products/spidol.jpg",
      badge: "Mudah Hapus",
      description: "Spidol whiteboard Snowman tinta mudah terhapus, tidak bau menyengat. Cocok untuk papan tulis kelas, kantor, dan seminar. Juga tersedia spidol permanen.",
      variants: ["Whiteboard - Hitam", "Whiteboard - Merah", "Whiteboard - Biru", "Whiteboard Set 4 Warna (Rp 32.000)", "Spidol Permanen Hitam (Rp 7.500)"]
    },
    {
      id: "PRD-040",
      name: "Post-it / Sticky Notes 3M",
      category: "atk",
      isService: false,
      price: 12000,
      costPrice: 8000,
      stock: 35,
      minStock: 8,
      unit: "Pad",
      image: "square",
      photo: "img/products/post_it.jpg",
      badge: "Organisasi Rapi",
      description: "Kertas tempel / sticky notes 3M Post-it 100 lembar per pad. Perekat kuat namun tidak merusak permukaan. Tersedia ukuran 3x3 inch dan 3x5 inch, aneka warna.",
      variants: ["Post-it 3x3 inch Kuning (Rp 12.000)", "Post-it 3x3 inch Mix Color (Rp 14.000)", "Post-it 3x5 inch (Rp 16.000)", "Mini Sticky Notes 6 warna (Rp 9.000)"]
    },
    {
      id: "PRD-041",
      name: "Lem Stick / Glue Stick Joyko",
      category: "atk",
      isService: false,
      price: 5500,
      wholesalePrice: 5000,
      wholesaleMinQty: 6,
      costPrice: 3500,
      stock: 48,
      minStock: 12,
      unit: "Pcs",
      image: "droplet",
      photo: "img/products/lem_stick.jpg",
      badge: "Aman & Mudah",
      description: "Lem stick / glue stick Joyko formula non-toxic aman untuk anak. Tidak meninggalkan noda, kering cepat, cocok untuk kertas, karton, dan foto.",
      variants: ["Lem Stick 8gr (Rp 5.500)", "Lem Stick 15gr (Rp 8.000)", "Lem Stick 36gr (Rp 14.000)"]
    },
    {
      id: "PRD-042",
      name: "Penggaris 30cm & 60cm",
      category: "atk",
      isService: false,
      price: 5000,
      wholesalePrice: 4500,
      wholesaleMinQty: 5,
      costPrice: 3000,
      stock: 60,
      minStock: 15,
      unit: "Pcs",
      image: "minus",
      photo: "img/products/penggaris.jpg",
      badge: "Wajib Sekolah",
      description: "Penggaris plastik transparan bening anti pecah. Skala mm dan cm jelas terbaca. Tersedia ukuran 15cm, 30cm, dan 60cm untuk keperluan gambar teknik.",
      variants: ["Penggaris 15cm (Rp 3.000)", "Penggaris 30cm (Rp 5.000)", "Penggaris 60cm (Rp 9.000)", "Set Segitiga (Rp 10.000)"]
    },
    {
      id: "PRD-043",
      name: "Gunting & Cutter / Silet Joyko",
      category: "atk",
      isService: false,
      price: 12000,
      costPrice: 8000,
      stock: 28,
      minStock: 8,
      unit: "Pcs",
      image: "scissors",
      photo: "img/products/gunting_cutter.jpg",
      badge: "Tajam & Aman",
      description: "Gunting serbaguna baja anti karat gagang karet ergonomis, atau cutter / silet dengan blade lock aman. Wajib ada untuk keperluan print, kerajinan, dan administrasi.",
      variants: ["Gunting 18cm (Rp 12.000)", "Gunting 21cm (Rp 16.000)", "Cutter Kecil (Rp 7.000)", "Cutter Besar (Rp 12.000)", "Isi Ulang Cutter 10pcs (Rp 4.000)"]
    },
    {
      id: "PRD-044",
      name: "Ordner / Map Besar Bantex",
      category: "atk",
      isService: false,
      price: 28000,
      wholesalePrice: 25000,
      wholesaleMinQty: 3,
      costPrice: 18000,
      stock: 22,
      minStock: 5,
      unit: "Pcs",
      image: "archive",
      photo: "img/products/ordner.jpg",
      badge: "Arsip Rapi",
      description: "Ordner / map besar Bantex A4 kapasitas tebal 7cm atau 5cm. Cover karton tebal anti robek, ring D-clip besi kokoh. Warna pilihan untuk kode arsip kantor dan instansi.",
      variants: ["Ordner Tebal 7cm (Rp 28.000)", "Ordner Tipis 5cm (Rp 24.000)", "Ordner Slim 3.5cm (Rp 18.000)"]
    },
    {
      id: "PRD-045",
      name: "Baterai AA / AAA Alkaline",
      category: "elektronik",
      isService: false,
      price: 12000,
      wholesalePrice: 10000,
      wholesaleMinQty: 5,
      costPrice: 8000,
      stock: 40,
      minStock: 10,
      unit: "Pack (2 pcs)",
      image: "zap",
      photo: "img/products/baterai.jpg",
      badge: "Tahan Lama",
      description: "Baterai alkaline AA atau AAA tahan lama untuk remote, mainan, senter, dan perangkat elektronik. Merk Panasonic / ABC / Energizer tersedia.",
      variants: ["Baterai AA 2pcs (Rp 12.000)", "Baterai AAA 2pcs (Rp 12.000)", "Baterai AA 4pcs (Rp 22.000)", "Baterai 9V Kotak (Rp 18.000)"]
    },

    // ─── AKSESORIS & ELEKTRONIK TAMBAHAN ─────────
    {
      id: "PRD-046",
      name: "Kabel Data Fast Charging USB / Type-C",
      category: "elektronik",
      isService: false,
      price: 20000,
      wholesalePrice: 16000,
      wholesaleMinQty: 5,
      costPrice: 11000,
      stock: 25,
      minStock: 5,
      unit: "Pcs",
      image: "zap",
      photo: "img/products/kabel_data.jpg",
      badge: "Fast Charging",
      description: "Kabel data dan charging kualitas tinggi, support transfer data print dari HP ke komputer/laptop kasir dengan cepat dan stabil. Bahan braided anti putus.",
      variants: ["Type-C to USB (Rp 20.000)", "Micro USB (Rp 18.000)", "Lightning iPhone (Rp 25.000)", "Type-C to Type-C 60W (Rp 30.000)"]
    },
    {
      id: "PRD-047",
      name: "OTG Adapter Type-C & Micro USB",
      category: "elektronik",
      isService: false,
      price: 15000,
      wholesalePrice: 12000,
      wholesaleMinQty: 5,
      costPrice: 7000,
      stock: 30,
      minStock: 8,
      unit: "Pcs",
      image: "hard-drive",
      photo: "img/products/otg_adapter.jpg",
      badge: "Praktis Cetak",
      description: "Adapter OTG untuk colok flashdisk langsung ke HP Android/iPhone. Sangat membantu transfer dokumen kuliah/kantor sebelum dicetak.",
      variants: ["OTG Type-C Metal (Rp 15.000)", "OTG Micro USB (Rp 12.000)", "OTG 2-in-1 Dual Port (Rp 20.000)"]
    },
    {
      id: "PRD-048",
      name: "Card Reader All-in-One USB",
      category: "elektronik",
      isService: false,
      price: 18000,
      wholesalePrice: 15000,
      wholesaleMinQty: 5,
      costPrice: 9000,
      stock: 18,
      minStock: 5,
      unit: "Pcs",
      image: "database",
      photo: "img/products/card_reader.jpg",
      badge: "Multi Slot",
      description: "Card reader USB multifungsi membaca MicroSD dan SD Card kamera/HP. Praktis untuk cetak foto langsung dari kartu memori.",
      variants: ["Card Reader Mini USB (Rp 18.000)", "Card Reader Multi-Slot 4in1 (Rp 28.000)"]
    },
    {
      id: "PRD-049",
      name: "Kalkulator Meja 12 Digit",
      category: "atk",
      isService: false,
      price: 35000,
      wholesalePrice: 30000,
      wholesaleMinQty: 3,
      costPrice: 22000,
      stock: 15,
      minStock: 4,
      unit: "Pcs",
      image: "grid",
      photo: "img/products/kalkulator.jpg",
      badge: "Wajib Toko/Kantor",
      description: "Kalkulator meja display 12 digit besar, tombol empuk, dual power tenaga surya dan baterai. Ideal untuk kasir, dagang, dan kantor.",
      variants: ["Kalkulator Meja Standar 12 Digit (Rp 35.000)", "Kalkulator Meja Jumbo Karce (Rp 55.000)"]
    },
    {
      id: "PRD-050",
      name: "Kalkulator Ilmiah Scientific FX-350",
      category: "atk",
      isService: false,
      price: 85000,
      wholesalePrice: 78000,
      wholesaleMinQty: 2,
      costPrice: 62000,
      stock: 10,
      minStock: 3,
      unit: "Pcs",
      image: "grid",
      photo: "img/products/kalkulator_ilmiah.jpg",
      badge: "Siswa & Mahasiswa",
      description: "Kalkulator saintifik 240 fungsi hitung lengkap (trigonometri, statistik, pecahan, logaritma). Wajib untuk ujian SMA, SMK, dan mahasiswa teknik/ekonomi.",
      variants: ["Casio / Citizen FX-350MS Standar (Rp 85.000)", "FX-991ES Plus Fungsi Lengkap (Rp 165.000)"]
    },
    {
      id: "PRD-051",
      name: "CD / DVD-R Blank + Case Slim",
      category: "elektronik",
      isService: false,
      price: 8000,
      wholesalePrice: 6500,
      wholesaleMinQty: 10,
      costPrice: 4000,
      stock: 50,
      minStock: 15,
      unit: "Pcs",
      image: "disc",
      photo: "img/products/cd_dvd.jpg",
      badge: "Burning Skripsi",
      description: "Keping CD-R (700MB) atau DVD-R (4.7GB) blank + slim jewel case transparan. Sangat dicari mahasiswa untuk pengumpulan CD skripsi/tugas akhir dan arsip.",
      variants: ["CD-R Blank + Case (Rp 8.000)", "DVD-R Blank + Case (Rp 10.000)", "Paket Burning File + CD + Label (Rp 18.000)"]
    },
    {
      id: "PRD-052",
      name: "Mouse USB Optical Kabel",
      category: "elektronik",
      isService: false,
      price: 25000,
      wholesalePrice: 20000,
      wholesaleMinQty: 4,
      costPrice: 13000,
      stock: 16,
      minStock: 4,
      unit: "Pcs",
      image: "mouse-pointer",
      photo: "img/products/mouse_usb.jpg",
      badge: "Plug & Play",
      description: "Mouse optik USB kabel panjang 1.2m, sensor 1000 DPI akurat dan responsif. Desain ergonomis nyaman dipakai kerja seharian di laptop atau PC.",
      variants: ["Mouse USB Kabel Standar (Rp 25.000)", "Mouse Wireless 2.4GHz + Baterai (Rp 45.000)"]
    },
    {
      id: "PRD-053",
      name: "Earphone / Headset Wired 3.5mm",
      category: "elektronik",
      isService: false,
      price: 22000,
      wholesalePrice: 18000,
      wholesaleMinQty: 5,
      costPrice: 11000,
      stock: 20,
      minStock: 5,
      unit: "Pcs",
      image: "headphones",
      photo: "img/products/earphone.jpg",
      badge: "Bass Jernih + Mic",
      description: "Earphone kabel in-ear jack 3.5mm dilengkapi mic & tombol panggilan. Suara jernih dan bass mantap untuk kuliah online, meeting zoom, atau denger musik.",
      variants: ["Earphone Jack 3.5mm (Rp 22.000)", "Earphone Port Type-C (Rp 32.000)"]
    },
    {
      id: "PRD-054",
      name: "Lampu Belajar LED USB Portable",
      category: "elektronik",
      isService: false,
      price: 28000,
      wholesalePrice: 23000,
      wholesaleMinQty: 4,
      costPrice: 15000,
      stock: 14,
      minStock: 4,
      unit: "Pcs",
      image: "sun",
      photo: "img/products/lampu_belajar.jpg",
      badge: "Hemat Daya",
      description: "Lampu baca LED flexible leher elastis 360 derajat bertenaga USB. Bisa dicolok ke laptop, powerbank, atau charger. Cahaya ramah mata anti silau.",
      variants: ["Lampu USB Stick Mini (Rp 15.000)", "Lampu Belajar Meja Jepit Fleksibel (Rp 28.000)"]
    },
    {
      id: "PRD-055",
      name: "Tipex Cair / Correction Fluid Kenko",
      category: "atk",
      isService: false,
      price: 6000,
      wholesalePrice: 5000,
      wholesaleMinQty: 12,
      costPrice: 3500,
      stock: 45,
      minStock: 10,
      unit: "Botol",
      image: "edit-2",
      photo: "img/products/tipex_cair.jpg",
      badge: "Cepat Kering",
      description: "Cairan koreksi tipe botol kuas/pen berpresisi tinggi. Menutup tulisan tinta dan cetak dengan rapi tanpa meluber. Formula cepat kering.",
      variants: ["Kenko Correction Pen 7ml (Rp 6.000)", "Paket 3 Pcs Hemat (Rp 16.000)"]
    },
    {
      id: "PRD-056",
      name: "USB Hub 4 Port Hi-Speed",
      category: "elektronik",
      isService: false,
      price: 32000,
      wholesalePrice: 26000,
      wholesaleMinQty: 3,
      costPrice: 18000,
      stock: 12,
      minStock: 3,
      unit: "Pcs",
      image: "share-2",
      photo: "img/products/usb_hub.jpg",
      badge: "Multi Port",
      description: "Ekspansi 1 port USB menjadi 4 port USB 2.0/3.0. Solusi praktis laptop tipis yang kekurangan colokan untuk flashdisk, mouse, printer, dan keyboard.",
      variants: ["USB Hub 4 Port 2.0 (Rp 32.000)", "USB Hub 4 Port 3.0 High-Speed (Rp 55.000)"]
    },

    // ─── TINTA PRINTER EPSON 003 (SEMUA WARNA) ───────────────
    {
      id: "PRD-057",
      name: "Tinta Epson 003 Black / Hitam (Original 65ml)",
      category: "elektronik",
      isService: false,
      price: 85000,
      wholesalePrice: 80000,
      wholesaleMinQty: 4,
      costPrice: 68000,
      stock: 24,
      minStock: 5,
      unit: "Botol",
      image: "droplet",
      photo: "img/products/tinta_epson_003_black.jpg",
      badge: "Original 003 BK",
      description: "Tinta botol original Epson 003 Black (T00V1) isi 65ml untuk printer EcoTank L1110, L1210, L3110, L3150, L3210, L3250, L5190, L5290. Hasil cetak hitam pekat, tajam, dan anti pudar."
    },
    {
      id: "PRD-058",
      name: "Tinta Epson 003 Cyan / Biru (Original 65ml)",
      category: "elektronik",
      isService: false,
      price: 85000,
      wholesalePrice: 80000,
      wholesaleMinQty: 4,
      costPrice: 68000,
      stock: 18,
      minStock: 5,
      unit: "Botol",
      image: "droplet",
      photo: "img/products/tinta_epson_003_cyan.jpg",
      badge: "Original 003 C",
      description: "Tinta botol original Epson 003 Cyan / Biru (T00V2) isi 65ml untuk printer EcoTank L-Series. Warna biru cerah, tajam, dan formula aman untuk printhead micro piezo."
    },
    {
      id: "PRD-059",
      name: "Tinta Epson 003 Magenta / Merah (Original 65ml)",
      category: "elektronik",
      isService: false,
      price: 85000,
      wholesalePrice: 80000,
      wholesaleMinQty: 4,
      costPrice: 68000,
      stock: 18,
      minStock: 5,
      unit: "Botol",
      image: "droplet",
      photo: "img/products/tinta_epson_003_magenta.jpg",
      badge: "Original 003 M",
      description: "Tinta botol original Epson 003 Magenta / Merah (T00V3) isi 65ml untuk printer EcoTank L-Series. Warna merah presisi tinggi untuk cetak foto, banner, dan dokumen grafis."
    },
    {
      id: "PRD-060",
      name: "Tinta Epson 003 Yellow / Kuning (Original 65ml)",
      category: "elektronik",
      isService: false,
      price: 85000,
      wholesalePrice: 80000,
      wholesaleMinQty: 4,
      costPrice: 68000,
      stock: 18,
      minStock: 5,
      unit: "Botol",
      image: "droplet",
      photo: "img/products/tinta_epson_003_yellow.jpg",
      badge: "Original 003 Y",
      description: "Tinta botol original Epson 003 Yellow / Kuning (T00V4) isi 65ml untuk printer EcoTank L-Series. Gradasi warna kuning alami, cerah, dan stabil."
    },
    {
      id: "PRD-061",
      name: "Paket Tinta Epson 003 (1 Set 4 Warna Lengkap)",
      category: "elektronik",
      isService: false,
      price: 320000,
      wholesalePrice: 310000,
      wholesaleMinQty: 2,
      costPrice: 260000,
      stock: 12,
      minStock: 3,
      unit: "Set",
      image: "layers",
      photo: "img/products/tinta_epson_003.jpg",
      badge: "Hemat 4 Warna",
      variants: ["Set 4 Warna (Black, Cyan, Magenta, Yellow)", "Set 4 Warna + Ekstra Black 1 Btl"],
      description: "Paket hemat lengkap 4 botol tinta original Epson 003 (Black 65ml, Cyan 65ml, Magenta 65ml, Yellow 65ml). Solusi isi ulang praktis printer EcoTank, hemat Rp 20.000 dibanding beli satuan."
    }
  ],

  // AI Cross-Selling Rules (Sering Dibeli Bersama)
  crossSellRules: [
    {
      triggerCategories: ["elektronik"],
      triggerKeywords: ["tinta", "epson", "003"],
      recommendedProductIds: ["PRD-010", "PRD-004", "PRD-046"],
      reason: "Beli Tinta Epson? Sediakan juga Kertas HVS PaperOne F4/A4 untuk hasil cetak maksimal!"
    },
    {
      triggerCategories: ["kertas"],
      triggerKeywords: ["kertas", "rim"],
      recommendedProductIds: ["PRD-057", "PRD-061"],
      reason: "Beli kertas rim? Pastikan persediaan Tinta Epson 003 Anda masih cukup!"
    },
    {
      triggerCategories: ["print_copy"],
      triggerKeywords: ["print", "fotokopi", "copy"],
      recommendedProductIds: ["PRD-014", "PRD-015", "PRD-016"],
      reason: "Pelanggan cetak tugas sering membutuhkan Map dan Klip Kertas!"
    },
    {
      triggerCategories: ["kertas"],
      triggerKeywords: ["kertas", "rim", "buku"],
      recommendedProductIds: ["PRD-013", "PRD-017", "PRD-018"],
      reason: "Pembeli kertas biasanya menambah Pulpen dan Correction Tape."
    },
    {
      triggerCategories: ["jilid"],
      triggerKeywords: ["jilid", "laminating"],
      recommendedProductIds: ["PRD-014", "PRD-019"],
      reason: "Amankan dokumen jilid dengan Map Clear Holder / Backup USB."
    },
    {
      triggerCategories: ["print_copy"],
      triggerKeywords: ["banner", "spanduk"],
      recommendedProductIds: ["PRD-028", "PRD-029", "PRD-030"],
      reason: "Pelanggan banner sering butuh undangan acara dan sertifikat!"
    },
    {
      triggerCategories: ["print_copy"],
      triggerKeywords: ["undangan", "nikah", "sertifikat", "acara"],
      recommendedProductIds: ["PRD-026", "PRD-025", "PRD-008"],
      reason: "Lengkapi undangan / sertifikat dengan Materai, Amplop, dan Laminating!"
    },
    {
      triggerCategories: ["print_copy"],
      triggerKeywords: ["skripsi", "print", "cetak", "laporan"],
      recommendedProductIds: ["PRD-046", "PRD-047", "PRD-051"],
      reason: "Butuh kabel data / OTG untuk kirim file, atau CD blank untuk arsip skripsi?"
    },
    {
      triggerCategories: ["elektronik", "atk"],
      triggerKeywords: ["kalkulator", "mouse"],
      recommendedProductIds: ["PRD-045", "PRD-056"],
      reason: "Jangan lupa Baterai cadangan dan USB Hub untuk perangkat Anda!"
    }
  ],

  // Data Member & Poin Loyalitas
  members: [
    {
      id: "MBR-001",
      name: "Rian Ardiansyah",
      phone: "0813-7766-5544",
      category: "Mahasiswa",
      discountPct: 5,
      points: 245,
      totalSpent: 1250000,
      avatar: "👨‍🎓"
    },
    {
      id: "MBR-002",
      name: "CV. Mitra Karya Sejahtera (Pak Hendra)",
      phone: "0811-9876-1234",
      category: "Mitra Kantor / B2B",
      discountPct: 10,
      points: 820,
      totalSpent: 5640000,
      avatar: "🏢"
    },
    {
      id: "MBR-003",
      name: "Ibu Sulistowati, S.Pd",
      phone: "0852-3344-9988",
      category: "Guru Sekolah",
      discountPct: 5,
      points: 310,
      totalSpent: 1820000,
      avatar: "👩‍🏫"
    },
    {
      id: "MBR-004",
      name: "Dimas Anggara",
      phone: "0896-1122-3344",
      category: "Umum",
      discountPct: 0,
      points: 45,
      totalSpent: 280000,
      avatar: "👤"
    }
  ],

  // Data Karyawan & Status (Aktif / Nonaktif)
  employees: [
    {
      id: "EMP-001",
      name: "Niko",
      role: "Kasir & Front Office",
      status: "Aktif",
      phone: "0812-4433-2211",
      shift: "Pagi (08:00 - 16:00)",
      joinedDate: "15 Jan 2024",
      transactionsServed: 142,
      totalSales: 4850000
    },
    {
      id: "EMP-002",
      name: "Owen Kevin",
      role: "Operator Cetak & Kasir Siang",
      status: "Aktif",
      phone: "0813-8899-7766",
      shift: "Siang (13:00 - 21:00)",
      joinedDate: "01 Mar 2024",
      transactionsServed: 118,
      totalSales: 3920000
    },
    {
      id: "EMP-003",
      name: "Thomas",
      role: "Kasir Weekend & Shift Sore",
      status: "Aktif",
      phone: "0857-1122-4455",
      shift: "Sore (15:00 - 22:00)",
      joinedDate: "10 Jun 2024",
      transactionsServed: 95,
      totalSales: 3120000
    }
  ],

  // Shift Kasir Berjalan
  activeShift: {
    id: "SHF-20261007-01",
    cashierId: "EMP-001",
    cashierName: "Niko",
    openedAt: "2026-10-07 07:45:00",
    initialCash: 300000, // modal laci kas awal
    totalCashSales: 1150000,
    totalQrisSales: 450000,
    totalTransactions: 34,
    status: "OPEN"
  },

  // Kartu Stok (Riwayat Mutasi)
  stockLogs: [
    {
      date: "07 Okt 2026 09:30",
      productId: "PRD-010",
      productName: "Kertas HVS PaperOne F4 70gr",
      type: "KELUAR",
      qty: 4,
      finalStock: 6,
      note: "Penjualan Kasir TRX-8821",
      pic: "Niko"
    },
    {
      date: "06 Okt 2026 14:15",
      productId: "PRD-012",
      productName: "Pulpen Gel Pilot G2 0.5mm",
      type: "KELUAR",
      qty: 5,
      finalStock: 8,
      note: "Penjualan Kasir TRX-8815",
      pic: "Owen Kevin"
    },
    {
      date: "05 Okt 2026 11:00",
      productId: "PRD-009",
      productName: "Kertas HVS PaperOne A4 70gr",
      type: "MASUK",
      qty: 25,
      finalStock: 38,
      note: "Pengadaan Supplier PT. Sinar Dunia Mandiri (PO-104)",
      pic: "Theodorus Eldian (Owner)"
    },
    {
      date: "03 Okt 2026 16:45",
      productId: "PRD-013",
      productName: "Pulpen Standard AE7 0.5mm",
      type: "KOREKSI",
      qty: -2,
      finalStock: 145,
      note: "Stok Opname Selisih Fisik (1 pcs rusak tinta bocor)",
      pic: "Thomas"
    }
  ],

  // Riwayat Transaksi 7 Hari Terakhir (untuk Grafik, Omzet & Laba Bersih)
  recentTransactions: [
    {
      id: "TRX-1001",
      date: "2026-10-07 13:10",
      customer: "Rian Ardiansyah",
      cashier: "Niko",
      items: [
        { id: "PRD-001", name: "Fotokopi B/W", qty: 45, price: 400, costPrice: 85, total: 18000 },
        { id: "PRD-006", name: "Jilid Lakban + Mika Bening", qty: 1, price: 4000, costPrice: 1200, total: 4000 },
        { id: "PRD-014", name: "Map Plastik Clear Holder", qty: 1, price: 12000, costPrice: 8500, total: 12000 }
      ],
      subtotal: 34000,
      discount: 1700,
      total: 32300,
      costTotal: 13525,
      profit: 18775,
      paymentMethod: "QRIS",
      amountPaid: 32300,
      change: 0
    },
    {
      id: "TRX-1002",
      date: "2026-10-07 12:25",
      customer: "Pelanggan Tunai #102",
      cashier: "Owen Kevin",
      items: [
        { id: "PRD-010", name: "Kertas HVS PaperOne F4 70gr (Rim)", qty: 2, price: 53000, costPrice: 44000, total: 106000 },
        { id: "PRD-012", name: "Pulpen Gel Pilot G2 0.5mm", qty: 2, price: 18000, costPrice: 13500, total: 36000 }
      ],
      subtotal: 142000,
      discount: 0,
      total: 142000,
      costTotal: 115000,
      profit: 27000,
      paymentMethod: "TUNAI",
      amountPaid: 150000,
      change: 8000
    },
    {
      id: "TRX-1003",
      date: "2026-10-07 11:40",
      customer: "Ibu Sulistowati",
      cashier: "Thomas",
      items: [
        { id: "PRD-004", name: "Print Warna / Full Color", qty: 25, price: 2000, costPrice: 650, total: 50000 },
        { id: "PRD-007", name: "Jilid Spiral Kawat", qty: 2, price: 8000, costPrice: 3200, total: 16000 }
      ],
      subtotal: 66000,
      discount: 3300,
      total: 62700,
      costTotal: 22650,
      profit: 40050,
      paymentMethod: "SPLIT",
      cashPaid: 50000,
      qrisPaid: 12700,
      amountPaid: 62700,
      change: 0
    },
    {
      id: "TRX-1004",
      date: "2026-10-07 10:15",
      customer: "CV. Mitra Karya Sejahtera",
      cashier: "Niko",
      items: [
        { id: "PRD-001", name: "Fotokopi B/W", qty: 250, price: 250, costPrice: 85, total: 62500 },
        { id: "PRD-009", name: "Kertas HVS PaperOne A4 70gr", qty: 5, price: 45000, costPrice: 40000, total: 225000 },
        { id: "PRD-013", name: "Pulpen Standard AE7 0.5mm", qty: 12, price: 2200, costPrice: 1700, total: 26400 }
      ],
      subtotal: 313900,
      discount: 31390,
      total: 282510,
      costTotal: 241650,
      profit: 40860,
      paymentMethod: "TRANSFER",
      amountPaid: 282510,
      change: 0
    }
  ],

  // Data Statistik Mingguan (7 Hari) untuk Grafik Omzet & Margin
  weeklySalesData: [
    { day: "Kamis (01/10)", sales: 1240000, profit: 540000, margin: 43.5, txCount: 42 },
    { day: "Jumat (02/10)", sales: 1480000, profit: 650000, margin: 43.9, txCount: 51 },
    { day: "Sabtu (03/10)", sales: 1850000, profit: 820000, margin: 44.3, txCount: 68 },
    { day: "Minggu (04/10)", sales: 980000, profit: 410000, margin: 41.8, txCount: 35 },
    { day: "Senin (05/10)", sales: 2150000, profit: 970000, margin: 45.1, txCount: 78 },
    { day: "Selasa (06/10)", sales: 1920000, profit: 860000, margin: 44.7, txCount: 65 },
    { day: "Hari Ini (07/10)", sales: 1600000, profit: 720000, margin: 45.0, txCount: 54 }
  ],

  // Heatmap Jam Ramai Toko (Jam vs Hari)
  heatmapMatrix: [
    { hour: "08:00 - 10:00", Mon: 85, Tue: 70, Wed: 75, Thu: 60, Fri: 55, Sat: 40, Sun: 20 },
    { hour: "10:00 - 12:00", Mon: 95, Tue: 90, Wed: 85, Thu: 80, Fri: 85, Sat: 65, Sun: 35 },
    { hour: "12:00 - 14:00", Mon: 60, Tue: 55, Wed: 50, Thu: 50, Fri: 45, Sat: 40, Sun: 25 },
    { hour: "14:00 - 16:00", Mon: 88, Tue: 85, Wed: 80, Thu: 75, Fri: 70, Sat: 55, Sun: 30 },
    { hour: "16:00 - 18:00", Mon: 92, Tue: 88, Wed: 82, Thu: 78, Fri: 80, Sat: 60, Sun: 35 },
    { hour: "18:00 - 21:00", Mon: 50, Tue: 45, Wed: 40, Thu: 45, Fri: 50, Sat: 45, Sun: 20 }
  ],

  // Kalender Event & Seasonal Insight
  seasonalEvents: [
    { date: "15 Juli - 10 Ags", title: "Tahun Ajaran Baru & Masuk Sekolah", impact: "+65% Buku Tulis, Kertas Sampul & Map", color: "#F59E0B" },
    { date: "25 - 30 Tiap Bulan", title: "Periode Gajian Kantor (B2B Restock)", impact: "+40% Rim Kertas & Tinta Cetak", color: "#10B981" },
    { date: "Oktober - November", title: "Musim Skripsi & Laporan Magang", impact: "+80% Fotokopi, Print Warna & Jilid Skripsi", color: "#3B82F6" },
    { date: "Awal Desember", title: "Ujian Akhir Semester (UAS)", impact: "+50% Print Kisi-kisi & Modul", color: "#8B5CF6" }
  ],

  // Buku Kasbon & Utang Piutang Warga Desa
  debts: [
    {
      id: "KSB-001",
      trxId: "TRX-1005",
      customerName: "Pak RT Usman (RT 03)",
      customerPhone: "081255443322",
      customerAddress: "Jl. Poros Desa Kubu RT 03",
      date: "18 Okt 10:30",
      dueDate: "Akhir Bulan (Gajian)",
      totalAmount: 145000,
      paidAmount: 50000,
      remainingAmount: 95000,
      status: "BELUM_LUNAS",
      notes: "Fotokopi berkas bansos warga + 5 map snelhechter",
      itemsSummary: "Fotokopi B/W 150 lbr, Map Snelhechter 5 pcs",
      payments: [
        { date: "19 Okt 14:00", amount: 50000, note: "Cicilan pertama tunai", cashier: "Niko" }
      ]
    },
    {
      id: "KSB-002",
      trxId: "TRX-1008",
      customerName: "Bu Guru Ratna (SD Negeri 04)",
      customerPhone: "085299887711",
      customerAddress: "Perumahan Guru Desa",
      date: "19 Okt 16:15",
      dueDate: "Tanggal 25 (Gaji Sertifikasi)",
      totalAmount: 78000,
      paidAmount: 0,
      remainingAmount: 78000,
      status: "BELUM_LUNAS",
      notes: "Print soal ujian kelas 4 & 5 (Full Color + Kertas HVS A4)",
      itemsSummary: "Print Doc Warna 25 lbr, Kertas HVS A4 1 Rim",
      payments: []
    },
    {
      id: "KSB-003",
      trxId: "TRX-1011",
      customerName: "Pak Hendra (Staf Kantor Desa Kubu)",
      customerPhone: "081344556677",
      customerAddress: "Kantor Desa Kubu",
      date: "15 Okt 09:00",
      dueDate: "20 Oktober 2026",
      totalAmount: 180000,
      paidAmount: 180000,
      remainingAmount: 0,
      status: "LUNAS",
      notes: "Cetak banner musrenbang desa + jilid APBDes",
      itemsSummary: "Cetak Banner 3x1m, Jilid Hardcover 2 buku",
      payments: [
        { date: "20 Okt 11:30", amount: 180000, note: "Pelunasan tunai kas desa", cashier: "Owen Kevin" }
      ]
    }
  ],

  // Antrean Berkas Cetak & Foto Masuk via WhatsApp
  waQueue: [
    {
      id: "WA-201",
      senderName: "Budi Santoso (Warga RT 02)",
      phone: "081377889900",
      serviceType: "Cetak Pas Foto & Ijazah",
      docTitle: "Pas Foto 3x4 (4 lbr) & 4x6 (2 lbr) + Scan Ijazah",
      fileType: "FOTO_DOKUMEN",
      qty: 6,
      paperType: "Kertas Foto Glossy 230gsm",
      notes: "Background minta diganti warna merah, untuk daftar kerja",
      estimatedPrice: 25000,
      status: "SEDANG_DICETAK",
      createdAt: "10:15",
      urgent: true
    },
    {
      id: "WA-202",
      senderName: "Bu Bidan Rina (Pustu Desa)",
      phone: "085266778899",
      serviceType: "Print Dokumen Laporan PDF",
      docTitle: "Laporan_Posyandu_Balita_Oktober.pdf (32 Halaman)",
      fileType: "DOKUMEN_PDF",
      qty: 32,
      paperType: "HVS A4 70gr + Jilid Lakban Mika",
      notes: "Cetak rangkap 2, tolong dijilid mika bening depan dan biru belakang",
      estimatedPrice: 38000,
      status: "SIAP_DIAMBIL",
      createdAt: "09:30",
      urgent: false
    },
    {
      id: "WA-203",
      source: "WhatsApp",
      senderName: "Ahmad Dani (Siswa SMK)",
      phone: "089611223344",
      serviceType: "Print Tugas Gambar & Desain",
      docTitle: "Tugas_Desain_Denah_Rumah.jpg (Ukuran A3)",
      fileType: "PRINT_WARNA",
      qty: 2,
      paperType: "Kertas HVS A3 Tebal",
      notes: "Warna tajam ya kak buat dinilai guru besok pagi",
      estimatedPrice: 15000,
      status: "MENUNGGU",
      createdAt: "11:05",
      urgent: true
    },
    {
      id: "IG-204",
      source: "Instagram",
      senderName: "Sarah Amelia (@sarah.amelia)",
      phone: "@sarah.amelia",
      serviceType: "Cetak Piagam / Sertifikat & Foto",
      docTitle: "Sertifikat_Webinar_Desain.pdf (5 lbr)",
      fileType: "PRINT_WARNA",
      qty: 5,
      paperType: "Kertas Linen 210gsm",
      notes: "Order via DM Instagram @copystarkubu, minta dipotong rapi ya kak",
      estimatedPrice: 35000,
      status: "SIAP_DIAMBIL",
      createdAt: "12:20",
      urgent: false
    }
  ],

  // Log Aktivitas Keamanan
  activityLogs: [
    { time: "07 Okt 13:45", user: "Niko", action: "Buka Sesi Transaksi Multi-Tab Baru (Pelanggan #103)" },
    { time: "07 Okt 11:20", user: "Owner", action: "Pemberian Diskon Khusus 10% TRX-1004 (Otorisasi PIN Berhasil)" },
    { time: "07 Okt 07:45", user: "Niko", action: "Buka Shift Pagi dengan Modal Kas Rp 300.000" },
    { time: "05 Okt 11:00", user: "Owner", action: "Penerimaan Restock Kertas A4 (25 Rim) dari PO-104" }
  ]
};

// Helper fungsi untuk localStorage
function loadStoreData() {
  const saved = localStorage.getItem("COPY_STAR_KUBU_DATA");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Inisialisasi debts (kasbon) dan waQueue jika belum ada
      if (!Array.isArray(parsed.debts)) {
        parsed.debts = JSON.parse(JSON.stringify(INITIAL_DATA.debts));
      }
      if (!Array.isArray(parsed.waQueue)) {
        parsed.waQueue = JSON.parse(JSON.stringify(INITIAL_DATA.waQueue));
      }

      // Sinkronisasi foto produk dengan aset foto terbaru
      if (parsed && Array.isArray(parsed.products)) {
        const initialPhotos = {};
        INITIAL_DATA.products.forEach(p => {
          if (p.id && p.photo) initialPhotos[p.id] = p.photo;
        });

        parsed.products.forEach(function (p) {
          if (initialPhotos[p.id]) {
            p.photo = initialPhotos[p.id];
          }
        });
      }

      // Gabungkan produk dari INITIAL_DATA yang id-nya belum ada di data tersimpan
      if (parsed && Array.isArray(parsed.products)) {
        const existingIds = new Set(parsed.products.map(p => p.id));
        INITIAL_DATA.products.forEach(p => {
          if (!existingIds.has(p.id)) {
            parsed.products.push(JSON.parse(JSON.stringify(p)));
          }
        });
      }

      // Pastikan data toko & akun owner tersinkronisasi
      if (parsed) {
        if (!parsed.storeInfo) parsed.storeInfo = JSON.parse(JSON.stringify(INITIAL_DATA.storeInfo));
        parsed.storeInfo.address = "Jln. Soeparto 1 Kubu, Desa Kubu, Kec. Kubu, Kabupaten Kubu Raya";
        parsed.storeInfo.supervisorPin = "0000";
        parsed.storeInfo.phone = "0812-5345-3440";
        parsed.storeInfo.waNumber = "6281253453440";
        parsed.storeInfo.waName = "Star Copy";
        parsed.storeInfo.instagram = "https://www.instagram.com/copystarkubu?obrf=YnByeXZsYnozb3dt";
        parsed.storeInfo.igHandle = "@copystarkubu";
        parsed.storeInfo.receiptFooter = "Terima kasih atas kunjungan Anda!\nKirim Berkas WA: 0812-5345-3440 (Star Copy)\nOrder IG: @copystarkubu\nBarang yang sudah dibeli tidak dapat ditukar kecuali perjanjian.";

        // Migrasi akun kasir ke 3 orang: Niko, Owen Kevin, Thomas & Owner
        parsed.users = JSON.parse(JSON.stringify(INITIAL_DATA.users));
        parsed.employees = JSON.parse(JSON.stringify(INITIAL_DATA.employees));

        // Sinkronisasi shift kasir aktif
        if (parsed.activeShift) {
          if (!parsed.activeShift.cashierName || parsed.activeShift.cashierName.toLowerCase().includes("siti")) {
            parsed.activeShift.cashierName = "Niko";
            parsed.activeShift.cashierId = "EMP-001";
          }
        }

        // Migrasi histori transaksi nama kasir lama
        if (Array.isArray(parsed.recentTransactions)) {
          parsed.recentTransactions.forEach(t => {
            if (t.cashier) {
              const lower = t.cashier.toLowerCase();
              if (lower.includes("siti")) t.cashier = "Niko";
              else if (lower.includes("dimas")) t.cashier = "Owen Kevin";
              else if (lower.includes("anisa") || lower.includes("bayu")) t.cashier = "Thomas";
            }
          });
        }

        // Migrasi stock logs
        if (Array.isArray(parsed.stockLogs)) {
          parsed.stockLogs.forEach(l => {
            if (l.pic) {
              const lower = l.pic.toLowerCase();
              if (lower.includes("siti")) l.pic = "Niko";
              else if (lower.includes("dimas")) l.pic = "Owen Kevin";
              else if (lower.includes("anisa")) l.pic = "Thomas";
            }
          });
        }

        // Migrasi debts payments
        if (Array.isArray(parsed.debts)) {
          parsed.debts.forEach(d => {
            if (Array.isArray(d.payments)) {
              d.payments.forEach(p => {
                if (p.cashier && p.cashier.toLowerCase().includes("siti")) {
                  p.cashier = "Niko";
                }
              });
            }
          });
        }

        // Migrasi activityLogs
        if (Array.isArray(parsed.activityLogs)) {
          parsed.activityLogs.forEach(l => {
            if (l.user && l.user.toLowerCase().includes("siti")) {
              l.user = "Niko";
            }
          });
        }

        saveStoreData(parsed);
      }
      return parsed;
    } catch (e) {
      console.error("Gagal load saved data, pakai initial data", e);
    }
  }
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

function saveStoreData(data) {
  localStorage.setItem("COPY_STAR_KUBU_DATA", JSON.stringify(data));
}

function resetToDefaultData() {
  localStorage.removeItem("COPY_STAR_KUBU_DATA");
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}