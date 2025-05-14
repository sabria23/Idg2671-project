// emailService.js
import { Resend } from 'resend';

const resend = new Resend('re_WN1CbMzo_CfH4z7W8cVvgqDDWH4GJ5d12'); // need to move this to .env as API_KEY

export const sendStudyInvitation = async (to, subject, message, studyUrl) => {
  try {
    // Add the study link to the message
    const htmlContent = `
      ${message.replace(/\n/g, '<br>')}
      <p><a href="${studyUrl}">Click here to take the survey</a></p>
    `;
    
    const { data, error } = await resend.emails.send({
      from: 'Study Invitations <onboarding@resend.dev>', // Use their sandbox domain initially
      to: [to],
      subject: subject,
      html: htmlContent,
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};