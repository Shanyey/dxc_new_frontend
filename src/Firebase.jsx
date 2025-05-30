// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, OAuthProvider, getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApFzinSMjOvmQM2GzzjufiwEqoIOzKL20",
  authDomain: "dxc-auth-b0c6e.firebaseapp.com",
  projectId: "dxc-auth-b0c6e",
  storageBucket: "dxc-auth-b0c6e.appspot.com",
  messagingSenderId: "545256974433",
  appId: "1:545256974433:web:4c7ee87e9e6aab243de220",
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);

// export const microsoftProvider = new OAuthProvider('microsoft.com');
// export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(firebaseapp);

export default firebaseapp;
