export type RLState = {
    mood: string;
    timeOfDay: 'morning' | 'evening';
    tone: 'positive' | 'neutral' | 'negative';
  };
  
  export type RLAction = 'quote' | 'music' | 'visual';
  
  const defaultQ = { quote: 0, music: 0, visual: 0 };
  
  const getQTable = (): Record<string, Record<RLAction, number>> => {
    const saved = localStorage.getItem('QTable');
    return saved ? JSON.parse(saved) : {};
  };
  
  const saveQTable = (q: Record<string, Record<RLAction, number>>) => {
    localStorage.setItem('QTable', JSON.stringify(q));
  };
  
  export const useRLAgent = (state: RLState) => {
    const stateKey = JSON.stringify(state);
    let QTable = getQTable();
  
    if (!QTable[stateKey]) {
      QTable[stateKey] = { ...defaultQ };
    }
  
    const chooseAction = (): RLAction => {
      const epsilon = 0.2;
      const actions = QTable[stateKey];
  
      if (Math.random() < epsilon) {
        const all = Object.keys(actions) as RLAction[];
        return all[Math.floor(Math.random() * all.length)];
      }
  
      return Object.entries(actions).reduce((best, curr) =>
        curr[1] > best[1] ? curr : best
      )[0] as RLAction;
    };
  
    const updateReward = (action: RLAction, reward: number) => {
      const α = 0.1;
      const γ = 0.9;
  
      const oldQ = QTable[stateKey][action] || 0;
      const maxQ = Math.max(...Object.values(QTable[stateKey]));
  
      QTable[stateKey][action] = oldQ + α * (reward + γ * maxQ - oldQ);
      saveQTable(QTable);
    };
  
    return { chooseAction, updateReward };
  };
  