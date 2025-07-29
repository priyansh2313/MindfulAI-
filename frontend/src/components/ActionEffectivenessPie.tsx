import React, { useEffect, useState } from "react";
import styles from '../styles/Widgets/ActionEffectivenessWidget.module.css';

import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

type PieData = { name: string; value: number };
const COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa", "#fb7185"];

// Map action names to user-friendly labels
const actionLabels: Record<string, string> = {
  'music': '🎵 Peaceful Music',
  'quote': '📝 Journal Writing',
  'breathing': '🫁 Breathing Exercises',
  'journal': '📖 Journal Prompts',
  'evaluation': '📊 Self Assessment',
  'daily-activities': '🧘 Mindfulness Activities',
  'journal_prompt': '💭 Guided Reflection'
};

export default function ActionEffectivenessPie() {
  const [data, setData] = useState<PieData[]>([]);
  const [availableMoods, setAvailableMoods] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>("anxious");

  useEffect(() => {
    const stored = localStorage.getItem("feedback_log");
    if (!stored) return;

    try {
      const logs: { mood: string; action: string; reward: number }[] = JSON.parse(stored);
      const moods = [...new Set(logs.map((log) => log.mood))];
      setAvailableMoods(moods);

      filterByMood(selectedMood, logs);
    } catch (err) {
      console.error("Error parsing feedback_log:", err);
    }
  }, [selectedMood]);

  const filterByMood = (mood: string, logs: { mood: string; action: string; reward: number }[]) => {
    const filtered = logs.filter((log) => log.mood === mood);

    const grouped: Record<string, { total: number; count: number }> = {};
    filtered.forEach(({ action, reward }) => {
      if (!grouped[action]) grouped[action] = { total: 0, count: 0 };
      grouped[action].total += reward;
      grouped[action].count += 1;
    });

    const formatted: PieData[] = Object.entries(grouped).map(([name, { total, count }]) => ({
      name: actionLabels[name] || name,
      value: count === 0 ? 0 : Math.round((total / count) * 100),
    }));

    setData(formatted);
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      'happy': '😊',
      'neutral': '😐',
      'sad': '😢',
      'anxious': '😟',
      'angry': '😡',
      'burnt_out': '🥵'
    };
    return moodEmojis[mood] || '😐';
  };

  return (
    <div className={styles.activityContainer}>
      <h2 className={styles.activityH1}>🎯 Action Effectiveness</h2>
      <div className={styles.activityP}>
        <label htmlFor="mood-select" className={styles.moodLabel}>
          Filter by Mood: {getMoodEmoji(selectedMood)}
        </label>
        <select
          id="mood-select"
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
          className={styles.moodSelect}
        >
          {availableMoods.length > 0 ? (
            availableMoods.map((mood) => (
              <option key={mood} value={mood}>
                {getMoodEmoji(mood)} {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </option>
            ))
          ) : (
            <option value="anxious">😟 Anxious</option>
          )}
        </select>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}%`}
              isAnimationActive={true}
              animationDuration={800}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [`${value}% effectiveness`, 'Score']}
              labelFormatter={(label: string) => `Activity: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className={styles.noDataMessage}>
          <p>📊 No feedback data available for mood: {selectedMood}</p>
          <p className={styles.suggestion}>Try using different wellness activities and provide feedback to see effectiveness data!</p>
        </div>
      )}
    </div>
  );
}
