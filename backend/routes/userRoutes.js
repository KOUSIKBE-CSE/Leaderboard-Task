const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ClaimHistory = require('../models/ClaimHistory');

/**
 * GET /api/users
 * Fetch all users with optional sorting, search, and filtering by minimum points.
 * Query Parameters:
 * - sortBy: 'totalPoints' (default), 'latest' (lastClaimedAt), or 'name'
 * - search: substring to filter user names (case-insensitive)
 * - minPoints: minimum totalPoints (number, default 0)
 */
router.get('/', async (req, res) => {
  try {
    // Destructure and set defaults for query params
    const { sortBy = 'totalPoints', search = '', minPoints = 0 } = req.query;

    // Build query object for MongoDB find
    let query = {
      name: { $regex: search, $options: 'i' },        // case-insensitive partial match
      totalPoints: { $gte: parseInt(minPoints) },      // filter users with points >= minPoints
    };

    // Map sort keys to MongoDB sort objects
    const sortOptions = {
      totalPoints: { totalPoints: -1 }, // Descending total points (default)
      latest: { lastClaimedAt: -1 },    // Most recent claim first
      name: { name: 1 },                // Alphabetical order by name
    };

    // Find users matching query and sort accordingly
    const users = await User.find(query).sort(sortOptions[sortBy] || { totalPoints: -1 });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/users/add
 * Add a new user.
 * Body:
 *  - name: string (required)
 */
router.post('/add', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const newUser = new User({ name: name.trim() });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/users/claim/:userId
 * Claim random points for a user with a cooldown period.
 * Params:
 *  - userId: MongoDB ObjectId of the user
 */
router.post('/claim/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Cooldown logic: 1 minute cooldown before next claim
    const cooldownMinutes = 1;
    if (
      user.lastClaimedAt &&
      Date.now() - user.lastClaimedAt.getTime() < cooldownMinutes * 60 * 1000
    ) {
      return res.status(429).json({ error: 'Claim cooldown active' });
    }

    // Generate random points between 1 and 10
    const randomPoints = Math.floor(Math.random() * 10) + 1;

    // Update user's total points and last claim timestamp
    user.totalPoints += randomPoints;
    user.lastClaimedAt = new Date();
    await user.save();

    // Save claim to history collection
    const claim = new ClaimHistory({ userId, points: randomPoints });
    await claim.save();

    res.json({ user, claim });
  } catch (error) {
    console.error('Error claiming points:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/users/history/:userId
 * Fetch claim history for a given user, sorted by most recent claim first.
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const history = await ClaimHistory.find({ userId: req.params.userId }).sort({ claimedAt: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching claim history:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
