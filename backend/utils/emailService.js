// utils/emailService.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * sendResetEmail
 * @param {string} to    - recipient email
 * @param {string} name  - recipient name
 * @param {string} link  - full reset URL
 */
const sendResetEmail = async (to, name, link) => {
  await resend.emails.send({
    from:    'MINIKART <onboarding@resend.dev>', // use this until you verify a domain
    to,
    subject: 'Reset Your MINIKART Password',
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
        
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 24px; font-weight: 900; letter-spacing: 0.3em; text-transform: uppercase; margin: 0;">MINIKART</h1>
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5em; color: #999; margin: 4px 0 0;">The 2026 Archive</p>
        </div>

        <div style="background: #F5F5F7; border-radius: 20px; padding: 40px; text-align: center;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.4em; color: #999; margin: 0 0 8px;">Password Reset</p>
          <h2 style="font-size: 28px; font-weight: 300; font-style: italic; letter-spacing: -0.03em; margin: 0 0 16px; color: #1D1D1F;">Hello, ${name}.</h2>
          <p style="font-size: 14px; color: #555; line-height: 1.7; margin: 0 0 32px;">
            We received a request to reset your password. Click the button below to create a new one. This link expires in <strong>15 minutes</strong>.
          </p>
          <a href="${link}" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.3em;">
            Reset Password
          </a>
          <p style="font-size: 11px; color: #aaa; margin: 24px 0 0;">
            Or copy this link:<br/>
            <span style="color: #555; word-break: break-all;">${link}</span>
          </p>
        </div>

        <p style="text-align: center; font-size: 10px; text-transform: uppercase; letter-spacing: 0.4em; color: #ccc; margin: 32px 0 0;">
          If you didn't request this, ignore this email. Your password won't change.
        </p>
        <p style="text-align: center; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #ccc; margin: 8px 0 0;">
          © 2026 MINIKART
        </p>
      </div>
    `,
  });
};

module.exports = { sendResetEmail };