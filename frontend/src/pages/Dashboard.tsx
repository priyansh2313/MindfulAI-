import React, { useState } from 'react';
import EvaluationCard from '../components/EvaluationCard';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LearningSummaryCard from '../components/LearningSummaryCard';
import Recommendations from '../components/Recommendations';
import ServicesGrid from '../components/ServicesGrid';
import ActionEffectivenessWidget from '../components/Widgets/ActionEffectivenessWidget';
import MoodWidget from '../components/Widgets/MoodWidget';
import ProgressWidget from '../components/Widgets/ProgressWidget';
import TipWidget from '../components/Widgets/TipWidget';
import styles from '../styles/Dashboard.module.css';
import FloatingChatbot from './FloatingChatbot';
import FloatingLeaves from './FloatingLeaves';

export default function Dashboard() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  return (
    <div className={styles.page}>
      <FloatingLeaves />
      <Header />
      <Hero />
      <ServicesGrid />
      <section className={styles.analytics}>
        <EvaluationCard />
        <LearningSummaryCard />
      </section>
      <section className={styles.Widgets}>
        <MoodWidget />
        <ActionEffectivenessWidget />
        <ProgressWidget />
        <TipWidget />
        <Recommendations />
      </section>
      <FloatingChatbot
        isOpen={chatbotOpen}
        onToggle={() => setChatbotOpen((open) => !open)}
        hoveredSection={null}
        mode="dashboard"
      />
    </div>
  );
}
