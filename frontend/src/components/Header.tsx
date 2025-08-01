import { Heart, Leaf, Menu, Shield, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleFindSupportNearby = () => {
    // Open Google Maps with mental health professionals search
    const searchQuery = encodeURIComponent('mental health professionals near me');
    window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
  };

  const handleMyProfile = () => {
    navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-nature-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-nature-800">Mindful AI</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-nature-800 font-medium border-b-2 border-nature-500 pb-1">Home</a>
            <a href="#" className="text-nature-600 hover:text-nature-800 transition-colors">How It Works</a>
            <a href="#" className="text-nature-600 hover:text-nature-800 transition-colors">Features</a>
            <a href="#" className="text-nature-600 hover:text-nature-800 transition-colors">Contact</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handleFindSupportNearby}
              className="flex items-center space-x-2 text-nature-600 hover:text-nature-800 transition-colors"
            >
              <Shield size={16} />
              <span>Find Support Nearby</span>
            </button>
            <button 
              onClick={handleMyProfile}
              className="flex items-center space-x-2 text-nature-600 hover:text-nature-800 transition-colors"
            >
              <Heart size={16} />
              <span>My Profile</span>
            </button>
            
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-nature-600 hover:text-nature-800 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-nature-100">
          <div className="px-4 py-6 space-y-4">
            <a href="#" className="block text-nature-800 font-medium border-b-2 border-nature-500 pb-1">Home</a>
            <a href="#" className="block text-nature-600 hover:text-nature-800 transition-colors">How It Works</a>
            <a href="#" className="block text-nature-600 hover:text-nature-800 transition-colors">Features</a>
            <a href="#" className="block text-nature-600 hover:text-nature-800 transition-colors">Contact</a>
            <div className="pt-4 border-t border-nature-100 space-y-3">
              <button 
                onClick={handleFindSupportNearby}
                className="flex items-center space-x-3 text-nature-600 hover:text-nature-800 transition-colors py-2 w-full text-left"
              >
                <Shield size={20} />
                <span>Find Support Nearby</span>
              </button>
              <button 
                onClick={handleMyProfile}
                className="flex items-center space-x-3 text-nature-600 hover:text-nature-800 transition-colors py-2 w-full text-left"
              >
                <Heart size={20} />
                <span>My Profile</span>
              </button>
              <button className="block w-full text-left text-nature-600 hover:text-nature-800 transition-colors py-2">
                Sign In
              </button>
              
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;