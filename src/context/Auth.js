import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    sendEmailVerification,
    fetchSignInMethodsForEmail,
    getAdditionalUserInfo
} from 'firebase/auth';
import { auth } from '../config/firbaseconfig';
import http from "../config/http-common";
const authContext = createContext();
export function Auth({ children }) {
    const [User, setUser] = useState({});
    const [flg, setflg] = useState(false);
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
        return sendPasswordResetEmail(auth, email);
    };
    const verifyEmail = (userData) => {
        return sendEmailVerification(userData);
    };
    const userCred = (email) => {
        return fetchSignInMethodsForEmail(auth, email);
    };
    const getUserInfo = (user) => {
        return getAdditionalUserInfo(user);
    };
    const addUser = (data) => {
        return http.post("https://615e89e13d1491001755a97b.mockapi.io/users", data);
    };
    const getUser = (id) => {
        return http.get(`https://615e89e13d1491001755a97b.mockapi.io/users/${id}`);
    };
    const updateUser = (id, data) => {
        return http.put(`https://615e89e13d1491001755a97b.mockapi.io/users/${id}`, data);
    };
    const getUid=(id)=>{
        return http.get(`https://615e89e13d1491001755a97b.mockapi.io/userId/${id}`);
    };
    const putUid=(data)=>{
        return http.post("https://615e89e13d1491001755a97b.mockapi.io/userId", data);
    };
    useEffect(() => {
        const subsc = onAuthStateChanged(auth, (currUsr) => {
            if (currUsr) {
                setUser(currUsr);
            }
            else {
                setUser({});
            }
        });
        return () => {
            subsc();
        }
    }, []);
    return <authContext.Provider value={{ User, signUp, logIn, setUser, logOut, googleSignIn, PasswdReset, verifyEmail, userCred, flg, setflg, getUser, addUser, updateUser,getUid,putUid}}>
        {children}
    </authContext.Provider>
};
export const useAuth = () => {
    return useContext(authContext);
};