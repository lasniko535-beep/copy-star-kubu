# ==============================================================================
# BAGIAN 5: LAMPIRAN LENGKAP, FINALISASI XML, DAN PEMBUATAN FILE DOCX
# ==============================================================================

function Generate-Appendices-And-Zip {
    Write-Host "Menyusun Lampiran & Mengompilasi Dokumen Word (.docx)..." -ForegroundColor Yellow

    # =========================================================================
    # LAMPIRAN A: SKEMA DATABASE RELASIONAL DDL LENGKAP
    # =========================================================================
    Emit-H1 "LAMPIRAN A: SKEMA DATABASE DDL RELASIONAL LENGKAP"
    Emit-P -text "Berikut adalah naskah Data Definition Language (DDL) relasional standar PostgreSQL & MySQL yang mendasari sistem COPY STAR KUBU:" -firstLineIndent 420

    Emit-CodeBlock @'
-- ============================================================================
-- DDL SKEMA BASIS DATA UTAMA COPY STAR KUBU
-- ============================================================================

CREATE TABLE users (
    user_id VARCHAR(30) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'KASIR', 'OWNER'
    phone VARCHAR(30) UNIQUE NOT NULL,
    shift_name VARCHAR(50) DEFAULT 'Pagi',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE products (
    product_id VARCHAR(30) PRIMARY KEY,
    category_id VARCHAR(30) NOT NULL REFERENCES categories(category_id),
    sku_barcode VARCHAR(50) UNIQUE,
    name VARCHAR(150) NOT NULL,
    is_service BOOLEAN DEFAULT FALSE,
    unit VARCHAR(20) DEFAULT 'Pcs',
    cost_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    sell_price DECIMAL(12,2) NOT NULL,
    stock_qty INT NOT NULL DEFAULT 0,
    min_stock_alert INT NOT NULL DEFAULT 10,
    is_dead_stock BOOLEAN DEFAULT FALSE,
    last_sold_at TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'AKTIF'
);

CREATE TABLE cash_shifts (
    shift_id VARCHAR(40) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL REFERENCES users(user_id),
    shift_date DATE NOT NULL,
    starting_cash DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    cash_in_sales DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    cash_in_manual DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    cash_out_expense DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    expected_cash_system DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    actual_cash_physical DECIMAL(14,2) NULL,
    cash_discrepancy DECIMAL(14,2) NULL,
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'OPEN'
);

CREATE TABLE transactions (
    invoice_no VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL REFERENCES users(user_id),
    member_id VARCHAR(30) NULL,
    subtotal DECIMAL(14,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    grand_total DECIMAL(14,2) NOT NULL,
    total_cost_hpp DECIMAL(14,2) NOT NULL,
    net_profit DECIMAL(14,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    cash_received DECIMAL(14,2) DEFAULT 0.00,
    cash_change DECIMAL(14,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction_items (
    item_id BIGSERIAL PRIMARY KEY,
    invoice_no VARCHAR(50) NOT NULL REFERENCES transactions(invoice_no) ON DELETE CASCADE,
    product_id VARCHAR(30) NOT NULL REFERENCES products(product_id),
    qty INT NOT NULL DEFAULT 1,
    cost_price DECIMAL(12,2) NOT NULL,
    sell_price DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    subtotal DECIMAL(14,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_debts (
    debt_id BIGSERIAL PRIMARY KEY,
    member_id VARCHAR(30) NOT NULL,
    invoice_no VARCHAR(50) NOT NULL REFERENCES transactions(invoice_no),
    total_debt DECIMAL(14,2) NOT NULL,
    remaining_balance DECIMAL(14,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'BELUM_LUNAS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
'@

    Emit-PageBreak

    # =========================================================================
    # LAMPIRAN B: SPESIFIKASI ENDPOINT REST API JSON
    # =========================================================================
    Emit-H1 "LAMPIRAN B: SPESIFIKASI ENDPOINT REST API JSON"
    Emit-P -text "Berikut adalah dokumentasi skema payload JSON interaksi komunikasi antarmuka kasir dengan backend Laravel:" -firstLineIndent 420

    Emit-H2 "1. Endpoint Checkout Transaksi Kasir POS (POST /api/v1/pos/checkout)"
    Emit-CodeBlock @'
// REQUEST PAYLOAD JSON (Dari Klien Kasir ke Backend)
{
    "user_id": "USR-001",
    "member_id": "MBR-005",
    "payment_method": "TUNAI",
    "discount_amount": 2000,
    "tax_amount": 0,
    "cash_received": 100000,
    "items": [
        {
            "product_id": "PRD-JASA-001",
            "qty": 150,
            "sell_price": 250,
            "discount_amount": 0
        },
        {
            "product_id": "PRD-ATK-012",
            "qty": 3,
            "sell_price": 3500,
            "discount_amount": 0
        }
    ]
}

// RESPONSE PAYLOAD JSON (Dari Backend ke Klien Kasir - HTTP 201 Created)
{
    "success": true,
    "message": "Transaksi berhasil diproses",
    "data": {
        "invoice_no": "INV-20261026-0001",
        "grand_total": 46000,
        "cash_received": 100000,
        "cash_change": 54000,
        "payment_method": "TUNAI",
        "print_thermal_url": "https://copystarkubu.site/api/v1/pos/receipt/INV-20261026-0001"
    }
}
'@

    Emit-H2 "2. Endpoint Kalkulator Fotokopi Bertingkat (POST /api/v1/calculator/calculate-tiered)"
    Emit-CodeBlock @'
// REQUEST PAYLOAD JSON
{
    "pages": 120,
    "copies": 1,
    "print_type": "BW",
    "paper_type": "HVS_70",
    "is_duplex": true,
    "binding_type": "LAKBAN"
}

// RESPONSE PAYLOAD JSON - HTTP 200 OK
{
    "success": true,
    "data": {
        "total_sheets": 120,
        "unit_rate": 250,
        "print_cost": 27000,
        "binding_cost": 3000,
        "grand_total": 30000,
        "tier_label": "Grosir Dokumen Tebal (>100 Lembar)"
    }
}
'@

    # Finalisasi XML Dokumen
    Write-Host "Menyusun struktur XML akhir..." -ForegroundColor Yellow
    $docXmlHeader = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
'@
    # Standard academic margin: top 1701 dxa (3 cm), bottom 1701 dxa (3 cm), left 2268 dxa (4 cm), right 1701 dxa (3 cm)
    $docXmlFooter = @'
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1701" w:right="1701" w:bottom="1701" w:left="2268" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>
'@

    $finalDocXml = $docXmlHeader + $sb.ToString() + $docXmlFooter
    $docXmlPath = Join-Path $tempDir "word\document.xml"
    [System.IO.File]::WriteAllText($docXmlPath, $finalDocXml, [System.Text.Encoding]::UTF8)

    Write-Host "File word/document.xml berhasil ditulis ($([math]::Round($finalDocXml.Length / 1024, 2)) KB)." -ForegroundColor Green

    # Kompresi folder ke berkas .docx
    $outputRevisiDocx = "c:\Users\ASUS\Desktop\copy-star-kubu\LAPORAN_TUGAS_BESAR_WEB_PROGRAMMING_2_COPY_STAR_KUBU_REVISI.docx"
    if (Test-Path $outputRevisiDocx) {
        Remove-Item $outputRevisiDocx -Force -ErrorAction SilentlyContinue
    }

    Write-Host "Mengompresi ke arsip .docx revisi di: $outputRevisiDocx" -ForegroundColor Cyan
    [System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $outputRevisiDocx)

    # Coba perbarui file utama jika tidak sedang terkunci oleh aplikasi Microsoft Word
    $primaryUpdated = $false
    try {
        if (Test-Path $outputDocx) {
            Remove-Item $outputDocx -Force -ErrorAction Stop
        }
        Copy-Item $outputRevisiDocx $outputDocx -Force -ErrorAction Stop
        $primaryUpdated = $true
        Write-Host "File utama berhasil diperbarui di: $outputDocx" -ForegroundColor Green
    } catch {
        Write-Host "Pemberitahuan: File utama sedang dibuka di Word, dokumen teranyar disimpan di file revisi: $outputRevisiDocx" -ForegroundColor Yellow
    }

    # Hapus folder temporary
    Remove-Item -Path $tempDir -Recurse -Force | Out-Null

    $finalPath = if ($primaryUpdated) { $outputDocx } else { $outputRevisiDocx }
    $fileSize = (Get-Item $finalPath).Length
    Write-Host "==================================================================" -ForegroundColor Green
    Write-Host "SUKSES: Laporan Tugas Besar Web Programming II Berhasil Dibuat!" -ForegroundColor Green
    Write-Host "Lokasi File Terkini : $finalPath" -ForegroundColor Yellow
    Write-Host "Ukuran File         : $([math]::Round($fileSize / 1024, 2)) KB" -ForegroundColor Yellow
    Write-Host "==================================================================" -ForegroundColor Green
}

Write-Host "Modul Appendices siap." -ForegroundColor Green
