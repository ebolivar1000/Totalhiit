// ==============================================================================
// SERVICIO DE COTIZACIONES EN VIVO E HISTORIAL (DÓLAR / EURO VS PESO ARGENTINO)
// ==============================================================================

export interface CotizacionLive {
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

export interface SnapshotCotizacion {
  fecha: string; // YYYY-MM-DD
  usd_blue_compra: number;
  usd_blue_venta: number;
  usd_oficial_compra: number;
  usd_oficial_venta: number;
  eur_compra: number;
  eur_venta: number;
  fuente: string;
  actualizado_en: string;
}

const LLAVE_STORAGE_HISTORIAL_COTIZACIONES = 'totalhiit_crm_historial_cotizaciones';
const LLAVE_STORAGE_COTIZACION_ACTUAL = 'totalhiit_crm_cotizacion_actual';

// Datos de respaldo por defecto (Junio 2026 y Noviembre 2026)
export const HISTORIAL_COTIZACIONES_INICIAL: SnapshotCotizacion[] = [
  {
    fecha: '2026-06-01',
    usd_blue_compra: 1430,
    usd_blue_venta: 1449.58,
    usd_oficial_compra: 1400,
    usd_oficial_venta: 1420,
    eur_compra: 1640,
    eur_venta: 1662.36,
    fuente: 'Histórico Base Excel',
    actualizado_en: '2026-06-01T12:00:00Z',
  },
  {
    fecha: '2026-11-06',
    usd_blue_compra: 1535,
    usd_blue_venta: 1555,
    usd_oficial_compra: 1520,
    usd_oficial_venta: 1570,
    eur_compra: 1724.4,
    eur_venta: 1738.38,
    fuente: 'DolarApi.com',
    actualizado_en: new Date().toISOString(),
  },
];

export function cargarHistorialCotizaciones(): SnapshotCotizacion[] {
  try {
    const raw = localStorage.getItem(LLAVE_STORAGE_HISTORIAL_COTIZACIONES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return HISTORIAL_COTIZACIONES_INICIAL;
}

export function guardarHistorialCotizaciones(historial: SnapshotCotizacion[]): void {
  try {
    localStorage.setItem(LLAVE_STORAGE_HISTORIAL_COTIZACIONES, JSON.stringify(historial));
  } catch {}
}

export async function consultarDolarApi(): Promise<SnapshotCotizacion | null> {
  try {
    const hoyStr = new Date().toISOString().split('T')[0];

    const [resBlue, resOficial, resEur] = await Promise.all([
      fetch('https://dolarapi.com/v1/dolares/blue').then((r) => r.json()),
      fetch('https://dolarapi.com/v1/dolares/oficial').then((r) => r.json()),
      fetch('https://dolarapi.com/v1/cotizaciones/eur').then((r) => r.json()),
    ]);

    const snapshot: SnapshotCotizacion = {
      fecha: hoyStr,
      usd_blue_compra: Number(resBlue.compra) || 1535,
      usd_blue_venta: Number(resBlue.venta) || 1555,
      usd_oficial_compra: Number(resOficial.compra) || 1520,
      usd_oficial_venta: Number(resOficial.venta) || 1570,
      eur_compra: Number(resEur.compra) || 1724.4,
      eur_venta: Number(resEur.venta) || 1738.38,
      fuente: 'DolarApi.com (Oficial)',
      actualizado_en: new Date().toISOString(),
    };

    // Guardar en el historial local sin duplicar fecha
    const historial = cargarHistorialCotizaciones();
    const indexExistente = historial.findIndex((h) => h.fecha === hoyStr);
    if (indexExistente >= 0) {
      historial[indexExistente] = snapshot;
    } else {
      historial.unshift(snapshot);
    }
    guardarHistorialCotizaciones(historial);
    localStorage.setItem(LLAVE_STORAGE_COTIZACION_ACTUAL, JSON.stringify(snapshot));

    return snapshot;
  } catch (err) {
    console.warn('No se pudo conectar a DolarApi en este momento:', err);
    return null;
  }
}

export function obtenerCotizacionParaFecha(fecha: string): {
  usd_a_ars: number;
  eur_a_ars: number;
  fuente: string;
} {
  const historial = cargarHistorialCotizaciones();
  // Buscar coincidencia exacta por fecha
  const match = historial.find((h) => h.fecha === fecha);
  if (match) {
    return {
      usd_a_ars: match.usd_blue_venta || 1555,
      eur_a_ars: match.eur_venta || 1738.38,
      fuente: `Histórico (${match.fecha})`,
    };
  }

  // Si no coincide exactamente, buscar el más cercano o el último registrado
  if (historial.length > 0) {
    const ultimo = historial[0];
    return {
      usd_a_ars: ultimo.usd_blue_venta || 1555,
      eur_a_ars: ultimo.eur_venta || 1738.38,
      fuente: `Última cotización disponible (${ultimo.fecha})`,
    };
  }

  return {
    usd_a_ars: 1555,
    eur_a_ars: 1738.38,
    fuente: 'Valor predeterminado',
  };
}
