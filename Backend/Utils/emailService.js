import { Resend } from 'resend';
import validator from 'validator';


const resend = new Resend('re_WN1CbMzo_CfH4z7W8cVvgqDDWH4GJ5d12'); // need to move this to .env as API_KEY
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return validator.isEmail(email);
};

export const insertSurveyLink = (message, studyUrl) => {
  const placeholder = '[Survey_Link]';

  let processedMessage = message;

  // checking if the plcaholder exist in the message
  if (processedMessage.includes(placeholder)) {
    // then replace this placeholder with the acutal link of the survey
    processedMessage = processedMessage.replace(
      placeholder,
      `<a href="${studyUrl}">Click here to take the survey</a>`
    );
  } else {
    // and if not link appends, then but the link by  default at the end
    processedMessage += `
    <p>Please click the link below to begin the survey:</p>
    <p><a href="${studyUrl}">Take the Survey</a></p>
  `;
  }

  return processedMessage;
};

export const sendStudyInvitation = async (to, subject, message, studyUrl) => {
  try {
    // Validate the email
    if (!validateEmail(to)) {
      return { 
        success: false, 
        error: `Invalid email format: ${to}` 
      };
    }
    
    // Insert the survey link into the message
    const htmlContent = insertSurveyLink(
      message.replace(/\n/g, '<br>'), 
      studyUrl
    );
    
    
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Study Invitations <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: htmlContent,
    });
    
    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      messageId: data.id 
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error sending email' 
    };
  }
};