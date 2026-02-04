const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifyDatabase() {
  console.log('🔍 Verifying Database Migration...\n');
  console.log(`📍 Database: ${supabaseUrl}\n`);

  let allPassed = true;

  try {
    // Test 1: Check site_settings
    console.log('📋 Test 1: Checking site_settings...');
    const { data: settings, error: settingsError } = await supabase
      .schema('website')
      .from('site_settings')
      .select('*');

    if (settingsError) {
      console.error('   ❌ Error:', settingsError.message);
      allPassed = false;
    } else {
      console.log(`   ✅ Found ${settings.length} records`);
      if (settings.length > 0) {
        const companyName = settings.find(s => s.key === 'company_name');
        if (companyName) {
          console.log(`   ✅ Company name: ${companyName.value}`);
        }
      }
    }

    // Test 2: Check product_categories
    console.log('\n📋 Test 2: Checking product_categories...');
    const { data: categories, error: categoriesError } = await supabase
      .schema('website')
      .from('product_categories')
      .select('*');

    if (categoriesError) {
      console.error('   ❌ Error:', categoriesError.message);
      allPassed = false;
    } else {
      console.log(`   ✅ Found ${categories.length} categories`);
      categories.forEach(cat => {
        console.log(`      - ${cat.title} (${cat.slug})`);
      });
    }

    // Test 3: Check products
    console.log('\n📋 Test 3: Checking products...');
    const { data: products, error: productsError } = await supabase
      .schema('website')
      .from('products')
      .select('*');

    if (productsError) {
      console.error('   ❌ Error:', productsError.message);
      allPassed = false;
    } else {
      console.log(`   ✅ Found ${products.length} products`);
    }

    // Test 4: Check featured_products
    console.log('\n📋 Test 4: Checking featured_products...');
    const { data: featured, error: featuredError } = await supabase
      .schema('website')
      .from('featured_products')
      .select('*');

    if (featuredError) {
      console.error('   ❌ Error:', featuredError.message);
      allPassed = false;
    } else {
      console.log(`   ✅ Found ${featured.length} featured products`);
    }

    // Test 5: Check hero_content
    console.log('\n📋 Test 5: Checking hero_content...');
    const { data: hero, error: heroError } = await supabase
      .schema('website')
      .from('hero_content')
      .select('*');

    if (heroError) {
      console.error('   ❌ Error:', heroError.message);
      allPassed = false;
    } else {
      console.log(`   ✅ Found ${hero.length} hero content`);
      if (hero.length > 0) {
        console.log(`      Title: ${hero[0].title}`);
      }
    }

    // Test 6: Check stats
    console.log('\n📋 Test 6: Checking stats...');
    const { data: stats, error: statsError } = await supabase
      .schema('website')
      .from('stats')
      .select('*');

    if (statsError) {
      console.error('   ❌ Error:', statsError.message);
      allPassed = false;
    } else {
      console.log(`   ✅ Found ${stats.length} stats`);
    }

    // Test 7: Check news table
    console.log('\n📋 Test 7: Checking news...');
    const { data: news, error: newsError } = await supabase
      .schema('website')
      .from('news')
      .select('*');

    if (newsError) {
      console.error('   ❌ Error:', newsError.message);
      allPassed = false;
    } else {
      console.log(`   ✅ Found ${news.length} news articles`);
    }

    // Test 8: Check contact_submissions table
    console.log('\n📋 Test 8: Checking contact_submissions...');
    const { data: submissions, error: submissionsError } = await supabase
      .schema('website')
      .from('contact_submissions')
      .select('*');

    if (submissionsError) {
      console.error('   ❌ Error:', submissionsError.message);
      allPassed = false;
    } else {
      console.log(`   ✅ Found ${submissions.length} contact submissions`);
    }

    // Test 9: Check storage bucket
    console.log('\n📋 Test 9: Checking storage bucket...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.error('   ❌ Error:', bucketsError.message);
      allPassed = false;
    } else {
      const websiteBucket = buckets.find(b => b.name === 'website-images');
      if (websiteBucket) {
        console.log(`   ✅ Storage bucket 'website-images' exists`);
        console.log(`      Public: ${websiteBucket.public}`);
      } else {
        console.error('   ❌ Storage bucket "website-images" not found');
        allPassed = false;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    if (allPassed) {
      console.log('✅ All database verification tests passed!');
      console.log('\n📊 Summary:');
      console.log(`   - Site settings: ${settings?.length || 0} records`);
      console.log(`   - Categories: ${categories?.length || 0} records`);
      console.log(`   - Products: ${products?.length || 0} records`);
      console.log(`   - Featured products: ${featured?.length || 0} records`);
      console.log(`   - Hero content: ${hero?.length || 0} records`);
      console.log(`   - Stats: ${stats?.length || 0} records`);
      console.log(`   - News: ${news?.length || 0} records`);
      console.log(`   - Contact submissions: ${submissions?.length || 0} records`);
      console.log(`   - Storage bucket: ✅ Created`);
      console.log('\n🎉 Database migration successful!');
      console.log('\n📋 Next steps:');
      console.log('   1. Start dev server: npm run dev');
      console.log('   2. Test login: http://localhost:3000/admin/login');
      console.log('   3. Credentials: admin@senbio.tech / admin123');
    } else {
      console.log('❌ Some verification tests failed. Please check the errors above.');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifyDatabase();
