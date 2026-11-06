// ==============================================================================
// TIPOS Y DATOS INICIALES PARA EL FORMULARIO INTEGRAL DE ALUMNAS TOTALHIIT
// Basado en el Formulario oficial de Google Forms de TOTALHIIT
// ==============================================================================

export interface FichaRegistro {
  id: string;
  fecha_registro: string;
  finalizado: boolean;

  // 1. Datos Personales
  email: string;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  sexo: 'Femenino' | 'Masculino';
  apodo?: string;
  fecha_nacimiento: string;
  edad: number;
  localidad_pais: string;
  telefono_whatsapp: string;
  instagram?: string;
  contacto_emergencia: string; // Nombre, Teléfono, Parentesco
  consentimiento_fotos: 'Sí' | 'No';
  sumar_grupo_whatsapp: 'Sí' | 'No';

  // 2. Contextura Corporal
  altura: string; // ej: "1.65M"
  peso: string;   // ej: "62.5Kg"
  talla_remera: 'S' | 'M' | 'L' | 'XL';

  // 3. Datos Médicos & Antecedentes
  alergias: string;
  embarazos: 'Sí' | 'No';
  hijos: 'Sí' | 'No' | 'No pienso tener';
  tuvo_covid: 'Sí' | 'No';
  secuelas_covid?: string;
  problemas_musculares_oseos: 'Sí' | 'No';
  detalle_lesiones?: string;
  tratamiento_actual?: string;
  toma_medicamentos: 'Sí' | 'No';
  detalle_medicamentos?: string;
  discapacidad?: string;
  observaciones_medicas?: string;

  // 4. Sustancias, Suplementos & Hábitos
  consume_alcohol: 'Sí' | 'No' | 'Algunas veces y poca cantidad';
  fuma: 'Sí' | 'No';
  frecuencia_fuma?: string;
  suplementos_anticonceptivos?: string;
  horas_sueno: string;

  // 5. Objetivos, Metas & Tu Historia
  objetivo_principal: 'Corporal: Bajar grasa y aumentar masa muscular' | 'Mejorar tu salud de manera integral';
  motivo_totalhiit?: string;
  expectativas?: string;
  actividad_fisica_actual: 'Sí' | 'No';
  detalle_actividad_actual?: string;
  deportes_favoritos?: string;
  actividades_previas?: string;
  estado_emocional?: string;
  asiste_terapia?: string;
  detalle_terapia?: string;
  compromiso_ayuda: 'Sí' | 'No' | 'Por supuesto';
}

