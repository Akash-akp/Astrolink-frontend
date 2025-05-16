// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { connectStorageEmulator, getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaadBUEUptgCnTBP4jSf3dyLVOrnt64XA",
  authDomain: "astrolinkuploads.firebaseapp.com",
  projectId: "astrolinkuploads",
  storageBucket: "astrolinkuploads.firebasestorage.app",
  messagingSenderId: "577622386870",
  appId: "1:577622386870:web:29a14ce0b4ed35c47c5e17",
  measurementId: "G-FVRQ5WY7FY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const storage = getStorage(app);
if(window.location.hostname === "localhost"){
//   console.log("Firebase Storage URL: ", storage._delegate._bucket._url);
  connectStorageEmulator(storage, "localhost", 9199);
  console.log("Connected to Firebase Storage Emulator");
}


export const imageDb = storage;