const Review = require('../models/review');
const Provider = require('../models/provider');

exports.createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();

    // Provider की avg rating और total reviews update करो
    const allReviews = await Review.find({ provider: review.provider });
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await Provider.findByIdAndUpdate(review.provider, {
      rating: avg,
    });

    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getReviewsByProvider = async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId }).populate('customer', 'name');
    const total = reviews.length;
    const avg = total ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : 0;
    // Count per star
    const breakdown = [5,4,3,2,1].map(star => ({
      stars: star,
      count: reviews.filter(r => r.rating === star).length
    }));
    res.json({ reviews, average: avg, total, breakdown });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
