import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Heart, Users, CheckCircle } from 'lucide-react';
import styles from '../../../../styles/elder/CareConnect.module.css';
import familyInvitationService, { InvitationTemplate } from '../../../../services/familyInvitationService';

interface InvitationTemplatesProps {
  onSelectTemplate: (template: InvitationTemplate) => void;
  onBack: () => void;
}

export default function InvitationTemplates({
  onSelectTemplate,
  onBack
}: InvitationTemplatesProps) {
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<InvitationTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const fetchedTemplates = await familyInvitationService.getInvitationTemplates();
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: InvitationTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general':
        return <Users className={styles.categoryIcon} />;
      case 'health':
        return <Heart className={styles.categoryIcon} />;
      case 'care':
        return <CheckCircle className={styles.categoryIcon} />;
      case 'support':
        return <Mail className={styles.categoryIcon} />;
      default:
        return <Users className={styles.categoryIcon} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general':
        return '#3b82f6';
      case 'health':
        return '#10b981';
      case 'care':
        return '#f59e0b';
      case 'support':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className={styles.templatesContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading invitation templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.templatesContainer}>
      <div className={styles.templatesHeader}>
        <button 
          className={styles.backButton}
          onClick={onBack}
        >
          <ArrowLeft className={styles.backIcon} />
          Back
        </button>
        
        <div className={styles.templatesHeaderContent}>
          <h2 className={styles.templatesHeaderTitle}>Invitation Templates</h2>
          <p className={styles.templatesHeaderSubtitle}>
            Choose a pre-written message for your family invitations
          </p>
        </div>
      </div>

      <div className={styles.templatesGrid}>
        {templates.map((template) => (
          <div
            key={template.id}
            className={`${styles.templateCard} ${selectedTemplate?.id === template.id ? styles.selected : ''}`}
            onClick={() => handleTemplateSelect(template)}
          >
            <div 
              className={styles.templateCardHeader}
              style={{ backgroundColor: getCategoryColor(template.category) }}
            >
              {getCategoryIcon(template.category)}
              <h3 className={styles.templateCardTitle}>{template.title}</h3>
            </div>
            
            <div className={styles.templateCardContent}>
              <p className={styles.templateCardMessage}>{template.message}</p>
              <div className={styles.templateCardCategory}>
                {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
              </div>
            </div>

            {selectedTemplate?.id === template.id && (
              <div className={styles.templateSelectedIndicator}>
                <CheckCircle className={styles.templateSelectedIcon} />
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className={styles.templateActions}>
          <button
            className={styles.useTemplateButton}
            onClick={handleUseTemplate}
          >
            <Mail className={styles.useTemplateIcon} />
            Use This Template
          </button>
          
          <button
            className={styles.customizeTemplateButton}
            onClick={() => onSelectTemplate(selectedTemplate)}
          >
            Customize Template
          </button>
        </div>
      )}

      <div className={styles.templatesFooter}>
        <p className={styles.templatesFooterText}>
          Templates help you quickly send personalized invitations to your family members.
          You can customize any template before sending.
        </p>
      </div>
    </div>
  );
} 