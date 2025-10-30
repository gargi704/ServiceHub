import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reviews';

export const fetchReviews = async (providerId) => {
  const response = await axios.get(`${API_URL}/${providerId}`);
  return response.data;
};

export const submitReview = async (reviewData) => {
  const response = await axios.post(API_URL, reviewData);
  return response.data;
};
