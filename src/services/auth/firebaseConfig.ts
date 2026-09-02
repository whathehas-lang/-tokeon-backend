// Firebase Configuration & Initializer Template
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const getFirebaseConfig = (): FirebaseConfig => {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC_v_UxL2y0y0Xsz6vNJcAGknoEpnRTr5o',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'sports-all-fbb24.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sports-all-fbb24',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'sports-all-fbb24.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '509770073918',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:509770073918:web:22d375400ed76b61138e6f'
  };
};
