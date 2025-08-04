import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/Gratitude.module.css';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  theme?: string;
  attachments?: string[];
  images?: Array<{
    id: string;
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  }>;
  textBoxes?: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    backgroundColor: string;
    rotation: number;
  }>;
}

const JournalView: React.FC = () => {
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load actual entry data from localStorage
    const savedEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const foundEntry = savedEntries.find((entry: JournalEntry) => entry.id === entryId);
    
    if (foundEntry) {
      setEntry(foundEntry);
    }
    setLoading(false);
  }, [entryId]);

  const handleEdit = () => {
    navigate(`/journal/edit/${entryId}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      // Remove entry from localStorage
      const savedEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      const updatedEntries = savedEntries.filter((entry: JournalEntry) => entry.id !== entryId);
      localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
      navigate('/journal');
    }
  };

  const handleBackToList = () => {
    navigate('/journal');
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
            Back to Journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.entryHeader}>
        <button onClick={handleBackToList} className={styles.backBtn}>
          ← Back to Journal
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
            {entry.theme && (
              <span className={styles.themeIndicator}>
                Theme: {entry.theme}
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
                  <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />
          
          {/* Display images if any */}
          {entry.images && entry.images.length > 0 && (
            <div className={styles.entryImages}>
              <h3>Images</h3>
              <div className={styles.imageGallery}>
                {entry.images.map((image) => (
                  <div
                    key={image.id}
                    className={styles.viewImageContainer}
                    style={{
                      width: image.width,
                      height: image.height,
                      transform: `rotate(${image.rotation}deg)`,
                    }}
                  >
                    <img
                      src={image.src}
                      alt="Journal image"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display text boxes if any */}
          {entry.textBoxes && entry.textBoxes.length > 0 && (
            <div className={styles.entryTextBoxes}>
              <h3>Text Boxes</h3>
              <div className={styles.textBoxGallery}>
                {entry.textBoxes.map((textBox) => (
                  <div
                    key={textBox.id}
                    className={styles.viewTextBoxContainer}
                    style={{
                      width: textBox.width,
                      height: textBox.height,
                      transform: `rotate(${textBox.rotation}deg)`,
                      backgroundColor: textBox.backgroundColor,
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: textBox.fontFamily,
                      fontSize: textBox.fontSize + 'px',
                      color: textBox.color,
                      overflow: 'hidden',
                      wordWrap: 'break-word',
                      margin: '10px'
                    }}
                  >
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {textBox.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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