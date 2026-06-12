import { Resend } from 'resend';

// Lazy init — no instanciar al cargar el módulo
const getResend = () => new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail({ to, name, archetype }) {
  const archetypeNames = {
    presence: 'Frontman', creativity: 'Guitar Hero', resilience: 'Survivor',
    charisma: 'Conector', discipline: 'Productor', intuition: 'Visionario',
    rebellion: 'Rebelde', vision: 'Dreamer'
  };

  try {
    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'hola@rockyourself.org',
      to,
      subject: `🎸 ${name}, tu arquetipo rockstar te espera`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Bienvenido al backstage, ${name}</h1>
          <p>Tu arquetipo es: <strong style="color: #e11d48;">${archetypeNames[archetype] || archetype}</strong></p>
          <p>El escenario está listo. Es hora de rockear tu vida.</p>
          <a href="${process.env.FRONTEND_URL}/dashboard"
             style="background: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px;">
            Ir al Dashboard
          </a>
        </div>
      `
    });
  } catch (err) {
    console.error('Email error:', err);
    // No lanzar — el email no debe romper el flujo principal
  }
}

export async function sendWeeklyDigest({ to, name, actionItems }) {
  const pending = actionItems.filter(a => !a.completed).length;
  try {
    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'hola@rockyourself.org',
      to,
      subject: `🎸 Tu semana rockstar — ${pending} acciones pendientes`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Hey ${name},</h1>
          <p>Tienes <strong>${pending}</strong> acciones pendientes esta semana.</p>
          <p>No dejes que el riff se pierda. El escenario te espera.</p>
          <a href="${process.env.FRONTEND_URL}/dashboard"
             style="background: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px;">
            Ver Dashboard
          </a>
        </div>
      `
    });
  } catch (err) {
    console.error('Email error:', err);
  }
}
