const express = require('express');
const router = express.Router();

// The Grok API uses an OpenAI-compatible endpoint
const GROK_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;
        const grokApiKey = process.env.GROK_API_KEY;

        if (!grokApiKey) {
            console.error('GROK_API_KEY is not configured in environment variables');
            return res.status(500).json({ error: 'AI service is not configured.' });
        }

        // Create the prompt for Grok
        const prompt = `Please provide a concise summary of the following question and its details:\n\nTitle: ${title}\n\nContent: ${content}`;

        // Send the request to Grok
        const response = await fetch(GROK_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${grokApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192', // A fast and capable model from Grok
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert summarizer for a learning platform.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Grok API error:', errorData);
            throw new Error(`Grok API error! status: ${response.status} - ${errorData.error.message}`);
        }

        const data = await response.json();
        
        // Extract the summary from the response
        const summary = data.choices[0]?.message?.content;

        if (!summary) {
            throw new Error('No summary content found in Grok response.');
        }

        res.json({ summary });

    } catch (error) {
        console.error('Error generating AI summary:', error);
        res.status(500).json({ error: 'Failed to generate AI summary' });
    }
});

module.exports = router;