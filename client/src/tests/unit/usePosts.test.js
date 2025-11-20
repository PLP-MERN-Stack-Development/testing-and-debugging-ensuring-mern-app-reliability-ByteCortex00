// client/src/tests/unit/usePosts.test.js - Unit tests for usePosts hook

import { renderHook, act, waitFor } from '@testing-library/react';
import { usePosts } from '../../hooks/usePosts';

// Mock the API functions
jest.mock('../../utils/api');
const { getPosts, createPost, deletePost } = require('../../utils/api');

describe('usePosts hook', () => {
  const mockPosts = [
    { _id: '1', title: 'Post 1', content: 'Content 1' },
    { _id: '2', title: 'Post 2', content: 'Content 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getPosts.mockResolvedValue(mockPosts);
    createPost.mockResolvedValue({ _id: '3', title: 'New Post', content: 'New Content' });
    deletePost.mockResolvedValue();
  });

  it('should initialize with empty posts and loading false', () => {
    const { result } = renderHook(() => usePosts());

    expect(result.current.posts).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should fetch posts on mount', async () => {
    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.posts).toEqual(mockPosts);
      expect(result.current.loading).toBe(false);
    });

    expect(getPosts).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'Failed to fetch';
    getPosts.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should add a post successfully', async () => {
    const { result } = renderHook(() => usePosts());

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.posts).toEqual(mockPosts);
    });

    const newPostData = { title: 'New Post', content: 'New Content' };

    await act(async () => {
      const newPost = await result.current.addPost(newPostData);
      expect(newPost).toEqual({ _id: '3', ...newPostData });
    });

    expect(createPost).toHaveBeenCalledWith(newPostData);
    expect(result.current.posts).toEqual([
      { _id: '3', title: 'New Post', content: 'New Content' },
      ...mockPosts,
    ]);
    expect(result.current.loading).toBe(false);
  });

  it('should handle add post error', async () => {
    const errorMessage = 'Failed to create post';
    createPost.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.posts).toEqual(mockPosts);
    });

    await act(async () => {
      await expect(result.current.addPost({ title: 'Test' })).rejects.toThrow(errorMessage);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });

  it('should delete a post successfully', async () => {
    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.posts).toEqual(mockPosts);
    });

    await act(async () => {
      await result.current.removePost('1');
    });

    expect(deletePost).toHaveBeenCalledWith('1');
    expect(result.current.posts).toEqual([mockPosts[1]]);
    expect(result.current.loading).toBe(false);
  });

  it('should handle delete post error', async () => {
    const errorMessage = 'Failed to delete';
    deletePost.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.posts).toEqual(mockPosts);
    });

    await act(async () => {
      await expect(result.current.removePost('1')).rejects.toThrow(errorMessage);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });

  it('should set loading state during operations', async () => {
    const { result } = renderHook(() => usePosts());

    // Initial load
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Add operation
    act(() => {
      result.current.addPost({ title: 'Test' });
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});