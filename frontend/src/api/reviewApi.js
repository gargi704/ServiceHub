import axios from 'axios';
import { API_BASE_URL } from '../api.js';

const API_URL = `${API_BASE_URL}/api/reviews`;

export const fetchReviews = async (providerId) => {
  const response = await axios.get(`${API_URL}/${providerId}`);
  return response.data;
};

export const submitReview = async (reviewData) => {
  const response = await axios.post(API_URL, reviewData);
  return response.data;
};
