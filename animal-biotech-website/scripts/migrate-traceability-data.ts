/**
 * 產品溯源資料遷移腳本
 *
 * 使用方式：
 * 1. 先在 Supabase SQL Editor 執行 init-traceability-schema.sql 建立 schema
 * 2. 執行此腳本：npx tsx scripts/migrate-traceability-data.ts
 *
 * 或者直接使用管理後台的批次匯入功能
 */

import * as fs from 'fs'
import * as path from 'path'

interface ProductRecord {
  product_code: string
  product_name: string
  hospital_name: string
  purchase_date: string
}

function parseCSV(csvContent: string): ProductRecord[] {
  const lines = csvContent.trim().split('\n')
  const records: ProductRecord[] = []

  // 跳過 BOM 和標題行
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const parts = line.split(',').map(p => p.trim())

    if (parts.length >= 4) {
      records.push({
        product_code: parts[0].toUpperCase(),
        product_name: parts[1],
        hospital_name: parts[2],
        // 轉換日期格式 2025/12/18 -> 2025-12-18
        purchase_date: parts[3].replace(/\//g, '-'),
      })
    }
  }

  return records
}

async function migrate() {
  console.log('=== 產品溯源資料遷移 ===\n')

  // 讀取 CSV 檔案
  const csvPath = path.join(__dirname, '..', '..', '氣管插管產品溯源編碼.csv')

  if (!fs.existsSync(csvPath)) {
    console.error('❌ 找不到 CSV 檔案:', csvPath)
    process.exit(1)
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const records = parseCSV(csvContent)

  console.log(`✅ 解析 CSV 完成，共 ${records.length} 筆記錄\n`)

  // 顯示前 5 筆
  console.log('預覽資料（前 5 筆）：')
  records.slice(0, 5).forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.product_code} | ${r.product_name} | ${r.hospital_name} | ${r.purchase_date}`)
  })
  console.log('  ...\n')

  // 統計
  const hospitals = new Set(records.map(r => r.hospital_name))
  console.log(`統計資訊：`)
  console.log(`  - 總記錄數：${records.length}`)
  console.log(`  - 不重複醫院：${hospitals.size}`)
  hospitals.forEach(h => console.log(`    • ${h}`))
  console.log('')

  // 輸出 JSON 供 API 匯入使用
  const outputPath = path.join(__dirname, 'traceability-data.json')
  fs.writeFileSync(outputPath, JSON.stringify(records, null, 2), 'utf-8')
  console.log(`✅ 已輸出 JSON 檔案：${outputPath}`)

  // 輸出可直接用於 Supabase SQL Editor 的 INSERT 語句
  const sqlPath = path.join(__dirname, 'traceability-seed.sql')
  let sql = `-- 產品溯源資料種子\n`
  sql += `-- 在 Supabase SQL Editor 執行此檔案\n\n`
  sql += `INSERT INTO traceability.product_records (product_code, product_name, hospital_name, purchase_date)\nVALUES\n`

  const values = records.map(r =>
    `  ('${r.product_code}', '${r.product_name}', '${r.hospital_name}', '${r.purchase_date}')`
  )
  sql += values.join(',\n')
  sql += `\nON CONFLICT (product_code) DO NOTHING;\n`

  fs.writeFileSync(sqlPath, sql, 'utf-8')
  console.log(`✅ 已輸出 SQL 檔案：${sqlPath}`)

  console.log('\n=== 遷移準備完成 ===')
  console.log('\n下一步：')
  console.log('1. 在 Supabase SQL Editor 執行 init-traceability-schema.sql')
  console.log('2. 執行 traceability-seed.sql 匯入資料')
  console.log('   或使用管理後台 /admin/traceability/batch 批次匯入')
}

migrate().catch(console.error)
