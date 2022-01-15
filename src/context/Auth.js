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
    fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth,dB } from '../config/firbaseconfig';
const authContext = createContext();
export function Auth({ children }) {
    const [User, setUser] = useState({});
    const [Prof,setProf]=useState({});
    const [flg,setflg]=useState(false);
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
    const userCred=(email)=>{
        return fetchSignInMethodsForEmail(auth,email);
    };
    const checkProf=(param)=>{
       return dB.on('value',snapshot =>{
           snapshot.forEach(child=>{
               if(child.val().uid===param){
                setflg(child.val().mobile==="");
                return false;
               };
           });
        });
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
    return <authContext.Provider value={{ User, signUp, logIn,setUser, logOut, googleSignIn,PasswdReset,verifyEmail,Prof,setProf,userCred,checkProf,flg,setflg }}>
        {children}
    </authContext.Provider>
};
export const useAuth = () => {
    return useContext(authContext);
};