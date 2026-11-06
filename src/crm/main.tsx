import React from 'react';
import ReactDOM from 'react-dom/client';
import CRMApp from './CRMApp';
import '../index.css';

const rootEl = document.getElementById('crm-root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <CRMApp />
    </React.StrictMode>
  );
}
