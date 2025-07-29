// src/utils/reinforcement.ts

export type Mood = 'happy' | 'neutral' | 'sad' | 'anxious' | 'angry' | 'burnt_out';
export type Action = 'music' | 'quote' | 'breathing' | 'journal' | 'evaluation' | 'daily-activities' | 'journal_prompt';

// Enhanced types for better RL
export type FeedbackIntensity = 'very_helpful' | 'helpful' | 'neutral' | 'unhelpful' | 'harmful';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type UserContext = {
  timeOfDay: TimeOfDay;
  previousMood: Mood | null;
  moodIntensity: number; // 1-10 scale
  stressLevel: number; // 1-10 scale
  energyLevel: number; // 1-10 scale
  lastActionTime: number; // timestamp
  consecutiveUses: number; // how many times same action used
};

const moods: Mood[] = ['happy', 'neutral', 'sad', 'anxious', 'angry', 'burnt_out'];
const actions: Action[] = ['music', 'quote', 'breathing', 'journal', 'evaluation', 'daily-activities', 'journal_prompt'];

export type QTable = Record<Mood, Record<Action, number>>;
export type EnhancedQTable = Record<Mood, Record<Action, {
  baseValue: number;
  timeContext: Record<TimeOfDay, number>;
  intensityContext: Record<string, number>;
  lastUsed: number;
  successRate: number;
  totalUses: number;
}>>;

const STORAGE_KEY = 'rl_qtable';
const ENHANCED_STORAGE_KEY = 'rl_enhanced_qtable';
const EPSILON_KEY = 'epsilon';
const FEEDBACK_KEY = 'feedback_log';
const USER_CONTEXT_KEY = 'user_context';

// Enhanced reward mapping
const REWARD_MAP: Record<FeedbackIntensity, number> = {
  'very_helpful': 1.0,
  'helpful': 0.7,
  'neutral': 0.3,
  'unhelpful': -0.3,
  'harmful': -0.8
};

