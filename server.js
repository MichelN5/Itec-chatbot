require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ AstraDB config
const ASTRA_TOKEN = process.env.ASTRA_TOKEN;
const ASTRA_VECTOR_BASE = process.env.ASTRA_VECTOR_BASE;

// ✅ Langflow DB path
const LANGFLOW_DB_PATH = process.env.LANGFLOW_DB_PATH;

// --- AstraDB Functions ---

async function findDocumentsBySession(sessionId) {
    console.log(`🔍 Searching AstraDB for session_id: ${sessionId}`);

    const resp = await fetch(ASTRA_VECTOR_BASE, {
        method: 'POST',
        headers: {
            'X-Cassandra-Token': ASTRA_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            find: {
                filter: { session_id: sessionId },
                options: { limit: 100 }
            }
        })
    });

    console.log(`📡 AstraDB search status: ${resp.status}`);

    if (!resp.ok) {
        const text = await resp.text();
        console.error(`❌ AstraDB search error: ${text}`);
        throw new Error(`AstraDB search failed: ${text}`);
    }

    const data = await resp.json();
    const docIds = data?.data?.documents?.map(item => item._id) || [];
    console.log(`✅ Found ${docIds.length} documents in AstraDB`);

    return docIds;
}

async function deleteDocuments(docIds) {
    console.log(`🗑️ Deleting ${docIds.length} documents from AstraDB`);

    const resp = await fetch(ASTRA_VECTOR_BASE, {
        method: 'POST',
        headers: {
            'X-Cassandra-Token': ASTRA_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            deleteMany: {
                filter: { _id: { $in: docIds } }
            }
        })
    });

    console.log(`📡 AstraDB delete status: ${resp.status}`);

    if (!resp.ok) {
        const text = await resp.text();
        console.error(`❌ AstraDB delete error: ${text}`);
        throw new Error(`AstraDB delete failed: ${text}`);
    }

    const data = await resp.json();
    console.log(`✅ AstraDB delete response:`, JSON.stringify(data, null, 2));
    return data;
}

// --- Langflow SQLite Function ---

function deleteFromLangflowDB(sessionId) {
    return new Promise((resolve, reject) => {
        console.log('🔍 Connecting to Langflow SQLite DB at:', LANGFLOW_DB_PATH);

        const db = new sqlite3.Database(LANGFLOW_DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error('❌ Failed to open Langflow DB:', err.message);
                return reject(err);
            }
            console.log('✅ Langflow DB connection opened successfully');
        });

        const query = `DELETE FROM message WHERE session_id = ?`;
        console.log('🗑️ Executing SQL query:', query);
        console.log('➡️ With session_id:', sessionId);

        db.run(query, [sessionId], function (err) {
            if (err) {
                console.error('❌ SQL DELETE error:', err.message);
                db.close(() => console.log('🔒 Langflow DB connection closed (after error)'));
                return reject(err);
            }

            console.log(`✅ SQL DELETE executed. Rows deleted: ${this.changes}`);

            db.close((closeErr) => {
                if (closeErr) {
                    console.error('❌ Error closing Langflow DB:', closeErr.message);
                    return reject(closeErr);
                }
                console.log('🔒 Langflow DB connection closed successfully');
                resolve(this.changes);
            });
        });
    });
}

// --- API Endpoint ---

app.post('/clear-memory', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Missing email' });
    }

    try {
        console.log(`🚀 Starting memory clear process for: ${email}`);

        // ✅ AstraDB deletion
        const docIds = await findDocumentsBySession(email);
        let astraDeleted = 0;

        if (docIds.length > 0) {
            await deleteDocuments(docIds);
            astraDeleted = docIds.length;
            console.log('✅ AstraDB memory cleared');
        } else {
            console.log('ℹ️ No AstraDB memory found for this session');
        }

        // ✅ Langflow local DB deletion
        const langflowDeleted = await deleteFromLangflowDB(email);

        // ✅ Response
        res.json({
            message: 'Memory cleared successfully',
            astra_deleted: astraDeleted,
            langflow_deleted: langflowDeleted
        });

    } catch (error) {
        console.error('❌ Final Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// --- Start server ---
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log('POST /clear-memory to clear chatbot memory by session_id (email)');
});
