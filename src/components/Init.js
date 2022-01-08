import React from 'react';
import { useAuth } from '../context/Auth';
import { Page } from "./Page";
import { Reg } from './Register';
import Login from './Login';
import Vfc from './Vfc';
import Nav from './Nav';
import PassReset from "./PassReset";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function Init() {
    const { User } = useAuth();
    console.log(User);
    return (
        (!User) ? <BrowserRouter>
            <Routes>
                <Route path='/' exact element={<Page />} />
                <Route path='/register' exact element={<Reg />} />
                <Route path='/login' exact element={<Login />} />
                <Route path='/reset' exact element={<PassReset />} />
            </Routes>
        </BrowserRouter>
            : <>
                <BrowserRouter>
                    <Nav />
                    <Routes>
                        <Route path='/home' element={<Vfc />} />
                    </Routes>
                </BrowserRouter>
            </>
    )
}

export default Init
