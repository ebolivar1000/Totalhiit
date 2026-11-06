import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  CheckCircle2,
  CheckSquare,
  Copy,
  DollarSign,
  Edit2,
  Eye,
  EyeOff,
  Filter,
  Globe,
  LogOut,
  Mail,
  MessageCircle,
  Plus,
  RotateCcw,
  Search,
  Send,
  Square,
  Trash2,
  TrendingUp,
} from 'lucide-react';

// ==============================================================================
// TIPOS Y MODELO DE DATOS
// ==============================================================================

export interface Pais {
  id: number;
  nombre: string;
  codigo_iso: string;
  bandera: string;
  moneda_defecto: string;
  tasa_a_usd: number;
  tasa_a_ars: number;
}

export interface Alumna {
  codigo: string;
  nombre_completo: string;
  email?: string;
  telefono_whatsapp?: string;
  pais_id: number;
  moneda_preferida: string;
  cuota_mensual?: number;
  fecha_inicio: string;
  dia_de_pago: number;
  activa: number; // 1 | 0
  notas?: string;
}

export interface Ingreso {
  id: string;
  tipo_ingreso: 'CUOTA_ALUMNA' | 'CONTRATACION_APP' | 'COLABORACION_MARCA' | 'OTRO_INGRESO';
  alumna_codigo?: string;
  cliente_o_marca?: string;
  concepto: string;
  fecha_pago: string;
  moneda_original: string;
  monto_original: number;
  tasa_a_usd: number;
  tasa_a_ars: number;
  usd_equivalente: number;
  ars_equivalente: number;
  mes_periodo: number;
  anio_periodo: number;
  metodo_pago: string;
  estado: 'APROBADO' | 'PENDIENTE';
  notas?: string;
}

export interface Egreso {
  id: string;
  categoria: 'PUBLICIDAD' | 'IMPUESTOS' | 'EQUIPOS' | 'SOFTWARE_HOSTING' | 'OTRO_EGRESO';
  concepto: string;
  fecha: string;
  proveedor?: string;
  moneda_original: string;
  monto_original: number;
  tasa_a_usd: number;
  tasa_a_ars: number;
  usd_equivalente: number;
  ars_equivalente: number;
  mes_periodo: number;
  anio_periodo: number;
  metodo_pago: string;
  notas?: string;
}

// ==============================================================================
// DATOS MAESTROS INICIALES CERTIFICADOS (DEL EXCEL JUNIO 2026)
// ==============================================================================

const PAISES_INICIALES: Pais[] = [
  { id: 1, nombre: 'Estados Unidos', codigo_iso: 'US', bandera: '🇺🇸', moneda_defecto: 'USD', tasa_a_usd: 1.0, tasa_a_ars: 1449.58 },
  { id: 2, nombre: 'Argentina', codigo_iso: 'AR', bandera: '🇦🇷', moneda_defecto: 'ARS', tasa_a_usd: 0.00069, tasa_a_ars: 1.0 },
  { id: 3, nombre: 'Alemania', codigo_iso: 'DE', bandera: '🇩🇪', moneda_defecto: 'EUR', tasa_a_usd: 1.1468, tasa_a_ars: 1662.36 },
  { id: 4, nombre: 'Finlandia', codigo_iso: 'FI', bandera: '🇫🇮', moneda_defecto: 'EUR', tasa_a_usd: 1.1468, tasa_a_ars: 1662.36 },
  { id: 5, nombre: 'Brasil', codigo_iso: 'BR', bandera: '🇧🇷', moneda_defecto: 'BRL', tasa_a_usd: 0.18, tasa_a_ars: 260.92 },
  { id: 6, nombre: 'Chile', codigo_iso: 'CL', bandera: '🇨🇱', moneda_defecto: 'CLP', tasa_a_usd: 0.00108, tasa_a_ars: 1.56 },
  { id: 7, nombre: 'España', codigo_iso: 'ES', bandera: '🇪🇸', moneda_defecto: 'EUR', tasa_a_usd: 1.1468, tasa_a_ars: 1662.36 },
  { id: 8, nombre: 'México', codigo_iso: 'MX', bandera: '🇲🇽', moneda_defecto: 'MXN', tasa_a_usd: 0.054, tasa_a_ars: 78.28 },
];

const ALUMNAS_INICIALES: Alumna[] = [
  { codigo: '0001', nombre_completo: 'Raquel Hernandez', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'raquel.hernandez@totalhiit.com', telefono_whatsapp: '+13055550101' },
  { codigo: '0002', nombre_completo: 'Jackie Boriziuk', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 40000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'jackie.boriziuk@totalhiit.com', telefono_whatsapp: '+5491155550102' },
  { codigo: '0003', nombre_completo: 'Esther Guisado', pais_id: 3, moneda_preferida: 'EUR', cuota_mensual: 30, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'esther.guisado@totalhiit.com', telefono_whatsapp: '+4915155550103' },
  { codigo: '0004', nombre_completo: 'Magaly Jarquin', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'magaly.jarquin@totalhiit.com', telefono_whatsapp: '+13055550104' },
  { codigo: '0005', nombre_completo: 'Argelia belen Jarquin', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'argelia.jarquin@totalhiit.com', telefono_whatsapp: '+13055550105' },
  { codigo: '0006', nombre_completo: 'Paula Hoor', pais_id: 3, moneda_preferida: 'EUR', cuota_mensual: 30, fecha_inicio: '2026-06-17', dia_de_pago: 17, activa: 1, email: 'paula.hoor@totalhiit.com', telefono_whatsapp: '+4915155550106' },
  { codigo: '0007', nombre_completo: 'Nataly Benitez', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 40000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'nataly.benitez@totalhiit.com', telefono_whatsapp: '+5491155550107' },
  { codigo: '0008', nombre_completo: 'Marlin Lopez', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'marlin.lopez@totalhiit.com', telefono_whatsapp: '+13055550108' },
  { codigo: '0009', nombre_completo: 'Margareth Banegas', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'margareth.banegas@totalhiit.com', telefono_whatsapp: '+13055550109' },
  { codigo: '0010', nombre_completo: 'Roxana Carranza', pais_id: 4, moneda_preferida: 'EUR', cuota_mensual: 30, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'roxana.carranza@totalhiit.com', telefono_whatsapp: '+358405550110' },
  { codigo: '0011', nombre_completo: 'Pamela Gauto', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 40000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'pamela.gauto@totalhiit.com', telefono_whatsapp: '+5491155550111' },
  { codigo: '0012', nombre_completo: 'Maria Florencia Basso', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 38000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'florencia.basso@totalhiit.com', telefono_whatsapp: '+5491155550112' },
  { codigo: '0013', nombre_completo: 'Luciana Belen', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 40000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'luciana.belen@totalhiit.com', telefono_whatsapp: '+5491155550113' },
  { codigo: '0014', nombre_completo: 'Maria Ines', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 40000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'maria.ines@totalhiit.com', telefono_whatsapp: '+5491155550114' },
  { codigo: '0015', nombre_completo: 'Carolina Mendez', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'carolina.mendez@totalhiit.com', telefono_whatsapp: '+13055550115' },
  { codigo: '0016', nombre_completo: 'Karen Rodriguez', pais_id: 5, moneda_preferida: 'USD', cuota_mensual: 38, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'karen.rodriguez@totalhiit.com', telefono_whatsapp: '+551195550116' },
  { codigo: '0017', nombre_completo: 'Carolina Cardenas', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'carolina.cardenas@totalhiit.com', telefono_whatsapp: '+13055550117' },
  { codigo: '0018', nombre_completo: 'Silvana Vigliarolo', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 40000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'silvana.vigliarolo@totalhiit.com', telefono_whatsapp: '+5491155550118' },
  { codigo: '0019', nombre_completo: 'Maria Elena Silva', pais_id: 6, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'maria.silva@totalhiit.com', telefono_whatsapp: '+56955550119' },
  { codigo: '0020', nombre_completo: 'Maydelin Romero', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'maydelin.romero@totalhiit.com', telefono_whatsapp: '+13055550120' },
  { codigo: '0021', nombre_completo: 'Patricia Rossi', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'patricia.rossi@totalhiit.com', telefono_whatsapp: '+13055550121' },
  { codigo: '0022', nombre_completo: 'Marcela Sanchez', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 40000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'marcela.sanchez@totalhiit.com', telefono_whatsapp: '+5491155550122' },
];

const INGRESOS_INICIALES: Ingreso[] = [
  { id: 'ing-1', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0001', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-2', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0002', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 40000, tasa_a_usd: 0.00069, tasa_a_ars: 1.0, usd_equivalente: 27.59, ars_equivalente: 40000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-3', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0003', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'EUR', monto_original: 30, tasa_a_usd: 1.1468, tasa_a_ars: 1662.36, usd_equivalente: 34.4, ars_equivalente: 49870.8, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-4', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0004', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-5', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0005', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-6', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0006', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-17', moneda_original: 'EUR', monto_original: 30, tasa_a_usd: 1.1468, tasa_a_ars: 1662.36, usd_equivalente: 34.4, ars_equivalente: 49870.8, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-7', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0007', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 40000, tasa_a_usd: 0.00069, tasa_a_ars: 1.0, usd_equivalente: 27.59, ars_equivalente: 40000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-8', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0008', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-9', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0009', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-10', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0010', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'EUR', monto_original: 30, tasa_a_usd: 1.1468, tasa_a_ars: 1662.36, usd_equivalente: 34.4, ars_equivalente: 49870.8, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-11', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0011', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 40000, tasa_a_usd: 0.00069, tasa_a_ars: 1.0, usd_equivalente: 27.59, ars_equivalente: 40000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-12', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0012', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 38000, tasa_a_usd: 0.00069, tasa_a_ars: 1.0, usd_equivalente: 26.21, ars_equivalente: 38000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-13', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0013', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 40000, tasa_a_usd: 0.00069, tasa_a_ars: 1.0, usd_equivalente: 27.59, ars_equivalente: 40000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-14', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0014', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 40000, tasa_a_usd: 0.00069, tasa_a_ars: 1.0, usd_equivalente: 27.59, ars_equivalente: 40000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-15', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0015', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-16', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0016', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 38, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 38.0, ars_equivalente: 55084.04, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-17', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0017', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-18', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0018', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'EUR', monto_original: 30, tasa_a_usd: 1.1468, tasa_a_ars: 1662.36, usd_equivalente: 34.4, ars_equivalente: 49870.8, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-19', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0019', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'EUR', monto_original: 30, tasa_a_usd: 1.1468, tasa_a_ars: 1662.36, usd_equivalente: 34.4, ars_equivalente: 49870.8, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-20', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0020', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-21', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0021', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-22', tipo_ingreso: 'CONTRATACION_APP', cliente_o_marca: 'Membresías App Móvil', concepto: 'Suscripciones mensuales App TotalHIIT', fecha_pago: '2026-06-15', moneda_original: 'USD', monto_original: 120, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 120.0, ars_equivalente: 173949.6, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Stripe', estado: 'APROBADO' },
  { id: 'ing-23', tipo_ingreso: 'COLABORACION_MARCA', cliente_o_marca: 'FitPro Suplementos', concepto: 'Patrocinio video bootcamp + mención', fecha_pago: '2026-06-20', moneda_original: 'USD', monto_original: 250, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 250.0, ars_equivalente: 362395.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'PayPal', estado: 'APROBADO' },
];

