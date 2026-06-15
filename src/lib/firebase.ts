import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAHDijTW4W5mw-dkCXH7zPgaynaQt3AbxE",
  authDomain: "talentos-d7e53.firebaseapp.com",
  projectId: "talentos-d7e53",
  storageBucket: "talentos-d7e53.firebasestorage.app",
  messagingSenderId: "1086281553087",
  appId: "1:1086281553087:web:3e1c0dc1d024acee51220a",
  measurementId: "G-0R8PBQ8W4E"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
