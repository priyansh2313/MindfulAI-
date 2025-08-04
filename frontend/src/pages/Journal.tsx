/* JournalPage.tsx */
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Gratitude.module.css';

// Dummy data/functions for simplicity
const THEMES = [ 'lined', 'grid', 'dot-grid', 'blank' ];
const BADGES = [ '7-day Streak', '30-day Streak', 'First Entry' ];

const JournalPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Pass-lock
  const [locked, setLocked] = useState(true);
  const [passcode, setPasscode] = useState('');
  const correctCode = '1234';

  // Editor
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const quillRef = useRef<ReactQuill>(null);

  // Theme/Layout
  const [theme, setTheme] = useState<string>(THEMES[0]);

  // Search & Tags
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');

  // Streaks & Gamification
  const [streak, setStreak] = useState<number>(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  // Multimedia
  const [attachments, setAttachments] = useState<File[]>([]);

  // Previous entries
  const [previousEntries, setPreviousEntries] = useState<any[]>([]);

  useEffect(() => {
    // Load streak and badges from storage (dummy)
    const savedStreak = parseInt(localStorage.getItem('journalStreak') || '0');
    setStreak(savedStreak);
    const savedBadges = JSON.parse(localStorage.getItem('journalBadges') || '[]');
    setEarnedBadges(savedBadges);
    
    // Load previous entries
    const savedEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    setPreviousEntries(savedEntries);
  }, []);

  const handleUnlock = () => {
    if (passcode === correctCode) {
      setLocked(false);
    } else {
      alert('Incorrect passcode');
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleSaveEntry = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please add a title and content to your journal entry');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      title: title,
      content: content,
      date: new Date().toISOString().split('T')[0],
      tags: tags,
      attachments: attachments.map(file => file.name)
    };

    // Save to localStorage
    const existingEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const updatedEntries = [newEntry, ...existingEntries];
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    
    // Update streak
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('journalStreak', newStreak.toString());
    
    // Update previous entries
    setPreviousEntries(updatedEntries);
    
    // Clear form
    setTitle('');
    setContent('');
    setTags([]);
    setAttachments([]);
    
    alert('Journal entry saved successfully!');
  };

  const handleViewEntry = (entryId: string) => {
    navigate(`/journal/view/${entryId}`);
  };

  return locked ? (
    <div className={styles.lockContainer}>
      <h2>Enter Passcode</h2>
      <input
        type="password"
        value={passcode}
        onChange={e => setPasscode(e.target.value)}
        className={styles.passInput}
      />
      <button onClick={handleUnlock} className={styles.unlockBtn}>
        Unlock
      </button>
    </div>
  ) : (
    <div className={styles.pageContainer + ' ' + styles[theme]}>
      <aside className={styles.sidebar}>
        <input
          type="text"
          placeholder="Search entries..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={styles.searchBox}
        />
        <div className={styles.themeSelector}>
          <label>Theme/Layout:</label>
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            {THEMES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className={styles.streaks}>
          <h4>Current Streak: {streak} days</h4>
          <div className={styles.badges}>
            {BADGES.map(b => (
              <span
                key={b}
                className={styles.badge + (earnedBadges.includes(b) ? ' ' + styles.active : '')}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
        
        <div className={styles.previousEntries}>
          <h4>Previous Entries</h4>
          <div className={styles.entriesList}>
            {previousEntries
              .filter(entry => 
                entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.content.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .slice(0, 5)
              .map(entry => (
                <div 
                  key={entry.id} 
                  className={styles.entryCard}
                  onClick={() => handleViewEntry(entry.id)}
                >
                  <h5>{entry.title}</h5>
                  <p>{entry.date}</p>
                  <div className={styles.entryTags}>
                    {entry.tags.slice(0, 2).map((tag: string, index: number) => (
                      <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </aside>

      <main className={styles.editorSection}>
        <div className={styles.toolbar}>
          <input
            type="text"
            placeholder="Entry title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={styles.titleInput}
          />
          <input
            type="text"
            placeholder="Add tag and press Enter"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagAdd}
            className={styles.tagInput}
          />
          <div className={styles.tagList}>
            {tags.map((t,i) => <span key={i} className={styles.tag}>{t}</span>)}
          </div>
          <input type="file" multiple onChange={handleFileUpload} />
        </div>
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          className={styles.editor}
          modules={{ toolbar: true }}
          formats={[ 'bold','italic','underline','list','bullet','link' ]}
        />
      </main>

      <footer className={styles.footer}>
        <button className={styles.saveBtn} onClick={handleSaveEntry}>Save Entry</button>
      </footer>
    </div>
  );
};

export default JournalPage;


/* JournalPage.module.css */
