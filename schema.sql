-- ============================================================================
-- COPY STAR KUBU - SISTEM KASIR PINTAR & MANAJEMEN TOKO ATK / FOTOKOPI
-- Skema Database Relasional (PostgreSQL & MySQL Compatible DDL)
-- ============================================================================

-- 1. TABEL TOKO & PENGATURAN UMUM
CREATE TABLE store_settings (
    store_id VARCHAR(20) PRIMARY KEY,
    store_name VARCHAR(100) NOT NULL DEFAULT 'COPY STAR KUBU',
    tagline VARCHAR(150) DEFAULT 'Digital Photocopy, Photo Printing & ATK',
    address TEXT,
    phone VARCHAR(30),
    receipt_footer TEXT,
    supervisor_pin VARCHAR(10) NOT NULL DEFAULT '0000',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1B. TABEL AKUN PENGGUNA (LOGIN, AUTENTIKASI & HAK AKSES)
CREATE TABLE users (
    user_id VARCHAR(30) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,          -- 'KASIR', 'OWNER'
    phone VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NULL,
    shift_name VARCHAR(50) DEFAULT 'Pagi (08:00 - 16:00)',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1C. TABEL PEMULIHAN AKUN & LOG LUPA PASSWORD (OTP VERIFIKASI)
CREATE TABLE password_reset_requests (
    reset_id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(30) NOT NULL,
    identifier VARCHAR(100) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 2. TABEL KATEGORI PRODUK & LAYANAN
CREATE TABLE categories (
    category_id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'grid',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL PRODUK, BARANG & JASA LAYANAN
CREATE TABLE products (
    product_id VARCHAR(30) PRIMARY KEY,
    category_id VARCHAR(30) NOT NULL,
    sku_barcode VARCHAR(50) UNIQUE,
    name VARCHAR(150) NOT NULL,
    is_service BOOLEAN DEFAULT FALSE,     -- TRUE jika jasa cetak/fotokopi/jilid
    unit VARCHAR(20) DEFAULT 'Pcs',       -- Pcs, Lembar, Rim, Kotak, Set
    cost_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,  -- Harga Beli / Modal
    sell_price DECIMAL(12, 2) NOT NULL,               -- Harga Jual Dasar
    wholesale_price DECIMAL(12, 2) NULL,             -- Harga Grosir jika beli banyak
    wholesale_min_qty INT NULL DEFAULT 5,            -- Minimum Qty untuk Harga Grosir
    stock_qty INT NOT NULL DEFAULT 0,                -- Stok Saat Ini (99999 untuk jasa)
    min_stock_alert INT NOT NULL DEFAULT 10,         -- Batas Peringatan Stok Menipis
    tiered_pricing_key VARCHAR(50) NULL,             -- Referensi skema harga bertingkat jika ada
    is_dead_stock BOOLEAN DEFAULT FALSE,             -- Deteksi barang mati (>60 hari tak laku)
    last_sold_at TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'AKTIF',              -- 'AKTIF', 'NONAKTIF'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 4. TABEL SKEMA HARGA BERTINGKAT (TIERED PRICING UNTUK JASA PRINT & FOTOKOPI)
CREATE TABLE tiered_pricing_rules (
    tier_id SERIAL PRIMARY KEY,
    tier_group_key VARCHAR(50) NOT NULL, -- e.g. 'copy_bw', 'copy_color', 'print_doc_bw'
    min_qty INT NOT NULL,                -- e.g. 1, 11, 51, 101
    max_qty INT NOT NULL,                -- e.g. 10, 50, 100, 999999
    price_per_unit DECIMAL(10, 2) NOT NULL,
    label VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL PELANGGAN & MEMBER LOYALITAS
CREATE TABLE members (
    member_id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    member_category VARCHAR(50) DEFAULT 'Umum', -- 'Mahasiswa', 'B2B/Kantor', 'Guru', 'Umum'
    discount_pct DECIMAL(5, 2) DEFAULT 0.00,    -- Persentase Diskon Member Otomatis
    loyalty_points INT DEFAULT 0,
    total_spent DECIMAL(14, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'AKTIF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL KARYAWAN & OPERATOR
-- Perhatian sesuai arahan dosen: Status 'NONAKTIF' saat resign, tidak dihapus permanen!
CREATE TABLE employees (
    employee_id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(50) NOT NULL,                  -- 'Kasir', 'Operator Cetak', 'Owner/Supervisor'
    shift VARCHAR(50) DEFAULT 'Pagi (08:00 - 16:00)',
    status VARCHAR(20) NOT NULL DEFAULT 'AKTIF', -- 'AKTIF' atau 'NONAKTIF'
    joined_date DATE NOT NULL,
    resigned_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABEL SHIFT KASIR & SALDO LACI UANG
CREATE TABLE cashier_shifts (
    shift_id VARCHAR(40) PRIMARY KEY,
    employee_id VARCHAR(30) NOT NULL,
    opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    initial_cash DECIMAL(12, 2) NOT NULL DEFAULT 0.00,    -- Modal Kas Laci Awal
    total_cash_sales DECIMAL(12, 2) DEFAULT 0.00,
    total_non_cash_sales DECIMAL(12, 2) DEFAULT 0.00,     -- QRIS / Transfer
    expected_drawer_cash DECIMAL(12, 2) DEFAULT 0.00,     -- Hitungan Sistem
    actual_drawer_cash DECIMAL(12, 2) NULL,               -- Hitungan Fisik Kasir
    cash_variance DECIMAL(12, 2) NULL,                   -- Selisih Kas (+/-)
    shift_status VARCHAR(20) DEFAULT 'OPEN',              -- 'OPEN', 'CLOSED'
    notes TEXT,
    CONSTRAINT fk_shift_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- 8. TABEL TRANSAKSI PENJUALAN HEADER
CREATE TABLE transactions (
    transaction_id VARCHAR(40) PRIMARY KEY,
    shift_id VARCHAR(40) NOT NULL,
    cashier_id VARCHAR(30) NOT NULL,
    member_id VARCHAR(30) NULL,
    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    session_tab_label VARCHAR(50) DEFAULT 'Pelanggan #101',
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    tax_amount DECIMAL(12, 2) DEFAULT 0.00,
    grand_total DECIMAL(12, 2) NOT NULL,
    total_cost DECIMAL(12, 2) NOT NULL,                 -- Total HPP / Modal
    net_profit DECIMAL(12, 2) NOT NULL,                 -- Laba Bersih
    payment_method VARCHAR(20) NOT NULL,                -- 'TUNAI', 'QRIS', 'TRANSFER', 'SPLIT'
    amount_paid DECIMAL(12, 2) NOT NULL,
    change_amount DECIMAL(12, 2) DEFAULT 0.00,
    is_voided BOOLEAN DEFAULT FALSE,
    void_reason TEXT NULL,
    voided_by_pin_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tx_shift FOREIGN KEY (shift_id) REFERENCES cashier_shifts(shift_id),
    CONSTRAINT fk_tx_cashier FOREIGN KEY (cashier_id) REFERENCES employees(employee_id),
    CONSTRAINT fk_tx_member FOREIGN KEY (member_id) REFERENCES members(member_id)
);

-- 9. TABEL RINCIAN TRANSAKSI DETAIL
CREATE TABLE transaction_items (
    item_id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(40) NOT NULL,
    product_id VARCHAR(30) NOT NULL,
    product_name_snap VARCHAR(150) NOT NULL,            -- Snapshot nama saat transaksi
    qty INT NOT NULL,
    unit_cost_price DECIMAL(10, 2) NOT NULL,            -- Snapshot modal saat itu
    unit_sell_price DECIMAL(10, 2) NOT NULL,            -- Snapshot harga jual saat itu
    subtotal DECIMAL(12, 2) NOT NULL,
    item_notes TEXT NULL,                               -- Catatan varian (misal: "Kertas 80g, Duplex, Jilid Lakban")
    CONSTRAINT fk_item_tx FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 10. TABEL KARTU STOK (MUTASI & LOG PERGERAKAN BARANG)
CREATE TABLE stock_mutations (
    mutation_id BIGSERIAL PRIMARY KEY,
    product_id VARCHAR(30) NOT NULL,
    mutation_type VARCHAR(20) NOT NULL,                  -- 'MASUK' (Restock), 'KELUAR' (Penjualan), 'KOREKSI' (Opname)
    qty_change INT NOT NULL,                             -- Positif jika masuk, negatif jika keluar
    final_stock INT NOT NULL,                            -- Saldo stok setelah perubahan
    reference_no VARCHAR(50) NULL,                       -- No Transaksi TRX-... atau No PO Pengadaan
    notes TEXT,
    recorded_by VARCHAR(100) NOT NULL,                   -- Nama Kasir / Owner
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_stock_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 11. TABEL PENGADAAN BARANG (PURCHASE ORDERS RESTOCK)
CREATE TABLE procurement_orders (
    order_id VARCHAR(40) PRIMARY KEY,
    supplier_name VARCHAR(150) NOT NULL,
    order_date DATE NOT NULL,
    received_date DATE NULL,
    total_amount DECIMAL(14, 2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'LUNAS',
    order_status VARCHAR(20) DEFAULT 'SELESAI',          -- 'DRAFT', 'DIKIRIM', 'SELESAI'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. TABEL LOG AUDIT & KEAMANAN SISTEM
CREATE TABLE audit_logs (
    log_id BIGSERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL,                   -- 'LOGIN', 'PIN_AUTH', 'DISCOUNT_APPLIED', 'STATUS_CHANGE', 'VOID'
    description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'INFO',                -- 'INFO', 'WARNING', 'CRITICAL'
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES UNTUK KECEPATAN TRANSAKSI POS & ANALITIK DASHBOARD
-- ============================================================================
CREATE INDEX idx_products_sku ON products(sku_barcode);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_cashier ON transactions(cashier_id);
CREATE INDEX idx_stock_mutations_product ON stock_mutations(product_id);
CREATE INDEX idx_stock_mutations_date ON stock_mutations(created_at);

-- ============================================================================
-- ANALYTICAL VIEWS (UNTUK DASHBOARD OWNER & ASSISTANT STARBOT AI)
-- ============================================================================

-- View 1: Rangkuman Penjualan & Laba Harian
CREATE OR REPLACE VIEW v_daily_sales_performance AS
SELECT 
    DATE(transaction_date) AS sales_date,
    COUNT(transaction_id) AS total_transactions,
    SUM(grand_total) AS total_revenue,
    SUM(total_cost) AS total_cost_of_goods,
    SUM(net_profit) AS total_net_profit,
    ROUND((SUM(net_profit) / NULLIF(SUM(grand_total), 0)) * 100, 2) AS net_profit_margin_pct
FROM transactions
WHERE is_voided = FALSE
GROUP BY DATE(transaction_date)
ORDER BY sales_date DESC;

-- View 2: Produk Paling Menguntungkan (Top Margin & Volume)
CREATE OR REPLACE VIEW v_top_profitable_products AS
SELECT 
    p.product_id,
    p.name AS product_name,
    c.name AS category_name,
    SUM(ti.qty) AS total_qty_sold,
    SUM(ti.subtotal) AS total_gross_sales,
    SUM(ti.subtotal - (ti.unit_cost_price * ti.qty)) AS total_profit_generated,
    ROUND(((p.sell_price - p.cost_price) / NULLIF(p.sell_price, 0)) * 100, 1) AS margin_pct
FROM transaction_items ti
JOIN products p ON ti.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
JOIN transactions t ON ti.transaction_id = t.transaction_id
WHERE t.is_voided = FALSE
GROUP BY p.product_id, p.name, c.name, p.sell_price, p.cost_price
ORDER BY total_profit_generated DESC;

-- View 3: Peringatan Stok Kritis & Prediksi Kebutuhan Restock
CREATE OR REPLACE VIEW v_stock_restock_alerts AS
SELECT 
    p.product_id,
    p.name AS product_name,
    p.unit,
    p.stock_qty AS current_stock,
    p.min_stock_alert AS threshold_limit,
    p.cost_price,
    CASE 
        WHEN p.stock_qty = 0 THEN 'HABIS TOTAL'
        WHEN p.stock_qty <= (p.min_stock_alert / 2) THEN 'KRITIS MENDESAK'
        WHEN p.stock_qty <= p.min_stock_alert THEN 'MENIPIS'
        ELSE 'AMAN'
    END AS stock_urgency_status
FROM products p
WHERE p.is_service = FALSE AND p.stock_qty <= p.min_stock_alert
ORDER BY p.stock_qty ASC;
