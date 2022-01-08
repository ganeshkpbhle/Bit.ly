import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    sendEmailVerification
} from 'firebase/auth';
import { auth } from '../config/firbaseconfig';
const authContext = createContext();
export function Auth({ children }) {
    const [User, setUser] = useState({});
    const signUp = (email, passwd) => {
        return createUserWithEmailAndPassword(auth, email, passwd);
    };
    const logIn = (email, passwd) => {
        return signInWithEmailAndPassword(auth, email, passwd);
    };
    const logOut = () => {
        return signOut(auth);
    };
    const googleSignIn = () => {
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider);
    };
    const PasswdReset = (email) => {
        return sendPasswordResetEmail(auth,email);
    };
    const verifyEmail=(userData)=>{
        return sendEmailVerification(userData?.user);
    };
    useEffect(() => {
        const subsc = onAuthStateChanged(auth, (currUsr) => {
            if(currUsr){
                setUser(currUsr);
            }
            else{
                setUser({});
            }
        });
        return () => {
            subsc();
        }
    }, [])
    return <authContext.Provider value={{ User, signUp, logIn, User, setUser, logOut, googleSignIn,PasswdReset,verifyEmail }}>
        {children}
    </authContext.Provider>
};
export const useAuth = () => {
    return useContext(authContext);
};