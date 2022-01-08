import React from 'react'
import { useAuth } from '../context/Auth';
import { Navigate } from 'react-router-dom';
import Home from './Home';
function Vfc() {
    const { User } = useAuth();
    console.log(User);
    return ((User)?<Navigate to="/login"/>:<Home/>);
}

export default Vfc
