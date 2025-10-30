const express = require('express');
const router = express.Router();
const { createReview, getReviewsByProvider } = require('../controllers/reviewController');

router.post('/', createReview);
router.get('/:providerId', getReviewsByProvider);

module.exports = router;
