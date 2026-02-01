-- =============================================
-- Website Schema 初始化腳本
-- 與 public schema (溯源系統) 完全隔離
-- =============================================

CREATE SCHEMA IF NOT EXISTS website;

-- ----- 1. 網站設定 (公司資訊) -----
CREATE TABLE IF NOT EXISTS website.site_settings (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----- 2. Hero 區塊內容 -----
CREATE TABLE IF NOT EXISTS website.hero_content (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT,
    cta_primary_text TEXT,
    cta_primary_link TEXT,
    cta_secondary_text TEXT,
    cta_secondary_link TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----- 3. 統計數據 -----
CREATE TABLE IF NOT EXISTS website.stats (
    id SERIAL PRIMARY KEY,
    value INTEGER NOT NULL,
    suffix TEXT NOT NULL,
    label TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----- 4. 產品分類 -----
CREATE TABLE IF NOT EXISTS website.product_categories (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    icon_name TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    hero_image TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----- 5. 展示產品 (與 public.products 溯源表完全不同) -----
CREATE TABLE IF NOT EXISTS website.products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES website.product_categories(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    model TEXT,
    description TEXT NOT NULL,
    features JSONB DEFAULT '[]',
    specs JSONB DEFAULT '{}',
    image TEXT,
    is_highlighted BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----- 6. 首頁主打產品 -----
CREATE TABLE IF NOT EXISTS website.featured_products (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES website.products(id) ON DELETE CASCADE,
    category_label TEXT,
    badge_text TEXT,
    highlight_text TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----- 7. 最新消息 -----
CREATE TABLE IF NOT EXISTS website.news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----- 8. 聯絡表單提交 -----
CREATE TABLE IF NOT EXISTS website.contact_submissions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----- 9. 官網管理員 (獨立於溯源系統的 admins) -----
CREATE TABLE IF NOT EXISTS website.admins (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'editor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 建立索引
-- =============================================
CREATE INDEX IF NOT EXISTS idx_ws_products_category ON website.products(category_id);
CREATE INDEX IF NOT EXISTS idx_ws_products_slug ON website.products(slug);
CREATE INDEX IF NOT EXISTS idx_ws_categories_slug ON website.product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_ws_featured_product ON website.featured_products(product_id);
CREATE INDEX IF NOT EXISTS idx_ws_news_published ON website.news(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ws_contact_read ON website.contact_submissions(is_read, created_at DESC);

-- =============================================
-- Seed 初始資料
-- =============================================

-- 網站設定
INSERT INTO website.site_settings (key, value) VALUES
    ('company_name', '上弦動物生技'),
    ('phone', '02-2600-8387'),
    ('email', 'service@senbio.tech'),
    ('address', '新北市林口區忠福路131號'),
    ('website_url', 'www.senbio.tech'),
    ('business_hours', '週一至週五 09:00 - 18:00'),
    ('company_description', '以獸醫師角度出發，提供動物醫院完善的檢測設備、滅菌服務及醫療耗材，致力打造更優質的動物醫療環境。')
ON CONFLICT (key) DO NOTHING;

-- Hero 內容
INSERT INTO website.hero_content (title, subtitle, description, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link) VALUES
    ('專業動物醫療設備與耗材', 'Professional Veterinary Solutions',
     '上弦動物生技以獸醫師的角度為出發點，提供動物醫院完善的檢測設備、滅菌服務及醫療耗材，致力打造更優質的動物醫療環境。',
     '主打產品', '#featured', '了解更多', '#about')
ON CONFLICT DO NOTHING;

-- 統計數據
INSERT INTO website.stats (value, suffix, label, sort_order) VALUES
    (295, '萬', '全台貓狗數量', 1),
    (12, '分鐘', '生化檢查報告', 2),
    (22, '項', '單次檢查項目', 3),
    (100, '+', '合作動物醫院', 4)
ON CONFLICT DO NOTHING;

-- 產品分類
INSERT INTO website.product_categories (slug, icon_name, title, subtitle, description, sort_order) VALUES
    ('diagnostic', 'Activity', '診斷設備', 'Diagnostic Equipment',
     '提供先進的全自動臨床生化分析儀，只需 0.1cc 全血即可在 12 分鐘內完成 22 項生化檢查，大幅提升診斷效率。', 1),
    ('rapid', 'TestTube', '快篩試劑', 'Rapid Test Kits',
     '完整的膠體金快篩產品線，涵蓋貓毛滴蟲、犬下痢套組、抗體力價檢測等，協助獸醫師快速準確診斷。', 2),
    ('wound', 'Stethoscope', '傷口護理', 'Wound Care',
     '專業的傷口護理產品，包含高濃度銀離子凝膠、藻酸鈣銀敷料等，有效促進傷口癒合並預防感染。', 3),
    ('surgical', 'Scissors', '手術耗材', 'Surgical Supplies',
     '提供動物專用組織膠、拋棄式切割吻合器、皮釘等手術耗材，以及專業的電漿滅菌服務。', 4)
ON CONFLICT (slug) DO NOTHING;

-- 產品資料
-- 診斷設備
INSERT INTO website.products (category_id, slug, name, model, description, features, specs, is_highlighted, sort_order) VALUES
    ((SELECT id FROM website.product_categories WHERE slug = 'diagnostic'),
     'biochem-analyzer', '全自動臨床生化分析儀', 'LOCMEDT',
     '動物用全自動臨床生化分析儀，只需 90~120uL 全血，12 分鐘自動完成 22 項生化檢查，自動離心稀釋、自動 QC。',
     '["僅需 0.1cc 全血","12 分鐘完成檢測","22 項生化檢查","自動離心稀釋","自動品質控制","操作簡便快速"]',
     '{"檢體需求":"90~120μL 全血","檢測時間":"約 12 分鐘","檢測項目":"22 項生化指標","特色功能":"自動離心、稀釋、QC"}',
     true, 1),
    ((SELECT id FROM website.product_categories WHERE slug = 'diagnostic'),
     'test-disc', '生化檢驗試片盤', '專用耗材',
     '搭配全自動生化分析儀使用的專用試片盤，確保檢測結果的準確性與一致性。',
     '["高精準度檢測","穩定品質控制","長效保存期限","即開即用設計"]',
     '{"適用機型":"LOCMEDT 生化分析儀","保存方式":"冷藏保存","包裝規格":"請洽詢業務"}',
     false, 2),
    ((SELECT id FROM website.product_categories WHERE slug = 'diagnostic'),
     'fluorescence-analyzer', '免疫螢光分析儀', '進階檢測',
     '提供更精密的免疫螢光檢測功能，適用於特殊項目的定量分析。',
     '["高靈敏度檢測","定量分析結果","多項目檢測","數據管理系統"]',
     '{"檢測原理":"免疫螢光法","應用範圍":"特殊項目定量分析"}',
     false, 3),
-- 快篩試劑
    ((SELECT id FROM website.product_categories WHERE slug = 'rapid'),
     'cat-trichomonas', '貓毛滴蟲抗原快篩', 'Feline Tritrichomonas Ag',
     '貓感染毛滴蟲會造成反覆慢性下痢、血痢、黏液便、消瘦等症狀，且可能被誤判為梨形鞭毛蟲感染導致無效治療。',
     '["快速精準診斷","避免誤判梨形鞭毛蟲","簡易操作流程","結果判讀清晰"]',
     '{"檢體類型":"糞便檢體","判讀時間":"10-15 分鐘","保存條件":"2-30°C"}',
     true, 1),
    ((SELECT id FROM website.product_categories WHERE slug = 'rapid'),
     'canine-diarrhea', '犬下痢套組', '4-in-1 Canine Diarrhea Panel',
     '為全齡犬常見消化道傳染病提供完整檢查，包含犬小病毒、冠狀病毒、梨型鞭毛蟲及輪狀病毒檢測。',
     '["四合一完整檢測","犬小病毒 (CPV)","冠狀病毒 (CCV)","梨型鞭毛蟲 (Giardia)","輪狀病毒 (Rotavirus)"]',
     '{"檢測項目":"4 種病原","適用對象":"全齡犬","檢體類型":"糞便檢體"}',
     true, 2),
    ((SELECT id FROM website.product_categories WHERE slug = 'rapid'),
     'antibody-titer', '抗體力價檢測', 'Antibody Titer Test',
     '適用於接種疫苗前後、健康檢查、疑似早期病毒感染、或動物經歷外宿寄養等可能交叉感染場所後使用。',
     '["評估免疫狀態","疫苗效果確認","早期感染偵測","需搭配判讀機"]',
     '{"適用時機":"疫苗接種前後、健康檢查","檢體類型":"血清/全血","注意事項":"需搭配快篩判讀機使用"}',
     false, 3),
    ((SELECT id FROM website.product_categories WHERE slug = 'rapid'),
     'reader', '快篩判讀機', 'Reader Device',
     '搭配抗體力價檢測使用，提供客觀準確的數值判讀結果。',
     '["數位化判讀","結果客觀準確","數據可追溯","操作簡便"]',
     '{"功能":"快篩結果數位判讀","適用產品":"抗體力價檢測試劑"}',
     false, 4),
-- 傷口護理
    ((SELECT id FROM website.product_categories WHERE slug = 'wound'),
     'silver-gel', '高濃度銀離子凝膠', 'Silver Ion Gel',
     '含高濃度銀離子的傷口護理凝膠，具有優異的抗菌效果，有效預防傷口感染並促進癒合。',
     '["高濃度銀離子","廣效抗菌作用","促進傷口癒合","減少感染風險"]',
     '{"主要成分":"銀離子","適用範圍":"各類傷口護理","使用方式":"外用塗抹"}',
     true, 1),
    ((SELECT id FROM website.product_categories WHERE slug = 'wound'),
     'alginate-silver', '藻酸鈣銀敷料', 'Alginate Silver Dressing',
     '結合藻酸鈣與銀離子的高級敷料，適用於中度至重度滲出液傷口，提供濕潤癒合環境。',
     '["吸收滲出液","維持濕潤環境","銀離子抗菌","促進肉芽生長"]',
     '{"材質":"藻酸鈣 + 銀離子","適用傷口":"中重度滲出液傷口"}',
     false, 2),
    ((SELECT id FROM website.product_categories WHERE slug = 'wound'),
     'spray-bottle', '儲霧瓶', 'Spray Bottle',
     '專業醫療級儲霧瓶，可搭配各類傷口護理液使用，噴霧均勻細緻。',
     '["醫療級材質","噴霧均勻","使用便利","可重複使用"]',
     '{"材質":"醫療級塑料","容量":"請洽詢業務"}',
     false, 3),
    ((SELECT id FROM website.product_categories WHERE slug = 'wound'),
     'elastic-bandage', '動物用彈性繃帶', 'Elastic Bandage',
     '專為動物設計的彈性繃帶，具有良好的延展性與固定效果，不易被動物咬破。',
     '["高彈性材質","固定效果佳","透氣舒適","不易被咬破"]',
     '{"特性":"高彈性、透氣","適用對象":"各類動物"}',
     false, 4),
-- 手術耗材
    ((SELECT id FROM website.product_categories WHERE slug = 'surgical'),
     'tissue-glue', '動物專用組織膠', 'Veterinary Tissue Adhesive',
     '專為動物手術設計的組織膠，可快速黏合傷口，減少縫合需求，降低手術時間。',
     '["快速黏合","減少縫合","降低手術時間","傷口美觀"]',
     '{"適用範圍":"皮膚及軟組織","黏合時間":"快速","特點":"減少縫線使用"}',
     true, 1),
    ((SELECT id FROM website.product_categories WHERE slug = 'surgical'),
     'stapler', '直線切割吻合器', 'Linear Cutter Stapler',
     '拋棄式直線切割吻合器，提供精準的組織切割與吻合，適用於各類外科手術。',
     '["精準切割","可靠吻合","拋棄式設計","降低感染風險"]',
     '{"類型":"拋棄式","功能":"切割 + 吻合"}',
     false, 2),
    ((SELECT id FROM website.product_categories WHERE slug = 'surgical'),
     'skin-stapler', '拋棄式皮釘', 'Disposable Skin Stapler',
     '快速便利的皮膚縫合方案，適用於線性傷口的快速閉合。',
     '["快速縫合","操作簡便","傷口整齊","拋棄式衛生"]',
     '{"類型":"拋棄式","適用":"線性皮膚傷口"}',
     false, 3),
    ((SELECT id FROM website.product_categories WHERE slug = 'surgical'),
     'sterilization', '電漿滅菌服務', 'Plasma Sterilization Service',
     '提供專業的電漿滅菌服務，適用於不耐高溫高壓的精密醫療器械。',
     '["低溫滅菌","保護精密器械","滅菌效果確實","專業服務團隊"]',
     '{"滅菌方式":"低溫電漿","適用器械":"不耐高溫精密器材","服務類型":"委託滅菌"}',
     true, 4)
ON CONFLICT (slug) DO NOTHING;

-- 主打產品 (連結到 products 表)
INSERT INTO website.featured_products (product_id, category_label, badge_text, highlight_text, sort_order) VALUES
    ((SELECT id FROM website.products WHERE slug = 'biochem-analyzer'),
     '診斷設備', '主打產品', '0.1cc 全血 / 12 分鐘 / 22 項檢查', 1),
    ((SELECT id FROM website.products WHERE slug = 'cat-trichomonas'),
     '快篩試劑', '精準診斷', '避免誤診 / 快速檢測', 2),
    ((SELECT id FROM website.products WHERE slug = 'canine-diarrhea'),
     '快篩試劑', '完整檢測', '4 合 1 檢測套組', 3),
    ((SELECT id FROM website.products WHERE slug = 'antibody-titer'),
     '快篩試劑', '免疫評估', '需搭配快篩判讀機', 4)
ON CONFLICT DO NOTHING;
