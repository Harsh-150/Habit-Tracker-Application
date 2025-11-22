const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

// 1. Signup
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully!' });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// 2. Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials (User not found)' });
        }

        if (user.password !== password) {
            return res.status(400).json({ error: 'Invalid credentials (Wrong password)' });
        }

        res.json({ 
            message: 'Login successful!', 
            user: { id: user._id, username: user.username } 
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

module.exports = router;