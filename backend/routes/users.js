const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ClaimHistory = require('../models/ClaimHistory');

/**
 * GET /api/users
 * Fetch all users with optional sorting and search filtering.
 * Query params:
 *  - sortBy: 'name' or 'totalPoints' (default: 'totalPoints')
 *  - search: string to filter user names (case-insensitive)
 */
router.get('/', async (req, res) => {
  try {
    const { sortBy = 'totalPoints', search = '' } = req.query;

    // Find users matching name search (case-insensitive)
    const users = await User.find({
      name: { $regex: search, $options: 'i' },
    }).sort(sortBy === 'name' ? { name: 1 } : { totalPoints: -1 });

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

    // Create and save new user
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
 * Claim random points for a user, with a cooldown period.
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

    // Update user points and last claim time
    user.totalPoints += randomPoints;
    user.lastClaimedAt = new Date();
    await user.save();

    // Save claim history record
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
 * Fetch claim history for a specific user.
 * Params:
 *  - userId: MongoDB ObjectId of the user
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const history = await ClaimHistory.find({ userId: req.params.userId }).sort({
      claimedAt: -1,
    });
    res.json(history);
  } catch (error) {
    console.error('Error fetching claim history:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/users/reset
 * Reset all users' points and claim history.
 */
router.post('/reset', async (req, res) => {
  try {
    // Reset totalPoints and lastClaimedAt fields for all users
    await User.updateMany({}, { $set: { totalPoints: 0, lastClaimedAt: null } });
    // Delete all claim history records
    await ClaimHistory.deleteMany({});

    // Optionally return updated users for frontend update
    const updatedUsers = await User.find({});
    res.json({ message: 'Leaderboard reset successful.', users: updatedUsers });
  } catch (error) {
    console.error('Error resetting leaderboard:', error);
    res.status(500).json({ error: 'Failed to reset leaderboard.' });
  }
});

module.exports = router;
