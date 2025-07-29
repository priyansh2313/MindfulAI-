import React from "react";
import styles from "../styles/MindfulChat.module.css";

interface ActionButton {
  text: string;
  value: string;
  type?: "primary" | "secondary";
  emoji?: string;
}

interface RichMessageCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  actions?: ActionButton[];
  onActionClick: (action: ActionButton) => void;
  disabled?: boolean;
}

const RichMessageCard: React.FC<RichMessageCardProps> = ({
  title,
  description,
  imageUrl,
  actions = [],
  onActionClick,
  disabled = false,
}) => {
  return (
    <div className={styles.richMessageCard}>
      {imageUrl && (
        <div className={styles.cardImage}>
          <img src={imageUrl} alt={title} />
        </div>
      )}
      
      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{title}</h4>
        <p className={styles.cardDescription}>{description}</p>
        
        {actions.length > 0 && (
          <div className={styles.cardActions}>
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => onActionClick(action)}
                disabled={disabled}
                className={`${styles.actionButton} ${styles[action.type || "secondary"]}`}
              >
                {action.emoji && <span className={styles.actionEmoji}>{action.emoji}</span>}
                <span className={styles.actionText}>{action.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichMessageCard; 