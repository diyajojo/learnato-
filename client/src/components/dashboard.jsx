import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Plus, Loader2 } from 'lucide-react';
import WelcomeBanner from './dashboard/greetings';
import CreateQuestionForm from './dashboard/createquestion';
import QuestionCard from './dashboard/questioncard';
import PostModal from './dashboard/questionmodal';

// Helper function to load replies for a specific post
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

// Helper function to get user's name
const getUserFullName = (u) => {
  return u?.full_name || u?.email || 'Unknown User';
};

// --- The Dashboard component starts here ---
// All other component definitions have been removed.

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('all_questions');
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  
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
        
        {/* Use the imported WelcomeBanner component */}
        <WelcomeBanner user={user} />


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
            // Use the imported CreateQuestionForm component
            <CreateQuestionForm 
              user={user} 
              onQuestionCreated={handleQuestionCreated} 
              onCancel={() => setView('all_questions')} 
            />
          )}

          {(view === 'all_questions' || view === 'my_questions') && (
            <div className={`posts-container ${questions.length === 0 ? 'empty' : ''}`}>
              {loadingQuestions ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-white/70" />
                </div>
              ) : error ? (
                <div className="text-red-400 p-4 bg-red-400/10 rounded-lg">{error}</div>
              ) : questions.length === 0 ? (
                <div className="empty-message-content">
                  <Book className="icon" />
                  <p>{view === 'my_questions' ? "You haven't asked any questions yet" : 'No questions available'}</p> 
                </div>
              ) : (
                <div className="posts-list">
                  {/* Use the imported QuestionCard component */}
                  {questions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      user={user}
                      onQuestionClick={async (q) => {
                        const replies = await loadPostReplies(q.id);
                        setSelectedQuestion({ ...q, replies });
                      }}
                      onUpvote={handleToggleUpvote}
                      upvoting={upvoting}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal: Uses the imported PostModal component */}
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