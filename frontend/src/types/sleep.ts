// src/types/sleep.ts
export interface SleepData {
  bedtime: string;
  wakeupTime: string;
  quality: number; // 1-5 stars
}

export interface SleepAnalysis {
  totalDuration: string;
  quality: number;
  deepSleep: string;
  lightSleep: string;
  remSleep: string;
}