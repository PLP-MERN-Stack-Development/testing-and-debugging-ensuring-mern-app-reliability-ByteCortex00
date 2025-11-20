// client/src/utils/api.js - API utility functions

import { monitorApiCall } from './performance';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  return monitorApiCall(async () => {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }, endpoint);
};

export const getPosts = () => apiRequest('/posts');

export const createPost = (postData) =>
  apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  });

export const deletePost = (id) =>
  apiRequest(`/posts/${id}`, {
    method: 'DELETE',
  });