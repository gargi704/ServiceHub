const Booking = require('../models/booking');

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
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
    const bookings = await Booking.find({ provider: req.params.providerId }).populate('customer', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
