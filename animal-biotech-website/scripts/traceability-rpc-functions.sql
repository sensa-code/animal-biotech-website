-- ============================================
-- Traceability RPC Functions
-- 讓 API 可以存取 traceability schema
-- ============================================

-- 1. 驗證產品編碼
CREATE OR REPLACE FUNCTION verify_product_code(p_code TEXT)
RETURNS TABLE (
  id INTEGER,
  product_code TEXT,
  product_name TEXT,
  hospital_name TEXT,
  purchase_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pr.id,
    pr.product_code,
    pr.product_name,
    pr.hospital_name,
    pr.purchase_date,
    pr.created_at,
    pr.updated_at
  FROM traceability.product_records pr
  WHERE UPPER(pr.product_code) = UPPER(p_code)
  LIMIT 1;
END;
$$;

-- 2. 取得記錄數量
CREATE OR REPLACE FUNCTION get_traceability_count(search_term TEXT DEFAULT NULL)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total INTEGER;
BEGIN
  IF search_term IS NULL OR search_term = '' THEN
    SELECT COUNT(*) INTO total FROM traceability.product_records;
  ELSE
    SELECT COUNT(*) INTO total
    FROM traceability.product_records
    WHERE product_code ILIKE '%' || search_term || '%'
       OR product_name ILIKE '%' || search_term || '%'
       OR hospital_name ILIKE '%' || search_term || '%';
  END IF;
  RETURN total;
END;
$$;

-- 3. 取得記錄列表（分頁）
CREATE OR REPLACE FUNCTION get_traceability_records(
  search_term TEXT DEFAULT NULL,
  sort_column TEXT DEFAULT 'created_at',
  sort_direction TEXT DEFAULT 'desc',
  page_limit INTEGER DEFAULT 20,
  page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id INTEGER,
  product_code TEXT,
  product_name TEXT,
  hospital_name TEXT,
  purchase_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY EXECUTE format(
    'SELECT id, product_code, product_name, hospital_name, purchase_date, created_at, updated_at
     FROM traceability.product_records
     WHERE ($1 IS NULL OR $1 = '''' OR
            product_code ILIKE ''%%'' || $1 || ''%%'' OR
            product_name ILIKE ''%%'' || $1 || ''%%'' OR
            hospital_name ILIKE ''%%'' || $1 || ''%%'')
     ORDER BY %I %s
     LIMIT $2 OFFSET $3',
    sort_column,
    CASE WHEN UPPER(sort_direction) = 'ASC' THEN 'ASC' ELSE 'DESC' END
  )
  USING search_term, page_limit, page_offset;
END;
$$;

-- 4. 根據 ID 取得單筆記錄
CREATE OR REPLACE FUNCTION get_traceability_record_by_id(record_id INTEGER)
RETURNS TABLE (
  id INTEGER,
  product_code TEXT,
  product_name TEXT,
  hospital_name TEXT,
  purchase_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pr.id,
    pr.product_code,
    pr.product_name,
    pr.hospital_name,
    pr.purchase_date,
    pr.created_at,
    pr.updated_at
  FROM traceability.product_records pr
  WHERE pr.id = record_id;
END;
$$;

-- 5. 新增單筆記錄
CREATE OR REPLACE FUNCTION insert_traceability_record(
  p_product_code TEXT,
  p_product_name TEXT,
  p_hospital_name TEXT,
  p_purchase_date TEXT
)
RETURNS TABLE (
  id INTEGER,
  product_code TEXT,
  product_name TEXT,
  hospital_name TEXT,
  purchase_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO traceability.product_records (product_code, product_name, hospital_name, purchase_date)
  VALUES (p_product_code, p_product_name, p_hospital_name, p_purchase_date::DATE)
  RETURNING
    traceability.product_records.id,
    traceability.product_records.product_code,
    traceability.product_records.product_name,
    traceability.product_records.hospital_name,
    traceability.product_records.purchase_date,
    traceability.product_records.created_at,
    traceability.product_records.updated_at;
END;
$$;

-- 6. 更新記錄
CREATE OR REPLACE FUNCTION update_traceability_record(
  record_id INTEGER,
  p_product_code TEXT DEFAULT NULL,
  p_product_name TEXT DEFAULT NULL,
  p_hospital_name TEXT DEFAULT NULL,
  p_purchase_date TEXT DEFAULT NULL
)
RETURNS TABLE (
  id INTEGER,
  product_code TEXT,
  product_name TEXT,
  hospital_name TEXT,
  purchase_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE traceability.product_records pr
  SET
    product_code = COALESCE(p_product_code, pr.product_code),
    product_name = COALESCE(p_product_name, pr.product_name),
    hospital_name = COALESCE(p_hospital_name, pr.hospital_name),
    purchase_date = COALESCE(p_purchase_date::DATE, pr.purchase_date),
    updated_at = CURRENT_TIMESTAMP
  WHERE pr.id = record_id;

  RETURN QUERY
  SELECT
    pr.id,
    pr.product_code,
    pr.product_name,
    pr.hospital_name,
    pr.purchase_date,
    pr.created_at,
    pr.updated_at
  FROM traceability.product_records pr
  WHERE pr.id = record_id;
END;
$$;

-- 7. 刪除記錄
CREATE OR REPLACE FUNCTION delete_traceability_record(record_id INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM traceability.product_records WHERE id = record_id;
  RETURN FOUND;
END;
$$;

-- 8. 批次新增記錄
CREATE OR REPLACE FUNCTION batch_insert_traceability_records(records JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rec JSONB;
  inserted_count INTEGER := 0;
  skipped_count INTEGER := 0;
BEGIN
  FOR rec IN SELECT * FROM jsonb_array_elements(records)
  LOOP
    BEGIN
      INSERT INTO traceability.product_records (product_code, product_name, hospital_name, purchase_date)
      VALUES (
        rec->>'product_code',
        rec->>'product_name',
        rec->>'hospital_name',
        (rec->>'purchase_date')::DATE
      )
      ON CONFLICT (product_code) DO NOTHING;

      IF FOUND THEN
        inserted_count := inserted_count + 1;
      ELSE
        skipped_count := skipped_count + 1;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      skipped_count := skipped_count + 1;
    END;
  END LOOP;

  RETURN jsonb_build_object('inserted', inserted_count, 'skipped', skipped_count);
END;
$$;

-- 9. 取得統計資料
CREATE OR REPLACE FUNCTION get_traceability_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_records INTEGER;
  total_hospitals INTEGER;
  recent_records INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_records FROM traceability.product_records;

  SELECT COUNT(DISTINCT hospital_name) INTO total_hospitals
  FROM traceability.product_records
  WHERE hospital_name IS NOT NULL AND hospital_name != '';

  SELECT COUNT(*) INTO recent_records
  FROM traceability.product_records
  WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days';

  RETURN jsonb_build_object(
    'total_records', total_records,
    'total_hospitals', total_hospitals,
    'recent_records', recent_records
  );
END;
$$;

-- 授權 API 可以呼叫這些函數
GRANT EXECUTE ON FUNCTION verify_product_code(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_traceability_count(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_traceability_records(TEXT, TEXT, TEXT, INTEGER, INTEGER) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_traceability_record_by_id(INTEGER) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION insert_traceability_record(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_traceability_record(INTEGER, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION delete_traceability_record(INTEGER) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION batch_insert_traceability_records(JSONB) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_traceability_stats() TO anon, authenticated, service_role;

-- 通知 PostgREST 重新載入
NOTIFY pgrst, 'reload schema';
