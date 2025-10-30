const express = require('express');
const booking = require('../models/booking')
const { createBooking, getBookingsByCustomer, getBookingsByProvider } = require('../controllers/bookingController');
const router = express.Router();



router.post('/', createBooking);
router.get('/customer/:customerId', getBookingsByCustomer);
router.get('/provider/:providerId', getBookingsByProvider);
router.get('/customer/:id', async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.params.id })
      .populate({
        path: 'provider',
        populate: {
          path: 'user', 
          model: 'User'
        }
      })

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/status/:bookingId', async (req, res) => {
  try {
    const updated = await booking.findByIdAndUpdate(
      req.params.bookingId,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.log("Patch error:", err); 
    res.status(500).json({ error: 'Failed to update status', detail: err.message });
  }
});

router.get('/provider/:providerId', async (req, res) => {
  try {
    const providerBookings = await booking.find({ provider: req.params.providerId })
      .populate('customer', 'name phone');
      console.log('Bookings:', providerBookings.length, providerBookings);
    res.json(providerBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const bookings = await booking.find()
      .populate('customer', 'name email')
      .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email' }
      });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
