import React from "react";
import styles from "../styles/MindfulChat.module.css";

interface QuickReply {
  text: string;
  value: string;
  emoji?: string;
}

interface QuickRepliesProps {
  replies: QuickReply[];
  onReplyClick: (reply: QuickReply) => void;
  disabled?: boolean;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onReplyClick, disabled = false }) => {
  return (
    <div className={styles.quickRepliesContainer}>
      <div className={styles.quickRepliesGrid}>
        {replies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onReplyClick(reply)}
            disabled={disabled}
            className={styles.quickReplyButton}
            title={reply.text}
          >
            {reply.emoji && <span className={styles.replyEmoji}>{reply.emoji}</span>}
            <span className={styles.replyText}>{reply.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies; 