// src/components/DashboardFooter.tsx
import { Brain, Heart, Sparkles, Leaf, TreePine } from "lucide-react";
import React from "react";

const DashboardFooter = () => {
  return (
    <footer className="bg-white/90 backdrop-blur-sm border-t border-nature-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-nature-400 to-nature-600 rounded-xl flex items-center justify-center shadow-nature">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-nature-800">Mindful</h3>
                <p className="text-sm text-nature-500">Your path to emotional wellness</p>
              </div>
            </div>
            <p className="text-nature-600 mb-6 max-w-md leading-relaxed">
              Empowering mental wellness through AI-driven personalized care and support. 
              Your journey to emotional wellness begins with a single step, like planting seeds of peace.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-nature-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/dashboard" className="text-nature-600 hover:text-nature-700 transition-colors">Dashboard</a></li>
              <li><a href="/profile" className="text-nature-600 hover:text-nature-700 transition-colors">My Profile</a></li>
              <li><a href="/journal" className="text-nature-600 hover:text-nature-700 transition-colors">Journal</a></li>
              <li><a href="/music" className="text-nature-600 hover:text-nature-700 transition-colors">Music Therapy</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-nature-800 mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="/help" className="text-nature-600 hover:text-nature-700 transition-colors">Help Center</a></li>
              <li><a href="/contact" className="text-nature-600 hover:text-nature-700 transition-colors">Contact Us</a></li>
              <li><a href="/privacy" className="text-nature-600 hover:text-nature-700 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-nature-600 hover:text-nature-700 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-nature-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-nature-500 text-sm">
              © 2024 Mindful. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-2 text-nature-500 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Developed with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>by Team MindfulAI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
