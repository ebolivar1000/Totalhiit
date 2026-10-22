import React, { useState } from 'react';
import {
  AlertCircle,
  Check,
  DollarSign,
  Film,
  ExternalLink,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Lock,
  LogOut,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Video,
} from 'lucide-react';
import { BOOTCAMP_WEEKS, INTRO_VIDEO, STRETCHING_VIDEOS, VideoItem } from '../data/bootcampData';
import { HERO_COLLAGE } from '../data/heroCollage';
import {
  loadSiteContent,
  resetSiteContent,
  saveSiteContent,
  SiteContent,
  SitePrices,
} from '../data/siteContent';
import {
  changePassword,
  getAdminUser,
  isLoggedIn,
  login,
  logout,
} from './auth';

type Section = 'precios' | 'videos' | 'imagenes' | 'seguridad';

const VIDEO_GROUPS: { title: string; videos: VideoItem[] }[] = [
  { title: 'Video de Introducción', videos: [INTRO_VIDEO] },
  ...BOOTCAMP_WEEKS.map((week) => ({ title: week.title, videos: week.classes })),
  { title: 'Estiramiento y movilidad', videos: STRETCHING_VIDEOS },
];

const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'precios', label: 'Precios', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'videos', label: 'Videos', icon: <Film className="w-4 h-4" /> },
  { id: 'imagenes', label: 'Imágenes', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'seguridad', label: 'Seguridad', icon: <ShieldCheck className="w-4 h-4" /> },
];

/* ---------------------------------- Login --------------------------------- */

