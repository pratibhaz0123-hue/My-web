const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Only POST requests are allowed.' });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (error) {
        body = {};
      }
    }

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide your name, email, and message.' });
    }

    const recipient = process.env.TO_EMAIL || 'upretiaaditya53@gmail.com';
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    if (!gmailUser || !gmailPass) {
      return res.status(500).json({
        success: false,
        message: 'Mail settings are not configured yet. Add GMAIL_USER and GMAIL_PASS in Vercel.'
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    await transporter.sendMail({
      from: `${name} <${gmailUser}>`,
      to: recipient,
      replyTo: email,
      subject: `New message from ${name} via aaditya portfolio`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h3>New message received</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br />')}</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('send-message error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
};
