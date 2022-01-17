// Import the functions you need from the SDKs you need
import Firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import "firebase/compat/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDi-zbFlMbr9NbHk4uokG3BouyM8CPNEXM",
  authDomain: "reactauth-a57ca.firebaseapp.com",
  databaseURL: "https://reactauth-a57ca-default-rtdb.firebaseio.com",
  projectId: "reactauth-a57ca",
  storageBucket: "reactauth-a57ca.appspot.com",
  messagingSenderId: "718756745028",
  appId: "1:718756745028:web:014b3a0164ceab0206d111",
  measurementId: "G-44CJKPP0KE"
};

// Initialize Firebase
const app =Firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const dB=app.database().ref("users");
const urlsDB=null;
export {app,auth,dB,urlsDB};
