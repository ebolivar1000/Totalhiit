import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck, Globe, CreditCard, MessageCircle, AlertCircle } from 'lucide-react';
import { buildWhatsappUrl } from '../data/contact';

interface PaymentModalProps {
  method: 'wise' | 'mercadopago' | null;
  onClose: () => void;
  planName: string;
  amount: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ method, onClose, planName, amount }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!method) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const isMP = method === 'mercadopago';

  // Details
  const mpDetails = {
    cbu: '0000003100359754352113',
    alias: 'TOTALHIIT.MP (Verificar CBU)',
    platform: 'Mercado Pago / Transferencia Bancaria',
    currency: 'ARS'
  };

  const wiseDetails = {
    beneficiary: 'Eliani Valentina Planchez',
    accountType: 'Checking',
    routingNumber: '101019628',
    accountNumber: '215765486775',
    bankName: 'Wise US Inc',
    bankAddress: '108 W 13th St, Wilmington, DE, 19801, United States',
    currency: 'USD'
  };

  // Mensajes de WhatsApp diferenciados por metodo de pago
  const whatsappMessage = isMP
    ? `¡Hola! Quiero confirmar mi inscripción en el Bootcamp TOTALHIIT +40.\n\n` +
      `Plan: ${planName}\n` +
      `Total: ${amount}\n\n` +
      `Ya realicé la transferencia por Mercado Pago (ARS). Te adjunto el comprobante:`
    : `¡Hola! Quiero confirmar mi inscripción en el Bootcamp TOTALHIIT +40.\n\n` +
      `Plan: ${planName}\n` +
      `Total: ${amount}\n\n` +
      `Ya realicé la transferencia internacional por Wise (USD). Te adjunto el comprobante:`;
  const whatsappUrl = buildWhatsappUrl(whatsappMessage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className={`p-6 border-b border-stone-800 flex items-center justify-between text-white ${
          isMP ? 'bg-gradient-to-r from-sky-950 via-stone-900 to-stone-900' : 'bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              isMP ? 'bg-sky-500 text-white shadow-sky-500/20' : 'bg-emerald-500 text-white shadow-emerald-500/20'
            }`}>
              {isMP ? <CreditCard className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
            </div>
            <div>
              <span className={`text-[11px] font-extrabold uppercase tracking-widest ${isMP ? 'text-sky-400' : 'text-emerald-400'}`}>
                {isMP ? 'Argentina · Mercado Pago (ARS)' : 'Internacional · Wise (USD)'}
              </span>
              <h3 className="text-xl font-bold text-white leading-tight">
                Instrucciones de Pago
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-200">
          
          {/* Plan badge */}
          <div className="flex items-center justify-between bg-stone-950 p-4 rounded-2xl border border-stone-800">
            <div>
              <span className="text-xs text-stone-400">Plan seleccionado</span>
              <p className="font-bold text-white text-base">{planName}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400">Total a transferir</span>
              <p className="font-extrabold text-2xl text-[#E0006C]">{amount}</p>
            </div>
          </div>

          {/* Conditional Content */}
          {isMP ? (
            /* Mercado Pago Argentina */
            <div className="space-y-4">
              <div className="bg-stone-800/60 p-4 rounded-2xl border border-stone-700/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-400">CBU / CVU de Mercado Pago:</span>
                  {copiedField === 'cbu' && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> ¡Copiado al portapapeles!
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between bg-stone-950 p-3 rounded-xl border border-stone-800 font-mono text-sm sm:text-base text-white tracking-wider">
                  <span className="select-all font-bold">{mpDetails.cbu}</span>
                  <button
                    onClick={() => copyToClipboard(mpDetails.cbu, 'cbu')}
                    className="ml-3 p-2 rounded-lg bg-stone-800 hover:bg-[#E0006C] hover:text-white text-stone-300 transition-colors shrink-0"
                    title="Copiar CBU"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step by step */}
              <div className="text-xs text-stone-400 space-y-2 bg-stone-950/40 p-4 rounded-2xl border border-stone-800/60">
                <p className="font-bold text-white text-sm mb-2">¿Cómo completar tu pago?</p>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>Copia el CBU superior y abre tu app de <strong>Mercado Pago</strong> o tu <strong>Home Banking</strong>.</li>
                  <li>Realiza la transferencia por <strong>{amount}</strong>.</li>
                  <li>Guarda o toma captura del comprobante de transferencia.</li>
                  <li>Haz clic en el botón de abajo para enviar el comprobante por WhatsApp y activar tu cuenta al instante.</li>
                </ol>
              </div>
            </div>
          ) : (
            /* Wise International (USD) */
            <div className="space-y-4">
              <div className="bg-stone-800/60 p-4 rounded-2xl border border-stone-700/80 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  Datos Bancarios en Estados Unidos (USD):
                </span>

                {/* Beneficiary */}
                <div className="flex items-center justify-between bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs sm:text-sm">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Nombre del Beneficiario</span>
                    <span className="font-bold text-white">{wiseDetails.beneficiary}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(wiseDetails.beneficiary, 'beneficiary')}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-[#E0006C] text-stone-300 transition-colors"
                  >
                    {copiedField === 'beneficiary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Routing & Account Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center justify-between bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Número de Ruta (Wire / ACH)</span>
                      <span className="font-mono font-bold text-white text-sm">{wiseDetails.routingNumber}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(wiseDetails.routingNumber, 'routing')}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-[#E0006C] text-stone-300 transition-colors"
                    >
                      {copiedField === 'routing' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Número de Cuenta</span>
                      <span className="font-mono font-bold text-white text-sm">{wiseDetails.accountNumber}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(wiseDetails.accountNumber, 'account')}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-[#E0006C] text-stone-300 transition-colors"
                    >
                      {copiedField === 'account' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Account Type & Bank */}
                <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs space-y-1 text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Tipo de cuenta:</span>
                    <span className="font-bold text-white">{wiseDetails.accountType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Banco:</span>
                    <span className="font-bold text-white">{wiseDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Dirección:</span>
                    <span className="text-right text-[11px] text-stone-300 max-w-[260px]">{wiseDetails.bankAddress}</span>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-start gap-2 bg-stone-950/40 p-3 rounded-xl border border-stone-800/60 text-xs text-stone-400">
                <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Puedes transferir directamente desde tu cuenta de Wise, o mediante transferencia bancaria internacional / ACH en USD.</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 px-6 rounded-full bg-[#E0006C] hover:bg-[#C2005A] text-white font-bold text-sm shadow-lg shadow-[#E0006C]/30 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Confirmar Pago por WhatsApp</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Transacción protegida · Activación en menos de 2 horas</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
