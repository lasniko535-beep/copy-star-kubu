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

// Halaman Utama Kasir & Dasbor POS (MVC Controller)
Route::get('/', [PosController::class, 'index'])->name('home');

// Halaman Riwayat Transaksi Laravel Blade
Route::get('/transaksi', [TransactionController::class, 'index'])->name('transactions.index');
Route::get('/transaksi/{invoiceNo}', [TransactionController::class, 'show'])->name('transactions.show');

// Ekspor Laporan Excel Laravel
Route::get('/ekspor/excel', [ExportController::class, 'exportExcel'])->name('transactions.export_excel');

// Shortcut Rute Peran (MVC Architecture)
Route::get('/kasir', [PosController::class, 'kasirMode'])->name('kasir');
Route::get('/owner', [PosController::class, 'ownerMode'])->name('owner');
Route::get('/pelanggan', [PosController::class, 'customerPortal'])->name('pelanggan');
