import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Edit2,
  Eye,
  EyeOff,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

// ==============================================================================
// TIPOS Y MODELO DE DATOS
// ==============================================================================

export interface Pais {
  id: number;
  nombre: string;
  codigo_iso: string;
  bandera: string;
}

export interface Alumna {
  codigo: string;
  nombre_completo: string;
  email?: string;
  telefono_whatsapp?: string;
  pais_id: number;
  moneda_preferida: 'USD' | 'EUR' | 'ARS';
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
  moneda_original: 'USD' | 'EUR' | 'ARS' | string;
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
  moneda_original: 'USD' | 'EUR' | 'ARS' | string;
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
  { id: 1, nombre: 'Estados Unidos', codigo_iso: 'US', bandera: '🇺🇸' },
  { id: 2, nombre: 'Argentina', codigo_iso: 'AR', bandera: '🇦🇷' },
  { id: 3, nombre: 'Alemania', codigo_iso: 'DE', bandera: '🇩🇪' },
  { id: 4, nombre: 'Finlandia', codigo_iso: 'FI', bandera: '🇫🇮' },
  { id: 5, nombre: 'Brasil', codigo_iso: 'BR', bandera: '🇧🇷' },
  { id: 6, nombre: 'Chile', codigo_iso: 'CL', bandera: '🇨🇱' },
  { id: 7, nombre: 'España', codigo_iso: 'ES', bandera: '🇪🇸' },
  { id: 8, nombre: 'México', codigo_iso: 'MX', bandera: '🇲🇽' },
];

const ALUMNAS_INICIALES: Alumna[] = [
  { codigo: '0001', nombre_completo: 'Raquel Hernandez', pais_id: 1, moneda_preferida: 'USD', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'raquel.hernandez@totalhiit.com', telefono_whatsapp: '+13055550101' },
  { codigo: '0002', nombre_completo: 'Jackie Boriziuk', pais_id: 2, moneda_preferida: 'ARS', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'jackie.boriziuk@totalhiit.com', telefono_whatsapp: '+5491155550102' },
  { codigo: '0003', nombre_completo: 'Esther Guisado', pais_id: 3, moneda_preferida: 'EUR', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'esther.guisado@totalhiit.com', telefono_whatsapp: '+4915155550103' },
  { codigo: '0004', nombre_completo: 'Magaly Jarquin', pais_id: 1, moneda_preferida: 'USD', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'magaly.jarquin@totalhiit.com', telefono_whatsapp: '+13055550104' },
  { codigo: '0005', nombre_completo: 'Argelia belen Jarquin', pais_id: 1, moneda_preferida: 'USD', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'argelia.jarquin@totalhiit.com', telefono_whatsapp: '+13055550105' },
  { codigo: '0006', nombre_completo: 'Paula Hoor', pais_id: 3, moneda_preferida: 'EUR', fecha_inicio: '2026-06-17', dia_de_pago: 17, activa: 1, email: 'paula.hoor@totalhiit.com', telefono_whatsapp: '+4915155550106' },
  { codigo: '0007', nombre_completo: 'Nataly Benitez', pais_id: 2, moneda_preferida: 'ARS', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'nataly.benitez@totalhiit.com', telefono_whatsapp: '+5491155550107' },
  { codigo: '0008', nombre_completo: 'Marlin Lopez', pais_id: 1, moneda_preferida: 'USD', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'marlin.lopez@totalhiit.com', telefono_whatsapp: '+13055550108' },
  { codigo: '0009', nombre_completo: 'Margareth Banegas', pais_id: 1, moneda_preferida: 'USD', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'margareth.banegas@totalhiit.com', telefono_whatsapp: '+13055550109' },
  { codigo: '0010', nombre_completo: 'Adilia Rodriguez', pais_id: 1, moneda_preferida: 'USD', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'adilia.rodriguez@totalhiit.com', telefono_whatsapp: '+13055550110' },
  { codigo: '0011', nombre_completo: 'Eileen Garcia', pais_id: 1, moneda_preferida: 'USD', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'eileen.garcia@totalhiit.com', telefono_whatsapp: '+13055550111' },
  { codigo: '0012', nombre_completo: 'Sonia Valeriano', pais_id: 1, moneda_preferida: 'USD', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'sonia.valeriano@totalhiit.com', telefono_whatsapp: '+13055550112' },
  { codigo: '0013', nombre_completo: 'Yolanda Montijo', pais_id: 1, moneda_preferida: 'USD', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'yolanda.montijo@totalhiit.com', telefono_whatsapp: '+13055550113' },
  { codigo: '0014', nombre_completo: 'Abygail Garcia', pais_id: 2, moneda_preferida: 'ARS', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'abygail.garcia@totalhiit.com', telefono_whatsapp: '+5491155550114' },
  { codigo: '0015', nombre_completo: 'Manuela Sarome', pais_id: 2, moneda_preferida: 'ARS', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'manuela.sarome@totalhiit.com', telefono_whatsapp: '+5491155550115' },
  { codigo: '0016', nombre_completo: 'Lousa Basili', pais_id: 3, moneda_preferida: 'EUR', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'lousa.basili@totalhiit.com', telefono_whatsapp: '+4915155550116' },
  { codigo: '0017', nombre_completo: 'Monica Barber', pais_id: 1, moneda_preferida: 'USD', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'monica.barber@totalhiit.com', telefono_whatsapp: '+13055550117' },
  { codigo: '0018', nombre_completo: 'Karla Kuusella', pais_id: 4, moneda_preferida: 'EUR', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'karla.kuusella@totalhiit.com', telefono_whatsapp: '+358405550118' },
  { codigo: '0019', nombre_completo: 'Frania Lähdemäki', pais_id: 4, moneda_preferida: 'EUR', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'frania.lahdemaki@totalhiit.com', telefono_whatsapp: '+358405550119' },
  { codigo: '0020', nombre_completo: 'Jessica Ledesma', pais_id: 1, moneda_preferida: 'USD', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'jessica.ledesma@totalhiit.com', telefono_whatsapp: '+13055550120' },
  { codigo: '0021', nombre_completo: 'Mariela Decuzzi', pais_id: 2, moneda_preferida: 'ARS', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'mariela.decuzzi@totalhiit.com', telefono_whatsapp: '+5491155550121' },
  { codigo: '0022', nombre_completo: 'Susana Costa', pais_id: 2, moneda_preferida: 'ARS', fecha_inicio: '2026-06-01', dia_de_pago: 1, activa: 1, email: 'susana.costa@totalhiit.com', telefono_whatsapp: '+5491155550122' },
];

