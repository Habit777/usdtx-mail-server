const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'usdtxnetwork@gmail.com',
        pass: process.env.GMAIL_PASS
    }
});

app.post('/send-otp', async (req, res) => {
    const { email, otp, username } = req.body;

    const mailOptions = {
        from: '"USDTX Network" <usdtxnetwork@gmail.com>',
        to: email,
        subject: 'OTP for your USDTX authentication',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 20px; border-radius: 10px;">
                <h2 style="color: #4ade80;">USDTX Network Verification</h2>
                <p>Hello <b>${username || 'User'}</b>,</p>
                <p>Your One-Time Password (OTP) for account verification is:</p>
                <h1 style="color: #4ade80; background: #131b2e; padding: 10px; display: inline-block; border-radius: 5px; letter-spacing: 5px;">${otp}</h1>
                <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
                <p style="color: #9ca3af; font-size: 12px;">© 2026 USDTX Network. All rights reserved.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'OTP sent successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Mail server running on port ${PORT}`);
});
