<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;

class PosController extends Controller
{
    /**
     * Tampilkan Halaman Utama Meja Kasir & Dasbor POS COPY STAR KUBU
     */
    public function index()
    {
        $indexPath = public_path('index.html');
        if (file_exists($indexPath)) {
            return response()->file($indexPath);
        }
        
        $rootIndexPath = base_path('index.html');
        if (file_exists($rootIndexPath)) {
            return response()->file($rootIndexPath);
        }

        return view('pos.index', [
            'categories' => Category::where('is_active', true)->get(),
            'products' => Product::where('is_active', true)->get(),
            'recentTransactions' => Transaction::with('items')->orderBy('created_at', 'desc')->take(50)->get(),
        ]);
    }

    /**
     * Mode Kasir (F2)
     */
    public function kasirMode()
    {
        return redirect('/?mode=kasir');
    }

    /**
     * Mode Dasbor Owner / Pemilik Toko
     */
    public function ownerMode()
    {
        return redirect('/?mode=owner');
    }

    /**
     * Portal Khusus Pelanggan untuk Order Cetak / ATK Mandiri
     */
    public function customerPortal()
    {
        return redirect('/?mode=customer');
    }
}