export const FICHAS_INICIALES: FichaRegistro[] = [
  {
    id: 'ficha-valen-01',
    fecha_registro: '2026-05-15 10:30:00',
    finalizado: true,
    email: 'totalhiit1@gmail.com',
    nombre: 'Valentina',
    apellido: 'Bolívar',
    nombre_completo: 'Valentina Bolívar',
    sexo: 'Femenino',
    apodo: 'Valen',
    fecha_nacimiento: '1998-04-12',
    edad: 28,
    localidad_pais: 'Buenos Aires, Argentina',
    telefono_whatsapp: '+54 9 11 3456 7890',
    instagram: '@valen_totalhiit',
    contacto_emergencia: 'Everth Bolívar (+54 9 11 9876 5432) - Padre',
    consentimiento_fotos: 'Sí',
    sumar_grupo_whatsapp: 'Sí',
    altura: '1.68M',
    peso: '60.0Kg',
    talla_remera: 'M',
    alergias: 'Ninguna conocida',
    embarazos: 'No',
    hijos: 'No',
    tuvo_covid: 'Sí',
    secuelas_covid: 'Ninguna secuela, recuperación completa',
    problemas_musculares_oseos: 'No',
    detalle_lesiones: 'Ninguna lesión activa',
    tratamiento_actual: 'Entrenamiento funcional y nutrición balanceada',
    toma_medicamentos: 'No',
    detalle_medicamentos: 'Ninguno',
    discapacidad: 'Ninguna',
    observaciones_medicas: 'Apta para alta intensidad funcional HIIT',
    consume_alcohol: 'Algunas veces y poca cantidad',
    fuma: 'No',
    frecuencia_fuma: 'No fuma',
    suplementos_anticonceptivos: 'Proteína aislada de suero y creatina monohidrato',
    horas_sueno: '8 horas',
    objetivo_principal: 'Corporal: Bajar grasa y aumentar masa muscular',
    motivo_totalhiit: 'Entrenamiento de alta intensidad funcional, estilo de vida saludable y comunidad +40',
    expectativas: 'Mantener rendimiento óptimo y energía durante todo el día',
    actividad_fisica_actual: 'Sí',
    detalle_actividad_actual: 'HIIT, musculación funcional y running',
    deportes_favoritos: 'HIIT, Funcional, Natación',
    actividades_previas: 'Gimnasia deportiva y atletismo',
    estado_emocional: 'Excelente, motivada y con mucha energía positiva',
    asiste_terapia: 'Coaching y desarrollo personal',
    detalle_terapia: 'Sesiones periódicas de mentalidad deportiva',
    compromiso_ayuda: 'Por supuesto',
  },
  {
    id: 'ficha-caro-02',
    fecha_registro: '2026-06-01 14:15:00',
    finalizado: true,
    email: 'carolina.mendez@gmail.com',
    nombre: 'Carolina',
    apellido: 'Méndez',
    nombre_completo: 'Carolina Méndez',
    sexo: 'Femenino',
    apodo: 'Caro',
    fecha_nacimiento: '1982-08-20',
    edad: 43,
    localidad_pais: 'Santiago, Chile',
    telefono_whatsapp: '+56 9 8765 4321',
    instagram: '@caro_mendez_fit',
    contacto_emergencia: 'Roberto Méndez (+56 9 1234 5678) - Esposo',
    consentimiento_fotos: 'Sí',
    sumar_grupo_whatsapp: 'Sí',
    altura: '1.63M',
    peso: '64.5Kg',
    talla_remera: 'M',
    alergias: 'Penicilina y polen estacional',
    embarazos: 'Sí',
    hijos: 'Sí',
    tuvo_covid: 'Sí',
    secuelas_covid: 'Sensación de cansancio leve los primeros dos meses, ya superado',
    problemas_musculares_oseos: 'Sí',
    detalle_lesiones: 'Molestia lumbar leve por sedentarismo laboral en oficina',
    tratamiento_actual: 'Kinesiología preventiva y pausas activas',
    toma_medicamentos: 'No',
    detalle_medicamentos: 'Complejo vitamínico D3 y Magnesio',
    discapacidad: 'Ninguna',
    observaciones_medicas: 'Fortalecer zona media (core) para proteger zona lumbar',
    consume_alcohol: 'Algunas veces y poca cantidad',
    fuma: 'No',
    suplementos_anticonceptivos: 'Colágeno hidrolizado y magnesio',
    horas_sueno: '7 horas',
    objetivo_principal: 'Mejorar tu salud de manera integral',
    motivo_totalhiit: 'Recomendación de una amiga para entrenar en casa con clases guiadas',
    expectativas: 'Sentirme con más vitalidad, reducir dolores de espalda y tonificar',
    actividad_fisica_actual: 'Sí',
    detalle_actividad_actual: 'Caminatas y pilates 2 veces por semana',
    deportes_favoritos: 'Pilates, Senderismo, Bicicleta',
    actividades_previas: 'Aeróbicos en la universidad',
    estado_emocional: 'Con ganas de retomar el hábito del entrenamiento constante',
    asiste_terapia: 'Yoga y meditación',
    detalle_terapia: 'Prácticas de respiración consciente los fines de semana',
    compromiso_ayuda: 'Por supuesto',
  },
];
