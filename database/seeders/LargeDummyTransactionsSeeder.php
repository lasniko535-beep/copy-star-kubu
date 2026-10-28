<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LargeDummyTransactionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Generates 1.500 realistic dummy transactions for stress testing and usability assessment.
     */
    public function run(): void
    {
        $this->command?->info("Memulai simulasi data dummy berskala besar (1.500 transaksi)...");

        $customers = [
            'Pelanggan Umum', 'Ibu Sulistowati', 'Pak RT Usman (RT 03)', 'Bpk. Herman Saputra',
            'Siti Rahmawati', 'CV. Mitra Karya Sejahtera', 'Dinas Pendidikan Kec. Kubu',
            'Puskesmas Kubu', 'SMP Negeri 1 Kubu', 'SD Negeri 04 Kubu', 'Koperasi Desa Mandiri',
            'Ahmad Fauzi (Mahasiswa)', 'Dewi Sartika (Guru)', 'Budi Santoso', 'Wahyu Pratama',
            'Ibu Nurhaliza', 'Pak RW Mulyadi', 'Kantor Desa Kubu', 'Bengkel Motor Jaya'
        ];

        $cashiers = ['USR-001', 'USR-002', 'USR-003'];
        $paymentMethods = ['TUNAI', 'TUNAI', 'QRIS', 'QRIS', 'TRANSFER', 'KASBON'];

        $productPool = [
            ['id' => 'PRD-001', 'name' => 'Fotokopi B/W (Hitam Putih)', 'price' => 250, 'cost' => 85, 'base_qty' => 30],
            ['id' => 'PRD-002', 'name' => 'Fotokopi Bolak-Balik (2 Sisi)', 'price' => 450, 'cost' => 160, 'base_qty' => 20],
            ['id' => 'PRD-003', 'name' => 'Print Dokumen Teks Hitam', 'price' => 1000, 'cost' => 280, 'base_qty' => 10],
            ['id' => 'PRD-004', 'name' => 'Print Warna / Full Color', 'price' => 2000, 'cost' => 650, 'base_qty' => 8],
            ['id' => 'PRD-005', 'name' => 'Jilid Lakban Mika Bening', 'price' => 3000, 'cost' => 1100, 'base_qty' => 1],
            ['id' => 'PRD-007', 'name' => 'Jilid Spiral Kawat Premium', 'price' => 8000, 'cost' => 3200, 'base_qty' => 1],
            ['id' => 'PRD-008', 'name' => 'Laminating Panas KTP/Piagam (A4)', 'price' => 4000, 'cost' => 1500, 'base_qty' => 2],
            ['id' => 'PRD-009', 'name' => 'Kertas HVS PaperOne A4 70gr (Rim)', 'price' => 45000, 'cost' => 40000, 'base_qty' => 1],
            ['id' => 'PRD-010', 'name' => 'Kertas HVS Sinar Dunia F4 70gr (Rim)', 'price' => 48000, 'cost' => 42500, 'base_qty' => 1],
            ['id' => 'PRD-013', 'name' => 'Pulpen Standard AE7 0.5mm Hitam', 'price' => 2500, 'cost' => 1700, 'base_qty' => 2],
            ['id' => 'PRD-014', 'name' => 'Pulpen Gel Pilot G2 0.7mm', 'price' => 18000, 'cost' => 14500, 'base_qty' => 1],
            ['id' => 'PRD-016', 'name' => 'Map Snelhechter Folio Plastik', 'price' => 4500, 'cost' => 3000, 'base_qty' => 3],
            ['id' => 'PRD-025', 'name' => 'Paket Studio Pas Foto 3x4 (4 Lbr)', 'price' => 15000, 'cost' => 3500, 'base_qty' => 1],
            ['id' => 'PRD-026', 'name' => 'Paket Studio Pas Foto 4x6 (4 Lbr)', 'price' => 15000, 'cost' => 3500, 'base_qty' => 1],
            ['id' => 'PRD-027', 'name' => 'Cetak Spanduk Flexi Frontlite / m²', 'price' => 65000, 'cost' => 28000, 'base_qty' => 1],
        ];

        $targetTotal = 1500;
        $batchSize = 250;

        $now = Carbon::now();

        // 1 Cash Shift awal
        $shiftId = DB::table('cash_shifts')->insertGetId([
            'user_id' => 'USR-002',
            'cashier_name' => 'Thomas (Kasir Shift Pagi)',
            'opened_at' => $now->copy()->subDays(60),
            'starting_cash' => 200000,
            'expected_cash' => 200000,
            'status' => 'OPEN',
            'created_at' => $now->copy()->subDays(60),
            'updated_at' => $now->copy()->subDays(60),
        ]);

        $transactionsBatch = [];
        $itemsBatch = [];

        for ($i = 1; $i <= $targetTotal; $i++) {
            $invNum = sprintf('INV-DUMMY-%05d', $i);
            $randomDaysAgo = rand(0, 60);
            $randomHours = rand(8, 20);
            $randomMinutes = rand(0, 59);
            $trxDate = $now->copy()->subDays($randomDaysAgo)->setTime($randomHours, $randomMinutes);

            $cashier = $cashiers[array_rand($cashiers)];
            $customer = $customers[array_rand($customers)];
            $payMethod = $paymentMethods[array_rand($paymentMethods)];

            // Item per transaksi: 1 - 4 item
            $numItems = rand(1, 4);
            $subtotal = 0;

            for ($k = 0; $k < $numItems; $k++) {
                $p = $productPool[array_rand($productPool)];
                $qty = $p['base_qty'] * rand(1, 3);
                $lineTotal = $p['price'] * $qty;
                $subtotal += $lineTotal;

                $itemsBatch[] = [
                    'invoice_no' => $invNum,
                    'product_id' => $p['id'],
                    'product_name' => $p['name'],
                    'unit_sell_price' => $p['price'],
                    'unit_cost_price' => $p['cost'],
                    'qty' => $qty,
                    'discount_item' => 0,
                    'subtotal' => $lineTotal,
                    'item_notes' => null,
                    'created_at' => $trxDate,
                    'updated_at' => $trxDate,
                ];
            }

            $discount = ($subtotal >= 100000) ? round($subtotal * 0.05) : 0;
            $finalAmount = $subtotal - $discount;

            $transactionsBatch[] = [
                'invoice_no' => $invNum,
                'user_id' => $cashier,
                'member_id' => null,
                'shift_id' => $shiftId,
                'subtotal_amount' => $subtotal,
                'discount_amount' => $discount,
                'final_amount' => $finalAmount,
                'payment_method' => $payMethod,
                'cash_received' => $finalAmount,
                'cash_change' => 0,
                'status' => 'PAID',
                'location_place' => 'COPY STAR KUBU - Meja Kasir 1 (Jln. Soeparto 1 Kubu)',
                'notes' => "Pelanggan: {$customer}",
                'created_at' => $trxDate,
                'updated_at' => $trxDate,
            ];

            // Insert bertahap per batchSize
            if (count($transactionsBatch) >= $batchSize) {
                DB::table('transactions')->insert($transactionsBatch);
                DB::table('transaction_items')->insert($itemsBatch);
                $transactionsBatch = [];
                $itemsBatch = [];
            }
        }

        // Sisa batch
        if (!empty($transactionsBatch)) {
            DB::table('transactions')->insert($transactionsBatch);
            DB::table('transaction_items')->insert($itemsBatch);
        }

        $this->command?->info("✅ Berhasil menginjeksi 1.500 transaksi dummy ke basis data.");
    }
}
