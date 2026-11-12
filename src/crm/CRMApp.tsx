import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  Calendar,
  CheckCircle2,
  CheckSquare,
  ClipboardList,
  Cloud,
  CloudOff,
  Copy,
  DollarSign,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Filter,
  Globe,
  History,
  LogOut,
  Mail,
  MessageCircle,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Square,
  Trash2,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import {
  consultarDolarApi,
  cargarHistorialCotizaciones,
  obtenerCotizacionParaFecha,
  SnapshotCotizacion,
} from './cotizaciones';
import { exportarAExcel, exportarAPDF } from './exportador';
import { FichaRegistro, FICHAS_INICIALES, COLUMNAS_49_GOOGLE_SHEETS, fichaAFila49 } from './tiposFicha';
import FormularioRegistro from './registro/FormularioRegistro';
import {
  fetchCrmStateRemote,
  saveCrmStateRemote,
  verifyCrmLoginRemote,
  changeCrmPasswordRemote,
  mergeCrmStates,
  hasLocalOnlyRecords,
  CrmStatePayload,
} from './crmSync';

const NOMBRES_MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

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
  mes_pagado_label?: string; // ej: "Junio 2026", "Julio 2026"
  meses_adelantados?: number;
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

export interface RegistroAuditoria {
  id: string;
  fecha_hora: string;
  admin_email: string;
  modulo: 'INGRESOS' | 'EGRESOS' | 'ALUMNAS';
  tipo_accion:
    | 'EDICION_INGRESO'
    | 'ELIMINACION_INGRESO'
    | 'EDICION_EGRESO'
    | 'ELIMINACION_EGRESO'
    | 'CAMBIO_CUOTA_ALUMNA';
  detalle: string;
  monto_previo?: string;
  monto_nuevo?: string;
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
  { codigo: '0000', nombre_completo: 'Valentina Bolívar', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 0, fecha_inicio: '2026-05-15', dia_de_pago: 1, activa: 1, email: 'totalhiit1@gmail.com', telefono_whatsapp: '+5491134567890' },
  { codigo: '0001', nombre_completo: 'Raquel Hernandez', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'raquel.hernandez@totalhiit.com', telefono_whatsapp: '+13055550101' },
  { codigo: '0002', nombre_completo: 'Jackie Boriziuk', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 40000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'jackie.boriziuk@totalhiit.com', telefono_whatsapp: '+5491155550102' },
  { codigo: '0003', nombre_completo: 'Esther Guisado', pais_id: 3, moneda_preferida: 'EUR', cuota_mensual: 30, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'esther.guisado@totalhiit.com', telefono_whatsapp: '+4915155550103' },
  { codigo: '0004', nombre_completo: 'Magaly Jarquin', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'magaly.jarquin@totalhiit.com', telefono_whatsapp: '+13055550104' },
  { codigo: '0005', nombre_completo: 'Argelia belen Jarquin', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'argelia.jarquin@totalhiit.com', telefono_whatsapp: '+13055550105' },
  { codigo: '0006', nombre_completo: 'Paula Hoor', pais_id: 3, moneda_preferida: 'EUR', cuota_mensual: 30, fecha_inicio: '2026-06-17', dia_de_pago: 17, activa: 1, email: 'paula.hoor@totalhiit.com', telefono_whatsapp: '+4915155550106' },
  { codigo: '0007', nombre_completo: 'Nataly Benitez', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 40000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'nataly.benitez@totalhiit.com', telefono_whatsapp: '+5491155550107' },
  { codigo: '0008', nombre_completo: 'Marlin Lopez', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'marlin.lopez@totalhiit.com', telefono_whatsapp: '+13055550108' },
  { codigo: '0009', nombre_completo: 'Margareth Banegas', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'margareth.banegas@totalhiit.com', telefono_whatsapp: '+13055550109' },
  { codigo: '0010', nombre_completo: 'Adilia Rodriguez', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 50, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'adilia.rodriguez@totalhiit.com', telefono_whatsapp: '+12125550110' },
  { codigo: '0011', nombre_completo: 'Eileen Garcia', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 37, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'eileen.garcia@totalhiit.com', telefono_whatsapp: '+18135550111' },
  { codigo: '0012', nombre_completo: 'Sonia Valeriano', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 50, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'sonia.valeriano@totalhiit.com', telefono_whatsapp: '+14155550112' },
  { codigo: '0013', nombre_completo: 'Yolanda Montijo', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'yolanda.montijo@totalhiit.com', telefono_whatsapp: '+16025550113' },
  { codigo: '0014', nombre_completo: 'Abygail Garcia', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 40000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'abygail.garcia@totalhiit.com', telefono_whatsapp: '+5493415550114' },
  { codigo: '0015', nombre_completo: 'Manuela Sarome', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 42000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'manuela.sarome@totalhiit.com', telefono_whatsapp: '+5491155550115' },
  { codigo: '0016', nombre_completo: 'Lousa Basili', pais_id: 3, moneda_preferida: 'EUR', cuota_mensual: 34, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'lousa.basili@totalhiit.com', telefono_whatsapp: '+4916055550116' },
  { codigo: '0017', nombre_completo: 'Monica Barber', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 30, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'monica.barber@totalhiit.com', telefono_whatsapp: '+14045550117' },
  { codigo: '0018', nombre_completo: 'Karla Kuusella', pais_id: 4, moneda_preferida: 'EUR', cuota_mensual: 36, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'karla.kuusella@totalhiit.com', telefono_whatsapp: '+358405550118' },
  { codigo: '0019', nombre_completo: 'Frania Lähdemäki', pais_id: 4, moneda_preferida: 'EUR', cuota_mensual: 36, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'frania.lahdemaki@totalhiit.com', telefono_whatsapp: '+358505550119' },
  { codigo: '0020', nombre_completo: 'Jessica Ledesma', pais_id: 1, moneda_preferida: 'USD', cuota_mensual: 40, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'jessica.ledesma@totalhiit.com', telefono_whatsapp: '+12015550120' },
  { codigo: '0021', nombre_completo: 'Mariela Decuzzi', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 37000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'mariela.decuzzi@totalhiit.com', telefono_whatsapp: '+5492615550121' },
  { codigo: '0022', nombre_completo: 'Susana Costa', pais_id: 2, moneda_preferida: 'ARS', cuota_mensual: 42000, fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'susana.costa@totalhiit.com', telefono_whatsapp: '+5491155550122' },
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
  { id: 'ing-10', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0010', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 50, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 50.0, ars_equivalente: 72479.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-11', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0011', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 37, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 37.0, ars_equivalente: 53634.46, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-12', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0012', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 50, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 50.0, ars_equivalente: 72479.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-13', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0013', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-14', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0014', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 40000, tasa_a_usd: 0.00069, tasa_a_ars: 1.0, usd_equivalente: 27.59, ars_equivalente: 40000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-15', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0015', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 42000, tasa_a_usd: 0.00069, tasa_a_ars: 1.0, usd_equivalente: 28.98, ars_equivalente: 42000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-16', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0016', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'EUR', monto_original: 34, tasa_a_usd: 1.1468, tasa_a_ars: 1662.36, usd_equivalente: 38.99, ars_equivalente: 56520.24, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-17', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0017', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 30, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 30.0, ars_equivalente: 43487.4, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-18', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0018', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'EUR', monto_original: 36, tasa_a_usd: 1.1468, tasa_a_ars: 1662.36, usd_equivalente: 41.28, ars_equivalente: 59844.96, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-19', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0019', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'EUR', monto_original: 36, tasa_a_usd: 1.1468, tasa_a_ars: 1662.36, usd_equivalente: 41.28, ars_equivalente: 59844.96, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-20', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0020', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-21', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0021', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 37000, tasa_a_usd: 0.00069, tasa_a_ars: 1.0, usd_equivalente: 25.53, ars_equivalente: 37000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-22', tipo_ingreso: 'CUOTA_ALUMNA', alumna_codigo: '0022', concepto: 'Cuota Mensual TotalHIIT', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 42000, tasa_a_usd: 0.00069, tasa_a_ars: 1.0, usd_equivalente: 28.98, ars_equivalente: 42000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-23', tipo_ingreso: 'CONTRATACION_APP', cliente_o_marca: 'Membresías App Móvil', concepto: 'Suscripciones mensuales App TotalHIIT', fecha_pago: '2026-06-15', moneda_original: 'USD', monto_original: 120, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 120.0, ars_equivalente: 173949.6, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Stripe', estado: 'APROBADO' },
  { id: 'ing-24', tipo_ingreso: 'COLABORACION_MARCA', cliente_o_marca: 'FitPro Suplementos', concepto: 'Patrocinio video bootcamp + mención', fecha_pago: '2026-06-20', moneda_original: 'USD', monto_original: 250, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 250.0, ars_equivalente: 362395.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'PayPal', estado: 'APROBADO' },
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
  // Detección de ruta pública de registro (/crm/registro, /registro, ?modulo=registro)
  const [esRutaRegistro, setEsRutaRegistro] = useState(() => {
    return (
      window.location.pathname.includes('/registro') ||
      window.location.search.includes('modulo=registro') ||
      window.location.search.includes('registro=1') ||
      window.location.hash.includes('registro')
    );
  });

  // Si está en la ruta pública de registro, renderizar directamente el Formulario sin pedir login
  if (esRutaRegistro) {
    return <FormularioRegistro onVolverAdmin={() => setEsRutaRegistro(false)} />;
  }

