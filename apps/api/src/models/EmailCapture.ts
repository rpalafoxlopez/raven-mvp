import mongoose, { Schema, Document } from 'mongoose';
import { EmailCapture } from '@raven/shared-types';

export interface IEmailCapture extends Omit<EmailCapture, '_id'>, Document {}

const EmailCaptureSchema = new Schema<IEmailCapture>(
  {
    email: { type: String, required: true, index: true },
    quizResult: {
      recurso_dominante: String,
      recurso_secundario: String,
      recurso_bloqueado: String,
      alerta_burnout: Boolean,
      impacto_desgaste: Number,
      indice_elasticidad_pct: Number,
      metricas: [{
        id: String,
        uso_total: Number,
        uso_fase3: Number,
        sombra_total: Number,
        costo_energia: Number
      }],
      multiplicador_tiempo: Number
    },
    offerCode: { type: String, default: 'RAVEN50' },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: 'created_at' } }
);

export const EmailCaptureModel = mongoose.model<IEmailCapture>('EmailCapture', EmailCaptureSchema);
