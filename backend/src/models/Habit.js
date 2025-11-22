const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { type: String, required: true },
    streak: { type: Number, default: 0 },

    target: { type: Number, default: 1 },   
    dailyProgress: { type: Number, default: 0 },

    lastCompleted: { type: String, default: null } 
});

module.exports = mongoose.model('Habit', habitSchema);