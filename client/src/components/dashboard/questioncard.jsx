import React from 'react';
import { User, MessageSquare, ThumbsUp } from 'lucide-react';

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
              onUpvote(question.id);
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
};

export default QuestionCard;