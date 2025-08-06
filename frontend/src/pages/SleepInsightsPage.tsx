import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BedDouble, PieChart, Sparkles } from "lucide-react";


const encouragements = [
  "Great job tracking your sleep! Keep it up!",
  "Every small step counts for your wellness.",
  "Consistency is key. Proud of you!",
  "Better sleep, better days—you're on your way!"
];

function minutesToHM(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h} hour${h === 1 ? "" : "s"}${m ? ` ${m} min` : ""}`;
}

function getSleepTips(hours: number) {
  if (hours < 5) return [
    "You're getting much less sleep than recommended. Aim for at least 7 hours.",
    "Try to keep a consistent schedule—even weekends.",
    "Relax before bed: no screens, maybe music or meditation.",
    "If stress keeps you up, jot down worries before bed.",
  ];
  if (hours < 7) return [
    "You're close, but still under the recommended 7–9 hours. Try to go to bed a bit earlier.",
    "Avoid caffeine and blue light at night.",
    "Keep your bedroom cool and dark.",
    "Gentle stretches before bed can help.",
  ];
  if (hours <= 9) return [
    "Great! You're within the healthy sleep range (7–9 hours).",
    "Stick to your routine for continued sleep quality.",
    "Try to wind down with light reading or meditation.",
  ];
  return [
    "Too much sleep can make you groggy. Aim for 7–9 hours if possible.",
    "Get some morning sunlight and a walk after waking up.",
  ];
}

export default function SleepInsightsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Use passed state or fallback to defaults for demo
  const totalMinutes = state?.totalMinutes ?? 420; // 7h default
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const week = [7, 6.5, 7.5, 8, 6, 7.8, 7.2]; // Example
  const weekAvg = (week.reduce((a, b) => a + b) / week.length).toFixed(1);
  const month = Array.from({ length: 30 }, () => 6.5 + Math.random() * 2);
  const monthAvg = (month.reduce((a, b) => a + b) / month.length).toFixed(1);

  // Fake sleep stages for Pie
  const deep = 20, rem = 18, light = 62; // Percentages

  // Summary paragraph
  let summary = "";
  if (hours < 5) summary = "You slept far less than the healthy range last night. Try to prioritize more rest!";
  else if (hours < 7) summary = "You got some rest, but a little less than the recommended 7–9 hours. Try adjusting your routine for better recovery.";
  else if (hours <= 9) summary = "Great! Your sleep duration falls in the recommended range for good health.";
  else summary = "You slept longer than recommended. Oversleeping can affect mood and energy. Try to wake at the same time every day.";

  const tips = getSleepTips(hours);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-0 m-0">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl px-8 py-10 mt-8">
        <div className="flex items-center mb-8">
          <span className="bg-green-100 rounded-full p-4 mr-4">
            <BedDouble className="w-10 h-10 text-green-500" />
          </span>
          <h1 className="text-4xl font-bold text-green-700">Your Sleep Insights</h1>
        </div>

        {/* Sleep summary */}
        <div className="mb-4 text-xl text-gray-700 text-center">
          <b>Last night you slept {hours} hour{hours === 1 ? "" : "s"}{minutes ? ` ${minutes} min` : ""}.</b>
          <p className="mt-2">{summary}</p>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-green-50 rounded-2xl p-5 flex flex-col items-center justify-center">
            <h3 className="font-semibold mb-2">Sleep Stages</h3>
            {/* Replace with a PieChart for prod */}
            <PieChart className="w-12 h-12 text-green-500 mb-2" />
            <div className="flex gap-2 text-sm">
              <span className="text-blue-700">Deep {deep}%</span>
              <span className="text-yellow-700">REM {rem}%</span>
              <span className="text-green-700">Light {light}%</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-5 flex flex-col items-center justify-center">
            <h3 className="font-semibold mb-2">This Week</h3>
            <span className="text-lg text-blue-700">{weekAvg} hours avg</span>
            <div className="text-xs text-gray-400">Past 7 days: {week.map(h => h.toFixed(1)).join(", ")} h</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-5 flex flex-col items-center justify-center">
            <h3 className="font-semibold mb-2">This Month</h3>
            <span className="text-lg text-blue-700">{monthAvg} hours avg</span>
          </div>
        </div>

        {/* Tips section */}
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

        {/* Encouragement */}
        <div className="mt-6 text-center text-green-600 font-semibold text-lg">
          <Sparkles className="inline mr-2 text-green-400" />
          {encouragements[Math.floor(Math.random() * encouragements.length)]}
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-10 justify-between items-center">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl text-lg font-medium"
            onClick={() => navigate("/sleep-tracker")}
          >
            Track Another Night
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-semibold"
            onClick={() => navigate("/elder-dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
