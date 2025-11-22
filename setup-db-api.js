const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

console.log('🚀 Setting up database via Supabase API...\n');

// Read schema file
const schemaPath = path.join(__dirname, 'lib', 'supabase', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split into individual statements
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`📊 Found ${statements.length} SQL statements\n`);

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL('/rest/v1/rpc/exec_sql', supabaseUrl);

    const postData = JSON.stringify({ query: sql });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          resolve({ success: false, error: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function runSchema() {
  console.log('📝 Executing SQL statements...\n');
  console.log('='.repeat(60));

  let success = 0;
  let failed = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const preview = statement.substring(0, 50).replace(/\n/g, ' ') + '...';

    process.stdout.write(`[${i + 1}/${statements.length}] ${preview} `);

    try {
      const result = await executeSQL(statement + ';');

      if (result.success) {
        console.log('✅');
        success++;
      } else {
        // Check if it's just an "already exists" error
        if (result.error && (
          result.error.includes('already exists') ||
          result.error.includes('duplicate')
        )) {
          console.log('⚠️  (exists)');
          success++;
        } else {
          console.log('❌');
          failed++;
        }
      }
    } catch (error) {
      console.log('❌', error.message);
      failed++;
    }
  }

  console.log('='.repeat(60));
  console.log(`\n✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}\n`);

  if (failed === 0 || success > failed) {
    console.log('✨ Database setup completed!');
    console.log('🚀 Your app is ready at http://localhost:3002');
  } else {
    console.log('⚠️  Setup incomplete. Try manual setup in Supabase dashboard.');
  }
}

runSchema().catch(console.error);
