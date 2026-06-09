import mongoose, { Schema, Document } from 'mongoose';
import { EvaluacionRaw, DiagnosticoRaven } from '@raven/shared-types';

export interface IQuizResult extends Document {
  user_id: mongoose.Types.ObjectId;
  raw_data: EvaluacionRaw;
  diagnostico: DiagnosticoRaven;
  perfil_rockstar: {
    dominante: string;
    secundario: string;
    terciario: string;
    bloqueado: string | null;
  };
  created_at: Date;
}

const QuizResultSchema = new Schema<IQuizResult>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    raw_data: {
      fase_0: { type: Number, required: true },
      fase_1: [{ type: String, enum: ['P1','P2','P3','P4','P5','P6','P7','P8'] }],
      fase_2: {
        P1: Number, P2: Number, P3: Number, P4: Number,
        P5: Number, P6: Number, P7: Number, P8: Number
      },
      fase_3: [{ type: String, enum: ['P1','P2','P3','P4','P5','P6','P7','P8'] }],
      fase_4: [{ type: String, enum: ['P1','P2','P3','P4','P5','P6','P7','P8'] }],
      fase_5: [Number],
      filtros: {
        q33_prohibido: { type: String, enum: ['P1','P2','P3','P4','P5','P6','P7','P8'] },
        q34_llave: { type: String, enum: ['P1','P2','P3','P4','P5','P6','P7','P8'] }
      }
    },
    diagnostico: {
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
    perfil_rockstar: {
      dominante: String,
      secundario: String,
      terciario: String,
      bloqueado: String
    }
  },
  { timestamps: { createdAt: 'created_at' } }
);

// Índices para el pipeline de agregación
QuizResultSchema.index({ user_id: 1 });
QuizResultSchema.index({ 'diagnostico.recurso_dominante': 1, 'diagnostico.alerta_burnout': 1 });
QuizResultSchema.index({ 'raw_data.fase_0': -1, 'raw_data.filtros.q33_prohibido': 1 });

export const QuizResultModel = mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);
