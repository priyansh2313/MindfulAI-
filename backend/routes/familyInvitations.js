const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Add CORS headers to all routes in this router
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Mock database for invitations (in production, use MongoDB)
let invitations = new Map();
let familyUsers = new Map();

// Email transporter (configure for your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER || 'priyanshudrew23@gmail.com',
    pass: process.env.EMAIL_PASS || 'jmcw vqhg yhib dtoe',
  },
});

// Check if email is properly configured
const isEmailConfigured = () => {
  const emailUser = process.env.EMAIL_USER || 'priyanshudrew23@gmail.com';
  const emailPass = process.env.EMAIL_PASS || 'jmcw vqhg yhib dtoe';
  
  // For now, allow the default credentials to work
  return emailUser && emailPass;
};

// Generate invitation ID
function generateInvitationId() {
  return `inv_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}

// Send invitation email
async function sendInvitationEmail(invitationData) {
  const { toEmail, toName, fromName, invitationLink, message, expiresAt } = invitationData;
  
  // Check if email is properly configured
  if (!isEmailConfigured()) {
    console.log('Email not configured, logging invitation details instead:');
    console.log('To:', toEmail);
    console.log('From:', fromName);
    console.log('Invitation Link:', invitationLink);
    console.log('Message:', message);
    console.log('Expires:', expiresAt);
    
    return { 
      success: true, 
      messageId: 'demo-' + Date.now(),
      demo: true,
      message: 'Email not configured - invitation details logged to console'
    };
  }
  
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
          
          <p>Hi ${toName},</p>
          
          <p><strong>${fromName}</strong> has invited you to join their Care Connect family circle. This platform helps families stay connected and support each other's health and well-being.</p>
          
          ${message ? `<p><strong>Personal message from ${fromName}:</strong></p><p style="background: #f1f5f9; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6;">"${message}"</p>` : ''}
          
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
            <a href="${invitationLink}" class="button">Accept Invitation</a>
          </div>
          
          <div class="expiry">
            <strong>⏰ This invitation expires on ${new Date(expiresAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</strong>
          </div>
          
          <p style="font-size: 14px; color: #64748b;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${invitationLink}" style="color: #8b5cf6;">${invitationLink}</a>
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

Hi ${toName},

${fromName} has invited you to join their Care Connect family circle. This platform helps families stay connected and support each other's health and well-being.

${message ? `Personal message from ${fromName}:\n"${message}"\n` : ''}

What you can do with Care Connect:
❤️ Share health wins and achievements
🤝 Ask for help when you need support
📅 Respond to health check-ins
📱 Stay connected with voice messages

Accept your invitation here: ${invitationLink}

This invitation expires on ${new Date(expiresAt).toLocaleDateString('en-US', { 
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

  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@gmail.com',
    to: toEmail,
    subject: `${fromName} invited you to join Care Connect`,
    html: htmlBody,
    text: textBody,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// Create new invitation
router.post('/invitations', async (req, res) => {
  try {
    const {
      email,
      name,
      relationship,
      message,
      fromUserId,
      invitationId,
      invitationLink,
      fromName,
      expiresAt
    } = req.body;

    const invitation = {
      id: invitationId,
      fromUserId,
      toEmail: email,
      toName: name,
      relationship,
      message,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(expiresAt),
      fromName,
      invitationLink
    };

    invitations.set(invitationId, invitation);
    console.log('Stored invitation:', invitationId, invitation);
    console.log('Total invitations in memory:', invitations.size);

    // Send email invitation
    const emailResult = await sendInvitationEmail({
      toEmail: email,
      toName: name,
      fromName,
      invitationLink,
      message,
      expiresAt: new Date(expiresAt)
    });

    if (!emailResult.success) {
      console.warn('Email sending failed:', emailResult.error);
    }

    res.json(invitation);
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({ error: 'Failed to create invitation' });
  }
});

// Get invitation by ID
router.get('/invitations/:invitationId', (req, res) => {
  try {
    const { invitationId } = req.params;
    console.log('Looking for invitation:', invitationId);
    console.log('Available invitations:', Array.from(invitations.keys()));
    
    const invitation = invitations.get(invitationId);

    if (!invitation) {
      console.log('Invitation not found:', invitationId);
      return res.status(404).json({ error: 'Invitation not found' });
    }

    console.log('Found invitation:', invitation);

    // Check if expired
    if (new Date() > new Date(invitation.expiresAt)) {
      invitation.status = 'expired';
    }

    res.json(invitation);
  } catch (error) {
    console.error('Error getting invitation:', error);
    res.status(500).json({ error: 'Failed to get invitation' });
  }
});

// Accept invitation
router.post('/invitations/:invitationId/accept', async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { name, email, password } = req.body;

    const invitation = invitations.get(invitationId);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Invitation already processed' });
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      return res.status(400).json({ error: 'Invitation has expired' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new family user in main database
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const familyUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'family',
      familyCircle: invitation.fromUserId,
      invitedBy: invitation.fromName, // Add the name of the user who invited them
      whoInvited: invitation.fromName, // Alternative field for clarity
      age: 0, // Default age for family users
      phone: 'N/A', // Default phone for family users
      dob: new Date().toISOString().split('T')[0] // Default date of birth
    });

    // Update invitation status
    invitation.status = 'accepted';
    invitation.acceptedAt = new Date();
    invitation.acceptedBy = familyUser._id;

    invitations.set(invitationId, invitation);

    // Generate JWT token
    const token = jwt.sign({ id: familyUser._id, email, role: 'family' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      userId: familyUser._id,
      token,
      user: {
        _id: familyUser._id,
        name: familyUser.name,
        email: familyUser.email,
        role: familyUser.role,
        familyCircle: familyUser.familyCircle
      }
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
});

// Get pending invitations for a user
router.get('/invitations', (req, res) => {
  try {
    const { fromUserId } = req.query;
    const userInvitations = Array.from(invitations.values())
      .filter(inv => inv.fromUserId === fromUserId)
      .map(inv => ({
        ...inv,
        isExpired: new Date() > new Date(inv.expiresAt)
      }));

    res.json(userInvitations);
  } catch (error) {
    console.error('Error getting invitations:', error);
    res.status(500).json({ error: 'Failed to get invitations' });
  }
});

// Cancel invitation
router.delete('/invitations/:invitationId', (req, res) => {
  try {
    const { invitationId } = req.params;
    const invitation = invitations.get(invitationId);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    invitations.delete(invitationId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error canceling invitation:', error);
    res.status(500).json({ error: 'Failed to cancel invitation' });
  }
});

// Resend invitation
router.post('/invitations/:invitationId/resend', async (req, res) => {
  try {
    const { invitationId } = req.params;
    const invitation = invitations.get(invitationId);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Can only resend pending invitations' });
    }

    // Update expiry date
    invitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    invitations.set(invitationId, invitation);

    // Resend email
    const emailResult = await sendInvitationEmail({
      toEmail: invitation.toEmail,
      toName: invitation.toName,
      fromName: invitation.fromName,
      invitationLink: invitation.invitationLink,
      message: invitation.message,
      expiresAt: invitation.expiresAt
    });

    if (!emailResult.success) {
      console.warn('Email resend failed:', emailResult.error);
    }

    res.json({ success: true, invitation });
  } catch (error) {
    console.error('Error resending invitation:', error);
    res.status(500).json({ error: 'Failed to resend invitation' });
  }
});

// Email sending endpoint
router.post('/email/send-invitation', async (req, res) => {
  try {
    const { toEmail, toName, fromName, invitationLink, message, expiresAt } = req.body;
    
    const emailResult = await sendInvitationEmail({
      toEmail,
      toName,
      fromName,
      invitationLink,
      message,
      expiresAt: new Date(expiresAt)
    });

    if (emailResult.success) {
      if (emailResult.demo) {
        res.json({ 
          success: true, 
          messageId: emailResult.messageId,
          demo: true,
          message: emailResult.message
        });
      } else {
        res.json({ success: true, messageId: emailResult.messageId });
      }
    } else {
      res.status(500).json({ error: emailResult.error });
    }
  } catch (error) {
    console.error('Error sending invitation email:', error);
    res.status(500).json({ error: 'Failed to send invitation email' });
  }
});

module.exports = router; 