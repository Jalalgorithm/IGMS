/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_USE_MOCK_API?: string;
  readonly VITE_DONATE_URL?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_TERMAGEDDON_PRIVACY_ID?: string;
  readonly VITE_TERMAGEDDON_TERMS_ID?: string;
  readonly VITE_TERMAGEDDON_DISCLAIMER_ID?: string;
  readonly VITE_TERMAGEDDON_COOKIES_ID?: string;
  readonly VITE_USERCENTRICS_SETTINGS_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
