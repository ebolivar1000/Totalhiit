// ==============================================================================
// UTILIDADES DE EXPORTACIÓN A EXCEL Y PDF PARA TOTALHIIT CRM
// 100% Sin dependencias pesadas, compatible con navegadores móviles y desktop
// ==============================================================================

export function exportarAExcel(
  nombreArchivo: string,
  titulo: string,
  columnas: string[],
  filas: (string | number | undefined | null)[][]
): void {
  try {
    const filasHtml = filas
      .map(
        (fila) =>
          `<tr>${fila
            .map(
              (celda) =>
                `<td style="border:1px solid #e5e7eb;padding:6px 10px;font-size:11px;color:#1f2937;">${
                  celda !== undefined && celda !== null ? String(celda) : ''
                }</td>`
            )
            .join('')}</tr>`
      )
      .join('');

    const columnasHtml = columnas
      .map(
        (col) =>
          `<th style="background-color:#be123c;color:#ffffff;border:1px solid #9f1239;padding:8px 10px;font-size:11px;font-weight:bold;text-align:left;">${col}</th>`
      )
      .join('');

    const htmlCompleto = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>${titulo.slice(0, 30)}</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
        </style>
      </head>
      <body>
        <h2 style="color:#be123c;margin-bottom:2px;">TOTALHIIT CRM — ${titulo}</h2>
        <p style="color:#6b7280;font-size:11px;margin-bottom:12px;">Generado: ${new Date().toLocaleString('es-ES')}</p>
        <table>
          <thead><tr>${columnasHtml}</tr></thead>
          <tbody>${filasHtml}</tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\uFEFF' + htmlCompleto], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombreArchivo}_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error al exportar a Excel:', err);
    alert('Ocurrió un inconveniente al generar el archivo Excel.');
  }
}

export function exportarAPDF(
  titulo: string,
  subtitulo: string,
  columnas: string[],
  filas: (string | number | undefined | null)[][],
  resumen?: { etiqueta: string; valor: string }[]
): void {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor habilita las ventanas emergentes en tu navegador para generar el PDF.');
      return;
    }

    const resumenHtml =
      resumen && resumen.length > 0
        ? `
        <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
          ${resumen
            .map(
              (r) => `
            <div style="border:1px solid #e5e7eb;background-color:#f9fafb;border-radius:8px;padding:6px 12px;font-size:11px;">
              <span style="color:#6b7280;font-size:9px;text-transform:uppercase;font-weight:bold;display:block;">${r.etiqueta}</span>
              <strong style="font-size:13px;color:#111827;">${r.valor}</strong>
            </div>
          `
            )
            .join('')}
        </div>
      `
        : '';

    const columnasHtml = columnas
      .map(
        (c) =>
          `<th style="border-bottom:2px solid #be123c;padding:6px 8px;font-size:10px;font-weight:bold;color:#111827;text-align:left;background:#fdf2f8;">${c}</th>`
      )
      .join('');

    const filasHtml = filas
      .map(
        (fila, idx) => `
        <tr style="background-color:${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
          ${fila
            .map(
              (celda) =>
                `<td style="border-bottom:1px solid #e5e7eb;padding:5px 8px;font-size:10px;color:#374151;">${
                  celda !== undefined && celda !== null ? String(celda) : ''
                }</td>`
            )
            .join('')}
        </tr>
      `
      )
      .join('');

    const html = `
      <!doctype html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>${titulo} | TotalHIIT CRM</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #111827;
            margin: 0;
            padding: 16px;
            background: #ffffff;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #be123c;
            padding-bottom: 10px;
            margin-bottom: 12px;
          }
          .logo-box {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .brand {
            font-size: 18px;
            font-weight: 900;
            color: #111827;
            letter-spacing: 0.5px;
          }
          .brand span { color: #be123c; }
          .badge-report {
            background: #ffe4e6;
            color: #be123c;
            font-size: 9px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 4px;
          }
          .meta {
            text-align: right;
            font-size: 10px;
            color: #6b7280;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom:14px;display:flex;gap:10px;background:#f3f4f6;padding:10px 14px;border-radius:10px;align-items:center;justify-content:space-between;">
          <span style="font-size:12px;color:#374151;font-weight:bold;">📄 Documento listo para guardar como PDF o imprimir:</span>
          <button onclick="window.print()" style="background:#be123c;color:#fff;border:none;padding:8px 16px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:12px;">
            🖨️ Guardar como PDF / Imprimir
          </button>
        </div>

        <div class="header">
          <div class="logo-box">
            <div class="brand">TOTAL<span>HIIT</span> CRM</div>
            <div class="badge-report">REPORTE OFICIAL</div>
          </div>
          <div class="meta">
            <div><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div>TotalHIIT — Bootcamp +40 & Nutrición</div>
          </div>
        </div>

        <h2 style="font-size:15px;margin:0 0 2px 0;color:#111827;">${titulo}</h2>
        <p style="font-size:11px;color:#6b7280;margin:0 0 12px 0;">${subtitulo}</p>

        ${resumenHtml}

        <table>
          <thead><tr>${columnasHtml}</tr></thead>
          <tbody>${filasHtml}</tbody>
        </table>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 350);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  } catch (err) {
    console.error('Error al exportar a PDF:', err);
    alert('Ocurrió un inconveniente al generar la vista de impresión PDF.');
  }
}
