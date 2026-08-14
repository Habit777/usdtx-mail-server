const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/send-otp', async (req, res) => {
    const { email, otp, username } = req.body;

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "USDTX Network", email: "usdtxnetwork@gmail.com" },
                to: [{ email: email, name: username || 'User' }],
                subject: "Your USDTX Verification OTP",
                htmlContent: `
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
            })
        });

        const data = await response.json();
        if (response.ok) {
            res.status(200).json({ success: true, message: 'OTP sent successfully' });
        } else {
            console.error("Brevo API error:", data);
            res.status(500).json({ success: false, error: data.message || 'Failed to send email' });
        }
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ success: false, error: error.toString() });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Mail server running on port ${PORT}`);
});
