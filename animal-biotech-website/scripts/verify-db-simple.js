const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Simple Database Verification...\n');
console.log(`📍 Database: ${supabaseUrl}\n`);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'website'
  }
});

async function testQuery() {
  console.log('Testing database connection with website schema...\n');

  // Try a simple query
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error querying site_settings:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ Successfully connected to database!');
    console.log('✅ Found site_settings data:', data);
  }

  // Test storage
  console.log('\n📦 Testing storage bucket...');
  const { data: buckets, error: bucketsError } = await supabase
    .storage
    .listBuckets();

  if (bucketsError) {
    console.error('❌ Error listing buckets:', bucketsError.message);
  } else {
    console.log('✅ Storage buckets:', buckets.map(b => b.name).join(', '));
    const websiteBucket = buckets.find(b => b.name === 'website-images');
    if (websiteBucket) {
      console.log('✅ website-images bucket exists (public:', websiteBucket.public, ')');
    }
  }
}

testQuery();
