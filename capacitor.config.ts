import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kachdak.app',
  appName: 'Kachdak',
  webDir: 'public',

  server: {
    url: 'https://kachdak.vercel.app/', // ⚠️ Replace this with your actual Vercel URL
    cleartext: true
  }
};

export default config;