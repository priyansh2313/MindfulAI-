import EvaluationCard from '../components/EvaluationCard';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LearningSummaryCard from '../components/LearningSummaryCard';
import Recommendations from '../components/Recommendations';
import ServicesGrid from '../components/ServicesGrid';
import ActionEffectivenessWidget from '../components/widgets/ActionEffectivenessWidget';
import MoodWidget from '../components/widgets/MoodWidget';
import ProgressWidget from '../components/widgets/ProgressWidget';
import TipWidget from '../components/widgets/TipWidget';
import styles from '../styles/Dashboard.module.css';
import FloatingChatbot from './FloatingChatbot';
import FloatingLeaves from './FloatingLeaves';

export default function Dashboard() {
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
      <section className={styles.widgets}>
        <MoodWidget />
        <ActionEffectivenessWidget />
        <ProgressWidget />
        <TipWidget />
		      <Recommendations />

      </section>
      <FloatingChatbot mode="dashboard" />
    </div>
  );
}
