import { createUserWithEmailAndPassword, onIdTokenChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
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

    //loading state, defaults true, as Firebase will undergo verification(loading) when page first loads
    //'loading' acts as a flag whether to render AuthContex.Provider's children or not
    const [loading, setLoading] = useState(true);

    //sign up function
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    //log in function
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    //log out function
    function logout() {
        return signOut(auth);
    }

    //password reset function
    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    //called everytime component is unmounted
    //unsubscribes the connection to firebase once setCurrentUser() is successfully called
    useEffect(() => {
        //onIdTokenChanged == onAuthStateChanged in Firebase v8. 
        const unsubscribe = onIdTokenChanged(auth, user => {
            
            setCurrentUser(user);
            setLoading(false); //sets loading to false
        });
        
        return unsubscribe;
    }, [])

    //value = all information that will be used for authentication
    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
    }

    return (
        <AuthContext.Provider value={value}>
            {/* If not loading, render 'children' */}
            { !loading && children}
        </AuthContext.Provider>
    )
}
