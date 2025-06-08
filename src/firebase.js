import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDM_VY2zGztPzao_G6twk3lvtP6Ky2X0L4",
  authDomain: "avni-guppies.firebaseapp.com",
  projectId: "avni-guppies",
  storageBucket: "avni-guppies.firebasestorage.app",
  messagingSenderId: "897034669970",
  appId: "1:897034669970:web:7983e21fe0aedc12337b4b",
  measurementId: "G-5HBGJZ8PVP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier };
