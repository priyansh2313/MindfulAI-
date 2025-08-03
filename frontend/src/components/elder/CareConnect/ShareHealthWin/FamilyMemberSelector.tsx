import { Check, Users } from 'lucide-react';
import React from 'react';
import styles from '../../../../styles/elder/CareConnect.module.css';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
}

interface FamilyMemberSelectorProps {
  familyMembers: FamilyMember[];
  selectedMembers: string[];
  onSelectionChange: (selected: string[]) => void;
  onComplete: () => void;
}

export default function FamilyMemberSelector({ 
  familyMembers, 
  selectedMembers, 
  onSelectionChange, 
  onComplete 
}: FamilyMemberSelectorProps) {
  const handleMemberToggle = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      onSelectionChange(selectedMembers.filter(id => id !== memberId));
    } else {
      onSelectionChange([...selectedMembers, memberId]);
    }
  };

  const handleSelectAll = () => {
    onSelectionChange(familyMembers.map(member => member.id));
  };

  const handleSelectNone = () => {
    onSelectionChange([]);
  };

  return (
    <div className={styles.familySelector}>
      <div className={styles.familySelectorHeader}>
        <div className={styles.familySelectorIcon}>
          <Users className={styles.familySelectorIconInner} />
        </div>
        <div className={styles.familySelectorText}>
          <h2 className={styles.familySelectorTitle}>Share with Family</h2>
          <p className={styles.familySelectorSubtitle}>Choose who to share your health win with</p>
        </div>
      </div>

      <div className={styles.familySelectorActions}>
        <button 
          className={styles.selectAllButton}
          onClick={handleSelectAll}
        >
          Select All
        </button>
        <button 
          className={styles.selectNoneButton}
          onClick={handleSelectNone}
        >
          Select None
        </button>
      </div>

      <div className={styles.familyMembersList}>
        {familyMembers.map(member => (
          <button
            key={member.id}
            className={`${styles.familyMemberItem} ${selectedMembers.includes(member.id) ? styles.selected : ''}`}
            onClick={() => handleMemberToggle(member.id)}
          >
            <div className={styles.familyMemberAvatar}>
              <span className={styles.familyMemberInitials}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
              {selectedMembers.includes(member.id) && (
                <div className={styles.familyMemberCheck}>
                  <Check className={styles.familyMemberCheckIcon} />
                </div>
              )}
            </div>
            <div className={styles.familyMemberInfo}>
              <h4 className={styles.familyMemberName}>{member.name}</h4>
              <p className={styles.familyMemberRelationship}>{member.relationship}</p>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.familySelectorActions}>
        <button 
          className={styles.shareButton}
          onClick={onComplete}
          disabled={selectedMembers.length === 0}
        >
          Share Health Win
        </button>
      </div>
    </div>
  );
} 