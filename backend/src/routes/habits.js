const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

const getUserId = (req, res, next) => {
    const userId = req.headers['user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    req.userId = userId;
    next();
};

router.use(getUserId);

// 1. GET
router.get('/', async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.userId });
        
        const today = new Date().toISOString().split('T')[0];
        const updatedHabits = habits.map(h => {
            if (h.lastCompleted !== today) {
                h.dailyProgress = 0;
            }
            return h;
        });
        
        res.json(updatedHabits);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. POST (accepts 'target')
router.post('/', async (req, res) => {
    const { name, target } = req.body; 
    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        const newHabit = new Habit({
            user: req.userId,
            name: name,
            target: target || 1,
            dailyProgress: 0
        });
        await newHabit.save();
        res.status(201).json(newHabit);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save habit' });
    }
});

// 3. PATCH 
router.patch('/:id/complete', async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });
        if (!habit) return res.status(404).json({ error: 'Habit not found' });

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (habit.lastCompleted !== today) {
            habit.dailyProgress = 0; 
            habit.lastCompleted = today; 
        }

        if (habit.dailyProgress >= habit.target) {
             return res.json({ message: 'Target already met!', habit });
        }

        habit.dailyProgress += 1;

        if (habit.dailyProgress === habit.target) {
            habit.streak += 1; 
        }

        await habit.save();
        res.json(habit);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 4. DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Habit.findOneAndDelete({ _id: req.params.id, user: req.userId });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;