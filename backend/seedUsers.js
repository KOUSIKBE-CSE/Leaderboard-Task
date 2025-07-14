const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const names = ['Rahul', 'Kamal', 'Sanak', 'Amit', 'Deepak', 'Pooja', 'Meena', 'Vikram', 'Nisha', 'Manish'];

  await User.deleteMany({});
  for (let name of names) {
    await new User({ name }).save();
  }
  console.log('Users seeded successfully');
  process.exit();
});
