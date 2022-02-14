import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    //signInWithEmailAndPassword,
    // signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firbaseconfig';
import http from "../config/http-common";
const authContext = createContext();
const { REACT_APP_API_URL, REACT_APP_DICEBEAR, REACT_APP_LOCAL } = process.env;
export function Auth({ children }) {
    const [User, setUser] = useState({});
    const [flg, setflg] = useState(false);
    const [list, setList] = useState([]);
    const setHeader = () => {
        if (localStorage["user"]) {
            const data = JSON.parse(localStorage["user"])?.data;
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
        else { alert("You are an unAuthorized User"); }
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

    // From here dotnet API begins
    const addUrl = (url) => {
        setHeader();
        return http.post(`${REACT_APP_API_URL}url`, url);
    };
    const verifyEmail = (data) => {
        setHeader();
        return http.post(`${REACT_APP_API_URL}verify/Email`, data);
    };
    const logIn = (data) => {
        return http.post(`${REACT_APP_API_URL}user/login`, data);
    };
    const logout = (id) => {
        setHeader();
        return http.post(`${REACT_APP_API_URL}user/logout`, { Del:parseInt(id) });
    };
    const getUrlById = (id) => {
        setHeader();
        return http.get(`${REACT_APP_API_URL}url/getId/${id}`);
    };
    const getUrls = (id) => {
        setHeader();
        return http.get(`${REACT_APP_API_URL}url/getlist/${id}`);
    };
    const delUrl = (id) => {
        setHeader();
        return http.delete(`${REACT_APP_API_URL}url/${id}`);
    };
    const addUser = (data) => {
        return http.post(`${REACT_APP_API_URL}user`, data);
    };
    const getUserSimple = (id) => {
        setHeader();
        return http.get(`${REACT_APP_API_URL}user/getRes/${id}`);
    };
    const getUserBymail = (mail) => {
        return http.get(`${REACT_APP_API_URL}user/getEmail/${mail}`);
    };
    const updateUser = (id, data) => {
        setHeader();
        return http.put(`${REACT_APP_API_URL}user/${id}`, data);
    };
    const vfcApi = (id) => {
        setHeader();
        return http.post(`${REACT_APP_API_URL}verify/post`, { Id: id });
    };
    const ComputeDate = (user) => {
        setHeader();
        return http.post(`${REACT_APP_API_URL}url/date`, user);
    };
    return <authContext.Provider value={{ User, logIn, logout, setUser, googleSignIn, signUp, PasswdReset, verifyEmail, flg, setflg, addUser, updateUser, getUserBymail, addUrl, getUrlById, delUrl, getUrls, getUserSimple, vfcApi, REACT_APP_DICEBEAR, REACT_APP_LOCAL, ComputeDate, list, setList }}>
        {children}
    </authContext.Provider>
};
export const useAuth = () => {
    return useContext(authContext);
};