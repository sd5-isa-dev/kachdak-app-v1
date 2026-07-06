# Kechdak

A fully functional, pixel-perfect mobile application for ordering coffee, built with Next.js, React, Tailwind CSS, and Supabase.

> **Note on Environment Adaptation:**
> While the original request specified Flutter, this project is running in a purely web-based sandboxed environment that strictly supports Node.js/Next.js and Web technologies. To deliver a working, interactive experience here, the app has been meticulously built as a high-fidelity **Mobile Progressive Web App (PWA)** using React and Tailwind CSS. It visually and functionally mimics the requested Flutter application and includes the complete Supabase SQL schema.

## Features

- **Home Screen**: Categorized product grid, personalized greeting, and animated category slider.
- **Product Detail**: High-resolution immersive product imagery, animated size selection, quantity stepper, and "Add to Cart" functionality.
- **Cart**: Dynamic cart items, pricing subtotal calculation, and edit/quantity controls.
- **Supabase Integration**: Includes the complete SQL schema with Row Level Security (RLS) policies for scaling this to a production backend.

## Prerequisites

- Node.js 18+
- Supabase Account

## Step-by-Step Setup

1. **Clone the repository** (or export from AI Studio via Settings > Export to GitHub/ZIP).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Database Setup**:
   - Create a new project on [Supabase](https://supabase.com).
   - Navigate to the **SQL Editor**.
   - Copy the contents of `supabase/schema.sql` and run the script to create tables, RLS policies, and seed data.
4. **Environment Variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase Project Settings > API.
5. **Run the App**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser. Use your browser's Developer Tools (Device Toolbar) to preview it as a mobile device for the best experience.

## Building for Production

To build the static optimized application:
```bash
npm run build
npm run start
```

## Known Limitations & Next Steps

- **Authentication UI**: The authentication flow (Sign Up / Log In) is stubbed in the UI to allow immediate previewing. Connecting this directly to `@supabase/auth-ui-react` is the natural next step.
- **Payment Gateway**: The "Proceed to Checkout" button is a stub. You can integrate Stripe or CMI here for processing real transactions.
- **State Persistence**: The cart currently uses React Context. Connecting the store to the `cart_items` table in Supabase via mutations is recommended for cross-device persistence.
# kachdak-app-v1
