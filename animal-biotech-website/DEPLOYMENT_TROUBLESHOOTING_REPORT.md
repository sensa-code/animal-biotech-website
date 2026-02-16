# 產品溯源系統整合 - 部署問題排查報告

## 專案背景

將獨立的 Flask 產品溯源系統整合進 Next.js 官網，需要部署至 Vercel。

---

## 問題時間線與解決過程

### 階段 1：程式碼開發完成，首次部署失敗

**問題**：程式碼變更後，訪問 `/trace` 頁面顯示 404

**原因分析**：
- 程式碼已寫入本地檔案系統
- **但尚未提交到 Git 並推送到 GitHub**
- Vercel 是從 GitHub 拉取程式碼進行部署，本地未推送的變更不會被部署

**解決方式**：
```bash
git add [相關檔案]
git commit -m "feat: 整合產品溯源系統至官網"
git push origin main
```

---

### 階段 2：推送後部署失敗 - Root Directory 衝突

**錯誤訊息**：
```
Build Failed
The specified Root Directory "animal-biotech-website" does not exist.
Please update your Project Settings.
```

**問題分析**：

您的 Git 專案結構如下：
```
INDEX/                          ← Git 根目錄
├── animal-biotech-website/     ← Next.js 專案（子目錄）
│   ├── app/
│   ├── components/
│   └── package.json
├── app.py                      ← Flask 舊系統
├── static/
└── vercel.json                 ← 我們新增的設定檔
```

**衝突原因**：
1. Vercel Dashboard 中已設定 `Root Directory = animal-biotech-website`
2. 我們又新增了 `vercel.json` 試圖指定根目錄
3. 兩者同時存在時，Vercel 先讀取 Dashboard 設定，在根目錄找 `animal-biotech-website`
4. 但 `vercel.json` 的存在改變了 Vercel 解析路徑的方式，導致找不到目錄

**錯誤的嘗試**：
- 新增 `vercel.json` 設定 `buildCommand`、`outputDirectory` → 與 Dashboard 設定衝突
- 刪除 `vercel.json` → Dashboard 設定仍有問題

**正確解決方式**：
1. 清空 Vercel Dashboard 中的 Root Directory 設定（設為空白）
2. 使用簡單的 `vercel.json` 指定根目錄：
```json
{
  "rootDirectory": "animal-biotech-website"
}
```

---

### 階段 3：部署成功但頁面仍是 404

**問題**：Vercel 顯示部署成功，但 `/trace` 仍然 404

**診斷方式**：
- 檢查首頁導覽列是否有「產品驗證」連結 → **沒有**
- 這表示 Vercel 部署的是**舊版本快取**，而非最新程式碼

**原因**：
- Vercel 有建置快取機制
- 雖然程式碼已更新，但 Vercel 可能使用了舊的快取進行部署

**解決方式**：
使用 Vercel CLI 強制重新部署並清除快取：
```bash
npx vercel --prod --force
```

`--force` 參數會跳過快取，強制重新建置。

---

## 核心問題總結

| 問題 | 根本原因 | 解決方式 |
|------|----------|----------|
| 頁面 404 | 程式碼未推送到 Git | `git push origin main` |
| Build Failed | Vercel Dashboard 與 vercel.json 設定衝突 | 清空 Dashboard 的 Root Directory，只用 vercel.json |
| 部署成功但內容舊 | Vercel 建置快取 | 使用 `npx vercel --prod --force` 清除快取 |

---

## 正確的部署流程

### 1. 本地開發完成後
```bash
# 確認變更
git status

# 提交變更
git add .
git commit -m "描述變更內容"

# 推送到 GitHub
git push origin main
```

### 2. 如果部署有問題
```bash
# 使用 Vercel CLI 強制重新部署（清除快取）
cd animal-biotech-website
npx vercel --prod --force
```

### 3. 專案根目錄設定
- **方式 A**：在 Vercel Dashboard 設定 Root Directory
- **方式 B**：使用 `vercel.json` 設定 rootDirectory
- **重要**：只能選擇一種方式，不要同時使用

---

## 預防措施

1. **每次修改程式碼後**，確保執行 `git push` 推送到遠端
2. **Vercel 設定只用一處管理**：建議使用 `vercel.json`，因為可以版本控制
3. **遇到部署問題時**，優先嘗試 `npx vercel --prod --force` 清除快取
4. **驗證部署內容**：檢查頁面上的特定變更（如導覽列）確認是否為最新版本

---

## 最終專案設定

**vercel.json（位於 Git 根目錄）**：
```json
{
  "rootDirectory": "animal-biotech-website"
}
```

**Vercel Dashboard 設定**：
- Root Directory: （空白）
- Framework Preset: Next.js（自動偵測）

---

## 部署成功確認

- ✅ 首頁：https://animal-biotech-website.vercel.app/
- ✅ 產品驗證：https://animal-biotech-website.vercel.app/trace
- ✅ 管理後台：https://animal-biotech-website.vercel.app/admin/traceability

報告產生時間：2025-02-05
