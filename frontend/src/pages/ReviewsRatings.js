import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Box, Typography, Card, CardContent, Grid, Avatar, Rating, Button,
  Divider, Chip, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VerifiedIcon from '@mui/icons-material/Verified';
import axios from 'axios';
import { API_BASE_URL } from '../api.js';

function ReviewsRatings() {
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
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
        const prov = await axios.get(`${API_BASE_URL}/api/providers/` + providerId);
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
        const rev = await axios.get(`${API_BASE_URL}/api/reviews/` + providerId);
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
    await axios.post(`${API_BASE_URL}/api/reviews`, {
      provider: providerId,
      customer: localStorage.getItem("userId"),
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment
    });
    handleCloseReviewDialog();
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 3, sm: 6 } }}>
        <Card elevation={3} sx={{ mb: { xs: 2, md: 4 }, p: { xs: 1, md: 0 } }}>
          <CardContent>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: { xs: 2, sm: 0 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '2rem'
                  }}
                >{provider.name ? provider.name.split(' ').map(n => n[0]).join('') : "P"}</Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: .5, flexWrap: 'wrap' }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: '#333',
                        mr: 1,
                        fontSize: { xs: 17, sm: 20 }
                      }}>
                      {provider.name}
                    </Typography>
                    {provider.verified &&
                      <Chip icon={<VerifiedIcon />} label="Verified" color="success" size="small" />}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: 14, sm: 16 }, mb: 1 }}
                  >
                    {provider.service}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Rating value={ratingStats.average || 0} precision={0.1} readOnly />
                    <Typography variant="body1" sx={{ ml: 1, fontWeight: 600 }}>
                      {ratingStats.average}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({ratingStats.total} reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {userRole === "customer" && userId && userId !== providerId && (
                <Button
                  variant="contained"
                  onClick={handleOpenReviewDialog}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 4, mt: { xs: 2, sm: 0 }
                  }}
                  size="large"
                >
                  Write a Review
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ position: { md: 'sticky' }, top: 20, mb: { xs: 2, md: 0 } }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  Rating Breakdown
                </Typography>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#667eea', fontSize: { xs: 32, sm: 42 } }}>
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
                    <Typography variant="body2" sx={{ width: 32, fontSize: { xs: 13, sm: 15 } }}>
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
                    <Typography variant="body2" sx={{
                      width: 30, textAlign: 'right', fontSize: { xs: 13, sm: 15 }
                    }}>
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#333',
              fontSize: { xs: 18, sm: 22 }
            }}>
              Customer Reviews ({allReviews.length})
            </Typography>
            {allReviews.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, textAlign: "center", fontSize: { xs: 15, sm: 17 } }}
              >
                No reviews yet. Be the first to add a review!
              </Typography>
            )}
            {allReviews.map((review) => (
              <Card key={review._id} elevation={1} sx={{
                mb: 3,
                p: { xs: 1, sm: 2 }
              }}>
                <CardContent>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: 'space-between',
                    mb: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ mr: 2, background: '#667eea' }}>
                        {review.customer?.name?.charAt(0) || "U"}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: { xs: 15, sm: 17 } }}>
                            {review.customer?.name || "User"}
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: { xs: 13, sm: 14 } }}>
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={review.rating} readOnly size="small" sx={{ mt: { xs: 1, sm: 0 } }} />
                  </Box>
                  {review.title && <Typography variant="subtitle2" sx={{
                    fontWeight: 'bold', mb: 1, fontSize: { xs: 15, sm: 16 }
                  }}>
                    {review.title}
                  </Typography>}
                  <Typography variant="body2" color="text.secondary" sx={{
                    mb: 2, fontSize: { xs: 14, sm: 15 }
                  }}>
                    {review.comment}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      size="small"
                      startIcon={<ThumbUpIcon />}
                      sx={{ color: '#667eea', fontSize: { xs: 13, sm: 15 } }}
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
        <DialogTitle sx={{
          fontWeight: 'bold', color: '#333', fontSize: { xs: 18, sm: 22 }
        }}>
          Write a Review for {provider.name}
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 1, sm: 3 } }}>
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
