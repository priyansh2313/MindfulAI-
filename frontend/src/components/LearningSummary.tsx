import React, { useEffect, useState } from "react";
import { Action, flushFeedbackToQ, initQTable, Mood } from "../utils/reinforcement";

const moods: Mood[] = ["happy", "neutral", "sad", "anxious"];
const actions: Action[] = [
  "music",
  "quote",
  "breathing",
  "journal",
  "evaluation",
  "daily-activities",
  "journal_prompt"
];

// User-friendly action labels
const actionLabels: Record<string, string> = {
  'music': '🎵 Music',
  'quote': '📝 Journal',
  'breathing': '🫁 Breathing',
  'journal': '📖 Prompts',
  'evaluation': '📊 Assessment',
  'daily-activities': '🧘 Activities',
  'journal_prompt': '💭 Reflection'
};

export default function LearningSummary() {
  const [qTable, setQTable] = useState(() => initQTable());

  useEffect(() => {
    const updated = flushFeedbackToQ(qTable);
    setQTable({ ...updated });
  }, []);

  return (
    <div className="w-full mx-auto p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-gray-800 to-slate-700 shadow-2xl border border-gray-700 relative overflow-hidden">
      <h2 className="text-xl font-bold text-center text-cyan-300 mb-4 tracking-wide">
        🧠 AI Learning Matrix
      </h2>
      
      <p className="text-center text-gray-300 mb-6 text-sm">
        This shows how effective different activities are for each mood state. Higher scores (0.8+) indicate better effectiveness.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 border border-gray-600 text-left font-semibold text-cyan-300 min-w-[120px]">
                Mood State
              </th>
              {actions.map((action) => (
                <th
                  key={action}
                  className="px-4 py-3 border border-gray-600 text-center font-medium text-gray-300 min-w-[140px]"
                >
                  {actionLabels[action]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {moods.map((mood) => {
              const moodRow = qTable[mood];
              if (!moodRow) {
                return (
                  <tr key={mood} className="hover:bg-gray-700/50">
                    <td className="px-4 py-3 border border-gray-700 font-semibold text-gray-300">
                      {getMoodDisplay(mood)}
                    </td>
                    {actions.map((action) => (
                      <td
                        key={action}
                        className="px-4 py-3 border border-gray-700 text-gray-500 text-center"
                      >
                        No data
                      </td>
                    ))}
                  </tr>
                );
              }

              const bestAction = Object.entries(moodRow).reduce(
                (best, [action, value]) => (value > best[1] ? [action, value] : best),
                ["" as Action, -Infinity]
              )[0];

              return (
                <tr key={mood} className="hover:bg-gray-700/50">
                  <td className="px-4 py-3 border border-gray-700 font-semibold text-gray-300">
                    {getMoodDisplay(mood)}
                  </td>
                  {actions.map((action) => {
                    const value = moodRow[action];
                    let bgColor = "bg-gray-800 text-gray-400";
                    let effectivenessText = "Unknown";
                    
                    if (typeof value === "number") {
                      if (value > 0.75) {
                        bgColor = "bg-green-600/30 text-green-300 border-green-500/50";
                        effectivenessText = "Very Effective";
                      } else if (value > 0.5) {
                        bgColor = "bg-yellow-600/30 text-yellow-300 border-yellow-500/50";
                        effectivenessText = "Effective";
                      } else if (value > 0.25) {
                        bgColor = "bg-orange-600/30 text-orange-300 border-orange-500/50";
                        effectivenessText = "Moderate";
                      } else {
                        bgColor = "bg-red-600/30 text-red-300 border-red-500/50";
                        effectivenessText = "Low";
                      }
                    }

                    const isBest = action === bestAction && typeof value === "number";

                    return (
                      <td
                        key={action}
                        className={`px-4 py-3 border text-center transition-all duration-200 ${bgColor} ${
                          isBest ? "ring-2 ring-cyan-400 ring-opacity-50 font-bold" : ""
                        }`}
                        title={
                          typeof value === "number" 
                            ? `${effectivenessText} (${value.toFixed(2)})${isBest ? " - Best option for this mood" : ""}`
                            : "No data available"
                        }
                      >
                        {typeof value === "number" ? (
                          <div className="flex flex-col items-center space-y-2">
                            <span className="font-bold text-base">{value.toFixed(2)}</span>
                            <span className="text-sm opacity-90 leading-tight">{effectivenessText}</span>
                            {isBest && <span className="text-cyan-300 text-sm">⭐ Best</span>}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">No data</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
        <h3 className="text-cyan-300 font-semibold mb-3 text-sm">📊 How to read this matrix:</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• <span className="text-green-300">Green cells</span> = Very effective activities for that mood</li>
          <li>• <span className="text-yellow-300">Yellow cells</span> = Effective activities</li>
          <li>• <span className="text-orange-300">Orange cells</span> = Moderately effective</li>
          <li>• <span className="text-red-300">Red cells</span> = Less effective activities</li>
          <li>• <span className="text-cyan-300">⭐ Best</span> = Most effective option for each mood</li>
        </ul>
      </div>
    </div>
  );
}

function getMoodDisplay(mood: string) {
  const moodDisplays: Record<string, { emoji: string; label: string }> = {
    'happy': { emoji: '😊', label: 'Happy' },
    'neutral': { emoji: '😐', label: 'Neutral' },
    'sad': { emoji: '😢', label: 'Sad' },
    'anxious': { emoji: '😟', label: 'Anxious' },
    'angry': { emoji: '😡', label: 'Angry' },
    'burnt_out': { emoji: '🥵', label: 'Burnt Out' }
  };
  
  const display = moodDisplays[mood] || { emoji: '😐', label: mood };
  return `${display.emoji} ${display.label}`;
}
