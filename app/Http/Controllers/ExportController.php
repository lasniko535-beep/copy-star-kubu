<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ExportController extends Controller
{
    /**
     * Ekspor Laporan Transaksi ke File Excel (.csv UTF-8 BOM)
     */
    public function exportExcel(Request $request)
    {
        $query = Transaction::with('items')->orderBy('created_at', 'desc');

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
            $filename = "LAPORAN_TRANSAKSI_EXCEL_COPY_STAR_KUBU_{$request->date}.csv";
        } else {
            $filename = "LAPORAN_TRANSAKSI_EXCEL_COPY_STAR_KUBU_" . date('Y-m-d') . ".csv";
        }

        $transactions = $query->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function() use ($transactions) {
            $handle = fopen('php://output', 'w');
            
            // UTF-8 BOM agar terbaca sempurna di Microsoft Excel
            fputs($handle, "\xEF\xBB\xBF");

            // Header Kolom Lengkap Excel
            fputcsv($handle, [
                'No. Faktur / Nota',
                'Hari',
                'Tanggal Transaksi',
                'Jam Presisi (WIB)',
                'Tempat / Lokasi Toko',
                'Nama Kasir',
                'Nama Pelanggan',
                'Rincian Barang yang Dibeli',
                'Total Macam Barang',
                'Total Qty Barang',
                'Subtotal (Rp)',
                'Diskon (Rp)',
                'Total Akhir Omzet (Rp)',
                'Metode Pembayaran',
                'Uang Diterima (Rp)',
                'Kembalian (Rp)',
                'Status Pembayaran'
            ]);

            foreach ($transactions as $t) {
                $createdAt = Carbon::parse($t->created_at);
                $dayName = $createdAt->locale('id')->isoFormat('dddd');
                $dateStr = $createdAt->format('d/m/Y');
                $timeStr = $createdAt->format('H:i:s') . ' WIB';

                $itemsArr = [];
                $totalQty = 0;
                foreach ($t->items as $it) {
                    $totalQty += $it->qty;
                    $itemsArr[] = "{$it->product_name} [x{$it->qty} @Rp " . number_format($it->unit_sell_price, 0, ',', '.') . "]";
                }
                $itemsSummary = !empty($itemsArr) ? implode('; ', $itemsArr) : 'Layanan Percetakan / Fotokopi';

                fputcsv($handle, [
                    $t->invoice_no,
                    $dayName,
                    $dateStr,
                    $timeStr,
                    $t->location_place ?? 'COPY STAR KUBU - Meja Kasir 1',
                    'Kasir Toko',
                    $t->notes ?? 'Pelanggan Umum',
                    $itemsSummary,
                    count($t->items),
                    $totalQty,
                    $t->subtotal_amount,
                    $t->discount_amount,
                    $t->final_amount,
                    $t->payment_method,
                    $t->cash_received,
                    $t->cash_change,
                    $t->status,
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
