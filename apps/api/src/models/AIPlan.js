const mongoose = require('mongoose');

const SprintSchema = new mongoose.Schema({
  semana:      { type: Number, required: true },
  tipo:        { type: String, enum: ['economico', 'espiritual', 'mental', 'celebracion'], required: true },
  titulo:      { type: String, required: true },
  descripcion: { type: String, required: true },
  metricas:    [{ type: String }],
  completado:  { type: Boolean, default: false }
});

const AIPlanSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, index: true },
    diagnostico: {
      recurso_dominante:      String,
      recurso_secundario:     String,
      recurso_bloqueado:      String,
      alerta_burnout:         Boolean,
      impacto_desgaste:       Number,
      indice_elasticidad_pct: Number,
      metricas: [{ id: String, uso_total: Number, uso_fase3: Number, sombra_total: Number, costo_energia: Number }],
      multiplicador_tiempo:   Number
    },
    sprints: [SprintSchema]
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const AIPlanModel = mongoose.model('AIPlan', AIPlanSchema);

// Conversación IA
const MensajeSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content:   { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ConversacionSchema = new mongoose.Schema(
  {
    user_id:    { type: String, required: true, index: true },
    setlist_id: { type: String, required: true },
    mensajes:   [MensajeSchema]
  },
  { timestamps: { createdAt: 'created_at' } }
);

const ConversacionModel = mongoose.model('Conversacion', ConversacionSchema);

module.exports = { AIPlanModel, ConversacionModel };
