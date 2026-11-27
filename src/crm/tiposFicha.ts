// ==============================================================================
// TIPOS Y DATOS INICIALES PARA EL FORMULARIO INTEGRAL DE ALUMNAS TOTALHIIT
// Basado en el Formulario oficial de Google Forms y Hoja de Cálculo (49 Columnas)
// Padrón Oficial Certificado: 23 Fichas de Alumnas con los 49 Campos Completos
// ==============================================================================

export interface FichaRegistro {
  id: string;
  finalizado: boolean;
  validated?: boolean;
  linked_student_code?: string;

  // Col 1: Marca temporal
  fecha_registro: string;
  marca_temporal?: string;

  // Col 2: Correo electrónico
  email: string;

  // Col 3: Nombre
  nombre: string;

  // Col 4: Apellido
  apellido: string;

  // Nombre Completo para búsquedas y encabezados
  nombre_completo: string;

  // Col 5: Sexo
  sexo: 'Femenino' | 'Masculino';

  // Col 6: Apodo! ¿Quieres que te llamemos de alguna forma en particular?
  apodo?: string;

  // Col 7: Fecha de nacimiento
  fecha_nacimiento: string;

  // Col 8: Edad
  edad: number;

  // Col 9: Donde vives, localidad, Pais
  localidad_pais: string;

  // Col 10: Altura (Expresada en M). Por ejemplo, 1.75M
  altura: string;

  // Col 11: Peso (Expresado en Kg, Incluyendo primer decimal). Por ejemplo: 65,5Kg.
  peso: string;

  // Col 12: Usualmente, mi talla de Remera (Camiseta o franelilla deportiva) es...
  talla_remera: 'S' | 'M' | 'L' | 'XL';

  // Col 13: Alergias (Especifica TODAS, inclusive las que consideres mínimas y absurdas)
  alergias: string;

  // Col 14: Embarazos?
  embarazos: 'si' | 'no';

  // Col 15: Tienes hijos?
  hijos: 'Si' | 'No' | 'No pienso tener';

  // Col 16: ¿Tuviste Coronavirus?
  tuvo_covid: 'Si' | 'no';

  // Col 17: Si tu respuesta a la pregunta anterior es "SI", ¿Quedaste con problemas respiratorios o cansancio extremo? Explique
  secuelas_covid?: string;

  // Col 18: ¿Tienes algún problema, patología, lesión, etc. que se relacione con lo muscular, articular u oseo?
  problemas_musculares_oseos: 'Si' | 'no';

  // Col 19: ¿Desde cuando?  ¿Que tienes?
  lesiones_desde_cuando?: string;
  detalle_lesiones?: string;

  // Col 20: ¿Estás realizando algún tratamiento que mejore tu condición?
  tratamiento_actual?: string;

  // Col 21: ¿Tomas algún medicamento en el día a día?
  toma_medicamentos: 'Si' | 'No';

  // Col 22: ¿Cual? ¿Como? (Cada cuantas horas, qué cantidad de dosis, etc. Especifica)
  medicamentos_detalle?: string;
  detalle_medicamentos?: string;

  // Col 23: ¿Tienes alguna discapacidad ya sea motriz, auditiva, visual, o verbal? ¿Cual?
  discapacidad?: string;

  // Col 24: Observaciones de utilidad. (Si crees que debería saber algo mas, escribelo aqui)
  observaciones_medicas?: string;

  // Col 25: ¿Consumes bebidas alcohólicas?
  consume_alcohol: 'Si' | 'No' | 'Algunas veces y poca cantidad';

  // Col 26: ¿Fumas?
  fuma: 'Si' | 'No';

  // Col 27: Si fumas, ¿Con qué frecuencia lo haces? (que cantidad y cada cuanto tiempo)
  frecuencia_fuma?: string;

  // Col 28: ¿Consumes algún tipo de suplemento deportivo o nutricional, reguladores de hormonas, anticonceptivos, etc? ¿Cual o Cuales?
  suplementos_anticonceptivos?: string;

  // Col 29: ¿Cómo llegaste a conocer a TOTALHIIT?
  como_conocio_totalhiit?: string;

  // Col 30: Déjanos tu Teléfono y/o Celular
  telefono_whatsapp: string;

  // Col 31: TOTALHIIT tiene un grupo de whatsapp donde enviamos el enlace a la clase ONLINE... ¿Quieres que te sumemos?!!
  sumar_grupo_whatsapp: 'Sí' | 'No';

  // Col 32: Dejanos tu Instagram (Nombre de usuario)
  instagram?: string;

