export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  description: string;
  youtubeId: string;
  thumbnail?: string;
  type: 'intro' | 'class' | 'stretching';
}

export interface WeekModule {
  weekNumber: number;
  title: string;
  subtitle: string;
  description: string;
  classes: VideoItem[];
}

export const INTRO_VIDEO: VideoItem = {
  id: 'intro-1',
  title: 'Video de Introducción: Bienvenida a TOTAL+40',
  duration: '10 min',
  description: 'Conoce cómo está estructurado el bootcamp, recomendaciones previas y cómo cuidar tus articulaciones mientras ganas fuerza.',
  youtubeId: 'Fnk5WgIfZog',
  type: 'intro'
};

export const BOOTCAMP_WEEKS: WeekModule[] = [
  {
    weekNumber: 1,
    title: 'Semana 1: Activación y Conexión Muscular',
    subtitle: 'Despertar metabólico y fortalecimiento de base',
    description: 'Rutinas progresivas enfocadas en reactivar la musculatura, postura y resistencia sin impacto agresivo.',
    classes: [
      {
        id: 'w1-c1',
        title: 'Clase 1: Activación Full Body +40',
        duration: '25 min',
        description: 'Movilidad articular y circuitos de activación muscular suave.',
        youtubeId: 'wVlBMg6QKqE',
        type: 'class'
      },
      {
        id: 'w1-c2',
        title: 'Clase 2: Fuerza y Estabilidad Central (Core)',
        duration: '28 min',
        description: 'Fortalecimiento de suelo pélvico, abdomen y espalda baja.',
        youtubeId: 'f2QcIBb-hR4',
        type: 'class'
      },
      {
        id: 'w1-c3',
        title: 'Clase 3: Intervalos Cardio-Metabólicos Suaves',
        duration: '25 min',
        description: 'Quema de calorías y estimulación aeróbica sin saltos.',
        youtubeId: 'yClvb1a2BmQ',
        type: 'class'
      }
    ]
  },
  {
    weekNumber: 2,
    title: 'Semana 2: Tonificación y Resistencia Progresiva',
    subtitle: 'Incremento de intensidad y definición',
    description: 'Consolidamos el hábito. Estimulamos la síntesis de masa muscular magra y tono general.',
    classes: [
      {
        id: 'w2-c4',
        title: 'Clase 4: Fuerza Tren Inferior (Piernas y Glúteos)',
        duration: '30 min',
        description: 'Fuerza funcional para rodillas, caderas y glúteos firmes.',
        youtubeId: 'W-gHxh9cc9A',
        type: 'class'
      },
      {
        id: 'w2-c5',
        title: 'Clase 5: Tren Superior y Postura',
        duration: '26 min',
        description: 'Brazos, hombros y espalda para mejorar postura y tonicidad.',
        youtubeId: 'pZVpFu94J6M',
        type: 'class'
      },
      {
        id: 'w2-c6',
        title: 'Clase 6: HIIT Adaptado y Resistencia',
        duration: '28 min',
        description: 'Intervalos diseñados para activar el metabolismo sin agotar tus articulaciones.',
        youtubeId: 'tdoob2mOpaw',
        type: 'class'
      }
    ]
  },
  {
    weekNumber: 3,
    title: 'Semana 3: Quema y Potencia Muscular',
    subtitle: 'Reto metabólico y firmeza',
    description: 'En esta etapa sientes más energía, agilidad y vitalidad diaria.',
    classes: [
      {
        id: 'w3-c7',
        title: 'Clase 7: Potencia y Circuito Funcional',
        duration: '30 min',
        description: 'Combinación dinámica de fuerza y coordinación para mujeres activas.',
        youtubeId: 'ARs5oAGVW8c',
        type: 'class'
      },
      {
        id: 'w3-c8',
        title: 'Clase 8: TOTAL+40 Tonificación Integral',
        duration: '32 min',
        description: 'Clase completa de escultura corporal y resistencia muscular.',
        youtubeId: 'BXN4CRqOfdM',
        type: 'class'
      },
      {
        id: 'w3-c9',
        title: 'Clase 9: Core Dinámico y Balance',
        duration: '27 min',
        description: 'Control corporal, equilibrio y fuerza en la zona media.',
        youtubeId: 'clWk36HDB50',
        type: 'class'
      }
    ]
  },
  {
    weekNumber: 4,
    title: 'Semana 4: Máxima Vitalidad y Consolidación',
    subtitle: 'Cierre del bootcamp y transformación de hábitos',
    description: 'El pico del programa: celebrando la fuerza, la salud y la disciplina construida.',
    classes: [
      {
        id: 'w4-c10',
        title: 'Clase 10: Total Body HIIT de Cierre',
        duration: '32 min',
        description: 'Rutina completa de cuerpo entero para sellar tu energía.',
        youtubeId: 'OnuA4Y7DKaQ',
        type: 'class'
      },
      {
        id: 'w4-c11',
        title: 'Clase 11: Fuerza y Definición Funcional',
        duration: '30 min',
        description: 'Último circuito de sobrecarga progresiva y resistencia.',
        youtubeId: 'YPNEUd873wQ',
        type: 'class'
      },
      {
        id: 'w4-c12',
        title: 'Clase 12: Gran Final TOTAL+40',
        duration: '35 min',
        description: 'La sesión culminante que marca el inicio de tu nuevo estilo de vida.',
        youtubeId: 'rsmPFHrQIpg',
        type: 'class'
      }
    ]
  }
];

export const STRETCHING_VIDEOS: VideoItem[] = [
  {
    id: 'stretch-1',
    title: 'Rutina de Estiramiento y Flexibilidad +40',
    duration: '18 min',
    description: 'Alivio de tensiones en espalda, cadera y cuello. Ideal para días de descanso o post-entreno.',
    youtubeId: 'Ga89sFd3CRo',
    type: 'stretching'
  },
  {
    id: 'stretch-2',
    title: 'Movilidad Articular y Relajación Guiada',
    duration: '15 min',
    description: 'Mejora el rango de movimiento, cuida tus ligamentos y reduce el estrés acumulado.',
    youtubeId: 'Ag41JO-rJj4',
    type: 'stretching'
  }
];
