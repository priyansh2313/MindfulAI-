// Email Service - Handles sending invitation emails to family members

export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
}

export interface EmailInvitation {
  toEmail: string;
  toName: string;
  fromName: string;
  invitationLink: string;
  message?: string;
  expiresAt: Date;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private baseUrl = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 'https://mindfulai-wv9z.onrender.com';

  // Send invitation email
  async sendInvitationEmail(invitation: EmailInvitation): Promise<EmailResponse> {
    try {
      const emailTemplate = this.generateInvitationTemplate(invitation);
      
      const response = await fetch(`${this.baseUrl}/api/family/email/send-invitation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          toEmail: invitation.toEmail,
          toName: invitation.toName,
          fromName: invitation.fromName,
          subject: emailTemplate.subject,
          htmlBody: emailTemplate.htmlBody,
          textBody: emailTemplate.textBody,
          invitationLink: invitation.invitationLink,
          expiresAt: invitation.expiresAt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation email');
      }

      const result = await response.json();
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending invitation email:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate invitation email template
  private generateInvitationTemplate(invitation: EmailInvitation): EmailTemplate {
    const subject = `${invitation.fromName} invited you to join Care Connect`;
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Care Connect Invitation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .footer { background: #e2e8f0; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #64748b; }
          .expiry { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .feature { display: flex; align-items: center; margin: 10px 0; }
          .feature-icon { width: 20px; height: 20px; margin-right: 10px; color: #8b5cf6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Care Connect</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Stay connected with your family</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1e293b; margin-top: 0;">You're invited to join Care Connect!</h2>
            
            <p>Hi ${invitation.toName},</p>
            
            <p><strong>${invitation.fromName}</strong> has invited you to join their Care Connect family circle. This platform helps families stay connected and support each other's health and well-being.</p>
            
            ${invitation.message ? `<p><strong>Personal message from ${invitation.fromName}:</strong></p><p style="background: #f1f5f9; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6;">"${invitation.message}"</p>` : ''}
            
            <div class="features">
              <h3 style="color: #1e293b; margin-top: 0;">What you can do with Care Connect:</h3>
              <div class="feature">
                <span class="feature-icon">❤️</span>
                <span>Share health wins and achievements</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🤝</span>
                <span>Ask for help when you need support</span>
              </div>
              <div class="feature">
                <span class="feature-icon">📅</span>
                <span>Respond to health check-ins</span>
              </div>
              <div class="feature">
                <span class="feature-icon">📱</span>
                <span>Stay connected with voice messages</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${invitation.invitationLink}" class="button">Accept Invitation</a>
            </div>
            
            <div class="expiry">
              <strong>⏰ This invitation expires on ${invitation.expiresAt.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</strong>
            </div>
            
            <p style="font-size: 14px; color: #64748b;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${invitation.invitationLink}" style="color: #8b5cf6;">${invitation.invitationLink}</a>
            </p>
          </div>
          
          <div class="footer">
            <p>This invitation was sent from Care Connect, a family health management platform.</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textBody = `
Care Connect Invitation

Hi ${invitation.toName},

${invitation.fromName} has invited you to join their Care Connect family circle. This platform helps families stay connected and support each other's health and well-being.

${invitation.message ? `Personal message from ${invitation.fromName}:\n"${invitation.message}"\n` : ''}

What you can do with Care Connect:
❤️ Share health wins and achievements
🤝 Ask for help when you need support
📅 Respond to health check-ins
📱 Stay connected with voice messages

Accept your invitation here: ${invitation.invitationLink}

This invitation expires on ${invitation.expiresAt.toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

If you didn't expect this invitation, you can safely ignore this email.

Best regards,
The Care Connect Team
    `;

    return { subject, htmlBody, textBody };
  }

  // Send reminder email
  async sendReminderEmail(invitation: EmailInvitation): Promise<EmailResponse> {
    try {
      const reminderTemplate = this.generateReminderTemplate(invitation);
      
      const response = await fetch(`${this.baseUrl}/api/email/send-reminder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          toEmail: invitation.toEmail,
          toName: invitation.toName,
          fromName: invitation.fromName,
          subject: reminderTemplate.subject,
          htmlBody: reminderTemplate.htmlBody,
          textBody: reminderTemplate.textBody,
          invitationLink: invitation.invitationLink,
          expiresAt: invitation.expiresAt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reminder email');
      }

      const result = await response.json();
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending reminder email:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate reminder email template
  private generateReminderTemplate(invitation: EmailInvitation): EmailTemplate {
    const subject = `Reminder: ${invitation.fromName} is waiting for you on Care Connect`;
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Care Connect Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .footer { background: #e2e8f0; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #64748b; }
          .urgent { background: #fef2f2; border: 1px solid #ef4444; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Care Connect Reminder</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your invitation is waiting</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1e293b; margin-top: 0;">Don't miss out on staying connected!</h2>
            
            <p>Hi ${invitation.toName},</p>
            
            <p><strong>${invitation.fromName}</strong> is still waiting for you to join their Care Connect family circle. They want to stay connected and support each other's health and well-being.</p>
            
            <div class="urgent">
              <strong>⏰ Your invitation expires soon!</strong><br>
              Please accept your invitation before it expires on ${invitation.expiresAt.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            
            <div style="text-align: center;">
              <a href="${invitation.invitationLink}" class="button">Accept Invitation Now</a>
            </div>
            
            <p style="font-size: 14px; color: #64748b;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${invitation.invitationLink}" style="color: #f59e0b;">${invitation.invitationLink}</a>
            </p>
          </div>
          
          <div class="footer">
            <p>This reminder was sent from Care Connect, a family health management platform.</p>
            <p>If you don't want to join, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textBody = `
Care Connect Reminder

Hi ${invitation.toName},

${invitation.fromName} is still waiting for you to join their Care Connect family circle. They want to stay connected and support each other's health and well-being.

⏰ Your invitation expires soon!
Please accept your invitation before it expires on ${invitation.expiresAt.toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

Accept your invitation here: ${invitation.invitationLink}

If you don't want to join, you can safely ignore this email.

Best regards,
The Care Connect Team
    `;

    return { subject, htmlBody, textBody };
  }

  // Send welcome email to new family member
  async sendWelcomeEmail(userEmail: string, userName: string, familyMemberName: string): Promise<EmailResponse> {
    try {
      const welcomeTemplate = this.generateWelcomeTemplate(userName, familyMemberName);
      
      const response = await fetch(`${this.baseUrl}/api/email/send-welcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          toEmail: userEmail,
          toName: userName,
          fromName: familyMemberName,
          subject: welcomeTemplate.subject,
          htmlBody: welcomeTemplate.htmlBody,
          textBody: welcomeTemplate.textBody,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send welcome email');
      }

      const result = await response.json();
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate welcome email template
  private generateWelcomeTemplate(userName: string, familyMemberName: string): EmailTemplate {
    const subject = `Welcome to Care Connect, ${userName}!`;
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Care Connect</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .footer { background: #e2e8f0; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #64748b; }
          .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .feature { display: flex; align-items: center; margin: 10px 0; }
          .feature-icon { width: 20px; height: 20px; margin-right: 10px; color: #10b981; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Care Connect!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">You're now part of the family circle</p>
          </div>
          
          <div class="content">
            <h2 style="color: #1e293b; margin-top: 0;">Welcome, ${userName}! 🎉</h2>
            
            <p>Great news! You've successfully joined <strong>${familyMemberName}'s</strong> Care Connect family circle. You're now part of a platform that helps families stay connected and support each other's health and well-being.</p>
            
            <div class="features">
              <h3 style="color: #1e293b; margin-top: 0;">What you can do now:</h3>
              <div class="feature">
                <span class="feature-icon">❤️</span>
                <span>Share health wins and achievements</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🤝</span>
                <span>Ask for help when you need support</span>
              </div>
              <div class="feature">
                <span class="feature-icon">📅</span>
                <span>Respond to health check-ins</span>
              </div>
              <div class="feature">
                <span class="feature-icon">📱</span>
                <span>Stay connected with voice messages</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000'}/care-connect" class="button">Go to Care Connect</a>
            </div>
            
            <p style="font-size: 14px; color: #64748b;">
              You can now access Care Connect anytime to stay connected with your family.
            </p>
          </div>
          
          <div class="footer">
            <p>Welcome to Care Connect, a family health management platform.</p>
            <p>Thank you for joining the family circle!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textBody = `
Welcome to Care Connect!

Welcome, ${userName}! 🎉

Great news! You've successfully joined ${familyMemberName}'s Care Connect family circle. You're now part of a platform that helps families stay connected and support each other's health and well-being.

What you can do now:
❤️ Share health wins and achievements
🤝 Ask for help when you need support
📅 Respond to health check-ins
📱 Stay connected with voice messages

Go to Care Connect: ${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000'}/care-connect

You can now access Care Connect anytime to stay connected with your family.

Welcome to Care Connect, a family health management platform.
Thank you for joining the family circle!

Best regards,
The Care Connect Team
    `;

    return { subject, htmlBody, textBody };
  }
}

export const emailService = new EmailService();
export default emailService; 