const LoginScreen: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const ok = await login(user, password);
    setLoading(false);
    if (ok) {
      onSuccess();
    } else {
      setError('Usuario o clave incorrectos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-[#E0006C]/20 blur-3xl rounded-full pointer-events-none" />

      <form
        onSubmit={submit}
        className="relative w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <p className="font-edo text-3xl text-white leading-tight">
            TOTAL<span className="text-rose-500">HIIT</span>
          </p>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-stone-500 mt-1">
            Panel de administración
          </p>
        </div>

        <label className="block text-xs font-semibold text-stone-400 mb-1.5">Usuario</label>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          autoComplete="username"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm outline-none focus:border-[#E0006C] transition-colors"
          placeholder="admin"
        />

        <label className="block text-xs font-semibold text-stone-400 mb-1.5">Clave</label>
        <div className="relative mb-5">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-4 py-3 pr-11 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm outline-none focus:border-[#E0006C] transition-colors"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
            title={show ? 'Ocultar clave' : 'Mostrar clave'}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && (
          <p className="flex items-center gap-2 text-xs text-red-400 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-[#E0006C] hover:bg-[#C2005A] disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-[#E0006C]/30 transition-all"
        >
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>

        <a
          href="/"
          className="mt-5 flex items-center justify-center gap-1.5 text-xs text-stone-500 hover:text-stone-300"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Volver al sitio
        </a>
      </form>
    </div>
  );
};

/* --------------------------------- Panel ---------------------------------- */

export const AdminApp: React.FC = () => {
  const [logged, setLogged] = useState(() => isLoggedIn());
  const [section, setSection] = useState<Section>('precios');
  const [draft, setDraft] = useState<SiteContent>(() => loadSiteContent());
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [currentPass, setCurrentPass] = useState('');
  const [nextPass, setNextPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  if (!logged) {
    return <LoginScreen onSuccess={() => setLogged(true)} />;
  }

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  };

  const setPrice = (key: keyof SitePrices, value: string) => {
    setDraft((prev) => ({ ...prev, prices: { ...prev.prices, [key]: value } }));
    setDirty(true);
  };

  const setVideo = (id: string, value: string) => {
    setDraft((prev) => {
      const videos = { ...prev.videos };
      if (value.trim()) {
        videos[id] = value.trim();
      } else {
        delete videos[id];
      }
      return { ...prev, videos };
    });
    setDirty(true);
  };

  const setHeroImage = (index: number, value: string) => {
    setDraft((prev) => {
      const heroImages = [...prev.heroImages];
      heroImages[index] = value.trim() || HERO_COLLAGE[index]?.src || '';
      return { ...prev, heroImages };
    });
    setDirty(true);
  };

  const handleSave = () => {
    saveSiteContent(draft);
    setDirty(false);
    showToast('Cambios guardados. Ya se ven en el sitio en este navegador.');
  };

  const handleReset = () => {
    if (!window.confirm('¿Restaurar precios, videos e imágenes originales?')) return;
    resetSiteContent();
    setDraft(loadSiteContent());
    setDirty(false);
    showToast('Valores originales restaurados.');
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    setPassMessage(null);
    if (nextPass !== confirmPass) {
      setPassMessage({ type: 'error', text: 'La nueva clave y su confirmación no coinciden.' });
      return;
    }
    const error = await changePassword(currentPass, nextPass);
    if (error) {
      setPassMessage({ type: 'error', text: error });
      return;
    }
    setCurrentPass('');
    setNextPass('');
    setConfirmPass('');
    setPassMessage({ type: 'ok', text: 'Clave actualizada. Usala en tu próximo ingreso.' });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-stone-900/90 backdrop-blur border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-edo text-2xl text-white leading-none">
              TOTAL<span className="text-rose-500">HIIT</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E0006C]/15 border border-[#E0006C]/30 text-[10px] font-extrabold uppercase tracking-widest text-[#FF8FBD]">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-stone-400">
              <Sparkles className="w-3.5 h-3.5 text-stone-500" /> {getAdminUser()}
            </span>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Ver sitio
            </a>
            <button
              onClick={() => {
                logout();
                setLogged(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-red-600 text-xs font-semibold text-stone-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                section === item.id
                  ? 'bg-[#E0006C] text-white shadow-lg shadow-[#E0006C]/25'
                  : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-7">
          {/* Precios */}
          {section === 'precios' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Precios de los planes</h2>
              <p className="text-xs text-stone-400 mb-6">
                Se muestran en la sección Precios según la divisa elegida (USD → Wise · ARS → Mercado Pago).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(
                  [
                    { key: 'bootcampUSD', label: 'Bootcamp TOTAL+40 · USD' },
                    { key: 'bootcampARS', label: 'Bootcamp TOTAL+40 · ARS' },
                    { key: 'annualUSD', label: 'Plan Anual · USD' },
                    { key: 'annualARS', label: 'Plan Anual · ARS' },
                  ] as { key: keyof SitePrices; label: string }[]
                ).map(({ key, label }) => (
                  <label key={key} className="block">
                    <span className="block text-xs font-semibold text-stone-400 mb-1.5">{label}</span>
                    <input
                      type="text"
                      value={draft.prices[key]}
                      onChange={(e) => setPrice(key, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm outline-none focus:border-[#E0006C] transition-colors"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {section === 'videos' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Videos del bootcamp</h2>
              <p className="text-xs text-stone-400 mb-6">
                Pegá el ID de YouTube (lo que va después de <code className="text-stone-300">watch?v=</code>).
                Dejalo vacío para mantener el video original.
              </p>

              <div className="space-y-6">
                {VIDEO_GROUPS.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-stone-500 mb-2">
                      {group.title}
                    </h3>
                    <div className="space-y-2">
                      {group.videos.map((video) => {
                        const value = draft.videos[video.id] ?? '';
                        const effectiveId = value || video.youtubeId;
                        return (
                          <div
                            key={video.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-2 bg-stone-950/60 border border-stone-800 rounded-xl px-3 py-2.5"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white truncate">{video.title}</p>
                              <p className="text-[10px] text-stone-500">
                                ID actual: <span className="font-mono">{effectiveId}</span>
                                {value && <span className="text-[#FF8FBD]"> · modificado</span>}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => setVideo(video.id, e.target.value)}
                                placeholder={video.youtubeId}
                                className="w-40 px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-white text-xs font-mono outline-none focus:border-[#E0006C]"
                              />
                              <a
                                href={`https://www.youtube.com/watch?v=${effectiveId}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Abrir en YouTube"
                                className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Imágenes */}
          {section === 'imagenes' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Imágenes de fondo del encabezado</h2>
              <p className="text-xs text-stone-400 mb-6">
                URL o ruta de cada celda del collage del Hero (por ejemplo{' '}
                <code className="text-stone-300">/images/user/totalhiit_1.jpg</code>).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {draft.heroImages.map((src, index) => (
                  <div key={index} className="bg-stone-950/60 border border-stone-800 rounded-2xl p-3">
                    <div className="aspect-video rounded-xl overflow-hidden bg-stone-900 mb-3">
                      <img
                        src={src}
                        alt={`Celda ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                      Celda {index + 1}
                    </label>
                    <input
                      type="text"
                      value={src}
                      onChange={(e) => setHeroImage(index, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-white text-xs outline-none focus:border-[#E0006C]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seguridad */}
          {section === 'seguridad' && (
            <div className="max-w-md">
              <h2 className="text-lg font-bold text-white mb-1">Cambiar la clave</h2>
              <p className="text-xs text-stone-400 mb-6">
                Usuario actual: <span className="text-stone-200 font-semibold">{getAdminUser()}</span>
              </p>

              <form onSubmit={handlePasswordChange} className="space-y-3">
                <label className="block">
                  <span className="block text-xs font-semibold text-stone-400 mb-1.5">Clave actual</span>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    autoComplete="current-password"
                    className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm outline-none focus:border-[#E0006C]"
                  />
                </label>
                <label className="block">
                  <span className="block text-xs font-semibold text-stone-400 mb-1.5">Nueva clave</span>
                  <input
                    type="password"
                    value={nextPass}
                    onChange={(e) => setNextPass(e.target.value)}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm outline-none focus:border-[#E0006C]"
                  />
                </label>
                <label className="block">
                  <span className="block text-xs font-semibold text-stone-400 mb-1.5">Confirmar nueva clave</span>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white text-sm outline-none focus:border-[#E0006C]"
                  />
                </label>

                {passMessage && (
                  <p
                    className={`flex items-center gap-2 text-xs ${
                      passMessage.type === 'ok' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {passMessage.type === 'ok' ? (
                      <Check className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    {passMessage.text}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#E0006C] hover:bg-[#C2005A] text-white font-bold text-sm transition-colors"
                >
                  Actualizar clave
                </button>
              </form>

              <div className="mt-8 flex items-start gap-2 bg-stone-950/60 border border-stone-800 rounded-2xl p-4 text-[11px] leading-relaxed text-stone-500">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Este sitio es estático: el usuario y la clave se validan en el navegador. Sirve para
                  separar el panel del sitio público, no como seguridad de servidor.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Barra de acciones (contenido) */}
        {section !== 'seguridad' && (
          <div className="sticky bottom-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900/95 backdrop-blur border border-stone-800 rounded-2xl px-4 py-3 shadow-2xl">
            <p className="text-[11px] text-stone-500 text-center sm:text-left">
              {dirty ? 'Tenés cambios sin guardar.' : 'Se guarda en este navegador (localStorage).'}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restaurar
              </button>
              <button
                onClick={() => {
                  setDraft(loadSiteContent());
                  setDirty(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-colors"
              >
                Descartar
              </button>
              <button
                onClick={handleSave}
                disabled={!dirty}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#E0006C] hover:bg-[#C2005A] disabled:opacity-40 text-xs font-bold text-white transition-colors"
              >
                <Save className="w-3.5 h-3.5" /> Guardar
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-stone-600">
          <Video className="w-3 h-3" />
          TOTALHIIT · panel local · sin backend
        </p>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 bg-emerald-600 text-white text-xs font-bold px-5 py-3 rounded-full shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
};
