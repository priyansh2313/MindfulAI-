import React, { useEffect, useState } from 'react';

export default function Hero() {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const s = localStorage.getItem('evaluationScore');
    setScore(s ? parseInt(s) : null);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%2306b6d4" stop-opacity="0.1"/><stop offset="100%" stop-color="%2306b6d4" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="%2310b981"/><circle cx="300" cy="200" r="150" fill="%2322c55e" opacity="0.3"/><circle cx="900" cy="300" r="200" fill="%2316a34a" opacity="0.2"/><circle cx="600" cy="600" r="180" fill="%23158e3d" opacity="0.25"/><circle cx="150" cy="500" r="120" fill="%2322c55e" opacity="0.2"/><circle cx="1000" cy="150" r="100" fill="%2316a34a" opacity="0.3"/><circle cx="800" cy="650" r="140" fill="%23158e3d" opacity="0.2"/></svg>')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Main Content */}
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              Find Your Inner Peace in a Busy World
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90 max-w-2xl">
              Your journey to emotional wellness begins with a single step. Discover a calmer, more balanced you through our guided mindfulness practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-nature-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors border-2 border-white">
                Get Started
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-nature-700 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Side - Wellness Score (if available) */}
          {score !== null && (
            <div className="lg:flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">{score}</span>
                  </div>
                  <h3 className="text-white font-display font-semibold text-xl mb-2">Your Wellness Score</h3>
                  <p className="text-white/80">
                    {score >= 80 ? 'Excellent - You\'re flourishing!' : 
                     score >= 60 ? 'Good - Keep growing!' : 
                     score >= 40 ? 'Fair - Every step counts.' : 'Let\'s nurture your wellness together.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}