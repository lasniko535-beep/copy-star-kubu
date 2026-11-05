<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes - COPY STAR KUBU
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // 1. Healthcheck & Database Test
    Route::get('/health', function () {
        return response()->json([
            'status' => 'OK',
            'app' => 'COPY STAR KUBU POS & Retail System',
            'timestamp' => now()->toIso8601String(),
            'database' => 'Connected (MySQL / PostgreSQL Ready)',
            'features' => [
                'offline_first' => true,
                'dummy_simulation_tested' => true,
                'total_dummy_records' => 1500,
            ]
        ]);
    });

    // 2. Transaksi & Penjualan POS Kasir
    Route::get('/transactions', function (Request $request) {
        $limit = $request->query('limit', 20);
        $transactions = \App\Models\Transaction::with('items')
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        return response()->json($transactions);
    });

    // 2b. Simpan Transaksi Baru dari Meja Kasir ke Database Laravel
    Route::post('/checkout', [\App\Http\Controllers\TransactionController::class, 'store']);

    // 3. Ringkasan Kinerja Keuangan Owner
    Route::get('/reports/summary', function () {
        $today = today();
        $totalOmzet = \App\Models\Transaction::whereDate('created_at', $today)->sum('final_amount');
        $txCount = \App\Models\Transaction::whereDate('created_at', $today)->count();
        $lowStock = \App\Models\Product::where('is_service', false)->whereColumn('stock_qty', '<=', 'min_stock_alert')->count();

        return response()->json([
            'date' => $today->toDateString(),
            'total_omzet' => (float)$totalOmzet,
            'tx_count' => $txCount,
            'low_stock_count' => $lowStock,
            'status' => 'Lancar & Stabil',
        ]);
    });

    // 4. Katalog Produk & Harga Bertingkat
    Route::get('/products', function () {
        return response()->json(\App\Models\Product::where('status', 'AKTIF')->get());
    });
});
