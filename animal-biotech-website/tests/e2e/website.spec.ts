import { test, expect } from '@playwright/test'

test.describe('官網首頁', () => {
  test('首頁正常載入，顯示公司名稱和導航列', async ({ page }) => {
    await page.goto('/')

    // 確認頁面標題包含公司名
    await expect(page).toHaveTitle(/上弦動物生技/)

    // 確認 header 導航列可見
    await expect(page.locator('header')).toBeVisible()

    // 確認 header 中有主要導航項目（用 header 範圍限定避免 footer 重複）
    const header = page.locator('header')
    await expect(header.getByRole('link', { name: '產品服務' })).toBeVisible()
    await expect(header.getByRole('link', { name: '聯絡我們' })).toBeVisible()
  })

  test('首頁無嚴重 console error', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text()
        // 排除已知的非嚴重錯誤
        if (
          !text.includes('vercel/insights') &&
          !text.includes('favicon') &&
          !text.includes('Extension') &&
          !text.includes('404') &&
          !text.includes('MIME type') &&
          !text.includes('Web Analytics')
        ) {
          errors.push(text)
        }
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 不應有未預期的嚴重 console error
    expect(errors).toEqual([])
  })
})

test.describe('產品頁面', () => {
  test('產品總覽頁顯示 4 個分類和產品列表', async ({ page }) => {
    await page.goto('/products')

    await expect(page).toHaveTitle(/產品與服務/)

    // 確認 4 個分類標籤都存在
    await expect(page.getByRole('button', { name: '診斷設備' })).toBeVisible()
    await expect(page.getByRole('button', { name: '快篩試劑' })).toBeVisible()
    await expect(page.getByRole('button', { name: '傷口護理' })).toBeVisible()
    await expect(page.getByRole('button', { name: '手術耗材' })).toBeVisible()

    // 確認有產品顯示（至少第一個分類的產品）
    await expect(page.getByText('共 3 項產品')).toBeVisible()
  })

  test('產品分類切換正常運作', async ({ page }) => {
    await page.goto('/products')

    // 點選快篩試劑分類
    await page.getByRole('button', { name: '快篩試劑' }).click()

    // 確認顯示快篩試劑的子標題
    await expect(page.getByText('Rapid Test Kits')).toBeVisible()

    // 確認有產品
    await expect(page.getByText('共 4 項產品')).toBeVisible()
  })

  test('產品詳情頁可正常載入', async ({ page }) => {
    await page.goto('/products/biochem-analyzer')

    // 確認產品名稱顯示（用精確匹配 + h1 限定）
    await expect(page.locator('h1').filter({ hasText: '全自動臨床生化分析儀' })).toBeVisible()
  })

  test('產品頁 API 回傳正確資料', async ({ request }) => {
    const response = await request.get('/api/website/products')
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data).toBeDefined()

    // 確認 4 個分類
    const categories = Object.keys(data.data)
    expect(categories).toHaveLength(4)
    expect(categories).toContain('diagnostic')
    expect(categories).toContain('rapid')
    expect(categories).toContain('wound')
    expect(categories).toContain('surgical')
  })
})

test.describe('其他頁面', () => {
  test('關於頁面正常載入', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveTitle(/關於/)
  })

  test('聯絡頁面正常載入', async ({ page }) => {
    await page.goto('/contact')
    await expect(page).toHaveTitle(/聯絡/)

    // 確認有聯絡表單
    await expect(page.getByRole('textbox').first()).toBeVisible()
  })

  test('產品溯源頁面正常載入', async ({ page }) => {
    await page.goto('/trace')
    await expect(page).toHaveTitle(/產品/)
  })

  test('404 頁面正確顯示', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-12345')
    // Next.js 回傳 404
    expect(response?.status()).toBe(404)
  })
})

test.describe('SEO 與效能', () => {
  test('首頁有正確的 meta 標籤', async ({ page }) => {
    await page.goto('/')

    // 確認 OG meta 標籤
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', /上弦動物生技/)

    const ogDescription = page.locator('meta[property="og:description"]')
    await expect(ogDescription).toHaveAttribute('content', /獸醫師/)

    // 確認 canonical URL
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute('href', /senbio\.tech/)
  })

  test('導航連結可正常導航', async ({ page, isMobile }) => {
    await page.goto('/')

    if (isMobile) {
      // Mobile: 先開啟 hamburger menu
      await page.getByLabel('Toggle menu').click()
      await page.getByRole('link', { name: '產品服務' }).last().click()
    } else {
      // Desktop: 直接點 header 中的導航連結
      await page.locator('header nav').getByRole('link', { name: '產品服務' }).click()
    }
    await page.waitForURL(/\/products/)
    await expect(page).toHaveTitle(/產品與服務/)

    if (isMobile) {
      await page.getByLabel('Toggle menu').click()
      await page.getByRole('link', { name: '聯絡我們' }).last().click()
    } else {
      await page.locator('header').getByRole('link', { name: '聯絡我們' }).click()
    }
    await page.waitForURL(/\/contact/)
    await expect(page).toHaveTitle(/聯絡/)
  })
})
