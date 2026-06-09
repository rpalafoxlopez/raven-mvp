import { EvaluacionRaw, DiagnosticoRaven, PilarId, PILARES } from '@raven/shared-types';

/**
 * RAVEN ENGINE - Algoritmo de Diagnóstico
 * Basado en el pipeline de agregación de MongoDB, implementado en Node.js
 * para validación previa y testing.
 */

export const calcularDiagnostico = (raw: EvaluacionRaw): DiagnosticoRaven => {
  const pilaresBase: PilarId[] = [...PILARES];

  // 1. Vector de uso: Fase 1 + Fase 3
  const vectorUso: PilarId[] = [...raw.fase_1, ...raw.fase_3];

  // 2. Métricas por pilar
  const metricas = pilaresBase.map((pilar) => {
    const uso_total = vectorUso.filter((p) => p === pilar).length;
    const uso_fase3 = raw.fase_3.filter((p) => p === pilar).length;
    const sombra_total = raw.fase_4.filter((p) => p === pilar).length;
    const costo_energia = raw.fase_2[pilar] || 1;

    return {
      id: pilar,
      uso_total,
      uso_fase3,
      sombra_total,
      costo_energia
    };
  });

  // 3. Ranking por uso_total descendente
  const ranking = [...metricas].sort((a, b) => b.uso_total - a.uso_total);

  const dominante = ranking[0];
  const secundario = ranking[1];
  const terciario = ranking[2];

  // 4. Elasticidad: pilares únicos usados en fase 3
  const pilaresUnicosFase3 = new Set(raw.fase_3);
  const elasticidad_bruta = pilaresUnicosFase3.size;
  const indice_elasticidad_pct = (elasticidad_bruta / 8) * 100;

  // 5. Algoritmo de Bloqueo (La Paradoja de Raven)
  const pilaresBloqueados = metricas.filter((p) => {
    const cond1 = p.uso_total <= 1; // Casi nunca lo usa
    const cond2 = p.sombra_total >= 2; // Lo rechaza conscientemente
    const cond3 =
      raw.filtros.q33_prohibido === p.id || raw.filtros.q34_llave === p.id;
    return cond1 && cond2 && cond3;
  });

  const recurso_bloqueado =
    pilaresBloqueados.length > 0 ? pilaresBloqueados[0].id : null;

  // 6. Burnout y desgaste
  const alerta_burnout = dominante.costo_energia >= 3;
  const impacto_desgaste = dominante.costo_energia * raw.fase_0;

  return {
    recurso_dominante: dominante.id,
    recurso_secundario: secundario.id,
    recurso_bloqueado,
    alerta_burnout,
    impacto_desgaste,
    indice_elasticidad_pct,
    metricas,
    multiplicador_tiempo: raw.fase_0
  };
};

/**
 * Mapea el diagnóstico a un perfil rockstar legible
 */
export const mapearPerfilRockstar = (diagnostico: DiagnosticoRaven) => {
  const { PILARES_INFO } = require('@raven/shared-types');

  const dominante = PILARES_INFO[diagnostico.recurso_dominante];
  const secundario = PILARES_INFO[diagnostico.recurso_secundario];

  // Terciario: el tercero en ranking
  const terciarioId = diagnostico.metricas[2]?.id;
  const terciario = terciarioId ? PILARES_INFO[terciarioId] : null;

  const bloqueado = diagnostico.recurso_bloqueado
    ? PILARES_INFO[diagnostico.recurso_bloqueado]
    : null;

  return {
    dominante: {
      pilar: dominante.id,
      nombre: dominante.nombre,
      rockstar: dominante.rockstars[0],
      color: dominante.color,
      descripcion: dominante.descripcion
    },
    secundario: {
      pilar: secundario.id,
      nombre: secundario.nombre,
      rockstar: secundario.rockstars[0],
      color: secundario.color
    },
    terciario: terciario
      ? {
          pilar: terciario.id,
          nombre: terciario.nombre,
          rockstar: terciario.rockstars[0]
        }
      : null,
    bloqueado: bloqueado
      ? {
          pilar: bloqueado.id,
          nombre: bloqueado.nombre,
          rockstar: bloqueado.rockstars[0]
        }
      : null,
    alertas: {
      burnout: diagnostico.alerta_burnout,
      impacto: diagnostico.impacto_desgaste,
      elasticidad: diagnostico.indice_elasticidad_pct
    }
  };
};
