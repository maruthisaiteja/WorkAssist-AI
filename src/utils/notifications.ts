import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Create transporter only if environment variables are present
const transporter = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}) : null;

const twilioClient = process.env.TWILIO_ACCOUNT_SID ? twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
) : null;

export async function sendEmailNotification(to: string, facultyName: string, subject: string, message: string) {
  if (!transporter) {
    console.log(`[Email Simulation] To: ${facultyName} (${to}), Subject: ${subject}`);
    return;
  }

  const emailHtml = `
    <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
      <h2 style="color: #2563eb;">Department Of Information Technology,VCE</h2>
      <p>Dear <strong>${facultyName}</strong>,</p>
      <p>${message}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Vardhaman IT" <no-reply@vardhaman.org>',
      to,
      subject: `[Vardhaman IT] ${subject}`,
      html: emailHtml,
    });
    console.log(`[Email Sent] To: ${to}`);
  } catch (error) {
    console.error(`[Email Error] ${error}`);
  }
}

export async function sendSMSNotification(to: string, facultyName: string, message: string) {
  if (!twilioClient) {
    console.log(`[SMS Simulation] To: ${facultyName} (${to}), Message: ${message}`);
    return;
  }

  if (to === '0000000000') return;

  try {
    await twilioClient.messages.create({
      body: `\nDept. Of INF,VCE  \nDear ${facultyName},\n${message}\n Dr.Sreenivasulu Gogula\nHoD-INF,VCE`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log(`[SMS Sent] To: ${to}`);
  } catch (error) {
    console.error(`[SMS Error] ${error}`);
  }
}

export async function sendWhatsAppNotification(to: string, facultyName: string, message: string) {
  if (!twilioClient) {
    console.log(`[WhatsApp Simulation] To: ${facultyName} (${to}), Message: ${message}`);
    return;
  }

  if (to === '0000000000') return;

  try {
    await twilioClient.messages.create({
      body: `Vardhaman IT Alert: Dear ${facultyName}, ${message}`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
    });
    console.log(`[WhatsApp Sent] To: ${to}`);
  } catch (error) {
    console.error(`[WhatsApp Error] ${error}`);
  }
}
