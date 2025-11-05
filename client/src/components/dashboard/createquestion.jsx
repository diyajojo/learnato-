import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

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

      onQuestionCreated(data.post || data);
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

export default CreateQuestionForm;