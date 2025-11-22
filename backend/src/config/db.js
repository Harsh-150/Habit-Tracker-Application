const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/habit-tracker');
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Database Connection Error:', err.message);
        process.exit(1); // Stop the server if DB fails
    }
};

module.exports = connectDB;