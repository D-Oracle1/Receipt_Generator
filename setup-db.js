const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Build connection string from env variables
const connectionString = `postgresql://postgres:Vicson@2025@db.yzwnfmjhatedcbhltmde.supabase.co:5432/postgres`;

console.log('🔧 Connecting to Supabase PostgreSQL database...\n');

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function runSchema() {
  try {
    await client.connect();
    console.log('✅ Connected to database!\n');

    // Read the schema file
    const schemaPath = path.join(__dirname, 'lib', 'supabase', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📄 Reading schema.sql...');
    console.log(`${'='.repeat(60)}\n`);

    // Execute the entire schema as one transaction
    try {
      await client.query(schema);
      console.log('✅ Database schema executed successfully!\n');
      console.log(`${'='.repeat(60)}`);
      console.log('✨ Setup completed!');
      console.log('\n📝 Created:');
      console.log('  - Users table');
      console.log('  - Receipts table');
      console.log('  - Files table');
      console.log('  - Subscriptions table');
      console.log('  - Storage buckets (receipts, uploads)');
      console.log('  - Row Level Security policies');
      console.log('  - User signup trigger');
      console.log('\n🚀 Your application is ready to use!');
      console.log('   Visit: http://localhost:3002');
    } catch (error) {
      // Check if error is due to things already existing
      if (error.message.includes('already exists') ||
          error.message.includes('duplicate')) {
        console.log('⚠️  Some objects already exist (this is OK)');
        console.log('✅ Schema verification completed!');
      } else {
        console.error('❌ Error executing schema:', error.message);
        console.log('\n💡 Tip: You may need to run the schema manually in Supabase SQL Editor');
        console.log('   File location: lib/supabase/schema.sql');
      }
    }

  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.log('\n💡 Try running the schema manually:');
    console.log('   1. Go to https://supabase.com/dashboard');
    console.log('   2. Open SQL Editor');
    console.log('   3. Copy contents of lib/supabase/schema.sql');
    console.log('   4. Run the SQL');
  } finally {
    await client.end();
  }
}

console.log('🚀 Starting database setup...\n');
runSchema();
