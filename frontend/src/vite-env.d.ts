/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_VERSION: string;
  readonly VITE_STORE_BRAND_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_PUBLIC_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
