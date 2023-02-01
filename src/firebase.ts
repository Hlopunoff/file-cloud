import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAJTHrlJaAaaXdjTcQ7AmDDdWR14alCu2k",
    authDomain: "test-task-d8e66.firebaseapp.com",
    projectId: "test-task-d8e66",
    storageBucket: "test-task-d8e66.appspot.com",
    messagingSenderId: "328234466087",
    appId: "1:328234466087:web:50b74cceb16363e10ec702",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const storage = getStorage();
