import { Activity, Book, Brain, ClipboardCheck, Image, MessageSquareHeart, Moon, Music, Users } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const services = [
  { title: 'Evaluation Test', desc: 'Take an assessment', icon: <ClipboardCheck size={48} />, path: '/evaluation' },
  { title: 'Journal', desc: 'Record your thoughts', icon: <Book size={48} />, path: '/journal' },
  { title: 'Community Chat', desc: 'Connect with others', icon: <Users size={48} />, path: '/community' },
  { title: 'Peaceful Music', desc: 'Listen to calming sounds', icon: <Music size={48} />, path: '/music' },
  { title: 'Mindful Assistant', desc: 'Get AI support', icon: <MessageSquareHeart size={48} />, path: '/assistant' },
  { title: 'Encyclopedia', desc: 'Learn about mental health', icon: <Brain size={48} />, path: '/encyclopedia' },
  { title: 'Daily Activities', desc: 'Mindfulness exercises', icon: <Activity size={48} />, path: '/daily-activities' },
  { title: 'Image Analyzer', desc: 'Analyze your images', icon: <Image size={48} />, path: '/image-analyzer' },
  { title: 'Sleep Cycle Analysis', desc: 'Better sleep insights', icon: <Moon size={48} />, path: '/sleep-cycle' },
];

export default function ServicesGridElder() {
  const navigate = useNavigate();
  return (
    <div className="my-8 px-4">
      <h2 className="text-3xl font-bold text-black mb-2">Our Features</h2>
      <div className="text-xl text-gray-800 mb-6">Explore what Mindful AI offers</div>
      <div className="w-full h-1 bg-gray-800 rounded mb-8" />
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {services.map(s => (
          <button
            key={s.title}
            onClick={() => navigate(s.path)}
            className="flex flex-col items-center justify-center bg-white text-black border-4 border-gray-800 rounded-2xl py-10 px-8 shadow-xl text-2xl font-bold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 min-h-[220px]"
            aria-label={s.title}
          >
            <div className="mb-4">{s.icon}</div>
            <span className="mb-2 text-2xl font-bold">{s.title}</span>
            <span className="text-lg font-normal text-gray-700">{s.desc}</span>
          </button>
        ))}
      </section>
    </div>
  );
} 