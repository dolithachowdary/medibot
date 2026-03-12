import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import sql from '../db.js';
import { uploadToS3 } from '../s3.js';
import { generateEmbedding } from '../embeddings.js';
import { uploadToMongo, getBucket } from '../mongodb.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 },
});

// Serve files from MongoDB GridFS
router.get('/file/:id', async (req, res) => {
    try {
        const bucket = getBucket();
        const id = new ObjectId(req.params.id);
        
        const files = await bucket.find({ _id: id }).toArray();
        if (!files.length) return res.status(404).send('File not found');

        res.setHeader('Content-Type', files[0].contentType || 'application/octet-stream');
        const downloadStream = bucket.openDownloadStream(id);
        downloadStream.pipe(res);
    } catch (err) {
        console.error('File fetch error:', err);
        res.status(500).send('Error retrieving file');
    }
});

async function logToFile(msg) {
    const logPath = path.join(process.cwd(), 'server', 'debug.log');
    const timestamp = new Date().toISOString();
    try {
        await fs.appendFile(logPath, `[${timestamp}] ${msg}\n`);
    } catch (e) {
        console.error('Failed to write to log file', e);
    }
}

const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = "You are a medical AI assistant generating patient-friendly reports.";

const REPORT_PROMPT = `
You are a highly empathetic AI health assistant.

Analyze the lab report text and create a comprehensive, patient-friendly report using the following structure.

GUIDELINES:
- Use bullet points for summaries and explanations.
- The "Brief" should be a warm, 2-sentence greeting and high-level takeaway.
- The "Purpose" should explain WHY this specific test (e.g., TSH, CBC) is important for health.
- For EVERY finding, provide a "What this means" explanation that is encouraging but accurate. 
- Avoid medical jargon; if you use a medical term, explain it simply.
- If the report shows abnormalities, use a gentle tone to suggest seeing a doctor.

Return a JSON object:
{
  "report_name": "Clear, friendly name of the report",
  "report_date": "YYYY-MM-DD",
  "brief": "A warm overview for the patient.",
  "purpose": "A bulleted explanation of why this test is performed.",
  "overall_status": "Normal / Needs Attention / Action Required",
  "summary": "A friendly, bulleted summary of the main takeaways.",
  "findings": [
    {
      "name": "Full name of the lab marker",
      "value": "Numeric value",
      "unit": "Unit (e.g. g/dL)",
      "reference_range": "Normal range (e.g. 13.5-17.5)",
      "status": "Normal / High / Low / Critical",
      "explanation": "A detailed, friendly bullet point on what this specific value means for the patient's health."
    }
  ],
  "recommendations": ["Friendly action step 1", "Friendly action step 2"],
  "disclaimer": "This is an AI summary. Always discuss your lab results with your doctor for proper diagnosis."
}

Lab Report Text:
---
{TEXT}
---
`;

/**
 * Send extracted text to Groq LLM (Llama 3.3 70b).
 */
async function analyseExtractedText(text, patient = {}) {
    // Inject patient context into the text if available so the AI knows who it's for.
    const patientCtx = patient.name
        ? `Patient: ${patient.name}, Age: ${patient.age || '?'}, Gender: ${patient.gender || '?'}, Conditions: ${(patient.conditions || []).join(', ') || 'None'}.\n`
        : '';

    const prompt = REPORT_PROMPT.replace('{TEXT}', patientCtx + text);

    const res = await fetch(GROQ_API, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            max_tokens: 1200,
            temperature: 0.2,
            response_format: { type: 'json_object' },
        }),
    });

    const data = await res.json();
    if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
    }

    const raw = data.choices?.[0]?.message?.content || '{}';
    return JSON.parse(raw);
}

/**
 * Handle universal extraction (PDF/Images) via Gemini API.
 */
