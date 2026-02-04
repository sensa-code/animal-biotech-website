@echo off
echo 🔧 Updating Vercel Environment Variables...
echo.

cd /d "E:\CLAUDE CODE\INDEX\animal-biotech-website"

echo 📝 Setting NEXT_PUBLIC_SUPABASE_URL...
echo https://ozzhgginibhydrkkonmn.supabase.co | vercel env rm NEXT_PUBLIC_SUPABASE_URL production -y >nul 2>&1
echo https://ozzhgginibhydrkkonmn.supabase.co | vercel env add NEXT_PUBLIC_SUPABASE_URL production

echo.
echo 📝 Setting NEXT_PUBLIC_SUPABASE_ANON_KEY...
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96emhnZ2luaWJoeWRya2tvbm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNjU2ODEsImV4cCI6MjA4NDk0MTY4MX0.Nl1MFl4jWVE0oD7t1jOiZR_F_DoQ2A7Wz4F-7wj7qU8 | vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production -y >nul 2>&1
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96emhnZ2luaWJoeWRya2tvbm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNjU2ODEsImV4cCI6MjA4NDk0MTY4MX0.Nl1MFl4jWVE0oD7t1jOiZR_F_DoQ2A7Wz4F-7wj7qU8 | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo.
echo 📝 Setting SUPABASE_SERVICE_ROLE_KEY...
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96emhnZ2luaWJoeWRya2tvbm1uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM2NTY4MSwiZXhwIjoyMDg0OTQxNjgxfQ.X7mwT1e2PM7VcBt4FCEaMsCL3JBSrhRsdlF94Td2pKo | vercel env rm SUPABASE_SERVICE_ROLE_KEY production -y >nul 2>&1
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96emhnZ2luaWJoeWRya2tvbm1uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM2NTY4MSwiZXhwIjoyMDg0OTQxNjgxfQ.X7mwT1e2PM7VcBt4FCEaMsCL3JBSrhRsdlF94Td2pKo | vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo.
echo 📝 Setting NEXTAUTH_URL...
echo https://animal-biotech-website.vercel.app | vercel env rm NEXTAUTH_URL production -y >nul 2>&1
echo https://animal-biotech-website.vercel.app | vercel env add NEXTAUTH_URL production

echo.
echo ✅ Environment variables updated!
echo.
echo 🚀 Now redeploying to production...
vercel --prod

echo.
echo ✅ Deployment complete!
echo 📋 Test login at: https://animal-biotech-website.vercel.app/admin/login
echo 🔑 Credentials: admin@senbio.tech / admin123
