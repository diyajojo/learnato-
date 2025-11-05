const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check if API key is configured
if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not configured in environment variables');
}

router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Create prompt
        const prompt = `Please provide a concise summary of the following question and its details:\n\nTitle: ${title}\n\nContent: ${content}`;

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        res.json({ summary });
    } catch (error) {
        console.error('Error generating AI summary:', error);
        res.status(500).json({ error: 'Failed to generate AI summary' });
    }
});

module.exports = router;