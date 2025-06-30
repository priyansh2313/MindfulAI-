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

export default function LearningSummary() {
  const [qTable, setQTable] = useState(() => initQTable());

  useEffect(() => {
    const updated = flushFeedbackToQ(qTable);
    setQTable({ ...updated });
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-12 p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-gray-800 to-slate-700 shadow-2xl border border-gray-700 relative overflow-hidden">
  <h2 className="text-3xl font-bold text-center text-cyan-300 mb-8 tracking-wide animate-fadeInUp">
    🔁 Reinforcement Learning Matrix
  </h2>

  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border border-gray-600 backdrop-blur-xl rounded-xl">
      <thead className="bg-gradient-to-r from-gray-700 via-slate-700 to-gray-600 text-cyan-100">
        <tr>
          <th className="px-5 py-3 border border-gray-600 text-left text-base font-semibold uppercase">
            Mood
          </th>
          {actions.map((action) => (
            <th
              key={action}
              className="px-5 py-3 border border-gray-600 text-center text-sm font-medium"
            >
              {action}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
  {moods.map((mood) => {
    const moodRow = qTable[mood];
    if (!moodRow) {
      return (
        <tr key={mood} className="text-center text-gray-400">
          <td className="px-4 py-3 border border-gray-700 font-semibold capitalize">
            {mood}
          </td>
          {actions.map((action) => (
            <td
              key={action}
              className="px-4 py-2 border border-gray-700 text-sm text-gray-500"
            >
              N/A
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
      <tr key={mood} className="hover:bg-slate-700 transition-all duration-300">
        <td className="px-4 py-3 border border-gray-700 font-semibold capitalize text-left whitespace-nowrap">
          {mood === "burnt_out" ? "🥵 Burnt Out" :
           mood === "anxious" ? "😟 Anxious" :
           mood === "angry" ? "😡 Angry" :
           mood === "sad" ? "😢 Sad" :
           mood === "happy" ? "😊 Happy" :
           "😐 Neutral"}
        </td>
        {actions.map((action) => {
          const value = moodRow[action];
          let bgColor = "bg-gray-800 text-gray-400";
          let animate = "";
          if (typeof value === "number") {
            if (value > 0.75) bgColor = "bg-green-500/20 text-green-300";
            else if (value > 0.4) bgColor = "bg-yellow-500/20 text-yellow-300";
            else bgColor = "bg-red-500/20 text-red-300";
          }

          if (action === bestAction && typeof value === "number") {
            animate = "animate-pulse font-bold border-2 border-green-400";
          }

          return (
            <td
              key={action}
              className={`px-4 py-2 border border-gray-700 text-center font-mono text-sm ${bgColor} ${animate}`}
              title={action === bestAction ? "⭐ Most effective for this mood" : ""}
            >
              {typeof value === "number" ? `${value.toFixed(2)}${action === bestAction ? " ⭐" : ""}` : "N/A"}
            </td>
          );
        })}
      </tr>
    );
  })}
</tbody>




    </table>
  </div>
</div>

  );
}
