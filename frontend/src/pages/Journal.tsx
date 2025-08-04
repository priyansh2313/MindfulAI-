/* JournalPage.tsx */
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Gratitude.module.css';

// Dummy data/functions for simplicity
const THEMES = [ 
  'lined', 
  'grid', 
  'dot-grid', 
  'blank',
  'nature',
  'ocean', 
  'love',
  'sunset',
  'forest',
  'cosmic',
  'vintage',
  'minimal'
];
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
  const [images, setImages] = useState<Array<{
    id: string;
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  }>>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [rotateStart, setRotateStart] = useState({ x: 0, y: 0, angle: 0 });

  // Text Boxes
  const [textBoxes, setTextBoxes] = useState<Array<{
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
  }>>([]);
  const [selectedTextBox, setSelectedTextBox] = useState<string | null>(null);
  const [isTextBoxDragging, setIsTextBoxDragging] = useState(false);
  const [isTextBoxResizing, setIsTextBoxResizing] = useState(false);
  const [isTextBoxRotating, setIsTextBoxRotating] = useState(false);
  const [textBoxDragOffset, setTextBoxDragOffset] = useState({ x: 0, y: 0 });
  const [textBoxResizeStart, setTextBoxResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [textBoxRotateStart, setTextBoxRotateStart] = useState({ x: 0, y: 0, angle: 0 });
  
  // Text editing modal
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [editingTextBoxId, setEditingTextBoxId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageId = Date.now().toString();
          const newImage = {
            id: imageId,
            src: event.target?.result as string,
            x: 50,
            y: 50,
            width: 200,
            height: 150,
            rotation: 0
          };
          setImages(prev => [...prev, newImage]);
          setSelectedImage(imageId);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageSelect = (imageId: string) => {
    setSelectedImage(selectedImage === imageId ? null : imageId);
  };

  const handleImageDragStart = (e: React.MouseEvent, imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (image) {
      setIsDragging(true);
      setSelectedImage(imageId);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleImageDrag = (e: React.MouseEvent) => {
    if (isDragging && selectedImage) {
      const editorRect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - editorRect.left - dragOffset.x;
      const newY = e.clientY - editorRect.top - dragOffset.y;
      
      setImages(prev => prev.map(img => 
        img.id === selectedImage 
          ? { ...img, x: Math.max(0, newX), y: Math.max(0, newY) }
          : img
      ));
    }
  };

  const handleImageDragEnd = () => {
    setIsDragging(false);
  };

  const handleResizeStart = (e: React.MouseEvent, imageId: string, direction: string) => {
    e.stopPropagation();
    const image = images.find(img => img.id === imageId);
    if (image) {
      setIsResizing(true);
      setSelectedImage(imageId);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: image.width,
        height: image.height
      });
    }
  };

  const handleRotateStart = (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation();
    const image = images.find(img => img.id === imageId);
    if (image) {
      setIsRotating(true);
      setSelectedImage(imageId);
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
      setRotateStart({
        x: e.clientX,
        y: e.clientY,
        angle: angle - image.rotation
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedImage) {
      handleImageDrag(e);
    } else if (isResizing && selectedImage) {
      const image = images.find(img => img.id === selectedImage);
      if (image) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        const newWidth = Math.max(50, resizeStart.width + deltaX);
        const newHeight = Math.max(50, resizeStart.height + deltaY);
        
        handleImageResize(selectedImage, newWidth, newHeight);
      }
    } else if (isRotating && selectedImage) {
      const image = images.find(img => img.id === selectedImage);
      if (image) {
        const angle = Math.atan2(e.clientY - rotateStart.y, e.clientX - rotateStart.x) * 180 / Math.PI;
        const newRotation = angle - rotateStart.angle;
        handleImageRotate(selectedImage, newRotation);
      }
    } else if (isTextBoxDragging && selectedTextBox) {
      handleTextBoxDrag(e);
    } else if (isTextBoxResizing && selectedTextBox) {
      const textBox = textBoxes.find(tb => tb.id === selectedTextBox);
      if (textBox) {
        const deltaX = e.clientX - textBoxResizeStart.x;
        const deltaY = e.clientY - textBoxResizeStart.y;
        
        const newWidth = Math.max(50, textBoxResizeStart.width + deltaX);
        const newHeight = Math.max(30, textBoxResizeStart.height + deltaY);
        
        handleTextBoxResize(selectedTextBox, newWidth, newHeight);
      }
    } else if (isTextBoxRotating && selectedTextBox) {
      const textBox = textBoxes.find(tb => tb.id === selectedTextBox);
      if (textBox) {
        const angle = Math.atan2(e.clientY - textBoxRotateStart.y, e.clientX - textBoxRotateStart.x) * 180 / Math.PI;
        const newRotation = angle - textBoxRotateStart.angle;
        handleTextBoxRotate(selectedTextBox, newRotation);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    setIsTextBoxDragging(false);
    setIsTextBoxResizing(false);
    setIsTextBoxRotating(false);
  };

  const handleImageResize = (imageId: string, newWidth: number, newHeight: number) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, width: newWidth, height: newHeight }
        : img
    ));
  };

  const handleImageRotate = (imageId: string, newRotation: number) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, rotation: newRotation }
        : img
    ));
  };

  const handleImageDelete = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    setSelectedImage(null);
  };

  // Text Box Handlers
  const handleAddTextBox = () => {
    // Get editor dimensions for better positioning
    const editorElement = document.querySelector(`.${styles.editor}`) as HTMLElement;
    const editorRect = editorElement?.getBoundingClientRect();
    
    const newTextBox = {
      id: `textbox-${Date.now()}`,
      x: editorRect ? Math.max(20, (editorRect.width / 2) - 100) : 50,
      y: editorRect ? Math.max(20, (editorRect.height / 2) - 50) : 50,
      width: 200,
      height: 80,
      text: 'Double click to edit text',
      fontSize: 16,
      fontFamily: 'Arial, sans-serif',
      color: '#333333',
      backgroundColor: 'transparent', // Let CSS handle the background
      rotation: 0
    };
    setTextBoxes(prev => [...prev, newTextBox]);
    setSelectedTextBox(newTextBox.id);
  };

  const handleTextBoxSelect = (textBoxId: string) => {
    setSelectedTextBox(textBoxId);
    setSelectedImage(null); // Deselect images when selecting text box
  };

  const handleTextBoxDragStart = (e: React.MouseEvent, textBoxId: string) => {
    e.stopPropagation();
    setIsTextBoxDragging(true);
    setSelectedTextBox(textBoxId);
    
    const textBox = textBoxes.find(tb => tb.id === textBoxId);
    if (textBox) {
      const rect = e.currentTarget.getBoundingClientRect();
      const editorRect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
      setTextBoxDragOffset({
        x: e.clientX - (rect.left - editorRect.left),
        y: e.clientY - (rect.top - editorRect.top)
      });
    }
  };

  const handleTextBoxDrag = (e: React.MouseEvent) => {
    if (!isTextBoxDragging || !selectedTextBox) return;
    
    const editorRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newX = e.clientX - editorRect.left - textBoxDragOffset.x;
    const newY = e.clientY - editorRect.top - textBoxDragOffset.y;
    
    setTextBoxes(prev => prev.map(tb => 
      tb.id === selectedTextBox 
        ? { ...tb, x: Math.max(0, newX), y: Math.max(0, newY) }
        : tb
    ));
  };

  const handleTextBoxDragEnd = () => {
    setIsTextBoxDragging(false);
  };

  const handleTextBoxResizeStart = (e: React.MouseEvent, textBoxId: string, direction: string) => {
    e.stopPropagation();
    setIsTextBoxResizing(true);
    setSelectedTextBox(textBoxId);
    
    const textBox = textBoxes.find(tb => tb.id === textBoxId);
    if (textBox) {
      setTextBoxResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: textBox.width,
        height: textBox.height
      });
    }
  };

  const handleTextBoxRotateStart = (e: React.MouseEvent, textBoxId: string) => {
    e.stopPropagation();
    setIsTextBoxRotating(true);
    setSelectedTextBox(textBoxId);
    
    const textBox = textBoxes.find(tb => tb.id === textBoxId);
    if (textBox) {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
      
      setTextBoxRotateStart({
        x: centerX,
        y: centerY,
        angle: angle - textBox.rotation
      });
    }
  };

  const handleTextBoxMouseMove = (e: React.MouseEvent) => {
    if (isTextBoxDragging && selectedTextBox) {
      handleTextBoxDrag(e);
    } else if (isTextBoxResizing && selectedTextBox) {
      const textBox = textBoxes.find(tb => tb.id === selectedTextBox);
      if (textBox) {
        const deltaX = e.clientX - textBoxResizeStart.x;
        const deltaY = e.clientY - textBoxResizeStart.y;
        
        const newWidth = Math.max(50, textBoxResizeStart.width + deltaX);
        const newHeight = Math.max(30, textBoxResizeStart.height + deltaY);
        
        handleTextBoxResize(selectedTextBox, newWidth, newHeight);
      }
    } else if (isTextBoxRotating && selectedTextBox) {
      const textBox = textBoxes.find(tb => tb.id === selectedTextBox);
      if (textBox) {
        const angle = Math.atan2(e.clientY - textBoxRotateStart.y, e.clientX - textBoxRotateStart.x) * 180 / Math.PI;
        const newRotation = angle - textBoxRotateStart.angle;
        handleTextBoxRotate(selectedTextBox, newRotation);
      }
    }
  };

  const handleTextBoxMouseUp = () => {
    setIsTextBoxDragging(false);
    setIsTextBoxResizing(false);
    setIsTextBoxRotating(false);
  };

  const handleTextBoxResize = (textBoxId: string, newWidth: number, newHeight: number) => {
    setTextBoxes(prev => prev.map(tb => 
      tb.id === textBoxId 
        ? { ...tb, width: newWidth, height: newHeight }
        : tb
    ));
  };

  const handleTextBoxRotate = (textBoxId: string, newRotation: number) => {
    setTextBoxes(prev => prev.map(tb => 
      tb.id === textBoxId 
        ? { ...tb, rotation: newRotation }
        : tb
    ));
  };

  const handleTextBoxDelete = (textBoxId: string) => {
    setTextBoxes(prev => prev.filter(tb => tb.id !== textBoxId));
    setSelectedTextBox(null);
  };

  const handleTextBoxDoubleClick = (textBoxId: string) => {
    const textBox = textBoxes.find(tb => tb.id === textBoxId);
    if (textBox) {
      setEditingTextBoxId(textBoxId);
      setEditingText(textBox.text);
      setIsTextEditing(true);
    }
  };

  const handleTextEditSave = () => {
    if (editingTextBoxId && editingText !== null) {
      setTextBoxes(prev => prev.map(tb => 
        tb.id === editingTextBoxId 
          ? { ...tb, text: editingText }
          : tb
      ));
    }
    setIsTextEditing(false);
    setEditingTextBoxId(null);
    setEditingText('');
  };

  const handleTextEditCancel = () => {
    setIsTextEditing(false);
    setEditingTextBoxId(null);
    setEditingText('');
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
      theme: theme,
      attachments: attachments.map(file => file.name),
      images: images,
      textBoxes: textBoxes
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
    setImages([]);
    setTextBoxes([]);
    setSelectedImage(null);
    setSelectedTextBox(null);
    
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
    <div className={styles.pageContainer}>
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
                  {entry.theme && (
                    <div className={styles.entryTheme}>
                      <span className={styles.themeLabel}>Theme: {entry.theme}</span>
                    </div>
                  )}
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

      <main className={styles.editorSection + ' ' + styles[theme]}>
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
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="imageUpload"
          />
          <label htmlFor="imageUpload" className={styles.imageUploadBtn}>
            📷 Add Image
          </label>
          <button onClick={handleAddTextBox} className={styles.textBoxUploadBtn}>
            📝 Add Text Box
          </button>
        </div>
        <div 
          className={styles.editor}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={(e) => {
            // If clicking on the editor area (not on an image), focus the Quill editor
            if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('ql-editor')) {
              quillRef.current?.focus();
            }
          }}
        >
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={setContent}
            className={styles.quillEditor}
            modules={{ 
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link'],
                ['clean']
              ],
              clipboard: {
                matchVisual: false
              },
              keyboard: {
                bindings: {
                  tab: false
                }
              }
            }}
            formats={[ 'bold','italic','underline','list','bullet','link' ]}
            placeholder="Start writing anywhere in this area..."
            theme="snow"
          />
          
          {/* Images can be placed anywhere in the editor */}
        {images.map((image) => (
          <div
            key={image.id}
            className={`${styles.imageContainer} ${selectedImage === image.id ? styles.selected : ''}`}
            style={{
              position: 'absolute',
              left: image.x,
              top: image.y,
              width: image.width,
              height: image.height,
              transform: `rotate(${image.rotation}deg)`,
              cursor: isDragging ? 'grabbing' : 'grab',
              zIndex: selectedImage === image.id ? 1000 : 1
            }}
            onMouseDown={(e) => handleImageDragStart(e, image.id)}
            onClick={() => handleImageSelect(image.id)}
          >
            <img
              src={image.src}
              alt="Uploaded"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px',
                pointerEvents: 'none'
              }}
            />
            
            {/* PowerPoint-style resize handles */}
            {selectedImage === image.id && (
              <>
                {/* Corner resize handles */}
                <div 
                  className={styles.resizeHandle + ' ' + styles.topLeft}
                  onMouseDown={(e) => handleResizeStart(e, image.id, 'top-left')}
                />
                <div 
                  className={styles.resizeHandle + ' ' + styles.topRight}
                  onMouseDown={(e) => handleResizeStart(e, image.id, 'top-right')}
                />
                <div 
                  className={styles.resizeHandle + ' ' + styles.bottomLeft}
                  onMouseDown={(e) => handleResizeStart(e, image.id, 'bottom-left')}
                />
                <div 
                  className={styles.resizeHandle + ' ' + styles.bottomRight}
                  onMouseDown={(e) => handleResizeStart(e, image.id, 'bottom-right')}
                />
                
                {/* Side resize handles */}
                <div 
                  className={styles.resizeHandle + ' ' + styles.top}
                  onMouseDown={(e) => handleResizeStart(e, image.id, 'top')}
                />
                <div 
                  className={styles.resizeHandle + ' ' + styles.bottom}
                  onMouseDown={(e) => handleResizeStart(e, image.id, 'bottom')}
                />
                <div 
                  className={styles.resizeHandle + ' ' + styles.left}
                  onMouseDown={(e) => handleResizeStart(e, image.id, 'left')}
                />
                <div 
                  className={styles.resizeHandle + ' ' + styles.right}
                  onMouseDown={(e) => handleResizeStart(e, image.id, 'right')}
                />
                
                {/* Rotate handle */}
                <div 
                  className={styles.rotateHandle}
                  onMouseDown={(e) => handleRotateStart(e, image.id)}
                />
                
                {/* Delete button */}
                <button
                  onClick={() => handleImageDelete(image.id)}
                  className={styles.deleteBtn}
                  title="Delete"
                >
                  ❌
                </button>
              </>
            )}
                      </div>
          ))}
          
          {/* Text Boxes can be placed anywhere in the editor */}
          {textBoxes.map((textBox) => (
            <div
              key={textBox.id}
              className={`${styles.textBoxContainer} ${selectedTextBox === textBox.id ? styles.selected : ''}`}
              style={{
                position: 'absolute',
                left: textBox.x,
                top: textBox.y,
                width: textBox.width,
                height: textBox.height,
                transform: `rotate(${textBox.rotation}deg)`,
                cursor: isTextBoxDragging ? 'grabbing' : 'grab',
                zIndex: selectedTextBox === textBox.id ? 1000 : 1,
                fontFamily: textBox.fontFamily,
                fontSize: textBox.fontSize + 'px',
                color: textBox.color
              }}
              onMouseDown={(e) => handleTextBoxDragStart(e, textBox.id)}
              onClick={() => handleTextBoxSelect(textBox.id)}
              onDoubleClick={() => handleTextBoxDoubleClick(textBox.id)}
            >
              <div>
                {textBox.text}
              </div>
              
              {/* PowerPoint-style resize handles */}
              {selectedTextBox === textBox.id && (
                <>
                  {/* Corner resize handles */}
                  <div 
                    className={styles.resizeHandle + ' ' + styles.topLeft}
                    onMouseDown={(e) => handleTextBoxResizeStart(e, textBox.id, 'top-left')}
                  />
                  <div 
                    className={styles.resizeHandle + ' ' + styles.topRight}
                    onMouseDown={(e) => handleTextBoxResizeStart(e, textBox.id, 'top-right')}
                  />
                  <div 
                    className={styles.resizeHandle + ' ' + styles.bottomLeft}
                    onMouseDown={(e) => handleTextBoxResizeStart(e, textBox.id, 'bottom-left')}
                  />
                  <div 
                    className={styles.resizeHandle + ' ' + styles.bottomRight}
                    onMouseDown={(e) => handleTextBoxResizeStart(e, textBox.id, 'bottom-right')}
                  />
                  
                  {/* Side resize handles */}
                  <div 
                    className={styles.resizeHandle + ' ' + styles.top}
                    onMouseDown={(e) => handleTextBoxResizeStart(e, textBox.id, 'top')}
                  />
                  <div 
                    className={styles.resizeHandle + ' ' + styles.bottom}
                    onMouseDown={(e) => handleTextBoxResizeStart(e, textBox.id, 'bottom')}
                  />
                  <div 
                    className={styles.resizeHandle + ' ' + styles.left}
                    onMouseDown={(e) => handleTextBoxResizeStart(e, textBox.id, 'left')}
                  />
                  <div 
                    className={styles.resizeHandle + ' ' + styles.right}
                    onMouseDown={(e) => handleTextBoxResizeStart(e, textBox.id, 'right')}
                  />
                  
                  {/* Rotate handle */}
                  <div 
                    className={styles.rotateHandle}
                    onMouseDown={(e) => handleTextBoxRotateStart(e, textBox.id)}
                  />
                  
                  {/* Delete button */}
                  <button
                    onClick={() => handleTextBoxDelete(textBox.id)}
                    className={styles.deleteBtn}
                    title="Delete"
                  >
                    ❌
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <button className={styles.saveBtn} onClick={handleSaveEntry}>Save Entry</button>
      </footer>

      {isTextEditing && (
        <div className={styles.textEditModal}>
          <div className={styles.modalContent}>
            <h3>Edit Text Box</h3>
            <textarea
              value={editingText}
              onChange={e => setEditingText(e.target.value)}
              className={styles.textEditArea}
            />
            <div className={styles.modalButtons}>
              <button onClick={handleTextEditSave} className={styles.saveBtn}>Save</button>
              <button onClick={handleTextEditCancel} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;


/* JournalPage.module.css */
