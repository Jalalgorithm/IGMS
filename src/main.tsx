import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import flagFontUrl from './assets/fonts/TwemojiCountryFlags.woff2?url';
import { App } from './App';
import './assets/styles/index.css';

// Windows ships no flag emoji. Served from our own origin — the library's
// default would fetch the font from a third-party CDN.
polyfillCountryFlagEmojis('Twemoji Country Flags', flagFontUrl);

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element #root is missing from index.html');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
