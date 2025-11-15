// Example Firebase Function (Node) to create Stripe Connect payouts / transfers
// WARNING: This is a template. Do not deploy without adding your Stripe secret and testing.

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');
admin.initializeApp();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPayout = functions.https.onCall(async (data, context) => {
  if(!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Request had no auth');
  const uid = context.auth.uid;
  const user = await admin.auth().getUser(uid);
  if(!user.customClaims || !user.customClaims.admin) throw new functions.https.HttpsError('permission-denied', 'Not an admin');

  const { employeeStripeAccountId, amountCents } = data;
  const transfer = await stripe.transfers.create({
    amount: amountCents,
    currency: 'usd',
    destination: employeeStripeAccountId,
  });
  return { success: true, transfer };
});
