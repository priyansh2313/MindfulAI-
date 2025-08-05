// src/pages/SleepTrackerPage.tsx

import React, { useState } from 'react';
import { SleepData, SleepAnalysis } from '../types/sleep';
import SleepInputForm from '../components/SleepInputForm';
import SleepAnalysisDisplay from '../components/SleepAnalysisDisplay';
import ImprovementTips from '../components/ImprovementTips';

// Dummy function to simulate data analysis
const analyzeSleepData = (data: SleepData): SleepAnalysis => {
  // In a real app, you'd calculate this properly.
  // For our dummy version, we'll return fixed data.
  return {
    totalDuration: "8 hours and 0 minutes",
    quality: data.quality,
    deepSleep: "1 hr 45 min (22%)",
    lightSleep: "4 hr 5 min (51%)",
    remSleep: "2 hr 10 min (27%)",
  };
};


const SleepTrackerPage: React.FC = () => {
  // State to hold the final analysis results
  const [analysis, setAnalysis] = useState<SleepAnalysis | null>(null);

  // This function will be passed to the form component
  const handleSleepLog = (data: SleepData) => {
    const analysisResult = analyzeSleepData(data);
    setAnalysis(analysisResult);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Conditional Rendering: Show form or analysis */}
        {!analysis ? (
          <>
            <h1 className="text-3xl font-bold mb-2 text-green-400">Sleep Tracker</h1>
            <p className="text-gray-400 mb-6">Log your sleep to get personalized insights.</p>
            <SleepInputForm onLogSleep={handleSleepLog} />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2 text-green-400">Your Sleep Analysis</h1>
            <p className="text-gray-400 mb-6">Here's the breakdown of your last sleep session.</p>
            <SleepAnalysisDisplay data={analysis} />
            <ImprovementTips />
            <button 
              onClick={() => setAnalysis(null)}
              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Log Another Night
            </button>
          </>
        )}
        
      </div>
    </div>
  );
};

export default SleepTrackerPage;