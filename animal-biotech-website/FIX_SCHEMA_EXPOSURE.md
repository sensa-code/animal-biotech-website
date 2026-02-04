# 🔧 修復 Schema 暴露問題

## 問題說明

Supabase 的 PostgREST API 預設只暴露 `public` schema，所以我們的 `website` schema 無法透過 Supabase JS 客戶端存取。

錯誤訊息：
```
Invalid schema: website
Only the following schemas are exposed: public, graphql_public
```

## 解決方案

需要在 Supabase Dashboard 中將 `website` schema 加入 exposed schemas 列表。

### 方法 1：透過 SQL 設定（推薦）

在 Supabase SQL Editor 執行：

```sql
-- 檢查當前設定
SHOW pgrst.db_schemas;

-- 將 website schema 加入暴露列表
ALTER ROLE authenticator SET pgrst.db_schemas = 'public, website';

-- 重新載入設定 (可能需要重啟 PostgREST)
NOTIFY pgrst, 'reload config';
```

### 方法 2：透過 Supabase Dashboard

1. 前往 **Settings** → **API**
2. 找到 **Extra schemas** 或 **Exposed schemas** 設定
3. 加入 `website`
4. 儲存變更

## 替代方案：使用 public schema

如果無法暴露 website schema，我們可以：

1. **選項 A：修改資料表到 public schema**
   - 在 SQL Editor 執行：
   ```sql
   -- 將所有資料表移到 public schema (帶 ws_ 前綴避免衝突)
   ALTER TABLE website.site_settings SET SCHEMA public;
   ALTER TABLE website.hero_content SET SCHEMA public;
   -- ... 其他資料表

   -- 或重新命名以避免衝突
   ALTER TABLE website.site_settings RENAME TO ws_site_settings;
   ALTER TABLE website.site_settings SET SCHEMA public;
   ```

2. **選項 B：建立 views 在 public schema**
   ```sql
   CREATE VIEW public.ws_site_settings AS SELECT * FROM website.site_settings;
   CREATE VIEW public.ws_product_categories AS SELECT * FROM website.product_categories;
   -- ... 其他資料表
   ```

3. **選項 C：使用 PostgreSQL 直接連接**
   - 不使用 Supabase JS 客戶端
   - 使用 `pg` 套件直接連接 PostgreSQL
   - 需要設定 DATABASE_URL

## 建議做法

**最簡單的方式：將 website schema 暴露給 PostgREST**

執行這段 SQL：
```sql
-- 在 Supabase SQL Editor 執行
ALTER ROLE authenticator SET pgrst.db_schemas = 'public, website, graphql_public';
NOTIFY pgrst, 'reload config';
```

執行後等待 1-2 分鐘讓設定生效，然後重新測試。

## 驗證

執行測試腳本確認：
```bash
node scripts/verify-db-simple.js
```

應該看到：
```
✅ Successfully connected to database!
✅ Found site_settings data: [...]
```
