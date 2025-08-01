import {
    Activity,
    ArrowRight,
    Book, Brain,
    CheckCircle,
    ClipboardCheck,
    Heart,
    Lightbulb,
    MessageSquareHeart, Music,
    Sparkles,
    Target,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('assessment');

  const features = {
    assessment: {
      title: "Assessment & Analysis",
      subtitle: "Understand Your Mental Wellness Journey",
      icon: <Sparkles className="w-8 h-8" />,
      color: "from-nature-400 to-nature-600",
      features: [
        {
          title: "Evaluation Test",
          description: "Take a comprehensive mental wellness assessment to understand your current state",
          benefits: [
            "Identify areas of strength and growth",
            "Get personalized insights about your mental health",
            "Track your progress over time",
            "Receive evidence-based recommendations"
          ],
          icon: <ClipboardCheck className="w-6 h-6" />,
          action: () => navigate('/evaluation')
        },
        {
          title: "Mindful Assistant",
          description: "Get personalized AI support and guidance for your mental wellness journey",
          benefits: [
            "24/7 AI-powered mental health support",
            "Personalized conversations and guidance",
            "Crisis intervention and immediate help",
            "Evidence-based therapeutic techniques"
          ],
          icon: <MessageSquareHeart className="w-6 h-6" />,
          action: () => navigate('/assistant')
        }
      ]
    },
    wellness: {
      title: "Wellness & Healing",
      subtitle: "Nurture Your Mental Health Through Guided Practices",
      icon: <Heart className="w-8 h-8" />,
      color: "from-nature-500 to-nature-700",
      features: [
        {
          title: "Journal",
          description: "Record your thoughts and track your emotional journey",
          benefits: [
            "Express and process your emotions safely",
            "Track patterns in your mood and thoughts",
            "Gain insights into your mental health journey",
            "Build self-awareness and emotional intelligence"
          ],
          icon: <Book className="w-6 h-6" />,
          action: () => navigate('/journal')
        },
        {
          title: "Community Chat",
          description: "Connect with others on similar mental wellness journeys",
          benefits: [
            "Find support from people who understand",
            "Share experiences and learn from others",
            "Build meaningful connections",
            "Reduce feelings of isolation"
          ],
          icon: <Users className="w-6 h-6" />,
          action: () => navigate('/community')
        },
        {
          title: "Peaceful Music",
          description: "Listen to calming sounds and guided meditation",
          benefits: [
            "Reduce stress and anxiety instantly",
            "Improve sleep quality and relaxation",
            "Enhance focus and concentration",
            "Create a peaceful environment"
          ],
          icon: <Music className="w-6 h-6" />,
          action: () => navigate('/music')
        },
        {
          title: "Encyclopedia",
          description: "Learn about mental health and wellness topics",
          benefits: [
            "Understand mental health conditions",
            "Learn coping strategies and techniques",
            "Access evidence-based information",
            "Empower yourself with knowledge"
          ],
          icon: <Brain className="w-6 h-6" />,
          action: () => navigate('/encyclopedia')
        },
        {
          title: "Daily Activities",
          description: "Practice mindfulness exercises and therapeutic activities",
          benefits: [
            "Build healthy daily routines",
            "Develop mindfulness and presence",
            "Improve emotional regulation",
            "Enhance overall well-being"
          ],
          icon: <Activity className="w-6 h-6" />,
          action: () => navigate('/daily-activities')
        }
      ]
    }
  };

  return (
    <div className="min-h-screen nature-gradient">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-nature-800 mb-4">
              How Mindful AI Works
            </h1>
            <p className="text-xl text-nature-600 max-w-3xl mx-auto leading-relaxed">
              Discover how each feature of Mindful AI is designed to support your mental wellness journey 
              and help you find inner peace in a busy world.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-nature-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {Object.entries(features).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`py-4 px-6 font-medium transition-colors border-b-2 ${
                  activeSection === key
                    ? 'text-nature-800 border-nature-500'
                    : 'text-nature-600 border-transparent hover:text-nature-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {section.icon}
                  <span>{section.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${features[activeSection].color} rounded-full flex items-center justify-center shadow-nature`}>
                {features[activeSection].icon}
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-nature-800 mb-4">
              {features[activeSection].title}
            </h2>
            <p className="text-lg text-nature-600 max-w-2xl mx-auto">
              {features[activeSection].subtitle}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {features[activeSection].features.map((feature, index) => (
              <div key={index} className="nature-card p-8 hover:shadow-nature-lg transition-shadow duration-300">
                {/* Feature Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-nature-100 to-nature-200 rounded-xl flex items-center justify-center">
                    <div className="text-nature-600">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-semibold text-nature-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-nature-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="mb-6">
                  <h4 className="font-semibold text-nature-800 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 text-nature-500 mr-2" />
                    How This Helps You:
                  </h4>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-nature-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-nature-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  onClick={feature.action}
                  className="w-full bg-gradient-to-r from-nature-500 to-nature-600 text-white px-6 py-3 rounded-lg font-medium hover:from-nature-600 hover:to-nature-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Try {feature.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* How It All Works Together */}
        <div className="mt-16 nature-card p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-nature-400 to-nature-600 rounded-full flex items-center justify-center shadow-nature">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold text-nature-800 mb-4">
              How It All Works Together
            </h3>
            <p className="text-nature-600 max-w-3xl mx-auto">
              Mindful AI is designed as a comprehensive mental wellness ecosystem. Start with assessment to understand your needs, 
              then use our healing tools to nurture your mental health. Each feature complements the others to provide 
              a complete wellness experience.
            </p>
          </div>

          {/* Journey Flow */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-nature-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-nature-600" />
              </div>
              <h4 className="font-semibold text-nature-800 mb-2">1. Assess</h4>
              <p className="text-sm text-nature-600">Understand your current mental wellness state</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-nature-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-nature-600" />
              </div>
              <h4 className="font-semibold text-nature-800 mb-2">2. Heal</h4>
              <p className="text-sm text-nature-600">Use our tools to nurture your mental health</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-nature-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-nature-600" />
              </div>
              <h4 className="font-semibold text-nature-800 mb-2">3. Thrive</h4>
              <p className="text-sm text-nature-600">Build lasting wellness habits and grow</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 