  // Col 33: Durante la clase ¿Tenemos tu consentimiento para tomar fotografías, capturas de pantalla y/o grabar las clases?
  consentimiento_fotos: 'si' | 'No';

  // Col 34: ¿Nos sigues en nuestras redes? [Instagram @TOTALHIIT1]
  redes_instagram: string;

  // Col 35: ¿Nos sigues en nuestras redes? [YouTube TOTALHIIT ENTRENAMIENTO FUNCIONAL]
  redes_youtube: string;

  // Col 36: ¿Nos sigues en nuestras redes? [Voy corriendo a Seguirlos]
  redes_voy_seguirlos: string;

  // Col 37: CONTACTO DE EMERGENCIA (Nombre, Números de teléfono, Parentesco)
  contacto_emergencia: string;

  // Col 38: Tu Objetivo principal es:
  objetivo_principal: 'Corporal: Bajar grasa y aumentar masa muscular' | 'Mejorar tu salud de manera integral';

  // Col 39: ¿Por qué decidiste acceder a los servicio de entrenamiento de TOTALHIIT?
  motivo_totalhiit?: string;

  // Col 40: ¿Que esperas recibir de nuestra parte?
  expectativas?: string;

  // Col 41: ¿Realizas actividad física actualmente?
  actividad_fisica_actual: 'Si' | 'No';

  // Col 42: ¿Cuál o Cuáles?
  detalle_actividad_actual?: string;

  // Col 43: Dime 3 Deportes, actividades físicas o disciplinas deportivas que más te gusten
  deportes_favoritos?: string;

  // Col 44: ¿Realizaste alguna actividad antes? ¿Cuál o Cuáles?
  actividades_previas?: string;

  // Col 45: ¿Cuantas horas (Aproximadamente) duermes diariamente?
  horas_sueno: string;

  // Col 46: ¿Cómo consideras que te sientes emocionalmente?. Si lo deseas, explaya los motivos.
  estado_emocional?: string;

  // Col 47: ¿Asiste a terapia, ya sea tradicional u alternativa?
  asiste_terapia?: string;

  // Col 48: ¿Cuál o Cuáles? (Detalle de terapia)
  detalle_terapia?: string;

  // Col 49: ¿ESTÁS DISPUESTO O DISPUESTA A RECIBIR NUESTRA AYUDA PARA MEJORAR TU SALUD DE MANERA INTEGRAL Y DIVERTIDA?
  compromiso_ayuda: 'Si' | 'No' | 'Porsupuesto';
}

// Encabezados exactos de las 49 columnas del Google Sheet oficial
export const COLUMNAS_49_GOOGLE_SHEETS = [
  'Marca temporal',
  'Correo electrónico',
  'Nombre',
  'Apellido',
  'Sexo',
  'Apodo! ¿Quieres que te llamemos de alguna forma en particular? Por ejemplo, mi nombre es Valentina, pero prefiero que me digan Valen!!',
  'Fecha de nacimiento',
  'Edad',
  'Donde vives, localidad, Pais ',
  'Altura (Expresada en M). Por ejemplo, 1.75M',
  'Peso (Expresado en Kg, Incluyendo primer decimal). Por ejemplo: 65,5Kg. ',
  'Usualmente, mi talla de Remera (Camiseta o franelilla deportiva) es...',
  'Alergias (Especifica TODAS, inclusive las que consideres mínimas y absurdas)',
  'Embarazos?',
  'Tienes hijos?',
  '¿Tuviste Coronavirus?',
  'Si tu respuesta a la pregunta anterior es "SI", ¿Quedaste con problemas respiratorios o cansancio extremo? Explique',
  '¿Tienes algún problema, patología, lesión, etc. que se relacione con lo muscular, articular u oseo? ',
  '¿Desde cuando?  ¿Que tienes?',
  '¿Estás realizando algún tratamiento que mejore tu condición?',
  '¿Tomas algún medicamento en el día a día? (Estas respuestas pueden tener o no relación con las preguntas anteriores)',
  '¿Cual? ¿Como? (Cada cuantas horas, qué cantidad de dosis, etc. Especifica)',
  '¿Tienes alguna discapacidad ya sea motriz, auditiva, visual, o verbal? ¿Cual?',
  'Observaciones de utilidad. (Si crees que debería saber algo mas, escribelo aqui)',
  '¿Consumes bebidas alcohólicas?',
  '¿Fumas?',
  'Si fumas, ¿Con qué frecuencia lo haces? (que cantidad y cada cuanto tiempo)',
  '¿Consumes algún tipo de suplemento deportivo o nutricional, reguladores de hormonas, anticonceptivos, etc? ¿Cual o Cuales?',
  '¿Cómo llegaste a conocer a TOTALHIIT?',
  ' Déjanos tu Teléfono y/o Celular',
  'TOTALHIIT tiene un grupo de whatsapp donde enviamos el enlace a la clase ONLINE, ademas todos nuestras alumnos/as reciben información, noticias, motivación, y novedades. ¿Quieres que te sumemos?!!',
  'Dejanos tu Instagram (Nombre de usuario)',
  'Durante la clase ¿Tenemos tu consentimiento para tomar fotografías, capturas de pantalla y/o grabar las clases? (Esto nos ayuda a enriquecer el aprendizaje y la corrección de tu técnica y movimientos.)',
  '¿Nos sigues en nuestras redes? [Instagram @TOTALHIIT1]',
  '¿Nos sigues en nuestras redes? [YouTube TOTALHIIT ENTRENAMIENTO FUNCIONAL]',
  '¿Nos sigues en nuestras redes? [Voy corriendo a Seguirlos]',
  'CONTACTO DE EMERGENCIA (Nombre, Números de teléfono, Parentesco)',
  'Tu Objetivo principal es:',
  '¿Por qué decidiste acceder a los servicio de entrenamiento de TOTALHIIT?',
  '¿Que esperas recibir de nuestra parte? ',
  '¿Realizas actividad física actualmente?',
  '¿Cuál o Cuáles?',
  'Dime 3 Deportes, actividades físicas o disciplinas deportivas que más te gusten',
  '¿Realizaste alguna actividad antes? ¿Cuál o Cuáles?',
  '¿Cuantas horas (Aproximadamente) duermes diariamente? (Sumándole las horas de siesta en caso de que haya)',
  '¿Cómo consideras que te sientes emocionalmente?. Si lo deseas, explaya los motivos.\n\n\n',
  '¿Asiste a terapia, ya sea tradicional (Psicología, Coaching, etc.) u alternativa (Reiki, yoga, acupuntura, etc.?',
  '¿Cuál o Cuáles?',
  '¿ESTÁS DISPUESTO O DISPUESTA A RECIBIR NUESTRA AYUDA PARA MEJORAR TU SALUD DE MANERA INTEGRAL Y DIVERTIDA?'
];

