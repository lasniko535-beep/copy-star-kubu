<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Transaction;

class PosController extends Controller
{
    /**
     * Tampilkan Halaman Utama Kasir & Dasbor Manajemen berbasis Blade Templates
     */
    public function index()
    {
        $categories = Category::where('is_active', true)->get();
        $products = Product::where('is_active', true)->get();
        $recentTransactions = Transaction::with('items')
            ->orderBy('created_at', 'desc')
            ->take(100)
            ->get();

        $storeInfo = [
            'name' => env('STORE_NAME', 'COPY STAR KUBU'),
            'address' => env('STORE_ADDRESS', 'Jln. Soeparto 1 Kubu, Kec. Kubu, Kab. Kubu Raya'),
            'phone' => env('STORE_PHONE', '0812-5345-3440'),
            'location' => env('STORE_LOCATION', 'Meja Kasir 1'),
        ];

        return view('pos.index', compact('categories', 'products', 'recentTransactions', 'storeInfo'));
    }

    /**
     * Portal Khusus Pelanggan untuk Order Cetak / ATK Mandiri
     */
    public function customerPortal()
    {
        $products = Product::where('is_active', true)->get();
        return view('pos.customer', compact('products'));
    }
}
