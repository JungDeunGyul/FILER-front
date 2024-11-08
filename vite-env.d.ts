interface ImportMetaEnv {
  VITE_SERVER_URL: string;
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
  VITE_FIREBASE_MEASUREMENT_ID: string;

  VITE_EXCEL_ICON_URL: string;
  VITE_PDF_ICON_URL: string;
  VITE_IMAGE_ICON_URL: string;
  VITE_AUDIO_ICON_URL: string;
  VITE_ZIP_ICON_URL: string;
  VITE_POWERPOINT_ICON_URL: string;
  VITE_DEFAULT_ICON_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
