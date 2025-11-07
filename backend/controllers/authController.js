const User = require('../models/user');
const jwt = require('jsonwebtoken');
const ADMIN_EMAILS = ['2023aspire194@gmail.com', 'mishragargi375@gmail.com'];

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    const user = new User({ name, email, password, role, phone, address });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // if (!user) return res.status(400).json({ error: 'Invalid credentials' });
     if (!user || user.status !== 'active') {
      return res.status(403).json({ error: 'Account is inactive or deleted' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    let role = user.role; 
    if (ADMIN_EMAILS.includes(email)) role = 'admin';

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