async function extractWithGemini(fileBuffer, mimeType, originalName) {
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

    const base64Data = fileBuffer.toString('base64');

    await logToFile(`Sending ${originalName} (${mimeType}) to Gemini Flash for extraction...`);

    const prompt = `You are an expert medical data extractor. 
Please carefully read this user-uploaded file (it could be a lab report, prescription, or medical summary in either PDF or image format).
Extract all visible text, numbers, dates, lab names, test results, and reference ranges.
Preserve the structure and context as much as possible so the data can be analyzed by a downstream system.
Do not hallucinate or add any medical advice. Just extract the contents accurately.`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Data
                            }
                        }
                    ]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Gemini Extraction Error");
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
        await logToFile(`GEMINI API ERROR: ${error.message}`);
        throw new Error(`Gemini Extraction Failed: ${error.message}`);
    }
}

// ── POST /api/upload/report ───────────────────────────────────────────────────
router.post('/report', upload.single('report'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { mimetype, originalname, buffer } = req.file;

    try {
        await logToFile(`--- New Upload: ${originalname} (${mimetype}) ---`);
        let extractedText = '';

        // Stage 1: Multimodal Extraction via Gemini
        await logToFile(`Starting Gemini extraction...`);
        extractedText = await extractWithGemini(buffer, mimetype, originalname);

        await logToFile(`Extraction complete. Length: ${extractedText?.length || 0}`);

        if (!extractedText || extractedText.trim().length < 5) {
            await logToFile('FAILED: Gemini extraction returned empty or too short text.');
            throw new Error('Could not extract meaningful text from the file. The document might be empty or unreadable.');
        }

        // Stage 2: Structured Generation via Groq (Llama 3.3)
        await logToFile(`Sending extracted text to Groq for structured JSON generation...`);

        let patient = {};
        try { patient = JSON.parse(req.body.patient || '{}'); } catch { }

        const report = await analyseExtractedText(extractedText, patient);
        await logToFile(`Analysis result for user ${patient.id || 'ANONYMOUS'}: ${report?.report_name || 'Generic'}`);

        // Stage 3: Storage (MongoDB GridFS) & Embeddings
        let fileUrl = null;
        let embedding = null;

        if (patient.id) {
            try {
                await logToFile(`Uploading to MongoDB GridFS...`);
                const fileId = await uploadToMongo(buffer, originalname, mimetype);
                fileUrl = `/api/upload/file/${fileId}`;
                await logToFile(`MongoDB save success: ${fileUrl}`);

                await logToFile(`Generating embeddings...`);
                const embeddingText = `Report: ${report.report_name}. Date: ${report.report_date}. Brief: ${report.brief}. Findings: ${JSON.stringify(report.findings)}`;
                embedding = await generateEmbedding(embeddingText);
            } catch (err) {
                await logToFile(`NON-FATAL ERROR (Storage/Embeddings): ${err.message}`);
            }
        }

        // Stage 4: Persist to Database (Reports only, no chat history)
        if (patient.id) {
            await logToFile(`Attempting to save report metadata for user: ${patient.id}`);
            try {
                const markersJson = JSON.stringify(report?.findings || []);
                const reportDate = report?.report_date && !isNaN(Date.parse(report.report_date))
                    ? new Date(report.report_date)
                    : new Date();

                // Save to reports table for medical insights
                await sql`
                    INSERT INTO reports (
                        user_id, lab_name, report_date, summary, brief, purpose, file_url, markers, risk_level, embedding
                    ) VALUES (
                        ${patient.id}, ${report?.report_name || originalname}, ${reportDate}, ${report?.summary || ''}, 
                        ${report?.brief || ''}, ${report?.purpose || ''}, ${fileUrl}, ${markersJson}, ${report?.overall_status || 'Normal'},
                        ${embedding ? sql`vector(${embedding})` : null}
                    )
                `;

                await logToFile(`SUCCESS: Report metadata saved to database.`);
            } catch (dbErr) {
                await logToFile(`DATABASE ERROR: ${dbErr.message}`);
                console.error('DB Insert Error:', dbErr);
            }
        }

        res.json({ ok: true, report });

    } catch (err) {
        console.error('Analyse error:', err);
        res.status(500).json({ error: 'Failed to analyse the file: ' + err.message });
    }
});

export default router;
