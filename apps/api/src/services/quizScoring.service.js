const { PILARES, PILARES_INFO } = require('../shared-types');

const calcularDiagnostico = (raw) => {
  const vectorUso = [...raw.fase_1, ...raw.fase_3];

  const metricas = PILARES.map((pilar) => ({
    id:           pilar,
    uso_total:    vectorUso.filter(p => p === pilar).length,
    uso_fase3:    raw.fase_3.filter(p => p === pilar).length,
    sombra_total: raw.fase_4.filter(p => p === pilar).length,
    costo_energia: raw.fase_2?.[pilar] || 1
  }));

  const ranking = [...metricas].sort((a, b) => b.uso_total - a.uso_total);
  const dominante  = ranking[0];
  const secundario = ranking[1];

  const pilaresUnicosFase3   = new Set(raw.fase_3);
  const indice_elasticidad_pct = (pilaresUnicosFase3.size / 8) * 100;

  const pilaresBloqueados = metricas.filter(p =>
    p.uso_total <= 1 &&
    p.sombra_total >= 2 &&
    (raw.filtros?.q33_prohibido === p.id || raw.filtros?.q34_llave === p.id)
  );
  const recurso_bloqueado = pilaresBloqueados.length > 0 ? pilaresBloqueados[0].id : null;

  const alerta_burnout   = dominante.costo_energia >= 3;
  const impacto_desgaste = dominante.costo_energia * raw.fase_0;

  return {
    recurso_dominante:      dominante.id,
    recurso_secundario:     secundario.id,
    recurso_bloqueado,
    alerta_burnout,
    impacto_desgaste,
    indice_elasticidad_pct,
    metricas,
    multiplicador_tiempo:   raw.fase_0
  };
};

const mapearPerfilRockstar = (diagnostico) => {
  const dominante  = PILARES_INFO[diagnostico.recurso_dominante];
  const secundario = PILARES_INFO[diagnostico.recurso_secundario];
  const terciarioId = diagnostico.metricas[2]?.id;
  const terciario  = terciarioId ? PILARES_INFO[terciarioId] : null;
  const bloqueado  = diagnostico.recurso_bloqueado ? PILARES_INFO[diagnostico.recurso_bloqueado] : null;

  return {
    dominante: {
      pilar:           dominante.id,
      nombre:          dominante.nombre,
      rockstarPrincipal: dominante.rockstars[0],
      rockstar:        dominante.rockstars[0],
      color:           dominante.color,
      descripcion:     dominante.descripcion,
      costo:           diagnostico.metricas.find(m => m.id === dominante.id)?.costo_energia || 1
    },
    secundario: { pilar: secundario.id, nombre: secundario.nombre, rockstar: secundario.rockstars[0], color: secundario.color },
    terciario:  terciario ? { pilar: terciario.id, nombre: terciario.nombre, rockstar: terciario.rockstars[0] } : null,
    bloqueado:  bloqueado ? { pilar: bloqueado.id, nombre: bloqueado.nombre, rockstar: bloqueado.rockstars[0] } : null,
    alertas: {
      burnout:      diagnostico.alerta_burnout,
      impacto:      diagnostico.impacto_desgaste,
      elasticidad:  diagnostico.indice_elasticidad_pct
    }
  };
};

module.exports = { calcularDiagnostico, mapearPerfilRockstar };
