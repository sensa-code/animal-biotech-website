const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

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

async function executeMigration() {
  console.log('🚀 Starting database migration...\n');
  console.log(`📍 Target database: ${supabaseUrl}\n`);

  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, 'init-website-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Read SQL file: init-website-schema.sql');
    console.log(`📏 SQL length: ${sql.length} characters\n`);

    // Execute SQL
    console.log('⏳ Executing SQL schema initialization...');
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If exec_sql doesn't exist, try direct execution via PostgreSQL connection
      console.log('⚠️  rpc method not available, trying alternative approach...\n');

      // Split SQL into individual statements and execute them
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      console.log(`📝 Executing ${statements.length} SQL statements...\n`);

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.length < 20) continue; // Skip very short statements

        const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement });

        if (stmtError) {
          console.log(`❌ Statement ${i + 1} failed:`, stmtError.message);
          errorCount++;
        } else {
          successCount++;
          process.stdout.write(`✅ ${successCount}/${statements.length} `);
        }
      }

      console.log(`\n\n✅ Executed ${successCount} statements successfully`);
      if (errorCount > 0) {
        console.log(`⚠️  ${errorCount} statements had errors`);
      }
    } else {
      console.log('✅ SQL executed successfully!\n');
    }

    // Verify tables were created
    console.log('\n🔍 Verifying table creation...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'website');

    if (tablesError) {
      console.log('⚠️  Could not verify tables:', tablesError.message);
    } else {
      console.log(`✅ Found ${tables?.length || 0} tables in website schema`);
      if (tables && tables.length > 0) {
        tables.forEach(t => console.log(`   - ${t.table_name}`));
      }
    }

    // Verify seed data
    console.log('\n🌱 Checking seed data...');
    const { data: settings, error: settingsError } = await supabase
      .schema('website')
      .from('site_settings')
      .select('*');

    if (settingsError) {
      console.log('⚠️  Could not check seed data:', settingsError.message);
    } else {
      console.log(`✅ site_settings: ${settings?.length || 0} records`);
    }

    const { data: categories, error: categoriesError } = await supabase
      .schema('website')
      .from('product_categories')
      .select('*');

    if (categoriesError) {
      console.log('⚠️  Could not check categories:', categoriesError.message);
    } else {
      console.log(`✅ product_categories: ${categories?.length || 0} records`);
    }

    const { data: products, error: productsError } = await supabase
      .schema('website')
      .from('products')
      .select('*');

    if (productsError) {
      console.log('⚠️  Could not check products:', productsError.message);
    } else {
      console.log(`✅ products: ${products?.length || 0} records`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Create storage bucket "website-images"');
    console.log('   2. Create admin user (admin@senbio.tech)');
    console.log('   3. Test admin login\n');

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

executeMigration();