  // Autenticación
  const [autenticado, setAutenticado] = useState<boolean>(() => {
    return sessionStorage.getItem(LLAVE_SESION_ACTIVA) === '1';
  });
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return sessionStorage.getItem('totalhiit_crm_admin_email') || 'ebolivar1000@gmail.com';
  });
  const [adminClave, setAdminClave] = useState<string>(() => {
    return sessionStorage.getItem('totalhiit_crm_admin_clave') || localStorage.getItem(LLAVE_STORAGE_CLAVE) || CLAVE_DEFECTO;
  });
  const [inputEmail, setInputEmail] = useState('');
  const [inputClave, setInputClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');
  const [modoRecuperar, setModoRecuperar] = useState(false);
  const [recuperarEmail, setRecuperarEmail] = useState('');
  const [msgRecuperar, setMsgRecuperar] = useState('');

  // Sincronización en la nube (Cloudflare Workers KV)
  const [remoteVersion, setRemoteVersion] = useState<number>(0);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [syncErrorMsg, setSyncErrorMsg] = useState<string>('');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [isApplyingRemote, setIsApplyingRemote] = useState<boolean>(false);

  // Navegación
  const [tab, setTab] = useState<
    'alumnas' | 'vencimientos' | 'recordatorios' | 'fichas' | 'ingresos' | 'egresos' | 'dashboard' | 'paises' | 'auditoria' | 'seguridad'
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
        if (Array.isArray(parsed) && parsed.length >= ALUMNAS_INICIALES.length) return parsed;
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
        if (Array.isArray(parsed) && parsed.length >= INGRESOS_INICIALES.length) return parsed;
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

  // Historial de Logs & Auditoría (Solo Lectura)
  const [logsAuditoria, setLogsAuditoria] = useState<RegistroAuditoria[]>(() => {
    const raw = localStorage.getItem('totalhiit_crm_auditoria_logs');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [
      {
        id: 'log-inicial',
        fecha_hora: '2026-06-01 12:00:00',
        admin_email: 'ebolivar1000@gmail.com',
        modulo: 'ALUMNAS',
        tipo_accion: 'CAMBIO_CUOTA_ALUMNA',
        detalle: 'Carga certificada inicial del padrón de 23 alumnas desde Excel oficial',
        monto_previo: '—',
        monto_nuevo: 'Cuotas base fijadas',
      },
    ];
  });

  // Fichas de Registro e Historial Integral (Google Form Integrado - 49 Campos) - 23 Alumnas Oficiales
  const [fichas, setFichas] = useState<FichaRegistro[]>(() => {
    const raw = localStorage.getItem('totalhiit_crm_fichas_registro_v4');
    if (raw) {
      try {
        const parsed: FichaRegistro[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length >= FICHAS_INICIALES.length) return parsed;
      } catch {}
    }
    // Si viene de caché previa (v3 o v1), fusionar conservando registros nuevos que no estén en FICHAS_INICIALES
    try {
      const oldRaw = localStorage.getItem('totalhiit_crm_fichas_registro_v3') || localStorage.getItem('totalhiit_crm_fichas_registro');
      if (oldRaw) {
        const oldParsed: FichaRegistro[] = JSON.parse(oldRaw);
        if (Array.isArray(oldParsed) && oldParsed.length > 0) {
          const idsIniciales = new Set(FICHAS_INICIALES.map((f) => f.id || f.email.toLowerCase()));
          const registrosNuevos = oldParsed.filter((f) => !idsIniciales.has(f.id) && !idsIniciales.has(f.email?.toLowerCase()));
          const fusionadas = [...registrosNuevos, ...FICHAS_INICIALES];
          localStorage.setItem('totalhiit_crm_fichas_registro_v4', JSON.stringify(fusionadas));
          return fusionadas;
        }
      }
    } catch {}
    localStorage.setItem('totalhiit_crm_fichas_registro_v4', JSON.stringify(FICHAS_INICIALES));
    return FICHAS_INICIALES;
  });

  useEffect(() => {
    localStorage.setItem('totalhiit_crm_fichas_registro_v4', JSON.stringify(fichas));
    localStorage.setItem('totalhiit_crm_fichas_registro_v3', JSON.stringify(fichas));
    localStorage.setItem('totalhiit_crm_fichas_registro', JSON.stringify(fichas));
  }, [fichas]);

  // Sincronización en vivo si una alumna envía su formulario desde otra pestaña o ventana
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === 'totalhiit_crm_fichas_registro_v4' || e.key === 'totalhiit_crm_fichas_registro_v3' || e.key === 'totalhiit_crm_fichas_registro') && e.newValue) {
        try {
          const actualizadas = JSON.parse(e.newValue);
          if (Array.isArray(actualizadas)) {
            setFichas(actualizadas);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Modal Ver Ficha Detallada & Filtros
  const [fichaModal, setFichaModal] = useState<FichaRegistro | null>(null);
  const [busquedaFichas, setBusquedaFichas] = useState('');
  const [filtroObjetivoFichas, setFiltroObjetivoFichas] = useState<string>('todos');
  const [copiadoLinkRegistro, setCopiadoLinkRegistro] = useState(false);

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
    localStorage.setItem('totalhiit_crm_auditoria_logs', JSON.stringify(logsAuditoria));
  }, [logsAuditoria]);

  useEffect(() => {
    localStorage.setItem(LLAVE_STORAGE_PLANTILLA, plantillaMsg);
  }, [plantillaMsg]);

  // ============================================================================
  // SINCRONIZACIÓN EN LA NUBE (CLOUDFLARE WORKERS KV) - SIN PÉRDIDA DE DATOS
  // ============================================================================
  const cloudReadyRef = useRef(false);
  const skipNextCloudSaveRef = useRef(false);
  const cloudVersionRef = useRef<number>(0);
  const savingInFlightRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);

  const getCurrentPayload = (): CrmStatePayload => ({
    paises,
    alumnas,
    ingresos,
    egresos,
    fichas,
    logsAuditoria,
    plantillaMsg,
  });

  const latestPayloadRef = useRef<CrmStatePayload>(getCurrentPayload());
  latestPayloadRef.current = getCurrentPayload();

  const applyPayloadToState = (payload: CrmStatePayload) => {
    skipNextCloudSaveRef.current = true;
    setIsApplyingRemote(true);
    setPaises(payload.paises);
    setAlumnas(payload.alumnas);
    setIngresos(payload.ingresos);
    setEgresos(payload.egresos);
    setFichas(payload.fichas);
    setLogsAuditoria(payload.logsAuditoria);
    setPlantillaMsg(payload.plantillaMsg);
    setTimeout(() => setIsApplyingRemote(false), 50);
  };

  const pushToCloud = async (payloadToSave: CrmStatePayload) => {
    if (!autenticado || savingInFlightRef.current) return;
    savingInFlightRef.current = true;
    setSyncStatus('syncing');
    setSyncErrorMsg('');

    try {
      let attemptPayload = payloadToSave;
      let baseVer = cloudVersionRef.current;

      for (let attempt = 0; attempt < 3; attempt++) {
        const res = await saveCrmStateRemote(adminEmail, adminClave, baseVer, attemptPayload);
        if (res.ok && typeof res.version === 'number') {
          cloudVersionRef.current = res.version;
          setRemoteVersion(res.version);
          setSyncStatus('synced');
          setLastSyncTime(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          return;
        }

        if (res.conflict && res.currentState) {
          // Otro admin guardó justo antes: fusionar sin perder transacciones y reintentar
          const merged = mergeCrmStates(attemptPayload, res.currentState);
          applyPayloadToState(merged);
          attemptPayload = merged;
          baseVer = res.currentState.version;
          continue;
        }

        setSyncStatus('error');
        setSyncErrorMsg(res.error || 'Error al guardar en la nube');
        return;
      }

      setSyncStatus('error');
      setSyncErrorMsg('Conflicto de concurrencia. Haz clic en Sincronizar.');
    } catch {
      setSyncStatus('error');
      setSyncErrorMsg('Sin conexión al servidor de Cloudflare.');
    } finally {
      savingInFlightRef.current = false;
    }
  };

  const syncFromCloud = async (isInitial = false) => {
    if (!autenticado || savingInFlightRef.current) return;
    if (isInitial) {
      setSyncStatus('syncing');
      setSyncErrorMsg('');
    }

    try {
      const since = isInitial ? undefined : cloudVersionRef.current || undefined;
      const res = await fetchCrmStateRemote(adminEmail, adminClave, since);
      if (!res.ok) {
        setSyncStatus('error');
        setSyncErrorMsg(res.error || 'Error al leer de la nube');
        return;
      }

      if (res.unchanged) {
        setSyncStatus('synced');
        return;
      }

      const localSnapshot = latestPayloadRef.current;

      if (!res.state) {
        // Nube vacía (primera inicialización): subir los datos locales (ej. los +100 registros de esta PC)
        cloudVersionRef.current = 0;
        cloudReadyRef.current = true;
        await pushToCloud(localSnapshot);
        return;
      }

      // Si esta PC tiene registros locales que aún no están en la nube (migración desde localStorage), fusionarlos y subir
      if (isInitial && hasLocalOnlyRecords(localSnapshot, res.state)) {
        const merged = mergeCrmStates(localSnapshot, res.state);
        applyPayloadToState(merged);
        cloudVersionRef.current = res.version;
        cloudReadyRef.current = true;
        await pushToCloud(merged);
        return;
      }

      // Adoptar estado de la nube
      applyPayloadToState(res.state);
      cloudVersionRef.current = res.version;
      cloudReadyRef.current = true;
      setRemoteVersion(res.version);
      setSyncStatus('synced');
      setLastSyncTime(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch {
      setSyncStatus('error');
      setSyncErrorMsg('No se pudo conectar con Cloudflare.');
    }
  };

  // Carga inicial y polling en vivo entre PCs cada 15 segundos
  useEffect(() => {
    if (!autenticado) {
      cloudReadyRef.current = false;
      return;
    }

    syncFromCloud(true);

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        syncFromCloud(false);
      }
    }, 15000);

    const handleFocus = () => {
      syncFromCloud(false);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [autenticado, adminEmail, adminClave]);

  // Guardado automático inmediato en la nube ante cualquier cambio local
  useEffect(() => {
    if (!autenticado || !cloudReadyRef.current || isApplyingRemote) return;
    if (skipNextCloudSaveRef.current) {
      skipNextCloudSaveRef.current = false;
      return;
    }

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      pushToCloud(latestPayloadRef.current);
    }, 350);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [paises, alumnas, ingresos, egresos, fichas, logsAuditoria, plantillaMsg]);

  // Función Auditoría
  const registrarLogAuditoria = (
    modulo: 'INGRESOS' | 'EGRESOS' | 'ALUMNAS',
    tipo_accion: RegistroAuditoria['tipo_accion'],
    detalle: string,
    monto_previo?: string,
    monto_nuevo?: string
  ) => {
    const nuevoLog: RegistroAuditoria = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fecha_hora: new Date().toLocaleString('es-ES'),
      admin_email: adminEmail,
      modulo,
      tipo_accion,
      detalle,
      monto_previo,
      monto_nuevo,
    };
    setLogsAuditoria((prev) => [nuevoLog, ...prev]);
  };


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

  // Lista ordenada alfabéticamente de alumnas (Nombre y Apellido)
  const alumnasOrdenadasPorNombre = useMemo(() => {
    return [...alumnas].sort((a, b) =>
      a.nombre_completo.localeCompare(b.nombre_completo, 'es', { sensitivity: 'base' })
    );
  }, [alumnas]);

  // Lista ordenada numéricamente/alfabéticamente por Código
  const alumnasOrdenadasPorCodigo = useMemo(() => {
    return [...alumnas].sort((a, b) =>
      a.codigo.localeCompare(b.codigo, undefined, { numeric: true })
    );
  }, [alumnas]);

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

  // Cuotas Pagadas Únicas (para filtro preciso por Cuota Pagada)
  const cuotasPagadasDisponibles = useMemo(() => {
    const map = new Map<string, { label: string; sortKey: number }>();

    ingresos.forEach((i) => {
      const label =
        i.mes_pagado_label?.trim() ||
        (i.mes_periodo ? `${NOMBRES_MESES[i.mes_periodo - 1]} ${i.anio_periodo}` : '');
      if (!label) return;

      const anio = i.anio_periodo || (label.match(/\d{4}/) ? Number(label.match(/\d{4}/)![0]) : 2026);
      const nombreMesEncontrado = NOMBRES_MESES.findIndex((nom) =>
        label.toLowerCase().includes(nom.toLowerCase())
      );
      const mesNum = (i.mes_periodo && i.mes_periodo >= 1 && i.mes_periodo <= 12)
        ? i.mes_periodo
        : (nombreMesEncontrado >= 0 ? nombreMesEncontrado + 1 : 1);

      const sortKey = anio * 100 + mesNum;
      if (!map.has(label) || sortKey > map.get(label)!.sortKey) {
        map.set(label, { label, sortKey });
      }
    });

    return Array.from(map.values())
      .sort((a, b) => b.sortKey - a.sortKey)
      .map((x) => x.label);
  }, [ingresos]);

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
  const [filtroIngCodigo, setFiltroIngCodigo] = useState<string>('todos');
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

  // Cotizaciones en Vivo & Historial DolarApi
  const [cotizacionLive, setCotizacionLive] = useState<SnapshotCotizacion | null>(() => {
    const hist = cargarHistorialCotizaciones();
    return hist.length > 0 ? hist[0] : null;
  });
  const [historialCot, setHistorialCot] = useState<SnapshotCotizacion[]>(() => cargarHistorialCotizaciones());
  const [modalHistorialCot, setModalHistorialCot] = useState(false);
  const [actualizandoCot, setActualizandoCot] = useState(false);

  useEffect(() => {
    consultarDolarApi().then((data) => {
      if (data) {
        setCotizacionLive(data);
        setHistorialCot(cargarHistorialCotizaciones());
      }
    });
  }, []);

  // Modal Ingreso
  const [modalIngreso, setModalIngreso] = useState(false);
  const [ingTipo, setIngTipo] = useState<Ingreso['tipo_ingreso']>('CUOTA_ALUMNA');
  const [ingAlumnaCod, setIngAlumnaCod] = useState('');
  const [ingClienteMarca, setIngClienteMarca] = useState('');
  const [ingConcepto, setIngConcepto] = useState('Cuota Mensual TotalHIIT');
  const [ingFecha, setIngFecha] = useState('2026-06-01');
  const [ingMesPeriodo, setIngMesPeriodo] = useState<number>(6);
  const [ingAnioPeriodo, setIngAnioPeriodo] = useState<number>(2026);
  const [ingMesesAdelantados, setIngMesesAdelantados] = useState<number>(1);
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

  // Estados de Edición de Ingreso y Egreso (Requerimiento 2)
  const [ingresoEdit, setIngresoEdit] = useState<Ingreso | null>(null);
  const [egresoEdit, setEgresoEdit] = useState<Egreso | null>(null);

  // Modal Caja de Texto Copy/Paste para Email (Requerimiento 1 - Sin abrir Outlook)
  const [modalEmailBox, setModalEmailBox] = useState(false);
  const [emailDestino, setEmailDestino] = useState('');
  const [emailAlumnaNombre, setEmailAlumnaNombre] = useState('');
  const [asuntoEmail, setAsuntoEmail] = useState('');
  const [cuerpoEmail, setCuerpoEmail] = useState('');
  const [copiadoEmailCampo, setCopiadoEmailCampo] = useState<'ninguno' | 'email' | 'asunto' | 'cuerpo' | 'todo'>('ninguno');

  // Filtros Auditoría & Logs (Requerimiento 3)
  const [busquedaAuditoria, setBusquedaAuditoria] = useState('');
  const [filtroModuloAuditoria, setFiltroModuloAuditoria] = useState<string>('todos');
  const [filtroAccionAuditoria, setFiltroAccionAuditoria] = useState<string>('todas');

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

  // Abrir caja de texto Copy/Paste para Email (Requerimiento 1)
  const abrirModalEmailBox = (email: string, nombre: string, asunto: string, cuerpo: string) => {
    setEmailDestino(email);
    setEmailAlumnaNombre(nombre);
    setAsuntoEmail(asunto);
    setCuerpoEmail(cuerpo);
    setCopiadoEmailCampo('ninguno');
    setModalEmailBox(true);
  };

  // Acciones de Ingresos (Requerimiento 2 y 3)
  const abrirEditarIngreso = (ing: Ingreso) => {
    setIngresoEdit(ing);
    setIngTipo(ing.tipo_ingreso);
    setIngAlumnaCod(ing.alumna_codigo || '');
    setIngClienteMarca(ing.cliente_o_marca || '');
    setIngConcepto(ing.concepto);
    setIngFecha(ing.fecha_pago);
    setIngMesPeriodo(ing.mes_periodo || 6);
    setIngAnioPeriodo(ing.anio_periodo || 2026);
    setIngMesesAdelantados(1);
    setIngMoneda(ing.moneda_original);
    setIngMonto(ing.monto_original);
    setIngTasaUsd(ing.tasa_a_usd);
    setIngTasaArs(ing.tasa_a_ars);
    setIngMetodo(ing.metodo_pago || 'Transferencia');
    setModalIngreso(true);
  };

  const abrirNuevoIngreso = () => {
    setIngresoEdit(null);
    setIngTipo('CUOTA_ALUMNA');
    setIngAlumnaCod(alumnas[0]?.codigo || '');
    setIngClienteMarca('');
    setIngConcepto('Cuota Mensual TotalHIIT');
    setIngFecha(new Date().toISOString().split('T')[0]);
    setIngMesPeriodo(new Date().getMonth() + 1);
    setIngAnioPeriodo(new Date().getFullYear());
    setIngMesesAdelantados(1);
    setIngMoneda('USD');
    setIngMonto(40);
    setIngTasaUsd(1.0);
    setIngTasaArs(cotizacionLive?.usd_blue_venta || 1449.58);
    setIngMetodo('Transferencia');
    setModalIngreso(true);
  };

  const eliminarIngreso = (ing: Ingreso) => {
    if (
      window.confirm(
        `¿Seguro que deseas eliminar el ingreso de ${ing.concepto} (${ing.moneda_original} ${ing.monto_original})? Esta acción quedará registrada en Auditoría.`
      )
    ) {
      setIngresos((prev) => prev.filter((x) => x.id !== ing.id));
      registrarLogAuditoria(
        'INGRESOS',
        'ELIMINACION_INGRESO',
        `Eliminación del ingreso #${ing.id}: ${ing.concepto} (${ing.moneda_original} ${ing.monto_original})`,
        `${ing.moneda_original} ${ing.monto_original}`,
        '0'
      );
    }
  };

  // Acciones de Egresos (Requerimiento 2 y 3)
  const abrirEditarEgreso = (egr: Egreso) => {
    setEgresoEdit(egr);
    setEgrCat(egr.categoria);
    setEgrConcepto(egr.concepto);
    setEgrFecha(egr.fecha);
    setEgrProv(egr.proveedor || '');
    setEgrMoneda(egr.moneda_original);
    setEgrMonto(egr.monto_original);
    setEgrTasaUsd(egr.tasa_a_usd);
    setEgrTasaArs(egr.tasa_a_ars);
    setModalEgreso(true);
  };

  const abrirNuevoEgreso = () => {
    setEgresoEdit(null);
    setEgrCat('PUBLICIDAD');
    setEgrConcepto('');
    setEgrFecha(new Date().toISOString().split('T')[0]);
    setEgrProv('');
    setEgrMoneda('USD');
    setEgrMonto(50);
    setEgrTasaUsd(1.0);
    setEgrTasaArs(cotizacionLive?.usd_blue_venta || 1449.58);
    setModalEgreso(true);
  };

  const eliminarEgreso = (egr: Egreso) => {
    if (
      window.confirm(
        `¿Seguro que deseas eliminar el egreso ${egr.concepto} (${egr.moneda_original} ${egr.monto_original})? Esta acción quedará registrada en Auditoría.`
      )
    ) {
      setEgresos((prev) => prev.filter((x) => x.id !== egr.id));
      registrarLogAuditoria(
        'EGRESOS',
        'ELIMINACION_EGRESO',
        `Eliminación del egreso #${egr.id}: ${egr.concepto} (${egr.moneda_original} ${egr.monto_original})`,
        `${egr.moneda_original} ${egr.monto_original}`,
        '0'
      );
    }
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

      // Buscar si tiene pagos registrados (incluyendo meses adelantados)
      const pagosAlumna = ingresos.filter((i) => i.alumna_codigo === al.codigo && i.tipo_ingreso === 'CUOTA_ALUMNA');
      let ultimoMesIndex = 0;
      let ultimoMesTexto = '';
      pagosAlumna.forEach((p) => {
        const idx = (p.anio_periodo || 2026) * 12 + (p.mes_periodo || 6);
        if (idx > ultimoMesIndex) {
          ultimoMesIndex = idx;
          ultimoMesTexto = p.mes_pagado_label || `${NOMBRES_MESES[(p.mes_periodo || 6) - 1]} ${p.anio_periodo || 2026}`;
        }
      });

      const mesActualIndex = hoy.getFullYear() * 12 + (hoy.getMonth() + 1);

      if (al.activa === 0) {
        estado = 'AL_DIA';
      } else if (ultimoMesIndex > mesActualIndex) {
        estado = 'AL_DIA'; // Al día por pago de meses adelantados
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
        ultimoMesTexto,
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
      const cuotaLabel =
        i.mes_pagado_label?.trim() ||
        (i.mes_periodo ? `${NOMBRES_MESES[i.mes_periodo - 1]} ${i.anio_periodo}` : '');
      const mesStr = `${i.anio_periodo}-${String(i.mes_periodo).padStart(2, '0')}`;
      const matchMes =
        filtroIngMes === 'todos' ||
        cuotaLabel === filtroIngMes ||
        cuotaLabel.toLowerCase() === filtroIngMes.toLowerCase() ||
        mesStr === filtroIngMes ||
        i.fecha_pago.startsWith(filtroIngMes);
      const matchMon = filtroIngMoneda === 'todas' || i.moneda_original === filtroIngMoneda;
      const matchTipo = filtroIngTipo === 'todos' || i.tipo_ingreso === filtroIngTipo;

      let matchCodigo = true;
      if (filtroIngCodigo !== 'todos') {
        matchCodigo = i.alumna_codigo === filtroIngCodigo;
      }

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

      return matchMes && matchMon && matchTipo && matchCodigo && matchAlumna && matchPais && matchBusqueda;
    });
  }, [ingresos, filtroIngMes, filtroIngMoneda, filtroIngTipo, filtroIngCodigo, filtroIngAlumna, filtroIngPais, busquedaIngresos, alumnas]);

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

  // Auditoría Filtrada (Requerimiento 3)
  const logsAuditoriaFiltrados = useMemo(() => {
    return logsAuditoria.filter((log) => {
      const q = busquedaAuditoria.toLowerCase();
      const matchBusqueda =
        log.detalle.toLowerCase().includes(q) ||
        log.admin_email.toLowerCase().includes(q) ||
        log.tipo_accion.toLowerCase().includes(q);

      const matchModulo = filtroModuloAuditoria === 'todos' || log.modulo === filtroModuloAuditoria;
      const matchAccion = filtroAccionAuditoria === 'todas' || log.tipo_accion === filtroAccionAuditoria;

      return matchBusqueda && matchModulo && matchAccion;
    });
  }, [logsAuditoria, busquedaAuditoria, filtroModuloAuditoria, filtroAccionAuditoria]);

  // ==============================================================================
  // FUNCIONES DE EXPORTACIÓN A EXCEL Y PDF (REQUERIMIENTO 4)
  // ==============================================================================

  const exportarAlumnasExcel = () => {
    const columnas = ['Código', 'Nombre Completo', 'Email', 'Teléfono WhatsApp', 'País', 'Moneda', 'Cuota Pactada', 'Día Cobro', 'Estado', 'Notas'];
    const filas = alumnasFiltradas.map((a) => {
      const p = mapaPaises.get(a.pais_id);
      return [
        a.codigo,
        a.nombre_completo,
        a.email || '—',
        a.telefono_whatsapp || '—',
        p?.nombre || '—',
        a.moneda_preferida,
        a.cuota_mensual,
        a.dia_de_pago || 1,
        a.activa === 1 ? 'Activa' : 'Inactiva',
        a.notas || '',
      ];
    });
    exportarAExcel('TotalHIIT_Alumnas', 'Padrón Oficial de Alumnas', columnas, filas);
  };

  const exportarAlumnasPDF = () => {
    const columnas = ['Código', 'Nombre Completo', 'Email', 'Teléfono', 'País', 'Moneda', 'Cuota', 'Día', 'Estado'];
    const filas = alumnasFiltradas.map((a) => {
      const p = mapaPaises.get(a.pais_id);
      return [
        a.codigo,
        a.nombre_completo,
        a.email || '—',
        a.telefono_whatsapp || '—',
        p?.nombre || '—',
        a.moneda_preferida,
        `${a.moneda_preferida === 'EUR' ? '€' : '$'}${a.cuota_mensual}`,
        `Día ${a.dia_de_pago || 1}`,
        a.activa === 1 ? 'Activa' : 'Inactiva',
      ];
    });
    exportarAPDF(
      'Padrón Oficial de Alumnas TotalHIIT',
      `Reporte con ${alumnasFiltradas.length} alumnas registradas`,
      columnas,
      filas,
      [
        { etiqueta: 'Total Alumnas', valor: String(alumnasFiltradas.length) },
        { etiqueta: 'Activas', valor: String(alumnasFiltradas.filter((x) => x.activa === 1).length) },
        { etiqueta: 'Inactivas', valor: String(alumnasFiltradas.filter((x) => x.activa === 0).length) },
      ]
    );
  };

  const exportarVencimientosExcel = () => {
    const columnas = ['Código', 'Alumna', 'País', 'Día de Cobro', 'Cuota Estimada', 'Moneda', 'Días Restantes', 'Estado Vencimiento', 'Último Pago'];
    const filas = alertasVencimiento.map((item) => [
      item.alumna.codigo,
      item.alumna.nombre_completo,
      item.pais?.nombre || '—',
      item.diaCobro,
      item.montoEst,
      item.moneda,
      item.diasRestantes,
      item.estado,
      item.ultimoMesTexto || 'Pendiente',
    ]);
    exportarAExcel('TotalHIIT_Vencimientos', 'Ciclos de Cobro y Vencimientos', columnas, filas);
  };

  const exportarVencimientosPDF = () => {
    const columnas = ['Cód', 'Alumna', 'País', 'Día Cobro', 'Cuota', 'Estado', 'Último Período Pagado'];
    const filas = alertasVencimiento.map((item) => [
      item.alumna.codigo,
      item.alumna.nombre_completo,
      item.pais?.nombre || '—',
      `Día ${item.diaCobro}`,
      `${item.moneda === 'EUR' ? '€' : '$'}${item.montoEst}`,
      item.estado === 'VENCE_HOY' ? 'VENCE HOY' : item.estado === 'VENCIDO' ? `VENCIDO (${Math.abs(item.diasRestantes)}d)` : item.estado === 'PROXIMO' ? `PRÓXIMO (${item.diasRestantes}d)` : 'AL DÍA',
      item.ultimoMesTexto || 'Sin registro',
    ]);
    exportarAPDF(
      'Reporte de Vencimientos y Ciclos de Cobro',
      `Monitoreo de cobranzas y membresías activas`,
      columnas,
      filas,
      [
        { etiqueta: 'Total Alumnas', valor: String(alertasVencimiento.length) },
        { etiqueta: 'Vence Hoy / Vencidas', valor: String(alertasVencimiento.filter((x) => x.estado === 'VENCE_HOY' || x.estado === 'VENCIDO').length) },
        { etiqueta: 'Próximas (7 días)', valor: String(alertasVencimiento.filter((x) => x.estado === 'PROXIMO').length) },
      ]
    );
  };

  const exportarIngresosExcel = () => {
    const columnas = ['ID', 'Fecha Cobro', 'Cuota Pagada', 'Tipo Ingreso', 'Alumna / Marca', 'Concepto', 'Moneda', 'Monto Original', 'Equiv USD', 'Equiv ARS', 'Método'];
    const filas = ingresosFiltrados.map((i) => [
      i.id,
      i.fecha_pago,
      i.mes_pagado_label || `${i.mes_periodo || ''}/${i.anio_periodo || ''}`,
      i.tipo_ingreso,
      i.alumna_codigo || i.cliente_o_marca || '—',
      i.concepto,
      i.moneda_original,
      i.monto_original,
      i.usd_equivalente,
      i.ars_equivalente,
      i.metodo_pago,
    ]);
    exportarAExcel('TotalHIIT_Ingresos', 'Libro Oficial de Ingresos', columnas, filas);
  };

  const exportarIngresosPDF = () => {
    const columnas = ['Fecha', 'Cuota Pagada', 'Tipo', 'Detalle / Alumna', 'Monto Original', 'Equiv USD', 'Equiv ARS'];
    const filas = ingresosFiltrados.map((i) => [
      i.fecha_pago,
      i.mes_pagado_label || `${i.mes_periodo}/${i.anio_periodo}`,
      i.tipo_ingreso === 'CUOTA_ALUMNA' ? 'Cuota' : i.tipo_ingreso === 'CONTRATACION_APP' ? 'App' : i.tipo_ingreso === 'COLABORACION_MARCA' ? 'Marca' : 'Otro',
      i.concepto,
      `${i.moneda_original === 'EUR' ? '€' : '$'}${i.monto_original} ${i.moneda_original}`,
      `$${i.usd_equivalente.toFixed(2)}`,
      `$${i.ars_equivalente.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
    ]);
    exportarAPDF(
      'Libro Oficial de Ingresos TotalHIIT',
      `Reporte financiero filtrado (${ingresosFiltrados.length} operaciones)`,
      columnas,
      filas,
      [
        { etiqueta: 'Total Operaciones', valor: String(ingresosFiltrados.length) },
        { etiqueta: 'Total USD', valor: `$${totalesIngresosFiltrados.usd.toFixed(2)} USD` },
        { etiqueta: 'Total ARS', valor: `$${totalesIngresosFiltrados.ars.toLocaleString('es-ES', { maximumFractionDigits: 0 })} ARS` },
      ]
    );
  };

  const exportarEgresosExcel = () => {
    const columnas = ['ID', 'Fecha', 'Período', 'Categoría', 'Concepto', 'Proveedor', 'Moneda', 'Monto Original', 'Equiv USD', 'Equiv ARS'];
    const filas = egresosFiltrados.map((e) => [
      e.id,
      e.fecha,
      `${e.mes_periodo || ''}/${e.anio_periodo || ''}`,
      e.categoria,
      e.concepto,
      e.proveedor || '—',
      e.moneda_original,
      e.monto_original,
      e.usd_equivalente,
      e.ars_equivalente,
    ]);
    exportarAExcel('TotalHIIT_Egresos', 'Libro de Egresos y Gastos', columnas, filas);
  };

  const exportarEgresosPDF = () => {
    const columnas = ['Fecha', 'Categoría', 'Concepto', 'Proveedor', 'Monto Original', 'Equiv USD', 'Equiv ARS'];
    const filas = egresosFiltrados.map((e) => [
      e.fecha,
      e.categoria,
      e.concepto,
      e.proveedor || '—',
      `${e.moneda_original === 'EUR' ? '€' : '$'}${e.monto_original} ${e.moneda_original}`,
      `$${e.usd_equivalente.toFixed(2)}`,
      `$${e.ars_equivalente.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
    ]);
    exportarAPDF(
      'Libro de Egresos Operativos TotalHIIT',
      `Reporte de gastos y egresos (${egresosFiltrados.length} partidas)`,
      columnas,
      filas,
      [
        { etiqueta: 'Total Gastos', valor: String(egresosFiltrados.length) },
        { etiqueta: 'Total USD', valor: `$${totalesEgresosFiltrados.usd.toFixed(2)} USD` },
        { etiqueta: 'Total ARS', valor: `$${totalesEgresosFiltrados.ars.toLocaleString('es-ES', { maximumFractionDigits: 0 })} ARS` },
      ]
    );
  };

  const exportarAuditoriaExcel = () => {
    const columnas = ['Fecha y Hora', 'Admin Responsable', 'Módulo', 'Acción', 'Detalle Operación', 'Valor Previo', 'Valor Nuevo'];
    const filas = logsAuditoriaFiltrados.map((l) => [
      l.fecha_hora,
      l.admin_email,
      l.modulo,
      l.tipo_accion,
      l.detalle,
      l.monto_previo || '—',
      l.monto_nuevo || '—',
    ]);
    exportarAExcel('TotalHIIT_Auditoria_Logs', 'Auditoría y Logs del Sistema (Solo Lectura)', columnas, filas);
  };

  const exportarAuditoriaPDF = () => {
    const columnas = ['Fecha / Hora', 'Admin', 'Módulo', 'Acción', 'Detalle Operación', 'Valor Previo', 'Valor Nuevo'];
    const filas = logsAuditoriaFiltrados.map((l) => [
      l.fecha_hora,
      l.admin_email,
      l.modulo,
      l.tipo_accion,
      l.detalle,
      l.monto_previo || '—',
      l.monto_nuevo || '—',
    ]);
    exportarAPDF(
      'Registro Oficial de Auditoría y Seguridad',
      `Historial inmutable de modificaciones y eliminaciones (${logsAuditoriaFiltrados.length} registros)`,
      columnas,
      filas,
      [
        { etiqueta: 'Total Eventos', valor: String(logsAuditoriaFiltrados.length) },
        { etiqueta: 'Ediciones', valor: String(logsAuditoriaFiltrados.filter((x) => x.tipo_accion.startsWith('EDICION')).length) },
        { etiqueta: 'Eliminaciones', valor: String(logsAuditoriaFiltrados.filter((x) => x.tipo_accion.startsWith('ELIMINACION')).length) },
        { etiqueta: 'Cambios Cuota', valor: String(logsAuditoriaFiltrados.filter((x) => x.tipo_accion === 'CAMBIO_CUOTA_ALUMNA').length) },
      ]
    );
  };

  // Memos y Exportaciones de Fichas de Alumnas (Google Form Integrado)
  const fichasFiltradas = useMemo(() => {
    return fichas.filter((f) => {
      const q = busquedaFichas.toLowerCase();
      const matchBusqueda =
        f.nombre_completo.toLowerCase().includes(q) ||
        (f.apodo || '').toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.telefono_whatsapp.includes(q) ||
        f.localidad_pais.toLowerCase().includes(q);

      const matchObj = filtroObjetivoFichas === 'todos' || f.objetivo_principal === filtroObjetivoFichas;

      return matchBusqueda && matchObj;
    });
  }, [fichas, busquedaFichas, filtroObjetivoFichas]);

  const exportarTodasFichasExcel = () => {
    const filas = fichasFiltradas.map((f) => fichaAFila49(f));
    exportarAExcel(
      'TotalHIIT_Fichas_Alumnas_49_Campos_Google_Sheets',
      'Padrón Oficial de Fichas Integrales de Salud & Entrenamiento (49 Columnas de Google Sheets)',
      COLUMNAS_49_GOOGLE_SHEETS,
      filas
    );
  };

  const exportarTodasFichasPDF = () => {
    const columnas = ['Fecha', 'Alumna', 'Contacto', 'Ubicación', 'Contextura', 'Alergias / Lesiones', 'Objetivo'];
    const filas = fichasFiltradas.map((f) => [
      (f.marca_temporal || f.fecha_registro).split(' ')[0],
      f.nombre_completo || `${f.nombre} ${f.apellido}`.trim(),
      `${f.email} | ${f.telefono_whatsapp}`,
      f.localidad_pais,
      `${f.altura} / ${f.peso} (Talla ${f.talla_remera})`,
      f.detalle_lesiones || f.lesiones_desde_cuando ? `${f.alergias} | ${f.detalle_lesiones || f.lesiones_desde_cuando}` : f.alergias,
      f.objetivo_principal.includes('Corporal') ? 'Composición Corporal' : 'Salud Integral',
    ]);
    exportarAPDF(
      'Fichas Integrales de Salud & Entrenamiento TotalHIIT',
      `Reporte con ${fichasFiltradas.length} fichas oficiales recibidas (Google Sheets)`,
      columnas,
      filas,
      [
        { etiqueta: 'Total Fichas', valor: String(fichasFiltradas.length) },
        { etiqueta: 'Objetivo Corporal', valor: String(fichasFiltradas.filter((x) => x.objetivo_principal.includes('Corporal')).length) },
        { etiqueta: 'Salud Integral', valor: String(fichasFiltradas.filter((x) => x.objetivo_principal.includes('Salud')).length) },
      ]
    );
  };

  const exportarFichaIndividualPDF = (ficha: FichaRegistro) => {
    const columnas = ['Área / Pregunta Oficial', 'Respuesta Certificada (Google Forms)'];
    const filas: (string | number)[][] = [
      ['1. Marca temporal', ficha.marca_temporal || ficha.fecha_registro],
      ['2. Correo electrónico', ficha.email],
      ['3. Nombre', ficha.nombre || ficha.nombre_completo.split(' ')[0]],
      ['4. Apellido', ficha.apellido || ficha.nombre_completo.split(' ').slice(1).join(' ')],
      ['5. Sexo', ficha.sexo],
      ['6. Apodo preferido', ficha.apodo || '—'],
      ['7. Fecha de nacimiento', ficha.fecha_nacimiento],
      ['8. Edad', `${ficha.edad} años`],
      ['9. Dónde vives, localidad, País', ficha.localidad_pais],
      ['10. Altura (Expresada en M)', ficha.altura],
      ['11. Peso (Expresado en Kg)', ficha.peso],
      ['12. Talla de Remera', ficha.talla_remera],
      ['13. Alergias', ficha.alergias],
      ['14. Embarazos?', ficha.embarazos],
      ['15. Tienes hijos?', ficha.hijos],
      ['16. ¿Tuviste Coronavirus?', ficha.tuvo_covid],
      ['17. Secuelas de COVID / Problemas respiratorios', ficha.secuelas_covid || 'No refiere'],
      ['18. Problema, patología o lesión muscular/articular/óseo', ficha.problemas_musculares_oseos],
      ['19. ¿Desde cuándo? ¿Qué tienes?', ficha.lesiones_desde_cuando || ficha.detalle_lesiones || '—'],
      ['20. ¿Estás realizando algún tratamiento que mejore tu condición?', ficha.tratamiento_actual || '—'],
      ['21. ¿Tomas algún medicamento en el día a día?', ficha.toma_medicamentos],
      ['22. ¿Cuál? ¿Cómo?', ficha.medicamentos_detalle || ficha.detalle_medicamentos || '—'],
      ['23. ¿Tienes alguna discapacidad (motriz, auditiva, visual, verbal)?', ficha.discapacidad || 'Ninguna'],
      ['24. Observaciones de utilidad', ficha.observaciones_medicas || '—'],
      ['25. ¿Consumes bebidas alcohólicas?', ficha.consume_alcohol],
      ['26. ¿Fumas?', ficha.fuma],
      ['27. Frecuencia de fumar', ficha.frecuencia_fuma || '—'],
      ['28. Suplementos deportivos, hormonas, anticonceptivos', ficha.suplementos_anticonceptivos || 'Ninguno'],
      ['29. ¿Cómo llegaste a conocer a TOTALHIIT?', ficha.como_conocio_totalhiit || '—'],
      ['30. Teléfono y/o Celular', ficha.telefono_whatsapp],
      ['31. Sumar al grupo de WhatsApp', ficha.sumar_grupo_whatsapp],
      ['32. Instagram (Nombre de usuario)', ficha.instagram || '—'],
      ['33. Consentimiento fotos / grabaciones de clase', ficha.consentimiento_fotos],
      ['34. Redes: Instagram @TOTALHIIT1', ficha.redes_instagram || '—'],
      ['35. Redes: YouTube TOTALHIIT', ficha.redes_youtube || '—'],
      ['36. Redes: Voy corriendo a Seguirlos', ficha.redes_voy_seguirlos || '—'],
      ['37. Contacto de Emergencia', ficha.contacto_emergencia],
      ['38. Objetivo principal', ficha.objetivo_principal],
      ['39. ¿Por qué decidiste acceder a los servicios de TOTALHIIT?', ficha.motivo_totalhiit || '—'],
      ['40. ¿Qué esperas recibir de nuestra parte?', ficha.expectativas || '—'],
      ['41. ¿Realizas actividad física actualmente?', ficha.actividad_fisica_actual],
      ['42. ¿Cuál o Cuáles actividades físicas?', ficha.detalle_actividad_actual || '—'],
      ['43. 3 Deportes o disciplinas que más te gusten', ficha.deportes_favoritos || '—'],
      ['44. Actividades que realizaste antes', ficha.actividades_previas || '—'],
      ['45. Horas de sueño diarias', ficha.horas_sueno],
      ['46. Cómo te sientes emocionalmente', ficha.estado_emocional || '—'],
      ['47. ¿Asiste a terapia (tradicional o alternativa)?', ficha.asiste_terapia || '—'],
      ['48. ¿Cuál o Cuáles terapias?', ficha.detalle_terapia || '—'],
      ['49. Compromiso y disposición de recibir ayuda integral', ficha.compromiso_ayuda],
    ];

    exportarAPDF(
      `Ficha Integral de Salud y Entrenamiento (49 Campos)`,
      `Alumna: ${ficha.nombre_completo} | Registrado: ${ficha.marca_temporal || ficha.fecha_registro}`,
      columnas,
      filas,
      [
        { etiqueta: 'Alumna', valor: ficha.nombre_completo },
        { etiqueta: 'Edad', valor: `${ficha.edad} años` },
        { etiqueta: 'Objetivo', valor: ficha.objetivo_principal.includes('Corporal') ? 'Composición Corporal' : 'Salud Integral' },
      ]
    );
  };

  const pasarFichaAAlumna = (f: FichaRegistro) => {
    setAlumnaEdit(null);
    setFormCod((alumnas.length + 1).toString().padStart(4, '0'));
    setFormNombre(f.nombre_completo);
    setFormEmail(f.email);
    setFormTel(f.telefono_whatsapp);
    let matchPaisId = 1;
    const locLower = f.localidad_pais.toLowerCase();
    for (const p of paises) {
      if (locLower.includes(p.nombre.toLowerCase())) {
        matchPaisId = p.id;
        break;
      }
    }
    setFormPais(matchPaisId);
    const pObj = mapaPaises.get(matchPaisId);
    if (pObj) {
      setFormMoneda(pObj.moneda_defecto);
      setFormCuota(pObj.moneda_defecto === 'ARS' ? 40000 : 40);
    }
    setFormDia(1);
    setFormActiva(1);
    setFormNotas(`Ficha #${f.id} | Meta: ${f.objetivo_principal} | Altura: ${f.altura} | Peso: ${f.peso} | Talla: ${f.talla_remera}`);
    setModalAlumna(true);
  };

  // Manejo Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLogin('');
    const normEmail = inputEmail.trim().toLowerCase();
    const claveIngresada = inputClave.trim();

    if (!EMAILS_ADMIN_AUTORIZADOS.includes(normEmail)) {
      setErrorLogin('Acceso denegado: El correo no pertenece a los administradores autorizados.');
      return;
    }

    // Validar contra la nube (Cloudflare KV) para que todos los admins compartan la misma clave
    const remoteCheck = await verifyCrmLoginRemote(normEmail, claveIngresada);
    if (!remoteCheck.ok) {
      // Fallback local solo si el servidor no responde (ej. dev local sin Functions)
      if (remoteCheck.error?.includes('No se pudo conectar')) {
        const claveGuardada = localStorage.getItem(LLAVE_STORAGE_CLAVE) || CLAVE_DEFECTO;
        if (claveIngresada !== claveGuardada) {
          setErrorLogin('Contraseña incorrecta. Por favor verifica tus credenciales.');
          return;
        }
      } else {
        setErrorLogin(remoteCheck.error || 'Contraseña incorrecta. Por favor verifica tus credenciales.');
        return;
      }
    }

    localStorage.setItem(LLAVE_STORAGE_CLAVE, claveIngresada);
    sessionStorage.setItem(LLAVE_SESION_ACTIVA, '1');
    sessionStorage.setItem('totalhiit_crm_admin_email', normEmail);
    sessionStorage.setItem('totalhiit_crm_admin_clave', claveIngresada);
    setAdminEmail(normEmail);
    setAdminClave(claveIngresada);
    setAutenticado(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(LLAVE_SESION_ACTIVA);
    sessionStorage.removeItem('totalhiit_crm_admin_email');
    sessionStorage.removeItem('totalhiit_crm_admin_clave');
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
                      placeholder="••••••••"
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
                  Ingresa tu correo autorizado para reiniciar la contraseña de acceso:
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
            {/* Ticker Cotizaciones En Vivo DolarApi */}
            <div className="hidden md:flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px]">
              <span className="font-bold text-stone-700 flex items-center gap-0.5">
                <DollarSign size={12} className="text-emerald-600" /> Blue:
              </span>
              <span className="font-black text-emerald-700">${cotizacionLive?.usd_blue_venta || 1555} ARS</span>
              <span className="text-stone-300">|</span>
              <span className="font-bold text-stone-700">Oficial:</span>
              <span className="font-bold text-stone-800">${cotizacionLive?.usd_oficial_venta || 1570} ARS</span>
              <span className="text-stone-300">|</span>
              <span className="font-bold text-stone-700">Euro:</span>
              <span className="font-bold text-blue-700">${cotizacionLive?.eur_venta || 1738} ARS</span>
              <button
                onClick={async () => {
                  setActualizandoCot(true);
                  const res = await consultarDolarApi();
                  if (res) {
                    setCotizacionLive(res);
                    setHistorialCot(cargarHistorialCotizaciones());
                  }
                  setActualizandoCot(false);
                }}
                disabled={actualizandoCot}
                className="ml-0.5 rounded-lg bg-stone-200 p-1 text-stone-600 hover:bg-stone-300 hover:text-stone-900 transition cursor-pointer"
                title="Actualizar cotización en vivo desde DolarApi.com"
              >
                <RotateCcw size={11} className={actualizandoCot ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={() => setModalHistorialCot(true)}
                className="rounded-lg bg-white border border-stone-200 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                title="Ver historial de cotizaciones por fecha"
              >
                Historial
              </button>
            </div>

            {/* Indicador de Sincronización en la Nube */}
            <button
              onClick={() => syncFromCloud(false)}
              disabled={syncStatus === 'syncing'}
              title={syncErrorMsg || (lastSyncTime ? `Última sincronización: ${lastSyncTime} (v${remoteVersion})` : 'Sincronizar con la nube')}
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                syncStatus === 'error'
                  ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                  : syncStatus === 'syncing'
                  ? 'border-amber-300 bg-amber-50 text-amber-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {syncStatus === 'error' ? (
                <CloudOff size={13} />
              ) : (
                <Cloud size={13} className={syncStatus === 'syncing' ? 'animate-pulse' : ''} />
              )}
              <span className="hidden md:inline">
                {syncStatus === 'error'
                  ? 'Error Nube (Reintentar)'
                  : syncStatus === 'syncing'
                  ? 'Sincronizando...'
                  : `Nube v${remoteVersion}`}
              </span>
            </button>

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
            { id: 'fichas', label: '📋 Fichas Alumnas', count: fichas.length },
            { id: 'ingresos', label: '💵 Ingresos', count: ingresos.length },
            { id: 'egresos', label: '📉 Egresos', count: egresos.length },
            { id: 'dashboard', label: '📊 Métricas & P&L' },
            { id: 'auditoria', label: '🛡️ Auditoría', count: logsAuditoria.length },
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

              <div className="flex items-center gap-2">
                <button
                  onClick={exportarAlumnasExcel}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 transition cursor-pointer"
                  title="Exportar Alumnas a Excel"
                >
                  <FileSpreadsheet size={14} className="text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={exportarAlumnasPDF}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 transition cursor-pointer"
                  title="Exportar Alumnas a PDF / Imprimir"
                >
                  <Printer size={14} className="text-rose-600" />
                  <span>PDF</span>
                </button>
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
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Nueva Alumna</span>
                </button>
              </div>
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
                                if (window.confirm(`¿Seguro que deseas eliminar a ${a.nombre_completo}? Esta acción quedará registrada en Auditoría.`)) {
                                  setAlumnas((prev) => prev.filter((x) => x.codigo !== a.codigo));
                                  registrarLogAuditoria(
                                    'ALUMNAS',
                                    'CAMBIO_CUOTA_ALUMNA',
                                    `Eliminación del padrón de la alumna ${a.nombre_completo} (${a.codigo})`,
                                    `${a.moneda_preferida} ${a.cuota_mensual}`,
                                    '0 (Alumna eliminada)'
                                  );
                                }
                              }}
                              className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100 cursor-pointer"
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

              <div className="flex items-center gap-2">
                <button
                  onClick={exportarVencimientosExcel}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 transition cursor-pointer"
                  title="Exportar Vencimientos a Excel"
                >
                  <FileSpreadsheet size={14} className="text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={exportarVencimientosPDF}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 transition cursor-pointer"
                  title="Exportar Vencimientos a PDF / Imprimir"
                >
                  <Printer size={14} className="text-rose-600" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => setTab('recordatorios')}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 shrink-0 cursor-pointer"
                >
                  <Send size={14} />
                  <span>⚡ Enviar Recordatorios Masivos</span>
                </button>
              </div>
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
                        <button
                          type="button"
                          onClick={() => {
                            const cuerpo = construirMensaje(plantillaMsg, al, item.montoEst, item.moneda, item.diaCobro, item.diasRestantes, item.estado);
                            abrirModalEmailBox(al.email || '', al.nombre_completo, `Recordatorio TotalHIIT - ${al.nombre_completo}`, cuerpo);
                          }}
                          className="rounded-xl border border-stone-200 bg-stone-50 p-2 text-stone-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition flex items-center justify-center cursor-pointer"
                          title="Copiar / Enviar por Email"
                        >
                          <Mail size={14} />
                        </button>
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
                      abrirModalEmailBox(al.email, al.nombre_completo, `Recordatorio TotalHIIT - ${al.nombre_completo}`, msg);
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
                              <button
                                type="button"
                                onClick={() => {
                                  const msg = construirMensaje(plantillaMsg, al, item.montoEst, item.moneda, item.diaCobro, item.diasRestantes, item.estado);
                                  abrirModalEmailBox(al.email || '', al.nombre_completo, `Recordatorio TotalHIIT - ${al.nombre_completo}`, msg);
                                  setEnviadosSesion((prev) => new Set(prev).add(al.codigo));
                                }}
                                className="rounded-lg bg-stone-100 px-2 py-1 text-stone-700 font-bold hover:bg-stone-200 cursor-pointer"
                                title="Copiar / Enviar por Email"
                              >
                                <Mail size={13} className="inline mr-1" />
                                Email
                              </button>
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
        {/* PESTAÑA: FICHAS DE REGISTRO E HISTORIAL (GOOGLE FORM INTEGRADO)*/}
        {/* ============================================================== */}
        {tab === 'fichas' && (
          <div className="space-y-4">
            {/* Banner Enlace Compartible para Alumnas */}
            <div className="rounded-3xl border border-rose-200 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={18} className="text-rose-600" />
                    <h3 className="text-sm font-bold text-stone-900">
                      Formulario de Ingreso de Alumnas (Reemplazo Google Forms)
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600">
                    Pásale este enlace a las nuevas clientas. Cada alumna llena sus datos de salud y objetivos, y al pulsar <strong>FINALIZAR REGISTRO</strong> la ficha se bloquea y queda registrada aquí.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={exportarTodasFichasExcel}
                    className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs transition cursor-pointer"
                    title="Exportar Todas las Fichas a Excel"
                  >
                    <FileSpreadsheet size={14} className="text-emerald-600" />
                    <span>Excel</span>
                  </button>
                  <button
                    onClick={exportarTodasFichasPDF}
                    className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs transition cursor-pointer"
                    title="Exportar Todas las Fichas a PDF"
                  >
                    <Printer size={14} className="text-rose-600" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* Caja de Enlace Rápido para Enviar a Alumna */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-rose-200/60">
                <div className="flex-1 flex items-center gap-2 rounded-2xl bg-white border border-rose-300 px-3 py-2 text-xs font-mono font-bold text-rose-800 shadow-inner">
                  <span className="text-stone-400 select-none">🔗 Link:</span>
                  <span className="truncate">https://totalhiit.pages.dev/crm/registro</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText('https://totalhiit.pages.dev/crm/registro');
                        setCopiadoLinkRegistro(true);
                        setTimeout(() => setCopiadoLinkRegistro(false), 2500);
                      } catch {}
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-sm transition cursor-pointer"
                  >
                    {copiadoLinkRegistro ? <CheckCircle2 size={14} className="text-emerald-300" /> : <Copy size={14} />}
                    <span>{copiadoLinkRegistro ? '¡Enlace Copiado!' : 'Copiar Link para Alumna'}</span>
                  </button>

                  <a
                    href="/crm/registro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                    title="Ver cómo ve el formulario la alumna"
                  >
                    <ExternalLink size={14} />
                    <span className="hidden sm:inline">Probar Formulario</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Barra de Filtros Fichas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-2xl border border-stone-200 bg-white p-3 shadow-xs">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar por alumna, apodo, email, whatsapp, ciudad..."
                  value={busquedaFichas}
                  onChange={(e) => setBusquedaFichas(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <select
                  value={filtroObjetivoFichas}
                  onChange={(e) => setFiltroObjetivoFichas(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none font-semibold text-stone-700"
                >
                  <option value="todos">Todos los objetivos principales</option>
                  <option value="Corporal: Bajar grasa y aumentar masa muscular">
                    🏋️ Corporal: Bajar grasa y aumentar masa muscular
                  </option>
                  <option value="Mejorar tu salud de manera integral">
                    🌿 Mejorar tu salud de manera integral
                  </option>
                </select>
              </div>
            </div>

            {/* Tabla de Fichas Recibidas */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 bg-stone-50 font-bold text-stone-600">
                    <tr>
                      <th className="py-3 px-3.5">Fecha</th>
                      <th className="py-3 px-3.5">Alumna</th>
                      <th className="py-3 px-3.5">Contacto</th>
                      <th className="py-3 px-3.5">Ubicación</th>
                      <th className="py-3 px-3.5">Contextura</th>
                      <th className="py-3 px-3.5">Alergias / Lesiones</th>
                      <th className="py-3 px-3.5">Meta Principal</th>
                      <th className="py-3 px-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {fichasFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-stone-400">
                          No se encontraron fichas de registro con los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      fichasFiltradas.map((f) => {
                        const yaEnPadron = alumnas.some(
                          (a) => a.email?.toLowerCase() === f.email.toLowerCase() || a.nombre_completo.toLowerCase() === f.nombre_completo.toLowerCase()
                        );

                        return (
                          <tr key={f.id} className="hover:bg-stone-50/80 transition">
                            <td className="py-3 px-3.5 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                              {f.fecha_registro.split(' ')[0]}
                            </td>
                            <td className="py-3 px-3.5">
                              <div className="font-bold text-stone-900">{f.nombre_completo}</div>
                              {f.apodo && <span className="text-[10px] text-rose-600 font-semibold">"{f.apodo}"</span>}
                            </td>
                            <td className="py-3 px-3.5">
                              <div className="text-stone-700">{f.email}</div>
                              <div className="text-[11px] text-stone-500 font-mono">{f.telefono_whatsapp}</div>
                            </td>
                            <td className="py-3 px-3.5 text-stone-600">{f.localidad_pais}</td>
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              <div className="font-bold text-stone-800">{f.altura} • {f.peso}</div>
                              <div className="text-[10px] text-stone-500">Talla: {f.talla_remera}</div>
                            </td>
                            <td className="py-3 px-3.5 text-stone-600 max-w-xs truncate" title={f.alergias}>
                              {f.alergias !== 'Ninguna conocida' && f.alergias !== 'Ninguna indicada' && f.alergias !== 'Ninguna' ? (
                                <span className="rounded bg-red-50 text-red-700 px-1.5 py-0.5 text-[10px] font-bold mr-1">
                                  ⚠️ {f.alergias}
                                </span>
                              ) : (
                                <span className="text-[11px] text-stone-400">Sin alergias</span>
                              )}
                              {f.detalle_lesiones && (
                                <span className="block text-[10px] text-amber-700 truncate">
                                  🩹 {f.detalle_lesiones}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3.5">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${
                                  f.objetivo_principal.includes('Corporal')
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {f.objetivo_principal.includes('Corporal') ? 'Composición Corporal' : 'Salud Integral'}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-right whitespace-nowrap space-x-1">
                              <button
                                onClick={() => setFichaModal(f)}
                                className="rounded-lg bg-stone-100 p-1.5 text-stone-700 hover:bg-stone-200 cursor-pointer"
                                title="Ver Ficha Completa"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                onClick={() => exportarFichaIndividualPDF(f)}
                                className="rounded-lg bg-stone-100 p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Exportar Ficha a PDF"
                              >
                                <Printer size={13} />
                              </button>
                              {!yaEnPadron ? (
                                <button
                                  onClick={() => pasarFichaAAlumna(f)}
                                  className="rounded-lg bg-emerald-50 px-2 py-1 text-emerald-700 font-bold hover:bg-emerald-100 cursor-pointer"
                                  title="Incorporar al padrón de alumnas del CRM"
                                >
                                  <UserCheck size={12} className="inline mr-1" />
                                  + Alumna
                                </button>
                              ) : (
                                <span className="rounded-lg bg-stone-100 px-2 py-1 text-[10px] font-bold text-stone-500">
                                  ✓ En Padrón
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
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
              <div className="flex items-center gap-2">
                <button
                  onClick={exportarIngresosExcel}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 transition cursor-pointer"
                  title="Exportar Ingresos a Excel"
                >
                  <FileSpreadsheet size={14} className="text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={exportarIngresosPDF}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 transition cursor-pointer"
                  title="Exportar Ingresos a PDF / Imprimir"
                >
                  <Printer size={14} className="text-rose-600" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={abrirNuevoIngreso}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs transition cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Registrar Ingreso</span>
                </button>
              </div>
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
              {/* Filtro Cuota Pagada */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Cuota Pagada</label>
                <select
                  value={filtroIngMes}
                  onChange={(e) => setFiltroIngMes(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none"
                >
                  <option value="todos">Todas las cuotas</option>
                  {cuotasPagadasDisponibles.map((cuota) => (
                    <option key={cuota} value={cuota}>{cuota}</option>
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

              {/* Filtro Código */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Código</label>
                <select
                  value={filtroIngCodigo}
                  onChange={(e) => {
                    const cod = e.target.value;
                    setFiltroIngCodigo(cod);
                    if (cod !== 'todos' && filtroIngAlumna !== 'todas' && filtroIngAlumna !== cod) {
                      setFiltroIngAlumna('todas');
                    }
                  }}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none"
                >
                  <option value="todos">Todos los códigos</option>
                  {alumnasOrdenadasPorCodigo.map((a) => (
                    <option key={a.codigo} value={a.codigo}>{a.codigo}</option>
                  ))}
                </select>
              </div>

              {/* Filtro Alumna (Nombre y Apellido) */}
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Alumna</label>
                <select
                  value={filtroIngAlumna}
                  onChange={(e) => {
                    const cod = e.target.value;
                    setFiltroIngAlumna(cod);
                    if (cod !== 'todas' && filtroIngCodigo !== 'todos' && filtroIngCodigo !== cod) {
                      setFiltroIngCodigo('todos');
                    }
                  }}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none"
                >
                  <option value="todas">Todas las alumnas</option>
                  {alumnasOrdenadasPorNombre.map((a) => (
                    <option key={a.codigo} value={a.codigo}>{a.nombre_completo}</option>
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
                      <th className="py-3 px-3.5">Cuota Pagada</th>
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
                      const mesLabel = ing.mes_pagado_label || (ing.mes_periodo ? `${NOMBRES_MESES[ing.mes_periodo - 1]} ${ing.anio_periodo}` : '—');

                      return (
                        <tr key={ing.id} className="hover:bg-stone-50/80 transition">
                          <td className="py-3 px-3.5 text-stone-500 whitespace-nowrap">{ing.fecha_pago}</td>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-2 py-0.5 font-bold text-rose-700 text-[11px]">
                              <Calendar size={11} className="text-rose-500" />
                              <span>{mesLabel}</span>
                            </span>
                          </td>
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
                          <td className="py-3 px-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => abrirEditarIngreso(ing)}
                                className="rounded-lg p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                                title="Editar Ingreso"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => eliminarIngreso(ing)}
                                className="rounded-lg p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                title="Eliminar Ingreso"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
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
              <div className="flex items-center gap-2">
                <button
                  onClick={exportarEgresosExcel}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 transition cursor-pointer"
                  title="Exportar Egresos a Excel"
                >
                  <FileSpreadsheet size={14} className="text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={exportarEgresosPDF}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 transition cursor-pointer"
                  title="Exportar Egresos a PDF / Imprimir"
                >
                  <Printer size={14} className="text-rose-600" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={abrirNuevoEgreso}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-800 px-4 py-2 text-xs font-bold text-white hover:bg-stone-900 shadow-xs transition cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Declarar Egreso</span>
                </button>
              </div>
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
                        <td className="py-3 px-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => abrirEditarEgreso(egr)}
                              className="rounded-lg p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                              title="Editar Egreso"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => eliminarEgreso(egr)}
                              className="rounded-lg p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                              title="Eliminar Egreso"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
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
        {/* PESTAÑA: AUDITORÍA & LOGS (SOLO LECTURA - REQUERIMIENTO 3)      */}
        {/* ============================================================== */}
        {tab === 'auditoria' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-rose-600" />
                  <span>Historial de Auditoría & Logs del Sistema</span>
                  <span className="rounded-full bg-stone-100 border border-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-600">
                    🔒 Solo Lectura
                  </span>
                </h3>
                <p className="text-xs text-stone-500">
                  Registro cronológico estricto e inmutable de modificaciones y eliminaciones en ingresos, egresos y cambios de cuotas de alumnas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportarAuditoriaExcel}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 transition cursor-pointer"
                  title="Exportar Registro de Auditoría a Excel"
                >
                  <FileSpreadsheet size={14} className="text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={exportarAuditoriaPDF}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 transition cursor-pointer"
                  title="Exportar Registro de Auditoría a PDF / Imprimir"
                >
                  <Printer size={14} className="text-rose-600" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* Barra de Filtros Auditoría */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-2xl border border-stone-200 bg-white p-3 shadow-xs">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Buscar en Detalle o Email</label>
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar evento..."
                    value={busquedaAuditoria}
                    onChange={(e) => setBusquedaAuditoria(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white pl-7 pr-2 py-2 text-xs outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Módulo</label>
                <select
                  value={filtroModuloAuditoria}
                  onChange={(e) => setFiltroModuloAuditoria(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none"
                >
                  <option value="todos">Todos los módulos</option>
                  <option value="INGRESOS">💵 Ingresos</option>
                  <option value="EGRESOS">📉 Egresos</option>
                  <option value="ALUMNAS">👥 Alumnas</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-0.5">Tipo de Acción</label>
                <select
                  value={filtroAccionAuditoria}
                  onChange={(e) => setFiltroAccionAuditoria(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs outline-none"
                >
                  <option value="todas">Todas las acciones</option>
                  <option value="EDICION_INGRESO">✏️ Edición de Ingreso</option>
                  <option value="ELIMINACION_INGRESO">🗑️ Eliminación de Ingreso</option>
                  <option value="EDICION_EGRESO">✏️ Edición de Egreso</option>
                  <option value="ELIMINACION_EGRESO">🗑️ Eliminación de Egreso</option>
                  <option value="CAMBIO_CUOTA_ALUMNA">💰 Cambio Cuota Alumna</option>
                </select>
              </div>
            </div>

            {/* Tabla de Logs de Auditoría */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 bg-stone-50 font-bold text-stone-600">
                    <tr>
                      <th className="py-3 px-3.5">Fecha y Hora</th>
                      <th className="py-3 px-3.5">Admin Responsable</th>
                      <th className="py-3 px-3.5">Módulo</th>
                      <th className="py-3 px-3.5">Acción</th>
                      <th className="py-3 px-3.5">Detalle de la Operación</th>
                      <th className="py-3 px-3.5">Valor Previo</th>
                      <th className="py-3 px-3.5">Valor Nuevo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {logsAuditoriaFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-stone-400">
                          No se encontraron registros de auditoría que coincidan con los filtros.
                        </td>
                      </tr>
                    ) : (
                      logsAuditoriaFiltrados.map((log) => {
                        let badgeColor = 'bg-stone-100 text-stone-700';
                        let badgeIcon = '📋';
                        let accionLabel: string = log.tipo_accion;

                        if (log.tipo_accion === 'EDICION_INGRESO') {
                          badgeColor = 'bg-blue-50 text-blue-700 border border-blue-200';
                          badgeIcon = '✏️';
                          accionLabel = 'Edición Ingreso';
                        } else if (log.tipo_accion === 'ELIMINACION_INGRESO') {
                          badgeColor = 'bg-red-50 text-red-700 border border-red-200';
                          badgeIcon = '🗑️';
                          accionLabel = 'Eliminación Ingreso';
                        } else if (log.tipo_accion === 'EDICION_EGRESO') {
                          badgeColor = 'bg-blue-50 text-blue-700 border border-blue-200';
                          badgeIcon = '✏️';
                          accionLabel = 'Edición Egreso';
                        } else if (log.tipo_accion === 'ELIMINACION_EGRESO') {
                          badgeColor = 'bg-red-50 text-red-700 border border-red-200';
                          badgeIcon = '🗑️';
                          accionLabel = 'Eliminación Egreso';
                        } else if (log.tipo_accion === 'CAMBIO_CUOTA_ALUMNA') {
                          badgeColor = 'bg-amber-50 text-amber-800 border border-amber-200';
                          badgeIcon = '💰';
                          accionLabel = 'Cambio Cuota';
                        }

                        return (
                          <tr key={log.id} className="hover:bg-stone-50/80 transition">
                            <td className="py-3 px-3.5 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                              {log.fecha_hora}
                            </td>
                            <td className="py-3 px-3.5 font-mono text-stone-700 font-semibold whitespace-nowrap">
                              {log.admin_email}
                            </td>
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                                {log.modulo === 'INGRESOS' ? '💵 INGRESOS' : log.modulo === 'EGRESOS' ? '📉 EGRESOS' : '👥 ALUMNAS'}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1 w-fit ${badgeColor}`}>
                                <span>{badgeIcon}</span>
                                <span>{accionLabel}</span>
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-stone-800 max-w-xs">{log.detalle}</td>
                            <td className="py-3 px-3.5 font-mono text-stone-500 line-through whitespace-nowrap">
                              {log.monto_previo || '—'}
                            </td>
                            <td className="py-3 px-3.5 font-mono font-bold text-stone-900 whitespace-nowrap">
                              {log.monto_nuevo || '—'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
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
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (nuevaClave.trim() !== confirmarClave.trim()) {
                    setMsgSeguridad('⚠️ Las contraseñas no coinciden.');
                    return;
                  }
                  if (nuevaClave.trim().length < 6) {
                    setMsgSeguridad('⚠️ Mínimo 6 caracteres.');
                    return;
                  }
                  const res = await changeCrmPasswordRemote(adminEmail, adminClave, nuevaClave.trim());
                  localStorage.setItem(LLAVE_STORAGE_CLAVE, nuevaClave.trim());
                  sessionStorage.setItem('totalhiit_crm_admin_clave', nuevaClave.trim());
                  setAdminClave(nuevaClave.trim());
                  setMsgSeguridad(
                    res.ok
                      ? '✅ Contraseña actualizada en la nube para todos los administradores.'
                      : '✅ Contraseña actualizada localmente (aviso nube: ' + (res.error || 'sin conexión') + ').'
                  );
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
                if (alumnaEdit && (alumnaEdit.cuota_mensual !== nueva.cuota_mensual || alumnaEdit.moneda_preferida !== nueva.moneda_preferida)) {
                  registrarLogAuditoria(
                    'ALUMNAS',
                    'CAMBIO_CUOTA_ALUMNA',
                    `Modificación de cuota mensual para ${nueva.nombre_completo} (${nueva.codigo})`,
                    `${alumnaEdit.moneda_preferida} ${alumnaEdit.cuota_mensual}`,
                    `${nueva.moneda_preferida} ${nueva.cuota_mensual}`
                  );
                }
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
                <button
                  type="button"
                  onClick={() => {
                    abrirModalEmailBox(alumnaMsg.email || '', alumnaMsg.nombre_completo, `Recordatorio TotalHIIT - ${alumnaMsg.nombre_completo}`, textoMsg);
                    setModalMsg(false);
                  }}
                  className="w-full rounded-xl bg-stone-100 py-2 text-center text-xs font-bold text-stone-800 hover:bg-stone-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail size={15} />
                  <span>Preparar / Copiar para Correo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL REGISTRAR / EDITAR INGRESO (REQUERIMIENTO 2)             */}
      {/* ============================================================== */}
      {modalIngreso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-stone-900">{ingresoEdit ? 'Editar Ingreso' : 'Registrar Ingreso'}</h3>
              <button onClick={() => setModalIngreso(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const montoMes = Number(ingMonto) || 0;

                if (ingresoEdit) {
                  const labelMes = `${NOMBRES_MESES[ingMesPeriodo - 1]} ${ingAnioPeriodo}`;
                  const itemActualizado: Ingreso = {
                    ...ingresoEdit,
                    tipo_ingreso: ingTipo,
                    alumna_codigo: ingTipo === 'CUOTA_ALUMNA' ? ingAlumnaCod : undefined,
                    cliente_o_marca: ingTipo !== 'CUOTA_ALUMNA' ? ingClienteMarca : undefined,
                    concepto: ingConcepto,
                    fecha_pago: ingFecha,
                    moneda_original: ingMoneda,
                    monto_original: montoMes,
                    tasa_a_usd: ingTasaUsd,
                    tasa_a_ars: ingTasaArs,
                    usd_equivalente: Math.round(montoMes * ingTasaUsd * 100) / 100,
                    ars_equivalente: Math.round(montoMes * ingTasaArs * 100) / 100,
                    mes_periodo: ingMesPeriodo,
                    anio_periodo: ingAnioPeriodo,
                    mes_pagado_label: labelMes,
                    metodo_pago: ingMetodo,
                  };
                  setIngresos((prev) => prev.map((x) => (x.id === ingresoEdit.id ? itemActualizado : x)));
                  registrarLogAuditoria(
                    'INGRESOS',
                    'EDICION_INGRESO',
                    `Edición del ingreso #${ingresoEdit.id}: ${ingConcepto}`,
                    `${ingresoEdit.moneda_original} ${ingresoEdit.monto_original}`,
                    `${ingMoneda} ${montoMes}`
                  );
                  setModalIngreso(false);
                  return;
                }

                const cantMeses = ingTipo === 'CUOTA_ALUMNA' ? Math.max(Number(ingMesesAdelantados) || 1, 1) : 1;
                const nuevos: Ingreso[] = [];

                for (let k = 0; k < cantMeses; k++) {
                  let m = ingMesPeriodo + k;
                  let a = ingAnioPeriodo;
                  while (m > 12) {
                    m -= 12;
                    a += 1;
                  }
                  const labelMes = `${NOMBRES_MESES[m - 1]} ${a}`;
                  const conc = cantMeses > 1
                    ? `${ingConcepto} (Mes ${k + 1}/${cantMeses} - ${labelMes})`
                    : ingTipo === 'CUOTA_ALUMNA'
                    ? `${ingConcepto} (${labelMes})`
                    : ingConcepto;

                  nuevos.push({
                    id: `ing-${Date.now()}-${k}`,
                    tipo_ingreso: ingTipo,
                    alumna_codigo: ingTipo === 'CUOTA_ALUMNA' ? ingAlumnaCod : undefined,
                    cliente_o_marca: ingTipo !== 'CUOTA_ALUMNA' ? ingClienteMarca : undefined,
                    concepto: conc,
                    fecha_pago: ingFecha,
                    moneda_original: ingMoneda,
                    monto_original: montoMes,
                    tasa_a_usd: ingTasaUsd,
                    tasa_a_ars: ingTasaArs,
                    usd_equivalente: Math.round(montoMes * ingTasaUsd * 100) / 100,
                    ars_equivalente: Math.round(montoMes * ingTasaArs * 100) / 100,
                    mes_periodo: m,
                    anio_periodo: a,
                    mes_pagado_label: labelMes,
                    meses_adelantados: cantMeses,
                    metodo_pago: ingMetodo,
                    estado: 'APROBADO',
                  });
                }

                setIngresos((prev) => [...nuevos, ...prev]);
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
                <div className="space-y-2">
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

                  {/* Sección Mes Pagado y Meses Adelantados (Requerimiento 3) */}
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
                        <Calendar size={13} /> Mes Abonado & Pagos Adelantados
                      </span>
                      <span className="text-[10px] text-rose-600 font-semibold">1 alumna, N meses</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">Mes</label>
                        <select
                          value={ingMesPeriodo}
                          onChange={(e) => setIngMesPeriodo(Number(e.target.value))}
                          className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs font-semibold"
                        >
                          {NOMBRES_MESES.map((nom, idx) => (
                            <option key={idx + 1} value={idx + 1}>{nom}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">Año</label>
                        <input
                          type="number"
                          value={ingAnioPeriodo}
                          onChange={(e) => setIngAnioPeriodo(Number(e.target.value))}
                          className="w-full rounded-xl border border-stone-300 bg-white p-2 text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">¿Meses a pagar?</label>
                        <select
                          value={ingMesesAdelantados}
                          onChange={(e) => setIngMesesAdelantados(Number(e.target.value))}
                          className="w-full rounded-xl border border-rose-300 bg-white p-2 text-xs font-bold text-rose-700"
                        >
                          <option value={1}>1 mes (Normal)</option>
                          <option value={2}>2 meses</option>
                          <option value={3}>3 meses (Trimestre)</option>
                          <option value={6}>6 meses (Semestre)</option>
                          <option value={12}>12 meses (Año)</option>
                        </select>
                      </div>
                    </div>

                    {ingMesesAdelantados > 1 && (
                      <div className="rounded-xl bg-white border border-rose-200 p-2 text-[11px] text-rose-800">
                        💡 Se generarán <strong>{ingMesesAdelantados} registros individuales</strong> consecutivos (cuota mensual: ${ingMonto} {ingMoneda}). Total cobrado hoy: <strong>${ingMonto * ingMesesAdelantados} {ingMoneda}</strong>.
                      </div>
                    )}
                  </div>
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
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Fecha de Cobro</label>
                  <input
                    type="date"
                    value={ingFecha}
                    onChange={(e) => {
                      const f = e.target.value;
                      setIngFecha(f);
                      const cot = obtenerCotizacionParaFecha(f);
                      if (ingMoneda === 'USD') {
                        setIngTasaUsd(1);
                        setIngTasaArs(cot.usd_a_ars);
                      } else if (ingMoneda === 'EUR') {
                        setIngTasaUsd(Math.round((cot.eur_a_ars / cot.usd_a_ars) * 10000) / 10000);
                        setIngTasaArs(cot.eur_a_ars);
                      } else if (ingMoneda === 'ARS') {
                        setIngTasaUsd(Math.round((1 / cot.usd_a_ars) * 1000000) / 1000000);
                        setIngTasaArs(1);
                      }
                    }}
                    required
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  />
                  <span className="block mt-0.5 text-[9px] text-stone-500">
                    Foto cambiaria: 1 USD = ${ingTasaArs} ARS ({obtenerCotizacionParaFecha(ingFecha).fuente})
                  </span>
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
                  {ingresoEdit ? 'Guardar Cambios' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL REGISTRAR / EDITAR EGRESO (REQUERIMIENTO 2)              */}
      {/* ============================================================== */}
      {modalEgreso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-stone-900">{egresoEdit ? 'Editar Egreso' : 'Declarar Egreso'}</h3>
              <button onClick={() => setModalEgreso(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const monto = Number(egrMonto) || 0;

                if (egresoEdit) {
                  const itemActualizado: Egreso = {
                    ...egresoEdit,
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
                  };
                  setEgresos((prev) => prev.map((x) => (x.id === egresoEdit.id ? itemActualizado : x)));
                  registrarLogAuditoria(
                    'EGRESOS',
                    'EDICION_EGRESO',
                    `Edición de egreso #${egresoEdit.id}: ${egrConcepto}`,
                    `${egresoEdit.moneda_original} ${egresoEdit.monto_original}`,
                    `${egrMoneda} ${monto}`
                  );
                  setModalEgreso(false);
                  return;
                }

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
                  {egresoEdit ? 'Guardar Cambios' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL COPIAR RECORDATORIO POR EMAIL (REQUERIMIENTO 1)          */}
      {/* ============================================================== */}
      {modalEmailBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-rose-600" />
                <h3 className="text-sm font-bold text-stone-900">
                  Enviar Recordatorio por Email — {emailAlumnaNombre}
                </h3>
              </div>
              <button
                onClick={() => setModalEmailBox(false)}
                className="text-stone-400 hover:text-stone-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Copia los datos con un solo clic para pegarlos en tu cliente de correo favorito (Gmail, Outlook Web, Yahoo, etc.) sin abrir aplicaciones externas no deseadas.
            </p>

            {/* Destinatario */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-stone-600">Destinatario (Email):</label>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(emailDestino);
                      setCopiadoEmailCampo('email');
                      setTimeout(() => setCopiadoEmailCampo('ninguno'), 2000);
                    } catch {}
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  {copiadoEmailCampo === 'email' ? <CheckCircle2 size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiadoEmailCampo === 'email' ? '¡Email Copiado!' : 'Copiar Email'}</span>
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={emailDestino}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 font-mono text-xs text-stone-800 select-all"
              />
            </div>

            {/* Asunto */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-stone-600">Asunto del Correo:</label>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(asuntoEmail);
                      setCopiadoEmailCampo('asunto');
                      setTimeout(() => setCopiadoEmailCampo('ninguno'), 2000);
                    } catch {}
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  {copiadoEmailCampo === 'asunto' ? <CheckCircle2 size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiadoEmailCampo === 'asunto' ? '¡Asunto Copiado!' : 'Copiar Asunto'}</span>
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={asuntoEmail}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 font-semibold text-xs text-stone-800 select-all"
              />
            </div>

            {/* Cuerpo del Mensaje */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-stone-600">Cuerpo del Mensaje:</label>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(cuerpoEmail);
                      setCopiadoEmailCampo('cuerpo');
                      setTimeout(() => setCopiadoEmailCampo('ninguno'), 2000);
                    } catch {}
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  {copiadoEmailCampo === 'cuerpo' ? <CheckCircle2 size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiadoEmailCampo === 'cuerpo' ? '¡Mensaje Copiado!' : 'Copiar Mensaje Completo'}</span>
                </button>
              </div>
              <textarea
                rows={9}
                readOnly
                value={cuerpoEmail}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs leading-relaxed text-stone-800 select-all font-sans"
              />
            </div>

            {/* Acciones Rápidas */}
            <div className="pt-2 border-t space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const textoTotal = `Para: ${emailDestino}\nAsunto: ${asuntoEmail}\n\n${cuerpoEmail}`;
                    try {
                      await navigator.clipboard.writeText(textoTotal);
                      setCopiadoEmailCampo('todo');
                      setTimeout(() => setCopiadoEmailCampo('ninguno'), 2000);
                    } catch {}
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 py-2.5 font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                >
                  {copiadoEmailCampo === 'todo' ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copiadoEmailCampo === 'todo' ? '¡Todo Copiado!' : '📋 Copiar Todo'}</span>
                </button>

                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailDestino)}&su=${encodeURIComponent(asuntoEmail)}&body=${encodeURIComponent(cuerpoEmail)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2.5 font-bold text-white hover:bg-red-700 shadow-xs cursor-pointer"
                >
                  <Mail size={14} />
                  <span>Redactar en Gmail Web</span>
                </a>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setModalEmailBox(false)}
                  className="rounded-xl border border-stone-300 px-4 py-2 font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL HISTORIAL DE COTIZACIONES (REQUERIMIENTO 2)               */}
      {/* ============================================================== */}
      {modalHistorialCot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <History size={16} className="text-rose-600" />
                <h3 className="text-sm font-bold text-stone-900">Historial de Cotizaciones de Divisas</h3>
              </div>
              <button onClick={() => setModalHistorialCot(false)} className="text-stone-400 hover:text-stone-600 text-sm">✕</button>
            </div>

            <p className="text-xs text-stone-500">
              Registro diario del Dólar Blue, Oficial y Euro vs Peso Argentino. Cada ingreso o egreso conserva la cotización exacta del día en que se realizó la operación (la foto guardada).
            </p>

            <div className="overflow-hidden rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-stone-200 bg-stone-50 font-bold text-stone-600">
                  <tr>
                    <th className="py-2.5 px-3">Fecha</th>
                    <th className="py-2.5 px-3">USD Blue (Venta)</th>
                    <th className="py-2.5 px-3">USD Oficial</th>
                    <th className="py-2.5 px-3">Euro Oficial</th>
                    <th className="py-2.5 px-3">Fuente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {historialCot.map((h) => (
                    <tr key={h.fecha} className="hover:bg-stone-50/80">
                      <td className="py-2.5 px-3 font-semibold text-stone-800">{h.fecha}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">${h.usd_blue_venta}</td>
                      <td className="py-2.5 px-3 font-mono text-stone-700">${h.usd_oficial_venta}</td>
                      <td className="py-2.5 px-3 font-mono text-blue-700">${h.eur_venta}</td>
                      <td className="py-2.5 px-3 text-stone-500 text-[11px]">{h.fuente}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <button
                type="button"
                onClick={async () => {
                  setActualizandoCot(true);
                  const res = await consultarDolarApi();
                  if (res) {
                    setCotizacionLive(res);
                    setHistorialCot(cargarHistorialCotizaciones());
                  }
                  setActualizandoCot(false);
                }}
                disabled={actualizandoCot}
                className="flex items-center gap-1.5 rounded-xl border border-stone-300 px-3 py-1.5 font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                <RotateCcw size={12} className={actualizandoCot ? 'animate-spin' : ''} />
                <span>Actualizar hoy desde DolarApi</span>
              </button>

              <button
                type="button"
                onClick={() => setModalHistorialCot(false)}
                className="rounded-xl bg-rose-600 px-4 py-2 font-bold text-white hover:bg-rose-700 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL DETALLE COMPLETO DE FICHA ALUMNA (GOOGLE FORM)           */}
      {/* ============================================================== */}
      {fichaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ClipboardList size={18} className="text-rose-600" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Ficha Integral: {fichaModal.nombre_completo} {fichaModal.apodo ? `("${fichaModal.apodo}")` : ''}
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Registrado el {fichaModal.fecha_registro} • ID: {fichaModal.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setFichaModal(null)}
                className="text-stone-400 hover:text-stone-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Contenido en 10 Secciones Oficiales (49 Preguntas de Google Forms) */}
            <div className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
              {/* Sección 1: Datos Personales */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  1. Datos Personales & Identificación
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                  <div><strong>Correo Electrónico:</strong> {fichaModal.email}</div>
                  <div><strong>Nombre y Apellido:</strong> {fichaModal.nombre || fichaModal.nombre_completo.split(' ')[0]} {fichaModal.apellido || fichaModal.nombre_completo.split(' ').slice(1).join(' ')}</div>
                  <div><strong>Sexo:</strong> {fichaModal.sexo}</div>
                  <div><strong>Apodo preferido:</strong> {fichaModal.apodo || '—'}</div>
                  <div><strong>Fecha de Nacimiento:</strong> {fichaModal.fecha_nacimiento}</div>
                  <div><strong>Edad:</strong> {fichaModal.edad} años</div>
                  <div className="sm:col-span-2"><strong>Dónde vives, localidad, País:</strong> {fichaModal.localidad_pais}</div>
                  <div className="sm:col-span-2 text-[10px] text-stone-400 font-mono">
                    Marca temporal original: {fichaModal.marca_temporal || fichaModal.fecha_registro}
                  </div>
                </div>
              </div>

              {/* Sección 2: Contextura Corporal */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  2. Contextura Corporal & Tallas
                </span>
                <div className="grid grid-cols-3 gap-2 text-stone-700">
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-center shadow-2xs">
                    <span className="text-[10px] text-stone-400 block font-bold">ALTURA (M)</span>
                    <strong className="text-sm text-stone-900">{fichaModal.altura}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-center shadow-2xs">
                    <span className="text-[10px] text-stone-400 block font-bold">PESO (KG)</span>
                    <strong className="text-sm text-stone-900">{fichaModal.peso}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-center shadow-2xs">
                    <span className="text-[10px] text-stone-400 block font-bold">TALLA DE REMERA</span>
                    <strong className="text-sm text-stone-900">Talla {fichaModal.talla_remera}</strong>
                  </div>
                </div>
              </div>

              {/* Sección 3: Datos Médicos Generales */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  3. Datos Médicos & Embarazos
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-stone-700">
                  <div><strong>Embarazos?:</strong> {fichaModal.embarazos}</div>
                  <div><strong>Tienes hijos?:</strong> {fichaModal.hijos}</div>
                  <div className="sm:col-span-3">
                    <strong>Alergias:</strong>{' '}
                    <span className={fichaModal.alergias !== 'Ninguna conocida' && fichaModal.alergias !== 'Ninguna indicada' && fichaModal.alergias !== 'Ninguna' ? 'text-red-700 font-bold' : ''}>
                      {fichaModal.alergias}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sección 4: Enfermedades y Patologías */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  4. Enfermedades, Patologías & Antecedentes Clínicos
                </span>
                <div className="space-y-1.5 text-stone-700">
                  <div>
                    <strong>¿Tuviste Coronavirus?:</strong> {fichaModal.tuvo_covid}
                    {fichaModal.secuelas_covid && <span className="text-amber-800 ml-1">— Secuelas: {fichaModal.secuelas_covid}</span>}
                  </div>
                  <div>
                    <strong>Problema articular/muscular/óseo:</strong> {fichaModal.problemas_musculares_oseos}
                    {(fichaModal.lesiones_desde_cuando || fichaModal.detalle_lesiones) && (
                      <span className="text-stone-800 block text-[11px] mt-0.5 ml-2">
                        ↳ ¿Desde cuándo? ¿Qué tienes?: {fichaModal.lesiones_desde_cuando || fichaModal.detalle_lesiones}
                      </span>
                    )}
                  </div>
                  {fichaModal.tratamiento_actual && (
                    <div><strong>Tratamiento actual:</strong> {fichaModal.tratamiento_actual}</div>
                  )}
                  <div>
                    <strong>Toma medicamentos diarios:</strong> {fichaModal.toma_medicamentos}
                    {(fichaModal.medicamentos_detalle || fichaModal.detalle_medicamentos) && (
                      <span className="text-stone-800 ml-1">
                        ({fichaModal.medicamentos_detalle || fichaModal.detalle_medicamentos})
                      </span>
                    )}
                  </div>
                  <div><strong>Discapacidad (motriz/auditiva/visual/verbal):</strong> {fichaModal.discapacidad || 'Ninguna'}</div>
                  {fichaModal.observaciones_medicas && (
                    <div><strong>Observaciones de utilidad:</strong> {fichaModal.observaciones_medicas}</div>
                  )}
                </div>
              </div>

              {/* Sección 5: Sustancias y Suplementos */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  5. Hábitos, Sustancias & Suplementación
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                  <div><strong>¿Consumes alcohol?:</strong> {fichaModal.consume_alcohol}</div>
                  <div>
                    <strong>¿Fumas?:</strong> {fichaModal.fuma}{' '}
                    {fichaModal.frecuencia_fuma ? `(Frecuencia: ${fichaModal.frecuencia_fuma})` : ''}
                  </div>
                  <div className="sm:col-span-2">
                    <strong>Suplementos / Hormonas / Anticonceptivos:</strong> {fichaModal.suplementos_anticonceptivos || 'Ninguno'}
                  </div>
                </div>
              </div>

              {/* Sección 6: Medios de Comunicación y Redes */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  6. Medios de Comunicación & Redes Sociales
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                  <div><strong>¿Cómo conoció TotalHIIT?:</strong> {fichaModal.como_conocio_totalhiit || '—'}</div>
                  <div><strong>Teléfono / WhatsApp:</strong> {fichaModal.telefono_whatsapp}</div>
                  <div><strong>Sumar a Grupo de WhatsApp:</strong> {fichaModal.sumar_grupo_whatsapp}</div>
                  <div><strong>Instagram de la Alumna:</strong> {fichaModal.instagram || '—'}</div>
                  <div className="sm:col-span-2">
                    <strong>Consentimiento fotos / grabaciones de clases:</strong> {fichaModal.consentimiento_fotos}
                  </div>
                  <div className="sm:col-span-2 rounded-xl border border-stone-200 bg-white p-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">
                      Seguimiento en Redes de TOTALHIIT:
                    </span>
                    <div className="grid grid-cols-3 gap-1 text-[11px]">
                      <div>📸 IG: <span className="font-semibold">{fichaModal.redes_instagram || '—'}</span></div>
                      <div>🎥 YT: <span className="font-semibold">{fichaModal.redes_youtube || '—'}</span></div>
                      <div>🏃 Seguirlos: <span className="font-semibold">{fichaModal.redes_voy_seguirlos || '—'}</span></div>
                    </div>
                  </div>
                  <div className="sm:col-span-2 rounded-xl bg-amber-50/70 border border-amber-200 p-2">
                    <strong className="text-amber-900 block text-[10px] uppercase">Contacto de Emergencia:</strong>
                    <span className="text-amber-950 font-medium">{fichaModal.contacto_emergencia}</span>
                  </div>
                </div>
              </div>

              {/* Sección 7: Objetivos y Metas */}
              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                  7. Objetivos & Metas
                </span>
                <div className="space-y-1.5 text-stone-800">
                  <div>
                    <strong>Objetivo Principal:</strong>{' '}
                    <span className="font-bold text-rose-700">{fichaModal.objetivo_principal}</span>
                  </div>
                  {fichaModal.motivo_totalhiit && (
                    <div><strong>¿Por qué decidiste TOTALHIIT?:</strong> {fichaModal.motivo_totalhiit}</div>
                  )}
                  {fichaModal.expectativas && (
                    <div><strong>¿Qué esperas recibir de TotalHIIT?:</strong> {fichaModal.expectativas}</div>
                  )}
                </div>
              </div>

              {/* Sección 8: Historia & Actividad Física */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  8. Historia & Actividad Física
                </span>
                <div className="space-y-1.5 text-stone-700">
                  <div>
                    <strong>¿Realiza actividad física actualmente?:</strong> {fichaModal.actividad_fisica_actual}
                    {fichaModal.detalle_actividad_actual && ` — ${fichaModal.detalle_actividad_actual}`}
                  </div>
                  {fichaModal.deportes_favoritos && (
                    <div><strong>3 Deportes o actividades favoritas:</strong> {fichaModal.deportes_favoritos}</div>
                  )}
                  {fichaModal.actividades_previas && (
                    <div><strong>Actividades que realizaste antes:</strong> {fichaModal.actividades_previas}</div>
                  )}
                  <div><strong>Horas aproximadas de sueño diario:</strong> {fichaModal.horas_sueno}</div>
                </div>
              </div>

              {/* Sección 9: Estado Emocional & Salud Mental */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                  9. Estado Emocional & Terapia
                </span>
                <div className="space-y-1.5 text-stone-700">
                  <div><strong>¿Cómo te sientes emocionalmente?:</strong> {fichaModal.estado_emocional || '—'}</div>
                  <div>
                    <strong>¿Asiste a terapia (tradicional o alternativa)?:</strong> {fichaModal.asiste_terapia || '—'}
                    {fichaModal.detalle_terapia && ` (${fichaModal.detalle_terapia})`}
                  </div>
                </div>
              </div>

              {/* Sección 10: Importante & Compromiso */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  10. Compromiso & Disposición de Mejora
                </span>
                <div className="text-stone-800">
                  <strong>¿Dispuesto/a a recibir nuestra ayuda para mejorar su salud de forma integral y divertida?:</strong>{' '}
                  <span className="font-extrabold text-emerald-700 text-xs uppercase ml-1">
                    ✓ {fichaModal.compromiso_ayuda}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer de Acciones del Modal */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => exportarFichaIndividualPDF(fichaModal)}
                  className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  <Printer size={13} className="text-rose-600" />
                  <span>Exportar a PDF</span>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    pasarFichaAAlumna(fichaModal);
                    setFichaModal(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                >
                  <UserCheck size={14} />
                  <span>+ Incorporar al Padrón de Alumnas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFichaModal(null)}
                  className="rounded-xl border border-stone-300 px-4 py-2 font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
