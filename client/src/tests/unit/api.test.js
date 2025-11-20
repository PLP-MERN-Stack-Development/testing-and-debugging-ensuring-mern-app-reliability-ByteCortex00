// client/src/tests/unit/api.test.js - Unit tests for API utilities

import { apiRequest, getPosts, createPost, deletePost } from '../../utils/api';

// Mock fetch
global.fetch = jest.fn();

describe('API utilities', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('apiRequest', () => {
    it('should make a successful GET request', async () => {
      const mockResponse = { data: 'test' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiRequest('/test');

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/test', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle request errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(apiRequest('/notfound')).rejects.toThrow('HTTP error! status: 404');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiRequest('/test')).rejects.toThrow('Network error');
    });

    it('should include custom headers', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await apiRequest('/test', {
        headers: { 'Authorization': 'Bearer token' },
      });

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/test', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token',
        },
      });
    });
  });

  describe('getPosts', () => {
    it('should call apiRequest with correct endpoint', async () => {
      const mockPosts = [{ id: 1, title: 'Test' }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPosts),
      });

      const result = await getPosts();

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/posts', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockPosts);
    });
  });

  describe('createPost', () => {
    it('should make POST request with post data', async () => {
      const postData = { title: 'New Post', content: 'Content' };
      const mockResponse = { id: 1, ...postData };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await createPost(postData);

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deletePost', () => {
    it('should make DELETE request with post ID', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Deleted' }),
      });

      const result = await deletePost('123');

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/posts/123', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual({ message: 'Deleted' });
    });
  });
});