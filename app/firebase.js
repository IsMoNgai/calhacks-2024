// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_e6yZOuNX0doS83Fzmf27in5cWpNgKmA",
  authDomain: "hackathondemo-ffed3.firebaseapp.com",
  databaseURL: "https://hackathondemo-ffed3-default-rtdb.firebaseio.com",
  projectId: "hackathondemo-ffed3",
  storageBucket: "hackathondemo-ffed3.appspot.com",
  messagingSenderId: "989965172682",
  appId: "1:989965172682:web:600858fee24cf696f35933"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)