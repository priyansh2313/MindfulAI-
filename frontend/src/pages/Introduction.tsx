import { ArrowRight, Brain, CheckCircle, Flower2, Heart, Leaf, Shield, Sparkles, Star, Target, TreePine } from "lucide-react";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Introduction() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showConsent, setShowConsent] = useState(false);

  const steps = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Insights",
      description: "Advanced machine learning analyzes your patterns to provide personalized recommendations",
      color: "from-nature-400 to-nature-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Emotional Intelligence",
      description: "Understand your emotions with cutting-edge sentiment analysis and mood tracking",
      color: "from-nature-500 to-nature-700"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your data is encrypted and secure. Your mental health journey is private",
      color: "from-nature-600 to-nature-800"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Care",
      description: "Get recommendations tailored specifically to your unique needs and preferences",
      color: "from-nature-700 to-nature-900"
    }
  ];

  const handleStart = () => {
    setShowConsent(true);
  };

  const handleConsent = () => {
    setTimeout(() => navigate("/questionnaire"), 500);
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <div className="min-h-screen nature-gradient relative overflow-hidden">
      {/* Nature Background Elements */}
      <div className="absolute inset-0 bg-leaf-pattern opacity-20"></div>
      
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
      <div className="absolute top-1/2 right-10 floating-element" style={{ animationDelay: '1s' }}>
        <Sparkles className="w-6 h-6 text-nature-400 opacity-70" />
      </div>
      <div className="absolute bottom-20 right-20 floating-element" style={{ animationDelay: '3s' }}>
        <Star className="w-5 h-5 text-nature-300 opacity-60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md shadow-nature">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-nature-400 to-nature-600 rounded-xl flex items-center justify-center shadow-nature">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-display font-bold text-nature-800">Mindful AI</h1>
                  <p className="text-sm text-nature-600">Mental Wellness Revolution</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Main Hero */}
            <div className="mb-16">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-nature-400 to-nature-600 rounded-full flex items-center justify-center shadow-nature animate-gentle-bounce">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-nature-800 mb-6 leading-tight">
                Your Mental Health
                <span className="block bg-gradient-to-r from-nature-500 to-nature-700 bg-clip-text text-transparent">
                  Revolutionized
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-nature-600 max-w-4xl mx-auto mb-12 leading-relaxed">
                Experience the future of mental wellness with AI-powered insights, 
                personalized care, and cutting-edge technology designed just for you.
              </p>

              {/* Stats */}
              <div className="flex justify-center space-x-12 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-nature-600">99.9%</div>
                  <div className="text-sm text-nature-500">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-nature-600">24/7</div>
                  <div className="text-sm text-nature-500">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-nature-600">AI</div>
                  <div className="text-sm text-nature-500">Powered</div>
                </div>
              </div>
            </div>

            {/* Interactive Steps */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-nature-800 mb-8">
                How It Works
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`nature-card p-6 cursor-pointer transition-all duration-300 ${
                      currentStep === index ? 'ring-2 ring-nature-400 shadow-nature-lg' : 'hover:shadow-nature-lg'
                    }`}
                    onClick={() => handleStepClick(index)}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4`}>
                      <div className="text-white">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-display font-semibold text-nature-800 mb-3">{step.title}</h3>
                    <p className="text-nature-600 text-sm leading-relaxed">{step.description}</p>
                    
                    {/* Progress Indicator */}
                    <div className="mt-4">
                      <div className="w-full bg-nature-100 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${step.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: currentStep === index ? '100%' : '0%' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="nature-card p-8 md:p-12 max-w-2xl mx-auto">
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-nature-800 mb-4">
                  Ready to Transform Your Mental Wellness?
                </h3>
                <p className="text-nature-600 mb-8 leading-relaxed">
                  Join thousands of users who have discovered inner peace and emotional balance 
                  through our revolutionary AI-powered platform.
                </p>
                
                <button 
                  className="bg-gradient-to-r from-nature-500 to-nature-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-nature-600 hover:to-nature-700 transition-colors duration-300 flex items-center space-x-3 mx-auto"
                  onClick={handleStart}
                >
                  <span>Begin Your Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <p className="text-sm text-nature-500 mt-4">
                  Free • Secure • Personalized
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consent Modal */}
      {showConsent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="nature-card p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-nature-400 to-nature-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold text-nature-800 mb-2">Privacy & Consent</h3>
              <p className="text-nature-600">
                We're committed to protecting your privacy. Your data is encrypted and secure.
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-nature-500" />
                <span className="text-nature-700">End-to-end encryption</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-nature-500" />
                <span className="text-nature-700">Anonymous assessment</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-nature-500" />
                <span className="text-nature-700">Instant insights</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                className="flex-1 border-2 border-nature-300 text-nature-600 px-4 py-3 rounded-lg font-medium hover:bg-nature-50 transition-colors"
                onClick={() => setShowConsent(false)}
              >
                Learn More
              </button>
              <button 
                className="flex-1 bg-gradient-to-r from-nature-500 to-nature-600 text-white px-4 py-3 rounded-lg font-medium hover:from-nature-600 hover:to-nature-700 transition-colors"
                onClick={handleConsent}
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
