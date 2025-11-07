const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/update-password', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const match = await user.comparePassword(currentPassword);
    if (!match) return res.status(400).json({ error: "Current password incorrect" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload-photo', upload.single('photo'), async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const imagePath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(userId, { profileImage: imagePath }, { new: true });
    res.json({ profileImage: user.profileImage });
  } catch {
    res.status(500).json({ error: "Photo upload failed" });
  }
});

router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.patch('/:userId/status', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'inactive' },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User deactivated (inactive) successfully.', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});


module.exports = router;
