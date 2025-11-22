const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 Setting up database...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', serviceRoleKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('\n❌ Missing credentials in .env.local');
  process.exit(1);
}

// Create admin client
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  console.log('\n🔍 Testing connection...');

  // Try to query the users table (it may not exist yet)
  const { data, error } = await supabase
    .from('users')
    .select('count')
    .limit(1);

  if (error) {
    if (error.message.includes('does not exist')) {
      console.log('✅ Connected! (Tables don\'t exist yet - this is expected)');
      return true;
    }
    console.log('❌ Connection error:', error.message);
    return false;
  }

  console.log('✅ Connected! Tables already exist.');
  return true;
}

async function setupDatabase() {
  const connected = await testConnection();

  if (!connected) {
    console.log('\n⚠️  Could not connect. Please set up manually:');
    console.log('1. Open: https://supabase.com/dashboard/project/yzwnfmjhatedcbhltmde/sql/new');
    console.log('2. Copy the SQL from: lib/supabase/schema.sql');
    console.log('3. Paste and run it in the SQL editor');
    return;
  }

  console.log('\n📝 Database connection successful!');
  console.log('\n⚠️  Note: Supabase JavaScript client cannot execute DDL (CREATE TABLE) statements.');
  console.log('You need to run the schema manually in the Supabase SQL Editor.\n');
  console.log('Steps:');
  console.log('1. Go to: https://supabase.com/dashboard/project/yzwnfmjhatedcbhltmde/sql/new');
  console.log('2. Copy ALL the SQL from the file: lib/supabase/schema.sql');
  console.log('3. Paste it into the SQL Editor');
  console.log('4. Click "Run" button');
  console.log('\n💡 The SQL file is already in your project at:');
  console.log('   ' + path.join(__dirname, 'lib', 'supabase', 'schema.sql'));
}

setupDatabase();
