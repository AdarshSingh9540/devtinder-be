const express = require('express');
const router = express.Router();
const User = require('../model/userModel');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile/view', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 
    res.status(200).json({ message: 'User profile', user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

router.patch('/profile/update', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, age, gender, email, password } = req.body; 
    if (email !== undefined || password !== undefined) {
      return res.status(400).json({ message: 'Email and password updates are not allowed' });
    }

    if (firstName === undefined && lastName === undefined && age === undefined && gender === undefined) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
});

module.exports = router;
