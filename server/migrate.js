// Run this once to migrate the Neon DB schema
import postgres from 'postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const sql = postgres(process.env.VITE_DATABASE_URL, { ssl: 'require' });

async function migrate() {
    console.log('Running migration...');

    // Create users table with email + password_hash
    await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      height FLOAT,
      weight FLOAT,
      conditions TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
    console.log('✅ users table ready');

    // Create reports table
    await sql`
    CREATE TABLE IF NOT EXISTS reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      lab_name TEXT,
      report_date DATE,
      summary TEXT,
      markers JSONB,
      risk_level TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
    console.log('✅ reports table ready');

    // Create medications table
    await sql`
    CREATE TABLE IF NOT EXISTS medications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      dosage TEXT,
      frequency TEXT,
      start_date DATE,
      end_date DATE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
    console.log('✅ medications table ready');

    // Create chats table
    await sql`
    CREATE TABLE IF NOT EXISTS chats (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
      messages JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
    console.log('✅ chats table ready');

    console.log('🎉 Migration complete!');
    await sql.end();
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
