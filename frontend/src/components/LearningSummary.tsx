import React, { useEffect, useState } from "react";
import { Action, flushFeedbackToQ, initQTable, Mood } from "../utils/reinforcement";
import styles from '../styles/LearningSummaryCard.module.css';


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
    <div className="w-full mx-auto mt-12 p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-gray-800 to-slate-700 shadow-2xl border border-gray-700 relative overflow-hidden">
      <h2 className="text-3xl font-bold text-center text-cyan-300 mb-8 tracking-wide animate-fadeInUp">
        🔁 Reinforcement Learning Matrix
      </h2>

      
        <table className={styles.table}>
          <thead className={styles.thead}>
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
                  <tr key={mood} className={styles.tr}>
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
                <tr key={mood} >
                  <td className={`${styles.tdMood} ${styles.tr}`}>
                    {mood === "burnt_out" ? (<><span>🥵</span><span>Burnt Out</span></>):
                      mood === "anxious" ? (<><span>😟</span><span>Anxious</span></>) :
                        mood === "angry" ? (<><span>😡</span><span>Angry</span></>) :
                          mood === "sad" ? (<><span>😢</span><span>Sad</span></>):
                            mood === "happy" ? (<><span>😊</span><span>Happy</span></>):
                              (<><span>😐</span><span>Neutral</span></>)}
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
                        className={`${styles.tr} ${bgColor} ${animate}`}
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

  );
}
