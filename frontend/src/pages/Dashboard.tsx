import { Brain, Flower2, Heart, Leaf, Sparkles, Sun, TreePine } from 'lucide-react';
import React, { useState } from 'react';
import EvaluationCard from '../components/EvaluationCard';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LearningSummaryCard from '../components/LearningSummaryCard';
import Recommendations from '../components/Recommendations';
import ServicesGrid from '../components/ServicesGrid';
import WellnessActivitiesSummary from '../components/Widgets/WellnessActivitiesSummary';
import FloatingChatbot from './FloatingChatbot';
import FloatingLeaves from './FloatingLeaves';

export default function Dashboard() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile on mount
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen nature-gradient relative overflow-hidden">
      {/* Nature Background Elements */}
      <div className="absolute inset-0 bg-leaf-pattern opacity-30"></div>
      
      {/* Floating Nature Elements */}
      <div className="absolute top-20 left-10 floating-element">
        <Leaf className="w-8 h-8 text-nature-400 opacity-60" />
      </div>
      <div className="absolute top-40 right-16 floating-element" style={{ animationDelay: '2s' }}>
        <Flower2 className="w-6 h-6 text-nature-300 opacity-50" />
      </div>
      <div className="absolute bottom-40 left-20 floating-element" style={{ animationDelay: '4s' }}>
        <TreePine className="w-10 h-10 text-nature-500 opacity-40" />
      </div>
      
      <FloatingLeaves />
      <Header />
      <Hero />
      
      {/* Services Section */}
      <section className="px-4 py-12 md:px-8 lg:px-12 relative z-10">
        <ServicesGrid
          onCardHover={setHoveredService}
          onCardLeave={() => setHoveredService(null)}
        />
      </section>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:px-8 lg:px-12 relative z-10">
        
        {/* Hero Section - Nature Inspired */}
        <section className="mb-16 animate-fade-in">
          <div className="nature-card p-8 md:p-12 relative overflow-hidden">
            {/* Nature Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-nature-50/50 to-nature-100/50"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-nature-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-nature-300/20 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-nature-400 to-nature-600 rounded-full flex items-center justify-center shadow-nature">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-nature-800 mb-6 leading-tight">
                Find Your Inner Peace
              </h1>
              <p className="text-xl md:text-2xl text-nature-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Your journey to emotional wellness begins with a single step. Discover a calmer, more balanced you through our guided mindfulness practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="nature-button">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started
                </button>
                <button className="nature-button-outline">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How We Help You Thrive Section */}
        <section className="mb-16 animate-slide-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-nature-800 mb-4">
              How We Help You Thrive
            </h2>
            <p className="text-lg text-nature-600 max-w-2xl mx-auto leading-relaxed">
              Our holistic approach to emotional wellness combines modern techniques with ancient wisdom, 
              creating a nurturing environment for your mental health journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Mindfulness Practices Card */}
            <div className="nature-card p-6 hover:shadow-nature-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-nature-100 to-nature-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sun className="w-6 h-6 text-nature-600" />
              </div>
              <h3 className="text-xl font-display font-semibold text-nature-800 mb-3">Mindfulness Practices</h3>
              <p className="text-nature-600 leading-relaxed">
                Guided meditation and breathing exercises to help you stay present and reduce anxiety. 
                Connect with your inner self through nature-inspired practices.
              </p>
            </div>

            {/* Reflective Journaling Card */}
            <div className="nature-card p-6 hover:shadow-nature-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-nature-100 to-nature-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-nature-600" />
              </div>
              <h3 className="text-xl font-display font-semibold text-nature-800 mb-3">Reflective Journaling</h3>
              <p className="text-nature-600 leading-relaxed">
                Document your thoughts and feelings to gain insights into your emotional patterns. 
                Track your growth like the changing seasons.
              </p>
            </div>

            {/* Progress Tracking Card */}
            <div className="nature-card p-6 hover:shadow-nature-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-nature-100 to-nature-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TreePine className="w-6 h-6 text-nature-600" />
              </div>
              <h3 className="text-xl font-display font-semibold text-nature-800 mb-3">Progress Tracking</h3>
              <p className="text-nature-600 leading-relaxed">
                Visualize your emotional wellness journey with intuitive analytics and insights. 
                Watch your progress grow like a flourishing garden.
              </p>
            </div>
          </div>
        </section>

        {/* Analytics & Insights Section */}
        <section className="mb-16 animate-slide-up">
          <div className="nature-card p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-nature-400 to-nature-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-nature-800 mb-2">
                📊 Analytics & Insights
              </h2>
              <p className="text-nature-600">
                Track your mental wellness journey with detailed analytics
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-nature-50 to-nature-100 rounded-xl p-6 border border-nature-200/50">
                  <h3 className="text-xl font-display font-semibold text-nature-800 mb-4">Your Evaluation Summary</h3>
                  <div className="bg-white rounded-lg p-4 shadow-soft">
                    <EvaluationCard />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-nature-50 to-nature-100 rounded-xl p-6 border border-nature-200/50">
                  <h3 className="text-xl font-display font-semibold text-nature-800 mb-4">Mental Health Analytics</h3>
                  <div className="bg-white rounded-lg p-4 shadow-soft">
                    <LearningSummaryCard />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wellness Activities Summary Section */}
        <section className="mb-16 animate-slide-up">
          <div className="nature-card p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-nature-400 to-nature-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-nature-800 mb-2">
                🌟 Your Wellness Journey
              </h2>
              <p className="text-nature-600">
                Discover which activities work best for you and track your wellness patterns
              </p>
            </div>
            <WellnessActivitiesSummary />
          </div>
        </section>

        {/* Testimonial Section - Nature Inspired */}
        <section className="mb-16 animate-slide-up">
          <div className="bg-gradient-to-r from-nature-300 to-nature-400 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-nature-pattern opacity-10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="text-center max-w-4xl mx-auto relative z-10">
              <div className="text-6xl text-nature-100 mb-6 font-handwriting">"</div>
              <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                Since I started using Mindful, I've noticed a significant improvement in how I handle stress. 
                The daily mindfulness exercises have become an essential part of my routine, like tending to a garden.
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-nature-600 font-semibold">SJ</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-nature-100">Wellness Enthusiast</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Recommendations Section */}
        <section className="mb-16 animate-slide-up">
          <div className="nature-card p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-nature-400 to-nature-600 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-nature-800 mb-2">
                🌟 AI Recommendations
              </h2>
              <p className="text-nature-600">
                Get personalized recommendations for your wellness journey
              </p>
            </div>
            <Recommendations />
          </div>
        </section>

        {/* Call to Action Section - Nature Inspired */}
        <section className="mb-16 animate-slide-up">
          <div className="bg-gradient-to-r from-nature-500 to-nature-700 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-nature-pattern opacity-10"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 -translate-x-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 translate-x-12"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Begin Your Wellness Journey Today
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Join thousands who have transformed their emotional well-being with our science-backed approach. 
                Your path to inner peace starts here.
              </p>
              <button className="bg-white text-nature-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-nature-50 transition-all duration-300 hover:scale-105 shadow-nature">
                <Sparkles className="w-5 h-5 mr-2 inline" />
                Get Started Now
              </button>
            </div>
          </div>
        </section>
      </div>

      <FloatingChatbot
        isOpen={chatbotOpen}
        onToggle={() => setChatbotOpen(!chatbotOpen)}
        mode="dashboard"
        hoveredSection={hoveredService}
      />
    </div>
  );
}
