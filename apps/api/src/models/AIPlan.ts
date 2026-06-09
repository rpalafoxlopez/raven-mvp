import mongoose, { Schema, Document } from 'mongoose';
import { Setlist, Sprint, ConversacionIA } from '@raven/shared-types';

export interface IAIPlan extends Omit<Setlist, '_id'>, Document {}

const SprintSchema = new Schema<Sprint>({
  semana: { type: Number, required: true },
  tipo: { type: String, enum: ['economico', 'espiritual', 'mental', 'celebracion'], required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  metricas: [{ type: String }],
  completado: { type: Boolean, default: false }
});

const AIPlanSchema = new Schema<IAIPlan>(
 {
    user_id: { type: String, ref: 'User', required: true, index: true },
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
    sprints: [SprintSchema]
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);


export const AIPlanModel = mongoose.model<IAIPlan>('AIPlan', AIPlanSchema);

// Conversación IA
export interface IConversacion extends Omit<ConversacionIA, '_id'>, Document {}

const MensajeSchema = new Schema({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ConversacionSchema = new Schema<IConversacion>(
  {
    user_id: { type: String, ref: 'User', required: true, index: true },  // <-- FIX: String en vez de ObjectId
    setlist_id: { type: String, ref: 'AIPlan', required: true },         // <-- FIX: String en vez de ObjectId
    mensajes: [MensajeSchema]
  },
  { timestamps: { createdAt: 'created_at' } }
);


export const ConversacionModel = mongoose.model<IConversacion>('Conversacion', ConversacionSchema);