export function initQTable(): QTable {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  const table: QTable = {} as QTable;
  moods.forEach((mood) => {
    table[mood] = {} as Record<Action, number>;
    actions.forEach((action) => {
      table[mood][action] = Math.random();
    });
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(table));
  return table;
}

export function initEnhancedQTable(): EnhancedQTable {
  const stored = localStorage.getItem(ENHANCED_STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  const table: EnhancedQTable = {} as EnhancedQTable;
  const timeOfDays: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];
  
  moods.forEach((mood) => {
    table[mood] = {} as Record<Action, any>;
    actions.forEach((action) => {
      table[mood][action] = {
        baseValue: Math.random(),
        timeContext: Object.fromEntries(timeOfDays.map(time => [time, Math.random()])),
        intensityContext: {
          'low': Math.random(),
          'medium': Math.random(),
          'high': Math.random()
        },
        lastUsed: 0,
        successRate: 0.5,
        totalUses: 0
      };
    });
  });
  localStorage.setItem(ENHANCED_STORAGE_KEY, JSON.stringify(table));
  return table;
}

export function getCurrentTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

export function getMoodIntensity(mood: Mood, context: UserContext): string {
  const intensity = context.moodIntensity;
  if (intensity <= 3) return 'low';
  if (intensity <= 7) return 'medium';
  return 'high';
}

export function chooseAction(
  mood: Mood,
  qTable: QTable,
  context?: UserContext
): Action {
  let epsilon = parseFloat(localStorage.getItem(EPSILON_KEY) || '0.2');
  
  // Adaptive exploration based on context
  if (context) {
    const timeSinceLastAction = Date.now() - (context.lastActionTime || 0);
    const hoursSinceLastAction = timeSinceLastAction / (1000 * 60 * 60);
    
    // Increase exploration if user hasn't used the app recently
    if (hoursSinceLastAction > 24) {
      epsilon = Math.min(0.5, epsilon * 1.5);
    }
    
    // Decrease exploration if user is in crisis (high stress/anxiety)
    if (context.stressLevel > 7 || mood === 'anxious' || mood === 'sad') {
      epsilon = Math.max(0.05, epsilon * 0.7);
    }
  }
  
  if (Math.random() < epsilon) {
    return actions[Math.floor(Math.random() * actions.length)];
  }

  const moodActions = qTable[mood];
  return (Object.keys(moodActions) as Action[]).reduce((best, curr) =>
    moodActions[curr] > moodActions[best] ? curr : best
  );
}

export function chooseEnhancedAction(
  mood: Mood,
  context: UserContext
): Action {
  const enhancedTable = initEnhancedQTable();
  const timeOfDay = getCurrentTimeOfDay();
  const intensity = getMoodIntensity(mood, context);
  
  // Calculate contextual scores
  const actionScores = actions.map(action => {
    const actionData = enhancedTable[mood][action];
    const timeScore = actionData.timeContext[timeOfDay] || 0;
    const intensityScore = actionData.intensityContext[intensity] || 0;
    const baseScore = actionData.baseValue;
    const successBonus = actionData.successRate * 0.3;
    
    // Penalize recently used actions to encourage variety
    const timeSinceLastUse = Date.now() - actionData.lastUsed;
    const hoursSinceLastUse = timeSinceLastUse / (1000 * 60 * 60);
    const varietyBonus = Math.min(0.5, hoursSinceLastUse / 24);
    
    return {
      action,
      score: (baseScore * 0.4) + (timeScore * 0.3) + (intensityScore * 0.2) + successBonus + varietyBonus
    };
  });
  
  // Choose action with highest score
  return actionScores.reduce((best, curr) => 
    curr.score > best.score ? curr : best
  ).action;
}

export function getRecommendedActionForMood(mood: Mood): Action {
  const qTable = initQTable();
  const context = getUserContext();
  const action = context ? chooseEnhancedAction(mood, context) : chooseAction(mood, qTable);
  localStorage.setItem('rl_action_source', action);
  return action;
}

export function getUserContext(): UserContext | null {
  const stored = localStorage.getItem(USER_CONTEXT_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function updateUserContext(updates: Partial<UserContext>): void {
  const current = getUserContext() || {
    timeOfDay: getCurrentTimeOfDay(),
    previousMood: null,
    moodIntensity: 5,
    stressLevel: 5,
    energyLevel: 5,
    lastActionTime: Date.now(),
    consecutiveUses: 0
  };
  
  const updated = { ...current, ...updates };
  localStorage.setItem(USER_CONTEXT_KEY, JSON.stringify(updated));
}

export function updateQ(
  qTable: QTable,
  mood: Mood,
  action: Action,
  reward: number,
  learningRate = 0.1,
  discountFactor = 0.95
): QTable {
  const currentQ = qTable[mood][action];
  const maxNextQ = Math.max(...Object.values(qTable[mood]));
  const updatedQ =
    currentQ + learningRate * (reward + discountFactor * maxNextQ - currentQ);
  qTable[mood][action] = updatedQ;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(qTable));
  return qTable;
}

export function updateEnhancedQ(
  mood: Mood,
  action: Action,
  feedback: FeedbackIntensity,
  context: UserContext
): void {
  const enhancedTable = initEnhancedQTable();
  const timeOfDay = getCurrentTimeOfDay();
  const intensity = getMoodIntensity(mood, context);
  const reward = REWARD_MAP[feedback];
  
  const actionData = enhancedTable[mood][action];
  
  // Update base value
  actionData.baseValue = actionData.baseValue + 0.1 * (reward - actionData.baseValue);
  
  // Update time context
  actionData.timeContext[timeOfDay] = actionData.timeContext[timeOfDay] + 
    0.1 * (reward - actionData.timeContext[timeOfDay]);
  
  // Update intensity context
  actionData.intensityContext[intensity] = actionData.intensityContext[intensity] + 
    0.1 * (reward - actionData.intensityContext[intensity]);
  
  // Update success rate
  actionData.totalUses += 1;
  if (reward > 0) {
    actionData.successRate = (actionData.successRate * (actionData.totalUses - 1) + 1) / actionData.totalUses;
  } else {
    actionData.successRate = (actionData.successRate * (actionData.totalUses - 1)) / actionData.totalUses;
  }
  
  actionData.lastUsed = Date.now();
  
  localStorage.setItem(ENHANCED_STORAGE_KEY, JSON.stringify(enhancedTable));
}

export function updateExplorationRate() {
  let epsilon = parseFloat(localStorage.getItem(EPSILON_KEY) || '0.2');
  epsilon = Math.max(0.05, epsilon * 0.98);
  localStorage.setItem(EPSILON_KEY, epsilon.toString());
}

export function logFeedback(mood: Mood, action: Action, reward: number) {
  const stored = localStorage.getItem(FEEDBACK_KEY);
  const feedbackLog: { mood: Mood; action: Action; reward: number }[] =
    stored ? JSON.parse(stored) : [];
  feedbackLog.push({ mood, action, reward });
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbackLog));
}

