import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from './app/providers';
import './shared/styles/tokens.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
);
