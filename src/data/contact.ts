/**
 * Datos de contacto de TOTALHIIT.
 * Fuente única de verdad: completar acá y se actualiza toda la web.
 */

/** Numero de WhatsApp con prefijo internacional y solo digitos (ej. 54911XXXXXXXX). Vacio = el enlace abre el selector de contactos de WhatsApp. */
export const WHATSAPP_NUMBER = '5491154188296';

export const INSTAGRAM_URL = 'https://www.instagram.com/totalhiit1';

/** Canal de YouTube oficial (el parámetro pide suscripción). */
export const YOUTUBE_URL = 'https://www.youtube.com/channel/UC737ehJ-_dCu68IaZnC6zew?sub_confirmation=1';

/** Construye el enlace de WhatsApp con el mensaje precargado. */
export const buildWhatsappUrl = (message: string): string => {
  const text = encodeURIComponent(message);
  return WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    : `https://wa.me/?text=${text}`;
};
