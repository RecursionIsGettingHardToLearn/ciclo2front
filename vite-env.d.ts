interface ImportMetaEnv {
  readonly VITE_YOUR_URL: string;
  readonly VITE_REALM: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_API_BASE_URL_LOCAL: string;
  readonly VITE_API_BASE_URL_DEPLOY: string;
  readonly MODE: 'development' | 'production';
 
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}