import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Plus, Loader2, User, Users } from 'lucide-react'; // Import icons

// This is the new form component, kept inside dashboard.jsx for simplicity
const CreatePostForm = ({ user, onPostCreated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('You are not logged in. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/addpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          title: title,
          content: content,
          user_id: user.id // We send this, but the server *verifies* it with the token
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      // Success!
      onPostCreated(data.post); // Pass the new post back
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">Create a New Post</h2>
      
      {error && (
        <div className="p-3 mb-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white">
          {error}
        </div>
      )}

      <form onSubmit={handleCreatePost} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-2">
            Title / Question
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your question?"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-white/80 mb-2">
            Content (Optional)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add more details..."
            rows="6"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-[#FF8C5A] text-white font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Posting...
              </>
            ) : (
              'Create Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};


// Main Dashboard Component
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('all_posts'); // 'all_posts', 'my_posts', 'create_post'
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (!storedUser || !accessToken) {
      navigate('/auth');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    // Fetch posts based on current view
    fetchPosts(parsedUser);
  }, [navigate, view]);

  const fetchPosts = async (currentUser) => {
    if (!currentUser) return;
    
    setLoadingPosts(true);
    setError('');
    try {
      const endpoint = view === 'my_posts' 
        ? `http://localhost:3000/myposts`
        : `http://localhost:3000/allposts`;

      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLogout = async () => {
    // ... (your existing logout logic) ...
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handlePostCreated = (newPost) => {
    // Update posts if we're in the relevant view
    if (view === 'my_posts' || view === 'all_posts') {
      setPosts(prevPosts => [newPost, ...prevPosts]);
    }
    setView('all_posts'); // Switch back to all posts view
  };

  // Helper to get button styles
  const getButtonClass = (buttonView) => {
    const base = "px-5 py-2 rounded-lg font-semibold transition-all";
    if (view === buttonView) {
      return `${base} bg-[#FF8C5A] text-white shadow-lg`;
    }
    return `${base} bg-white/10 text-white/70 hover:bg-white/20`;
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(18, 87, 116, 1)'
      }}>
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'rgba(18, 87, 116, 1)',
      color: 'white',
      paddingBottom: '4rem'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 3rem',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Book style={{ height: '2rem', width: '2rem' }} />
          <div style={{ fontSize: '1.875rem', fontWeight: 700 }}>
            <span>Learnato</span>
            <span style={{ color: '#FF8C5A' }}>AI</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/80">Welcome, {user.fullName}!</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.75rem 2rem',
              background: '#FF8C5A',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* View Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-4">
            <button
              className={getButtonClass('all_posts')}
              onClick={() => setView('all_posts')}
            >
              All Posts
            </button>
            <button
              className={getButtonClass('my_posts')}
              onClick={() => setView('my_posts')}
            >
              My Posts
            </button>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-all shadow-lg"
            onClick={() => setView('create_post')}
          >
            <Plus size={18} />
            Create Post
          </button>
        </div>

        {/* Conditional View */}
        <div className="mt-6">
          {view === 'create_post' && (
            <CreatePostForm
              user={user}
              onPostCreated={handlePostCreated}
              onCancel={() => setView('all_posts')}
            />
          )}

          {(view === 'all_posts' || view === 'my_posts') && (
            <div className="p-8 bg-white/5 rounded-xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">
                {view === 'all_posts' ? 'All Posts' : 'My Posts'}
              </h2>
              
              {loadingPosts ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-white/70" />
                </div>
              ) : error ? (
                <div className="text-red-400 p-4 bg-red-400/10 rounded-lg">
                  {error}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <Book className="w-12 h-12 mx-auto text-white/30 mb-4" />
                  <p className="text-white/50">
                    {view === 'my_posts' 
                      ? "You haven't created any posts yet"
                      : "No posts available"}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-6 bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                    >
                      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                      <p className="text-white/70 mb-4">{post.content}</p>
                      <div className="flex justify-between items-center text-sm text-white/50">
                        <span>Posted by {post.user_id === user.id ? 'you' : post.users?.full_name}</span>
                        <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;