<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TransactionController extends Controller
{
    /**
     * Menampilkan Riwayat Transaksi Detail (Filter per Hari, Tanggal, Jam, dan Tempat)
     */
    public function index(Request $request)
    {
        $query = Transaction::with('items')->orderBy('created_at', 'desc');

        // Filter tanggal spesifik
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        // Filter pencarian
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('invoice_no', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%")
                  ->orWhere('payment_method', 'like', "%{$search}%");
            });
        }

        $transactions = $query->paginate(50);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'total_count' => $transactions->total(),
                'data' => $transactions
            ]);
        }

        return view('transactions.index', compact('transactions'));
    }

    /**
     * Rincian Lengkap Nota Transaksi (Modal Detail)
     */
    public function show($invoiceNo)
    {
        $transaction = Transaction::with('items')->where('invoice_no', $invoiceNo)->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'invoice_no' => $transaction->invoice_no,
                'location' => $transaction->location_place ?? 'COPY STAR KUBU - Meja Kasir 1',
                'day' => Carbon::parse($transaction->created_at)->locale('id')->isoFormat('dddd'),
                'date' => Carbon::parse($transaction->created_at)->format('d M Y'),
                'time' => Carbon::parse($transaction->created_at)->format('H:i:s') . ' WIB',
                'subtotal' => $transaction->subtotal_amount,
                'discount' => $transaction->discount_amount,
                'final_total' => $transaction->final_amount,
                'payment_method' => $transaction->payment_method,
                'cash_received' => $transaction->cash_received,
                'cash_change' => $transaction->cash_change,
                'notes' => $transaction->notes,
                'items' => $transaction->items
            ]
        ]);
    }

    /**
     * Simpan Transaksi Baru dari Meja Kasir (POS Checkout)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'payment_method' => 'required|string',
            'subtotal' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'total' => 'required|numeric',
            'cash_received' => 'nullable|numeric',
            'items' => 'required|array|min:1',
        ]);

        $invoiceNo = 'INV-' . date('Ymd') . '-' . str_pad(Transaction::count() + 1, 5, '0', STR_PAD_LEFT);
        $cashChange = max(0, ($validated['cash_received'] ?? $validated['total']) - $validated['total']);

        $transaction = Transaction::create([
            'invoice_no' => $invoiceNo,
            'user_id' => $request->user_id ?? 'USR-002',
            'member_id' => $request->member_id ?? null,
            'shift_id' => 1,
            'subtotal_amount' => $validated['subtotal'],
            'discount_amount' => $validated['discount'] ?? 0,
            'final_amount' => $validated['total'],
            'payment_method' => strtoupper($validated['payment_method']),
            'cash_received' => $validated['cash_received'] ?? $validated['total'],
            'cash_change' => $cashChange,
            'status' => 'PAID',
            'location_place' => 'COPY STAR KUBU - Meja Kasir 1 (Jln. Soeparto 1 Kubu)',
            'notes' => $request->notes ?? 'Pelanggan Umum',
        ]);

        foreach ($validated['items'] as $item) {
            TransactionItem::create([
                'invoice_no' => $invoiceNo,
                'product_id' => $item['productId'] ?? $item['id'] ?? 'PRD-001',
                'product_name' => $item['name'],
                'unit_sell_price' => $item['price'],
                'unit_cost_price' => $item['costPrice'] ?? 0,
                'qty' => $item['qty'],
                'discount_item' => 0,
                'subtotal' => ($item['price'] * $item['qty']),
            ]);

            // Pengurangan stok
            if (isset($item['productId'])) {
                $p = Product::find($item['productId']);
                if ($p && !$p->is_service) {
                    $p->decrement('stock', $item['qty']);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dicatat ke database Laravel!',
            'invoice_no' => $invoiceNo,
            'data' => $transaction->load('items')
        ]);
    }
}
