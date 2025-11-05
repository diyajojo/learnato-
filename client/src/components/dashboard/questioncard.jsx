import React from 'react';
import { User, MessageSquare, ThumbsUp, Clock, Calendar } from 'lucide-react';

const getUserFullName = (u) => {
  return u?.full_name || u?.email || 'Unknown User';
};

const QuestionCard = ({ question, user, onQuestionClick, onUpvote, upvoting }) => {
  const isUpvoted = question.upvotes.some(uv => uv.user_id === user.id);

  return (
    <div className="post-card">
      <div
        onClick={() => onQuestionClick(question)}
        style={{ cursor: 'pointer' }}
      >
        <h3 className="post-card-title">{question.title}</h3>
        
        {/* Author and Date */}
        <div className="post-card-meta mb-3">
          <div className="meta-icon">
            <User size={16} />
            <span>Asked by {getUserFullName(question.users)}</span>
          </div>
          <div className="meta-icon">
            <Clock size={16} />
            <span>{new Date(question.created_at).toLocaleString()}</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="post-card-stats">
          <div className="stat-item">
            <MessageSquare size={16} />
            <span className="stat-value">{question.replies?.length || 0}</span>
            <span className="stat-label">Replies</span>
          </div>
          
          <div className="stat-item">
            <ThumbsUp size={16} />
            <span className="stat-value">{question.upvotes.length}</span>
            <span className="stat-label">Upvotes</span>
          </div>
          
          {/* Upvote Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent modal from opening
              onUpvote(question.id);
            }}
            disabled={upvoting === question.id}
            className={`meta-icon upvote-button ${isUpvoted ? 'active' : ''}`}
          >
            <ThumbsUp size={16} />
            <span>{upvoting === question.id ? 'Updating...' : 'Upvote'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;