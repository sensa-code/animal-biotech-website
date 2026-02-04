const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔐 Checking Authentication Setup...\n');
console.log(`📍 Database: ${supabaseUrl}\n`);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkAuth() {
  try {
    // List all users
    console.log('👥 Checking users in Supabase Auth...\n');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
      return;
    }

    console.log(`📊 Total users: ${users.users.length}\n`);

    if (users.users.length === 0) {
      console.log('⚠️  No users found in Supabase Auth!');
      console.log('\n📝 To create admin user:');
      console.log('   1. Go to Supabase Dashboard → Authentication → Users');
      console.log('   2. Click "Add user" → "Create new user"');
      console.log('   3. Email: admin@senbio.tech');
      console.log('   4. Password: admin123');
      console.log('   5. Check "Auto Confirm User"\n');
      return;
    }

    // Display user details
    console.log('📋 User List:\n');
    users.users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log(`   - Email confirmed: ${user.email_confirmed_at ? '✅ Yes' : '❌ No'}`);
      console.log(`   - Last sign in: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`);

      if (user.user_metadata && Object.keys(user.user_metadata).length > 0) {
        console.log(`   - Metadata:`, user.user_metadata);
      }

      console.log();
    });

    // Check for admin user
    const adminUser = users.users.find(u => u.email === 'admin@senbio.tech');

    if (!adminUser) {
      console.log('⚠️  Admin user (admin@senbio.tech) not found!');
      console.log('Please create it in Supabase Dashboard.\n');
    } else {
      console.log('✅ Admin user found: admin@senbio.tech');

      if (!adminUser.email_confirmed_at) {
        console.log('⚠️  Admin email is NOT confirmed!');
        console.log('\n🔧 To fix:');
        console.log('   1. Go to Supabase Dashboard → Authentication → Users');
        console.log('   2. Click on admin@senbio.tech');
        console.log('   3. Click "Confirm email"\n');
      } else {
        console.log('✅ Admin email is confirmed\n');
      }
    }

    // Test login with admin credentials
    if (adminUser && adminUser.email_confirmed_at) {
      console.log('🔑 Testing login with admin@senbio.tech...\n');

      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'admin@senbio.tech',
        password: 'admin123'
      });

      if (loginError) {
        console.error('❌ Login failed:', loginError.message);
        console.log('\n🔧 Possible issues:');
        console.log('   1. Password is incorrect');
        console.log('   2. Email not confirmed');
        console.log('   3. User is disabled');
        console.log('\n💡 Try resetting the password in Supabase Dashboard\n');
      } else {
        console.log('✅ Login successful!');
        console.log(`   - User ID: ${loginData.user.id}`);
        console.log(`   - Session: ${loginData.session ? 'Created' : 'None'}\n`);
      }
    }

    // Check Auth settings
    console.log('⚙️  Checking Auth configuration...\n');
    console.log('📝 Recommended settings in Supabase Dashboard → Authentication → Settings:');
    console.log('   - Enable email confirmations: No (for testing)');
    console.log('   - Enable phone confirmations: No');
    console.log('   - Site URL: http://localhost:3000');
    console.log('   - Redirect URLs: http://localhost:3000/**\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAuth();