const INGRESOS_INICIALES: Ingreso[] = [
  { id: 'ing-0001', alumna_codigo: '0001', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0004', alumna_codigo: '0004', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 37, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 37.0, ars_equivalente: 53634.46, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0005', alumna_codigo: '0005', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 37, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 37.0, ars_equivalente: 53634.46, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0008', alumna_codigo: '0008', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0009', alumna_codigo: '0009', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 37, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 37.0, ars_equivalente: 53634.46, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0010', alumna_codigo: '0010', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 50, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 50.0, ars_equivalente: 72479.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0011', alumna_codigo: '0011', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 37, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 37.0, ars_equivalente: 53634.46, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0012', alumna_codigo: '0012', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 50, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 50.0, ars_equivalente: 72479.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0013', alumna_codigo: '0013', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0017', alumna_codigo: '0017', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 30, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 30.0, ars_equivalente: 43487.4, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0020', alumna_codigo: '0020', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'USD', monto_original: 40, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 40.0, ars_equivalente: 57983.2, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0003', alumna_codigo: '0003', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'EUR', monto_original: 40, tasa_a_usd: 1.14678899, tasa_a_ars: 1662.36238532, usd_equivalente: 45.87, ars_equivalente: 66494.5, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0006', alumna_codigo: '0006', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'EUR', monto_original: 40, tasa_a_usd: 1.14678899, tasa_a_ars: 1662.36238532, usd_equivalente: 45.87, ars_equivalente: 66494.5, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0016', alumna_codigo: '0016', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'EUR', monto_original: 34, tasa_a_usd: 1.14678899, tasa_a_ars: 1662.36238532, usd_equivalente: 38.99, ars_equivalente: 56520.32, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0018', alumna_codigo: '0018', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'EUR', monto_original: 36, tasa_a_usd: 1.14678899, tasa_a_ars: 1662.36238532, usd_equivalente: 41.28, ars_equivalente: 59845.05, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0002', alumna_codigo: '0002', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 37000, tasa_a_usd: 0.00068985, tasa_a_ars: 1.0, usd_equivalente: 25.52, ars_equivalente: 37000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0007', alumna_codigo: '0007', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 40000, tasa_a_usd: 0.00068985, tasa_a_ars: 1.0, usd_equivalente: 27.59, ars_equivalente: 40000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0014', alumna_codigo: '0014', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 40000, tasa_a_usd: 0.00068985, tasa_a_ars: 1.0, usd_equivalente: 27.59, ars_equivalente: 40000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0015', alumna_codigo: '0015', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 42000, tasa_a_usd: 0.00068985, tasa_a_ars: 1.0, usd_equivalente: 28.97, ars_equivalente: 42000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0021', alumna_codigo: '0021', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 37000, tasa_a_usd: 0.00068985, tasa_a_ars: 1.0, usd_equivalente: 25.52, ars_equivalente: 37000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
  { id: 'ing-0022', alumna_codigo: '0022', tipo_ingreso: 'CUOTA_ALUMNA', concepto: 'Cuota Junio 2026', fecha_pago: '2026-06-01', moneda_original: 'ARS', monto_original: 42000, tasa_a_usd: 0.00068985, tasa_a_ars: 1.0, usd_equivalente: 28.97, ars_equivalente: 42000.0, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Transferencia', estado: 'APROBADO' },
];

const EGRESOS_INICIALES: Egreso[] = [
  { id: 'egr-0001', categoria: 'PUBLICIDAD', concepto: 'Pauta Meta Ads captación alumnas', fecha: '2026-06-05', proveedor: 'Meta', moneda_original: 'USD', monto_original: 80, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 80, ars_equivalente: 115966.4, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Tarjeta' },
  { id: 'egr-0002', categoria: 'EQUIPOS', concepto: 'Micrófono corbatero inalámbrico para entrenamientos', fecha: '2026-06-12', proveedor: 'Amazon', moneda_original: 'USD', monto_original: 65, tasa_a_usd: 1.0, tasa_a_ars: 1449.58, usd_equivalente: 65, ars_equivalente: 94222.7, mes_periodo: 6, anio_periodo: 2026, metodo_pago: 'Tarjeta' },
];

const EMAILS_ADMIN_AUTORIZADOS = [
  'caribialabs@gmail.com',
  'ebolivar1000@gmail.com',
  'totalhiit1@gmail.com',
];
const CLAVE_DEFECTO = 'admin2026';
const LLAVE_STORAGE_ALUMNAS = 'totalhiit_crm_alumnas';
const LLAVE_STORAGE_INGRESOS = 'totalhiit_crm_ingresos';
const LLAVE_STORAGE_EGRESOS = 'totalhiit_crm_egresos';
const LLAVE_STORAGE_CLAVE = 'totalhiit_crm_admin_clave';
const LLAVE_SESION_ACTIVA = 'totalhiit_crm_sesion_activa';

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

  // Recuperación clave
  const [modoRecuperar, setModoRecuperar] = useState(false);
  const [recuperarEmail, setRecuperarEmail] = useState('');
  const [msgRecuperar, setMsgRecuperar] = useState('');

  // Pestañas
  const [tab, setTab] = useState<'alumnas' | 'vencimientos' | 'ingresos' | 'egresos' | 'dashboard' | 'seguridad'>('alumnas');

  // Datos
  const [alumnas, setAlumnas] = useState<Alumna[]>(() => {
    const raw = localStorage.getItem(LLAVE_STORAGE_ALUMNAS);
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return ALUMNAS_INICIALES;
  });

  const [ingresos, setIngresos] = useState<Ingreso[]>(() => {
    const raw = localStorage.getItem(LLAVE_STORAGE_INGRESOS);
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return INGRESOS_INICIALES;
  });

  const [egresos, setEgresos] = useState<Egreso[]>(() => {
    const raw = localStorage.getItem(LLAVE_STORAGE_EGRESOS);
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return EGRESOS_INICIALES;
  });

  // Guardar en localStorage ante cualquier cambio
  useEffect(() => {
    localStorage.setItem(LLAVE_STORAGE_ALUMNAS, JSON.stringify(alumnas));
  }, [alumnas]);

  useEffect(() => {
    localStorage.setItem(LLAVE_STORAGE_INGRESOS, JSON.stringify(ingresos));
  }, [ingresos]);

  useEffect(() => {
    localStorage.setItem(LLAVE_STORAGE_EGRESOS, JSON.stringify(egresos));
  }, [egresos]);

  // Filtros Alumnas
  const [busqueda, setBusqueda] = useState('');
  const [filtroPais, setFiltroPais] = useState<string>('todos');
  const [filtroMoneda, setFiltroMoneda] = useState<string>('todas');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activas' | 'inactivas'>('todos');

  // Modales
  const [modalAlumna, setModalAlumna] = useState(false);
  const [alumnaEdit, setAlumnaEdit] = useState<Alumna | null>(null);
  const [formCod, setFormCod] = useState('');
  const [formNombre, setFormNombre] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTel, setFormTel] = useState('');
  const [formPais, setFormPais] = useState(1);
  const [formMoneda, setFormMoneda] = useState<'USD' | 'EUR' | 'ARS'>('USD');
  const [formDia, setFormDia] = useState(1);
  const [formActiva, setFormActiva] = useState(1);

  // Modal Mensaje WhatsApp/Email
  const [modalMsg, setModalMsg] = useState(false);
  const [alumnaMsg, setAlumnaMsg] = useState<Alumna | null>(null);
  const [textoMsg, setTextoMsg] = useState('');
  const [copiado, setCopiado] = useState(false);

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

  // Clave
  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [msgSeguridad, setMsgSeguridad] = useState('');

  // Validar Login
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

  // Mapa de países
  const mapaPaises = useMemo(() => {
    const map = new Map<number, Pais>();
    PAISES_INICIALES.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  // Alumnas filtradas
  const alumnasFiltradas = useMemo(() => {
    return alumnas.filter((a) => {
      const q = busqueda.toLowerCase();
      const coincide =
        a.nombre_completo.toLowerCase().includes(q) ||
        a.codigo.toLowerCase().includes(q) ||
        (a.email || '').toLowerCase().includes(q) ||
        (a.telefono_whatsapp || '').includes(q);

      const coincPais = filtroPais === 'todos' || a.pais_id === Number(filtroPais);
      const coincMon = filtroMoneda === 'todas' || a.moneda_preferida === filtroMoneda;
      const coincEst =
        filtroEstado === 'todos' ||
        (filtroEstado === 'activas' && a.activa === 1) ||
        (filtroEstado === 'inactivas' && a.activa === 0);

      return coincide && coincPais && coincMon && coincEst;
    });
  }, [alumnas, busqueda, filtroPais, filtroMoneda, filtroEstado]);

  // Alertas de vencimientos
  const alertasVencimiento = useMemo(() => {
    const hoy = new Date();
    const diaActual = hoy.getDate();

    return alumnas
      .filter((a) => a.activa === 1)
      .map((al) => {
        const diaCobro = al.dia_de_pago || 1;
        const diff = diaCobro - diaActual;
        let estado: 'VENCE_HOY' | 'PROXIMO' | 'VENCIDO' | 'AL_DIA' = 'AL_DIA';

        if (diff === 0) estado = 'VENCE_HOY';
        else if (diff > 0 && diff <= 7) estado = 'PROXIMO';
        else if (diff < 0) estado = 'VENCIDO';

        const montoEst = al.moneda_preferida === 'ARS' ? 40000 : 40;

        return {
          alumna: al,
          pais: mapaPaises.get(al.pais_id),
          diaCobro,
          diasRestantes: diff,
          estado,
          montoEst,
          moneda: al.moneda_preferida,
        };
      })
      .sort((a, b) => {
        const p = { VENCE_HOY: 0, VENCIDO: 1, PROXIMO: 2, AL_DIA: 3 };
        return p[a.estado] - p[b.estado];
      });
  }, [alumnas, mapaPaises]);

  // Generador mensaje motivador cobro
  const abrirModalMsg = (al: Alumna, monto: number, moneda: string, dia: number) => {
    setAlumnaMsg(al);
    const primerNombre = al.nombre_completo.split(' ')[0] || al.nombre_completo;
    const sim = moneda === 'EUR' ? '€' : '$';

    const texto = `¡Hola ${primerNombre}! 🌟 Espero que estés teniendo una excelente semana y sintiendo en tu cuerpo toda la fuerza y energía positiva que vienes construyendo con cada entrenamiento de TotalHIIT. 💪✨

Tu constancia y compromiso con tu salud y vitalidad después de los 40 son una verdadera inspiración. Cuidar de ti misma y regalarte este tiempo es la inversión más valiosa de tu vida.

Te escribo con mucho cariño para recordarte que el próximo día ${dia} corresponde renovar tu membresía activa de TotalHIIT:
📌 Monto: ${sim}${monto.toLocaleString('es-ES')} ${moneda}

Para mantener habilitado tu plan, clases en video y acompañamiento sin ninguna interrupción, por favor envíanos tu comprobante de transferencia por este medio al realizarlo.

¡Seguimos juntas avanzando con fuerza hacia tu mejor versión! 🔥 Un abrazo grande,
Equipo TotalHIIT
https://totalhiit.pages.dev/`;

    setTextoMsg(texto);
    setCopiado(false);
    setModalMsg(true);
  };

  // Métricas financieras
  const metricas = useMemo(() => {
    const totalIngresosUSD = ingresos.reduce((acc, i) => acc + (i.usd_equivalente || 0), 0);
    const totalIngresosARS = ingresos.reduce((acc, i) => acc + (i.ars_equivalente || 0), 0);
    const totalEgresosUSD = egresos.reduce((acc, e) => acc + (e.usd_equivalente || 0), 0);
    const totalEgresosARS = egresos.reduce((acc, e) => acc + (e.ars_equivalente || 0), 0);

    const gananciaNetaUSD = totalIngresosUSD - totalEgresosUSD;
    const gananciaNetaARS = totalIngresosARS - totalEgresosARS;

    const cuotasUSD = ingresos
      .filter((i) => i.tipo_ingreso === 'CUOTA_ALUMNA')
      .reduce((acc, i) => acc + (i.usd_equivalente || 0), 0);

    const appMarcasUSD = ingresos
      .filter((i) => i.tipo_ingreso !== 'CUOTA_ALUMNA')
      .reduce((acc, i) => acc + (i.usd_equivalente || 0), 0);

    const porPaisUSD = new Map<string, number>();
    ingresos
      .filter((i) => i.alumna_codigo)
      .forEach((i) => {
        const al = alumnas.find((a) => a.codigo === i.alumna_codigo);
        const pNom = al ? mapaPaises.get(al.pais_id)?.nombre || 'Otro' : 'Otro';
        porPaisUSD.set(pNom, (porPaisUSD.get(pNom) || 0) + (i.usd_equivalente || 0));
      });

    return {
      totalIngresosUSD,
      totalIngresosARS,
      totalEgresosUSD,
      totalEgresosARS,
      gananciaNetaUSD,
      gananciaNetaARS,
      cuotasUSD,
      appMarcasUSD,
      porPaisUSD: Array.from(porPaisUSD.entries()),
      ticketPromedioUSD: ingresos.length > 0 ? totalIngresosUSD / ingresos.length : 36.8,
      alumnasActivas: alumnas.filter((a) => a.activa === 1).length,
    };
  }, [ingresos, egresos, alumnas, mapaPaises]);

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
              Directorio de Alumnas, Cobros Multi-divisa & Finanzas
            </p>
          </div>

          <div className="rounded-3xl border border-stone-800 bg-stone-900/90 p-6 shadow-2xl backdrop-blur-xl">
            {!modoRecuperar ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Correo de Administrador
                  </label>
                  <input
                    type="email"
                    placeholder="ej: ebolivar1000@gmail.com"
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

  // Vista Principal del CRM
  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900 pb-20">
      {/* Barra Superior */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur shadow-xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
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
                CRM
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

      {/* Contenido */}
      <main className="mx-auto max-w-5xl px-4 py-5 space-y-5">
        {/* Banner de Cabecera */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-950 via-rose-950 to-stone-900 p-5 text-white shadow-lg">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-pink-200">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-pulse" />
                PANEL DE GESTIÓN & FINANZAS
              </span>
              <h2 className="mt-1 font-edo text-xl tracking-wide sm:text-2xl">
                Control de Alumnas & Cobros Multi-divisa
              </h2>
              <p className="mt-0.5 text-xs text-stone-300 max-w-md">
                Directorio unificado, cotizaciones en USD, EUR y ARS, estado de cobros y rentabilidad neta de la marca.
              </p>
            </div>

            <div className="flex gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-center backdrop-blur-md">
                <span className="block text-[10px] text-pink-200 font-bold uppercase">Alumnas Activas</span>
                <span className="text-xl font-black text-white">{metricas.alumnasActivas}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-center backdrop-blur-md">
                <span className="block text-[10px] text-pink-200 font-bold uppercase">Total Junio</span>
                <span className="text-xl font-black text-white">${metricas.totalIngresosUSD.toFixed(0)} <span className="text-xs font-normal">USD</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex overflow-x-auto rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xs">
          {[
            { id: 'alumnas', label: '👥 Alumnas', count: alumnas.length },
            { id: 'vencimientos', label: '⏰ Vencimientos', badge: alertasVencimiento.filter((a) => a.estado === 'VENCE_HOY' || a.estado === 'VENCIDO').length },
            { id: 'ingresos', label: '💵 Ingresos', count: ingresos.length },
            { id: 'egresos', label: '📉 Egresos', count: egresos.length },
            { id: 'dashboard', label: '📊 Métricas & P&L' },
            { id: 'seguridad', label: '🔐 Clave' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as typeof tab)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
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
                    placeholder="Buscar por nombre, código, WhatsApp..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white pl-8 pr-3 py-2 text-xs outline-none focus:border-rose-600"
                  />
                </div>

                <select
                  value={filtroPais}
                  onChange={(e) => setFiltroPais(e.target.value)}
                  className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs outline-none"
                >
                  <option value="todos">🌍 Países</option>
                  {PAISES_INICIALES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.bandera} {p.nombre}
                    </option>
                  ))}
                </select>

                <select
                  value={filtroMoneda}
                  onChange={(e) => setFiltroMoneda(e.target.value)}
                  className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs outline-none"
                >
                  <option value="todas">🪙 Monedas</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="ARS">ARS</option>
                </select>

                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value as typeof filtroEstado)}
                  className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs outline-none"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="activas">✅ Activas</option>
                  <option value="inactivas">⏸️ Inactivas</option>
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
                  setFormDia(1);
                  setFormActiva(1);
                  setModalAlumna(true);
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700"
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
                      <th className="py-3 px-3.5">País</th>
                      <th className="py-3 px-3.5">Moneda</th>
                      <th className="py-3 px-3.5">Día Cobro</th>
                      <th className="py-3 px-3.5">Contacto</th>
                      <th className="py-3 px-3.5">Estado</th>
                      <th className="py-3 px-3.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {alumnasFiltradas.map((a) => {
                      const pais = mapaPaises.get(a.pais_id);
                      return (
                        <tr key={a.codigo} className="hover:bg-stone-50/80 transition">
                          <td className="py-3 px-3.5 font-mono font-bold text-rose-600">
                            {a.codigo}
                          </td>
                          <td className="py-3 px-3.5 font-bold text-stone-900">
                            {a.nombre_completo}
                          </td>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="mr-1">{pais?.bandera || '🌍'}</span>
                            <span className="text-stone-700">{pais?.nombre}</span>
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="rounded-md bg-stone-100 px-2 py-0.5 font-bold text-stone-700">
                              {a.moneda_preferida}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-stone-800">
                            Día {a.dia_de_pago}
                          </td>
                          <td className="py-3 px-3.5 whitespace-nowrap">
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
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${a.activa === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                              {a.activa === 1 ? 'Activa' : 'Inactiva'}
                            </span>
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
                                setFormDia(a.dia_de_pago);
                                setFormActiva(a.activa);
                                setModalAlumna(true);
                              }}
                              className="rounded-lg bg-stone-100 p-1.5 text-stone-700 hover:bg-stone-200"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Eliminar a ${a.nombre_completo}?`)) {
                                  setAlumnas((prev) => prev.filter((x) => x.codigo !== a.codigo));
                                }
                              }}
                              className="rounded-lg bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
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
        {/* PESTAÑA: VENCIMIENTOS & RECORDATORIOS                          */}
        {/* ============================================================== */}
        {tab === 'vencimientos' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
              <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle size={15} />
                <span>Ciclos de Cobro & Recordatorios Inteligentes</span>
              </h3>
              <p className="mt-0.5 text-[11px] text-amber-800">
                Visualiza qué alumnas tienen vencimiento próximo o cuota pendiente. Envía mensajes motivadores enfocados en su salud y vitalidad +40 con 1 clic.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {alertasVencimiento.map((item) => {
                const al = item.alumna;
                const pais = item.pais;
                const esUrgente = item.estado === 'VENCE_HOY' || item.estado === 'VENCIDO';

                return (
                  <div
                    key={al.codigo}
                    className={`rounded-2xl border p-4 flex flex-col justify-between ${
                      esUrgente ? 'border-red-300 bg-red-50/40' : item.estado === 'PROXIMO' ? 'border-amber-300 bg-amber-50/40' : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-rose-600">{al.codigo}</span>
                          <h4 className="font-bold text-stone-900 text-sm">{al.nombre_completo}</h4>
                          <span className="text-xs text-stone-500">{pais?.bandera} {pais?.nombre}</span>
                        </div>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
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

                      <div className="mt-3 space-y-1 text-xs text-stone-600 border-t border-stone-100 pt-2.5">
                        <div className="flex justify-between">
                          <span>Día habitual de cobro:</span>
                          <strong>Día {item.diaCobro}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Cuota sugerida:</span>
                          <strong className="text-rose-600">
                            {item.moneda === 'EUR' ? '€' : '$'}{item.montoEst.toLocaleString('es-ES')} {item.moneda}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => abrirModalMsg(al, item.montoEst, item.moneda, item.diaCobro)}
                      className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                    >
                      <MessageCircle size={14} />
                      <span>Enviar Recordatorio</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: INGRESOS                                              */}
        {/* ============================================================== */}
        {tab === 'ingresos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Histórico de Ingresos</h3>
                <p className="text-xs text-stone-500">Cuotas de alumnas, contrataciones de App y marcas.</p>
              </div>
              <button
                onClick={() => setModalIngreso(true)}
                className="flex items-center gap-1 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                <Plus size={14} />
                <span>Registrar Ingreso</span>
              </button>
            </div>

            {/* Tarjetas KPI */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
                <span className="block text-[10px] font-bold text-stone-400 uppercase">Ingresos USD</span>
                <span className="text-lg font-black text-emerald-600">${metricas.totalIngresosUSD.toFixed(2)}</span>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
                <span className="block text-[10px] font-bold text-stone-400 uppercase">Ingresos ARS</span>
                <span className="text-lg font-black text-stone-800">${metricas.totalIngresosARS.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
                <span className="block text-[10px] font-bold text-stone-400 uppercase">Cuotas Alumnas</span>
                <span className="text-lg font-black text-rose-600">${metricas.cuotasUSD.toFixed(2)}</span>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
                <span className="block text-[10px] font-bold text-stone-400 uppercase">App & Marcas</span>
                <span className="text-lg font-black text-purple-600">${metricas.appMarcasUSD.toFixed(2)}</span>
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
                      <th className="py-3 px-3.5">Alumna / Cliente</th>
                      <th className="py-3 px-3.5">Monto Original</th>
                      <th className="py-3 px-3.5">USD Equiv.</th>
                      <th className="py-3 px-3.5">ARS Equiv.</th>
                      <th className="py-3 px-3.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {ingresos.map((ing) => {
                      const al = ing.alumna_codigo ? alumnas.find((a) => a.codigo === ing.alumna_codigo) : null;
                      return (
                        <tr key={ing.id} className="hover:bg-stone-50/80">
                          <td className="py-3 px-3.5 text-stone-500 whitespace-nowrap">{ing.fecha_pago}</td>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                              {ing.tipo_ingreso === 'CUOTA_ALUMNA' ? 'Alumna' : ing.tipo_ingreso === 'CONTRATACION_APP' ? 'App' : 'Marca'}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-stone-800">
                            {al ? al.nombre_completo : ing.cliente_o_marca || '—'}
                          </td>
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
                                if (window.confirm('¿Eliminar este cobro?')) {
                                  setIngresos((prev) => prev.filter((x) => x.id !== ing.id));
                                }
                              }}
                              className="text-stone-400 hover:text-red-600"
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Control de Egresos de la Marca</h3>
                <p className="text-xs text-stone-500">Publicidad Meta/Google, Impuestos, Reposición de Equipos.</p>
              </div>
              <button
                onClick={() => setModalEgreso(true)}
                className="flex items-center gap-1 rounded-xl bg-stone-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-stone-900"
              >
                <Plus size={14} />
                <span>Declarar Egreso</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
                <span className="block text-[10px] font-bold text-stone-400 uppercase">Total Gastos (USD)</span>
                <span className="text-lg font-black text-red-600">${metricas.totalEgresosUSD.toFixed(2)}</span>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
                <span className="block text-[10px] font-bold text-stone-400 uppercase">Total Gastos (ARS)</span>
                <span className="text-lg font-black text-stone-800">${metricas.totalEgresosARS.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-3.5 col-span-2 sm:col-span-1">
                <span className="block text-[10px] font-bold text-stone-400 uppercase">Cantidad de Gastos</span>
                <span className="text-lg font-black text-stone-700">{egresos.length}</span>
              </div>
            </div>

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
                    {egresos.map((egr) => (
                      <tr key={egr.id} className="hover:bg-stone-50/80">
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
                              if (window.confirm('¿Eliminar gasto?')) {
                                setEgresos((prev) => prev.filter((x) => x.id !== egr.id));
                              }
                            }}
                            className="text-stone-400 hover:text-red-600"
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
        {/* PESTAÑA: DASHBOARD & P&L                                       */}
        {/* ============================================================== */}
        {tab === 'dashboard' && (
          <div className="space-y-4">
            {/* Estado de Resultados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-white p-4">
                <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Ingresos Totales</span>
                <div className="mt-1.5 text-2xl font-black text-emerald-700">
                  ${metricas.totalIngresosUSD.toFixed(2)} <span className="text-xs font-normal text-stone-500">USD</span>
                </div>
                <div className="mt-1 text-xs text-stone-500 font-mono">
                  ARS: ${metricas.totalIngresosARS.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className="rounded-2xl border border-red-300 bg-gradient-to-br from-red-50 to-white p-4">
                <span className="text-[10px] font-bold uppercase text-red-800 tracking-wider">Egresos Operativos</span>
                <div className="mt-1.5 text-2xl font-black text-red-700">
                  ${metricas.totalEgresosUSD.toFixed(2)} <span className="text-xs font-normal text-stone-500">USD</span>
                </div>
                <div className="mt-1 text-xs text-stone-500 font-mono">
                  ARS: ${metricas.totalEgresosARS.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className="rounded-2xl border border-rose-600 bg-gradient-to-br from-rose-50 to-white p-4 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-rose-700 tracking-wider">Beneficio Neto Real (EBITDA)</span>
                <div className="mt-1.5 text-2xl font-black text-rose-600">
                  ${metricas.gananciaNetaUSD.toFixed(2)} <span className="text-xs font-normal text-stone-500">USD</span>
                </div>
                <div className="mt-1 text-xs text-stone-500 font-mono">
                  ARS: ${metricas.gananciaNetaARS.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            {/* Gráfico y Distribución por País */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide mb-3">Distribución por País</h4>
                <div className="space-y-2.5">
                  {metricas.porPaisUSD.map(([pNom, val]) => {
                    const pct = metricas.totalIngresosUSD > 0 ? Math.round((val / metricas.totalIngresosUSD) * 100) : 0;
                    return (
                      <div key={pNom} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-stone-800">{pNom}</span>
                          <span className="font-bold text-stone-900">${val.toFixed(2)} ({pct}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                          <div className="h-full bg-rose-600 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simulador Escalabilidad */}
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wide mb-3">Proyecciones de Escalabilidad</h4>
                <div className="space-y-2 text-xs">
                  {[50, 100, 250].map((cant) => {
                    const proy = cant * metricas.ticketPromedioUSD;
                    return (
                      <div key={cant} className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-2.5">
                        <div>
                          <span className="font-bold text-stone-800">{cant} Alumnas</span>
                          <span className="block text-[10px] text-stone-500">Ticket medio ${metricas.ticketPromedioUSD.toFixed(1)} USD</span>
                        </div>
                        <span className="text-sm font-black text-rose-600">~${Math.round(proy).toLocaleString('es-ES')} USD/mes</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PESTAÑA: SEGURIDAD                                             */}
        {/* ============================================================== */}
        {tab === 'seguridad' && (
          <div className="max-w-md mx-auto space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
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
      {/* MODAL ALTA / EDICIÓN ALUMNA                                    */}
      {/* ============================================================== */}
      {modalAlumna && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-stone-900">{alumnaEdit ? 'Editar Alumna' : 'Nueva Alumna'}</h3>
              <button onClick={() => setModalAlumna(false)} className="text-stone-400 hover:text-stone-600">✕</button>
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
                  fecha_inicio: '2026-06-01',
                  dia_de_pago: Number(formDia) || 1,
                  activa: formActiva,
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
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Día Cobro (1-31)</label>
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
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">País</label>
                  <select
                    value={formPais}
                    onChange={(e) => setFormPais(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    {PAISES_INICIALES.map((p) => (
                      <option key={p.id} value={p.id}>{p.bandera} {p.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Moneda</label>
                  <select
                    value={formMoneda}
                    onChange={(e) => setFormMoneda(e.target.value as typeof formMoneda)}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="ARS">ARS ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">Teléfono WhatsApp</label>
                <input
                  value={formTel}
                  onChange={(e) => setFormTel(e.target.value)}
                  placeholder="+1 305..."
                  className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setModalAlumna(false)}
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
      {/* MODAL MENSAJE COBRO                                            */}
      {/* ============================================================== */}
      {modalMsg && alumnaMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-stone-900">Recordatorio Motivador</h3>
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
                className="w-full rounded-xl border border-stone-300 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50"
              >
                {copiado ? '✅ ¡Copiado!' : '📋 Copiar Mensaje'}
              </button>

              <a
                href={`https://wa.me/${(alumnaMsg.telefono_whatsapp || '').replace(/[^\d]/g, '')}?text=${encodeURIComponent(textoMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-center text-xs font-bold text-white hover:bg-emerald-700 flex items-center justify-center gap-1.5"
              >
                <MessageCircle size={15} />
                <span>Abrir en WhatsApp</span>
              </a>
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
                  mes_periodo: 6,
                  anio_periodo: 2026,
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
                    onChange={(e) => setIngAlumnaCod(e.target.value)}
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
                      if (m === 'USD') { setIngTasaUsd(1); setIngTasaArs(1449.58); }
                      else if (m === 'EUR') { setIngTasaUsd(1.1468); setIngTasaArs(1662.36); }
                      else if (m === 'ARS') { setIngTasaUsd(0.00069); setIngTasaArs(1); }
                    }}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="ARS">ARS ($)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
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
                  mes_periodo: 6,
                  anio_periodo: 2026,
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
                  <option value="EQUIPOS">🎥 Reposición Equipos</option>
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
                      if (m === 'USD') { setEgrTasaUsd(1); setEgrTasaArs(1449.58); }
                      else if (m === 'ARS') { setEgrTasaUsd(0.00069); setEgrTasaArs(1); }
                    }}
                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="ARS">ARS ($)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
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
