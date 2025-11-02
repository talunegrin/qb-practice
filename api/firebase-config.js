// Vercel Serverless Function to serve Firebase config
// This reads from Vercel environment variables and returns config to the client

export default function handler(req, res) {
    // Enable CORS for your domain (adjust as needed)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    
    // Read Firebase config from Vercel environment variables
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };
    
    // Validate that all required config values are present
    const missingKeys = [];
    Object.entries(firebaseConfig).forEach(([key, value]) => {
        if (!value) {
            missingKeys.push(key);
        }
    });
    
    if (missingKeys.length > 0) {
        res.status(500).json({ 
            error: 'Firebase configuration incomplete',
            missing: missingKeys,
            message: 'Please set all required environment variables in Vercel'
        });
        return;
    }
    
    // Return the config
    res.status(200).json(firebaseConfig);
}
