import { Activity, Book, Brain, ClipboardCheck, Heart, MessageSquareHeart, Music, Sparkles, Users } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore

const assessmentServices = [
  { title: 'Evaluation Test', desc: 'Take a comprehensive mental wellness assessment', icon: <ClipboardCheck className="w-6 h-6" />, path: '/evaluation' },
  { title: 'Mindful Assistant', desc: 'Get personalized AI support and guidance', icon: <MessageSquareHeart className="w-6 h-6" />, path: '/assistant' },
];

const wellnessServices = [
  { title: 'Journal', desc: 'Record your thoughts and track your journey', icon: <Book className="w-6 h-6" />, path: '/journal' },
  { title: 'Community Chat', desc: 'Connect with others on similar paths', icon: <Users className="w-6 h-6" />, path: '/community' },
  { title: 'Peaceful Music', desc: 'Listen to calming sounds and meditation', icon: <Music className="w-6 h-6" />, path: '/music' },
  { title: 'Encyclopedia', desc: 'Learn about mental health and wellness', icon: <Brain className="w-6 h-6" />, path: '/encyclopedia' },
  { title: 'Daily Activities', desc: 'Mindfulness exercises and practices', icon: <Activity className="w-6 h-6" />, path: '/daily-activities' },
];

export default function ServicesGrid({ onCardHover, onCardLeave }: { onCardHover?: (title: string) => void, onCardLeave?: () => void }) {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-12">
      {/* Assessment & Analysis Section */}
      <div>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-nature-400 to-nature-600 rounded-full flex items-center justify-center shadow-nature">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-nature-800 mb-2">
            Assessment & Analysis
          </h2>
          <p className="text-nature-600 max-w-2xl mx-auto">
            Understand your mental wellness journey through comprehensive assessments and AI-powered insights
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {assessmentServices.map(service => (
            <div
              key={service.title}
              className="nature-card p-6 hover:shadow-nature-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(service.path)}
              onMouseEnter={() => onCardHover && onCardHover(service.title)}
              onMouseLeave={() => onCardLeave && onCardLeave()}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-nature-100 to-nature-200 rounded-xl flex items-center justify-center mb-4">
                <div className="text-nature-600">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-display font-semibold text-nature-800 mb-3">{service.title}</h3>
              <p className="text-nature-600 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness & Healing Section */}
      <div>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-nature-400 to-nature-600 rounded-full flex items-center justify-center shadow-nature">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-nature-800 mb-2">
            Wellness & Healing
          </h2>
          <p className="text-nature-600 max-w-2xl mx-auto">
            Nurture your mental health through guided practices, community support, and therapeutic activities
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wellnessServices.map(service => (
            <div
              key={service.title}
              className="nature-card p-6 hover:shadow-nature-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(service.path)}
              onMouseEnter={() => onCardHover && onCardHover(service.title)}
              onMouseLeave={() => onCardLeave && onCardLeave()}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-nature-100 to-nature-200 rounded-xl flex items-center justify-center mb-4">
                <div className="text-nature-600">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-display font-semibold text-nature-800 mb-3">{service.title}</h3>
              <p className="text-nature-600 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}