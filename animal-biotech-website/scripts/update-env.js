const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 Updating Vercel Environment Variables...\n');

const projectDir = path.join(__dirname, '..');
process.chdir(projectDir);

const envVars = {
  'NEXT_PUBLIC_SUPABASE_URL': 'https://ozzhgginibhydrkkonmn.supabase.co',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96emhnZ2luaWJoeWRya2tvbm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNjU2ODEsImV4cCI6MjA4NDk0MTY4MX0.Nl1MFl4jWVE0oD7t1jOiZR_F_DoQ2A7Wz4F-7wj7qU8',
  'SUPABASE_SERVICE_ROLE_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96emhnZ2luaWJoeWRya2tvbm1uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM2NTY4MSwiZXhwIjoyMDg0OTQxNjgxfQ.X7mwT1e2PM7VcBt4FCEaMsCL3JBSrhRsdlF94Td2pKo',
  'NEXTAUTH_SECRET': 'senbio-website-secret-key-2025',
  'NEXTAUTH_URL': 'https://animal-biotech-website.vercel.app'
};

let updated = 0;
let failed = 0;

for (const [key, value] of Object.entries(envVars)) {
  console.log(`📝 Updating ${key}...`);

  try {
    // Remove old value (ignore errors if doesn't exist)
    try {
      execSync(`vercel env rm ${key} production -y`, { stdio: 'pipe' });
    } catch (e) {
      // Variable might not exist, that's okay
    }

    // Add new value
    execSync(`echo ${value} | vercel env add ${key} production`, {
      stdio: 'inherit',
      shell: true
    });

    console.log(`   ✅ ${key} updated\n`);
    updated++;
  } catch (error) {
    console.error(`   ❌ Failed to update ${key}`);
    console.error(`   Error: ${error.message}\n`);
    failed++;
  }
}

console.log('\n' + '='.repeat(50));
console.log(`✅ Updated: ${updated} variables`);
if (failed > 0) {
  console.log(`❌ Failed: ${failed} variables`);
}
console.log('='.repeat(50) + '\n');

if (updated > 0) {
  console.log('🚀 Redeploying to production...\n');
  try {
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log('\n✅ Deployment complete!');
    console.log('📋 Test login at: https://animal-biotech-website.vercel.app/admin/login');
    console.log('🔑 Credentials: admin@senbio.tech / admin123\n');
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('⚠️  No variables were updated. Please check manually.\n');
}
