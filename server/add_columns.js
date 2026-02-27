// Adds missing columns to the existing users table
import postgres from 'postgres';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const sql = postgres(process.env.VITE_DATABASE_URL, { ssl: 'require' });

async function addMissingColumns() {
    console.log('Adding missing columns...');

    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT`;
    console.log('✅ email column added');

    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT`;
    console.log('✅ password_hash column added');

    // Add unique constraint on email if not already there
    try {
        await sql`ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email)`;
        console.log('✅ email unique constraint added');
    } catch (e) {
        if (e.code === '42710') {
            console.log('ℹ️  email unique constraint already exists, skipping');
        } else {
            throw e;
        }
    }

    console.log('🎉 Done!');
    await sql.end();
}

addMissingColumns().catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
});