const EGRESOS_INICIALES: Egreso[] = [
  { id: 'egr-1', categoria: 'PUBLICIDAD', concepto: 'Campaña Meta Ads (Instagram/FB) Bootcamp +40', fecha: '2026-06-05', proveedor: 'Meta Platforms', moneda_original: 'USD', monto_original: 100, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 100.0, ars_equivalente: 144958.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Tarjeta' },
  { id: 'egr-2', categoria: 'EQUIPOS', concepto: 'Micrófono inalámbrico corbatero para filmación', fecha: '2026-06-10', proveedor: 'Amazon / MercadoLibre', moneda_original: 'USD', monto_original: 65, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 65.0, ars_equivalente: 94222.7, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Tarjeta' },
  { id: 'egr-3', categoria: 'SOFTWARE_HOSTING', concepto: 'Servidor, CDN Cloudflare y almacenamiento video', fecha: '2026-06-12', proveedor: 'Cloudflare Inc.', moneda_original: 'USD', monto_original: 20, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 20.0, ars_equivalente: 28991.6, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Tarjeta' },
  { id: 'egr-4', categoria: 'IMPUESTOS', concepto: 'Monotributo / Declaración fiscal del período', fecha: '2026-06-18', proveedor: 'AFIP / DGI', moneda_original: 'ARS', monto_original: 45000, tasa_a_usd: 0.00069, tasa_a_ars: 1.0, usd_equivalente: 31.05, ars_equivalente: 45000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia' },
];

const PLANTILLA_RECORDATORIO_DEFECTO = `¡Hola {nombre}! 🌟 Espero que estés teniendo una excelente semana y sintiendo en tu cuerpo toda la fuerza y vitalidad que vienes construyendo con cada entrenamiento de TotalHIIT. 💪✨

Tu constancia y compromiso con tu salud después de los 40 son una verdadera inspiración. Cuidar de ti misma y regalarte este tiempo es la inversión más valiosa de tu vida.

Te escribo con mucho cariño para recordarte la renovación de tu membresía activa de TotalHIIT:
📌 Cuota: {monto} {moneda}
📌 Día pactado de pago: Día {dia_cobro}
{estado_detalle}

Para mantener habilitado tu plan, clases en video y acompañamiento sin interrupción, por favor envíanos tu comprobante al realizar la transferencia.

¡Seguimos juntas avanzando con fuerza hacia tu mejor versión! 🔥 Un abrazo grande,
Equipo TotalHIIT
{enlace_pago}`;

const EMAILS_ADMIN_AUTORIZADOS = [
  'ebolivar1000@gmail.com',
  'caribialabs@gmail.com',
  'totalhiit1@gmail.com',
];
const CLAVE_DEFECTO = 'admin2026';

const LLAVE_STORAGE_ALUMNAS = 'totalhiit_crm_alumnas';
const LLAVE_STORAGE_INGRESOS = 'totalhiit_crm_ingresos';
const LLAVE_STORAGE_EGRESOS = 'totalhiit_crm_egresos';
const LLAVE_STORAGE_PAISES = 'totalhiit_crm_paises';
const LLAVE_STORAGE_CLAVE = 'totalhiit_crm_clave_admin';
const LLAVE_STORAGE_PLANTILLA = 'totalhiit_crm_plantilla_msg';
const LLAVE_SESION_ACTIVA = 'totalhiit_crm_autenticado';

export default function CRMApp() {
  // Autenticación
  const [autenticado, setAutenticado] = useState<boolean>(() => {
    return sessionStorage.getItem(LLAVE_SESION_ACTIVA) === '1';
  });
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return sessionStorage.getItem('totalhiit_crm_admin_email') || 'ebolivar1000@gmail.com';
  });
  const [inputEmail, setInputEmail] = useState('');
  const [inputClave, setInputClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');
  const [modoRecuperar, setModoRecuperar] = useState(false);
  const [recuperarEmail, setRecuperarEmail] = useState('');
  const [msgRecuperar, setMsgRecuperar] = useState('');

  // Navegación
  const [tab, setTab] = useState<
    'alumnas' | 'vencimientos' | 'recordatorios' | 'ingresos' | 'egresos' | 'dashboard' | 'paises' | 'seguridad'
  >('alumnas');

  // Países y Monedas
  const [paises, setPaises] = useState<Pais[]>(() => {
    const raw = localStorage.getItem(LLAVE_STORAGE_PAISES);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return PAISES_INICIALES;
  });

  // Alumnas
  const [alumnas, setAlumnas] = useState<Alumna[]>(() => {
    const raw = localStorage.getItem(LLAVE_STORAGE_ALUMNAS);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return ALUMNAS_INICIALES;
  });

  // Ingresos
  const [ingresos, setIngresos] = useState<Ingreso[]>(() => {
    const raw = localStorage.getItem(LLAVE_STORAGE_INGRESOS);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INGRESOS_INICIALES;
  });

  // Egresos
  const [egresos, setEgresos] = useState<Egreso[]>(() => {
    const raw = localStorage.getItem(LLAVE_STORAGE_EGRESOS);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return EGRESOS_INICIALES;
  });

  // Plantilla de Recordatorios
  const [plantillaMsg, setPlantillaMsg] = useState<string>(() => {
    return localStorage.getItem(LLAVE_STORAGE_PLANTILLA) || PLANTILLA_RECORDATORIO_DEFECTO;
  });

  // Persistencia LocalStorage
  useEffect(() => {
    localStorage.setItem(LLAVE_STORAGE_PAISES, JSON.stringify(paises));
  }, [paises]);

  useEffect(() => {
    localStorage.setItem(LLAVE_STORAGE_ALUMNAS, JSON.stringify(alumnas));
  }, [alumnas]);

  useEffect(() => {
    localStorage.setItem(LLAVE_STORAGE_INGRESOS, JSON.stringify(ingresos));
  }, [ingresos]);

  useEffect(() => {
    localStorage.setItem(LLAVE_STORAGE_EGRESOS, JSON.stringify(egresos));
  }, [egresos]);

  useEffect(() => {
    localStorage.setItem(LLAVE_STORAGE_PLANTILLA, plantillaMsg);
  }, [plantillaMsg]);

  // Mapa de Países
  const mapaPaises = useMemo(() => {
    const map = new Map<number, Pais>();
    paises.forEach((p) => map.set(p.id, p));
    return map;
  }, [paises]);

  // Monedas Únicas
  const monedasDisponibles = useMemo(() => {
    const set = new Set<string>(['USD', 'EUR', 'ARS']);
    paises.forEach((p) => set.add(p.moneda_defecto));
    alumnas.forEach((a) => set.add(a.moneda_preferida));
    return Array.from(set);
  }, [paises, alumnas]);

  // Meses Únicos en Ingresos y Egresos
  const mesesDisponibles = useMemo(() => {
    const set = new Set<string>();
    ingresos.forEach((i) => {
      const mesStr = `${i.anio_periodo}-${String(i.mes_periodo).padStart(2, '0')}`;
      set.add(mesStr);
    });
    egresos.forEach((e) => {
      const mesStr = `${e.anio_periodo}-${String(e.mes_periodo).padStart(2, '0')}`;
      set.add(mesStr);
    });
    set.add('2026-06');
    return Array.from(set).sort().reverse();
  }, [ingresos, egresos]);

  // ==============================================================================
  // ESTADOS DE FILTROS
  // ==============================================================================

  // Filtros Alumnas
  const [busquedaAlumnas, setBusquedaAlumnas] = useState('');
  const [filtroPaisAlumnas, setFiltroPaisAlumnas] = useState<string>('todos');
  const [filtroMonedaAlumnas, setFiltroMonedaAlumnas] = useState<string>('todas');
  const [filtroEstadoAlumnas, setFiltroEstadoAlumnas] = useState<'todos' | 'activas' | 'inactivas'>('todos');

  // Filtros y Orden en Vencimientos
  const [busquedaVenc, setBusquedaVenc] = useState('');
  const [ordenVenc, setOrdenVenc] = useState<'urgencia' | 'dia' | 'nombre' | 'pais'>('urgencia');
  const [filtroEstadoVenc, setFiltroEstadoVenc] = useState<'todos' | 'urgentes' | 'vencido' | 'vence_hoy' | 'proximo' | 'al_dia'>('todos');

  // Filtros Ingresos
  const [filtroIngMes, setFiltroIngMes] = useState<string>('todos');
  const [filtroIngMoneda, setFiltroIngMoneda] = useState<string>('todas');
  const [filtroIngPais, setFiltroIngPais] = useState<string>('todos');
  const [filtroIngAlumna, setFiltroIngAlumna] = useState<string>('todas');
  const [filtroIngTipo, setFiltroIngTipo] = useState<string>('todos');
  const [busquedaIngresos, setBusquedaIngresos] = useState('');

  // Filtros Egresos
  const [filtroEgrMes, setFiltroEgrMes] = useState<string>('todos');
  const [filtroEgrMoneda, setFiltroEgrMoneda] = useState<string>('todas');
  const [filtroEgrCat, setFiltroEgrCat] = useState<string>('todas');
  const [busquedaEgresos, setBusquedaEgresos] = useState('');

  // Filtros Métricas / Dashboard
  const [dashFiltroMes, setDashFiltroMes] = useState<string>('todos');
  const [dashFiltroMoneda, setDashFiltroMoneda] = useState<string>('consolidado_usd');
  const [dashFiltroPais, setDashFiltroPais] = useState<string>('todos');
  const [dashFiltroTipo, setDashFiltroTipo] = useState<string>('todos');
  const [dashFiltroCatEgreso, setDashFiltroCatEgreso] = useState<string>('todas');

  // ==============================================================================
  // MODALES
  // ==============================================================================

  // Modal Alumna (Crear / Editar)
  const [modalAlumna, setModalAlumna] = useState(false);
  const [alumnaEdit, setAlumnaEdit] = useState<Alumna | null>(null);
  const [formCod, setFormCod] = useState('');
  const [formNombre, setFormNombre] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTel, setFormTel] = useState('');
  const [formPais, setFormPais] = useState(1);
  const [formMoneda, setFormMoneda] = useState('USD');
  const [formCuota, setFormCuota] = useState<number>(40);
  const [formDia, setFormDia] = useState(1);
  const [formActiva, setFormActiva] = useState(1);
  const [formNotas, setFormNotas] = useState('');

  // Modal País (Crear / Editar)
  const [modalPais, setModalPais] = useState(false);
  const [paisEdit, setPaisEdit] = useState<Pais | null>(null);
  const [formPaisNombre, setFormPaisNombre] = useState('');
  const [formPaisIso, setFormPaisIso] = useState('');
  const [formPaisBandera, setFormPaisBandera] = useState('🌍');
  const [formPaisMoneda, setFormPaisMoneda] = useState('USD');
  const [formPaisTasaUsd, setFormPaisTasaUsd] = useState<number>(1.0);
  const [formPaisTasaArs, setFormPaisTasaArs] = useState<number>(1449.58);

  // Modal Ingreso
  const [modalIngreso, setModalIngreso] = useState(false);
  const [ingTipo, setIngTipo] = useState<Ingreso['tipo_ingreso']>('CUOTA_ALUMNA');
  const [ingAlumnaCod, setIngAlumnaCod] = useState('');
  const [ingClienteMarca, setIngClienteMarca] = useState('');
  const [ingConcepto, setIngConcepto] = useState('Cuota Mensual TotalHIIT');
  const [ingFecha, setIngFecha] = useState('2026-06-01');
  const [ingMoneda, setIngMoneda] = useState('USD');
  const [ingMonto, setIngMonto] = useState<number>(40);
  const [ingTasaUsd, setIngTasaUsd] = useState<number>(1.0);
  const [ingTasaArs, setIngTasaArs] = useState<number>(1449.58);
  const [ingMetodo, setIngMetodo] = useState('Transferencia');

  // Modal Egreso
  const [modalEgreso, setModalEgreso] = useState(false);
  const [egrCat, setEgrCat] = useState<Egreso['categoria']>('PUBLICIDAD');
  const [egrConcepto, setEgrConcepto] = useState('');
  const [egrFecha, setEgrFecha] = useState('2026-06-01');
  const [egrProv, setEgrProv] = useState('');
  const [egrMoneda, setEgrMoneda] = useState('USD');
  const [egrMonto, setEgrMonto] = useState<number>(50);
  const [egrTasaUsd, setEgrTasaUsd] = useState<number>(1.0);
  const [egrTasaArs, setEgrTasaArs] = useState<number>(1449.58);

  // Modal Mensaje Individual
  const [modalMsg, setModalMsg] = useState(false);
  const [alumnaMsg, setAlumnaMsg] = useState<Alumna | null>(null);
  const [textoMsg, setTextoMsg] = useState('');
  const [copiado, setCopiado] = useState(false);

  // Centro de Recordatorios Masivos
  const [filtroLoteVenc, setFiltroLoteVenc] = useState<'todos' | 'vencidas' | 'vence_hoy' | 'proximos_7d' | 'dia_especifico'>('todos');
  const [diaFiltroLote, setDiaFiltroLote] = useState<number>(1);
  const [alumnasSeleccionadas, setAlumnasSeleccionadas] = useState<Set<string>>(new Set());
  const [enviadosSesion, setEnviadosSesion] = useState<Set<string>>(new Set());
  const [modalEditarPlantilla, setModalEditarPlantilla] = useState(false);
  const [textoPlantillaTemp, setTextoPlantillaTemp] = useState('');

  // Seguridad / Clave
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [msgSeguridad, setMsgSeguridad] = useState('');

  // ==============================================================================
  // FUNCIONES DE SOPORTE
  // ==============================================================================

  const construirMensaje = (
    plantilla: string,
    al: Alumna,
    monto: number,
    moneda: string,
    diaCobro: number,
    diasRestantes: number,
    estado: string
  ) => {
    const primerNombre = al.nombre_completo.split(' ')[0] || al.nombre_completo;
    const sim = moneda === 'EUR' ? '€' : '$';
    const montoFmt = `${sim}${monto.toLocaleString('es-ES')}`;

    let detalleEstado = '';
    if (estado === 'VENCE_HOY') {
      detalleEstado = '⚠️ Tu membresía vence hoy.';
    } else if (estado === 'VENCIDO') {
      detalleEstado = `⚠️ Tu membresía venció hace ${Math.abs(diasRestantes)} día(s).`;
    } else if (estado === 'PROXIMO') {
      detalleEstado = `⏳ Faltan ${diasRestantes} día(s) para tu fecha de renovación.`;
    } else {
      detalleEstado = `🗓️ Tu ciclo de pago habitual es el día ${diaCobro}.`;
    }

    return plantilla
      .replace(/\{nombre\}/g, primerNombre)
      .replace(/\{nombre_completo\}/g, al.nombre_completo)
      .replace(/\{monto\}/g, montoFmt)
      .replace(/\{moneda\}/g, moneda)
      .replace(/\{dia_cobro\}/g, diaCobro.toString())
      .replace(/\{dias_restantes\}/g, Math.abs(diasRestantes).toString())
      .replace(/\{estado_detalle\}/g, detalleEstado)
      .replace(/\{enlace_pago\}/g, 'https://totalhiit.pages.dev/');
  };

  const abrirModalMsg = (al: Alumna, monto: number, moneda: string, diaCobro: number, diasRestantes: number, estado: string) => {
    setAlumnaMsg(al);
    const mensaje = construirMensaje(plantillaMsg, al, monto, moneda, diaCobro, diasRestantes, estado);
    setTextoMsg(mensaje);
    setCopiado(false);
    setModalMsg(true);
  };

  // ==============================================================================
  // CÁLCULOS Y MEMOS
  // ==============================================================================

  // Alumnas Filtradas
  const alumnasFiltradas = useMemo(() => {
    return alumnas.filter((a) => {
      const q = busquedaAlumnas.toLowerCase();
      const coincide =
        a.nombre_completo.toLowerCase().includes(q) ||
        a.codigo.toLowerCase().includes(q) ||
        (a.email || '').toLowerCase().includes(q) ||
        (a.telefono_whatsapp || '').includes(q);

      const coincPais = filtroPaisAlumnas === 'todos' || a.pais_id === Number(filtroPaisAlumnas);
      const coincMon = filtroMonedaAlumnas === 'todas' || a.moneda_preferida === filtroMonedaAlumnas;
      const coincEst =
        filtroEstadoAlumnas === 'todos' ||
        (filtroEstadoAlumnas === 'activas' && a.activa === 1) ||
        (filtroEstadoAlumnas === 'inactivas' && a.activa === 0);

      return coincide && coincPais && coincMon && coincEst;
    });
  }, [alumnas, busquedaAlumnas, filtroPaisAlumnas, filtroMonedaAlumnas, filtroEstadoAlumnas]);

  // Alertas de Vencimiento y Ordenamiento
  const alertasVencimiento = useMemo(() => {
    const hoy = new Date();
    const diaActual = hoy.getDate();

    const lista = alumnas.map((al) => {
      const diaCobro = al.dia_de_pago || 1;
      const diff = diaCobro - diaActual;
      let estado: 'VENCE_HOY' | 'PROXIMO' | 'VENCIDO' | 'AL_DIA' = 'AL_DIA';

      if (al.activa === 0) {
        estado = 'AL_DIA';
      } else if (diff === 0) {
        estado = 'VENCE_HOY';
      } else if (diff > 0 && diff <= 7) {
        estado = 'PROXIMO';
      } else if (diff < 0) {
        estado = 'VENCIDO';
      }

      const montoEst = al.cuota_mensual || (al.moneda_preferida === 'ARS' ? 40000 : 40);

      return {
        alumna: al,
        pais: mapaPaises.get(al.pais_id),
        diaCobro,
        diasRestantes: diff,
        estado,
        montoEst,
        moneda: al.moneda_preferida,
      };
    });

    // Filtros de Vencimiento
    const filtradas = lista.filter((item) => {
      const q = busquedaVenc.toLowerCase();
      const matchSearch =
        item.alumna.nombre_completo.toLowerCase().includes(q) ||
        item.alumna.codigo.includes(q) ||
        (item.pais?.nombre || '').toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (filtroEstadoVenc === 'urgentes') return item.estado === 'VENCE_HOY' || item.estado === 'VENCIDO';
      if (filtroEstadoVenc === 'vencido') return item.estado === 'VENCIDO';
      if (filtroEstadoVenc === 'vence_hoy') return item.estado === 'VENCE_HOY';
      if (filtroEstadoVenc === 'proximo') return item.estado === 'PROXIMO';
      if (filtroEstadoVenc === 'al_dia') return item.estado === 'AL_DIA';
      return true;
    });

    // Ordenamiento
    return filtradas.sort((a, b) => {
      if (ordenVenc === 'dia') return a.diaCobro - b.diaCobro;
      if (ordenVenc === 'nombre') return a.alumna.nombre_completo.localeCompare(b.alumna.nombre_completo);
      if (ordenVenc === 'pais') return (a.pais?.nombre || '').localeCompare(b.pais?.nombre || '');
      const p = { VENCE_HOY: 0, VENCIDO: 1, PROXIMO: 2, AL_DIA: 3 };
      return p[a.estado] - p[b.estado];
    });
  }, [alumnas, mapaPaises, busquedaVenc, filtroEstadoVenc, ordenVenc]);

  // Lista para Recordatorios Masivos
  const alumnasParaRecordatorios = useMemo(() => {
    return alertasVencimiento.filter((item) => {
      if (item.alumna.activa !== 1) return false;
      if (filtroLoteVenc === 'vencidas') return item.estado === 'VENCIDO';
      if (filtroLoteVenc === 'vence_hoy') return item.estado === 'VENCE_HOY';
      if (filtroLoteVenc === 'proximos_7d') return item.estado === 'PROXIMO';
      if (filtroLoteVenc === 'dia_especifico') return item.diaCobro === Number(diaFiltroLote);
      return true;
    });
  }, [alertasVencimiento, filtroLoteVenc, diaFiltroLote]);

  // Inicializar selección masiva cuando cambia el filtro
  useEffect(() => {
    const codigos = new Set<string>();
    alumnasParaRecordatorios.forEach((item) => codigos.add(item.alumna.codigo));
    setAlumnasSeleccionadas(codigos);
  }, [alumnasParaRecordatorios]);

  // Ingresos Filtrados
  const ingresosFiltrados = useMemo(() => {
    return ingresos.filter((i) => {
      const mesStr = `${i.anio_periodo}-${String(i.mes_periodo).padStart(2, '0')}`;
      const matchMes = filtroIngMes === 'todos' || mesStr === filtroIngMes || i.fecha_pago.startsWith(filtroIngMes);
      const matchMon = filtroIngMoneda === 'todas' || i.moneda_original === filtroIngMoneda;
      const matchTipo = filtroIngTipo === 'todos' || i.tipo_ingreso === filtroIngTipo;

      let matchAlumna = true;
      if (filtroIngAlumna !== 'todas') {
        matchAlumna = i.alumna_codigo === filtroIngAlumna;
      }

      let matchPais = true;
      if (filtroIngPais !== 'todos') {
        if (i.alumna_codigo) {
          const al = alumnas.find((a) => a.codigo === i.alumna_codigo);
          matchPais = al ? al.pais_id === Number(filtroIngPais) : false;
        } else {
          matchPais = false;
        }
      }

      const q = busquedaIngresos.toLowerCase();
      const matchBusqueda =
        i.concepto.toLowerCase().includes(q) ||
        (i.cliente_o_marca || '').toLowerCase().includes(q) ||
        (i.alumna_codigo || '').toLowerCase().includes(q);

      return matchMes && matchMon && matchTipo && matchAlumna && matchPais && matchBusqueda;
    });
  }, [ingresos, filtroIngMes, filtroIngMoneda, filtroIngTipo, filtroIngAlumna, filtroIngPais, busquedaIngresos, alumnas]);

  // Totales Ingresos Filtrados
  const totalesIngresosFiltrados = useMemo(() => {
    const usd = ingresosFiltrados.reduce((acc, i) => acc + (i.usd_equivalente || 0), 0);
    const ars = ingresosFiltrados.reduce((acc, i) => acc + (i.ars_equivalente || 0), 0);
    return { usd, ars, cantidad: ingresosFiltrados.length };
  }, [ingresosFiltrados]);

  // Egresos Filtrados
  const egresosFiltrados = useMemo(() => {
    return egresos.filter((e) => {
      const mesStr = `${e.anio_periodo}-${String(e.mes_periodo).padStart(2, '0')}`;
      const matchMes = filtroEgrMes === 'todos' || mesStr === filtroEgrMes || e.fecha.startsWith(filtroEgrMes);
      const matchMon = filtroEgrMoneda === 'todas' || e.moneda_original === filtroEgrMoneda;
      const matchCat = filtroEgrCat === 'todas' || e.categoria === filtroEgrCat;

      const q = busquedaEgresos.toLowerCase();
      const matchBusqueda =
        e.concepto.toLowerCase().includes(q) ||
        (e.proveedor || '').toLowerCase().includes(q);

      return matchMes && matchMon && matchCat && matchBusqueda;
    });
  }, [egresos, filtroEgrMes, filtroEgrMoneda, filtroEgrCat, busquedaEgresos]);

  // Totales Egresos Filtrados
  const totalesEgresosFiltrados = useMemo(() => {
    const usd = egresosFiltrados.reduce((acc, e) => acc + (e.usd_equivalente || 0), 0);
    const ars = egresosFiltrados.reduce((acc, e) => acc + (e.ars_equivalente || 0), 0);
    return { usd, ars, cantidad: egresosFiltrados.length };
  }, [egresosFiltrados]);

  // Métricas del Dashboard con Filtros y Gráficos Visuales
  const dashboardData = useMemo(() => {
    // Filtrar Ingresos para Dashboard
    const ings = ingresos.filter((i) => {
      const mesStr = `${i.anio_periodo}-${String(i.mes_periodo).padStart(2, '0')}`;
      const matchMes = dashFiltroMes === 'todos' || mesStr === dashFiltroMes || i.fecha_pago.startsWith(dashFiltroMes);
      const matchTipo = dashFiltroTipo === 'todos' || i.tipo_ingreso === dashFiltroTipo;

      let matchPais = true;
      if (dashFiltroPais !== 'todos') {
        if (i.alumna_codigo) {
          const al = alumnas.find((a) => a.codigo === i.alumna_codigo);
          matchPais = al ? al.pais_id === Number(dashFiltroPais) : false;
        } else {
          matchPais = false;
        }
      }

      let matchMon = true;
      if (dashFiltroMoneda !== 'consolidado_usd' && dashFiltroMoneda !== 'consolidado_ars') {
        matchMon = i.moneda_original === dashFiltroMoneda;
      }

      return matchMes && matchTipo && matchPais && matchMon;
    });

    // Filtrar Egresos para Dashboard
    const egrs = egresos.filter((e) => {
      const mesStr = `${e.anio_periodo}-${String(e.mes_periodo).padStart(2, '0')}`;
      const matchMes = dashFiltroMes === 'todos' || mesStr === dashFiltroMes || e.fecha.startsWith(dashFiltroMes);
      const matchCat = dashFiltroCatEgreso === 'todas' || e.categoria === dashFiltroCatEgreso;

      let matchMon = true;
      if (dashFiltroMoneda !== 'consolidado_usd' && dashFiltroMoneda !== 'consolidado_ars') {
        matchMon = e.moneda_original === dashFiltroMoneda;
      }

      return matchMes && matchCat && matchMon;
    });

    const totalIngresosUSD = ings.reduce((acc, i) => acc + (i.usd_equivalente || 0), 0);
    const totalIngresosARS = ings.reduce((acc, i) => acc + (i.ars_equivalente || 0), 0);
    const totalEgresosUSD = egrs.reduce((acc, e) => acc + (e.usd_equivalente || 0), 0);
    const totalEgresosARS = egrs.reduce((acc, e) => acc + (e.ars_equivalente || 0), 0);

    const gananciaNetaUSD = totalIngresosUSD - totalEgresosUSD;
    const gananciaNetaARS = totalIngresosARS - totalEgresosARS;

    const margenEbitdaUSD = totalIngresosUSD > 0 ? (gananciaNetaUSD / totalIngresosUSD) * 100 : 0;

    // Ingresos por Tipo
    const tipos = [
      { id: 'CUOTA_ALUMNA', label: 'Cuotas de Alumnas', color: 'bg-rose-600' },
      { id: 'CONTRATACION_APP', label: 'Contrataciones App', color: 'bg-purple-600' },
      { id: 'COLABORACION_MARCA', label: 'Colaboraciones Marcas', color: 'bg-blue-600' },
      { id: 'OTRO_INGRESO', label: 'Otros Ingresos', color: 'bg-amber-600' },
    ];

    const ingresosPorTipo = tipos.map((t) => {
      const match = ings.filter((i) => i.tipo_ingreso === t.id);
      const usd = match.reduce((acc, i) => acc + (i.usd_equivalente || 0), 0);
      const ars = match.reduce((acc, i) => acc + (i.ars_equivalente || 0), 0);
      const pct = totalIngresosUSD > 0 ? Math.round((usd / totalIngresosUSD) * 100) : 0;
      return { ...t, usd, ars, count: match.length, pct };
    });

    // Ingresos por País
    const mapPaisesUSD = new Map<number, { usd: number; ars: number; count: number }>();
    ings.forEach((i) => {
      let pId = 1;
      if (i.alumna_codigo) {
        const al = alumnas.find((a) => a.codigo === i.alumna_codigo);
        if (al) pId = al.pais_id;
      }
      const cur = mapPaisesUSD.get(pId) || { usd: 0, ars: 0, count: 0 };
      mapPaisesUSD.set(pId, {
        usd: cur.usd + (i.usd_equivalente || 0),
        ars: cur.ars + (i.ars_equivalente || 0),
        count: cur.count + 1,
      });
    });

    const ingresosPorPais = Array.from(mapPaisesUSD.entries()).map(([pId, data]) => {
      const p = mapaPaises.get(pId);
      const pct = totalIngresosUSD > 0 ? Math.round((data.usd / totalIngresosUSD) * 100) : 0;
      return {
        paisId: pId,
        nombre: p ? p.nombre : 'Internacional',
        bandera: p ? p.bandera : '🌍',
        usd: data.usd,
        ars: data.ars,
        count: data.count,
        pct,
      };
    }).sort((a, b) => b.usd - a.usd);

    // Egresos por Categoría
    const catsEgreso = [
      { id: 'PUBLICIDAD', label: 'Publicidad (Meta/Google)', color: 'bg-red-500' },
      { id: 'IMPUESTOS', label: 'Impuestos & Tasas', color: 'bg-amber-500' },
      { id: 'EQUIPOS', label: 'Reposición Equipos / Suministros', color: 'bg-cyan-600' },
      { id: 'SOFTWARE_HOSTING', label: 'Software, Hosting & Video', color: 'bg-indigo-600' },
      { id: 'OTRO_EGRESO', label: 'Otros Gastos', color: 'bg-stone-500' },
    ];

    const egresosPorCategoria = catsEgreso.map((c) => {
      const match = egrs.filter((e) => e.categoria === c.id);
      const usd = match.reduce((acc, e) => acc + (e.usd_equivalente || 0), 0);
      const ars = match.reduce((acc, e) => acc + (e.ars_equivalente || 0), 0);
      const pct = totalEgresosUSD > 0 ? Math.round((usd / totalEgresosUSD) * 100) : 0;
      return { ...c, usd, ars, count: match.length, pct };
    });

    const ticketPromedioUSD = ings.length > 0 ? totalIngresosUSD / ings.length : 36.8;

    return {
      totalIngresosUSD,
      totalIngresosARS,
      totalEgresosUSD,
      totalEgresosARS,
      gananciaNetaUSD,
      gananciaNetaARS,
      margenEbitdaUSD,
      ingresosPorTipo,
      ingresosPorPais,
      egresosPorCategoria,
      ticketPromedioUSD,
      cantidadIngresos: ings.length,
      cantidadEgresos: egrs.length,
    };
  }, [ingresos, egresos, alumnas, mapaPaises, dashFiltroMes, dashFiltroMoneda, dashFiltroPais, dashFiltroTipo, dashFiltroCatEgreso]);

  // Manejo Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLogin('');
    const normEmail = inputEmail.trim().toLowerCase();
    const claveGuardada = localStorage.getItem(LLAVE_STORAGE_CLAVE) || CLAVE_DEFECTO;

    if (!EMAILS_ADMIN_AUTORIZADOS.includes(normEmail)) {
      setErrorLogin('Acceso denegado: El correo no pertenece a los administradores autorizados.');
      return;
    }
    if (inputClave.trim() !== claveGuardada) {
      setErrorLogin('Contraseña incorrecta. Recuerda que la clave por defecto es "admin2026".');
      return;
    }

    sessionStorage.setItem(LLAVE_SESION_ACTIVA, '1');
    sessionStorage.setItem('totalhiit_crm_admin_email', normEmail);
    setAdminEmail(normEmail);
    setAutenticado(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(LLAVE_SESION_ACTIVA);
    sessionStorage.removeItem('totalhiit_crm_admin_email');
    setAutenticado(false);
  };

  const handleRecuperar = (e: React.FormEvent) => {
    e.preventDefault();
    const norm = recuperarEmail.trim().toLowerCase();
    if (EMAILS_ADMIN_AUTORIZADOS.includes(norm)) {
      localStorage.setItem(LLAVE_STORAGE_CLAVE, CLAVE_DEFECTO);
      setMsgRecuperar(`✅ Contraseña restablecida con éxito a "${CLAVE_DEFECTO}".`);
    } else {
      setMsgRecuperar('⚠️ Correo no autorizado para recuperación.');
    }
  };

  // Pantalla de Login si no está autenticado
  if (!autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 p-4 font-sans text-stone-100">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <img
              src="/images/logo_valen.jpeg"
              alt="TotalHIIT"
              className="mx-auto h-20 w-20 rounded-2xl border-2 border-rose-600 object-cover shadow-2xl"
            />
            <h1 className="mt-3 font-edo text-2xl tracking-wider text-white">
              TOTAL<span className="text-rose-600">HIIT</span> CRM
            </h1>
            <p className="mt-1 text-xs text-stone-400">
              Administración de Alumnas & Finanzas Multi-divisa
            </p>
          </div>

          <div className="rounded-3xl border border-stone-800 bg-stone-900/90 p-6 shadow-xl backdrop-blur-md">
            {!modoRecuperar ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Correo Administrador
                  </label>
                  <input
                    type="email"
                    placeholder="ebolivar1000@gmail.com"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-stone-700 bg-stone-800 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={verClave ? 'text' : 'password'}
                      placeholder="admin2026"
                      value={inputClave}
                      onChange={(e) => setInputClave(e.target.value)}
                      required
                      className="w-full rounded-xl border border-stone-700 bg-stone-800 px-3.5 py-2.5 pr-10 text-xs text-white placeholder-stone-500 outline-none focus:border-rose-500"
                    />
                    <button
                      type="button"
                      onClick={() => setVerClave(!verClave)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                    >
                      {verClave ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {errorLogin && (
                  <div className="rounded-xl border border-red-500/30 bg-red-950/50 p-2.5 text-xs font-semibold text-red-300 flex items-center gap-2">
                    <AlertTriangle size={15} className="shrink-0 text-red-400" />
                    <span>{errorLogin}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition"
                >
                  Entrar al Portal CRM
                </button>

                <div className="flex items-center justify-between pt-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setModoRecuperar(true);
                      setErrorLogin('');
                    }}
                    className="text-rose-400 hover:underline"
                  >
                    ¿Olvidaste la clave?
                  </button>
                  <a href="/" className="text-stone-400 hover:text-stone-200">
                    ← Volver a la Web
                  </a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRecuperar} className="space-y-4">
                <h3 className="text-xs font-bold uppercase text-white">Restablecer Contraseña</h3>
                <p className="text-[11px] text-stone-400">
                  Ingresa tu correo autorizado para reiniciar la clave a <code className="text-rose-400">admin2026</code>:
                </p>

                <input
                  type="email"
                  placeholder="ej: caribialabs@gmail.com"
                  value={recuperarEmail}
                  onChange={(e) => setRecuperarEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-stone-700 bg-stone-800 px-3.5 py-2.5 text-xs text-white placeholder-stone-500 outline-none"
                />

                {msgRecuperar && (
                  <div className="rounded-xl border border-stone-700 bg-stone-800 p-2.5 text-xs font-semibold text-stone-200">
                    {msgRecuperar}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700"
                >
                  Confirmar Reinicio
                </button>

                <button
                  type="button"
                  onClick={() => setModoRecuperar(false)}
                  className="w-full text-center text-[11px] text-stone-400 hover:underline"
                >
                  Volver al inicio de sesión
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================================
  // VISTA PRINCIPAL
  // ==============================================================================
  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900 pb-20">
      {/* Barra Superior */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logo_valen.jpeg"
              alt="TotalHIIT"
              className="h-9 w-9 rounded-xl border border-rose-600 object-cover"
            />
            <div>
              <span className="font-edo text-base tracking-wider text-stone-900">
                TOTAL<span className="text-rose-600">HIIT</span>
              </span>
              <span className="ml-2 rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                CRM PRO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
              {adminEmail}
            </span>
            <a
              href="/admin.html"
              className="rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-50"
            >
              Admin Web
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-xl bg-stone-200 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-300"
            >
              <LogOut size={13} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenedor Principal */}
      <main className="mx-auto max-w-6xl px-4 py-5 space-y-5">
        {/* Banner de Cabecera */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-950 via-rose-950 to-stone-900 p-5 text-white shadow-lg">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-pink-200">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-pulse" />
                PANEL DE CONTROL PROFESIONAL
              </span>
              <h2 className="mt-1 font-edo text-xl tracking-wide sm:text-2xl">
                CRM & Gestión Financiera Integral
              </h2>
              <p className="mt-0.5 text-xs text-stone-300 max-w-xl">
                Padrón activo/inactivo, cobros automáticos, control de divisas por país, reportes de EBITDA y recordatorios masivos motivadores.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-3.5 py-2 text-center backdrop-blur-md">
                <span className="block text-[10px] text-pink-200 font-bold uppercase">Activas</span>
                <span className="text-xl font-black text-white">{alumnas.filter((a) => a.activa === 1).length}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-3.5 py-2 text-center backdrop-blur-md">
                <span className="block text-[10px] text-pink-200 font-bold uppercase">Facturado</span>
                <span className="text-xl font-black text-white">${dashboardData.totalIngresosUSD.toFixed(0)} <span className="text-xs font-normal">USD</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex overflow-x-auto rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xs gap-1">
          {[
            { id: 'alumnas', label: '👥 Alumnas', count: alumnas.length },
            { id: 'vencimientos', label: '⏰ Vencimientos', badge: alertasVencimiento.filter((a) => a.estado === 'VENCE_HOY' || a.estado === 'VENCIDO').length },
            { id: 'recordatorios', label: '✉️ Recordatorios' },
            { id: 'ingresos', label: '💵 Ingresos', count: ingresos.length },
            { id: 'egresos', label: '📉 Egresos', count: egresos.length },
            { id: 'dashboard', label: '📊 Métricas & P&L' },
            { id: 'paises', label: '🌍 Países & Divisas', count: paises.length },
            { id: 'seguridad', label: '🔐 Clave' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as typeof tab)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                tab === item.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${tab === item.id ? 'bg-white/30 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  {item.count}
                </span>
              )}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.2 text-[10px] font-bold text-white animate-bounce">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* PESTAÑA: ALUMNAS                                               */}
        {/* ============================================================== */}
        {tab === 'alumnas' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex flex-1 flex-wrap gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, código, email, WhatsApp..."
                    value={busquedaAlumnas}
                    onChange={(e) => setBusquedaAlumnas(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-rose-600"
                  />
                </div>

                <select
                  value={filtroPaisAlumnas}
                  onChange={(e) => setFiltroPaisAlumnas(e.target.value)}
                  className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs outline-none"
                >
                  <option value="todos">🌍 Todos los países</option>
                  {paises.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.bandera} {p.nombre}
                    </option>
                  ))}
                </select>

                <select
                  value={filtroMonedaAlumnas}
                  onChange={(e) => setFiltroMonedaAlumnas(e.target.value)}
                  className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs outline-none"
                >
                  <option value="todas">🪙 Todas las monedas</option>
                  {monedasDisponibles.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <select
                  value={filtroEstadoAlumnas}
                  onChange={(e) => setFiltroEstadoAlumnas(e.target.value as typeof filtroEstadoAlumnas)}
                  className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs outline-none font-semibold"
                >
                  <option value="todos">Estado: Todos</option>
                  <option value="activas">✅ Solo Activas ({alumnas.filter((a) => a.activa === 1).length})</option>
                  <option value="inactivas">⏸️ Solo Inactivas ({alumnas.filter((a) => a.activa === 0).length})</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setAlumnaEdit(null);
                  setFormCod((alumnas.length + 1).toString().padStart(4, '0'));
                  setFormNombre('');
                  setFormEmail('');
                  setFormTel('');
                  setFormPais(1);
                  setFormMoneda('USD');
                  setFormCuota(40);
                  setFormDia(1);
                  setFormActiva(1);
                  setFormNotas('');
                  setModalAlumna(true);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
              >
                <Plus size={15} />
                <span>Nueva Alumna</span>
              </button>
            </div>

            {/* Listado de Alumnas */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 bg-stone-50 font-bold text-stone-600">
                    <tr>
                      <th className="py-3 px-3.5">Cód</th>
                      <th className="py-3 px-3.5">Alumna</th>
                      <th className="py-3 px-3.5">Correo</th>
                      <th className="py-3 px-3.5">País</th>
                      <th className="py-3 px-3.5">Cuota Pactada</th>
                      <th className="py-3 px-3.5">Día Cobro</th>
                      <th className="py-3 px-3.5">Contacto</th>
                      <th className="py-3 px-3.5">Estado</th>
                      <th className="py-3 px-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {alumnasFiltradas.map((a) => {
                      const pais = mapaPaises.get(a.pais_id);
                      const cuota = a.cuota_mensual || (a.moneda_preferida === 'ARS' ? 40000 : 40);
                      const sim = a.moneda_preferida === 'EUR' ? '€' : '$';

                      return (
                        <tr key={a.codigo} className={`hover:bg-stone-50/80 transition ${a.activa === 0 ? 'bg-stone-50/50 opacity-70' : ''}`}>
                          <td className="py-3 px-3.5 font-mono font-bold text-rose-600">
                            {a.codigo}
                          </td>
                          <td className="py-3 px-3.5 font-bold text-stone-900">
                            {a.nombre_completo}
                          </td>
                          <td className="py-3 px-3.5 text-stone-500">
                            {a.email ? (
                              <a href={`mailto:${a.email}`} className="hover:text-rose-600 hover:underline">
                                {a.email}
                              </a>
                            ) : (
                              <span className="text-stone-300 italic">Sin email</span>
                            )}
                          </td>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="mr-1">{pais?.bandera || '🌍'}</span>
                            <span className="text-stone-700">{pais?.nombre}</span>
                          </td>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="font-bold text-stone-900">
                              {sim}{cuota.toLocaleString('es-ES')}
                            </span>
                            <span className="ml-1 text-[10px] text-stone-400 font-semibold">{a.moneda_preferida}</span>
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-stone-800">
                            Día {a.dia_de_pago}
                          </td>
                          <td className="py-3 px-3.5 whitespace-nowrap space-y-0.5">
                            {a.telefono_whatsapp && (
                              <a
                                href={`https://wa.me/${a.telefono_whatsapp.replace(/[^\d]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 font-semibold text-emerald-600 hover:underline"
                              >
                                <MessageCircle size={13} />
                                <span>{a.telefono_whatsapp}</span>
                              </a>
                            )}
                          </td>
                          <td className="py-3 px-3.5">
                            <button
                              onClick={() => {
                                const nuevoEstado = a.activa === 1 ? 0 : 1;
                                setAlumnas((prev) =>
                                  prev.map((x) => (x.codigo === a.codigo ? { ...x, activa: nuevoEstado } : x))
                                );
                              }}
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer transition ${
                                a.activa === 1
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                              }`}
                              title="Haz clic para alternar Activa / Inactiva"
                            >
                              {a.activa === 1 ? '✅ Activa' : '⏸️ Inactiva'}
                            </button>
                          </td>
                          <td className="py-3 px-3.5 text-right whitespace-nowrap space-x-1">
                            <button
                              onClick={() => {
                                setAlumnaEdit(a);
                                setFormCod(a.codigo);
                                setFormNombre(a.nombre_completo);
                                setFormEmail(a.email || '');
                                setFormTel(a.telefono_whatsapp || '');
                                setFormPais(a.pais_id);
                                setFormMoneda(a.moneda_preferida);
                                setFormCuota(a.cuota_mensual || (a.moneda_preferida === 'ARS' ? 40000 : 40));
                                setFormDia(a.dia_de_pago);
                                setFormActiva(a.activa);
                                setFormNotas(a.notas || '');
                                setModalAlumna(true);
                              }}
                              className="rounded-lg bg-stone-100 p-1.5 text-stone-700 hover:bg-stone-200"
                              title="Editar Alumna"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Seguro que deseas eliminar a ${a.nombre_completo}?`)) {
                                  setAlumnas((prev) => prev.filter((x) => x.codigo !== a.codigo));
                                }
                              }}
                              className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                              title="Eliminar Alumna"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: VENCIMIENTOS & CICLOS DE COBRO                       */}
        {/* ============================================================== */}
        {tab === 'vencimientos' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <div>
                <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle size={15} />
                  <span>Ciclos de Cobro & Vencimientos Inteligentes</span>
                </h3>
                <p className="mt-0.5 text-[11px] text-amber-800">
                  Detección automática de fechas de pago. Ordena por día, nombre o país y envía recordatorios motivadores.
                </p>
              </div>

              <button
                onClick={() => setTab('recordatorios')}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 shrink-0"
              >
                <Send size={14} />
                <span>⚡ Enviar Recordatorios Masivos</span>
              </button>
            </div>

            {/* Barra de Filtros y Ordenamiento */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-stone-200 bg-white p-3 shadow-xs">
              <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar en vencimientos..."
                  value={busquedaVenc}
                  onChange={(e) => setBusquedaVenc(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white pl-8 pr-3 py-1.5 text-xs outline-none focus:border-rose-600"
                />
              </div>

              {/* Filtro Estado */}
              <select
                value={filtroEstadoVenc}
                onChange={(e) => setFiltroEstadoVenc(e.target.value as typeof filtroEstadoVenc)}
                className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs outline-none font-semibold text-stone-700"
              >
                <option value="todos">Todos los vencimientos</option>
                <option value="urgentes">🚨 Solo Urgentes (Vencidas + Hoy)</option>
                <option value="vencido">⚠️ Solo Vencidas</option>
                <option value="vence_hoy">⏰ Solo Vence Hoy</option>
                <option value="proximo">⏳ Próximas (7 días)</option>
                <option value="al_dia">✅ Al Día</option>
              </select>

              {/* Ordenamiento */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
                  <ArrowUpDown size={13} /> Orden:
                </span>
                <button
                  onClick={() => setOrdenVenc('urgencia')}
                  className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                    ordenVenc === 'urgencia' ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Urgencia
                </button>
                <button
                  onClick={() => setOrdenVenc('dia')}
                  className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                    ordenVenc === 'dia' ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Día (1-31)
                </button>
                <button
                  onClick={() => setOrdenVenc('nombre')}
                  className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                    ordenVenc === 'nombre' ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Nombre
                </button>
                <button
                  onClick={() => setOrdenVenc('pais')}
                  className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                    ordenVenc === 'pais' ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  País
                </button>
              </div>
            </div>

            {/* Grid de Tarjetas de Vencimiento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {alertasVencimiento.map((item) => {
                const al = item.alumna;
                const pais = item.pais;
                const esUrgente = item.estado === 'VENCE_HOY' || item.estado === 'VENCIDO';

                return (
                  <div
                    key={al.codigo}
                    className={`rounded-2xl border p-4 flex flex-col justify-between shadow-xs transition ${
                      esUrgente
                        ? 'border-red-300 bg-red-50/40'
                        : item.estado === 'PROXIMO'
                        ? 'border-amber-300 bg-amber-50/40'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-rose-600">{al.codigo}</span>
                            {al.activa === 0 && (
                              <span className="rounded-md bg-stone-200 px-1.5 py-0.2 text-[9px] font-bold text-stone-600">Inactiva</span>
                            )}
                          </div>
                          <h4 className="font-bold text-stone-900 text-sm">{al.nombre_completo}</h4>
                          <span className="text-xs text-stone-500">{pais?.bandera} {pais?.nombre}</span>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            item.estado === 'VENCE_HOY'
                              ? 'bg-red-500 text-white animate-pulse'
                              : item.estado === 'VENCIDO'
                              ? 'bg-red-100 text-red-800'
                              : item.estado === 'PROXIMO'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.estado === 'VENCE_HOY'
                            ? '🚨 Vence Hoy'
                            : item.estado === 'VENCIDO'
                            ? `⚠️ Venció hace ${Math.abs(item.diasRestantes)}d`
                            : item.estado === 'PROXIMO'
                            ? `⏳ Vence en ${item.diasRestantes}d`
                            : '✅ Al Día'}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-2.5">
                        <div className="flex justify-between">
                          <span>Día de renovación:</span>
                          <strong className="text-stone-900">Día {item.diaCobro} de cada mes</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Cuota mensual:</span>
                          <strong className="text-rose-600 font-bold">
                            {item.moneda === 'EUR' ? '€' : '$'}{item.montoEst.toLocaleString('es-ES')} {item.moneda}
                          </strong>
                        </div>
                        {al.email && (
                          <div className="flex justify-between text-[11px] text-stone-500">
                            <span>Email:</span>
                            <span className="truncate max-w-[150px]">{al.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-1.5">
                      <button
                        onClick={() => abrirModalMsg(al, item.montoEst, item.moneda, item.diaCobro, item.diasRestantes, item.estado)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                      >
                        <MessageCircle size={14} />
                        <span>Recordatorio</span>
                      </button>
                      {al.email && (
                        <a
                          href={`mailto:${al.email}?subject=Recordatorio TotalHIIT&body=${encodeURIComponent(
                            construirMensaje(plantillaMsg, al, item.montoEst, item.moneda, item.diaCobro, item.diasRestantes, item.estado)
                          )}`}
                          className="rounded-xl border border-stone-200 bg-stone-50 p-2 text-stone-700 hover:bg-stone-100 transition flex items-center justify-center"
                          title="Enviar por Correo"
                        >
                          <Mail size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: CENTRO DE RECORDATORIOS MASIVOS & PLANTILLAS          */}
        {/* ============================================================== */}
        {tab === 'recordatorios' && (
          <div className="space-y-4">
            {/* Cabecera y Personalización de Plantilla */}
            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <Send size={16} className="text-rose-600" />
                    <span>Centro de Envío de Recordatorios de Pago</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Mensajes motivadores de salud +40. Personaliza el texto, filtra por ciclo de cobro y envía masiva o individualmente.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setTextoPlantillaTemp(plantillaMsg);
                    setModalEditarPlantilla(true);
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                >
                  <Edit2 size={13} />
                  <span>Personalizar Mensaje de Cobro</span>
                </button>
              </div>

              {/* Vista Previa de la Plantilla Actual */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5 text-xs text-stone-700">
                <span className="block font-bold text-[11px] text-stone-500 uppercase tracking-wide mb-1">
                  Plantilla Activa (Variables dinámicas aplicadas en el envío):
                </span>
                <p className="whitespace-pre-line leading-relaxed font-sans text-stone-600 line-clamp-3">
                  {plantillaMsg}
                </p>
              </div>
            </div>

            {/* Panel de Selección y Filtro por Ciclo de Pago */}
            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                    <Filter size={14} /> Filtrar Destinatarias:
                  </span>
                  <select
                    value={filtroLoteVenc}
                    onChange={(e) => setFiltroLoteVenc(e.target.value as typeof filtroLoteVenc)}
                    className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold outline-none text-stone-800"
                  >
                    <option value="todos">Todas las Alumnas Activas</option>
                    <option value="vencidas">🚨 Solo Vencidas (cobro pendiente)</option>
                    <option value="vence_hoy">⏰ Solo las que Vencen Hoy</option>
                    <option value="proximos_7d">⏳ Próximas a vencer (próximos 7 días)</option>
                    <option value="dia_especifico">📅 Filtrar por Día exacto de pago...</option>
                  </select>

                  {filtroLoteVenc === 'dia_especifico' && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-stone-500">Día:</span>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={diaFiltroLote}
                        onChange={(e) => setDiaFiltroLote(Number(e.target.value))}
                        className="w-16 rounded-xl border border-stone-300 px-2 py-1 text-xs text-center font-bold"
                      />
                    </div>
                  )}
                </div>

                {/* Contador y Acciones Masivas */}
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
                    Seleccionadas: {alumnasSeleccionadas.size} de {alumnasParaRecordatorios.length}
                  </span>

                  <button
                    onClick={() => {
                      if (alumnasSeleccionadas.size === alumnasParaRecordatorios.length) {
                        setAlumnasSeleccionadas(new Set());
                      } else {
                        const todos = new Set<string>();
                        alumnasParaRecordatorios.forEach((i) => todos.add(i.alumna.codigo));
                        setAlumnasSeleccionadas(todos);
                      }
                    }}
                    className="flex items-center gap-1 rounded-xl border border-stone-300 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-50"
                  >
                    {alumnasSeleccionadas.size === alumnasParaRecordatorios.length ? (
                      <>
                        <Square size={13} /> Deseleccionar
                      </>
                    ) : (
                      <>
                        <CheckSquare size={13} /> Seleccionar Todas
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Botón de Envío Rápido Guiado */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4">
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">Envío Rápido Individual & Masivo</h4>
                  <p className="text-[11px] text-emerald-800">
                    WhatsApp bloquea la apertura simultánea de múltiples pestañas. Puedes enviar a cada alumna con su botón directo o pulsar el botón siguiente para avanzar alumna por alumna.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const pendiente = alumnasParaRecordatorios.find(
                      (item) => alumnasSeleccionadas.has(item.alumna.codigo) && !enviadosSesion.has(item.alumna.codigo)
                    );
                    if (!pendiente) {
                      alert('¡Todas las alumnas seleccionadas ya recibieron su mensaje en esta sesión!');
                      return;
                    }
                    const al = pendiente.alumna;
                    const tel = (al.telefono_whatsapp || '').replace(/[^\d]/g, '');
                    const msg = construirMensaje(plantillaMsg, al, pendiente.montoEst, pendiente.moneda, pendiente.diaCobro, pendiente.diasRestantes, pendiente.estado);

                    if (tel) {
                      window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, '_blank');
                    } else if (al.email) {
                      window.location.href = `mailto:${al.email}?subject=Recordatorio TotalHIIT&body=${encodeURIComponent(msg)}`;
                    } else {
                      alert(`La alumna ${al.nombre_completo} no tiene teléfono ni email registrado.`);
                    }

                    setEnviadosSesion((prev) => new Set(prev).add(al.codigo));
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition shrink-0"
                >
                  <Send size={14} />
                  <span>🚀 Abrir Siguiente Recordatorio Pendiente</span>
                </button>
              </div>

              {/* Tabla de Alumnas con Checkboxes y Envío Individual */}
              <div className="overflow-hidden rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 bg-stone-50 font-bold text-stone-600">
                    <tr>
                      <th className="py-3 px-3.5 w-10 text-center">Sel</th>
                      <th className="py-3 px-3.5">Cód</th>
                      <th className="py-3 px-3.5">Alumna</th>
                      <th className="py-3 px-3.5">País</th>
                      <th className="py-3 px-3.5">Día Cobro</th>
                      <th className="py-3 px-3.5">Cuota</th>
                      <th className="py-3 px-3.5">Estado Vencimiento</th>
                      <th className="py-3 px-3.5">Estado Envío</th>
                      <th className="py-3 px-3.5 text-right">Enviar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {alumnasParaRecordatorios.map((item) => {
                      const al = item.alumna;
                      const pais = item.pais;
                      const estaSel = alumnasSeleccionadas.has(al.codigo);
                      const yaEnviado = enviadosSesion.has(al.codigo);

                      return (
                        <tr key={al.codigo} className={`hover:bg-stone-50/80 transition ${estaSel ? 'bg-rose-50/20' : ''}`}>
                          <td className="py-3 px-3.5 text-center">
                            <input
                              type="checkbox"
                              checked={estaSel}
                              onChange={() => {
                                const nuevo = new Set(alumnasSeleccionadas);
                                if (estaSel) nuevo.delete(al.codigo);
                                else nuevo.add(al.codigo);
                                setAlumnasSeleccionadas(nuevo);
                              }}
                              className="h-4 w-4 rounded accent-rose-600 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-3.5 font-mono font-bold text-rose-600">{al.codigo}</td>
                          <td className="py-3 px-3.5 font-bold text-stone-900">{al.nombre_completo}</td>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="mr-1">{pais?.bandera}</span>
                            <span>{pais?.nombre}</span>
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-stone-800">Día {item.diaCobro}</td>
                          <td className="py-3 px-3.5 font-bold text-stone-900 whitespace-nowrap">
                            {item.moneda === 'EUR' ? '€' : '$'}{item.montoEst.toLocaleString('es-ES')} {item.moneda}
                          </td>
                          <td className="py-3 px-3.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                item.estado === 'VENCE_HOY'
                                  ? 'bg-red-500 text-white'
                                  : item.estado === 'VENCIDO'
                                  ? 'bg-red-100 text-red-800'
                                  : item.estado === 'PROXIMO'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {item.estado === 'VENCE_HOY' ? 'Vence Hoy' : item.estado === 'VENCIDO' ? 'Vencida' : item.estado === 'PROXIMO' ? 'Próxima' : 'Al Día'}
                            </span>
                          </td>
                          <td className="py-3 px-3.5">
                            {yaEnviado ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                <CheckCircle2 size={11} /> Enviado
                              </span>
                            ) : (
                              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-500">
                                Pendiente
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3.5 text-right whitespace-nowrap space-x-1">
                            <button
                              onClick={() => {
                                const tel = (al.telefono_whatsapp || '').replace(/[^\d]/g, '');
                                const msg = construirMensaje(plantillaMsg, al, item.montoEst, item.moneda, item.diaCobro, item.diasRestantes, item.estado);
                                if (tel) {
                                  window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, '_blank');
                                  setEnviadosSesion((prev) => new Set(prev).add(al.codigo));
                                } else {
                                  alert('Alumna sin teléfono WhatsApp configurado.');
                                }
                              }}
                              className="rounded-lg bg-emerald-50 px-2 py-1 text-emerald-700 font-bold hover:bg-emerald-100"
                              title="Enviar por WhatsApp"
                            >
                              <MessageCircle size={13} className="inline mr-1" />
                              WhatsApp
                            </button>
                            {al.email && (
                              <a
                                href={`mailto:${al.email}?subject=Recordatorio TotalHIIT&body=${encodeURIComponent(
                                  construirMensaje(plantillaMsg, al, item.montoEst, item.moneda, item.diaCobro, item.diasRestantes, item.estado)
                                )}`}
                                onClick={() => setEnviadosSesion((prev) => new Set(prev).add(al.codigo))}
                                className="rounded-lg bg-stone-100 px-2 py-1 text-stone-700 font-bold hover:bg-stone-200"
                                title="Enviar por Email"
                              >
                                <Mail size={13} className="inline mr-1" />
                                Email
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: INGRESOS                                              */}
        {/* ============================================================== */}
        {tab === 'ingresos' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Registro & Filtro de Ingresos</h3>
                <p className="text-xs text-stone-500">
                  Cuotas de alumnas, contrataciones de App, patrocinios de marca y otros ingresos.
                </p>
              </div>
              <button
                onClick={() => setModalIngreso(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs"
              >
                <Plus size={15} />
                <span>Registrar Ingreso</span>
              </button>
            </div>

            {/* Barra de Filtros Múltiples */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 rounded-2xl border border-stone-200 bg-white p-3 shadow-xs">
              {/* Buscador Ingresos */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Buscar Concepto / Marca</label>
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={busquedaIngresos}
                    onChange={(e) => setBusquedaIngresos(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white pl-7 pr-2 py-2 text-xs outline-none focus:border-rose-600"
                  />
                </div>
              </div>
              {/* Filtro Mes */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Mes / Período</label>
                <select
                  value={filtroIngMes}
                  onChange={(e) => setFiltroIngMes(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none"
                >
                  <option value="todos">Todos los meses</option>
                  {mesesDisponibles.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Filtro Moneda */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Moneda</label>
                <select
                  value={filtroIngMoneda}
                  onChange={(e) => setFiltroIngMoneda(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none"
                >
                  <option value="todas">Todas las monedas</option>
                  {monedasDisponibles.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Filtro País */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">País</label>
                <select
                  value={filtroIngPais}
                  onChange={(e) => setFiltroIngPais(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none"
                >
                  <option value="todos">Todos los países</option>
                  {paises.map((p) => (
                    <option key={p.id} value={p.id}>{p.bandera} {p.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Filtro Tipo */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Tipo de Ingreso</label>
                <select
                  value={filtroIngTipo}
                  onChange={(e) => setFiltroIngTipo(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none"
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="CUOTA_ALUMNA">Cuotas Alumnas</option>
                  <option value="CONTRATACION_APP">Contratación App</option>
                  <option value="COLABORACION_MARCA">Colaboraciones Marcas</option>
                  <option value="OTRO_INGRESO">Otros Ingresos</option>
                </select>
              </div>

              {/* Filtro Alumna */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Alumna Específica</label>
                <select
                  value={filtroIngAlumna}
                  onChange={(e) => setFiltroIngAlumna(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none"
                >
                  <option value="todas">Todas las alumnas</option>
                  {alumnas.map((a) => (
                    <option key={a.codigo} value={a.codigo}>{a.codigo} — {a.nombre_completo}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tarjetas KPI Filtradas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3.5">
                <span className="block text-[10px] font-bold text-emerald-800 uppercase">Ingresos USD (Filtrado)</span>
                <span className="text-xl font-black text-emerald-700">${totalesIngresosFiltrados.usd.toFixed(2)}</span>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
                <span className="block text-[10px] font-bold text-stone-400 uppercase">Ingresos ARS (Filtrado)</span>
                <span className="text-xl font-black text-stone-800">${totalesIngresosFiltrados.ars.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
                <span className="block text-[10px] font-bold text-stone-400 uppercase">Cobros Registrados</span>
                <span className="text-xl font-black text-rose-600">{totalesIngresosFiltrados.cantidad}</span>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
                <span className="block text-[10px] font-bold text-stone-400 uppercase">Ticket Promedio USD</span>
                <span className="text-xl font-black text-purple-600">
                  ${totalesIngresosFiltrados.cantidad > 0 ? (totalesIngresosFiltrados.usd / totalesIngresosFiltrados.cantidad).toFixed(1) : '0.0'}
                </span>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 bg-stone-50 font-bold text-stone-600">
                    <tr>
                      <th className="py-3 px-3.5">Fecha</th>
                      <th className="py-3 px-3.5">Tipo</th>
                      <th className="py-3 px-3.5">Alumna / Marca</th>
                      <th className="py-3 px-3.5">Concepto</th>
                      <th className="py-3 px-3.5">Monto Original</th>
                      <th className="py-3 px-3.5">USD Equiv.</th>
                      <th className="py-3 px-3.5">ARS Equiv.</th>
                      <th className="py-3 px-3.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {ingresosFiltrados.map((ing) => {
                      const al = ing.alumna_codigo ? alumnas.find((a) => a.codigo === ing.alumna_codigo) : null;
                      const pais = al ? mapaPaises.get(al.pais_id) : null;

                      return (
                        <tr key={ing.id} className="hover:bg-stone-50/80 transition">
                          <td className="py-3 px-3.5 text-stone-500 whitespace-nowrap">{ing.fecha_pago}</td>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                              {ing.tipo_ingreso === 'CUOTA_ALUMNA' ? 'Alumna' : ing.tipo_ingreso === 'CONTRATACION_APP' ? 'App' : ing.tipo_ingreso === 'COLABORACION_MARCA' ? 'Marca' : 'Otro'}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-stone-800">
                            {al ? (
                              <span>
                                {pais?.bandera} {al.nombre_completo}
                              </span>
                            ) : (
                              ing.cliente_o_marca || '—'
                            )}
                          </td>
                          <td className="py-3 px-3.5 text-stone-600">{ing.concepto}</td>
                          <td className="py-3 px-3.5 font-bold text-stone-900 whitespace-nowrap">
                            {ing.moneda_original === 'EUR' ? '€' : '$'}{ing.monto_original.toLocaleString('es-ES')} <span className="text-[10px] text-stone-400">{ing.moneda_original}</span>
                          </td>
                          <td className="py-3 px-3.5 font-bold text-emerald-600 whitespace-nowrap">
                            ${ing.usd_equivalente.toFixed(2)}
                          </td>
                          <td className="py-3 px-3.5 text-stone-600 whitespace-nowrap">
                            ${ing.ars_equivalente.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="py-3 px-3.5 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm('¿Seguro que deseas eliminar este ingreso?')) {
                                  setIngresos((prev) => prev.filter((x) => x.id !== ing.id));
                                }
                              }}
                              className="rounded-lg p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: EGRESOS                                               */}
        {/* ============================================================== */}
        {tab === 'egresos' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Control de Egresos de la Marca</h3>
                <p className="text-xs text-stone-500">
                  Publicidad Meta/Google, reposición de equipos, software, servidores e impuestos.
                </p>
              </div>
              <button
                onClick={() => setModalEgreso(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-800 px-4 py-2 text-xs font-bold text-white hover:bg-stone-900 shadow-xs"
              >
                <Plus size={15} />
                <span>Declarar Egreso</span>
              </button>
            </div>

            {/* Barra de Filtros Egresos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 rounded-2xl border border-stone-200 bg-white p-3 shadow-xs">
              {/* Buscador Egresos */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Buscar Proveedor / Concepto</label>
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar gasto..."
                    value={busquedaEgresos}
                    onChange={(e) => setBusquedaEgresos(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white pl-7 pr-2 py-2 text-xs outline-none focus:border-rose-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Mes / Período</label>
                <select
                  value={filtroEgrMes}
                  onChange={(e) => setFiltroEgrMes(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none"
                >
                  <option value="todos">Todos los meses</option>
                  {mesesDisponibles.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Categoría de Gasto</label>
                <select
                  value={filtroEgrCat}
                  onChange={(e) => setFiltroEgrCat(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none"
                >
                  <option value="todas">Todas las categorías</option>
                  <option value="PUBLICIDAD">📢 Publicidad (Meta/Google)</option>
                  <option value="IMPUESTOS">🏛️ Impuestos & AFIP</option>
                  <option value="EQUIPOS">🎥 Reposición Equipos / Suministros</option>
                  <option value="SOFTWARE_HOSTING">💻 Software, Hosting & Cloud</option>
                  <option value="OTRO_EGRESO">📦 Otros Gastos</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Moneda</label>
                <select
                  value={filtroEgrMoneda}
                  onChange={(e) => setFiltroEgrMoneda(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none"
                >
                  <option value="todas">Todas las monedas</option>
                  {monedasDisponibles.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tarjetas KPI Egresos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="rounded-2xl border border-red-200 bg-red-50/40 p-3.5">
                <span className="block text-[10px] font-bold text-red-800 uppercase">Total Gastos USD</span>
                <span className="text-xl font-black text-red-700">${totalesEgresosFiltrados.usd.toFixed(2)}</span>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
                <span className="block text-[10px] font-bold text-stone-400 uppercase">Total Gastos ARS</span>
                <span className="text-xl font-black text-stone-800">${totalesEgresosFiltrados.ars.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5 col-span-2 sm:col-span-1">
                <span className="block text-[10px] font-bold text-stone-400 uppercase">Cantidad de Gastos</span>
                <span className="text-xl font-black text-stone-700">{totalesEgresosFiltrados.cantidad}</span>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 bg-stone-50 font-bold text-stone-600">
                    <tr>
                      <th className="py-3 px-3.5">Fecha</th>
                      <th className="py-3 px-3.5">Categoría</th>
                      <th className="py-3 px-3.5">Concepto</th>
                      <th className="py-3 px-3.5">Proveedor</th>
                      <th className="py-3 px-3.5">Monto Original</th>
                      <th className="py-3 px-3.5">USD Equiv.</th>
                      <th className="py-3 px-3.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {egresosFiltrados.map((egr) => (
                      <tr key={egr.id} className="hover:bg-stone-50/80 transition">
                        <td className="py-3 px-3.5 text-stone-500 whitespace-nowrap">{egr.fecha}</td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                            {egr.categoria}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-stone-800">{egr.concepto}</td>
                        <td className="py-3 px-3.5 text-stone-500">{egr.proveedor || '—'}</td>
                        <td className="py-3 px-3.5 font-bold text-stone-900 whitespace-nowrap">
                          ${egr.monto_original} {egr.moneda_original}
                        </td>
                        <td className="py-3 px-3.5 font-bold text-red-600 whitespace-nowrap">
                          ${egr.usd_equivalente.toFixed(2)}
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm('¿Seguro que deseas eliminar este egreso?')) {
                                setEgresos((prev) => prev.filter((x) => x.id !== egr.id));
                              }
                            }}
                            className="rounded-lg p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: DASHBOARD & REPORTES VISUALES (REQUERIMIENTO 5)        */}
        {/* ============================================================== */}
        {tab === 'dashboard' && (
          <div className="space-y-5">
            {/* Barra de Filtros del Dashboard */}
            <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <BarChart3 size={15} className="text-rose-600" />
                  <span>Filtros de Análisis Financiero</span>
                </h4>
                <button
                  onClick={() => {
                    setDashFiltroMes('todos');
                    setDashFiltroMoneda('consolidado_usd');
                    setDashFiltroPais('todos');
                    setDashFiltroTipo('todos');
                    setDashFiltroCatEgreso('todas');
                  }}
                  className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reiniciar filtros
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Mes</label>
                  <select
                    value={dashFiltroMes}
                    onChange={(e) => setDashFiltroMes(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    <option value="todos">Todos los meses</option>
                    {mesesDisponibles.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Moneda Base</label>
                  <select
                    value={dashFiltroMoneda}
                    onChange={(e) => setDashFiltroMoneda(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    <option value="consolidado_usd">Consolidado USD ($)</option>
                    <option value="consolidado_ars">Consolidado ARS ($)</option>
                    <option value="USD">Solo Transacciones USD</option>
                    <option value="EUR">Solo Transacciones EUR</option>
                    <option value="ARS">Solo Transacciones ARS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">País</label>
                  <select
                    value={dashFiltroPais}
                    onChange={(e) => setDashFiltroPais(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    <option value="todos">Todos los países</option>
                    {paises.map((p) => (
                      <option key={p.id} value={p.id}>{p.bandera} {p.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Tipo Ingreso</label>
                  <select
                    value={dashFiltroTipo}
                    onChange={(e) => setDashFiltroTipo(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    <option value="todos">Todos los ingresos</option>
                    <option value="CUOTA_ALUMNA">Cuotas Alumnas</option>
                    <option value="CONTRATACION_APP">Contrataciones App</option>
                    <option value="COLABORACION_MARCA">Colaboraciones Marcas</option>
                    <option value="OTRO_INGRESO">Otros Ingresos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Tipo Egreso</label>
                  <select
                    value={dashFiltroCatEgreso}
                    onChange={(e) => setDashFiltroCatEgreso(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    <option value="todas">Todos los egresos</option>
                    <option value="PUBLICIDAD">Publicidad</option>
                    <option value="IMPUESTOS">Impuestos</option>
                    <option value="EQUIPOS">Equipos / Suministros</option>
                    <option value="SOFTWARE_HOSTING">Software / Hosting</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tarjetas P&L Principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Ingresos Totales</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {dashboardData.cantidadIngresos} cobros
                  </span>
                </div>
                <div className="mt-2 text-2xl font-black text-emerald-700">
                  ${dashboardData.totalIngresosUSD.toFixed(2)} <span className="text-xs font-normal text-stone-500">USD</span>
                </div>
                <div className="mt-1 text-xs text-stone-500 font-mono">
                  ARS: ${dashboardData.totalIngresosARS.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className="rounded-3xl border border-red-300 bg-gradient-to-br from-red-50 to-white p-5 shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-red-800 tracking-wider">Egresos Operativos</span>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                    {dashboardData.cantidadEgresos} gastos
                  </span>
                </div>
                <div className="mt-2 text-2xl font-black text-red-700">
                  ${dashboardData.totalEgresosUSD.toFixed(2)} <span className="text-xs font-normal text-stone-500">USD</span>
                </div>
                <div className="mt-1 text-xs text-stone-500 font-mono">
                  ARS: ${dashboardData.totalEgresosARS.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className="rounded-3xl border-2 border-rose-600 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-rose-700 tracking-wider">Beneficio Neto Real (EBITDA)</span>
                  <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    Margen {dashboardData.margenEbitdaUSD.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 text-2xl font-black text-rose-600">
                  ${dashboardData.gananciaNetaUSD.toFixed(2)} <span className="text-xs font-normal text-stone-500">USD</span>
                </div>
                <div className="mt-1 text-xs text-stone-500 font-mono">
                  ARS: ${dashboardData.gananciaNetaARS.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            {/* Gráficos de Barras Visuales (Requerimiento 5) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Gráfico: Desglose de Ingresos por Tipo */}
              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-bold uppercase text-stone-800 tracking-wider flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-rose-600" />
                    <span>Ingresos por Tipo de Fuente</span>
                  </h4>
                  <span className="text-[10px] font-bold text-stone-400">Total: ${dashboardData.totalIngresosUSD.toFixed(0)} USD</span>
                </div>

                <div className="space-y-3">
                  {dashboardData.ingresosPorTipo.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-stone-800">{item.label}</span>
                        <div className="space-x-2">
                          <span className="text-stone-500 text-[11px]">({item.count} ops)</span>
                          <span className="font-bold text-stone-900">${item.usd.toFixed(2)}</span>
                          <span className="rounded-md bg-stone-100 px-1.5 py-0.2 font-mono text-[10px] font-bold text-rose-600">
                            {item.pct}%
                          </span>
                        </div>
                      </div>
                      <div className="h-3 w-full rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                          style={{ width: `${Math.max(item.pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gráfico: Desglose de Ingresos por País */}
              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-bold uppercase text-stone-800 tracking-wider flex items-center gap-1.5">
                    <Globe size={14} className="text-blue-600" />
                    <span>Distribución Geográfica de Facturación</span>
                  </h4>
                  <span className="text-[10px] font-bold text-stone-400">{dashboardData.ingresosPorPais.length} Países</span>
                </div>

                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {dashboardData.ingresosPorPais.map((p) => (
                    <div key={p.paisId} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                          <span>{p.bandera}</span>
                          <span>{p.nombre}</span>
                        </span>
                        <div className="space-x-2">
                          <span className="font-bold text-stone-900">${p.usd.toFixed(2)}</span>
                          <span className="rounded-md bg-stone-100 px-1.5 py-0.2 font-mono text-[10px] font-bold text-blue-600">
                            {p.pct}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-500"
                          style={{ width: `${Math.max(p.pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gráfico: Egresos por Categoría */}
              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-bold uppercase text-stone-800 tracking-wider flex items-center gap-1.5">
                    <DollarSign size={14} className="text-red-600" />
                    <span>Estructura de Gastos & Costos</span>
                  </h4>
                  <span className="text-[10px] font-bold text-stone-400">Total: ${dashboardData.totalEgresosUSD.toFixed(0)} USD</span>
                </div>

                <div className="space-y-3">
                  {dashboardData.egresosPorCategoria.map((cat) => (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-stone-800">{cat.label}</span>
                        <div className="space-x-2">
                          <span className="font-bold text-stone-900">${cat.usd.toFixed(2)}</span>
                          <span className="rounded-md bg-stone-100 px-1.5 py-0.2 font-mono text-[10px] font-bold text-red-600">
                            {cat.pct}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${cat.color}`}
                          style={{ width: `${Math.max(cat.pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulador de Escalabilidad Dinámico */}
              <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-xs font-bold uppercase text-stone-800 tracking-wider flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-purple-600" />
                    <span>Simulador de Escalabilidad & Crecimiento</span>
                  </h4>
                  <span className="text-[10px] font-bold text-stone-400">Ticket medio: ${dashboardData.ticketPromedioUSD.toFixed(1)} USD</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {[50, 100, 250, 500].map((cant) => {
                    const factUSD = cant * dashboardData.ticketPromedioUSD;
                    const factARS = factUSD * 1449.58;
                    const ebitdaEst = factUSD * (dashboardData.margenEbitdaUSD > 0 ? dashboardData.margenEbitdaUSD / 100 : 0.75);

                    return (
                      <div key={cant} className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50/70 p-3">
                        <div>
                          <span className="font-bold text-stone-900 text-sm">{cant} Alumnas</span>
                          <span className="block text-[11px] text-stone-500">
                            ARS ~${Math.round(factARS).toLocaleString('es-ES')} / mes
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="block text-sm font-black text-rose-600">
                            ${Math.round(factUSD).toLocaleString('es-ES')} USD/mes
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700">
                            EBITDA est: ~${Math.round(ebitdaEst).toLocaleString('es-ES')} USD
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: PAÍSES & MONEDAS (REQUERIMIENTO 2)                     */}
        {/* ============================================================== */}
        {tab === 'paises' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Globe size={16} className="text-rose-600" />
                  <span>Configuración de Países, Divisas & Tasas de Cambio</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Agrega nuevos países donde tengas alumnas y define sus monedas oficiales y equivalencias cambiarias.
                </p>
              </div>

              <button
                onClick={() => {
                  setPaisEdit(null);
                  setFormPaisNombre('');
                  setFormPaisIso('');
                  setFormPaisBandera('🌍');
                  setFormPaisMoneda('USD');
                  setFormPaisTasaUsd(1.0);
                  setFormPaisTasaArs(1449.58);
                  setModalPais(true);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs"
              >
                <Plus size={15} />
                <span>Agregar País / Moneda</span>
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-stone-200 bg-stone-50 font-bold text-stone-600">
                  <tr>
                    <th className="py-3 px-3.5">Bandera</th>
                    <th className="py-3 px-3.5">País</th>
                    <th className="py-3 px-3.5">Código ISO</th>
                    <th className="py-3 px-3.5">Moneda Oficial</th>
                    <th className="py-3 px-3.5">Tasa a USD</th>
                    <th className="py-3 px-3.5">Tasa a ARS</th>
                    <th className="py-3 px-3.5">Alumnas Activas</th>
                    <th className="py-3 px-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paises.map((p) => {
                    const cant = alumnas.filter((a) => a.pais_id === p.id).length;
                    return (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition">
                        <td className="py-3 px-3.5 text-lg">{p.bandera}</td>
                        <td className="py-3 px-3.5 font-bold text-stone-900">{p.nombre}</td>
                        <td className="py-3 px-3.5 font-mono text-stone-600">{p.codigo_iso}</td>
                        <td className="py-3 px-3.5 font-bold text-rose-600">{p.moneda_defecto}</td>
                        <td className="py-3 px-3.5 font-mono text-stone-700">1 {p.moneda_defecto} = {p.tasa_a_usd} USD</td>
                        <td className="py-3 px-3.5 font-mono text-stone-700">1 {p.moneda_defecto} = {p.tasa_a_ars} ARS</td>
                        <td className="py-3 px-3.5">
                          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                            {cant} {cant === 1 ? 'alumna' : 'alumnas'}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-right space-x-1">
                          <button
                            onClick={() => {
                              setPaisEdit(p);
                              setFormPaisNombre(p.nombre);
                              setFormPaisIso(p.codigo_iso);
                              setFormPaisBandera(p.bandera);
                              setFormPaisMoneda(p.moneda_defecto);
                              setFormPaisTasaUsd(p.tasa_a_usd);
                              setFormPaisTasaArs(p.tasa_a_ars);
                              setModalPais(true);
                            }}
                            className="rounded-lg bg-stone-100 p-1.5 text-stone-700 hover:bg-stone-200"
                            title="Editar País"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              if (cant > 0) {
                                alert(`No se puede eliminar ${p.nombre} porque tiene ${cant} alumna(s) asociada(s).`);
                                return;
                              }
                              if (window.confirm(`¿Eliminar ${p.nombre}?`)) {
                                setPaises((prev) => prev.filter((x) => x.id !== p.id));
                              }
                            }}
                            className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                            title="Eliminar País"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: SEGURIDAD & CLAVE                                     */}
        {/* ============================================================== */}
        {tab === 'seguridad' && (
          <div className="max-w-md mx-auto space-y-4">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wide text-rose-600">Cambiar Contraseña de Administrador</h4>
              <p className="mt-1 text-xs text-stone-500">Personaliza la clave de acceso para los 3 administradores.</p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (nuevaClave.trim() !== confirmarClave.trim()) {
                    setMsgSeguridad('⚠️ Las contraseñas no coinciden.');
                    return;
                  }
                  if (nuevaClave.trim().length < 6) {
                    setMsgSeguridad('⚠️ Mínimo 6 caracteres.');
                    return;
                  }
                  localStorage.setItem(LLAVE_STORAGE_CLAVE, nuevaClave.trim());
                  setMsgSeguridad('✅ Contraseña actualizada correctamente.');
                  setNuevaClave('');
                  setConfirmarClave('');
                }}
                className="mt-4 space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nueva Contraseña</label>
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres..."
                    value={nuevaClave}
                    onChange={(e) => setNuevaClave(e.target.value)}
                    required
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Confirmar Contraseña</label>
                  <input
                    type="password"
                    placeholder="Repite la contraseña..."
                    value={confirmarClave}
                    onChange={(e) => setConfirmarClave(e.target.value)}
                    required
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs outline-none focus:border-rose-600"
                  />
                </div>

                {msgSeguridad && (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-800">
                    {msgSeguridad}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700"
                >
                  Guardar Contraseña
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL ALTA / EDICIÓN ALUMNA (REQUERIMIENTO 1)                   */}
      {/* ============================================================== */}
      {modalAlumna && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-stone-900">{alumnaEdit ? 'Editar Alumna' : 'Nueva Alumna'}</h3>
              <button onClick={() => setModalAlumna(false)} className="text-stone-400 hover:text-stone-600 text-sm">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const nueva: Alumna = {
                  codigo: formCod.trim(),
                  nombre_completo: formNombre.trim(),
                  email: formEmail.trim() || undefined,
                  telefono_whatsapp: formTel.trim() || undefined,
                  pais_id: Number(formPais),
                  moneda_preferida: formMoneda,
                  cuota_mensual: Number(formCuota) || (formMoneda === 'ARS' ? 40000 : 40),
                  fecha_inicio: alumnaEdit ? alumnaEdit.fecha_inicio : '2026-06-01',
                  dia_de_pago: Number(formDia) || 1,
                  activa: Number(formActiva),
                  notas: formNotas.trim() || undefined,
                };
                setAlumnas((prev) => {
                  const sinActual = prev.filter((x) => x.codigo !== nueva.codigo);
                  return [...sinActual, nueva].sort((a, b) => a.codigo.localeCompare(b.codigo));
                });
                setModalAlumna(false);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Código</label>
                  <input
                    value={formCod}
                    onChange={(e) => setFormCod(e.target.value)}
                    required
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Estado</label>
                  <select
                    value={formActiva}
                    onChange={(e) => setFormActiva(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-bold"
                  >
                    <option value={1}>✅ Activa</option>
                    <option value={0}>⏸️ Inactiva</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Nombre Completo</label>
                <input
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  required
                  placeholder="Carolina Méndez"
                  className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Correo Electrónico (Email)</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="alumna@gmail.com"
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Teléfono WhatsApp</label>
                  <input
                    value={formTel}
                    onChange={(e) => setFormTel(e.target.value)}
                    placeholder="+1 305 555 0101"
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">País</label>
                  <select
                    value={formPais}
                    onChange={(e) => {
                      const pId = Number(e.target.value);
                      setFormPais(pId);
                      const p = mapaPaises.get(pId);
                      if (p) {
                        setFormMoneda(p.moneda_defecto);
                        if (p.moneda_defecto === 'ARS') setFormCuota(40000);
                        else setFormCuota(40);
                      }
                    }}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    {paises.map((p) => (
                      <option key={p.id} value={p.id}>{p.bandera} {p.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Moneda Preferida</label>
                  <select
                    value={formMoneda}
                    onChange={(e) => setFormMoneda(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    {monedasDisponibles.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Cuota Mensual Pactada</label>
                  <input
                    type="number"
                    value={formCuota}
                    onChange={(e) => setFormCuota(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Día de Cobro (1-31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formDia}
                    onChange={(e) => setFormDia(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Notas / Observaciones</label>
                <textarea
                  rows={2}
                  value={formNotas}
                  onChange={(e) => setFormNotas(e.target.value)}
                  placeholder="Detalles sobre entrenamiento, horarios o acuerdos especiales..."
                  className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setModalAlumna(false)}
                  className="flex-1 rounded-xl border border-stone-300 py-2.5 font-bold text-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-rose-600 py-2.5 font-bold text-white hover:bg-rose-700"
                >
                  Guardar Alumna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL ALTA / EDICIÓN PAÍS Y MONEDA (REQUERIMIENTO 2)           */}
      {/* ============================================================== */}
      {modalPais && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-stone-900">{paisEdit ? 'Editar País & Tasas' : 'Agregar Nuevo País'}</h3>
              <button onClick={() => setModalPais(false)} className="text-stone-400 hover:text-stone-600 text-sm">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const nuevo: Pais = {
                  id: paisEdit ? paisEdit.id : Date.now(),
                  nombre: formPaisNombre.trim(),
                  codigo_iso: formPaisIso.trim().toUpperCase(),
                  bandera: formPaisBandera.trim() || '🌍',
                  moneda_defecto: formPaisMoneda.trim().toUpperCase(),
                  tasa_a_usd: Number(formPaisTasaUsd) || 1.0,
                  tasa_a_ars: Number(formPaisTasaArs) || 1449.58,
                };
                setPaises((prev) => {
                  const sinActual = prev.filter((x) => x.id !== nuevo.id);
                  return [...sinActual, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre));
                });
                setModalPais(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Nombre del País</label>
                <input
                  value={formPaisNombre}
                  onChange={(e) => setFormPaisNombre(e.target.value)}
                  required
                  placeholder="ej: Colombia, España..."
                  className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Código ISO (2 letras)</label>
                  <input
                    value={formPaisIso}
                    onChange={(e) => setFormPaisIso(e.target.value)}
                    required
                    maxLength={2}
                    placeholder="CO, ES, US..."
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Bandera (Emoji)</label>
                  <input
                    value={formPaisBandera}
                    onChange={(e) => setFormPaisBandera(e.target.value)}
                    required
                    placeholder="🇨🇴, 🇪🇸, 🇺🇸..."
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs text-center text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Moneda Oficial / Defecto</label>
                <input
                  value={formPaisMoneda}
                  onChange={(e) => setFormPaisMoneda(e.target.value)}
                  required
                  placeholder="COP, EUR, USD, ARS..."
                  className="w-full rounded-xl border border-stone-300 p-2 text-xs uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Tasa a USD (1 {formPaisMoneda} = ? USD)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formPaisTasaUsd}
                    onChange={(e) => setFormPaisTasaUsd(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Tasa a ARS (1 {formPaisMoneda} = ? ARS)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPaisTasaArs}
                    onChange={(e) => setFormPaisTasaArs(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setModalPais(false)}
                  className="flex-1 rounded-xl border border-stone-300 py-2.5 font-bold text-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-rose-600 py-2.5 font-bold text-white hover:bg-rose-700"
                >
                  Guardar País
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL PERSONALIZAR PLANTILLA RECORDATORIO (REQUERIMIENTO 6)     */}
      {/* ============================================================== */}
      {modalEditarPlantilla && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-stone-900">Personalizar Mensaje de Recordatorio</h3>
              <button onClick={() => setModalEditarPlantilla(false)} className="text-stone-400 hover:text-stone-600 text-sm">✕</button>
            </div>

            <p className="text-xs text-stone-500">
              Personaliza el mensaje que se enviará a las alumnas. Puedes usar las siguientes etiquetas dinámicas:
            </p>

            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {['{nombre}', '{monto}', '{moneda}', '{dia_cobro}', '{dias_restantes}', '{estado_detalle}', '{enlace_pago}'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTextoPlantillaTemp((prev) => `${prev} ${tag}`)}
                  className="rounded-lg bg-stone-100 px-2 py-1 font-mono font-bold text-rose-600 hover:bg-rose-50 border border-stone-200"
                >
                  + {tag}
                </button>
              ))}
            </div>

            <textarea
              rows={12}
              value={textoPlantillaTemp}
              onChange={(e) => setTextoPlantillaTemp(e.target.value)}
              className="w-full rounded-2xl border border-stone-300 p-3 text-xs leading-relaxed outline-none focus:border-rose-600 font-sans"
            />

            <div className="flex items-center justify-between pt-2 border-t">
              <button
                type="button"
                onClick={() => setTextoPlantillaTemp(PLANTILLA_RECORDATORIO_DEFECTO)}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1"
              >
                <RotateCcw size={13} /> Restaurar plantilla original
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalEditarPlantilla(false)}
                  className="rounded-xl border border-stone-300 px-4 py-2 font-bold text-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlantillaMsg(textoPlantillaTemp);
                    setModalEditarPlantilla(false);
                  }}
                  className="rounded-xl bg-rose-600 px-4 py-2 font-bold text-white hover:bg-rose-700"
                >
                  Guardar Plantilla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL MENSAJE INDIVIDUAL                                       */}
      {/* ============================================================== */}
      {modalMsg && alumnaMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-stone-900">Recordatorio: {alumnaMsg.nombre_completo}</h3>
              <button onClick={() => setModalMsg(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <textarea
              rows={10}
              value={textoMsg}
              onChange={(e) => setTextoMsg(e.target.value)}
              className="w-full rounded-2xl border border-stone-300 p-3 text-xs leading-relaxed outline-none focus:border-rose-600"
            />

            <div className="flex flex-col gap-2">
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(textoMsg);
                    setCopiado(true);
                    setTimeout(() => setCopiado(false), 2000);
                  } catch {}
                }}
                className="w-full rounded-xl border border-stone-300 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-1.5"
              >
                {copiado ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiado ? '¡Mensaje Copiado!' : 'Copiar Mensaje'}</span>
              </button>

              {alumnaMsg.telefono_whatsapp && (
                <a
                  href={`https://wa.me/${alumnaMsg.telefono_whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(textoMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-xl bg-emerald-600 py-2.5 text-center text-xs font-bold text-white hover:bg-emerald-700 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={15} />
                  <span>Abrir en WhatsApp</span>
                </a>
              )}

              {alumnaMsg.email && (
                <a
                  href={`mailto:${alumnaMsg.email}?subject=Recordatorio TotalHIIT&body=${encodeURIComponent(textoMsg)}`}
                  className="w-full rounded-xl bg-stone-100 py-2 text-center text-xs font-bold text-stone-800 hover:bg-stone-200 flex items-center justify-center gap-1.5"
                >
                  <Mail size={15} />
                  <span>Abrir en Correo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL REGISTRAR INGRESO                                        */}
      {/* ============================================================== */}
      {modalIngreso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-stone-900">Registrar Ingreso</h3>
              <button onClick={() => setModalIngreso(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const monto = Number(ingMonto) || 0;
                const nuevo: Ingreso = {
                  id: `ing-${Date.now()}`,
                  tipo_ingreso: ingTipo,
                  alumna_codigo: ingTipo === 'CUOTA_ALUMNA' ? ingAlumnaCod : undefined,
                  cliente_o_marca: ingTipo !== 'CUOTA_ALUMNA' ? ingClienteMarca : undefined,
                  concepto: ingConcepto,
                  fecha_pago: ingFecha,
                  moneda_original: ingMoneda,
                  monto_original: monto,
                  tasa_a_usd: ingTasaUsd,
                  tasa_a_ars: ingTasaArs,
                  usd_equivalente: Math.round(monto * ingTasaUsd * 100) / 100,
                  ars_equivalente: Math.round(monto * ingTasaArs * 100) / 100,
                  mes_periodo: Number(ingFecha.split('-')[1]) || 6,
                  anio_periodo: Number(ingFecha.split('-')[0]) || 2026,
                  metodo_pago: ingMetodo,
                  estado: 'APROBADO',
                };
                setIngresos((prev) => [nuevo, ...prev]);
                setModalIngreso(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Tipo de Ingreso</label>
                <select
                  value={ingTipo}
                  onChange={(e) => setIngTipo(e.target.value as typeof ingTipo)}
                  className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                >
                  <option value="CUOTA_ALUMNA">Cuota de Alumna</option>
                  <option value="CONTRATACION_APP">Contratación de App</option>
                  <option value="COLABORACION_MARCA">Colaboración con Marca</option>
                  <option value="OTRO_INGRESO">Otro Ingreso</option>
                </select>
              </div>

              {ingTipo === 'CUOTA_ALUMNA' ? (
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Alumna</label>
                  <select
                    value={ingAlumnaCod}
                    onChange={(e) => {
                      const cod = e.target.value;
                      setIngAlumnaCod(cod);
                      const al = alumnas.find((a) => a.codigo === cod);
                      if (al) {
                        setIngMoneda(al.moneda_preferida);
                        setIngMonto(al.cuota_mensual || (al.moneda_preferida === 'ARS' ? 40000 : 40));
                        const p = mapaPaises.get(al.pais_id);
                        if (p) {
                          setIngTasaUsd(p.tasa_a_usd);
                          setIngTasaArs(p.tasa_a_ars);
                        }
                      }
                    }}
                    required
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    <option value="">Selecciona alumna...</option>
                    {alumnas.map((a) => (
                      <option key={a.codigo} value={a.codigo}>{a.codigo} — {a.nombre_completo}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Empresa / Marca</label>
                  <input
                    value={ingClienteMarca}
                    onChange={(e) => setIngClienteMarca(e.target.value)}
                    required
                    placeholder="Marca de Suplementos..."
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Concepto</label>
                <input
                  value={ingConcepto}
                  onChange={(e) => setIngConcepto(e.target.value)}
                  required
                  placeholder="Cuota Mensual TotalHIIT"
                  className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Fecha</label>
                  <input
                    type="date"
                    value={ingFecha}
                    onChange={(e) => setIngFecha(e.target.value)}
                    required
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Método</label>
                  <select
                    value={ingMetodo}
                    onChange={(e) => setIngMetodo(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    <option value="Transferencia">Transferencia</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Stripe">Stripe</option>
                    <option value="MercadoPago">MercadoPago</option>
                    <option value="Efectivo">Efectivo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Monto</label>
                  <input
                    type="number"
                    value={ingMonto}
                    onChange={(e) => setIngMonto(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Moneda</label>
                  <select
                    value={ingMoneda}
                    onChange={(e) => {
                      const m = e.target.value;
                      setIngMoneda(m);
                      const p = paises.find((x) => x.moneda_defecto === m);
                      if (p) {
                        setIngTasaUsd(p.tasa_a_usd);
                        setIngTasaArs(p.tasa_a_ars);
                      }
                    }}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    {monedasDisponibles.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-1 border-t">
                <button
                  type="button"
                  onClick={() => setModalIngreso(false)}
                  className="flex-1 rounded-xl border border-stone-300 py-2 font-bold text-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-rose-600 py-2 font-bold text-white hover:bg-rose-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL REGISTRAR EGRESO                                         */}
      {/* ============================================================== */}
      {modalEgreso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-stone-900">Declarar Egreso</h3>
              <button onClick={() => setModalEgreso(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const monto = Number(egrMonto) || 0;
                const nuevo: Egreso = {
                  id: `egr-${Date.now()}`,
                  categoria: egrCat,
                  concepto: egrConcepto,
                  fecha: egrFecha,
                  proveedor: egrProv,
                  moneda_original: egrMoneda,
                  monto_original: monto,
                  tasa_a_usd: egrTasaUsd,
                  tasa_a_ars: egrTasaArs,
                  usd_equivalente: Math.round(monto * egrTasaUsd * 100) / 100,
                  ars_equivalente: Math.round(monto * egrTasaArs * 100) / 100,
                  mes_periodo: Number(egrFecha.split('-')[1]) || 6,
                  anio_periodo: Number(egrFecha.split('-')[0]) || 2026,
                  metodo_pago: 'Tarjeta',
                };
                setEgresos((prev) => [nuevo, ...prev]);
                setModalEgreso(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Categoría</label>
                <select
                  value={egrCat}
                  onChange={(e) => setEgrCat(e.target.value as typeof egrCat)}
                  className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                >
                  <option value="PUBLICIDAD">📢 Publicidad (Meta/Google)</option>
                  <option value="IMPUESTOS">🏛️ Impuestos</option>
                  <option value="EQUIPOS">🎥 Reposición Equipos / Suministros</option>
                  <option value="SOFTWARE_HOSTING">💻 Software / Hosting</option>
                  <option value="OTRO_EGRESO">📦 Otros Gastos</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Concepto</label>
                <input
                  value={egrConcepto}
                  onChange={(e) => setEgrConcepto(e.target.value)}
                  required
                  placeholder="Micrófono inalámbrico, Meta Ads..."
                  className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Proveedor</label>
                  <input
                    value={egrProv}
                    onChange={(e) => setEgrProv(e.target.value)}
                    placeholder="Meta Ads, Amazon..."
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Fecha</label>
                  <input
                    type="date"
                    value={egrFecha}
                    onChange={(e) => setEgrFecha(e.target.value)}
                    required
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Monto</label>
                  <input
                    type="number"
                    value={egrMonto}
                    onChange={(e) => setEgrMonto(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Moneda</label>
                  <select
                    value={egrMoneda}
                    onChange={(e) => {
                      const m = e.target.value;
                      setEgrMoneda(m);
                      const p = paises.find((x) => x.moneda_defecto === m);
                      if (p) {
                        setEgrTasaUsd(p.tasa_a_usd);
                        setEgrTasaArs(p.tasa_a_ars);
                      }
                    }}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    {monedasDisponibles.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-1 border-t">
                <button
                  type="button"
                  onClick={() => setModalEgreso(false)}
                  className="flex-1 rounded-xl border border-stone-300 py-2 font-bold text-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-stone-800 py-2 font-bold text-white hover:bg-stone-900"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
