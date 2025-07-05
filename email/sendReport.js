const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { parseTestSummary } = require('../utils/utils');

dotenv.config();

const reportPath = path.resolve(__dirname, '../reports/html-report/index.html');
const screenshotsDir = path.resolve(__dirname, '../reports/screenshots');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail() {
  const summary = parseTestSummary(reportPath);
  const htmlContent = `
    <h3>📋 Playwright API Automation Test Summary</h3>
    <ul>
      <li>✅ Passed: ${summary.passed}</li>
      <li>❌ Failed: ${summary.failed}</li>
      <li>⏭ Skipped: ${summary.skipped}</li>
    </ul>
    <p>Full report attached. Please find the failed test screenshots below if available.</p>
  `;

  const attachments = [{
    filename: 'TestReport.html',
    path: reportPath,
    contentType: 'text/html'
  }];

  if (fs.existsSync(screenshotsDir)) {
    const files = fs.readdirSync(screenshotsDir);
    files.forEach(file => {
      attachments.push({ filename: file, path: path.join(screenshotsDir, file) });
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: '✅ Playwright API Automation Report',
      html: htmlContent,
      attachments
    });
    console.log('✅ Email sent successfully.');
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

sendEmail();
