const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySetup() {
  console.log('🔍 Verifying Supabase Setup...\n');

  // Check storage buckets
  console.log('📦 Checking storage buckets...');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

  if (bucketsError) {
    console.error('❌ Error fetching buckets:', bucketsError.message);
  } else {
    const receiptsBucket = buckets.find(b => b.name === 'receipts');
    const uploadsBucket = buckets.find(b => b.name === 'uploads');

    if (receiptsBucket) {
      console.log('✅ receipts bucket exists');
      console.log(`   - Public: ${receiptsBucket.public}`);
    } else {
      console.log('❌ receipts bucket NOT found');
      console.log('   👉 Create it manually in Supabase Dashboard > Storage');
      console.log('   👉 Make it PUBLIC');
    }

    if (uploadsBucket) {
      console.log('✅ uploads bucket exists');
      console.log(`   - Public: ${uploadsBucket.public}`);
    } else {
      console.log('❌ uploads bucket NOT found');
      console.log('   👉 Create it manually in Supabase Dashboard > Storage');
      console.log('   👉 Make it PUBLIC');
    }
  }

  // Check database tables
  console.log('\n📋 Checking database tables...');

  const tables = ['users', 'receipts', 'files', 'subscriptions'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log(`❌ ${table} table NOT found`);
      } else {
        console.log(`⚠️  ${table} table exists but got error: ${error.message}`);
      }
    } else {
      console.log(`✅ ${table} table exists`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📌 Summary:');
  console.log('='.repeat(60));
  console.log('');
  console.log('If you see ❌ above, you need to:');
  console.log('');
  console.log('1️⃣  Create Storage Buckets:');
  console.log('   • Go to https://supabase.com/dashboard');
  console.log('   • Navigate to Storage');
  console.log('   • Create "receipts" bucket (make it PUBLIC)');
  console.log('   • Create "uploads" bucket (make it PUBLIC)');
  console.log('');
  console.log('2️⃣  Create Database Tables:');
  console.log('   • Go to SQL Editor in Supabase Dashboard');
  console.log('   • Copy and paste content from: lib/supabase/schema.sql');
  console.log('   • Run the SQL');
  console.log('');
  console.log('🚀 After fixing, run this script again to verify!');
}

verifySetup().catch(console.error);
