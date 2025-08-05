import React from "react";
import { BedDouble } from "lucide-react";

// Sample props — pass these from your form/page navigation
const lastNightSleep = {
  deep: 20,
  rem: 15,
  light: 65,
  total: 4, // hours
};
const weekSleep = [7, 8, 6, 8.5, 5.5, 7, 9]; // Example data

// --- Dynamic tips based on total hours slept last night
function getSleepTips(totalHours: number) {
  if (totalHours < 5)
    return [
      "You're getting much less sleep than recommended. Aim for at least 7 hours for better energy and mood.",
      "Try to keep a consistent sleep and wake schedule, even on weekends.",
      "Avoid caffeine and screens before bedtime.",
      "Create a bedtime routine: reading, light music, or meditation can help.",
      "If worries keep you awake, jot down thoughts and to-dos before bed.",
    ];
  if (totalHours < 7)
    return [
      "You're close, but still under the recommended 7–9 hours. Try heading to bed a bit earlier.",
      "Limit blue light exposure before bed—avoid screens 30 minutes prior.",
      "Keep your sleep environment cool, dark, and quiet.",
      "Regular exercise can improve sleep quality, but avoid intense activity late at night.",
    ];
  if (totalHours <= 9)
    return [
      "Great! You're within the healthy sleep range (7–9 hours). Keep it up!",
      "Stick to your routine, even on weekends, to maintain sleep quality.",
      "Consider winding down with gentle stretches or meditation.",
      "Stay hydrated, but limit large drinks right before bed.",
    ];
  // More than 9 hours
  return [
    "You slept longer than recommended. Too much sleep can cause grogginess.",
    "Try to wake up at the same time daily, even if you feel like sleeping in.",
    "Get morning sunlight to help reset your sleep cycle.",
    "Plan light morning activity—a short walk or stretches after waking.",
  ];
}

// --- Pie and line chart using recharts (very easy to add!)
// If you want chart code, let me know and I'll provide it.

export default function SleepInsightsPage(props: {
  totalSleep?: number;
  lastNightSleep?: { deep: number; rem: number; light: number; total: number };
  weekSleep?: number[];
}) {
  // For demo, fallback to above data if none provided
  const totalSleep = props.totalSleep ?? lastNightSleep.total;
  const last = props.lastNightSleep ?? lastNightSleep;
  const week = props.weekSleep ?? weekSleep;

  const tips = getSleepTips(totalSleep);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-0 m-0">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl px-8 py-10 mt-8">
        {/* Title */}
        <div className="flex items-center mb-8">
          <span className="bg-green-100 rounded-full p-4 mr-4">
            <BedDouble className="w-10 h-10 text-green-500" />
          </span>
          <h1 className="text-4xl font-bold text-green-700">
            Sleep Cycle Tracker
          </h1>
        </div>

        {/* Insights */}
        <h2 className="text-2xl font-semibold text-green-700 mb-6 text-center">
          Your Sleep Insights
        </h2>

        {/* Grid for charts & stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Pie chart: Sleep Stages */}
          <div className="flex flex-col items-center bg-green-50 rounded-2xl py-6 px-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Last Night's Sleep Stages
            </h3>
            {/* Replace this with a proper PieChart for prod */}
            <div className="flex flex-col items-center my-2">
              <span className="text-green-700 font-bold text-xl mb-1">
                {last.total}h Total Sleep
              </span>
              <div className="flex gap-3 mb-2">
                <span className="flex items-center">
                  <span className="block w-4 h-4 bg-blue-400 rounded-full mr-1"></span>
                  <span className="text-blue-700 text-sm">Deep {last.deep}%</span>
                </span>
                <span className="flex items-center">
                  <span className="block w-4 h-4 bg-yellow-300 rounded-full mr-1"></span>
                  <span className="text-yellow-700 text-sm">REM {last.rem}%</span>
                </span>
                <span className="flex items-center">
                  <span className="block w-4 h-4 bg-green-300 rounded-full mr-1"></span>
                  <span className="text-green-700 text-sm">Light {last.light}%</span>
                </span>
              </div>
              <div className="w-32 h-32 rounded-full border-4 border-green-200 bg-white flex flex-col items-center justify-center text-lg text-gray-500">
                {/* Pie chart placeholder */}
                <span>Pie</span>
              </div>
            </div>
          </div>
          {/* Week Chart */}
          <div className="flex flex-col items-center bg-blue-50 rounded-2xl py-6 px-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Past 7 Days
            </h3>
            {/* Simple line "chart" (replace with recharts/ChartJS) */}
            <div className="w-full flex flex-col items-center">
              <span className="text-blue-600 text-md mb-1">
                {week.map((h, i) => (
                  <span key={i} className="inline-block mx-1">
                    {h}
                    <span className="text-xs text-gray-400">h</span>
                  </span>
                ))}
              </span>
              <span className="text-gray-500 text-xs mt-2">
                Aim for 7–9 hours per night
              </span>
            </div>
          </div>
        </div>

        {/* --- Tips Section --- */}
        <div className="bg-white py-8 rounded-2xl shadow-md mt-4 mb-2 px-6">
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            Tips for Better Sleep
          </h3>
          <ul className="list-disc pl-8 text-lg space-y-3 text-gray-800">
            {tips.map((tip, idx) => (
              <li key={idx} className="mb-2">{tip}</li>
            ))}
          </ul>
        </div>
        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8 justify-between items-center">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl text-lg font-medium"
            onClick={() => window.location.reload()}
          >
            Track Another Night
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-semibold"
            onClick={() => window.location.href = "/elder-dashboard"}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
