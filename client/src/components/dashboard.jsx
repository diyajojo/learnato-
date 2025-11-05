import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Book, Plus, Loader2, User, MessageSquare, X, CornerDownRight, ThumbsUp, Bot,
  Settings, HelpCircle // <-- IMPORTED NEW ICONS
} from 'lucide-react';

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

/**
 * Helper function to safely get a user's display name.
 * Falls back to email, then to 'Unknown User'.
 */
const getUserFullName = (u) => {
  return u?.full_name || u?.email || 'Unknown User';
};

const SummaryPopup = ({ summary, onClose }) => {
  return (
    <div className="ai-summary-overlay" onClick={onClose}>
      <div className="ai-summary-content" onClick={(e) => e.stopPropagation()}>
        <div className="ai-summary-header">
          <h3>AI Summary</h3>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>
        <div className="ai-summary-body">
          <p>{summary}</p>
        </div>
      </div>
    </div>
  );
};

const PostModal = ({ post, user, onClose, onReplyPosted }) => {
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  const handleGetAiSummary = async () => {
    setSummarizing(true);
    try {
      const response = await fetch('http://localhost:3000/ai-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAiSummary(data.summary);
      setShowSummary(true);
    } catch (err) {
      console.error('Error getting AI summary:', err);
      setError(err.message || 'Failed to get AI summary');
    } finally {
      setSummarizing(false);
    }
  };

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Question Details</h2>
          <button onClick={onClose} className="modal-close">
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {/* Post Content */}
          <div>
            <div className="question-header">
              <div className="question-label">Question:</div>
              <button 
                onClick={handleGetAiSummary}
                disabled={summarizing}
                className="ai-summary-button"
              >
                <Bot size={16} />
                {summarizing ? 'Analyzing...' : 'Ask AI to Summarize'}
              </button>
            </div>
            <h3 className="question-title">{post.title}</h3>

            <div className="question-label" style={{ marginTop: '1.5rem' }}>
              Details:
            </div>
            {showSummary && (
              <SummaryPopup
                summary={aiSummary}
                onClose={() => setShowSummary(false)}
              />
            )}
            {post.content ? (
              <p className="question-content">{post.content}</p>
            ) : (
              <p className="question-content" style={{ fontStyle: 'italic', opacity: 0.7 }}>
                No details provided
              </p>
            )}

            <div className="question-meta">
              <User size={16} />
              <span>
                Asked by {getUserFullName(post.users)} on {new Date(post.created_at).toLocaleDateString('en-US', {
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

// --- CreatePostForm component (renamed to CreateQuestionForm) ---
const CreateQuestionForm = ({ user, onQuestionCreated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateQuestion = async (e) => {
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
        throw new Error(data.error || 'Failed to create question');
      }

      onQuestionCreated(data.post || data); // data.post is what the server sends
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
      <h2 className="create-post-title">Ask a New Question</h2>

      {error && <div className="create-post-error">{error}</div>}

      <form onSubmit={handleCreateQuestion}>
        <div className="form-field">
          <label htmlFor="title" className="form-label">
            Question Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your question?"
            className="form-input"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="content" className="form-label">
            Details
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add more details about your question..."
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
              'Post Question'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('all_questions');
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  
  // Add loading state for upvotes
  const [upvoting, setUpvoting] = useState(null); 

  const navigate = useNavigate();

  // Single handler for when a reply is posted from the modal
  const handleReplyPosted = async (newReply) => {
    try {
      if (!selectedQuestion) return; 
      // Refresh replies for the selected post
      const replies = await loadPostReplies(selectedQuestion.id); 

      // Update selectedQuestion with fresh replies
      setSelectedQuestion((prev) => ({ ...prev, replies })); 

      // Update questions list so counts / previews stay in sync
      setQuestions((prevQuestions) => 
        prevQuestions.map((p) => (p.id === selectedQuestion.id ? { ...p, replies } : p)) 
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
    if (view === 'all_questions' || view === 'my_questions') { 
      fetchQuestions(parsedUser); 
    }

    // Reset refresh flag after fetching
    if (shouldRefresh) {
      setShouldRefresh(false);
    }
  }, [navigate, view, shouldRefresh]);

  const fetchQuestions = async (currentUser) => { 
    if (!currentUser) return;

    setLoadingQuestions(true); 
    setError('');
    try {
      const endpoint = view === 'my_questions' ? `http://localhost:3000/myposts` : `http://localhost:3000/allposts`; 

      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch questions'); 
      }
      const data = await response.json();
      console.log('Fetched questions:', data); // Debug log
      setQuestions(data); 
    } catch (err) {
      setError(err.message || 'Failed to load questions. Please try again later.'); 
      console.error('Error fetching questions:', err); 
    } finally {
      setLoadingQuestions(false); 
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleQuestionCreated = (newQuestion) => { 
    // Add new post to state
    setQuestions((prevQuestions) => [newQuestion, ...prevQuestions]); 
    setView('all_questions'); // Switch back to all posts view
  };

  // Add new handler for upvoting
  const handleToggleUpvote = async (questionId) => {
    if (upvoting === questionId) return; // Prevent double-clicks
    setUpvoting(questionId);

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('You must be logged in to upvote.');
      setUpvoting(null);
      return;
    }

    // Keep a copy of old state for rollback
    const originalQuestions = [...questions];

    // Optimistic UI Update: Update UI *before* API call
    setQuestions(prevQuestions => 
      prevQuestions.map(q => {
        if (q.id === questionId) {
          const alreadyUpvoted = q.upvotes.some(uv => uv.user_id === user.id);
          if (alreadyUpvoted) {
            // Optimistically REMOVE upvote
            return { ...q, upvotes: q.upvotes.filter(uv => uv.user_id !== user.id) };
          } else {
            // Optimistically ADD upvote
            return { ...q, upvotes: [...q.upvotes, { user_id: user.id, post_id: questionId }] };
          }
        }
        return q;
      })
    );

    try {
      // Send API request
      const response = await fetch('http://localhost:3000/toggleupvote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ post_id: questionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle upvote');
      }

      // Sync server state to ensure count is accurate
      setQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q.id === questionId ? { ...q, upvotes: data.upvotes } : q
        )
      );

    } catch (err) {
      console.error('Upvote error:', err);
      setError(err.message);
      setQuestions(originalQuestions); // Rollback UI on API error
    } finally {
      setUpvoting(null);
    }
  };


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
        
        {/* === NEW WELCOME BLOCK === */}
        <div className="welcome-banner">
          <img 
            src="/assets/pfp.png" // Path from /public folder
            alt="Profile" 
            className="welcome-pfp"
          />
          <div className="welcome-text">
            <h2>Hi {user?.full_name || 'User'}👋 </h2>
            <p>Welcome back. What would you like to do today?</p>
          </div>
        </div>
        {/* === END NEW WELCOME BLOCK === */}


        {/* View Navigation */}
        <div className="view-nav">
          <div className="nav-buttons">
            <button className={`nav-button ${view === 'all_questions' ? 'active' : 'inactive'}`} onClick={() => setView('all_questions')}>
              All Questions
            </button>
            <button className={`nav-button ${view === 'my_questions' ? 'active' : 'inactive'}`} onClick={() => setView('my_questions')}>
              My Questions
            </button>
          </div>
          <button className="create-button" onClick={() => setView('create_question')}>
            <Plus size={18} />
            Ask Question
          </button>
        </div>

        {/* Conditional View */}
        <div className="mt-6">
          {view === 'create_question' && (
            <CreateQuestionForm user={user} onQuestionCreated={handleQuestionCreated} onCancel={() => setView('all_questions')} />
          )}

          {(view === 'all_questions' || view === 'my_questions') && (
            // --- MODIFICATION HERE: Added dynamic 'empty' class ---
            <div className={`posts-container ${questions.length === 0 ? 'empty' : ''}`}>
              {loadingQuestions ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-white/70" />
                </div>
              ) : error ? (
                <div className="text-red-400 p-4 bg-red-400/10 rounded-lg">{error}</div>
              ) : questions.length === 0 ? (
                // --- MODIFICATION HERE: Updated empty state classes ---
                <div className="empty-message-content">
                  <Book className="icon" />
                  <p>{view === 'my_questions' ? "You haven't asked any questions yet" : 'No questions available'}</p> 
                </div>
              ) : (
                <div className="posts-list">
                  {questions.map((question) => {
                    // Check if current user has upvoted
                    const isUpvoted = question.upvotes.some(uv => uv.user_id === user.id);
                    
                    return (
                      <div key={question.id} className="post-card">
                        <div
                          onClick={async () => {
                            const replies = await loadPostReplies(question.id);
                            setSelectedQuestion({ ...question, replies });
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <h3 className="post-card-title">{question.title}</h3>
                          
                          <div className="post-card-meta">
                            <div className="meta-icon">
                              <User size={16} />
                              <span>Asked by {getUserFullName(question.users)}</span>
                            </div>
                            <div className="meta-icon">
                              <MessageSquare size={16} />
                              <span>{question.replies?.length || 0} Answers</span>
                            </div>
                            
                            {/* Upvote Button */}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent modal from opening
                                handleToggleUpvote(question.id);
                              }}
                              disabled={upvoting === question.id}
                              className={`meta-icon upvote-button ${isUpvoted ? 'active' : ''}`}
                            >
                              <ThumbsUp size={16} />
                              <span>{question.upvotes.length}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {selectedQuestion && (
        <PostModal 
          post={selectedQuestion} 
          user={user} 
          onClose={() => setSelectedQuestion(null)} 
          onReplyPosted={handleReplyPosted} 
        />
      )}
    </div>
  );
};

export default Dashboard;