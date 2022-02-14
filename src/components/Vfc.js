import React from 'react'
import { Navigate } from 'react-router-dom';
import Home from './Home';
function Vfc() {
    const localData=localStorage.getItem('user');
    return (localData!==null)?<Home/>:<Navigate to="/login"/>;
}
export default Vfc
