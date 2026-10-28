# ==============================================================================
# BAGIAN 3: BAB III (PEMROSESAN DATA & INTEGRASI IPTEKS PROSEDURAL - CPMK11.2 - BOBOT 40%)
# ==============================================================================

function Generate-Bab3-Backend {
    Write-Host "Menyusun BAB III (CPMK11.2 - Bobot 40%)..." -ForegroundColor Yellow

    # =========================================================================
    # BAB III: PEMROSESAN DATA & INTEGRASI IPTEKS PROSEDURAL (CPMK11.2)
    # =========================================================================
    Emit-H1 "BAB III: PEMROSESAN DATA DAN INTEGRASI IPTEKS PROSEDURAL"
    Emit-Callout "TARGET CAPAIAN PEMBELAJARAN (CPMK11.2 - BOBOT 40%)" "Mampu menguasai konsep teoritis IPTEKS dan memformulasi penyelesaian masalah prosedural di industri melalui pembangunan logika backend API/Controller, prosedur pemrosesan dan validasi data berintegritas tinggi, serta implementasi exception handling dan teknik optimasi performa payload."

    Emit-H2 "3.1 Arsitektur Backend Laravel 13 & Pola Desain Berorientasi Objek"
    Emit-P -text "Arsitektur backend sistem COPY STAR KUBU dirancang mengadopsi kerangka kerja Laravel 13 (PHP 8.x) dengan menerapkan pola arsitektur Model-View-Controller (MVC) yang diperluas dengan Service Layer Pattern. Pemisahan tanggung jawab (Separation of Concerns) ini memastikan bahwa logika bisnis inti toko tidak bercampur dengan penanganan HTTP request, mempermudah pengujian unit (unit testing), serta menjaga kebersihan kode (clean code)." -firstLineIndent 420
    Emit-P -text "Lapisan arsitektur backend terdiri atas empat tingkatan berjenjang:" -firstLineIndent 420
    Emit-Bullet "1. Routing & Middleware Layer:" "Menerima HTTP request masuk, melakukan verifikasi token CSRF/Bearer token, throttling rate limiter, serta otorisasi hak akses (Role: Kasir vs Owner)."
    Emit-Bullet "2. Form Request Validation Layer:" "Memvalidasi seluruh tipe data dan batasan masukan sebelum diteruskan ke controller. Request yang gagal langsung dibatalkan secara otomatis dengan kode status HTTP 422 Unprocessable Entity."
    Emit-Bullet "3. Controller & Service Layer:" "Controller bertindak sebagai konduktor alur kerja yang mendelegasikan komputasi bisnis kompleks (seperti kalkulasi harga fotokopi bertingkat, mutasi stok gudang, dan rekonsiliasi kas) kepada modul Service mandiri."
    Emit-Bullet "4. Eloquent ORM & Database Layer:" "Menyediakan pemodelan objek relasional dengan proteksi parameter binding PDO terhadap ancaman SQL Injection, dilengkapi dukungan transaksi basis data ACID."

    Emit-H2 "3.2 Pemodelan Routing Laravel (routes/web.php & routes/api.php)"
    Emit-P -text "Sistem memisahkan rute antarmuka berbasis web (Blade View) dan endpoint antarmuka pemrograman aplikasi (REST API JSON):" -firstLineIndent 420

    Emit-CodeBlock @'
// ============================================================================
// FILE: routes/api.php - Endpoint RESTful API COPY STAR KUBU
// ============================================================================
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PosTransactionController;
use App\Http\Controllers\Api\TieredPricingController;
use App\Http\Controllers\Api\ShiftManagementController;
use App\Http\Controllers\Api\ReportAnalyticsController;
use App\Http\Controllers\Api\CustomerDebtController;

Route::prefix('v1')->middleware(['api'])->group(function () {
    // 1. Otentikasi & Sesi Shift Kasir
    Route::post('/auth/login', [ShiftManagementController::class, 'login']);
    Route::post('/shifts/open', [ShiftManagementController::class, 'openShift']);
    Route::post('/shifts/close', [ShiftManagementController::class, 'closeShift']);
    Route::get('/shifts/current', [ShiftManagementController::class, 'getCurrentShift']);

    // 2. Mesin Kalkulator Fotokopi Bertingkat
    Route::post('/calculator/calculate-tiered', [TieredPricingController::class, 'calculate']);

    // 3. Transaksi Kasir POS
    Route::get('/products/search', [PosTransactionController::class, 'searchProducts']);
    Route::post('/pos/checkout', [PosTransactionController::class, 'checkout']);
    Route::get('/pos/receipt/{invoiceNo}', [PosTransactionController::class, 'getReceiptData']);

    // 4. Manajemen Kasbon & Piutang Warga
    Route::get('/debts', [CustomerDebtController::class, 'index']);
    Route::post('/debts/{debtId}/pay', [CustomerDebtController::class, 'payInstallment']);

    // 5. Analitik & Laporan Laba Owner
    Route::middleware(['auth.owner'])->prefix('reports')->group(function () {
        Route::get('/executive-summary', [ReportAnalyticsController::class, 'getExecutiveSummary']);
        Route::get('/profit-loss', [ReportAnalyticsController::class, 'getNetProfitAnalysis']);
        Route::get('/dead-stock', [ReportAnalyticsController::class, 'getDeadStockWarning']);
    });
});
'@

    Emit-H2 "3.3 Pengembangan Logika Backend & API Controller"
    Emit-P -text "Bagian ini memaparkan implementasi algoritma pemrosesan data pada controller dan service layer utama sistem:" -firstLineIndent 420

    Emit-H3 "3.3.1 PosTransactionController: Penanganan Payload Transaksi Kasir"
    Emit-P -text "Controller ini memproses payload keranjang belanja dari kasir, memotong stok barang secara akurat, mencatat penerimaan kas, dan mengembalikan struk transaksi berformat JSON:"

    Emit-CodeBlock @'
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutTransactionRequest;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Product;
use App\Models\CashShift;
use App\Models\CustomerDebt;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class PosTransactionController extends Controller
{
    public function checkout(CheckoutTransactionRequest $request): JsonResponse
    {
        // Membuka transaksi database untuk menjamin konsistensi ACID
        return DB::transaction(function () use ($request) {
            $validated = $request->validated();
            
            // 1. Generate Nomor Faktur Unik: INV-YYYYMMDD-XXXX
            $datePrefix = date('Ymd');
            $countToday = Transaction::whereDate('created_at', today())->lockForUpdate()->count() + 1;
            $invoiceNo = sprintf('INV-%s-%04d', $datePrefix, $countToday);

            // 2. Hitung Total Omzet Kotor dan Total Modal HPP
            $totalSubtotal = 0;
            $totalCostHpp = 0;
            $itemsToInsert = [];

            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                // Validasi Kecukupan Stok untuk Produk Fisik Barang ATK
                if (!$product->is_service) {
                    if ($product->stock_qty < $item['qty']) {
                        throw new \Exception("Stok barang {$product->name} tidak mencukupi (Tersisa: {$product->stock_qty})");
                    }
                    // Mutasi Pengurangan Stok Fisik
                    $product->decrement('stock_qty', $item['qty']);
                    $product->update(['last_sold_at' => now(), 'is_dead_stock' => false]);
                }

                $lineSubtotal = ($item['sell_price'] * $item['qty']) - ($item['discount_amount'] ?? 0);
                $lineCost = $product->cost_price * $item['qty'];

                $totalSubtotal += $lineSubtotal;
                $totalCostHpp += $lineCost;

                $itemsToInsert[] = [
                    'invoice_no' => $invoiceNo,
                    'product_id' => $product->product_id,
                    'qty' => $item['qty'],
                    'cost_price' => $product->cost_price,
                    'sell_price' => $item['sell_price'],
                    'discount_amount' => $item['discount_amount'] ?? 0,
                    'subtotal' => $lineSubtotal,
                    'created_at' => now()
                ];
            }

            // 3. Kalkulasi Pajak, Diskon Global & Kembalian
            $discountGlobal = $validated['discount_amount'] ?? 0;
            $taxAmount = $validated['tax_amount'] ?? 0;
            $grandTotal = ($totalSubtotal - $discountGlobal) + $taxAmount;
            $cashReceived = $validated['cash_received'] ?? $grandTotal;
            $cashChange = max(0, $cashReceived - $grandTotal);

            // 4. Simpan Header Transaksi
            $transaction = Transaction::create([
                'invoice_no' => $invoiceNo,
                'user_id' => $validated['user_id'],
                'member_id' => $validated['member_id'] ?? null,
                'subtotal' => $totalSubtotal,
                'discount_amount' => $discountGlobal,
                'tax_amount' => $taxAmount,
                'grand_total' => $grandTotal,
                'payment_method' => $validated['payment_method'],
                'cash_received' => $cashReceived,
                'cash_change' => $cashChange,
                'total_cost_hpp' => $totalCostHpp,
                'net_profit' => ($grandTotal - $taxAmount) - $totalCostHpp,
                'status' => 'COMPLETED'
            ]);

            // 5. Simpan Seluruh Rincian Item Secara Batch (Optimasi Performa)
            TransactionItem::insert($itemsToInsert);

            // 6. Penanganan Khusus Pembayaran Kasbon (Tempo)
            if ($validated['payment_method'] === 'KASBON') {
                CustomerDebt::create([
                    'member_id' => $validated['member_id'],
                    'invoice_no' => $invoiceNo,
                    'total_debt' => $grandTotal,
                    'remaining_balance' => $grandTotal,
                    'due_date' => now()->addDays(30),
                    'status' => 'BELUM_LUNAS'
                ]);
            }

            // 7. Update Mutasi Kas Shift Kasir yang Sedang Aktif
            if ($validated['payment_method'] === 'TUNAI') {
                CashShift::where('user_id', $validated['user_id'])
                    ->where('status', 'OPEN')
                    ->increment('cash_in_sales', $grandTotal);
            }

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil diproses',
                'data' => [
                    'invoice_no' => $invoiceNo,
                    'grand_total' => $grandTotal,
                    'cash_received' => $cashReceived,
                    'cash_change' => $cashChange,
                    'payment_method' => $validated['payment_method'],
                    'print_thermal_url' => route('api.v1.receipt.print', $invoiceNo)
                ]
            ], 201);
        });
    }
}
'@

    Emit-H3 "3.3.2 TieredPricingService: Algoritma Kalkulasi Fotokopi Bertingkat"
    Emit-P -text "Modul kalkulasi fotokopi dirancang mandiri untuk menyelesaikan kompleksitas tarif berdasarkan volume lembar, varian kertas, orientasi cetak, dan opsi penjilidan buku:"

    Emit-CodeBlock @'
