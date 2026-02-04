# 🔧 Vercel 環境變數修復指南

## 問題診斷

**症狀**: 線上部署的網站無法登入，顯示 "Email 或密碼錯誤"

**原因**: Vercel 環境變數可能仍指向**舊的資料庫** (tbbekmtsqqpkdtfahjkv)，但本地 .env 已更新為新資料庫 (ozzhgginibhydrkkonmn)

## 驗證結果

✅ **本地環境**:
- Supabase URL: `https://ozzhgginibhydrkkonmn.supabase.co`
- Admin 帳號存在且已確認
- 測試登入成功 ✅

❌ **線上環境 (Vercel)**:
- 環境變數於 2 天前設定
- 登入失敗，顯示密碼錯誤
- 可能仍連接到舊資料庫

## 需要更新的環境變數

請在 Vercel Dashboard 確認並更新以下環境變數：

### 1. NEXT_PUBLIC_SUPABASE_URL
**正確值**:
```
https://ozzhgginibhydrkkonmn.supabase.co
```

**如何檢查**:
- 打開：https://vercel.com/vetko-9084s-projects/animal-biotech-website/settings/environment-variables
- 點擊 `NEXT_PUBLIC_SUPABASE_URL`
- 檢查值中的 project ref 是否為 `ozzhgginibhydrkkonmn`

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
**正確值** (從本地 .env):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96emhnZ2luaWJoeWRya2tvbm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNjU2ODEsImV4cCI6MjA4NDk0MTY4MX0.Nl1MFl4jWVE0oD7t1jOiZR_F_DoQ2A7Wz4F-7wj7qU8
```

**如何檢查**:
- JWT token 中應包含 `"ref":"ozzhgginibhydrkkonmn"`
- 可在 https://jwt.io 解碼檢查

### 3. SUPABASE_SERVICE_ROLE_KEY
**正確值** (從本地 .env):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96emhnZ2luaWJoeWRya2tvbm1uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM2NTY4MSwiZXhwIjoyMDg0OTQxNjgxfQ.X7mwT1e2PM7VcBt4FCEaMsCL3JBSrhRsdlF94Td2pKo
```

**如何檢查**:
- JWT token 中應包含 `"ref":"ozzhgginibhydrkkonmn"`
- 應該是 `"role":"service_role"`

### 4. NEXTAUTH_SECRET
**正確值** (從本地 .env):
```
senbio-website-secret-key-2025
```

### 5. NEXTAUTH_URL (可能需要新增)
**正確值**:
```
https://animal-biotech-website.vercel.app
```

**注意**: 線上環境應使用實際部署 URL，不是 localhost

---

## 📝 修復步驟

### 方法 1: 透過 Vercel Dashboard 更新 (推薦)

1. **檢查每個環境變數**
   - 打開：https://vercel.com/vetko-9084s-projects/animal-biotech-website/settings/environment-variables
   - 逐一點擊每個變數
   - 檢查值是否包含 `ozzhgginibhydrkkonmn`

2. **更新錯誤的變數**
   - 點擊變數右側的「...」選單
   - 選擇 "Edit"
   - 貼上正確的值（從上面複製）
   - 確保選擇 "All Environments" (Production, Preview, Development)
   - 點擊 "Save"

3. **重新部署**
   - 回到 Overview 頁面
   - 點擊最新的 Deployment
   - 點擊右上角的「...」
   - 選擇 "Redeploy"
   - 等待部署完成（約 1-2 分鐘）

4. **測試登入**
   - 打開：https://animal-biotech-website.vercel.app/admin/login
   - 輸入：admin@senbio.tech / admin123
   - 應該可以成功登入 ✅

---

### 方法 2: 使用 Vercel CLI (進階)

如果你安裝了 Vercel CLI：

```bash
# 安裝 Vercel CLI (如果還沒有)
npm i -g vercel

# 登入
vercel login

# 連結專案
cd "E:\CLAUDE CODE\INDEX\animal-biotech-website"
vercel link

# 更新環境變數
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 輸入: https://ozzhgginibhydrkkonmn.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# 輸入: [從上面複製 anon key]

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# 輸入: [從上面複製 service role key]

# 重新部署
vercel --prod
```

---

### 方法 3: 刪除並重新建立環境變數

如果編輯不成功：

1. **刪除舊的環境變數**
   - 在 Environment Variables 頁面
   - 點擊每個變數右側的「...」
   - 選擇 "Delete"
   - 確認刪除

2. **重新建立**
   - 點擊 "Add Environment Variable"
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://ozzhgginibhydrkkonmn.supabase.co`
   - Environments: 全選
   - 點擊 "Save"
   - 重複步驟建立其他變數

3. **重新部署**（如方法 1 步驟 3）

---

## 🔍 驗證修復成功

### 檢查 1: 環境變數已更新
```bash
# 在 Vercel Dashboard → Settings → Environment Variables
# 確認所有變數的值都包含 "ozzhgginibhydrkkonmn"
```

### 檢查 2: 部署成功
```bash
# 在 Vercel Dashboard → Deployments
# 最新的 deployment 狀態應為 "Ready"
```

### 檢查 3: 登入測試
1. 打開：https://animal-biotech-website.vercel.app/admin/login
2. 清除瀏覽器快取（Ctrl+Shift+R）
3. 輸入：admin@senbio.tech / admin123
4. 應該成功登入並導向管理後台

### 檢查 4: 瀏覽器 Console
按 F12 打開開發者工具，檢查是否有錯誤訊息

---

## ⚠️ 常見問題

### 問題 1: 更新環境變數後仍無法登入
**解決**:
- 確保已重新部署
- 清除瀏覽器快取
- 等待 1-2 分鐘讓新部署生效

### 問題 2: 找不到環境變數編輯按鈕
**解決**:
- 確認你有專案的編輯權限
- 嘗試重新整理頁面

### 問題 3: 部署失敗
**解決**:
- 檢查 Build Logs 查看錯誤訊息
- 確認環境變數格式正確（無多餘空格）

---

## 📋 快速檢查清單

- [ ] NEXT_PUBLIC_SUPABASE_URL 包含 `ozzhgginibhydrkkonmn`
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY 已更新（JWT 解碼後 ref 正確）
- [ ] SUPABASE_SERVICE_ROLE_KEY 已更新（JWT 解碼後 ref 正確）
- [ ] NEXTAUTH_SECRET 已設定
- [ ] NEXTAUTH_URL 設為線上網址
- [ ] 已重新部署
- [ ] 清除瀏覽器快取
- [ ] 測試登入成功

---

## 🎯 預期結果

修復完成後：
- ✅ 線上網站可以使用 admin@senbio.tech / admin123 登入
- ✅ 管理後台可以正常顯示
- ✅ 資料庫連接到 ozzhgginibhydrkkonmn
- ✅ 所有功能正常運作

---

**最後更新**: 2025-02-04
**文件版本**: 1.0
