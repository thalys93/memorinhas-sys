export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  apiVersion: import.meta.env.VITE_API_VERSION ?? 'v0',
  storeBrandUrl: import.meta.env.VITE_STORE_BRAND_URL ?? 'memorinhas',
  appName: import.meta.env.VITE_APP_NAME ?? 'Memorinhas',
};
