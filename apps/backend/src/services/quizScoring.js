const QUESTIONS = require('../data/questions');
const ARQUETIPOS = require('../data/arquetipos');

const PILAR_IDS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];

function buildQuestionMap() {
  const map = {};
  QUESTIONS.forEach(q => { map[q.id] = q; });
  return map;
}

// answers: [{ questionId, valor }]  donde valor es indice 0-3 (eleccion) o numero 1-5/1-4 (escala)
function calcularDiagnostico(answers) {
  const qMap = buildQuestionMap();

  // Acumuladores por pilar
  const usoFuncional = {};   // suma de activaciones en fase activacion + flexibilidad
  const sombraRaw = {};      // suma de selecciones en fase sombra
  const costoEnergia = {};   // valor de escala 1-4 en fase costo (entre mas alto, mas agota)
  const espejoP3 = { narrativa: null, reactiva: null };
  const espejoP8 = null;
  let cronologiaScore = 3; // default: 1-3 meses
  let prohibido = null;    // pregunta 33
  let llave = null;        // pregunta 34

  PILAR_IDS.forEach(p => { usoFuncional[p] = 0; sombraRaw[p] = 0; costoEnergia[p] = null; });

  let espejoIndependiente = null;  // q29
  let espejoApoyo = null;          // q30
  let espejoAccion = null;         // q31
  let espejoAnalisis = null;       // q32

  answers.forEach(ans => {
    const q = qMap[ans.questionId];
    if (!q) return;

    if (q.fase === 'cronologia') {
      cronologiaScore = ans.valor;
      return;
    }

    if (q.fase === 'activacion' || q.fase === 'flexibilidad') {
      const opcion = q.opciones[ans.valor];
      if (opcion && opcion.pilar) usoFuncional[opcion.pilar] += 1;
      return;
    }

    if (q.fase === 'costo') {
      // valor 1-4: 1=energiza, 4=agota. Guardamos directo, pilar viene de la pregunta.
      costoEnergia[q.arquetipoId] = ans.valor;
      return;
    }

    if (q.fase === 'sombra') {
      const opcion = q.opciones[ans.valor];
      if (opcion && opcion.pilar) sombraRaw[opcion.pilar] += 1;
      return;
    }

    if (q.fase === 'espejo') {
      if (q.id === 29) espejoIndependiente = ans.valor;
      if (q.id === 30) espejoApoyo = ans.valor;
      if (q.id === 31) espejoAccion = ans.valor;
      if (q.id === 32) espejoAnalisis = ans.valor;
      return;
    }

    if (q.fase === 'validacion') {
      const opcion = q.opciones[ans.valor];
      if (!opcion) return;
      if (q.id === 33) prohibido = opcion.pilar;
      if (q.id === 34) llave = opcion.pilar;
      return;
    }
  });

  // ── Normalizar scores funcional/sombra a porcentaje 0-100 ──
  // Funcional: max teorico = 4 preguntas en activacion (8 totales / pilar aparece variable veces)
  //            + posibles apariciones en flexibilidad. Usamos un techo practico de 6.
  const FUNCIONAL_MAX = 6;
  const SOMBRA_MAX = 4; // 4 preguntas de fase sombra, cada pilar puede aparecer hasta 4 veces

  const resultados = PILAR_IDS.map(pid => {
    const arq = ARQUETIPOS[pid];
    const funcionalPct = Math.min(100, Math.round((usoFuncional[pid] / FUNCIONAL_MAX) * 100));
    const sombraPct = Math.min(100, Math.round((sombraRaw[pid] / SOMBRA_MAX) * 100));
    const costo = costoEnergia[pid]; // 1-4 o null si no se preguntó directamente (todos los 8 se preguntan)

    let estado = 'equilibrado';
    if (funcionalPct < 15 && sombraPct < 15) estado = 'dormido';
    else if (sombraPct > 55 && sombraPct > funcionalPct) estado = 'en-sombra';
    else if (funcionalPct >= 55) estado = 'dominante';
    else if (funcionalPct > 0 || sombraPct > 0) estado = 'equilibrado';

    return {
      arquetipoId: pid,
      codigo: pid,
      nombre: arq.nombre,
      icono: arq.icono,
      mecanismo: arq.mecanismo,
      usoFuncional: arq.usoFuncional,
      sombra: arq.sombra,
      sombraLabel: arq.sombraLabel,
      color: arq.color,
      colorSombra: arq.colorSombra,
      rockstarPrincipal: arq.rockstarPrincipal,
      rockstarSecundario: arq.rockstarSecundario,
      scores: { funcional: funcionalPct, sombra: sombraPct },
      costoEnergia: costo,
      estado
    };
  });

  // ── Ranking dominante / secundario / terciario por score funcional ──
  const ranking = [...resultados].sort((a, b) => b.scores.funcional - a.scores.funcional);
  const dominante = ranking[0];
  const secundario = ranking[1];
  const terciario = ranking[2];

  // ── Arquetipo en sombra: el de mayor score de sombra, si supera el umbral ──
  const rankingSombra = [...resultados].sort((a, b) => b.scores.sombra - a.scores.sombra);
  const enSombraCandidato = rankingSombra[0];
  const enSombra = (enSombraCandidato && enSombraCandidato.scores.sombra >= 40) ? enSombraCandidato : null;

  // ── Dormidos: estado === 'dormido' ──
  const dormidos = resultados.filter(r => r.estado === 'dormido');

  // ── Alertas ──
  const burnoutDominante = dominante && dominante.costoEnergia >= 3 && dominante.scores.sombra >= 35;
  const alertas = {
    burnout: !!burnoutDominante,
    fuga: resultados.find(r => r.arquetipoId === 'P2' && r.scores.sombra >= 50) ? true : false,
    paralisis: resultados.find(r => r.arquetipoId === 'P4' && r.scores.sombra >= 50) ? true : false,
    codependencia: resultados.find(r => r.arquetipoId === 'P3' && r.scores.sombra >= 50) ? true : false,
    melancolia: resultados.find(r => r.arquetipoId === 'P5' && r.scores.sombra >= 50) ? true : false,
    cinismo: resultados.find(r => r.arquetipoId === 'P6' && r.scores.sombra >= 50) ? true : false,
    caos: resultados.find(r => r.arquetipoId === 'P8' && r.scores.sombra >= 50) ? true : false
  };

  // ── Codigo de perfil (ej "P1-P3-P5") ──
  const codigo = [dominante, secundario, terciario].filter(Boolean).map(r => r.codigo).join('-');

  // ── Indice de congruencia (fase espejo) opcional, no usado por ResultsView aun pero lo guardamos ──
  const congruencia = {
    independenciaPercibida: espejoIndependiente,
    necesidadApoyoReal: espejoApoyo,
    accionVsAnalisis: { accion: espejoAccion, analisis: espejoAnalisis }
  };

  return {
    perfil: {
      codigo,
      dominante: dominante || null,
      secundario: secundario || null,
      terciario: terciario || null,
      enSombra,
      dormidos
    },
    resultados,
    alertas,
    cronologiaScore,
    congruencia,
    filtros: { prohibido, llave }
  };
}

module.exports = { calcularDiagnostico, ARQUETIPOS, QUESTIONS };
