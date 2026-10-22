export interface CollageItem {
  src: string;
  position: string;
}

/**
 * Creatividades de Instagram usadas como collage de fondo del encabezado.
 * `totalhiit_3.jpg` se excluye por ser un duplicado exacto de `totalhiit_1.jpg`.
 */
export const HERO_COLLAGE: CollageItem[] = [
  { src: '/images/user/totalhiit_1.jpg', position: 'center 20%' },
  { src: '/images/user/totalhiit_6.jpg', position: 'center 30%' },
  { src: '/images/user/totalhiit_2.jpg', position: 'center 25%' },
  { src: '/images/user/totalhiit_7.jpg', position: 'center 35%' },
  { src: '/images/user/totalhiit_4.jpg', position: 'center 20%' },
  { src: '/images/user/totalhiit_8.jpg', position: 'center 30%' },
  { src: '/images/user/totalhiit_5.jpg', position: 'center 25%' }
];
