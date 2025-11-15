// Paste your Firebase config below. Do NOT commit secrets to public repos.
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'REPLACE_WITH_YOURS',
  authDomain: 'REPLACE_WITH_YOURS',
  projectId: 'REPLACE_WITH_YOURS',
  storageBucket: 'REPLACE_WITH_YOURS',
  messagingSenderId: 'REPLACE_WITH_YOURS',
  appId: 'REPLACE_WITH_YOURS'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
