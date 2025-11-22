const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { type: String, required: true },
    streak: { type: Number, default: 0 },
    
    // --- NEW FIELDS ---
    target: { type: Number, default: 1 },        // e.g., 8 (for water)
    dailyProgress: { type: Number, default: 0 }, // e.g., 3 (so far)
    // ------------------

    lastCompleted: { type: String, default: null } // YYYY-MM-DD
});

module.exports = mongoose.model('Habit', habitSchema);