
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyAhq4lTr1cfVg7HowykO8tn-AY-AbQDUOY",
  authDomain: "scheduler-2229e.firebaseapp.com",
  projectId: "scheduler-2229e",
  storageBucket: "scheduler-2229e.appspot.com",
  messagingSenderId: "915719450788",
  appId: "1:915719450788:web:7b9a15df50af0c3c22b631",
  measurementId: "G-PZTBEHHVK5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);  