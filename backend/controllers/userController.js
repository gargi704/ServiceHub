const User = require('../models/user');

exports.updateUserName = async (req, res) => {
  const { userId, name } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { name }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user name' });
  }
};
