import React, { useState } from 'react';
import Button from './components/Button';
import { usePosts } from './hooks/usePosts';

function App() {
  const { posts, loading, error, addPost } = usePosts();
  const [form, setForm] = useState({ title: '', content: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPost(form);
      setForm({ title: '', content: '' });
    } catch (err) {
      console.error("Error creating post", err);
    }
  };

  return (
    <div className="App">
      <h1>Reliable MERN App</h1>

      {error && <div className="error" style={{ color: 'red' }}>Error: {error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
          disabled={loading}
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={e => setForm({...form, content: e.target.value})}
          disabled={loading}
        />
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Post'}
        </Button>
      </form>

      {loading && posts.length === 0 ? (
        <div>Loading posts...</div>
      ) : (
        <div className="posts">
          {posts.map(post => (
            <div key={post._id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;