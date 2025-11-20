// server/tests/unit/controllers.test.js - Unit tests for controllers

const { getAllPosts, createPost, deletePost } = require('../../src/controllers/posts');
const Post = require('../../src/models/Post');

// Mock the Post model
jest.mock('../../src/models/Post');

describe('Posts Controller', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAllPosts', () => {
    it('should return all posts successfully', async () => {
      const mockPosts = [
        { _id: '1', title: 'Test Post 1', content: 'Content 1' },
        { _id: '2', title: 'Test Post 2', content: 'Content 2' }
      ];

      Post.find.mockResolvedValue(mockPosts);

      await getAllPosts(mockRequest, mockResponse, mockNext);

      expect(Post.find).toHaveBeenCalledWith();
      expect(mockResponse.json).toHaveBeenCalledWith(mockPosts);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      Post.find.mockRejectedValue(error);

      await getAllPosts(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('createPost', () => {
    it('should create a new post successfully', async () => {
      const postData = {
        title: 'New Post',
        content: 'New content',
        author: 'Test Author'
      };
      const savedPost = { _id: '1', ...postData };

      mockRequest.body = postData;
      Post.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(savedPost)
      }));

      await createPost(mockRequest, mockResponse, mockNext);

      expect(Post).toHaveBeenCalledWith(postData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(savedPost);
    });

    it('should handle validation errors', async () => {
      const error = new Error('Validation failed');
      mockRequest.body = { title: '', content: 'Content' };

      Post.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(error)
      }));

      await createPost(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      mockRequest.params = { id: '123' };

      Post.findByIdAndDelete.mockResolvedValue({ _id: '123' });

      await deletePost(mockRequest, mockResponse, mockNext);

      expect(Post.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Post deleted' });
    });

    it('should handle database errors during deletion', async () => {
      const error = new Error('Deletion failed');
      mockRequest.params = { id: '123' };

      Post.findByIdAndDelete.mockRejectedValue(error);

      await deletePost(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});