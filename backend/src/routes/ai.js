require('dotenv').config();
const express = require('express');
const router = express.Router();
const OpenAI = require('openai'); 

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

        const content = completion.choices[0].message.content;
        
        const parsedData = JSON.parse(content);

        res.json(parsedData); 

    } catch (err) {
        console.error("OpenAI Error:", err);
        
        res.status(500).json({ 
            error: 'Failed to get suggestions', 
            details: err.message 
        });
    }
});

module.exports = router;