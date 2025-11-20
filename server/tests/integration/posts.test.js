const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const Post = require('../../src/models/Post');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Post.deleteMany({});
});

describe('POST /api/posts', () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({
        title: 'Test Title',
        content: 'Test Content',
        author: 'Tester'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Title');
    expect(res.body.content).toBe('Test Content');
    expect(res.body.author).toBe('Tester');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('createdAt');
  });

  it('should fail if title is missing', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ content: 'No Title' });
    expect(res.statusCode).toBe(400);
  });

  it('should fail if content is missing', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ title: 'No Content' });
    expect(res.statusCode).toBe(400);
  });

  it('should use default author if not provided', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({
        title: 'Test Title',
        content: 'Test Content'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.author).toBe('Anonymous');
  });
});

describe('GET /api/posts', () => {
  beforeEach(async () => {
    // Create test posts
    await request(app)
      .post('/api/posts')
      .send({
        title: 'Post 1',
        content: 'Content 1',
        author: 'Author 1'
      });

    await request(app)
      .post('/api/posts')
      .send({
        title: 'Post 2',
        content: 'Content 2',
        author: 'Author 2'
      });
  });

  it('should return all posts', async () => {
    const res = await request(app).get('/api/posts');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('title');
    expect(res.body[0]).toHaveProperty('content');
    expect(res.body[0]).toHaveProperty('author');
  });

  it('should return posts sorted by creation date (newest first)', async () => {
    const res = await request(app).get('/api/posts');

    expect(res.statusCode).toBe(200);
    expect(res.body[0].title).toBe('Post 2'); // Most recent
    expect(res.body[1].title).toBe('Post 1'); // Older
  });
});

describe('DELETE /api/posts/:id', () => {
  let postId;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({
        title: 'Post to Delete',
        content: 'Content to Delete',
        author: 'Test Author'
      });
    postId = res.body._id;
  });

  it('should delete a post successfully', async () => {
    const deleteRes = await request(app)
      .delete(`/api/posts/${postId}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.message).toBe('Post deleted');

    // Verify post is deleted
    const getRes = await request(app).get('/api/posts');
    const deletedPost = getRes.body.find(post => post._id === postId);
    expect(deletedPost).toBeUndefined();
  });

  it('should return 500 for invalid post ID', async () => {
    const res = await request(app)
      .delete('/api/posts/invalid-id');

    expect(res.statusCode).toBe(500);
  });

  it('should return 500 for non-existent post ID', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app)
      .delete(`/api/posts/${fakeId}`);

    expect(res.statusCode).toBe(500);
  });
});