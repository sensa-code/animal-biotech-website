-- ============================================
-- Traceability Schema Initialization Script
-- 產品溯源系統資料庫初始化
-- ============================================

-- 建立 traceability schema
CREATE SCHEMA IF NOT EXISTS traceability;

-- ============================================
-- 產品溯源記錄表
-- ============================================
CREATE TABLE IF NOT EXISTS traceability.product_records (
    id SERIAL PRIMARY KEY,
    product_code TEXT UNIQUE NOT NULL,      -- 產品編碼 (如 T501601)
    product_name TEXT NOT NULL,              -- 產品名稱
    hospital_name TEXT NOT NULL,             -- 購買醫院
    purchase_date DATE NOT NULL,             -- 出貨日期
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 建立索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_tr_product_code ON traceability.product_records(product_code);
CREATE INDEX IF NOT EXISTS idx_tr_product_code_upper ON traceability.product_records(UPPER(product_code));
CREATE INDEX IF NOT EXISTS idx_tr_hospital ON traceability.product_records(hospital_name);
CREATE INDEX IF NOT EXISTS idx_tr_date ON traceability.product_records(purchase_date DESC);

-- ============================================
-- 設定 Row Level Security (RLS)
-- ============================================

-- 啟用 RLS
ALTER TABLE traceability.product_records ENABLE ROW LEVEL SECURITY;

-- 公開讀取政策 (允許所有人查詢)
CREATE POLICY "Allow public read access" ON traceability.product_records
    FOR SELECT
    USING (true);

-- 認證用戶可以執行所有操作 (透過 service_role key)
CREATE POLICY "Allow authenticated full access" ON traceability.product_records
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- 更新時間觸發器
-- ============================================
CREATE OR REPLACE FUNCTION traceability.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_records_updated_at
    BEFORE UPDATE ON traceability.product_records
    FOR EACH ROW
    EXECUTE FUNCTION traceability.update_updated_at_column();

-- ============================================
-- 通知 PostgREST 重新載入 schema cache
-- ============================================
NOTIFY pgrst, 'reload schema';
