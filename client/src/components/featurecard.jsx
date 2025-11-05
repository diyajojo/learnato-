import React from 'react';

const features = [
  {
    title: "Ask & Answer",
    description: "Post your toughest questions to the community and share your insights to help others learn.",
    icon: "💬"
  },
  {
    title: "Smart Upvoting",
    description: "Upvote the most helpful answers and questions to highlight the best content for everyone.",
    icon: "👍"
  },
  {
    title: "Instant AI Summaries",
    description: "Get a quick summary of any long question or discussion thread with the built-in Learnato AI.",
    icon: "🤖"
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