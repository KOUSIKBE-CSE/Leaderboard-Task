const mongoose = require('mongoose');
const User = require('./models/User');
const ClaimHistory = require('./models/ClaimHistory');

mongoose.connect('mongodb://localhost:27017/leaderboard-app')
  .then(async () => {
    console.log('Connected to DB');

    await User.deleteMany({});
    await ClaimHistory.deleteMany({});

    console.log('✅ All users and history cleared!');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('DB error:', err);
  });
