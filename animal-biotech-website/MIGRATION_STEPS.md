# 🚀 資料庫遷移執行步驟

## ✅ 階段 2: 建立資料庫 Schema

### 方法：使用 Supabase SQL Editor（最簡單）

1. **開啟 Supabase SQL Editor**
   ```
   https://supabase.com/dashboard/project/ozzhgginibhydrkkonmn/sql/new
   ```

2. **複製 SQL 腳本**
   - 開啟檔案：`E:\CLAUDE CODE\INDEX\animal-biotech-website\scripts\init-website-schema.sql`
   - 全選並複製所有內容（Ctrl+A, Ctrl+C）

3. **執行 SQL**
   - 在 SQL Editor 中貼上（Ctrl+V）
   - 點擊右下角的 **Run** 按鈕（或按 Ctrl+Enter）
   - 等待執行完成

4. **驗證執行結果**

   在同一個 SQL Editor 新增查詢並執行：
   ```sql
   -- 檢查資料表
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'website'
   ORDER BY table_name;
   ```

   應該看到 9 個資料表：
   - admins
   - contact_submissions
   - featured_products
   - hero_content
   - news
   - product_categories
   - products
   - site_settings
   - stats

5. **檢查種子資料**
   ```sql
   SELECT * FROM website.site_settings;
   SELECT * FROM website.product_categories;
   SELECT COUNT(*) FROM website.products;
   ```

   應該看到：
   - site_settings: 7 筆記錄（公司資訊）
   - product_categories: 4 筆記錄（產品分類）
   - products: 16 筆記錄（範例產品）

---

## ✅ 階段 3: 建立 Storage Bucket

1. **導航到 Storage**
   ```
   https://supabase.com/dashboard/project/ozzhgginibhydrkkonmn/storage/buckets
   ```

2. **建立新 Bucket**
   - 點擊 **New bucket** 按鈕
   - Bucket name: `website-images`
   - Public bucket: ✅ **打勾**（允許公開讀取）
   - 點擊 **Create bucket**

3. **設定 Storage Policies**

   回到 SQL Editor，執行：
   ```sql
   -- 允許公開讀取
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'website-images');

   -- 允許已認證使用者上傳
   CREATE POLICY "Authenticated upload"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'website-images' AND auth.role() = 'authenticated');

   -- 允許已認證使用者更新
   CREATE POLICY "Authenticated update"
   ON storage.objects FOR UPDATE
   USING (bucket_id = 'website-images' AND auth.role() = 'authenticated');

   -- 允許已認證使用者刪除
   CREATE POLICY "Authenticated delete"
   ON storage.objects FOR DELETE
   USING (bucket_id = 'website-images' AND auth.role() = 'authenticated');
   ```

4. **驗證 Bucket**
   - 回到 Storage → website-images
   - 嘗試手動上傳一張測試圖片
   - 複製 Public URL 並在瀏覽器開啟確認可存取

---

## ✅ 階段 4: 建立管理員帳號

1. **導航到 Authentication**
   ```
   https://supabase.com/dashboard/project/ozzhgginibhydrkkonmn/auth/users
   ```

2. **建立新使用者**
   - 點擊 **Add user** 按鈕
   - 選擇 **Create new user**
   - 填寫：
     - Email: `admin@senbio.tech`
     - Password: `admin123`
     - Auto Confirm User: ✅ **打勾**
   - 點擊 **Create user**

---

## ✅ 階段 5: 測試驗證

### 5.1 啟動開發伺服器

```bash
cd "E:\CLAUDE CODE\INDEX\animal-biotech-website"
npm run dev
```

### 5.2 測試管理員登入

1. 開啟瀏覽器：http://localhost:3000/admin/login
2. 輸入帳號密碼：
   - Email: `admin@senbio.tech`
   - Password: `admin123`
3. 點擊登入
4. 應該成功導向到 `/admin` 管理後台

### 5.3 測試管理功能

逐一測試以下頁面：

- ✅ 儀表板：http://localhost:3000/admin
- ✅ 產品管理：http://localhost:3000/admin/products
- ✅ 分類管理：http://localhost:3000/admin/categories
- ✅ 主打產品：http://localhost:3000/admin/featured
- ✅ 首頁設定：http://localhost:3000/admin/homepage
- ✅ 最新消息：http://localhost:3000/admin/news
- ✅ 網站設定：http://localhost:3000/admin/settings

### 5.4 測試公開網站

- ✅ 首頁：http://localhost:3000
- ✅ 產品頁面：http://localhost:3000/products
- ✅ 最新消息：http://localhost:3000/news
- ✅ 聯絡我們：http://localhost:3000/contact

---

## 📊 驗證清單

完成後檢查：

- [ ] 資料庫有 9 個資料表在 `website` schema
- [ ] site_settings 有 7 筆記錄
- [ ] product_categories 有 4 筆記錄
- [ ] products 有 16 筆記錄
- [ ] Storage bucket `website-images` 已建立
- [ ] Storage policies 已設定
- [ ] 管理員帳號 `admin@senbio.tech` 已建立
- [ ] 可以登入管理後台
- [ ] 所有管理頁面都能正常顯示
- [ ] 公開網站可以正常顯示資料

---

## ⚠️ 常見問題

### 問題 1：SQL 執行失敗
- **解決**：確認你在正確的資料庫（ozzhgginibhydrkkonmn）
- 檢查是否有權限執行 CREATE SCHEMA

### 問題 2：登入失敗
- **解決**：確認管理員帳號已建立且已 Auto Confirm
- 檢查 .env 檔案的 Supabase URL 是否正確

### 問題 3：圖片上傳失敗
- **解決**：確認 Storage bucket 已建立
- 確認 RLS policies 已設定
- 檢查管理員是否已登入（authenticated 狀態）

### 問題 4：資料無法顯示
- **解決**：檢查 lib/supabase-server.ts 中的 schema 設定
- 確認查詢使用 `website` schema

---

## 🎉 完成！

當所有步驟完成且驗證通過後，你的網站資料庫遷移就完成了！

下一步：
1. 建議修改管理員密碼為更安全的密碼
2. 開始在管理後台編輯實際的公司資料
3. 上傳實際的產品圖片
4. 部署到生產環境前記得更新環境變數
