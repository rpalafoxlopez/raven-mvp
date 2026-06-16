// Mismos 8 arquetipos que el frontend (apps/frontend/src/stores/quiz.js -> ARQUETIPOS)
// Mantener sincronizado si se edita uno de los dos lados.

const ARQUETIPOS = {
  P1: {
    id: 'P1', codigo: 'P1', nombre: 'El Arquitecto Sonico', icono: 'building',
    mecanismo: 'Planificacion, ordenamiento micro y macro, diseno de sistemas, optimizacion de datos y predictibilidad.',
    usoFuncional: 'Capacidad para desglosar el caos en pasos logicos, trazar hojas de ruta y construir infraestructura duradera.',
    sombra: 'Paralisis por exceso de metricas. Intentas resolver el agotamiento haciendo mas listas, incapaz de tolerar la incertidumbre o improvisar.',
    sombraLabel: 'Rigidez / Burnout',
    color: '#2ecc71', colorSombra: '#e74c3c',
    rockstarPrincipal: 'Bruce Springsteen', rockstarSecundario: 'James Hetfield'
  },
  P2: {
    id: 'P2', codigo: 'P2', nombre: 'El Alienigena Camaleon', icono: 'sparkles',
    mecanismo: 'Flexibilidad radical, cambio de codigo, adaptabilidad, reinvencion y corte de lazos.',
    usoFuncional: 'Agilidad para abandonar barcos que se hunden, despojarse de identidades obsoletas y sobrevivir en entornos completamente nuevos.',
    sombra: 'Evasion cronica. Huyes y destruyes proyectos al primer sintoma de aburrimiento o friccion, confundiendo el escape con la evolucion.',
    sombraLabel: 'Fuga / Evasion',
    color: '#9b59b6', colorSombra: '#c0392b',
    rockstarPrincipal: 'David Bowie', rockstarSecundario: 'Lady Gaga'
  },
  P3: {
    id: 'P3', codigo: 'P3', nombre: 'El Chaman de la Tribu', icono: 'flame',
    mecanismo: 'Cohesion, reciprocidad, soporte colectivo, empatia operativa y lealtad de red.',
    usoFuncional: 'Capacidad para unificar a las personas, resolver conflictos internos, pedir ayuda y operar en bloque como una tribu.',
    sombra: 'Perdida de autonomia. Te cargas los problemas de todos, te niegas a avanzar si alguien se queda atras, o te paralizas sin validacion externa.',
    sombraLabel: 'Codependencia / Burnout',
    color: '#e67e22', colorSombra: '#c0392b',
    rockstarPrincipal: 'Bono', rockstarSecundario: 'Freddie Mercury'
  },
  P4: {
    id: 'P4', codigo: 'P4', nombre: 'El Nobel Errante', icono: 'moon',
    mecanismo: 'Pausa, introspeccion, abstraccion conceptual, aislamiento estrategico y distancia analitica.',
    usoFuncional: 'Detener el ruido del entorno para observar el panorama completo, recuperar la nitidez mental y no reaccionar impulsivamente.',
    sombra: 'Desconexion absoluta. Te refugias en tu mente, teorizando sin actuar, usando el "analisis" como excusa para no enfrentarte a la realidad material.',
    sombraLabel: 'Paralisis / Aislamiento',
    color: '#34495e', colorSombra: '#2c3e50',
    rockstarPrincipal: 'Bob Dylan', rockstarSecundario: 'Thom Yorke'
  },
  P5: {
    id: 'P5', codigo: 'P5', nombre: 'El Forajido del Duelo', icono: 'urn',
    mecanismo: 'Procesamiento del dolor, catarsis, aceptacion de la perdida y habitar la crisis sin filtros.',
    usoFuncional: 'Valentia para mirar la herida de frente, asimilar lo que se rompio y transmutar el sufrimiento en significado, arte o madurez.',
    sombra: 'Adiccion a la tragedia. Te enamoras de tus propias cicatrices, densificas tus problemas y usas tu sufrimiento como identidad para no avanzar.',
    sombraLabel: 'Melancolia / Burnout',
    color: '#8e44ad', colorSombra: '#2c3e50',
    rockstarPrincipal: 'Kurt Cobain', rockstarSecundario: 'Ian Curtis'
  },
  P6: {
    id: 'P6', codigo: 'P6', nombre: 'El Iconoclasta Satirico', icono: 'drama',
    mecanismo: 'Desmitificacion, ironia defensiva, relativizacion del drama y cinismo tactico.',
    usoFuncional: 'Capacidad para reirse del desastre, quitarle autoridad a sistemas opresivos y usar el sarcasmo para no ser aplastado por la solemnidad del problema.',
    sombra: 'Superficialidad defensiva. Nada se toma en serio. Usas el chiste para anestesiar el dolor real y evitar cualquier confrontacion profunda.',
    sombraLabel: 'Evasion / Cinismo',
    color: '#f1c40f', colorSombra: '#7f8c8d',
    rockstarPrincipal: 'Frank Zappa', rockstarSecundario: 'Liam Gallagher'
  },
  P7: {
    id: 'P7', codigo: 'P7', nombre: 'La Resistencia Obrera', icono: 'hammer',
    mecanismo: 'Persistencia a largo plazo, contencion del dano, soporte de la carga, disciplina dura y estoicismo.',
    usoFuncional: 'Fortaleza moral para morder el polvo, aguantar el castigo cuando las cosas se ponen dificiles y no quebrarse ante el esfuerzo.',
    sombra: 'El sindrome del martir. Aguantas peso innecesario, glorificas el exceso de trabajo y te niegas a buscar vias mas inteligentes por puro orgullo obrero.',
    sombraLabel: 'Terquedad / Burnout',
    color: '#C0C0C0', colorSombra: '#7f8c8d',
    rockstarPrincipal: 'Johnny Cash', rockstarSecundario: 'Bruce Dickinson'
  },
  P8: {
    id: 'P8', codigo: 'P8', nombre: 'El Canalla Dionisiaco', icono: 'wine',
    mecanismo: 'Impulso corporal, juego, instinto animal, velocidad, riesgo calculado y accion visceral.',
    usoFuncional: 'Tomar decisiones rapidas con las tripas, romper la inercia mental mediante la aceleracion fisica y disfrutar de la intensidad del momento.',
    sombra: 'Impulsividad destructiva. Riesgos ciegos, hedonismo que sabotea los planes a largo plazo y quema de recursos por pura incapacidad de tolerar el aburrimiento.',
    sombraLabel: 'Caos / Exceso',
    color: '#e74c3c', colorSombra: '#c0392b',
    rockstarPrincipal: 'Jimi Hendrix', rockstarSecundario: 'Keith Richards'
  }
};

export default ARQUETIPOS;
