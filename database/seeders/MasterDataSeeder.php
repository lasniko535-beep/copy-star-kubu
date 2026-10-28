<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Store Settings
        DB::table('store_settings')->updateOrInsert(
            ['store_id' => 'STR-001'],
            [
                'store_name' => 'COPY STAR KUBU',
                'tagline' => 'Digital Photocopy, Photo Printing & ATK',
                'address' => 'Jln. Soeparto 1 Kubu, Desa Kubu, Kec. Kubu, Kab. Kubu Raya, Kalimantan Barat 78384',
                'phone' => '+62 812-5345-3440',
                'receipt_footer' => 'Terima kasih atas kunjungan Anda di COPY STAR KUBU!\nBarang yang sudah dibeli dapat ditukar max 24 jam dengan struk resmi.',
                'supervisor_pin' => '0000',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 2. Users (Owner & Kasir)
        $users = [
            [
                'user_id' => 'USR-001',
                'username' => 'owner',
                'password_hash' => Hash::make('owner123'),
                'full_name' => 'Niko (Pemilik Toko)',
                'role' => 'OWNER',
                'phone' => '081253453440',
                'email' => 'owner@copystarkubu.site',
                'shift_name' => 'Full Day (Supervisor)',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 'USR-002',
                'username' => 'kasir',
                'password_hash' => Hash::make('kasir123'),
                'full_name' => 'Thomas (Kasir Shift Pagi)',
                'role' => 'KASIR',
                'phone' => '081255443322',
                'email' => 'kasir@copystarkubu.site',
                'shift_name' => 'Pagi (08:00 - 16:00)',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 'USR-003',
                'username' => 'siti',
                'password_hash' => Hash::make('siti123'),
                'full_name' => 'Siti (Kasir Shift Sore)',
                'role' => 'KASIR',
                'phone' => '081277889900',
                'email' => 'siti@copystarkubu.site',
                'shift_name' => 'Sore (13:00 - 21:00)',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($users as $u) {
            DB::table('users')->updateOrInsert(['user_id' => $u['user_id']], $u);
        }

        // 3. Categories
        $categories = [
            ['category_id' => 'CAT-01', 'name' => 'Layanan Fotokopi', 'description' => 'Fotokopi digital B/W & Warna', 'icon_name' => 'copy'],
            ['category_id' => 'CAT-02', 'name' => 'Print Dokumen & Skripsi', 'description' => 'Print laser & inkjet', 'icon_name' => 'printer'],
            ['category_id' => 'CAT-03', 'name' => 'Penjilidan & Laminating', 'description' => 'Jilid mika, lakban, spiral kawat, laminating panas', 'icon_name' => 'book'],
            ['category_id' => 'CAT-04', 'name' => 'Kertas & Rim HVS', 'description' => 'HVS A4, F4, A3, Concorde, Buffalo', 'icon_name' => 'layers'],
            ['category_id' => 'CAT-05', 'name' => 'Alat Tulis Kantor (ATK)', 'description' => 'Pulpen, spidol, pensil, penghapus, cutter', 'icon_name' => 'pen-tool'],
            ['category_id' => 'CAT-06', 'name' => 'Map & Pengarsipan', 'description' => 'Map snelhechter, stopmap, ordner, plastik pocket', 'icon_name' => 'folder'],
            ['category_id' => 'CAT-07', 'name' => 'Studio Foto & Percetakan Digital', 'description' => 'Pas foto instan, banner, spanduk, undangan', 'icon_name' => 'camera'],
        ];

        foreach ($categories as $c) {
            DB::table('categories')->updateOrInsert(['category_id' => $c['category_id']], $c);
        }

        // 4. Products Master Catalog
        $products = [
            ['product_id' => 'PRD-001', 'category_id' => 'CAT-01', 'sku_barcode' => '8990010001', 'name' => 'Fotokopi B/W (Hitam Putih)', 'is_service' => true, 'unit' => 'Lembar', 'cost_price' => 85, 'sell_price' => 250, 'wholesale_price' => 200, 'wholesale_min_qty' => 50, 'stock_qty' => 999999, 'min_stock_alert' => 0],
            ['product_id' => 'PRD-002', 'category_id' => 'CAT-01', 'sku_barcode' => '8990010002', 'name' => 'Fotokopi Bolak-Balik (2 Sisi)', 'is_service' => true, 'unit' => 'Lembar', 'cost_price' => 160, 'sell_price' => 450, 'wholesale_price' => 380, 'wholesale_min_qty' => 50, 'stock_qty' => 999999, 'min_stock_alert' => 0],
            ['product_id' => 'PRD-003', 'category_id' => 'CAT-02', 'sku_barcode' => '8990020001', 'name' => 'Print Dokumen Teks Hitam', 'is_service' => true, 'unit' => 'Lembar', 'cost_price' => 280, 'sell_price' => 1000, 'wholesale_price' => 800, 'wholesale_min_qty' => 20, 'stock_qty' => 999999, 'min_stock_alert' => 0],
            ['product_id' => 'PRD-004', 'category_id' => 'CAT-02', 'sku_barcode' => '8990020002', 'name' => 'Print Warna / Full Color', 'is_service' => true, 'unit' => 'Lembar', 'cost_price' => 650, 'sell_price' => 2000, 'wholesale_price' => 1500, 'wholesale_min_qty' => 20, 'stock_qty' => 999999, 'min_stock_alert' => 0],
            ['product_id' => 'PRD-005', 'category_id' => 'CAT-03', 'sku_barcode' => '8990030001', 'name' => 'Jilid Lakban Mika Bening', 'is_service' => true, 'unit' => 'Buku', 'cost_price' => 1100, 'sell_price' => 3000, 'wholesale_price' => 2500, 'wholesale_min_qty' => 10, 'stock_qty' => 999999, 'min_stock_alert' => 0],
            ['product_id' => 'PRD-006', 'category_id' => 'CAT-03', 'sku_barcode' => '8990030002', 'name' => 'Jilid Spiral Plastik (Ring)', 'is_service' => true, 'unit' => 'Buku', 'cost_price' => 2400, 'sell_price' => 6000, 'wholesale_price' => 5000, 'wholesale_min_qty' => 5, 'stock_qty' => 999999, 'min_stock_alert' => 0],
            ['product_id' => 'PRD-007', 'category_id' => 'CAT-03', 'sku_barcode' => '8990030003', 'name' => 'Jilid Spiral Kawat Premium', 'is_service' => true, 'unit' => 'Buku', 'cost_price' => 3200, 'sell_price' => 8000, 'wholesale_price' => 7000, 'wholesale_min_qty' => 5, 'stock_qty' => 999999, 'min_stock_alert' => 0],
            ['product_id' => 'PRD-008', 'category_id' => 'CAT-03', 'sku_barcode' => '8990030004', 'name' => 'Laminating Panas KTP/Piagam (A4)', 'is_service' => true, 'unit' => 'Lembar', 'cost_price' => 1500, 'sell_price' => 4000, 'wholesale_price' => 3000, 'wholesale_min_qty' => 10, 'stock_qty' => 999999, 'min_stock_alert' => 0],
            ['product_id' => 'PRD-009', 'category_id' => 'CAT-04', 'sku_barcode' => '8992001001', 'name' => 'Kertas HVS PaperOne A4 70gr (Rim)', 'is_service' => false, 'unit' => 'Rim', 'cost_price' => 40000, 'sell_price' => 45000, 'wholesale_price' => 43000, 'wholesale_min_qty' => 5, 'stock_qty' => 35, 'min_stock_alert' => 10],
            ['product_id' => 'PRD-010', 'category_id' => 'CAT-04', 'sku_barcode' => '8992001002', 'name' => 'Kertas HVS Sinar Dunia F4 70gr (Rim)', 'is_service' => false, 'unit' => 'Rim', 'cost_price' => 42500, 'sell_price' => 48000, 'wholesale_price' => 46000, 'wholesale_min_qty' => 5, 'stock_qty' => 6, 'min_stock_alert' => 10],
            ['product_id' => 'PRD-013', 'category_id' => 'CAT-05', 'sku_barcode' => '8993001001', 'name' => 'Pulpen Standard AE7 0.5mm Hitam', 'is_service' => false, 'unit' => 'Pcs', 'cost_price' => 1700, 'sell_price' => 2500, 'wholesale_price' => 2000, 'wholesale_min_qty' => 12, 'stock_qty' => 140, 'min_stock_alert' => 20],
            ['product_id' => 'PRD-014', 'category_id' => 'CAT-05', 'sku_barcode' => '8993001002', 'name' => 'Pulpen Gel Pilot G2 0.7mm', 'is_service' => false, 'unit' => 'Pcs', 'cost_price' => 14500, 'sell_price' => 18000, 'wholesale_price' => 16500, 'wholesale_min_qty' => 6, 'stock_qty' => 3, 'min_stock_alert' => 5],
            ['product_id' => 'PRD-016', 'category_id' => 'CAT-06', 'sku_barcode' => '8994001001', 'name' => 'Map Snelhechter Folio Plastik', 'is_service' => false, 'unit' => 'Pcs', 'cost_price' => 3000, 'sell_price' => 4500, 'wholesale_price' => 3800, 'wholesale_min_qty' => 10, 'stock_qty' => 48, 'min_stock_alert' => 15],
            ['product_id' => 'PRD-025', 'category_id' => 'CAT-07', 'sku_barcode' => '8995001001', 'name' => 'Paket Studio Pas Foto 3x4 (4 Lbr)', 'is_service' => true, 'unit' => 'Paket', 'cost_price' => 3500, 'sell_price' => 15000, 'wholesale_price' => 12000, 'wholesale_min_qty' => 3, 'stock_qty' => 999999, 'min_stock_alert' => 0],
            ['product_id' => 'PRD-026', 'category_id' => 'CAT-07', 'sku_barcode' => '8995001002', 'name' => 'Paket Studio Pas Foto 4x6 (4 Lbr)', 'is_service' => true, 'unit' => 'Paket', 'cost_price' => 3500, 'sell_price' => 15000, 'wholesale_price' => 12000, 'wholesale_min_qty' => 3, 'stock_qty' => 999999, 'min_stock_alert' => 0],
            ['product_id' => 'PRD-027', 'category_id' => 'CAT-07', 'sku_barcode' => '8995001003', 'name' => 'Cetak Spanduk Flexi Frontlite / m²', 'is_service' => true, 'unit' => 'Meter', 'cost_price' => 28000, 'sell_price' => 65000, 'wholesale_price' => 55000, 'wholesale_min_qty' => 10, 'stock_qty' => 999999, 'min_stock_alert' => 0],
        ];

        foreach ($products as $p) {
            DB::table('products')->updateOrInsert(['product_id' => $p['product_id']], array_merge($p, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // 5. Tiered Pricing Rules
        $tieredRules = [
            ['tier_group_key' => 'copy_bw', 'min_qty' => 1, 'max_qty' => 10, 'price_per_unit' => 300, 'label' => '1 - 10 Lembar (Eceran)'],
            ['tier_group_key' => 'copy_bw', 'min_qty' => 11, 'max_qty' => 50, 'price_per_unit' => 275, 'label' => '11 - 50 Lembar'],
            ['tier_group_key' => 'copy_bw', 'min_qty' => 51, 'max_qty' => 100, 'price_per_unit' => 250, 'label' => '51 - 100 Lembar (Grosir Kecil)'],
            ['tier_group_key' => 'copy_bw', 'min_qty' => 101, 'max_qty' => 999999, 'price_per_unit' => 200, 'label' => '100+ Lembar (Grosir Buku/Modul)'],
        ];

        foreach ($tieredRules as $tr) {
            DB::table('tiered_pricing_rules')->updateOrInsert(
                ['tier_group_key' => $tr['tier_group_key'], 'min_qty' => $tr['min_qty']],
                array_merge($tr, ['created_at' => now(), 'updated_at' => now()])
            );
        }

        // 6. Members
        $members = [
            ['member_id' => 'MBR-001', 'name' => 'Pak RT Usman (RT 03)', 'phone' => '081255443322', 'member_category' => 'Warga Desa', 'discount_pct' => 5.00, 'loyalty_points' => 120, 'total_spent' => 450000],
            ['member_id' => 'MBR-002', 'name' => 'Bpk. Herman Saputra', 'phone' => '081399887766', 'member_category' => 'Guru / Pengajar', 'discount_pct' => 5.00, 'loyalty_points' => 250, 'total_spent' => 890000],
            ['member_id' => 'MBR-003', 'name' => 'CV. Mitra Karya Sejahtera', 'phone' => '081122334455', 'member_category' => 'B2B / Kantor', 'discount_pct' => 10.00, 'loyalty_points' => 840, 'total_spent' => 3200000],
        ];

        foreach ($members as $m) {
            DB::table('members')->updateOrInsert(['member_id' => $m['member_id']], array_merge($m, [
                'status' => 'AKTIF',
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
