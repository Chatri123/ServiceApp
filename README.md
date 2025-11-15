# ServiceOps

Full starter for ServiceOps — a service-business app with employee GPS clock-ins and admin payouts.

## What you'll receive
- Vite + React + Tailwind frontend
- Firebase client integration (auth + Firestore)
- Employee clock-in/out with GPS tracking (saves path & distance)
- Admin dashboard with rate editor and one-click payout simulation
- Sample Firebase Cloud Function (Stripe payout template)
- Firestore security rules starter

## Quickstart (local)

1. Install Node 18+ and npm.
2. Extract the ZIP and open the folder.
3. Run `npm install`.
4. Create a Firebase project: https://console.firebase.google.com/
   - Enable Email/Password authentication.
   - Create a Firestore database (production mode or test).
5. In Firebase, create a Web App and copy the config object. Paste it into `src/firebase.js`.
6. Run locally: `npm run dev`
7. Open the app: `http://localhost:5173`

## Deploy
Recommended: Vercel or Netlify. Create environment variables if you add server functions.

## Stripe (Payouts)
The project includes a sample Cloud Function in `functions-sample` that demonstrates how to create Stripe transfers.
You must deploy Cloud Functions and set `STRIPE_SECRET_KEY` in your function environment.

## Firestore rules
Review `firestore.rules` and update before production.

## Notes
- GPS uses browser `navigator.geolocation.watchPosition`. Test on a mobile device for best results.
- For production payouts integrate Stripe Connect and do server-side validation.
