import { PILARES_INFO, type DiagnosticoRaven, type PilarId } from '@raven/shared-types'

export const useQuizScoring = () => {
  const getPilarInfo = (id: PilarId) => PILARES_INFO[id]

  const getPerfilVisual = (diagnostico: DiagnosticoRaven) => {
    const dominante = getPilarInfo(diagnostico.recurso_dominante)
    const secundario = getPilarInfo(diagnostico.recurso_secundario)
    const terciario = diagnostico.metricas[2] ? getPilarInfo(diagnostico.metricas[2].id) : null
    const bloqueado = diagnostico.recurso_bloqueado ? getPilarInfo(diagnostico.recurso_bloqueado) : null

    return {
      dominante: {
        ...dominante,
        rockstarPrincipal: dominante.rockstars[0],
        uso: diagnostico.metricas.find(m => m.id === dominante.id)?.uso_total || 0,
        costo: diagnostico.metricas.find(m => m.id === dominante.id)?.costo_energia || 1
      },
      secundario: {
        ...secundario,
        rockstarPrincipal: secundario.rockstars[0]
      },
      terciario: terciario ? {
        ...terciario,
        rockstarPrincipal: terciario.rockstars[0]
      } : null,
      bloqueado: bloqueado ? {
        ...bloqueado,
        rockstarPrincipal: bloqueado.rockstars[0]
      } : null,
      alertas: {
        burnout: diagnostico.alerta_burnout,
        impacto: diagnostico.impacto_desgaste,
        elasticidad: diagnostico.indice_elasticidad_pct
      }
    }
  }

  const getRadarData = (diagnostico: DiagnosticoRaven) => {
    return diagnostico.metricas.map(m => ({
      pilar: PILARES_INFO[m.id].nombre,
      uso: m.uso_total,
      sombra: m.sombra_total,
      costo: m.costo_energia
    }))
  }

  return { getPilarInfo, getPerfilVisual, getRadarData }
}
