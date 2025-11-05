import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Plus, Loader2, User, MessageSquare, X, CornerDownRight } from 'lucide-react';

// Function to load replies for a specific post
const loadPostReplies = async (postId) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`http://localhost:3000/postreplies/${postId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch replies');
    }

    const replies = await response.json();
    return replies;
  } catch (error) {
    console.error('Error loading replies:', error);
    return [];
  }
};

const PostModal = ({ post, user, onClose, onReplyPosted }) => {
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddReply = async (e) => {
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
      const response = await fetch('http://localhost:3000/addreply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content: replyContent,
          post_id: post.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post reply');
      }

      // Notify parent that a reply was posted. Parent will refresh replies.
      onReplyPosted(data.reply || data);
      setReplyContent('');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Helper for safely reading user name
  const getUserFullName = (u) => u?.full_name || 'Anonymous';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Discussion</h2>
          <button onClick={onClose} className="modal-close">
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {/* Post Content */}
          <div>
            <div className="question-label">Title:</div>
            <h3 className="question-title">{post.title}</h3>

            <div className="question-label" style={{ marginTop: '1.5rem' }}>
              Content:
            </div>
            {post.content ? (
              <p className="question-content">{post.content}</p>
            ) : (
              <p className="question-content" style={{ fontStyle: 'italic', opacity: 0.7 }}>
                No content provided
              </p>
            )}

            <div className="question-meta">
              <User size={16} />
              <span>Posted by {getUserFullName(post.users)}</span>
              <span>•</span>
              <span>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Answers */}
          <div className="answers-section">
            <h4 className="answers-title">Answers ({post.replies?.length || 0})</h4>
            <div>
              {post.replies && post.replies.length > 0 ? (
                post.replies.map((reply) => (
                  <div key={reply.id} className="answer-item">
                    <CornerDownRight size={20} className="text-white/50" />
                    <div>
                      <p className="answer-content">{reply.content}</p>
                      <div className="answer-meta">
                        <span>Answered by {getUserFullName(reply.users)}</span>
                        <span>•</span>
                        <span>
                          {new Date(reply.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/50">No answers yet. Be the first to reply!</p>
              )}
            </div>
          </div>
        </div>

        {/* Add Answer Form */}
        <div className="reply-form">
          <form onSubmit={handleAddReply}>
            <label htmlFor="replyContent" className="input-label">
              Your Answer
            </label>
            <textarea
              id="replyContent"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your answer here..."
              rows="4"
              className="reply-textarea"
              required
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="form-actions">
              <button type="submit" disabled={loading} className="action-button primary">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Posting...
                  </>
                ) : (
                  'Post Answer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- CreatePostForm component (kept inside dashboard.jsx for simplicity) ---
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
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
          user_id: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      onPostCreated(data.post || data);
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-form">
      <h2 className="create-post-title">Create a New Post</h2>

      {error && <div className="create-post-error">{error}</div>}

      <form onSubmit={handleCreatePost}>
        <div className="form-field">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your post title"
            className="form-input"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your post content..."
            rows="8"
            className="form-input"
          />
        </div>

        <div className="form-buttons">
          <button type="button" onClick={onCancel} disabled={loading} className="button-cancel">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="button-submit">
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

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('all_posts');
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  // Track if we need to refresh posts
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const navigate = useNavigate();

  // Single handler for when a reply is posted from the modal
  const handleReplyPosted = async (newReply) => {
    try {
      if (!selectedPost) return;
      // Refresh replies for the selected post
      const replies = await loadPostReplies(selectedPost.id);

      // Update selectedPost with fresh replies
      setSelectedPost((prev) => ({ ...prev, replies }));

      // Update posts list so counts / previews stay in sync
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === selectedPost.id ? { ...p, replies } : p))
      );

      // optional: trigger full posts refresh if you rely on server-side ordering
      setShouldRefresh(true);
    } catch (err) {
      console.error('Error refreshing replies after post:', err);
    }
  };

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

    // Fetch posts when component mounts or view changes or when shouldRefresh is set
    if (view === 'all_posts' || view === 'my_posts') {
      fetchPosts(parsedUser);
    }

    // Reset refresh flag after fetching
    if (shouldRefresh) {
      setShouldRefresh(false);
    }
  }, [navigate, view, shouldRefresh]);

  const fetchPosts = async (currentUser) => {
    if (!currentUser) return;

    setLoadingPosts(true);
    setError('');
    try {
      const endpoint = view === 'my_posts' ? `http://localhost:3000/myposts` : `http://localhost:3000/allposts`;

      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch posts');
      }
      const data = await response.json();
      console.log('Fetched posts:', data); // Debug log
      setPosts(data);
    } catch (err) {
      setError(err.message || 'Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handlePostCreated = (newPost) => {
    // Add new post to state
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setView('all_posts'); // Switch back to all posts view
  };

  // Helper to get button styles
  const getButtonClass = (buttonView) => {
    const base = 'px-5 py-2 rounded-lg font-semibold transition-all';
    if (view === buttonView) {
      return `${base} bg-[#FF8C5A] text-white shadow-lg`;
    }
    return `${base} bg-white/10 text-white/70 hover:bg-white/20`;
  };

  const getUserFullName = (u) => u?.full_name || 'Anonymous';

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgba(18, 87, 116, 1)' }}>
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-brand">
          <Book className="h-8 w-8" />
          <div className="brand-text">
            <span>Learnato</span>
            <span className="brand-highlight">AI</span>
          </div>
        </div>
        <div className="header-user">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* View Navigation */}
        <div className="view-nav">
          <div className="nav-buttons">
            <button className={`nav-button ${view === 'all_posts' ? 'active' : 'inactive'}`} onClick={() => setView('all_posts')}>
              All Posts
            </button>
            <button className={`nav-button ${view === 'my_posts' ? 'active' : 'inactive'}`} onClick={() => setView('my_posts')}>
              My Posts
            </button>
          </div>
          <button className="create-button" onClick={() => setView('create_post')}>
            <Plus size={18} />
            Create Post
          </button>
        </div>

        {/* Conditional View */}
        <div className="mt-6">
          {view === 'create_post' && (
            <CreatePostForm user={user} onPostCreated={handlePostCreated} onCancel={() => setView('all_posts')} />
          )}

          {(view === 'all_posts' || view === 'my_posts') && (
            <div className="posts-container">
              <h2 className="section-title">{view === 'all_posts' ? 'All Posts' : 'My Posts'}</h2>

              {loadingPosts ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-white/70" />
                </div>
              ) : error ? (
                <div className="text-red-400 p-4 bg-red-400/10 rounded-lg">{error}</div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <Book className="w-12 h-12 mx-auto text-white/30 mb-4" />
                  <p className="text-white/50">{view === 'my_posts' ? "You haven't created any posts yet" : 'No posts available'}</p>
                </div>
              ) : (
                <div className="posts-list">
                  {posts.map((post) => (
                    <div key={post.id} className="post-card">
                      <div
                        onClick={async () => {
                          const replies = await loadPostReplies(post.id);
                          setSelectedPost({ ...post, replies });
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <h3 className="post-card-title">{post.title}</h3>
                        <div className="post-card-meta">
                          <div className="meta-icon">
                            <User size={16} />
                            <span>Posted by {getUserFullName(post.users)}</span>
                          </div>
                          <div className="meta-icon">
                            <MessageSquare size={16} />
                            <span>{post.replies?.length || 0} Answers</span>
                          </div>
                        </div>
                      </div>

                      {/* Replies Preview (inside each post card) */}
                      {post.replies && post.replies.length > 0 && (
                        <div className="post-replies">
                          <div className="replies-header">
                            <span className="replies-title">Recent Replies</span>
                          </div>
                          <div className="reply-list">
                            {post.replies.slice(0, 3).map((reply) => (
                              <div key={reply.id} className="reply-item">
                                <p className="reply-content">{reply.content}</p>
                                <div className="reply-meta">
                                  <span>{getUserFullName(reply.users)}</span>
                                  <span>•</span>
                                  <span>
                                    {new Date(reply.created_at).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {post.replies.length > 3 && (
                              <button onClick={() => setSelectedPost(post)} className="text-[#FF8C5A] text-sm hover:underline mt-1">
                                View all {post.replies.length} replies...
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {selectedPost && (
        <PostModal post={selectedPost} user={user} onClose={() => setSelectedPost(null)} onReplyPosted={handleReplyPosted} />
      )}
    </div>
  );
};

export default Dashboard;
