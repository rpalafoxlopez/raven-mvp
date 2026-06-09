const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    raw_data: {
      fase_0: { type: Number, required: true },
      fase_1: [{ type: String }],
      fase_2: { P1: Number, P2: Number, P3: Number, P4: Number, P5: Number, P6: Number, P7: Number, P8: Number },
      fase_3: [{ type: String }],
      fase_4: [{ type: String }],
      fase_5: [Number],
      filtros: {
        q33_prohibido: String,
        q34_llave:     String
      }
    },
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
    perfil_rockstar: {
      dominante:  String,
      secundario: String,
      terciario:  String,
      bloqueado:  String
    }
  },
  { timestamps: { createdAt: 'created_at' } }
);

QuizResultSchema.index({ user_id: 1 });
QuizResultSchema.index({ 'diagnostico.recurso_dominante': 1, 'diagnostico.alerta_burnout': 1 });

const QuizResultModel = mongoose.model('QuizResult', QuizResultSchema);
module.exports = { QuizResultModel };
