import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
})

export async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: `"Oveniaa" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Oveniaa Verification Code',
    html: `<div style="max-width:500px;margin:auto;font-family:sans-serif;background:#0D0D0D;color:#F5F5F5;padding:40px;border-radius:16px;text-align:center">
      <h2 style="color:#FF6B35">🍕 Oveniaa</h2>
      <p style="font-size:16px;margin:24px 0">Your verification code:</p>
      <div style="font-size:36px;letter-spacing:8px;color:#FF6B35;font-weight:bold">${otp}</div>
      <p style="font-size:12px;color:#9CA3AF;margin-top:24px">Expires in 5 minutes.</p>
    </div>`,
  })
}

export async function sendPasswordResetOTP(email, otp) {
  await transporter.sendMail({
    from: `"Oveniaa" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Oveniaa Password',
    html: `<div style="max-width:500px;margin:auto;font-family:sans-serif;background:#0D0D0D;color:#F5F5F5;padding:40px;border-radius:16px;text-align:center">
      <h2 style="color:#FF6B35">🍕 Oveniaa</h2>
      <p style="font-size:16px;margin:24px 0">Your password reset code:</p>
      <div style="font-size:36px;letter-spacing:8px;color:#FF6B35;font-weight:bold">${otp}</div>
      <p style="font-size:13px;color:#9CA3AF;margin-top:24px">If you didn't request this, ignore this email.</p>
      <p style="font-size:12px;color:#9CA3AF">Expires in 5 minutes.</p>
    </div>`,
  })
}

export async function sendOrderStatusEmail(email, orderId, customerName, status) {
  const statusMessages = {
    confirmed: { emoji: '✅', title: 'Order Confirmed', desc: 'We\'ve received your order and are getting started!' },
    preparing: { emoji: '👨‍🍳', title: 'Cooking in Progress', desc: 'Our chefs are preparing your food with love.' },
    ready: { emoji: '📦', title: 'Order Ready', desc: 'Your food is packed and ready to go!' },
    delivered: { emoji: '🏠', title: 'Order Delivered', desc: 'Your order has been delivered. Enjoy your meal!' },
  }

  const info = statusMessages[status] || { emoji: '📋', title: 'Status Updated', desc: `Your order is now ${status}.` }

  await transporter.sendMail({
    from: `"Oveniaa" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${info.emoji} Order #${orderId.slice(-6).toUpperCase()} - ${info.title}`,
    html: `
      <div style="max-width:500px;margin:auto;font-family:sans-serif;background:#0D0D0D;color:#F5F5F5;padding:40px;border-radius:16px;text-align:center">
        <h2 style="color:#FF6B35">🍕 Oveniaa</h2>
        <div style="font-size:48px;margin:24px 0">${info.emoji}</div>
        <h3 style="color:#FF6B35;font-size:20px">${info.title}</h3>
        <p style="color:#9CA3AF;font-size:14px;margin:16px 0">${info.desc}</p>
        <p style="color:#9CA3AF;font-size:12px">Hi ${customerName}, ${info.desc}</p>
        ${status === 'delivered' ? '<p style="color:#FF6B35;font-size:14px;margin-top:16px">Thank you for choosing Oveniaa! 🧡</p>' : ''}
      </div>
    `,
  })
}