// server/tests/unit/middleware.test.js - Unit tests for middleware

const logger = require('../../src/middleware/logger');
const errorHandler = require('../../src/middleware/errorHandler');

describe('Middleware', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;
  let consoleSpy;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      url: '/api/posts',
      ip: '127.0.0.1',
      body: {}
    };
    mockResponse = {};
    mockNext = jest.fn();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('logger middleware', () => {
    it('should log GET requests', () => {
      logger(mockRequest, mockResponse, mockNext);

      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[GET /api/posts - IP: 127.0.0.1]')
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should log POST requests with body', () => {
      mockRequest.method = 'POST';
      mockRequest.body = { title: 'Test', content: 'Content' };

      logger(mockRequest, mockResponse, mockNext);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Request Body:')
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should not log sensitive data', () => {
      mockRequest.method = 'POST';
      mockRequest.body = { title: 'Test', password: 'secret' };

      logger(mockRequest, mockResponse, mockNext);

      const logCall = consoleSpy.mock.calls.find(call =>
        call[0].includes('Request Body:')
      );
      expect(logCall[1]).not.toContain('secret');
    });
  });

  describe('errorHandler middleware', () => {
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should handle ValidationError', () => {
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.errors = {
        title: { message: 'Title is required' },
        content: { message: 'Content is required' }
      };

      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      errorHandler(error, mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Validation Error',
        errors: ['Title is required', 'Content is required']
      });
    });

    it('should handle CastError', () => {
      const error = new Error('Cast failed');
      error.name = 'CastError';

      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      errorHandler(error, mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid ID format'
      });
    });

    it('should handle duplicate key error', () => {
      const error = new Error('Duplicate key');
      error.code = 11000;
      error.keyValue = { email: 'test@example.com' };

      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      errorHandler(error, mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'email already exists'
      });
    });

    it('should handle generic errors', () => {
      const error = new Error('Something went wrong');

      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      errorHandler(error, mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Something went wrong'
      });
    });

    it('should include stack trace in development', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Dev error');

      mockResponse.status = jest.fn().mockReturnThis();
      mockResponse.json = jest.fn();

      errorHandler(error, mockRequest, mockResponse, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Dev error',
        stack: error.stack
      });

      delete process.env.NODE_ENV;
    });
  });
});