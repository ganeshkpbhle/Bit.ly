import React from "react";
import "./App.css";
import { Page } from "./components/Page";
import { Reg } from './components/Register';
import Login from './components/Login';
import Vfc from './components/Vfc';
import PassReset from "./components/PassReset";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth } from './context/Auth';
import Init from "./components/Init";
function App() {
  return (
    <Auth>
      <div className="App">
        <Init />
      </div>
    </Auth>
  );
}

export default App;
