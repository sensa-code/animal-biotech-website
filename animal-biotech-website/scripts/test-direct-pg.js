const { Pool } = require('pg');
require('dotenv').config();

// Check if we have DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.log('⚠️  DATABASE_URL not found in .env');
  console.log('You can get it from Supabase Dashboard → Settings → Database → Connection String\n');

  // Construct it from available info
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const match = url?.match(/https:\/\/(.+?)\.supabase\.co/);
  if (match) {
    const projectRef = match[1];
    console.log('Format: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres');
    console.log(`Your project ref: ${projectRef}`);
    console.log('\nYou need to get the password from Supabase Dashboard.\n');
  }
  process.exit(0);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testDirectConnection() {
  try {
    console.log('🔌 Connecting to PostgreSQL directly...\n');

    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected!\n');

    // Check if website schema exists
    const schemaCheck = await client.query(`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name = 'website'
    `);

    if (schemaCheck.rows.length === 0) {
      console.log('❌ website schema does not exist!');
      client.release();
      pool.end();
      return;
    }

    console.log('✅ website schema exists\n');

    // List all tables
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'website'
      ORDER BY table_name
    `);

    console.log(`📋 Found ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // Check data
    console.log('\n📊 Checking data:');

    const settings = await client.query('SELECT COUNT(*) FROM website.site_settings');
    console.log(`   - site_settings: ${settings.rows[0].count} records`);

    const categories = await client.query('SELECT COUNT(*) FROM website.product_categories');
    console.log(`   - product_categories: ${categories.rows[0].count} records`);

    const products = await client.query('SELECT COUNT(*) FROM website.products');
    console.log(`   - products: ${products.rows[0].count} records`);

    const featured = await client.query('SELECT COUNT(*) FROM website.featured_products');
    console.log(`   - featured_products: ${featured.rows[0].count} records`);

    // Show sample data
    console.log('\n🔍 Sample product categories:');
    const catSample = await client.query('SELECT slug, title FROM website.product_categories LIMIT 3');
    catSample.rows.forEach(row => console.log(`   - ${row.slug}: ${row.title}`));

    console.log('\n✅ Direct PostgreSQL connection works!');
    console.log('\n⚠️  Issue: PostgREST API needs to reload schema cache');
    console.log('📝 This is a Supabase Cloud limitation - the cache update can take a few minutes\n');

    client.release();
    await pool.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

testDirectConnection();
