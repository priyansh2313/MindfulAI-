import React from 'react';

export default function EvaluationCardElder() {
  // Example: get result from localStorage or fallback
  const result = localStorage.getItem('evaluationResult') || "No result yet.";
  return (
    <div className="text-2xl font-bold text-center text-black p-6">
      Your evaluation result: <span className="text-blue-700">{result}</span>
    </div>
  );
} 