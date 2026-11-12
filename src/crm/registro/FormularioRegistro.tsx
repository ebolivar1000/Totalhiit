// ==============================================================================
// FORMULARIO INTEGRAL DE REGISTRO DE ALUMNAS TOTALHIIT
// Basado en el Formulario Oficial de Google Forms y Hoja de Cálculo (49 Columnas)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Heart,
  Lock,
  Save,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import {
  FichaRegistro,
  FICHAS_INICIALES,
  COLUMNAS_49_GOOGLE_SHEETS,
  fichaAFila49,
} from '../tiposFicha';
import { exportarAExcel, exportarAPDF } from '../exportador';

const STORAGE_FICHAS = 'totalhiit_crm_fichas_registro_v4';
const STORAGE_DRAFT = 'totalhiit_crm_registro_draft_v4';
const STORAGE_FINALIZADA_ID = 'totalhiit_mi_ficha_id_v4';

interface Props {
  onVolverAdmin?: () => void;
  esAdmin?: boolean;
}

export default function FormularioRegistro({ onVolverAdmin, esAdmin }: Props) {
  // Estado de Ficha ya finalizada (Bloqueo)
  const [fichaFinalizada, setFichaFinalizada] = useState<FichaRegistro | null>(null);

  // ============================================================================
  // ESTADOS DEL FORMULARIO - 49 COLUMNAS OFICIALES
  // ============================================================================

  // 1. Datos Personales
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [sexo, setSexo] = useState<'Femenino' | 'Masculino'>('Femenino');
  const [apodo, setApodo] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [edad, setEdad] = useState<number>(35);
  const [localidadPais, setLocalidadPais] = useState('');

  // 2. Contextura Corporal
  const [altura, setAltura] = useState('1.65M');
  const [peso, setPeso] = useState('65.0Kg');
  const [tallaRemera, setTallaRemera] = useState<'S' | 'M' | 'L' | 'XL'>('M');

  // 3. Datos Médicos
  const [alergias, setAlergias] = useState('');
  const [embarazos, setEmbarazos] = useState<'si' | 'no'>('no');
  const [hijos, setHijos] = useState<'Si' | 'No' | 'No pienso tener'>('No');

  // 4. Enfermedades y Patologías
  const [tuvoCovid, setTuvoCovid] = useState<'Si' | 'no'>('no');
  const [secuelasCovid, setSecuelasCovid] = useState('');
  const [problemasMusculares, setProblemasMusculares] = useState<'Si' | 'no'>('no');
  const [lesionesDesdeCuando, setLesionesDesdeCuando] = useState('');
  const [tratamientoActual, setTratamientoActual] = useState('');
  const [tomaMedicamentos, setTomaMedicamentos] = useState<'Si' | 'No'>('No');
  const [medicamentosDetalle, setMedicamentosDetalle] = useState('');
  const [discapacidad, setDiscapacidad] = useState('');
  const [observacionesMedicas, setObservacionesMedicas] = useState('');

  // 5. Sustancias, Suplementos o Medicamentos
  const [consumeAlcohol, setConsumeAlcohol] = useState<'Si' | 'No' | 'Algunas veces y poca cantidad'>('Algunas veces y poca cantidad');
  const [fuma, setFuma] = useState<'Si' | 'No'>('No');
  const [frecuenciaFuma, setFrecuenciaFuma] = useState('');
  const [suplementosAnticonceptivos, setSuplementosAnticonceptivos] = useState('');

  // 6. Medios de Comunicación y Redes Sociales
  const [comoConocioTotalhiit, setComoConocioTotalhiit] = useState('');
  const [telefonoWhatsapp, setTelefonoWhatsapp] = useState('');
  const [sumarGrupoWhatsapp, setSumarGrupoWhatsapp] = useState<'Sí' | 'No'>('Sí');
  const [instagram, setInstagram] = useState('');
  const [consentimientoFotos, setConsentimientoFotos] = useState<'si' | 'No'>('si');
  const [redesInstagram, setRedesInstagram] = useState('Instagram @TOTALHIIT1');
  const [redesYoutube, setRedesYoutube] = useState('YouTube TOTALHIIT ENTRENAMIENTO FUNCIONAL');
  const [redesVoySeguirlos, setRedesVoySeguirlos] = useState('Voy corriendo a Seguirlos');
  const [contactoEmergencia, setContactoEmergencia] = useState('');

  // 7. Objetivos y Metas
  const [objetivoPrincipal, setObjetivoPrincipal] = useState<
    'Corporal: Bajar grasa y aumentar masa muscular' | 'Mejorar tu salud de manera integral'
  >('Corporal: Bajar grasa y aumentar masa muscular');
  const [motivoTotalhiit, setMotivoTotalhiit] = useState('');
  const [expectativas, setExpectativas] = useState('');

  // 8. ¡¡Tu Historia!! (Actividad Física)
  const [actividadFisicaActual, setActividadFisicaActual] = useState<'Si' | 'No'>('Si');
  const [detalleActividadActual, setDetalleActividadActual] = useState('');
  const [deportesFavoritos, setDeportesFavoritos] = useState('');
  const [actividadesPrevias, setActividadesPrevias] = useState('');
  const [horasSueno, setHorasSueno] = useState('7 - 8 horas');

  // 9. Cómo estás Emocionalmente
  const [estadoEmocional, setEstadoEmocional] = useState('');
  const [asisteTerapia, setAsisteTerapia] = useState('');
  const [detalleTerapia, setDetalleTerapia] = useState('');

  // 10. Importante & Compromiso
  const [compromisoAyuda, setCompromisoAyuda] = useState<'Si' | 'No' | 'Porsupuesto'>('Porsupuesto');

  // UI state
  const [seccionAbierta, setSeccionAbierta] = useState<number>(1);
  const [mensajeGuardado, setMensajeGuardado] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState('');

  // Cargar si ya finalizó previamente en este dispositivo
  useEffect(() => {
    const miFichaId = localStorage.getItem(STORAGE_FINALIZADA_ID);
    if (miFichaId && !esAdmin) {
      const raw = localStorage.getItem(STORAGE_FICHAS);
      if (raw) {
        try {
          const list: FichaRegistro[] = JSON.parse(raw);
          const encontrada = list.find((f) => f.id === miFichaId);
          if (encontrada && encontrada.finalizado) {
            setFichaFinalizada(encontrada);
            return;
          }
        } catch {}
      }
    }

    // Cargar borrador si existe
    const draft = localStorage.getItem(STORAGE_DRAFT);
    if (draft) {
      try {
        const d = JSON.parse(draft);
        if (d.email) setEmail(d.email);
        if (d.nombre) setNombre(d.nombre);
        if (d.apellido) setApellido(d.apellido);
        if (d.sexo) setSexo(d.sexo);
        if (d.apodo) setApodo(d.apodo);
        if (d.fechaNacimiento) setFechaNacimiento(d.fechaNacimiento);
        if (d.edad) setEdad(d.edad);
        if (d.localidadPais) setLocalidadPais(d.localidadPais);
        if (d.altura) setAltura(d.altura);
        if (d.peso) setPeso(d.peso);
        if (d.tallaRemera) setTallaRemera(d.tallaRemera);
        if (d.alergias) setAlergias(d.alergias);
        if (d.embarazos) setEmbarazos(d.embarazos);
        if (d.hijos) setHijos(d.hijos);
        if (d.tuvoCovid) setTuvoCovid(d.tuvoCovid);
        if (d.secuelasCovid) setSecuelasCovid(d.secuelasCovid);
        if (d.problemasMusculares) setProblemasMusculares(d.problemasMusculares);
        if (d.lesionesDesdeCuando) setLesionesDesdeCuando(d.lesionesDesdeCuando);
        if (d.tratamientoActual) setTratamientoActual(d.tratamientoActual);
        if (d.tomaMedicamentos) setTomaMedicamentos(d.tomaMedicamentos);
        if (d.medicamentosDetalle) setMedicamentosDetalle(d.medicamentosDetalle);
        if (d.discapacidad) setDiscapacidad(d.discapacidad);
        if (d.observacionesMedicas) setObservacionesMedicas(d.observacionesMedicas);
        if (d.consumeAlcohol) setConsumeAlcohol(d.consumeAlcohol);
        if (d.fuma) setFuma(d.fuma);
        if (d.frecuenciaFuma) setFrecuenciaFuma(d.frecuenciaFuma);
        if (d.suplementosAnticonceptivos) setSuplementosAnticonceptivos(d.suplementosAnticonceptivos);
        if (d.comoConocioTotalhiit) setComoConocioTotalhiit(d.comoConocioTotalhiit);
        if (d.telefonoWhatsapp) setTelefonoWhatsapp(d.telefonoWhatsapp);
        if (d.sumarGrupoWhatsapp) setSumarGrupoWhatsapp(d.sumarGrupoWhatsapp);
        if (d.instagram) setInstagram(d.instagram);
        if (d.consentimientoFotos) setConsentimientoFotos(d.consentimientoFotos);
        if (d.redesInstagram) setRedesInstagram(d.redesInstagram);
        if (d.redesYoutube) setRedesYoutube(d.redesYoutube);
        if (d.redesVoySeguirlos) setRedesVoySeguirlos(d.redesVoySeguirlos);
        if (d.contactoEmergencia) setContactoEmergencia(d.contactoEmergencia);
        if (d.objetivoPrincipal) setObjetivoPrincipal(d.objetivoPrincipal);
        if (d.motivoTotalhiit) setMotivoTotalhiit(d.motivoTotalhiit);
        if (d.expectativas) setExpectativas(d.expectativas);
        if (d.actividadFisicaActual) setActividadFisicaActual(d.actividadFisicaActual);
        if (d.detalleActividadActual) setDetalleActividadActual(d.detalleActividadActual);
        if (d.deportesFavoritos) setDeportesFavoritos(d.deportesFavoritos);
        if (d.actividadesPrevias) setActividadesPrevias(d.actividadesPrevias);
        if (d.horasSueno) setHorasSueno(d.horasSueno);
        if (d.estadoEmocional) setEstadoEmocional(d.estadoEmocional);
        if (d.asisteTerapia) setAsisteTerapia(d.asisteTerapia);
        if (d.detalleTerapia) setDetalleTerapia(d.detalleTerapia);
        if (d.compromisoAyuda) setCompromisoAyuda(d.compromisoAyuda);
      } catch {}
    }
  }, [esAdmin]);

  // Guardado automático de borrador
  const guardarBorrador = () => {
    const draftData = {
      email,
      nombre,
      apellido,
      sexo,
      apodo,
      fechaNacimiento,
      edad,
      localidadPais,
      altura,
      peso,
      tallaRemera,
      alergias,
      embarazos,
      hijos,
      tuvoCovid,
      secuelasCovid,
      problemasMusculares,
      lesionesDesdeCuando,
      tratamientoActual,
      tomaMedicamentos,
      medicamentosDetalle,
      discapacidad,
      observacionesMedicas,
      consumeAlcohol,
      fuma,
      frecuenciaFuma,
      suplementosAnticonceptivos,
      comoConocioTotalhiit,
      telefonoWhatsapp,
      sumarGrupoWhatsapp,
      instagram,
      consentimientoFotos,
      redesInstagram,
      redesYoutube,
      redesVoySeguirlos,
      contactoEmergencia,
      objetivoPrincipal,
      motivoTotalhiit,
      expectativas,
      actividadFisicaActual,
      detalleActividadActual,
      deportesFavoritos,
      actividadesPrevias,
      horasSueno,
      estadoEmocional,
      asisteTerapia,
      detalleTerapia,
      compromisoAyuda,
    };
    localStorage.setItem(STORAGE_DRAFT, JSON.stringify(draftData));
    setMensajeGuardado(true);
    setTimeout(() => setMensajeGuardado(false), 2000);
  };

  // Finalizar Registro (Bloqueo Definitivo y Almacenamiento en BD)
  const finalizarRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion('');

    if (!email.trim() || !nombre.trim() || !apellido.trim() || !telefonoWhatsapp.trim()) {
      setErrorValidacion('Por favor completa los campos obligatorios: Nombre, Apellido, Email y WhatsApp.');
      setSeccionAbierta(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const nuevaFicha: FichaRegistro = {
      id: `ficha-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fecha_registro: new Date().toLocaleString('es-ES'),
      finalizado: true,
      email: email.trim().toLowerCase(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      nombre_completo: `${nombre.trim()} ${apellido.trim()}`,
      sexo,
      apodo: apodo.trim() || undefined,
      fecha_nacimiento: fechaNacimiento || 'No indicada',
      edad: Number(edad) || 35,
      localidad_pais: localidadPais.trim() || 'No indicada',
      altura: altura.trim() || '1.65M',
      peso: peso.trim() || '65.0Kg',
      talla_remera: tallaRemera,
      alergias: alergias.trim() || 'Ninguna indicada',
      embarazos,
      hijos,
      tuvo_covid: tuvoCovid,
      secuelas_covid: secuelasCovid.trim() || undefined,
      problemas_musculares_oseos: problemasMusculares,
      lesiones_desde_cuando: lesionesDesdeCuando.trim() || undefined,
      tratamiento_actual: tratamientoActual.trim() || undefined,
      toma_medicamentos: tomaMedicamentos,
      medicamentos_detalle: medicamentosDetalle.trim() || undefined,
      discapacidad: discapacidad.trim() || 'Ninguna',
      observaciones_medicas: observacionesMedicas.trim() || undefined,
      consume_alcohol: consumeAlcohol,
      fuma,
      frecuencia_fuma: frecuenciaFuma.trim() || undefined,
      suplementos_anticonceptivos: suplementosAnticonceptivos.trim() || undefined,
      como_conocio_totalhiit: comoConocioTotalhiit.trim() || 'Redes Sociales',
      telefono_whatsapp: telefonoWhatsapp.trim(),
      sumar_grupo_whatsapp: sumarGrupoWhatsapp,
      instagram: instagram.trim() || undefined,
      consentimiento_fotos: consentimientoFotos,
      redes_instagram: redesInstagram,
      redes_youtube: redesYoutube,
      redes_voy_seguirlos: redesVoySeguirlos,
      contacto_emergencia: contactoEmergencia.trim() || 'No especificado',
      objetivo_principal: objetivoPrincipal,
      motivo_totalhiit: motivoTotalhiit.trim() || undefined,
      expectativas: expectativas.trim() || undefined,
      actividad_fisica_actual: actividadFisicaActual,
      detalle_actividad_actual: detalleActividadActual.trim() || undefined,
      deportes_favoritos: deportesFavoritos.trim() || undefined,
      actividades_previas: actividadesPrevias.trim() || undefined,
      horas_sueno: horasSueno || '8 horas',
      estado_emocional: estadoEmocional.trim() || undefined,
      asiste_terapia: asisteTerapia.trim() || undefined,
      detalle_terapia: detalleTerapia.trim() || undefined,
      compromiso_ayuda: compromisoAyuda,
    };

    // Guardar en la base de datos compartida del CRM
    let listaActual: FichaRegistro[] = [];
    const raw = localStorage.getItem(STORAGE_FICHAS);
    if (raw) {
      try {
        listaActual = JSON.parse(raw);
      } catch {}
    }
    if (!Array.isArray(listaActual) || listaActual.length === 0) {
      listaActual = FICHAS_INICIALES;
    }

    const actualizada = [nuevaFicha, ...listaActual.filter((x) => x.id !== nuevaFicha.id)];
    localStorage.setItem(STORAGE_FICHAS, JSON.stringify(actualizada));
    localStorage.setItem('totalhiit_crm_fichas_registro', JSON.stringify(actualizada));
    localStorage.removeItem(STORAGE_DRAFT);
    localStorage.setItem(STORAGE_FINALIZADA_ID, nuevaFicha.id);

    // Enviar a la nube (Cloudflare KV) en segundo plano
    try {
      fetch('/api/crm-ficha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaFicha),
      }).catch(() => {});
    } catch {}

    // Bloquear formulario y mostrar vista de confirmación
    setFichaFinalizada(nuevaFicha);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Exportar Ficha a Excel (49 Columnas idénticas a Google Sheets)
  const exportarMiFichaExcel = (ficha: FichaRegistro) => {
    const fila = fichaAFila49(ficha);
    exportarAExcel(
      `Ficha_TotalHIIT_${ficha.nombre.replace(/\s+/g, '_')}_49_Campos`,
      `Ficha Oficial de ${ficha.nombre_completo}`,
      COLUMNAS_49_GOOGLE_SHEETS,
      [fila]
    );
  };

  // Exportar Ficha a PDF
  const exportarMiFichaPDF = (ficha: FichaRegistro) => {
    const columnas = ['N° Pregunta / Campo Oficial', 'Respuesta Certificada'];
    const filas: (string | number)[][] = [
      ['1. Marca Temporal', ficha.fecha_registro],
      ['2. Correo Electrónico', ficha.email],
      ['3. Nombre', ficha.nombre],
      ['4. Apellido', ficha.apellido],
      ['5. Sexo', ficha.sexo],
      ['6. Apodo Preferido', ficha.apodo || '—'],
      ['7. Fecha de Nacimiento', ficha.fecha_nacimiento],
      ['8. Edad', `${ficha.edad} años`],
      ['9. Dónde vives, localidad, País', ficha.localidad_pais],
      ['10. Altura', ficha.altura],
      ['11. Peso', ficha.peso],
      ['12. Talla de Remera', ficha.talla_remera],
      ['13. Alergias', ficha.alergias],
      ['14. ¿Embarazos?', ficha.embarazos],
      ['15. ¿Tiene Hijos?', ficha.hijos],
      ['16. ¿Tuvo Coronavirus?', ficha.tuvo_covid],
      ['17. Secuelas Coronavirus', ficha.secuelas_covid || 'Ninguna'],
      ['18. ¿Problemas Musculares / Articulares?', ficha.problemas_musculares_oseos],
      ['19. ¿Desde cuándo? ¿Qué tienes?', ficha.lesiones_desde_cuando || 'Ninguna'],
      ['20. ¿Tratamiento Actual?', ficha.tratamiento_actual || 'Ninguno'],
      ['21. ¿Toma Medicamentos?', ficha.toma_medicamentos],
      ['22. ¿Cuál? ¿Cómo?', ficha.medicamentos_detalle || 'Ninguno'],
      ['23. ¿Discapacidad?', ficha.discapacidad || 'Ninguna'],
      ['24. Observaciones de Utilidad', ficha.observaciones_medicas || 'Ninguna'],
      ['25. ¿Consume Bebidas Alcohólicas?', ficha.consume_alcohol],
      ['26. ¿Fumas?', ficha.fuma],
      ['27. Frecuencia de Fumar', ficha.frecuencia_fuma || 'No fuma'],
      ['28. Suplementos / Reguladores / Anticonceptivos', ficha.suplementos_anticonceptivos || 'Ninguno'],
      ['29. ¿Cómo conociste a TOTALHIIT?', ficha.como_conocio_totalhiit || 'Redes Sociales'],
      ['30. Teléfono y/o Celular', ficha.telefono_whatsapp],
      ['31. ¿Sumar al Grupo de WhatsApp?', ficha.sumar_grupo_whatsapp],
      ['32. Instagram', ficha.instagram || '—'],
      ['33. Consentimiento Fotos / Grabaciones', ficha.consentimiento_fotos],
      ['34. Redes [Instagram]', ficha.redes_instagram],
      ['35. Redes [YouTube]', ficha.redes_youtube],
      ['36. Redes [Voy corriendo a Seguirlos]', ficha.redes_voy_seguirlos],
      ['37. Contacto de Emergencia', ficha.contacto_emergencia],
      ['38. Objetivo Principal', ficha.objetivo_principal],
      ['39. ¿Por qué TOTALHIIT?', ficha.motivo_totalhiit || '—'],
      ['40. ¿Qué esperas recibir?', ficha.expectativas || '—'],
      ['41. ¿Realiza Actividad Física Actual?', ficha.actividad_fisica_actual],
      ['42. Detalle Actividad Actual', ficha.detalle_actividad_actual || '—'],
      ['43. 3 Deportes Favoritos', ficha.deportes_favoritos || '—'],
      ['44. Actividades Previas', ficha.actividades_previas || '—'],
      ['45. Horas de Sueño', ficha.horas_sueno],
      ['46. Estado Emocional', ficha.estado_emocional || '—'],
      ['47. ¿Asiste a Terapia?', ficha.asiste_terapia || '—'],
      ['48. Detalle de Terapia', ficha.detalle_terapia || '—'],
      ['49. Compromiso y Ayuda', ficha.compromiso_ayuda],
    ];

    exportarAPDF(
      `Ficha Integral de ${ficha.nombre_completo}`,
      `Expediente Oficial de Salud & Entrenamiento TOTALHIIT (49 Campos)`,
      columnas,
      filas,
      [
        { etiqueta: 'Alumna', valor: ficha.nombre_completo },
        { etiqueta: 'Email', valor: ficha.email },
        { etiqueta: 'Teléfono', valor: ficha.telefono_whatsapp },
        { etiqueta: 'Edad', valor: `${ficha.edad} años` },
        { etiqueta: 'Meta', valor: ficha.objetivo_principal.includes('Corporal') ? 'Corporal' : 'Salud Integral' },
      ]
    );
  };

  // ============================================================================
  // PANTALLA: FICHA BLOQUEADA / FINALIZADA
  // ============================================================================
  if (fichaFinalizada) {
    return (
      <div className="min-h-screen bg-stone-100 py-8 px-4 font-sans text-stone-900">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header de Éxito */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-xs space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>
            <h1 className="text-2xl font-black text-emerald-950">
              ¡Registro Oficial Finalizado con Éxito!
            </h1>
            <p className="text-xs text-emerald-800 max-w-xl mx-auto">
              Muchas gracias, <strong>{fichaFinalizada.nombre}</strong>. Tus datos han sido guardados y certificados en la base de datos de TOTALHIIT. Esta ficha ya se encuentra bloqueada para proteger la integridad de tu información.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-[11px] font-bold text-emerald-900">
              <Lock size={12} />
              <span>Formulario Bloqueado (Solo Lectura) • 49 Preguntas Registradas</span>
            </div>
          </div>

          {/* Opciones de Exportación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => exportarMiFichaExcel(fichaFinalizada)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 p-4 font-bold text-white hover:bg-emerald-700 shadow-sm transition cursor-pointer"
            >
              <FileSpreadsheet size={18} />
              <span>Exportar Mi Ficha a Excel (49 Cols)</span>
            </button>
            <button
              type="button"
              onClick={() => exportarMiFichaPDF(fichaFinalizada)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-rose-600 p-4 font-bold text-white hover:bg-rose-700 shadow-sm transition cursor-pointer"
            >
              <FileText size={18} />
              <span>Exportar Mi Ficha a PDF</span>
            </button>
          </div>

          {/* Resumen del Expediente */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-base font-black text-stone-900 border-b pb-2 flex items-center gap-2">
              <ShieldCheck className="text-rose-600" size={18} />
              Resumen de tu Ficha Oficial TOTALHIIT
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-stone-50 p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">Alumna / Atleta</span>
                <p className="font-bold text-stone-900 text-sm">{fichaFinalizada.nombre_completo}</p>
                <p className="text-stone-600">{fichaFinalizada.email} • {fichaFinalizada.telefono_whatsapp}</p>
              </div>

              <div className="rounded-xl bg-stone-50 p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">Ubicación y Edad</span>
                <p className="font-bold text-stone-900">{fichaFinalizada.localidad_pais}</p>
                <p className="text-stone-600">{fichaFinalizada.edad} años ({fichaFinalizada.fecha_nacimiento})</p>
              </div>

              <div className="rounded-xl bg-stone-50 p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">Contextura Corporal</span>
                <p className="font-bold text-stone-900">{fichaFinalizada.altura} • {fichaFinalizada.peso}</p>
                <p className="text-stone-600">Talla de Remera: {fichaFinalizada.talla_remera}</p>
              </div>

              <div className="rounded-xl bg-stone-50 p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500">Objetivo Principal</span>
                <p className="font-bold text-rose-600">{fichaFinalizada.objetivo_principal}</p>
              </div>
            </div>

            {onVolverAdmin && (
              <div className="pt-4 border-t flex justify-center">
                <button
                  type="button"
                  onClick={onVolverAdmin}
                  className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-2.5 font-bold text-stone-700 hover:bg-stone-50 text-xs transition cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Volver al Panel Administrativo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PANTALLA: FORMULARIO ACTIVO (49 PREGUNTAS EN 10 SECCIONES OFICIALES)
  // ============================================================================
  return (
    <div className="min-h-screen bg-stone-100 py-6 px-4 font-sans text-stone-900">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Banner Superior */}
        <div className="rounded-3xl border border-stone-200 bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-400/40 px-3 py-1 text-[11px] font-bold text-rose-300">
                <Sparkles size={12} />
                <span>Formulario Oficial TOTALHIIT • 49 Columnas</span>
              </span>

              {onVolverAdmin && (
                <button
                  type="button"
                  onClick={onVolverAdmin}
                  className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1 text-xs font-bold transition cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Admin CRM</span>
                </button>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Planilla Integral de Ingreso & Salud de Alumnas
            </h1>
            <p className="text-xs text-stone-300 leading-relaxed">
              Hola, ¡Bienvenida a TOTALHIIT! Este formulario tiene como fin conocerte mejor para llevar a cabo un entrenamiento seguro, divertido, eficiente y funcional adaptado a tu cuerpo.
            </p>
          </div>
        </div>

        {/* Notificaciones y Errores */}
        {errorValidacion && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-red-800 text-xs font-bold">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <span>{errorValidacion}</span>
          </div>
        )}

        {mensajeGuardado && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span>Borrador guardado en tu navegador exitosamente.</span>
          </div>
        )}

        {/* Selector Rápido de Secciones (1 al 10) */}
        <div className="flex flex-wrap gap-1 rounded-2xl border border-stone-200 bg-white p-2 shadow-xs text-xs font-bold">
          {[
            { num: 1, label: '1. Personales' },
            { num: 2, label: '2. Contextura' },
            { num: 3, label: '3. Médicos' },
            { num: 4, label: '4. Patologías' },
            { num: 5, label: '5. Sustancias' },
            { num: 6, label: '6. Redes & Contacto' },
            { num: 7, label: '7. Objetivos' },
            { num: 8, label: '8. Historia Física' },
            { num: 9, label: '9. Emocional' },
            { num: 10, label: '10. Compromiso' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setSeccionAbierta(s.num)}
              className={`flex-1 py-1.5 px-2 rounded-xl transition text-center whitespace-nowrap ${
                seccionAbierta === s.num
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <form onSubmit={finalizarRegistro} className="space-y-4">
          {/* ============================================================== */}
          {/* SECCIÓN 1: DATOS PERSONALES (Preguntas 1 a 8)                  */}
          {/* ============================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 1 ? 0 : 1)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <User size={16} className="text-rose-600" />
                <span>1. Datos Personales (Cols 1 - 9)</span>
              </span>
              {seccionAbierta === 1 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 1 && (
              <div className="space-y-3 pt-3 border-t text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      placeholder="Tu apellido"
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Sexo</label>
                    <select
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value as 'Femenino' | 'Masculino')}
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none font-semibold text-stone-800"
                    >
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Edad</label>
                    <input
                      type="number"
                      min={15}
                      max={95}
                      value={edad}
                      onChange={(e) => setEdad(Number(e.target.value))}
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={fechaNacimiento}
                      onChange={(e) => setFechaNacimiento(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Apodo (¿Cómo quieres que te llamemos?)
                  </label>
                  <input
                    type="text"
                    value={apodo}
                    onChange={(e) => setApodo(e.target.value)}
                    placeholder="Ejemplo: Valen, Raqui, Mari..."
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Dónde vives, localidad, País <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={localidadPais}
                    onChange={(e) => setLocalidadPais(e.target.value)}
                    placeholder="Ej: Buenos Aires, Argentina / Miami, EE.UU."
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECCIÓN 2: CONTEXTURA CORPORAL (Preguntas 9 a 11)              */}
          {/* ============================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 2 ? 0 : 2)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Heart size={16} className="text-rose-600" />
                <span>2. Contextura Corporal (Cols 10 - 12)</span>
              </span>
              {seccionAbierta === 2 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Altura (M)</label>
                  <input
                    type="text"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    placeholder="Ej: 1.65M"
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Peso (Kg)</label>
                  <input
                    type="text"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    placeholder="Ej: 64.5Kg"
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Talla de Remera</label>
                  <select
                    value={tallaRemera}
                    onChange={(e) => setTallaRemera(e.target.value as 'S' | 'M' | 'L' | 'XL')}
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none font-semibold text-stone-800"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECCIÓN 3: DATOS MÉDICOS (Preguntas 12 a 14)                   */}
          {/* ============================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 3 ? 0 : 3)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-rose-600" />
                <span>3. Datos Médicos (Cols 13 - 15)</span>
              </span>
              {seccionAbierta === 3 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 3 && (
              <div className="space-y-3 pt-3 border-t text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Alergias (Especifica TODAS, inclusive mínimas)
                  </label>
                  <textarea
                    rows={2}
                    value={alergias}
                    onChange={(e) => setAlergias(e.target.value)}
                    placeholder="Penicilina, polen, ácaros, mariscos, o ninguna..."
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Embarazos?</label>
                    <select
                      value={embarazos}
                      onChange={(e) => setEmbarazos(e.target.value as 'si' | 'no')}
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none font-semibold text-stone-800"
                    >
                      <option value="no">no</option>
                      <option value="si">si</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Tienes hijos?</label>
                    <select
                      value={hijos}
                      onChange={(e) => setHijos(e.target.value as 'Si' | 'No' | 'No pienso tener')}
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none font-semibold text-stone-800"
                    >
                      <option value="No">No</option>
                      <option value="Si">Si</option>
                      <option value="No pienso tener">No pienso tener</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECCIÓN 4: ENFERMEDADES Y PATOLOGÍAS (Preguntas 15 a 23)        */}
          {/* ============================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 4 ? 0 : 4)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-600" />
                <span>4. Enfermedades y Patologías (Cols 16 - 24)</span>
              </span>
              {seccionAbierta === 4 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 4 && (
              <div className="space-y-3 pt-3 border-t text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Tuviste Coronavirus?</label>
                    <select
                      value={tuvoCovid}
                      onChange={(e) => setTuvoCovid(e.target.value as 'Si' | 'no')}
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none font-semibold text-stone-800"
                    >
                      <option value="no">no</option>
                      <option value="Si">Si</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Secuelas COVID / Cansancio extremo</label>
                    <input
                      type="text"
                      value={secuelasCovid}
                      onChange={(e) => setSecuelasCovid(e.target.value)}
                      placeholder="Explique si quedó alguna secuela o 'Ninguna'..."
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      ¿Problema muscular, articular u óseo?
                    </label>
                    <select
                      value={problemasMusculares}
                      onChange={(e) => setProblemasMusculares(e.target.value as 'Si' | 'no')}
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none font-semibold text-stone-800"
                    >
                      <option value="no">no</option>
                      <option value="Si">Si</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Desde cuándo? ¿Qué tienes?</label>
                    <input
                      type="text"
                      value={lesionesDesdeCuando}
                      onChange={(e) => setLesionesDesdeCuando(e.target.value)}
                      placeholder="Detalle de la lesión o molestia..."
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">¿Tratamiento actual que mejore tu condición?</label>
                  <input
                    type="text"
                    value={tratamientoActual}
                    onChange={(e) => setTratamientoActual(e.target.value)}
                    placeholder="Fisioterapia, kinesiología, ninguno..."
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Tomas medicamentos en el día a día?</label>
                    <select
                      value={tomaMedicamentos}
                      onChange={(e) => setTomaMedicamentos(e.target.value as 'Si' | 'No')}
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none font-semibold text-stone-800"
                    >
                      <option value="No">No</option>
                      <option value="Si">Si</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Cuál? ¿Cómo? (Dosis, horas, etc.)</label>
                    <input
                      type="text"
                      value={medicamentosDetalle}
                      onChange={(e) => setMedicamentosDetalle(e.target.value)}
                      placeholder="Nombre del medicamento y dosis..."
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Alguna discapacidad (motriz, auditiva, visual)?</label>
                    <input
                      type="text"
                      value={discapacidad}
                      onChange={(e) => setDiscapacidad(e.target.value)}
                      placeholder="Ninguna o especificar..."
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Observaciones de utilidad para el coach</label>
                    <input
                      type="text"
                      value={observacionesMedicas}
                      onChange={(e) => setObservacionesMedicas(e.target.value)}
                      placeholder="Cualquier dato adicional relevante..."
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECCIÓN 5: SUSTANCIAS, SUPLEMENTOS O HÁBITOS (Preguntas 24 a 27) */}
          {/* ============================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 5 ? 0 : 5)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Heart size={16} className="text-rose-600" />
                <span>5. Sustancias, Suplementos o Medicamentos (Cols 25 - 28)</span>
              </span>
              {seccionAbierta === 5 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 5 && (
              <div className="space-y-3 pt-3 border-t text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Consumes bebidas alcohólicas?</label>
                    <select
                      value={consumeAlcohol}
                      onChange={(e) => setConsumeAlcohol(e.target.value as 'Si' | 'No' | 'Algunas veces y poca cantidad')}
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none font-semibold text-stone-800"
                    >
                      <option value="No">No</option>
                      <option value="Algunas veces y poca cantidad">Algunas veces y poca cantidad</option>
                      <option value="Si">Si</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Fumas?</label>
                    <select
                      value={fuma}
                      onChange={(e) => setFuma(e.target.value as 'Si' | 'No')}
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none font-semibold text-stone-800"
                    >
                      <option value="No">No</option>
                      <option value="Si">Si</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Si fumas, ¿con qué frecuencia lo haces?</label>
                  <input
                    type="text"
                    value={frecuenciaFuma}
                    onChange={(e) => setFrecuenciaFuma(e.target.value)}
                    placeholder="Cantidad y frecuencia o 'No fuma'..."
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    ¿Consumes suplementos deportivos, reguladores o anticonceptivos?
                  </label>
                  <input
                    type="text"
                    value={suplementosAnticonceptivos}
                    onChange={(e) => setSuplementosAnticonceptivos(e.target.value)}
                    placeholder="Creatina, colágeno, anticonceptivos, magnesio, ninguno..."
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECCIÓN 6: REDES SOCIALES Y CONTACTO (Preguntas 28 a 36)        */}
          {/* ============================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 6 ? 0 : 6)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-rose-600" />
                <span>6. Medios de Comunicación & Redes Sociales (Cols 29 - 37)</span>
              </span>
              {seccionAbierta === 6 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 6 && (
              <div className="space-y-3 pt-3 border-t text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">¿Cómo llegaste a conocer a TOTALHIIT?</label>
                  <input
                    type="text"
                    value={comoConocioTotalhiit}
                    onChange={(e) => setComoConocioTotalhiit(e.target.value)}
                    placeholder="Instagram, recomendación de una amiga, YouTube, Facebook..."
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Teléfono y/o Celular (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={telefonoWhatsapp}
                      onChange={(e) => setTelefonoWhatsapp(e.target.value)}
                      placeholder="+54 9 11 1234 5678"
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Quieres que te sumemos al grupo de WhatsApp?</label>
                    <select
                      value={sumarGrupoWhatsapp}
                      onChange={(e) => setSumarGrupoWhatsapp(e.target.value as 'Sí' | 'No')}
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none font-semibold text-stone-800"
                    >
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Tu Instagram (Nombre de usuario)</label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@tu_usuario"
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Consentimiento fotos/capturas para corrección técnica</label>
                    <select
                      value={consentimientoFotos}
                      onChange={(e) => setConsentimientoFotos(e.target.value as 'si' | 'No')}
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none font-semibold text-stone-800"
                    >
                      <option value="si">si</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 space-y-2">
                  <label className="block font-bold text-stone-800">¿Nos sigues en nuestras redes?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 font-medium text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={redesInstagram === 'Instagram @TOTALHIIT1'}
                        onChange={(e) => setRedesInstagram(e.target.checked ? 'Instagram @TOTALHIIT1' : 'No')}
                        className="rounded text-rose-600"
                      />
                      <span>Instagram @TOTALHIIT1</span>
                    </label>
                    <label className="flex items-center gap-2 font-medium text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={redesYoutube === 'YouTube TOTALHIIT ENTRENAMIENTO FUNCIONAL'}
                        onChange={(e) => setRedesYoutube(e.target.checked ? 'YouTube TOTALHIIT ENTRENAMIENTO FUNCIONAL' : 'No')}
                        className="rounded text-rose-600"
                      />
                      <span>YouTube Funcional</span>
                    </label>
                    <label className="flex items-center gap-2 font-medium text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={redesVoySeguirlos === 'Voy corriendo a Seguirlos'}
                        onChange={(e) => setRedesVoySeguirlos(e.target.checked ? 'Voy corriendo a Seguirlos' : 'No')}
                        className="rounded text-rose-600"
                      />
                      <span>Voy corriendo a seguirlos</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Contacto de Emergencia (Nombre, Teléfono, Parentesco)
                  </label>
                  <input
                    type="text"
                    value={contactoEmergencia}
                    onChange={(e) => setContactoEmergencia(e.target.value)}
                    placeholder="Ej: Juan Pérez (+54 9 11 9999 8888) - Pareja"
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECCIÓN 7: OBJETIVOS Y METAS (Preguntas 37 a 39)                */}
          {/* ============================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 7 ? 0 : 7)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-rose-600" />
                <span>7. Objetivos y Metas (Cols 38 - 40)</span>
              </span>
              {seccionAbierta === 7 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 7 && (
              <div className="space-y-3 pt-3 border-t text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Tu Objetivo principal es:</label>
                  <select
                    value={objetivoPrincipal}
                    onChange={(e) => setObjetivoPrincipal(e.target.value as any)}
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none font-bold text-stone-800"
                  >
                    <option value="Corporal: Bajar grasa y aumentar masa muscular">
                      🏋️ Corporal: Bajar grasa y aumentar masa muscular
                    </option>
                    <option value="Mejorar tu salud de manera integral">
                      🌿 Mejorar tu salud de manera integral
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">¿Por qué decidiste acceder a TOTALHIIT?</label>
                  <textarea
                    rows={2}
                    value={motivoTotalhiit}
                    onChange={(e) => setMotivoTotalhiit(e.target.value)}
                    placeholder="Qué te inspiró a sumarte..."
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">¿Qué esperas recibir de nuestra parte?</label>
                  <textarea
                    rows={2}
                    value={expectativas}
                    onChange={(e) => setExpectativas(e.target.value)}
                    placeholder="Tus expectativas personales..."
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECCIÓN 8: ¡¡TU HISTORIA!! ACTIVIDAD FÍSICA (Preguntas 40 a 44)  */}
          {/* ============================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 8 ? 0 : 8)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Heart size={16} className="text-rose-600" />
                <span>8. ¡¡Tu Historia!! Actividad Física (Cols 41 - 45)</span>
              </span>
              {seccionAbierta === 8 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 8 && (
              <div className="space-y-3 pt-3 border-t text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Realizas actividad física actualmente?</label>
                    <select
                      value={actividadFisicaActual}
                      onChange={(e) => setActividadFisicaActual(e.target.value as 'Si' | 'No')}
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none font-semibold text-stone-800"
                    >
                      <option value="Si">Si</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Cuál o cuáles actividades?</label>
                    <input
                      type="text"
                      value={detalleActividadActual}
                      onChange={(e) => setDetalleActividadActual(e.target.value)}
                      placeholder="Caminata, pilates, gimnasio..."
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Dime 3 Deportes, actividades físicas o disciplinas que más te gusten
                  </label>
                  <input
                    type="text"
                    value={deportesFavoritos}
                    onChange={(e) => setDeportesFavoritos(e.target.value)}
                    placeholder="Ej: Natación, HIIT, Senderismo..."
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Realizaste alguna actividad antes?</label>
                    <input
                      type="text"
                      value={actividadesPrevias}
                      onChange={(e) => setActividadesPrevias(e.target.value)}
                      placeholder="Danza, gimnasia, atletismo..."
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Cuántas horas duermes diariamente?</label>
                    <input
                      type="text"
                      value={horasSueno}
                      onChange={(e) => setHorasSueno(e.target.value)}
                      placeholder="Ej: 7 a 8 horas..."
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECCIÓN 9: CÓMO ESTÁS EMOCIONALMENTE (Preguntas 45 a 47)        */}
          {/* ============================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 9 ? 0 : 9)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Heart size={16} className="text-rose-600" />
                <span>9. Cómo estás Emocionalmente (Cols 46 - 48)</span>
              </span>
              {seccionAbierta === 9 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 9 && (
              <div className="space-y-3 pt-3 border-t text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    ¿Cómo consideras que te sientes emocionalmente? (Explaya los motivos)
                  </label>
                  <textarea
                    rows={2}
                    value={estadoEmocional}
                    onChange={(e) => setEstadoEmocional(e.target.value)}
                    placeholder="Motivada, estresada, con ganas de un cambio..."
                    className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Asistes a terapia (tradicional o alternativa)?</label>
                    <input
                      type="text"
                      value={asisteTerapia}
                      onChange={(e) => setAsisteTerapia(e.target.value)}
                      placeholder="Psicología, coaching, yoga, ninguna..."
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">¿Cuál o cuáles?</label>
                    <input
                      type="text"
                      value={detalleTerapia}
                      onChange={(e) => setDetalleTerapia(e.target.value)}
                      placeholder="Detalle o frecuencia..."
                      className="w-full rounded-xl border border-stone-300 p-2.5 outline-none focus:border-rose-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECCIÓN 10: IMPORTANTE & COMPROMISO (Pregunta 48 / Col 49)      */}
          {/* ============================================================== */}
          <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-5 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 10 ? 0 : 10)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-rose-950 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-rose-600" />
                <span>10. Importante & Compromiso (Col 49)</span>
              </span>
              {seccionAbierta === 10 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 10 && (
              <div className="space-y-3 pt-3 border-t border-rose-200 text-xs">
                <div>
                  <label className="block font-black text-rose-950 mb-1 uppercase tracking-tight text-[11px]">
                    ¿ESTÁS DISPUESTO O DISPUESTA A RECIBIR NUESTRA AYUDA PARA MEJORAR TU SALUD DE MANERA INTEGRAL Y DIVERTIDA? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={compromisoAyuda}
                    onChange={(e) => setCompromisoAyuda(e.target.value as 'Si' | 'No' | 'Porsupuesto')}
                    className="w-full rounded-xl border border-rose-300 bg-white p-3 outline-none font-black text-rose-900 text-sm"
                  >
                    <option value="Porsupuesto">Porsupuesto</option>
                    <option value="Si">Si</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <button
              type="button"
              onClick={guardarBorrador}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-5 py-3 text-xs font-bold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
            >
              <Save size={16} />
              <span>Guardar Borrador Temporal</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 px-8 py-3.5 text-xs font-black uppercase tracking-wide text-white shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <Lock size={16} />
              <span>FINALIZAR REGISTRO (49 Campos Oficiales)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
