# Kechdak Coffee Shop

A modern, production-ready coffee shop application with a curated menu, shopping cart, and checkout flow.
Built with Next.js, Tailwind CSS, and Cloud SQL (PostgreSQL).

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Extracting the APK (Android App)

This application is ready to be converted into a native Android APK using **Capacitor**. 
Follow these steps in your local environment to generate the `.apk` file:

### Prerequisites
- Node.js installed
- Android Studio installed on your machine (to build the APK)

### Steps to build APK:

1. **Install Capacitor CLI and Android package:**
   ```bash
   npm install @capacitor/core @capacitor/android
   npm install -D @capacitor/cli
   ```

2. **Initialize Capacitor in the project:**
   ```bash
   npx cap init "Kechdak Coffee" "com.kechdak.app" --web-dir out
   ```

3. **Update Next.js configuration to support static export:**
   Ensure your `next.config.ts` has `output: 'export'` instead of `standalone` for static generation if you only need client-side code in the APK, OR host the Next.js app and point the Capacitor config to your deployed URL.

   If using your deployed URL, modify `capacitor.config.json`:
   ```json
   {
     "appId": "com.kechdak.app",
     "appName": "Kechdak",
     "webDir": "out",
     "bundledWebRuntime": false,
     "server": {
       "url": "https://your-deployed-app-url.com",
       "cleartext": true
     }
   }
   ```

4. **Add Android project:**
   ```bash
   npx cap add android
   ```

5. **Sync the project:**
   ```bash
   npx cap sync
   ```

6. **Open in Android Studio to build the APK:**
   ```bash
   npx cap open android
   ```
   - In Android Studio, wait for Gradle to finish syncing.
   - Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
   - Once complete, click "locate" in the popup to find your `.apk` file.

Alternatively, you can use **PWABuilder** (https://www.pwabuilder.com/) simply by deploying this site to a public URL and generating an APK from it in 2 minutes.
