import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Gratitude.module.css';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  mood?: string;
}

const JournalList: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Dummy data for demonstration
  useEffect(() => {
    const dummyEntries: JournalEntry[] = [
      {
        id: '1',
        title: 'My First Journal Entry',
        content: 'Today was an amazing day...',
        date: '2024-01-15',
        tags: ['gratitude', 'reflection'],
        mood: 'happy'
      },
      {
        id: '2',
        title: 'Learning New Things',
        content: 'I learned something new today...',
        date: '2024-01-14',
        tags: ['learning', 'growth'],
        mood: 'excited'
      },
      {
        id: '3',
        title: 'Challenging Day',
        content: 'Today was challenging but I grew...',
        date: '2024-01-13',
        tags: ['challenge', 'growth'],
        mood: 'determined'
      }
    ];
    
    setTimeout(() => {
      setEntries(dummyEntries);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => entry.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const allTags = Array.from(new Set(entries.flatMap(entry => entry.tags)));

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleEntryClick = (entryId: string) => {
    navigate(`/journal/view/${entryId}`);
  };

  const handleNewEntry = () => {
    navigate('/journal/new');
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loading}>Loading journal entries...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>My Journal Entries</h1>
        <button onClick={handleNewEntry} className={styles.newEntryBtn}>
          + New Entry
        </button>
      </header>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search entries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchBox}
        />
        
        <div className={styles.tagFilters}>
          <h4>Filter by Tags:</h4>
          <div className={styles.tagList}>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`${styles.tag} ${selectedTags.includes(tag) ? styles.active : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className={styles.entriesList}>
        {filteredEntries.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No entries found</h3>
            <p>Try adjusting your search or create a new entry.</p>
            <button onClick={handleNewEntry} className={styles.newEntryBtn}>
              Create Your First Entry
            </button>
          </div>
        ) : (
          <div className={styles.entriesGrid}>
            {filteredEntries.map(entry => (
              <div 
                key={entry.id} 
                className={styles.entryCard}
                onClick={() => handleEntryClick(entry.id)}
              >
                <div className={styles.entryHeader}>
                  <h3>{entry.title}</h3>
                  <span className={styles.entryDate}>{entry.date}</span>
                </div>
                <p className={styles.entryPreview}>
                  {entry.content.substring(0, 100)}...
                </p>
                <div className={styles.entryTags}>
                  {entry.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                {entry.mood && (
                  <div className={styles.moodIndicator}>
                    Mood: {entry.mood}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default JournalList; 