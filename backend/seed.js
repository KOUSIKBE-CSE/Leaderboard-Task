const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/leaderboard-app')
  .then(async () => {
    console.log('Connected to MongoDB');

    await User.deleteMany({}); // Clear existing users

    const names = ['Rahul', 'Kamal', 'Sanak', 'Priya', 'Karthik', 'Anu', 'Vishal', 'Meera', 'Arjun', 'Divya'];
    const users = names.map(name => ({ name, totalPoints: 0, lastClaimedAt: null }));

    await User.insertMany(users);

    console.log('✅ Seeded 10 users successfully');
    process.exit();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
