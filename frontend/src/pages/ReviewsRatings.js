import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Card, CardContent, Grid, Avatar, Rating, Button, Divider, Chip, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VerifiedIcon from '@mui/icons-material/Verified';
import axios from 'axios';

function ReviewsRatings() {
  const { providerId } = useParams();
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, title: '', comment: '' });
  const [allReviews, setAllReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({ average: 0, total: 0, breakdown: [] });
  const [provider, setProvider] = useState({ name: '', service: '', rating: 0, totalReviews: 0, verified: false });

  useEffect(() => {
    if (!providerId) return;
    (async () => {
      try {
        const prov = await axios.get("/api/providers/" + providerId);
        if (!prov.data || !prov.data.user) {
          setProvider({ name: '', service: '', rating: 0, totalReviews: 0, verified: false });
          return;
        }
        setProvider({
          name: prov.data.user.name,
          service: prov.data.service,
          rating: prov.data.rating,
          totalReviews: prov.data.totalJobs || 0,
          verified: true
        });
        const rev = await axios.get("/api/reviews/" + providerId);
        setAllReviews(rev.data.reviews);
        setRatingStats({
          average: parseFloat(rev.data.average),
          total: rev.data.total,
          breakdown: [5, 4, 3, 2, 1].map(st => ({
            stars: st,
            count: rev.data.breakdown.find(b => b.stars === st)?.count || 0,
            percentage: rev.data.total ? Math.round((rev.data.breakdown.find(b => b.stars === st)?.count || 0) * 100 / rev.data.total) : 0
          }))
        });
      } catch (err) {
        setProvider({ name: '', service: '', rating: 0, totalReviews: 0, verified: false });
      }
    })();
  }, [providerId, openReviewDialog]);


  const handleOpenReviewDialog = () => setOpenReviewDialog(true);
  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setNewReview({ rating: 0, title: '', comment: '' });
  };

  const handleSubmitReview = async () => {
    await axios.post("/api/reviews", {
      provider: providerId,
      customer: localStorage.getItem("userId"),
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment
    });
    handleCloseReviewDialog();
  };

  // if (!providerId) return <div>Loading...</div>;
  // if (!provider.name) return <div>Provider Not Found</div>;

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mr: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '2rem'
                  }}
                >{provider.name ? provider.name.split(' ').map(n => n[0]).join('') : "P"}</Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mr: 1 }}>
                      {provider.name}
                    </Typography>
                    {provider.verified && <Chip icon={<VerifiedIcon />} label="Verified" color="success" size="small" />}
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    {provider.service}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={ratingStats.average || 0} precision={0.1} readOnly />
                    <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                      {ratingStats.average}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({ratingStats.total} reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Button
                variant="contained"
                onClick={handleOpenReviewDialog}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 4
                }}
              >Write a Review</Button>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Rating Breakdown */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  Rating Breakdown
                </Typography>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                    {ratingStats.average}
                  </Typography>
                  <Rating value={ratingStats.average || 0} precision={0.1} readOnly size="large" />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Based on {ratingStats.total} reviews
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                {ratingStats.breakdown.map((item) => (
                  <Box key={item.stars} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" sx={{ width: 30 }}>
                      {item.stars} ⭐
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      sx={{
                        flex: 1,
                        mx: 2,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': { backgroundColor: '#667eea' }
                      }}
                    />
                    <Typography variant="body2" sx={{ width: 40, textAlign: 'right' }}>
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Reviews List */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
              Customer Reviews ({allReviews.length})
            </Typography>
            {allReviews.map((review) => (
              <Card key={review._id} elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, background: '#667eea' }}>
                        {review.customer?.name?.charAt(0) || "U"}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {review.customer?.name || "User"}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                  {review.title && <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {review.title}
                  </Typography>}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {review.comment}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      size="small"
                      startIcon={<ThumbUpIcon />}
                      sx={{ color: '#667eea' }}
                    >
                      Helpful
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Container>

      {/* Write Review Dialog */}
      <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#333' }}>
          Write a Review for {provider.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Your Rating *
            </Typography>
            <Rating
              value={newReview.rating}
              onChange={(event, newValue) => setNewReview({ ...newReview, rating: newValue })}
              size="large"
            />
            <TextField
              fullWidth
              label="Review Title"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              sx={{ mt: 3, mb: 2 }}
            />
            <TextField
              fullWidth
              label="Your Review"
              multiline
              rows={4}
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience with this service provider..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseReviewDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmitReview} variant="contained"
            disabled={!newReview.rating || !newReview.title || !newReview.comment}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </>
  );
}

export default ReviewsRatings;
