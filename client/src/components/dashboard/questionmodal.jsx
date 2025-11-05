import React, { useState } from 'react';
import API_BASE_URL from '../../utils/api';
import { Bot, X, User, MessageSquare, CornerDownRight, Loader2 } from 'lucide-react';
import SummaryPopup from './aisumarry';

// Helper function to safely get a user's display name
const getUserFullName = (u) => {
  return u?.full_name || u?.email || 'Unknown User';
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
      const response = await fetch(`${API_BASE_URL}/ai-summary`, {
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
      const response = await fetch(`${API_BASE_URL}/addreply`, {
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

export default PostModal;