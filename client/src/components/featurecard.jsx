import React from 'react';

const features = [
  {
    title: "Post Questions & Replies",
    description: "Users can post questions and replies in a seamless conversation flow",
    icon: "💬"
  },
  {
    title: "Upvote System",
    description: "Each post can be upvoted to highlight the most helpful content",
    icon: "👍"
  },
  {
    title: "Dynamic Interface",
    description: "The interface updates dynamically with real-time interactions",
    icon: "⚡"
  }
];

const FeatureCard = () => {
  return (
    <div className="feature-grid">
      {features.map((feature, index) => (
        <div
          key={index}
          className="feature-card"
        >
          <div className="feature-icon">{feature.icon}</div>
          <h3 className="feature-title">{feature.title}</h3>
          <p className="feature-description">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCard;