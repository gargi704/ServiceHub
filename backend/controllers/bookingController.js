const Booking = require('../models/booking');
const User = require('../models/user'); 
const Provider = require('../models/provider');
const twilio = require('twilio');
const nodemailer = require('nodemailer');

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();

    console.log('Booking saved:', booking);

    // Pehle Provider fetch karo and populate user
    const providerEntry = await Provider.findById(booking.provider).populate('user', 'email phone name');
    if (!providerEntry || !providerEntry.user) {
      console.error('Provider or user not found!');
      return res.status(404).json({ error: 'Provider or user not found' });
    }
    const providerUser = providerEntry.user;

    console.log('Sending email and SMS to:', providerUser.email, providerUser.phone);

    // Email setup and sending
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_APP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: providerUser.email,
      subject: 'New Booking Received',
      text: `Hello ${providerUser.name},\nYou have a new booking on ${booking.date.toDateString()} at ${booking.time}.\nAddress: ${booking.address}\nPlease check your dashboard for details.`,
    };

    await transporter.sendMail(mailOptions)
      .then(info => console.log('Email sent:', info.response))
      .catch(err => console.error('Email error:', err));

    // SMS Notification via Twilio
    await twilioClient.messages
      .create({
        body: `Hi ${providerUser.name}, new booking on ${booking.date.toDateString()} at ${booking.time}. Address: ${booking.address}.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: providerUser.phone,
      })
      .then(message => console.log('SMS sent, SID:', message.sid))
      .catch(err => console.error('SMS error:', err));

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Booking create error:', error);
    res.status(400).json({ error: error.message });
  }
};




exports.getBookingsByCustomer = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.params.customerId })
      .populate({
        path: 'provider',
        populate: {
          path: 'user',
          model: 'User'
        }
      });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getBookingsByProvider = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.params.providerId }).populate('customer', 'name phone email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
