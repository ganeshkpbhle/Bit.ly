import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firbaseconfig';
import http from "../config/http-common";
const authContext = createContext();
export function Auth({ children }) {
    const [User, setUser] = useState({});
    const [flg, setflg] = useState(false);
    const setHeader=()=>{
        if(localStorage["user"]){
            const data=JSON.parse(localStorage["user"])?.data;
            http.interceptors.request.use(
                _config => {
                    _config.headers.authorization = `Bearer ${data?.token}`;
                    return _config;
                },
                error => {
                    return Promise.reject(error);
                }
            );
        }
        else {alert("You are an unAuthorized User");}
    };
    // Google cred section Area
    const googleSignIn = () => {
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider);
    };
    const signUp = (email, passwd) => {
        return createUserWithEmailAndPassword(auth, email, passwd);
    };
    const PasswdReset = (email) => {
        return sendPasswordResetEmail(auth, email);
    };
    const glSignIn=(email,passwd)=>{
        return signInWithEmailAndPassword(auth,email,passwd);
    };

    // From here dotnet API begins
    const addUrl = (url) => {
        setHeader();
        return http.post("https://localhost:7006/api/url", url);
    };
    const verifyEmail = (data) => {
        setHeader();
        return http.post(`https://localhost:7006/api/verify/Email`, data);
    };
    const logIn = (data) => {
        return http.post(`https://localhost:7006/api/user/login`, data);
    };
    const getUrlById = (id) => {
        setHeader();
        return http.get(`https://localhost:7006/api/url/getId/${id}`);
    };
    const getUrls = (id) => {
        setHeader();
        return http.get(`https://localhost:7006/api/url/getlist/${id}`);
    };
    const delUrl = (id) => {
        setHeader();
        http.delete(`https://localhost:7006/api/url/${id}`);
    };
    const addUser = (data) => {
        return http.post("https://localhost:7006/api/user", data);
    };
    const getUserById = (id) => {
        setHeader();
        return http.get(`https://localhost:7006/api/user/getId/${id}`);
    };
    const getUserSimple = (id) => {
        setHeader();
        return http.get(`https://localhost:7006/api/user/getRes/${id}`);
    };
    const getUserBymail = (mail) => {
        return http.get(`https://localhost:7006/api/user/getEmail/${mail}`);
    };
    const updateUser = (id, data) => {
        setHeader();
        return http.put(`https://localhost:7006/api/user/${id}`, data);
    };
    const vfcApi=(id)=>{
        setHeader();
        return http.post("https://localhost:7006/api/verify/post",{Id:id});
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
    return <authContext.Provider value={{ User, logIn, setUser, googleSignIn, signUp, PasswdReset, verifyEmail, flg, setflg, getUserById, addUser, updateUser, getUserBymail, addUrl, getUrlById, delUrl, getUrls, getUserSimple,vfcApi }}>
        {children}
    </authContext.Provider>
};
export const useAuth = () => {
    return useContext(authContext);
};