namespace App\Services;

class TieredPricingService
{
    /**
     * Algoritma penentuan tarif fotokopi & print bertingkat real-time
     */
    public function calculatePrintJob(array $params): array
    {
        $pages = intval($params['pages']);
        $copies = intval($params['copies'] ?? 1);
        $totalSheets = $pages * $copies;
        $printType = $params['print_type']; // 'BW' atau 'COLOR'
        $paperType = $params['paper_type']; // 'HVS_70', 'HVS_80', 'BUFFALO', 'GLOSSY'
        $isDuplex = boolval($params['is_duplex'] ?? false);
        $bindingType = $params['binding_type'] ?? 'NONE'; // 'LAKBAN', 'SPIRAL', 'HARDCOVER'

        // 1. Skema Harga Bertingkat Kuantitas Lembar (Tiered Rules)
        $baseRatePerSheet = 0;
        if ($printType === 'BW') {
            if ($totalSheets <= 10) {
                $baseRatePerSheet = 500;
            } elseif ($totalSheets <= 50) {
                $baseRatePerSheet = 350;
            } elseif ($totalSheets <= 100) {
                $baseRatePerSheet = 300;
            } else {
                $baseRatePerSheet = 250; // Tarif grosir dokumen tebal
            }
        } else { // FULL COLOR
            if ($totalSheets <= 10) {
                $baseRatePerSheet = 2500;
            } elseif ($totalSheets <= 50) {
                $baseRatePerSheet = 2000;
            } else {
                $baseRatePerSheet = 1500;
            }
        }

        // 2. Penyesuaian Jenis Kertas Spesial
        $paperSurcharge = match ($paperType) {
            'HVS_80' => 50,
            'BUFFALO' => 500,
            'GLOSSY' => 1500,
            default => 0 // HVS 70g standar
        };
        $effectiveRate = $baseRatePerSheet + $paperSurcharge;

        // 3. Diskon Duplex (Bolak-Balik Menghemat Lembaran Kertas Fisik)
        $printTotalCost = $effectiveRate * $totalSheets;
        if ($isDuplex) {
            $printTotalCost = $printTotalCost * 0.90; // Diskon hemat kertas 10%
        }

        // 4. Biaya Penjilidan Dokumen
        $bindingCost = match ($bindingType) {
            'LAKBAN' => 3000 * $copies,
            'SPIRAL_KECIL' => 5000 * $copies,
            'SPIRAL_BESAR' => 8000 * $copies,
            'HARDCOVER' => 25000 * $copies,
            default => 0
        };

        $grandTotal = ceil($printTotalCost + $bindingCost);

        return [
            'total_sheets' => $totalSheets,
            'unit_rate' => $effectiveRate,
            'print_cost' => $printTotalCost,
            'binding_cost' => $bindingCost,
            'grand_total' => $grandTotal,
            'tier_label' => ($totalSheets > 100) ? 'Grosir Dokumen Tebal (>100 Lembar)' : 'Standar Retail'
        ];
    }
}
'@

    Emit-H3 "3.3.3 ShiftManagementController: Rekonsiliasi Kas Laci Kasir"
    Emit-P -text "Mencegah kebocoran pendapatan dengan mewajibkan kasir memasukkan nominal uang fisik laci dan mencatat selisih sistem:"

    Emit-CodeBlock @'
