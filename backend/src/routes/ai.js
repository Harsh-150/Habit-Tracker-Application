const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

require('dotenv').config();

router.post('/suggest-habits', async (req, res) => {
    const { goal } = req.body;

    // 1. Security Check: Is the key present?
    if (!process.env.GEMINI_API_KEY) {
        console.error("Error: GEMINI_API_KEY is missing in .env");
        return res.status(500).json({ error: "Server configuration error (Missing API Key)" });
    }

    if (!goal) {
        return res.status(400).json({ error: 'Goal is required' });
    }

    try {
        // 2. Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            I have a user goal: "${goal}". 
            Suggest 3 specific, short, daily habits to achieve this. 
            Return ONLY a raw JSON array of strings. Do not use Markdown formatting.
            Example format: ["Run 2km", "Drink 2L water", "Eat salad"]
        `;

        // 3. Generate Content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // 4. Cleanup & Parse (Remove ```json ... ``` wrappers if AI adds them)
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const suggestions = JSON.parse(text);

        res.json({ suggestions });

    } catch (err) {
        console.error("Gemini AI Error:", err);
        res.status(500).json({ 
            error: 'Failed to generate suggestions', 
            details: err.message 
        });
    }
});

module.exports = router;