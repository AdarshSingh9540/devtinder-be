const express = require('express');
const router = express.Router();
const User = require('../model/userModel');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 
    res.status(200).json({ message: 'User profile', user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, age } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.age = age || user.age;

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
});

module.exports = router;
