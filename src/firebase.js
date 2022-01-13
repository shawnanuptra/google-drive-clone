import {initializeApp} from  "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import "firebase/firestore";
import { collection, getFirestore } from "firebase/firestore";

const app = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
})

//exports auth for authentication in the app
export const auth = getAuth(app);

//we're not exporting firestore object as a whole, as we don't need a lot of its functionality
export const firestore = getFirestore(app);

// we only export the functionality that we need from firestore
export const database = {
    folders: collection(firestore, 'folders'),
    files: collection(firestore, 'files'),
    formatDoc: doc => {
        return {id: doc.id, ...doc.data()}
    }
}

//make firebase.js the default app
export default app;