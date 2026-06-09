const { Router } = require('express');
const { EmailCaptureModel } = require('../models/EmailCapture');
const { resend } = require('../config/resend');

const router = Router();

// POST /api/email/capture
router.post('/capture', async (req, res) => {
  try {
    const { email, quizResult } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email requerido' });

    const offerCode = `RAVEN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

    const capture = await EmailCaptureModel.create({ email, quizResult, offerCode, expiresAt, used: false });

    if (resend) {
      await resend.emails.send({
        from: 'Raven <noreply@rockyourself.org>',
        to: email,
        subject: 'Tu diagnóstico Raven está listo',
        html: `<h1>El escenario es tuyo.</h1><p>Tu código de acceso: <strong>${offerCode}</strong></p>`
      });
    }

    return res.json({ success: true, data: { offerCode } });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
