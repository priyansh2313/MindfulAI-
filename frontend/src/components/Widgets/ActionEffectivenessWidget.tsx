import styles from '../../styles/Widgets/ActionEffectivenessWidget.module.css';
import ActionEffectivenessPie from '../ActionEffectivenessPie';

export default function ActionEffectivenessWidget() {
  return (
    <div className={styles.widget}>
      <h4>Which activities helped most when anxious</h4>
      <ActionEffectivenessPie />
    </div>
  );
}