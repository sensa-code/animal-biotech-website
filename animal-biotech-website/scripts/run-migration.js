const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function runMigration() {
  console.log('🚀 Starting database migration to ozzhgginibhydrkkonmn...\n');

  // Construct DATABASE_URL from Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL not found in .env');
    process.exit(1);
  }

  // Extract project ref from URL
  const projectRef = supabaseUrl.match(/https:\/\/(.+?)\.supabase\.co/)?.[1];
  if (!projectRef) {
    console.error('❌ Could not extract project ref from Supabase URL');
    process.exit(1);
  }

  console.log(`📍 Project: ${projectRef}`);
  console.log(`📍 URL: ${supabaseUrl}\n`);

  // You need to get the database password from Supabase dashboard
  // Database Settings -> Connection String -> URI
  console.log('⚠️  IMPORTANT: This script requires direct PostgreSQL access.');
  console.log('   Please run the SQL script manually in Supabase SQL Editor:\n');
  console.log('   1. Open: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
  console.log('   2. Copy contents of: E:\\CLAUDE CODE\\INDEX\\animal-biotech-website\\scripts\\init-website-schema.sql');
  console.log('   3. Paste into SQL Editor and click "Run"\n');
  console.log('   Alternatively, you can set DATABASE_URL in .env with your connection string.\n');

  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    console.log('ℹ️  To automate this, add DATABASE_URL to your .env file:');
    console.log('   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres\n');
    process.exit(0);
  }

  // If DATABASE_URL exists, execute the migration
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, 'init-website-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log(`📄 Loaded SQL file (${sql.length} characters)\n`);

    // Execute SQL
    console.log('⏳ Executing migration...');
    await client.query(sql);
    console.log('✅ Migration executed successfully!\n');

    // Verify tables
    console.log('🔍 Verifying tables...');
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'website'
      ORDER BY table_name;
    `);

    console.log(`✅ Found ${result.rows.length} tables:`);
    result.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // Check seed data
    console.log('\n🌱 Checking seed data...');
    const settings = await client.query('SELECT COUNT(*) FROM website.site_settings');
    console.log(`   - site_settings: ${settings.rows[0].count} records`);

    const categories = await client.query('SELECT COUNT(*) FROM website.product_categories');
    console.log(`   - product_categories: ${categories.rows[0].count} records`);

    const products = await client.query('SELECT COUNT(*) FROM website.products');
    console.log(`   - products: ${products.rows[0].count} records`);

    console.log('\n✅ Database migration completed successfully!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
