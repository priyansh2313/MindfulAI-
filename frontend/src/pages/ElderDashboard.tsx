import React, { useState } from 'react';
import EvaluationCardElder from '../components/EvaluationCardElder';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LearningSummaryCard from '../components/LearningSummaryCard';
import Recommendations from '../components/Recommendations';
import ServicesGridElder from '../components/ServicesGridElder';
import VoiceAssistant from '../components/VoiceAssistant';
import ActionEffectivenessWidget from '../components/Widgets/ActionEffectivenessWidget';
import MoodWidget from '../components/Widgets/MoodWidget';
import ProgressWidget from '../components/Widgets/ProgressWidget';
import TipWidget from '../components/Widgets/TipWidget';
import FloatingLeaves from './FloatingLeaves';

export default function ElderDashboard() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  return (
    <div
      className="min-h-screen bg-white text-black text-2xl"
      style={{ border: '4px solid #222', padding: '2rem 0' }}
    >
      <FloatingLeaves />
      <Header />
      <Hero />
      <div className="mb-80" /> {/* This creates the gap BELOW the grid */}
      <ServicesGridElder />
      <div className="mb-16" /> {/* This creates the gap BELOW the grid */}
      <section className="flex flex-wrap gap-8 justify-center my-8">
        <h1>Your Analytics</h1>
        <div className="bg-white text-black text-2xl rounded-2xl border-4 border-gray-800 p-50 mb-10 text-center">
          <EvaluationCardElder />
        </div>
        <div className="bg-white text-black text-2xl rounded-2xl border-4 border-gray-800 p-8 mb-8 text-center">
          <LearningSummaryCard />
        </div>
      </section>
      <section className="flex flex-wrap gap-8 justify-center my-8">
        <div className="bg-white text-black text-2xl rounded-2xl border-4 border-gray-800 p-8 mb-8 text-center">
          <MoodWidget />
        </div>
        <div className="bg-white text-black text-2xl rounded-2xl border-4 border-gray-800 p-8 mb-8 text-center">
          <ActionEffectivenessWidget />
        </div>
        <div className="bg-white text-black text-2xl rounded-2xl border-4 border-gray-800 p-8 mb-8 text-center">
          <ProgressWidget />
        </div>
        <div className="bg-white text-black text-2xl rounded-2xl border-4 border-gray-800 p-8 mb-8 text-center">
          <TipWidget />
        </div>
        <div className="bg-white text-black text-2xl rounded-2xl border-4 border-gray-800 p-8 mb-8 text-center">
          <Recommendations />
        </div>
      </section>
      <div className="flex justify-center mt-8">
        <button
          className="py-4 px-6 bg-black text-white text-lg rounded-2xl font-bold border-2 border-gray-800 hover:bg-gray-900 transition-colors mr-4"
        >
          Main Action
        </button>
        <button
          className="py-4 px-6 bg-white text-black text-lg rounded-2xl font-bold border-2 border-gray-800 hover:bg-gray-100 transition-colors"
        >
          Secondary Action
        </button>
      </div>
      
      <VoiceAssistant />
    </div>
  );
} 