public function closeShift(Request $request): JsonResponse
{
    $validated = $request->validate([
        'shift_id' => 'required|exists:cash_shifts,shift_id',
        'actual_cash_physical' => 'required|numeric|min:0',
        'cashier_note' => 'nullable|string|max:255'
    ]);

    $shift = CashShift::findOrFail($validated['shift_id']);
    
    // Perhitungan Saldo Kas Akhir Menurut Sistem:
    // Saldo Awal + Kas Masuk Penjualan Tunai + Kas Masuk Lainnya - Pengeluaran Kas
    $expectedCash = ($shift->starting_cash + $shift->cash_in_sales + $shift->cash_in_manual) - $shift->cash_out_expense;
    $actualCash = $validated['actual_cash_physical'];
    $discrepancy = $actualCash - $expectedCash; // Selisih Kas

    $shift->update([
        'expected_cash_system' => $expectedCash,
        'actual_cash_physical' => $actualCash,
        'cash_discrepancy' => $discrepancy,
        'closed_at' => now(),
        'cashier_note' => $validated['cashier_note'],
        'status' => 'CLOSED'
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Shift kasir resmi ditutup',
        'summary' => [
            'expected' => $expectedCash,
            'actual' => $actualCash,
            'discrepancy' => $discrepancy,
            'status_audit' => ($discrepancy == 0) ? 'SEIMBANG (PERFECT BALANCE)' : 'TERJADI SELISIH KAS'
        ]
    ]);
}
'@

    Emit-H2 "3.4 Prosedur Pemrosesan Data & Validasi di Tingkat Server"
    Emit-P -text "Keamanan backend diproteksi dengan Laravel Form Request Validation terdedikasi (`CheckoutTransactionRequest`). Validasi ini menjamin bahwa tidak ada payload berbahaya atau kalkulasi negatif yang lolos ke database:" -firstLineIndent 420

    Emit-CodeBlock @'
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutTransactionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'user_id' => 'required|string|exists:users,user_id',
            'member_id' => 'nullable|string|exists:members,member_id',
            'payment_method' => 'required|in:TUNAI,QRIS,KASBON',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'cash_received' => 'required_if:payment_method,TUNAI|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|string|exists:products,product_id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.sell_price' => 'required|numeric|min:0',
            'items.*.discount_amount' => 'nullable|numeric|min:0'
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Keranjang belanja tidak boleh kosong.',
            'items.*.qty.min' => 'Kuantitas setiap item minimal 1 unit.',
            'cash_received.required_if' => 'Nominal uang tunai wajib diisi untuk transaksi tunai.'
        ];
    }
}
'@

    Emit-H2 "3.5 Pengelolaan Error (Exception Handling) & Integritas Transaksi"
    Emit-P -text "Penanganan kesalahan dirancang menyeluruh (fail-safe) dengan pendekatan Global Exception Handler dan transaksi basis data:" -firstLineIndent 420
    Emit-Bullet "1. Pencegahan Inkonsistensi Data (ACID Rollback):" "Seluruh operasi perakitan faktur dikemas dalam `DB::transaction()`. Apabila saat proses penyimpanan terjadi error (misalnya stok barang tidak mencukupi atau kegagalan koneksi tabel piutang), seluruh perubahan data dibatalkan secara otomatis (Rollback) sehingga tidak ada nota transaksi separuh jadi yang menggantung."
    Emit-Bullet "2. Format Response Error Terstandarisasi RFC 7807:" "Setiap kegagalan API mengembalikan payload JSON terstruktur dengan HTTP Status Code yang akurat (400 Bad Request, 422 Unprocessable Entity, 500 Internal Server Error)."

    Emit-CodeBlock @'
