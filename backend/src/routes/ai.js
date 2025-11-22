require('dotenv').config();
const express = require('express');
const router = express.Router();
const OpenAI = require('openai'); 
require('dotenv').config();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post('/suggest-habits', async (req, res) => {
    const { goal } = req.body;

    if (!goal) {
        return res.status(400).json({ error: 'Goal is required' });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful habit coach. 
                    When given a goal, suggest exactly 3 short, actionable daily habits.
                    Return the result strictly as a JSON object with a key "suggestions" containing an array of strings.
                    Example: { "suggestions": ["Drink 2L water", "Run 10 mins", "Sleep by 10pm"] }`
                },
                {
                    role: "user",
                    content: `My goal is: "${goal}"`
                }
            ],
            temperature: 0.7,
        });

        // Extract the text content
        const content = completion.choices[0].message.content;
        
        // Parse the JSON string into a JavaScript object
        const parsedData = JSON.parse(content);

        // Send it back to frontend
        res.json(parsedData); // structure is { suggestions: [...] }

    } catch (err) {
        console.error("OpenAI Error:", err);
        
        // If OpenAI errors (e.g., Quota exceeded), send a readable error
        res.status(500).json({ 
            error: 'Failed to get suggestions', 
            details: err.message 
        });
    }
});

module.exports = router;