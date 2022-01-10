import { createUserWithEmailAndPassword, onIdTokenChanged } from 'firebase/auth';
import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase';

//AuthContext, so auth can be used throughout the app
const AuthContext = React.createContext();

//useAuth() is where AuthContext can be accessed through - using the useContext() function
export function useAuth() {
    return useContext(AuthContext);
}

//{children} will be the targets for the provider
export function AuthProvider({ children }) {

    //state of user
    const [currentUser, setCurrentUser] = useState();

    //sign up function
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    //called everytime component is unmounted
    //unsubscribes the connection to firebase once setCurrentUser() is successfully called
    useEffect(() => {
        //onIdTokenChanged == onAuthStateChanged in Firebase v8. 
        const unsubscribe = onIdTokenChanged(auth, user => {
            setCurrentUser(user);
        });
        
        return unsubscribe;
    }, [])

    //value = all information that will be used for authentication
    const value = {
        currentUser,
        signup
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