export function logEnhancedFeedback(
  mood: Mood, 
  action: Action, 
  feedback: FeedbackIntensity,
  context?: UserContext
) {
  // Update user context
  if (context) {
    updateUserContext({
      ...context,
      lastActionTime: Date.now(),
      consecutiveUses: context.consecutiveUses + 1
    });
  }
  
  // Update enhanced Q-table
  if (context) {
    updateEnhancedQ(mood, action, feedback, context);
  }
  
  // Also log to legacy system for backward compatibility
  const reward = REWARD_MAP[feedback];
  logFeedback(mood, action, reward);
}

export function flushFeedbackToQ(qTable: QTable): QTable {
  const stored = localStorage.getItem(FEEDBACK_KEY);
  if (!stored) return qTable;

  const feedbackLog: { mood: Mood; action: Action; reward: number }[] = JSON.parse(stored);

  feedbackLog.forEach(({ mood, action, reward }) => {
    if (qTable[mood] && qTable[mood][action] !== undefined) {
      updateQ(qTable, mood, action, reward);
    } else {
      console.warn(`Skipping invalid feedback entry:`, { mood, action });
    }
  });

  localStorage.removeItem(FEEDBACK_KEY);
  return qTable;
}

export function detectMoodFromInput(input: string): Mood | null {
    const text = input.toLowerCase();
  
    if (
      /(sad|depressed|unhappy|upset|miserable|low|crying|hopeless|exhausted|fatigued|numb|empty)/.test(text)
    ) return 'sad';
  
    if (
      /(anxious|nervous|worried|tense|stressed|panic|can't sleep|insomnia|racing thoughts|restless|overthinking)/.test(text)
    ) return 'anxious';
  
    if (
      /(angry|frustrated|irritated|rage|furious|mad)/.test(text)
    ) return 'angry';
  
    if (
      /(burnt out|burned out|exhaustion|drained|overwhelmed|worn out)/.test(text)
    ) return 'burnt_out';
  
    if (
      /(okay|fine|normal|meh|neutral|average|nothing much|same as usual)/.test(text)
    ) return 'neutral';
  
    if (
      /(happy|joyful|excited|grateful|content|hopeful|optimistic|cheerful|good)/.test(text)
    ) return 'happy';
  
    return null;
  }

// New utility functions for better RL insights
export function getActionEffectiveness(mood: Mood, action: Action): {
  overallScore: number;
  timeEffectiveness: Record<TimeOfDay, number>;
  intensityEffectiveness: Record<string, number>;
  successRate: number;
  totalUses: number;
} {
  const enhancedTable = initEnhancedQTable();
  const actionData = enhancedTable[mood][action];
  
  return {
    overallScore: actionData.baseValue,
    timeEffectiveness: actionData.timeContext,
    intensityEffectiveness: actionData.intensityContext,
    successRate: actionData.successRate,
    totalUses: actionData.totalUses
  };
}

export function getPersonalizedInsights(): {
  bestActions: Record<Mood, Action>;
  improvementAreas: string[];
  patterns: string[];
} {
  const enhancedTable = initEnhancedQTable();
  const context = getUserContext();
  
  const bestActions: Record<Mood, Action> = {} as Record<Mood, Action>;
  moods.forEach(mood => {
    const moodActions = enhancedTable[mood];
    bestActions[mood] = Object.keys(moodActions).reduce((best, action) => 
      moodActions[action].baseValue > moodActions[best].baseValue ? action : best
    ) as Action;
  });
  
  // Analyze patterns
  const patterns: string[] = [];
  const improvementAreas: string[] = [];
  
  // Check for time-based patterns
  if (context) {
    const timeOfDay = getCurrentTimeOfDay();
    moods.forEach(mood => {
      const actionData = enhancedTable[mood][bestActions[mood]];
      const timeScore = actionData.timeContext[timeOfDay];
      if (timeScore < 0.5) {
        improvementAreas.push(`Consider different activities during ${timeOfDay} when feeling ${mood}`);
      }
    });
  }
  
  return { bestActions, improvementAreas, patterns };
}