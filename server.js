const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

app.post('/send-otp', (req, res) => {
    const { email, otp, username } = req.body;

    const mailOptions = {
        from: '"USDTX Network" <' + process.env.GMAIL_USER + '>',
        to: email,
        subject: 'Your USDTX Verification OTP',
        html: `
            <div style="background-color: #0b0f19; color: #ffffff; padding: 25px; font-family: Arial, sans-serif; border-radius: 15px; border: 1px solid #1e293b;">
                <h2 style="color: #4ade80; text-align: center;">⚡ USDTX NETWORK ⚡</h2>
                <p>Hello <b>${username || 'User'}</b>,</p>
                <p>Your One-Time Password (OTP) for account verification is:</p>
                <div style="background: #131b2e; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; color: #4ade80; letter-spacing: 5px; border-radius: 10px; margin: 20px 0;">
                    ${otp}
                </div>
                <p style="font-size: 12px; color: #94a3b8;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Email send error:", error);
            return res.status(500).json({ success: false, error: error.toString() });
        }
        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    });
});

const PORT = process.env.PORT || 10000;
app.lint ? null : app.listen(PORT, () => {
    console.log(`Mail server running on port ${PORT}`);
});
