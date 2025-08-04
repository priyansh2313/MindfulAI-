import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/Gratitude.module.css';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  mood?: string;
  attachments?: string[];
}

const JournalView: React.FC = () => {
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching entry data
    setTimeout(() => {
      const dummyEntry: JournalEntry = {
        id: entryId || '1',
        title: 'My Journal Entry',
        content: `Today was an incredible day filled with learning and growth. I spent time reflecting on my goals and realized how far I've come in my journey.

The morning started with a peaceful meditation session that helped me center myself for the day ahead. I felt grateful for the quiet moments and the opportunity to practice mindfulness.

Later in the day, I had a meaningful conversation with a friend that reminded me of the importance of connection and support in our lives. It's amazing how a simple conversation can shift your perspective and bring clarity to your thoughts.

I also worked on some personal projects and felt a sense of accomplishment when I completed a challenging task. It reminded me that growth often comes from stepping outside our comfort zones and embracing challenges as opportunities for learning.

As I write this entry, I'm feeling grateful for all the experiences that have shaped me into who I am today. Each day brings new opportunities for growth, learning, and connection.`,
        date: '2024-01-15',
        tags: ['gratitude', 'reflection', 'growth', 'mindfulness'],
        mood: 'grateful',
        attachments: ['image1.jpg', 'document.pdf']
      };
      
      setEntry(dummyEntry);
      setLoading(false);
    }, 1000);
  }, [entryId]);

  const handleEdit = () => {
    navigate(`/journal/edit/${entryId}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      // Handle deletion logic here
      navigate('/journal/list');
    }
  };

  const handleBackToList = () => {
    navigate('/journal/list');
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>Loading entry...</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.error}>
          <h2>Entry not found</h2>
          <button onClick={handleBackToList} className={styles.backBtn}>
            Back to Journal List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.entryHeader}>
        <button onClick={handleBackToList} className={styles.backBtn}>
          ← Back to List
        </button>
        <div className={styles.entryActions}>
          <button onClick={handleEdit} className={styles.editBtn}>
            Edit
          </button>
          <button onClick={handleDelete} className={styles.deleteBtn}>
            Delete
          </button>
        </div>
      </header>

      <main className={styles.entryContent}>
        <div className={styles.entryMeta}>
          <h1>{entry.title}</h1>
          <div className={styles.entryInfo}>
            <span className={styles.entryDate}>{entry.date}</span>
            {entry.mood && (
              <span className={styles.moodIndicator}>
                Mood: {entry.mood}
              </span>
            )}
          </div>
          <div className={styles.entryTags}>
            {entry.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className={styles.entryBody}>
          <div className={styles.content}>
            {entry.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {entry.attachments && entry.attachments.length > 0 && (
          <div className={styles.attachments}>
            <h3>Attachments</h3>
            <div className={styles.attachmentList}>
              {entry.attachments.map((attachment, index) => (
                <div key={index} className={styles.attachment}>
                  <span>{attachment}</span>
                  <button className={styles.downloadBtn}>Download</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JournalView; 