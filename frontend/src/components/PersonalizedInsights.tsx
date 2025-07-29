import React, { useEffect, useState } from 'react';
import {
    Action,
    getActionEffectiveness,
    getPersonalizedInsights,
    Mood,
    TimeOfDay
} from '../utils/reinforcement';

interface InsightsData {
  bestActions: Record<Mood, Action>;
  improvementAreas: string[];
  patterns: string[];
}

export default function PersonalizedInsights() {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood>('anxious');
  const [selectedAction, setSelectedAction] = useState<Action>('music');

  useEffect(() => {
    const data = getPersonalizedInsights();
    setInsights(data);
  }, []);

  const getMoodEmoji = (mood: Mood): string => {
    const emojis: Record<Mood, string> = {
      'happy': '😊',
      'neutral': '😐',
      'sad': '😢',
      'anxious': '😟',
      'angry': '😡',
      'burnt_out': '🥵'
    };
    return emojis[mood] || '😐';
  };

  const getActionLabel = (action: Action): string => {
    const labels: Record<Action, string> = {
      'music': '🎵 Peaceful Music',
      'quote': '📝 Journal Writing',
      'breathing': '🫁 Breathing Exercises',
      'journal': '📖 Journal Prompts',
      'evaluation': '📊 Self Assessment',
      'daily-activities': '🧘 Mindfulness Activities',
      'journal_prompt': '💭 Guided Reflection'
    };
    return labels[action] || action;
  };

  const getTimeLabel = (time: TimeOfDay): string => {
    const labels: Record<TimeOfDay, string> = {
      'morning': '🌅 Morning',
      'afternoon': '☀️ Afternoon',
      'evening': '🌆 Evening',
      'night': '🌙 Night'
    };
    return labels[time];
  };

  if (!insights) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          🧠 Personalized Insights
        </h3>
        <p className="text-gray-600">Loading insights...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        🧠 Personalized Insights
      </h3>

      {/* Best Actions for Each Mood */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">
          🎯 Your Best Activities by Mood
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(insights.bestActions).map(([mood, action]) => (
            <div key={mood} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getMoodEmoji(mood as Mood)}</span>
                <span className="font-medium text-gray-800 capitalize">{mood}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {getActionLabel(action)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Effectiveness Analysis */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">
          📊 Detailed Effectiveness Analysis
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Mood:
            </label>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value as Mood)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {Object.keys(insights.bestActions).map((mood) => (
                <option key={mood} value={mood}>
                  {getMoodEmoji(mood as Mood)} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Activity:
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value as Action)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {['music', 'quote', 'breathing', 'journal', 'evaluation', 'daily-activities', 'journal_prompt'].map((action) => (
                <option key={action} value={action}>
                  {getActionLabel(action as Action)}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="font-medium text-blue-800 mb-2">
              Effectiveness for {getMoodEmoji(selectedMood)} {selectedMood} - {getActionLabel(selectedAction)}
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Overall Score:</span>
                <span className="font-medium">
                  {getActionEffectiveness(selectedMood, selectedAction).overallScore.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Success Rate:</span>
                <span className="font-medium">
                  {(getActionEffectiveness(selectedMood, selectedAction).successRate * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Uses:</span>
                <span className="font-medium">
                  {getActionEffectiveness(selectedMood, selectedAction).totalUses}
                </span>
              </div>
            </div>

            {/* Time-based Effectiveness */}
            <div className="mt-3">
              <h6 className="text-sm font-medium text-blue-700 mb-2">Time-based Effectiveness:</h6>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(getActionEffectiveness(selectedMood, selectedAction).timeEffectiveness).map(([time, score]) => (
                  <div key={time} className="flex justify-between">
                    <span>{getTimeLabel(time as TimeOfDay)}:</span>
                    <span className="font-medium">{score.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Areas */}
      {insights.improvementAreas.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-3">
            💡 Suggestions for Improvement
          </h4>
          <div className="space-y-2">
            {insights.improvementAreas.map((area, index) => (
              <div key={index} className="bg-yellow-50 rounded-lg p-3">
                <p className="text-sm text-yellow-800">{area}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patterns */}
      {insights.patterns.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-3">
            📈 Your Patterns
          </h4>
          <div className="space-y-2">
            {insights.patterns.map((pattern, index) => (
              <div key={index} className="bg-green-50 rounded-lg p-3">
                <p className="text-sm text-green-800">{pattern}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          💡 These insights are based on your usage patterns and feedback. 
          The more you use the app, the more personalized your recommendations become!
        </p>
      </div>
    </div>
  );
} 