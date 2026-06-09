import { resend, RESEND_FROM } from '../config/resend';
import { DiagnosticoRaven } from '@raven/shared-types';

export const sendEmailCapture = async (
  email: string,
  diagnostico: DiagnosticoRaven,
  offerCode: string
): Promise<boolean> => {
  if (!resend) {
    console.warn('Resend no configurado. Email no enviado.');
    return false;
  }

  const { PILARES_INFO } = require('@raven/shared-types');
  const dominante = PILARES_INFO[diagnostico.recurso_dominante];
  const secundario = PILARES_INFO[diagnostico.recurso_secundario];

  try {
    await resend.emails.send({
      from: RESEND_FROM,
      to: email,
      subject: `Tu perfil Raven: ${dominante.nombre} + ${secundario.nombre}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', sans-serif; background: #050505; color: #F0F5F9; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px; }
            .header { border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { font-family: 'Playfair Display', serif; color: #D4AF37; font-size: 32px; }
            .profile { background: #0A192F; padding: 30px; border-left: 4px solid ${dominante.color}; margin: 20px 0; }
            .dominant { font-size: 24px; color: ${dominante.color}; font-weight: bold; }
            .cta { background: #D4AF37; color: #050505; padding: 15px 30px; text-decoration: none; display: inline-block; margin: 20px 0; font-weight: bold; }
            .offer { border: 1px solid #D4AF37; padding: 20px; margin: 20px 0; text-align: center; }
            .code { font-family: monospace; font-size: 24px; color: #D4AF37; letter-spacing: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>ROCKYOURSELF</h1>
              <p style="color: #708090;">El escenario es tuyo · El micrófono está abierto</p>
            </div>

            <p>Hola rockstar,</p>

            <p>Tu diagnóstico Raven está listo. Aquí está lo que descubrimos en el backstage:</p>

            <div class="profile">
              <div class="dominant">${dominante.nombre}</div>
              <p style="color: #708090; margin-top: 10px;">${dominante.descripcion}</p>
              <p style="color: #C0C0C0; margin-top: 15px;">Secundario: ${secundario.nombre}</p>
            </div>

            <div class="offer">
              <p style="color: #D4AF37; font-weight: bold;">OFERTA ESPECIAL - 48 HORAS</p>
              <p>50% de descuento en tu pase al Escenario Principal</p>
              <div class="code">${offerCode}</div>
            </div>

            <a href="https://rockyourself.org/checkout?code=${offerCode}" class="cta">
              Arma tu Setlist con IA
            </a>

            <p style="color: #708090; font-size: 14px; margin-top: 40px;">
              Quien no tiene la inteligencia para transformarlo todo, solo tiene la inercia para seguir siendo una pieza de recambio.
              <em style="color: #D4AF37;">El escenario es tuyo.</em>
            </p>
          </div>
        </body>
        </html>
      `
    });

    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
};
