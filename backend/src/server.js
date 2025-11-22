const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = 3000;

// 1. Connect to Database
connectDB();

// 2. Middleware
app.use(cors());
app.use(bodyParser.json());

// 3. Routes
app.use('/api/auth', require('./routes/auth'));   // For Login/Signup
app.use('/api/habits', require('./routes/habits')); // For Habits (MongoDB)

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});