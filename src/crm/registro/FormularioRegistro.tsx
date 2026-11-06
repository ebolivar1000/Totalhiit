import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  Heart,
  Lock,
  MessageCircle,
  Printer,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { FichaRegistro, FICHAS_INICIALES } from '../tiposFicha';
import { exportarAExcel, exportarAPDF } from '../exportador';

const STORAGE_FICHAS = 'totalhiit_crm_fichas_registro';
const STORAGE_DRAFT = 'totalhiit_crm_registro_draft';
const STORAGE_FINALIZADA_ID = 'totalhiit_mi_ficha_id';

interface Props {
  onVolverAdmin?: () => void;
  esAdmin?: boolean;
}

export default function FormularioRegistro({ onVolverAdmin, esAdmin }: Props) {
  // Estado de Ficha ya finalizada (Bloqueo)
  const [fichaFinalizada, setFichaFinalizada] = useState<FichaRegistro | null>(null);

  // Estados de Formulario
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [sexo, setSexo] = useState<'Femenino' | 'Masculino'>('Femenino');
  const [apodo, setApodo] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [edad, setEdad] = useState<number>(35);
  const [localidadPais, setLocalidadPais] = useState('');
  const [telefonoWhatsapp, setTelefonoWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [contactoEmergencia, setContactoEmergencia] = useState('');
  const [consentimientoFotos, setConsentimientoFotos] = useState<'Sí' | 'No'>('Sí');
  const [sumarGrupoWhatsapp, setSumarGrupoWhatsapp] = useState<'Sí' | 'No'>('Sí');

  // Contextura Corporal
  const [altura, setAltura] = useState('1.65M');
  const [peso, setPeso] = useState('65.0Kg');
  const [tallaRemera, setTallaRemera] = useState<'S' | 'M' | 'L' | 'XL'>('M');

  // Datos Médicos
  const [alergias, setAlergias] = useState('');
  const [embarazos, setEmbarazos] = useState<'Sí' | 'No'>('No');
  const [hijos, setHijos] = useState<'Sí' | 'No' | 'No pienso tener'>('No');
  const [tuvoCovid, setTuvoCovid] = useState<'Sí' | 'No'>('No');
  const [secuelasCovid, setSecuelasCovid] = useState('');
  const [problemasMusculares, setProblemasMusculares] = useState<'Sí' | 'No'>('No');
  const [detalleLesiones, setDetalleLesiones] = useState('');
  const [tratamientoActual, setTratamientoActual] = useState('');
  const [tomaMedicamentos, setTomaMedicamentos] = useState<'Sí' | 'No'>('No');
  const [detalleMedicamentos, setDetalleMedicamentos] = useState('');
  const [discapacidad, setDiscapacidad] = useState('');
  const [observacionesMedicas, setObservacionesMedicas] = useState('');

  // Hábitos
  const [consumeAlcohol, setConsumeAlcohol] = useState<'Sí' | 'No' | 'Algunas veces y poca cantidad'>('Algunas veces y poca cantidad');
  const [fuma, setFuma] = useState<'Sí' | 'No'>('No');
  const [frecuenciaFuma, setFrecuenciaFuma] = useState('');
  const [suplementosAnticonceptivos, setSuplementosAnticonceptivos] = useState('');
  const [horasSueno, setHorasSueno] = useState('7 - 8 horas');

  // Objetivos & Metas
  const [objetivoPrincipal, setObjetivoPrincipal] = useState<
    'Corporal: Bajar grasa y aumentar masa muscular' | 'Mejorar tu salud de manera integral'
  >('Corporal: Bajar grasa y aumentar masa muscular');
  const [motivoTotalhiit, setMotivoTotalhiit] = useState('');
  const [expectativas, setExpectativas] = useState('');
  const [actividadFisicaActual, setActividadFisicaActual] = useState<'Sí' | 'No'>('Sí');
  const [detalleActividadActual, setDetalleActividadActual] = useState('');
  const [deportesFavoritos, setDeportesFavoritos] = useState('');
  const [actividadesPrevias, setActividadesPrevias] = useState('');
  const [estadoEmocional, setEstadoEmocional] = useState('');
  const [asisteTerapia, setAsisteTerapia] = useState('');
  const [detalleTerapia, setDetalleTerapia] = useState('');
  const [compromisoAyuda, setCompromisoAyuda] = useState<'Sí' | 'No' | 'Por supuesto'>('Por supuesto');

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
        if (d.telefonoWhatsapp) setTelefonoWhatsapp(d.telefonoWhatsapp);
        if (d.instagram) setInstagram(d.instagram);
        if (d.contactoEmergencia) setContactoEmergencia(d.contactoEmergencia);
        if (d.altura) setAltura(d.altura);
        if (d.peso) setPeso(d.peso);
        if (d.tallaRemera) setTallaRemera(d.tallaRemera);
        if (d.alergias) setAlergias(d.alergias);
        if (d.embarazos) setEmbarazos(d.embarazos);
        if (d.hijos) setHijos(d.hijos);
        if (d.tuvoCovid) setTuvoCovid(d.tuvoCovid);
        if (d.secuelasCovid) setSecuelasCovid(d.secuelasCovid);
        if (d.problemasMusculares) setProblemasMusculares(d.problemasMusculares);
        if (d.detalleLesiones) setDetalleLesiones(d.detalleLesiones);
        if (d.tratamientoActual) setTratamientoActual(d.tratamientoActual);
        if (d.tomaMedicamentos) setTomaMedicamentos(d.tomaMedicamentos);
        if (d.detalleMedicamentos) setDetalleMedicamentos(d.detalleMedicamentos);
        if (d.discapacidad) setDiscapacidad(d.discapacidad);
        if (d.observacionesMedicas) setObservacionesMedicas(d.observacionesMedicas);
        if (d.consumeAlcohol) setConsumeAlcohol(d.consumeAlcohol);
        if (d.fuma) setFuma(d.fuma);
        if (d.frecuenciaFuma) setFrecuenciaFuma(d.frecuenciaFuma);
        if (d.suplementosAnticonceptivos) setSuplementosAnticonceptivos(d.suplementosAnticonceptivos);
        if (d.horasSueno) setHorasSueno(d.horasSueno);
        if (d.objetivoPrincipal) setObjetivoPrincipal(d.objetivoPrincipal);
        if (d.motivoTotalhiit) setMotivoTotalhiit(d.motivoTotalhiit);
        if (d.expectativas) setExpectativas(d.expectativas);
        if (d.actividadFisicaActual) setActividadFisicaActual(d.actividadFisicaActual);
        if (d.detalleActividadActual) setDetalleActividadActual(d.detalleActividadActual);
        if (d.deportesFavoritos) setDeportesFavoritos(d.deportesFavoritos);
        if (d.actividadesPrevias) setActividadesPrevias(d.actividadesPrevias);
        if (d.estadoEmocional) setEstadoEmocional(d.estadoEmocional);
        if (d.asisteTerapia) setAsisteTerapia(d.asisteTerapia);
        if (d.detalleTerapia) setDetalleTerapia(d.detalleTerapia);
        if (d.compromisoAyuda) setCompromisoAyuda(d.compromisoAyuda);
      } catch {}
    }
  }, [esAdmin]);

  // Auto-guardado de borrador
  const guardarBorrador = () => {
    const d = {
      email,
      nombre,
      apellido,
      sexo,
      apodo,
      fechaNacimiento,
      edad,
      localidadPais,
      telefonoWhatsapp,
      instagram,
      contactoEmergencia,
      altura,
      peso,
      tallaRemera,
      alergias,
      embarazos,
      hijos,
      tuvoCovid,
      secuelasCovid,
      problemasMusculares,
      detalleLesiones,
      tratamientoActual,
      tomaMedicamentos,
      detalleMedicamentos,
      discapacidad,
      observacionesMedicas,
      consumeAlcohol,
      fuma,
      frecuenciaFuma,
      suplementosAnticonceptivos,
      horasSueno,
      objetivoPrincipal,
      motivoTotalhiit,
      expectativas,
      actividadFisicaActual,
      detalleActividadActual,
      deportesFavoritos,
      actividadesPrevias,
      estadoEmocional,
      asisteTerapia,
      detalleTerapia,
      compromisoAyuda,
    };
    localStorage.setItem(STORAGE_DRAFT, JSON.stringify(d));
    setMensajeGuardado(true);
    setTimeout(() => setMensajeGuardado(false), 2500);
  };

  // Finalizar Registro
  const handleFinalizar = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion('');

    if (!nombre.trim() || !apellido.trim()) {
      setErrorValidacion('Por favor ingresa tu Nombre y Apellido.');
      setSeccionAbierta(1);
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorValidacion('Por favor ingresa un correo electrónico válido.');
      setSeccionAbierta(1);
      return;
    }
    if (!telefonoWhatsapp.trim()) {
      setErrorValidacion('Por favor ingresa tu número de WhatsApp para contactarte.');
      setSeccionAbierta(1);
      return;
    }

    const confirma = window.confirm(
      '¿Deseas finalizar tu registro ahora? Una vez enviado, tus datos quedarán guardados de forma segura en TOTALHIIT y por seguridad médica no podrán ser alterados nuevamente.'
    );
    if (!confirma) return;

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
      edad: Number(edad) || 30,
      localidad_pais: localidadPais.trim() || 'No indicada',
      telefono_whatsapp: telefonoWhatsapp.trim(),
      instagram: instagram.trim() || undefined,
      contacto_emergencia: contactoEmergencia.trim() || 'No especificado',
      consentimiento_fotos: consentimientoFotos,
      sumar_grupo_whatsapp: sumarGrupoWhatsapp,
      altura: altura.trim() || '1.65M',
      peso: peso.trim() || '65.0Kg',
      talla_remera: tallaRemera,
      alergias: alergias.trim() || 'Ninguna indicada',
      embarazos,
      hijos,
      tuvo_covid: tuvoCovid,
      secuelas_covid: secuelasCovid.trim() || undefined,
      problemas_musculares_oseos: problemasMusculares,
      detalle_lesiones: detalleLesiones.trim() || undefined,
      tratamiento_actual: tratamientoActual.trim() || undefined,
      toma_medicamentos: tomaMedicamentos,
      detalle_medicamentos: detalleMedicamentos.trim() || undefined,
      discapacidad: discapacidad.trim() || 'Ninguna',
      observaciones_medicas: observacionesMedicas.trim() || undefined,
      consume_alcohol: consumeAlcohol,
      fuma,
      frecuencia_fuma: frecuenciaFuma.trim() || undefined,
      suplementos_anticonceptivos: suplementosAnticonceptivos.trim() || undefined,
      horas_sueno: horasSueno || '8 horas',
      objetivo_principal: objetivoPrincipal,
      motivo_totalhiit: motivoTotalhiit.trim() || undefined,
      expectativas: expectativas.trim() || undefined,
      actividad_fisica_actual: actividadFisicaActual,
      detalle_actividad_actual: detalleActividadActual.trim() || undefined,
      deportes_favoritos: deportesFavoritos.trim() || undefined,
      actividades_previas: actividadesPrevias.trim() || undefined,
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
    localStorage.setItem('totalhiit_crm_fichas_registro_v3', JSON.stringify(actualizada));
    localStorage.removeItem(STORAGE_DRAFT);
    localStorage.setItem(STORAGE_FINALIZADA_ID, nuevaFicha.id);

    // Bloquear formulario y mostrar vista de confirmación
    setFichaFinalizada(nuevaFicha);
  };

  // Exportar Ficha a Excel
  const exportarMiFichaExcel = (ficha: FichaRegistro) => {
    const columnas = ['Campo', 'Respuesta Registrada'];
    const filas: (string | number)[][] = [
      ['ID de Registro', ficha.id],
      ['Fecha y Hora', ficha.fecha_registro],
      ['Nombre Completo', ficha.nombre_completo],
      ['Apodo Preferido', ficha.apodo || '—'],
      ['Correo Electrónico', ficha.email],
      ['WhatsApp / Teléfono', ficha.telefono_whatsapp],
      ['Sexo', ficha.sexo],
      ['Edad', ficha.edad],
      ['Fecha de Nacimiento', ficha.fecha_nacimiento],
      ['Localidad y País', ficha.localidad_pais],
      ['Instagram', ficha.instagram || '—'],
      ['Contacto de Emergencia', ficha.contacto_emergencia],
      ['Consentimiento Fotos/Videos', ficha.consentimiento_fotos],
      ['Sumar al Grupo WhatsApp', ficha.sumar_grupo_whatsapp],
      ['Altura', ficha.altura],
      ['Peso', ficha.peso],
      ['Talla de Remera', ficha.talla_remera],
      ['Alergias', ficha.alergias],
      ['¿Embarazos?', ficha.embarazos],
      ['¿Hijos?', ficha.hijos],
      ['¿Tuvo Coronavirus?', ficha.tuvo_covid],
      ['Secuelas COVID', ficha.secuelas_covid || '—'],
      ['Problemas Musculares / Lesiones', ficha.problemas_musculares_oseos],
      ['Detalle de Lesiones', ficha.detalle_lesiones || '—'],
      ['Tratamiento Actual', ficha.tratamiento_actual || '—'],
      ['¿Toma Medicamentos?', ficha.toma_medicamentos],
      ['Detalle Medicamentos', ficha.detalle_medicamentos || '—'],
      ['Discapacidad', ficha.discapacidad || '—'],
      ['Observaciones Médicas', ficha.observaciones_medicas || '—'],
      ['Consumo de Alcohol', ficha.consume_alcohol],
      ['¿Fuma?', ficha.fuma],
      ['Frecuencia de Fumar', ficha.frecuencia_fuma || '—'],
      ['Suplementos / Anticonceptivos', ficha.suplementos_anticonceptivos || '—'],
      ['Horas de Sueño', ficha.horas_sueno],
      ['Objetivo Principal', ficha.objetivo_principal],
      ['¿Por qué TotalHIIT?', ficha.motivo_totalhiit || '—'],
      ['Expectativas', ficha.expectativas || '—'],
      ['¿Actividad Física Actual?', ficha.actividad_fisica_actual],
      ['Detalle Actividad Actual', ficha.detalle_actividad_actual || '—'],
      ['Deportes Favoritos', ficha.deportes_favoritos || '—'],
      ['Actividades Previas', ficha.actividades_previas || '—'],
      ['Estado Emocional', ficha.estado_emocional || '—'],
      ['¿Asiste a Terapia?', ficha.asiste_terapia || '—'],
      ['Compromiso y Buena Disposición', ficha.compromiso_ayuda],
    ];

    exportarAExcel(
      `Ficha_TotalHIIT_${ficha.nombre.replace(/\s+/g, '_')}`,
      `Ficha Integral de ${ficha.nombre_completo}`,
      columnas,
      filas
    );
  };

  // Exportar Ficha a PDF
  const exportarMiFichaPDF = (ficha: FichaRegistro) => {
    const columnas = ['Área / Pregunta', 'Respuesta Certificada'];
    const filas: (string | number)[][] = [
      ['Alumna / Atleta', ficha.nombre_completo],
      ['Apodo Preferido', ficha.apodo || '—'],
      ['Email', ficha.email],
      ['WhatsApp', ficha.telefono_whatsapp],
      ['Edad y Fecha Nac.', `${ficha.edad} años (${ficha.fecha_nacimiento})`],
      ['Ubicación', ficha.localidad_pais],
      ['Contacto de Emergencia', ficha.contacto_emergencia],
      ['Medidas Corporales', `Altura: ${ficha.altura} | Peso: ${ficha.peso} | Talla: ${ficha.talla_remera}`],
      ['Alergias', ficha.alergias],
      ['Lesiones / Articulaciones', ficha.detalle_lesiones || (ficha.problemas_musculares_oseos === 'Sí' ? 'Sí' : 'Ninguna')],
      ['Medicamentos', ficha.detalle_medicamentos || (ficha.toma_medicamentos === 'Sí' ? 'Sí' : 'Ninguno')],
      ['COVID y Secuelas', ficha.secuelas_covid || (ficha.tuvo_covid === 'Sí' ? 'Tuvo COVID sin secuelas' : 'No')],
      ['Hábitos (Alcohol / Tabaco)', `Alcohol: ${ficha.consume_alcohol} | Tabaco: ${ficha.fuma}`],
      ['Horas de Sueño', ficha.horas_sueno],
      ['Objetivo Principal', ficha.objetivo_principal],
      ['Motivo de Ingreso', ficha.motivo_totalhiit || '—'],
      ['Actividad Actual', ficha.detalle_actividad_actual || ficha.actividad_fisica_actual],
      ['Deportes Favoritos', ficha.deportes_favoritos || '—'],
      ['Estado Emocional', ficha.estado_emocional || '—'],
      ['Compromiso con el Entrenamiento', ficha.compromiso_ayuda],
    ];

    exportarAPDF(
      `Ficha Integral de Salud y Entrenamiento`,
      `Alumna: ${ficha.nombre_completo} | Registrado: ${ficha.fecha_registro}`,
      columnas,
      filas,
      [
        { etiqueta: 'Alumna', valor: ficha.nombre_completo },
        { etiqueta: 'Edad', valor: `${ficha.edad} años` },
        { etiqueta: 'Objetivo', valor: ficha.objetivo_principal.includes('Corporal') ? 'Composición Corporal' : 'Salud Integral' },
      ]
    );
  };

  // ==============================================================================
  // VISTA DE BLOQUEO Y CONFIRMACIÓN (LUEGO DE FINALIZAR REGISTRO)
  // ==============================================================================
  if (fichaFinalizada) {
    return (
      <div className="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 font-sans">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Tarjeta de Éxito y Bloqueo */}
          <div className="rounded-3xl border border-emerald-200 bg-white p-6 sm:p-8 shadow-xl text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <Lock size={12} /> Ficha Bloqueada & Certificada
              </span>
              <h1 className="text-2xl font-black text-stone-900">
                ¡Registro Finalizado con Éxito!
              </h1>
              <p className="text-sm font-semibold text-rose-600">
                {fichaFinalizada.nombre_completo} ({fichaFinalizada.email})
              </p>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed max-w-lg mx-auto">
              Tus datos han sido registrados de forma segura y confidencial en el sistema de TOTALHIIT. Por motivos de privacidad médica y para garantizar la consistencia de tu plan, <strong>este formulario ya no puede ser modificado</strong>.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => exportarMiFichaExcel(fichaFinalizada)}
                className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
              >
                <FileSpreadsheet size={15} className="text-emerald-600" />
                <span>Descargar Mi Ficha en Excel</span>
              </button>

              <button
                onClick={() => exportarMiFichaPDF(fichaFinalizada)}
                className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
              >
                <Printer size={15} className="text-rose-600" />
                <span>Guardar en PDF / Imprimir</span>
              </button>

              <a
                href={`https://wa.me/5491134567890?text=${encodeURIComponent(
                  `¡Hola Valen! Ya completé y finalicé mi Ficha de Registro en TOTALHIIT. Mi nombre es ${fichaFinalizada.nombre_completo}. ¡Lista para comenzar!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <MessageCircle size={15} />
                <span>Avisar a mi Coach por WhatsApp</span>
              </a>
            </div>

            {onVolverAdmin && (
              <div className="pt-3 border-t">
                <button
                  onClick={onVolverAdmin}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800 underline"
                >
                  Volver al Panel de Administración CRM
                </button>
              </div>
            )}
          </div>

          {/* Resumen de Datos Registrados */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Activity size={16} className="text-rose-600" />
                <span>Resumen de tu Ficha Registrada</span>
              </h3>
              <span className="text-[11px] text-stone-400 font-mono">{fichaFinalizada.fecha_registro}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-700">
              <div className="p-3 bg-stone-50 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Identificación</span>
                <div><strong>Alumna:</strong> {fichaFinalizada.nombre_completo} {fichaFinalizada.apodo ? `("${fichaFinalizada.apodo}")` : ''}</div>
                <div><strong>Edad / Nac.:</strong> {fichaFinalizada.edad} años ({fichaFinalizada.fecha_nacimiento})</div>
                <div><strong>Ubicación:</strong> {fichaFinalizada.localidad_pais}</div>
                <div><strong>WhatsApp:</strong> {fichaFinalizada.telefono_whatsapp}</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Contextura Corporal</span>
                <div><strong>Estatura:</strong> {fichaFinalizada.altura}</div>
                <div><strong>Peso Actual:</strong> {fichaFinalizada.peso}</div>
                <div><strong>Talla Remera:</strong> Talla {fichaFinalizada.talla_remera}</div>
                <div><strong>Contacto Emergencia:</strong> {fichaFinalizada.contacto_emergencia}</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Objetivo & Metas</span>
                <div><strong>Meta Principal:</strong> <span className="font-bold text-rose-600">{fichaFinalizada.objetivo_principal}</span></div>
                {fichaFinalizada.motivo_totalhiit && <div><strong>¿Por qué TotalHIIT?:</strong> {fichaFinalizada.motivo_totalhiit}</div>}
                {fichaFinalizada.alergias && <div><strong>Alergias:</strong> {fichaFinalizada.alergias}</div>}
                {fichaFinalizada.detalle_lesiones && <div><strong>Lesiones previas:</strong> {fichaFinalizada.detalle_lesiones}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================================
  // FORMULARIO PRINCIPAL ACTIVO (PARA LA ALUMNA)
  // ==============================================================================
  return (
    <div className="min-h-screen bg-stone-100 py-6 px-3 sm:px-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Encabezado con Branding TotalHIIT */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo_valen.jpeg"
                alt="TotalHIIT Logo"
                className="h-12 w-12 rounded-2xl object-cover shadow-sm ring-2 ring-rose-500/20"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-wider text-stone-900">TOTAL<span className="text-rose-600">HIIT</span></span>
                  <span className="rounded-full bg-rose-50 px-2 py-0.2 text-[9px] font-bold text-rose-600 border border-rose-200">OFICIAL</span>
                </div>
                <h1 className="text-base sm:text-lg font-bold text-stone-900">
                  Ficha Integral de Salud & Entrenamiento
                </h1>
              </div>
            </div>

            {onVolverAdmin && (
              <button
                type="button"
                onClick={onVolverAdmin}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200"
              >
                ← Volver al CRM
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-xs text-stone-700 leading-relaxed space-y-2">
            <p className="font-semibold text-rose-900">
              ¡Hola, Bienvenida a TOTALHIIT! 💪✨
            </p>
            <p>
              El siguiente formulario consta de una serie de preguntas acerca de ti con el fin de conocerte mejor y poder llevar a cabo un <strong>entrenamiento de calidad, seguro, divertido, eficiente y funcional</strong>. El objetivo primordial es prevenir lesiones y adaptar cada movimiento a tu historia.
            </p>
            <p className="text-[11px] text-stone-500 flex items-center gap-1">
              <ShieldCheck size={14} className="text-rose-600 shrink-0" />
              <span>Por favor responde con sinceridad. Tus respuestas son 100% privadas y confidenciales entre tú y tu Coach.</span>
            </p>
          </div>

          {/* Barra de Progreso / Secciones */}
          <div className="flex items-center justify-between gap-1 text-[11px] font-bold pt-1">
            {[
              { num: 1, label: 'Personales' },
              { num: 2, label: 'Cuerpo' },
              { num: 3, label: 'Médicos' },
              { num: 4, label: 'Hábitos' },
              { num: 5, label: 'Objetivos' },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setSeccionAbierta(s.num)}
                className={`flex-1 py-1.5 rounded-xl transition text-center ${
                  seccionAbierta === s.num
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {s.num}. {s.label}
              </button>
            ))}
          </div>
        </div>

        {errorValidacion && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorValidacion}</span>
          </div>
        )}

        <form onSubmit={handleFinalizar} className="space-y-4 text-xs">
          {/* ========================================================== */}
          {/* SECCIÓN 1: DATOS PERSONALES                                */}
          {/* ========================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 1 ? 0 : 1)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900"
            >
              <span className="flex items-center gap-2">
                <User size={16} className="text-rose-600" />
                <span>1. Datos Personales & Contacto</span>
              </span>
              {seccionAbierta === 1 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 1 && (
              <div className="space-y-3 pt-2 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Nombre *</label>
                    <input
                      type="text"
                      required
                      placeholder="ej: Valentina"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none focus:border-rose-600 bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Apellido *</label>
                    <input
                      type="text"
                      required
                      placeholder="ej: Bolívar"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none focus:border-rose-600 bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Correo Electrónico (Email) *</label>
                    <input
                      type="email"
                      required
                      placeholder="tuemail@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none focus:border-rose-600 bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Teléfono y/o WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+54 9 11 1234 5678"
                      value={telefonoWhatsapp}
                      onChange={(e) => setTelefonoWhatsapp(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none focus:border-rose-600 bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Sexo</label>
                    <select
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value as typeof sexo)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50 font-semibold"
                    >
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Edad</label>
                    <input
                      type="number"
                      min="15"
                      max="95"
                      value={edad}
                      onChange={(e) => setEdad(Number(e.target.value))}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={fechaNacimiento}
                      onChange={(e) => setFechaNacimiento(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      ¿Apodo? ¿Cómo quieres que te llamemos?
                    </label>
                    <input
                      type="text"
                      placeholder="ej: Valen, Caro, Sofi..."
                      value={apodo}
                      onChange={(e) => setApodo(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      ¿Dónde vives? Localidad, País
                    </label>
                    <input
                      type="text"
                      placeholder="ej: Palermo, Buenos Aires, Argentina"
                      value={localidadPais}
                      onChange={(e) => setLocalidadPais(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Instagram (@usuario)</label>
                    <input
                      type="text"
                      placeholder="@tu_usuario"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Contacto de Emergencia</label>
                    <input
                      type="text"
                      placeholder="Nombre, teléfono y parentesco"
                      value={contactoEmergencia}
                      onChange={(e) => setContactoEmergencia(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="rounded-2xl border border-stone-200 p-3 bg-stone-50/40">
                    <span className="block text-[11px] font-bold text-stone-700 mb-1">
                      ¿Consentimiento para fotos/videos de corrección técnica?
                    </span>
                    <div className="flex gap-4">
                      {['Sí', 'No'].map((op) => (
                        <label key={op} className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <input
                            type="radio"
                            name="consentimientoFotos"
                            checked={consentimientoFotos === op}
                            onChange={() => setConsentimientoFotos(op as 'Sí' | 'No')}
                            className="accent-rose-600"
                          />
                          <span>{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-200 p-3 bg-stone-50/40">
                    <span className="block text-[11px] font-bold text-stone-700 mb-1">
                      ¿Quieres sumarte al grupo de WhatsApp de clases ONLINE?
                    </span>
                    <div className="flex gap-4">
                      {['Sí', 'No'].map((op) => (
                        <label key={op} className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <input
                            type="radio"
                            name="sumarGrupoWhatsapp"
                            checked={sumarGrupoWhatsapp === op}
                            onChange={() => setSumarGrupoWhatsapp(op as 'Sí' | 'No')}
                            className="accent-rose-600"
                          />
                          <span>{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================== */}
          {/* SECCIÓN 2: CONTEXTURA CORPORAL                             */}
          {/* ========================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 2 ? 0 : 2)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900"
            >
              <span className="flex items-center gap-2">
                <Activity size={16} className="text-rose-600" />
                <span>2. Contextura Corporal & Talla</span>
              </span>
              {seccionAbierta === 2 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Altura (en Metros)</label>
                  <input
                    type="text"
                    placeholder="ej: 1.68M"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50 font-bold"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Ejemplo: 1.70M</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Peso (en Kg con decimal)</label>
                  <input
                    type="text"
                    placeholder="ej: 64.5Kg"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50 font-bold"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Ejemplo: 65,5Kg</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Talla de Remera / Camiseta</label>
                  <select
                    value={tallaRemera}
                    onChange={(e) => setTallaRemera(e.target.value as typeof tallaRemera)}
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50 font-bold"
                  >
                    <option value="S">Talla S</option>
                    <option value="M">Talla M</option>
                    <option value="L">Talla L</option>
                    <option value="XL">Talla XL</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================== */}
          {/* SECCIÓN 3: DATOS MÉDICOS Y ANTECEDENTES                   */}
          {/* ========================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 3 ? 0 : 3)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900"
            >
              <span className="flex items-center gap-2">
                <Heart size={16} className="text-rose-600" />
                <span>3. Datos Médicos & Antecedentes Clínicos</span>
              </span>
              {seccionAbierta === 3 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 3 && (
              <div className="space-y-3 pt-2 border-t">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Alergias (Especifica TODAS, inclusive las que consideres mínimas)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Medicamentos, alimentos, picaduras, polen o ninguna..."
                    value={alergias}
                    onChange={(e) => setAlergias(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-stone-200 p-3 bg-stone-50/40">
                    <span className="block text-[11px] font-bold text-stone-700 mb-1">¿Embarazos?</span>
                    <div className="flex gap-4">
                      {['Sí', 'No'].map((op) => (
                        <label key={op} className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <input
                            type="radio"
                            name="embarazos"
                            checked={embarazos === op}
                            onChange={() => setEmbarazos(op as 'Sí' | 'No')}
                            className="accent-rose-600"
                          />
                          <span>{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-200 p-3 bg-stone-50/40">
                    <span className="block text-[11px] font-bold text-stone-700 mb-1">¿Tienes hijos?</span>
                    <div className="flex gap-3">
                      {['Sí', 'No', 'No pienso tener'].map((op) => (
                        <label key={op} className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <input
                            type="radio"
                            name="hijos"
                            checked={hijos === op}
                            onChange={() => setHijos(op as typeof hijos)}
                            className="accent-rose-600"
                          />
                          <span>{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-200 p-3.5 bg-stone-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-800">
                      ¿Tuviste Coronavirus?
                    </span>
                    <div className="flex gap-4">
                      {['Sí', 'No'].map((op) => (
                        <label key={op} className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <input
                            type="radio"
                            name="tuvoCovid"
                            checked={tuvoCovid === op}
                            onChange={() => setTuvoCovid(op as 'Sí' | 'No')}
                            className="accent-rose-600"
                          />
                          <span>{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {tuvoCovid === 'Sí' && (
                    <div>
                      <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                        ¿Quedaste con problemas respiratorios o cansancio extremo? Explica:
                      </label>
                      <input
                        type="text"
                        placeholder="Ninguna secuela / Me agito más rápido..."
                        value={secuelasCovid}
                        onChange={(e) => setSecuelasCovid(e.target.value)}
                        className="w-full rounded-xl border border-stone-300 p-2 text-xs bg-white outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-stone-200 p-3.5 bg-stone-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-800">
                      ¿Problemas, patologías o lesiones musculares, articulares u óseas?
                    </span>
                    <div className="flex gap-4">
                      {['Sí', 'No'].map((op) => (
                        <label key={op} className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <input
                            type="radio"
                            name="problemasMusculares"
                            checked={problemasMusculares === op}
                            onChange={() => setProblemasMusculares(op as 'Sí' | 'No')}
                            className="accent-rose-600"
                          />
                          <span>{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {problemasMusculares === 'Sí' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                          ¿Desde cuándo y qué tienes?
                        </label>
                        <input
                          type="text"
                          placeholder="ej: Lumbalgia desde 2023, menisco derecho..."
                          value={detalleLesiones}
                          onChange={(e) => setDetalleLesiones(e.target.value)}
                          className="w-full rounded-xl border border-stone-300 p-2 text-xs bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                          ¿Realizas algún tratamiento?
                        </label>
                        <input
                          type="text"
                          placeholder="Kinesiología, plantillas, etc."
                          value={tratamientoActual}
                          onChange={(e) => setTratamientoActual(e.target.value)}
                          className="w-full rounded-xl border border-stone-300 p-2 text-xs bg-white outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-stone-200 p-3.5 bg-stone-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-800">
                      ¿Tomas algún medicamento en el día a día?
                    </span>
                    <div className="flex gap-4">
                      {['Sí', 'No'].map((op) => (
                        <label key={op} className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <input
                            type="radio"
                            name="tomaMedicamentos"
                            checked={tomaMedicamentos === op}
                            onChange={() => setTomaMedicamentos(op as 'Sí' | 'No')}
                            className="accent-rose-600"
                          />
                          <span>{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {tomaMedicamentos === 'Sí' && (
                    <div>
                      <label className="block text-[10px] font-semibold text-stone-600 mb-0.5">
                        ¿Cuál, cada cuántas horas y qué dosis?
                      </label>
                      <input
                        type="text"
                        placeholder="ej: Levotiroxina 50mcg en ayunas..."
                        value={detalleMedicamentos}
                        onChange={(e) => setDetalleMedicamentos(e.target.value)}
                        className="w-full rounded-xl border border-stone-300 p-2 text-xs bg-white outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      ¿Discapacidad motriz, auditiva, visual o verbal?
                    </label>
                    <input
                      type="text"
                      placeholder="Ninguna / Especificar..."
                      value={discapacidad}
                      onChange={(e) => setDiscapacidad(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Observaciones de utilidad médica
                    </label>
                    <input
                      type="text"
                      placeholder="Cualquier dato extra que debamos saber..."
                      value={observacionesMedicas}
                      onChange={(e) => setObservacionesMedicas(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================== */}
          {/* SECCIÓN 4: HÁBITOS, SUSTANCIAS Y SUEÑO                     */}
          {/* ========================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 4 ? 0 : 4)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-rose-600" />
                <span>4. Hábitos, Suplementación & Sueño</span>
              </span>
              {seccionAbierta === 4 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 4 && (
              <div className="space-y-3 pt-2 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-stone-200 p-3 bg-stone-50/40">
                    <span className="block text-[11px] font-bold text-stone-700 mb-1">
                      ¿Consumes bebidas alcohólicas?
                    </span>
                    <select
                      value={consumeAlcohol}
                      onChange={(e) => setConsumeAlcohol(e.target.value as typeof consumeAlcohol)}
                      className="w-full rounded-xl border border-stone-300 p-2 text-xs bg-white font-semibold outline-none"
                    >
                      <option value="No">No</option>
                      <option value="Algunas veces y poca cantidad">Algunas veces y poca cantidad</option>
                      <option value="Sí">Sí</option>
                    </select>
                  </div>

                  <div className="rounded-2xl border border-stone-200 p-3 bg-stone-50/40">
                    <span className="block text-[11px] font-bold text-stone-700 mb-1">¿Fumas?</span>
                    <div className="flex gap-4 mb-1">
                      {['Sí', 'No'].map((op) => (
                        <label key={op} className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <input
                            type="radio"
                            name="fuma"
                            checked={fuma === op}
                            onChange={() => setFuma(op as 'Sí' | 'No')}
                            className="accent-rose-600"
                          />
                          <span>{op}</span>
                        </label>
                      ))}
                    </div>
                    {fuma === 'Sí' && (
                      <input
                        type="text"
                        placeholder="Frecuencia y cantidad..."
                        value={frecuenciaFuma}
                        onChange={(e) => setFrecuenciaFuma(e.target.value)}
                        className="w-full rounded-xl border border-stone-300 p-1.5 text-xs bg-white outline-none mt-1"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Suplementos nutricionales, hormonas o anticonceptivos
                    </label>
                    <input
                      type="text"
                      placeholder="Proteína, creatina, colágeno, anticonceptivos..."
                      value={suplementosAnticonceptivos}
                      onChange={(e) => setSuplementosAnticonceptivos(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      ¿Cuántas horas duermes diariamente?
                    </label>
                    <input
                      type="text"
                      placeholder="ej: 7 a 8 horas con siesta"
                      value={horasSueno}
                      onChange={(e) => setHorasSueno(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================== */}
          {/* SECCIÓN 5: OBJETIVOS, METAS Y TU HISTORIA                  */}
          {/* ========================================================== */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setSeccionAbierta(seccionAbierta === 5 ? 0 : 5)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-stone-900"
            >
              <span className="flex items-center gap-2">
                <Heart size={16} className="text-rose-600" />
                <span>5. Objetivos, Metas & Tu Historia</span>
              </span>
              {seccionAbierta === 5 ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {seccionAbierta === 5 && (
              <div className="space-y-3 pt-2 border-t">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Tu Objetivo Principal en TOTALHIIT *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Corporal: Bajar grasa y aumentar masa muscular',
                      'Mejorar tu salud de manera integral',
                    ].map((obj) => (
                      <label
                        key={obj}
                        className={`rounded-2xl border p-3 flex items-start gap-2 cursor-pointer transition ${
                          objetivoPrincipal === obj
                            ? 'border-rose-600 bg-rose-50/70 text-rose-900 font-bold'
                            : 'border-stone-200 bg-stone-50/40 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="objetivoPrincipal"
                          checked={objetivoPrincipal === obj}
                          onChange={() => setObjetivoPrincipal(obj as typeof objetivoPrincipal)}
                          className="accent-rose-600 mt-0.5"
                        />
                        <span>{obj}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      ¿Por qué decidiste unirte a TOTALHIIT?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Quiero mejorar mi energía, cambiar mi cuerpo..."
                      value={motivoTotalhiit}
                      onChange={(e) => setMotivoTotalhiit(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      ¿Qué esperas recibir de nuestra parte?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Acompañamiento, motivación, rutinas dinámicas..."
                      value={expectativas}
                      onChange={(e) => setExpectativas(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-200 p-3.5 bg-stone-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-800">
                      ¿Realizas actividad física actualmente?
                    </span>
                    <div className="flex gap-4">
                      {['Sí', 'No'].map((op) => (
                        <label key={op} className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <input
                            type="radio"
                            name="actividadFisicaActual"
                            checked={actividadFisicaActual === op}
                            onChange={() => setActividadFisicaActual(op as 'Sí' | 'No')}
                            className="accent-rose-600"
                          />
                          <span>{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {actividadFisicaActual === 'Sí' && (
                    <input
                      type="text"
                      placeholder="¿Cuál o cuáles? (ej: Caminatas 3 veces por semana, gimnasio...)"
                      value={detalleActividadActual}
                      onChange={(e) => setDetalleActividadActual(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2 text-xs bg-white outline-none"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      3 deportes o actividades que más te gusten
                    </label>
                    <input
                      type="text"
                      placeholder="ej: HIIT, Natación, Bailar..."
                      value={deportesFavoritos}
                      onChange={(e) => setDeportesFavoritos(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      ¿Cómo te sientes emocionalmente hoy?
                    </label>
                    <input
                      type="text"
                      placeholder="Motivada, un poco estresada por el trabajo..."
                      value={estadoEmocional}
                      onChange={(e) => setEstadoEmocional(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 p-2.5 text-xs outline-none bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-300 bg-rose-50/60 p-4 space-y-2">
                  <span className="block text-xs font-bold text-rose-900">
                    🔥 IMPORTANTE: ¿Estás dispuesta a recibir nuestra ayuda para mejorar tu salud de manera integral y divertida?
                  </span>
                  <div className="flex flex-wrap gap-4 pt-1">
                    {['Por supuesto', 'Sí', 'No'].map((op) => (
                      <label key={op} className="flex items-center gap-1.5 cursor-pointer font-bold text-rose-900">
                        <input
                          type="radio"
                          name="compromisoAyuda"
                          checked={compromisoAyuda === op}
                          onChange={() => setCompromisoAyuda(op as typeof compromisoAyuda)}
                          className="accent-rose-600"
                        />
                        <span>{op}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botonera de Envío y Guardado */}
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={guardarBorrador}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>{mensajeGuardado ? '¡Borrador Guardado!' : 'Guardar Borrador'}</span>
              </button>

              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-black text-white hover:bg-rose-700 shadow-lg shadow-rose-600/30 transition cursor-pointer"
              >
                <Send size={16} />
                <span>FINALIZAR REGISTRO</span>
              </button>
            </div>

            <p className="text-[10px] text-stone-400 text-center">
              🔒 Al presionar <strong>FINALIZAR REGISTRO</strong>, tus datos quedan guardados y certificados. No podrás modificarlos nuevamente por motivos de seguridad médica.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
