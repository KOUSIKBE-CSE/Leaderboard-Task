const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/users');

const app = express();

// Use environment variable PORT or default to 5000
const PORT = process.env.PORT || 5000;

// Enable CORS to allow requests from frontend origins
app.use(cors());

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/leaderboard-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Use modularized routes for users API
app.use('/api/users', userRoutes);

// Start the server and listen on specified PORT
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