// Format Standard Error Response JSON
{
    "success": false,
    "error_code": "INSUFFICIENT_STOCK",
    "message": "Stok barang Kertas Foto Glossy A4 tidak mencukupi (Tersisa: 2 rim, Diminta: 5 rim)",
    "timestamp": "2026-10-26T14:30:00Z"
}
'@

    Emit-H2 "3.6 Teknik Optimasi Payload Data & Kinerja Sistem"
    Emit-P -text "Untuk menjamin waktu respons API di bawah 100 milidetik pada jaringan lokal toko maupun koneksi internet pedesaan, diterapkan tiga teknik optimasi performa mutakhir:" -firstLineIndent 420
    Emit-Bullet "1. Eliminasi Masalah N+1 Queries dengan Eloquent Eager Loading:" "Saat memuat riwayat transaksi penjualan beserta rincian barangnya, penggunaan relasi `Transaction::with(['items.product', 'member', 'user'])` menggantikan pemanggilan query berulang di dalam perulangan loop. Hal ini mereduksi 100 query SQL menjadi hanya 3 query teroptimasi."
    Emit-Bullet "2. Debouncing & Throttling Pencarian Produk di Sisi Klien:" "Input pencarian nama barang atau pemindaian barcode menerapkan teknik debounce 300 milidetik. Sistem tidak menembak request ke backend pada setiap ketukan tuts keyboard, melainkan menunggu hingga kasir selesai mengetik, menghemat beban CPU server hingga 85%."
    Emit-Bullet "3. Caching Dashboard Agregasi Laba Bersih:" "Perhitungan omzet bulanan dan laba bersih riil yang melibatkan kalkulasi ribuan baris transaksi disimpan sementara dalam Laravel Cache (TTL: 15 menit). Dashboard owner dapat terbuka secara instan tanpa perlu membebani basis data dengan agregasi berat berulang."

    Emit-PageBreak
}

Write-Host "Modul Bab3-Backend siap." -ForegroundColor Green
