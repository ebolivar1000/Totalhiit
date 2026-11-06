import React from 'react';
import ReactDOM from 'react-dom/client';
import FormularioRegistro from './FormularioRegistro';
import '../../index.css';

const rootEl = document.getElementById('registro-root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <FormularioRegistro />
    </React.StrictMode>
  );
}
