const nodemailer = require('nodemailer');

// --- HARDCODED CREDENTIALS (Hackathon Mode) ---
const MY_EMAIL = 'sarthakkandpal2005@gmail.com';  // <--- PUT YOUR GMAIL HERE
const MY_PASSWORD = 'rwzn atnq fmji fxdt'; // <--- PUT YOUR 16-CHAR APP PASSWORD HERE

// 1. Configure the Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MY_EMAIL,
    pass: MY_PASSWORD
  }
});

/**
 * Sends a Critical Alert Email to the Authority
 */
const sendAlert = async (stationId, ohiScore, region, recipientEmail) => {
  try {
    const mailOptions = {
      from: `"AquaPulse Emergency System" <${MY_EMAIL}>`,
      to: recipientEmail,
      subject: `🚨 CRITICAL ALERT: Pollution Detected at ${region}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc;">
          <h2 style="color: #d9534f;">⚠️ CRITICAL WATER QUALITY ALERT</h2>
          <p>This is an automated message from the <strong>AquaPulse Monitoring Grid</strong>.</p>
          
          <table style="width: 100%; text-align: left;">
            <tr>
              <th>Station ID:</th>
              <td>${stationId}</td>
            </tr>
            <tr>
              <th>Region:</th>
              <td>${region}</td>
            </tr>
            <tr>
              <th>Ocean Health Index (OHI):</th>
              <td style="color: red; font-weight: bold;">${ohiScore} / 100 (CRITICAL)</td>
            </tr>
            <tr>
              <th>Time:</th>
              <td>${new Date().toLocaleString()}</td>
            </tr>
          </table>

          <p>Please dispatch a cleanup crew or inspection drone immediately.</p>
          <br/>
          <a href="http://localhost:5173/dashboard" style="background-color: #d9534f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Open Command Dashboard
          </a>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Alert Email Sent to ${recipientEmail}: ${info.messageId}`);
    return true;

  } catch (error) {
    console.error("❌ Email Failed:", error.message);
    return false;
  }
};

module.exports = { sendAlert };