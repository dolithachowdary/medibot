import { MongoClient, GridFSBucket } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.warn('⚠️ MONGODB_URI is missing in .env. MongoDB features will be disabled.');
}

const client = new MongoClient(uri || 'mongodb://localhost:27017/medibot');
let bucket;

export async function connectMongo() {
    if (!uri) return;
    try {
        await client.connect();
        const db = client.db(); // Uses 'medibot' from the URI
        bucket = new GridFSBucket(db, { bucketName: 'uploads' });
        console.log('✅ Connected to MongoDB (GridFS)');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
    }
}

export function getBucket() {
    if (!bucket) throw new Error('MongoDB bucket not initialized. Call connectMongo first.');
    return bucket;
}

/**
 * Upload a file buffer to MongoDB GridFS.
 * Returns the file ID.
 */
export async function uploadToMongo(fileBuffer, fileName, mimeType) {
    const b = getBucket();
    return new Promise((resolve, reject) => {
        const uploadStream = b.openUploadStream(fileName, {
            contentType: mimeType,
            metadata: {
                originalName: fileName,
                uploadedAt: new Date()
            }
        });

        uploadStream.end(fileBuffer);

        uploadStream.on('finish', () => {
            console.log(`✅ File uploaded to MongoDB: ${uploadStream.id}`);
            resolve(uploadStream.id);
        });
        uploadStream.on('error', (err) => {
            console.error('❌ MongoDB Upload Error:', err);
            reject(err);
        });
    });
}