export function fichaAFila49(f: FichaRegistro): (string | number)[] {
  return [
    f.fecha_registro || '2026-06-01 10:00:00',
    f.email || '',
    f.nombre || '',
    f.apellido || '',
    f.sexo || 'Femenino',
    f.apodo || '',
    f.fecha_nacimiento || '',
    f.edad || '',
    f.localidad_pais || '',
    f.altura || '',
    f.peso || '',
    f.talla_remera || 'M',
    f.alergias || 'Ninguna',
    f.embarazos || 'no',
    f.hijos || 'No',
    f.tuvo_covid || 'no',
    f.secuelas_covid || 'Ninguna',
    f.problemas_musculares_oseos || 'no',
    f.lesiones_desde_cuando || 'Ninguna',
    f.tratamiento_actual || 'Ninguno',
    f.toma_medicamentos || 'No',
    f.medicamentos_detalle || 'Ninguno',
    f.discapacidad || 'Ninguna',
    f.observaciones_medicas || 'Ninguna',
    f.consume_alcohol || 'No',
    f.fuma || 'No',
    f.frecuencia_fuma || 'No fuma',
    f.suplementos_anticonceptivos || 'Ninguno',
    f.como_conocio_totalhiit || 'Instagram / Recomendación',
    f.telefono_whatsapp || '',
    f.sumar_grupo_whatsapp || 'Sí',
    f.instagram || '',
    f.consentimiento_fotos || 'si',
    f.redes_instagram || 'Instagram @TOTALHIIT1',
    f.redes_youtube || 'YouTube TOTALHIIT ENTRENAMIENTO FUNCIONAL',
    f.redes_voy_seguirlos || 'Voy corriendo a Seguirlos',
    f.contacto_emergencia || '',
    f.objetivo_principal || 'Mejorar tu salud de manera integral',
    f.motivo_totalhiit || '',
    f.expectativas || '',
    f.actividad_fisica_actual || 'Si',
    f.detalle_actividad_actual || '',
    f.deportes_favoritos || '',
    f.actividades_previas || '',
    f.horas_sueno || '7 a 8 horas',
    f.estado_emocional || 'Excelente y motivada',
    f.asiste_terapia || 'No',
    f.detalle_terapia || 'Ninguna',
    f.compromiso_ayuda || 'Porsupuesto'
  ];
}

// Production data lives exclusively in Cloudflare KV — never seed mock records in frontend bundles.
export const FICHAS_INICIALES: FichaRegistro[] = [];
