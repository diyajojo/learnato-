import React from 'react';

const features = [
  {
    title: "Upload syllabi and notes",
    description: "Upload your course materials and get instant smart content analysis to organize your study materials effectively",
    icon: "📚"
  },
  {
    title: "Generate important questions",
    description: "AI-powered system creates personalized important questions based on your learning materials",
    icon: "🎯"
  },
  {
    title: "Sync with Google Calendar",
    description: "Seamlessly integrate your study schedule with Google Calendar for organized study sessions",
    icon: "📅"
  },
  {
    title: "Optimize study time",
    description: "Smart scheduling algorithms optimize your study time with personalized recommendations",
    icon: "⏰"
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