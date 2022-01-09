import React from "react";
import "./App.css";
import { Page } from "./components/Page";
import { Reg } from './components/Register';
import Login from './components/Login';
import Vfc from './components/Vfc';
import PassReset from "./components/PassReset";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from './context/Auth';
import { MainPage,Edit,Short,List } from "./components/Home";
import Extract from './components/Extract';
function App() {
  const { User } = useAuth();
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' exact element={<Page />} />
          <Route path='/:Id' exact element={<Extract/>}/>
          <Route path='/register' exact element={<Reg />} />
          <Route path='/login' exact element={<Login />} />
          <Route path='/reset' exact element={<PassReset />} />
          <Route path='/home' exact element={<Vfc />}>
            <Route path='/home/' exact element={<MainPage />} />
            <Route path='/home/edit' exact element={<Edit />} />
            <Route path='/home/list' exact element={<List />} />
            <Route path='/home/short' exact element={<Short />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
