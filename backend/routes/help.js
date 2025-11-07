const express = require('express');
const router = express.Router();
const HelpQuery = require('../models/helpQuery');
const nodemailer = require('nodemailer');

// Environment variables for security
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_APP_PASS = process.env.ADMIN_APP_PASS;

// Setup transporter using Gmail SMTP details with app password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ADMIN_EMAIL,
    pass: ADMIN_APP_PASS,
  }
});

router.post('/', async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' });
  }

  try {
    // 1. Save query to DB
    await HelpQuery.create({ email, message });

    // 2. Send notification mail to admin
    await transporter.sendMail({
      from: `"ServiceHub Query" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `New Help Query from ${email}`,
      text: `You have a new help query:\n\nEmail: ${email}\nMessage: ${message}`
    });

    res.json({ success: true, message: 'Query sent successfully.' });
  } catch (error) {
    console.error('Error in help-query:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
