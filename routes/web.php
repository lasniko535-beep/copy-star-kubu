<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PosController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ExportController;

/*
|--------------------------------------------------------------------------
| Web Routes - COPY STAR KUBU (Laravel 13 & Blade Templates)
|--------------------------------------------------------------------------
*/

// Halaman Utama Kasir & Dasbor POS
Route::get('/', function () {
    return file_get_contents(base_path('index.html'));
})->name('home');

// Halaman Riwayat Transaksi Laravel Blade
Route::get('/transaksi', [TransactionController::class, 'index'])->name('transactions.index');
Route::get('/transaksi/{invoiceNo}', [TransactionController::class, 'show'])->name('transactions.show');

// Ekspor Laporan Excel Laravel
Route::get('/ekspor/excel', [ExportController::class, 'exportExcel'])->name('transactions.export_excel');

// Shortcut Rute Peran
Route::get('/kasir', function () {
    return redirect('/?mode=kasir');
})->name('kasir');

Route::get('/owner', function () {
    return redirect('/?mode=owner');
})->name('owner');

Route::get('/pelanggan', function () {
    return redirect('/?mode=customer');
})->name('pelanggan');
