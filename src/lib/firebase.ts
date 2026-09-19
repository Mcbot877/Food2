import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';

// Your web app's Firebase configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyBBWCTU3vXSVm8SKkgGjEa60bitysBMU_A",
  authDomain: "bitewithtaste-16e90.firebaseapp.com",
  projectId: "bitewithtaste-16e90",
  storageBucket: "bitewithtaste-16e90.firebasestorage.app",
  messagingSenderId: "59016409757",
  appId: "1:59016409757:web:f18ec19dc602de996f5a74",
  measurementId: "G-4Q2YS6PBH0"
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

export { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
};
