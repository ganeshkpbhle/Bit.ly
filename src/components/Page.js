import React, { useEffect } from "react";
import "../css/Page.css";
import main from "../assets/img/main.jpg";
import { useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';
import { useAuth } from '../context/Auth';
const Page = () => {
  let navigate = useNavigate();
  const { setUser }=useAuth();
  useEffect(()=>{
    const localData=JSON.parse(localStorage.getItem('user'));
    if(localData!==null){
      if(Date.now()<=(jwt(localData?.data.token)?.exp)*1000){
        navigate("/login");
        localStorage.clear();
        setUser({});
        alert("Your Session Has Expired Pls login again !");
      }
    }
    (localData!==null)?navigate("/home"):navigate("/");
  },[]);
  return (
    <div className="container">
      <div className="row topbar">
        <div className="col-xl-4 col-lg-7 col-md-7 col-sm-12 col-xs-12 d-flex flex-row">
          <div className="px-3 py-1 bd-highlight Icon">
            <p>Bit.ly</p>
          </div>
          <div className="px-3 py-5 bd-highlight logo">
            <i className="fas fa-link fa-3x"></i>
          </div>
        </div>
        <div className="col-xl-5 col-lg-6 col-md-8 col-sm-12 col-xs-12 center">
          <ul>
            <li>
              <a href="#">PRICING</a>
            </li>
            <li>
              <a href="#">BLOG</a>
            </li>
            <li>
              <a href="#">ABOUT</a>
            </li>
          </ul>
        </div>
        <div className="col-xl-3 col-lg-5 col-md-5 col-sm-12 col-xs-12 d-flex flex-row px-5">
          <div className="p-2 bd-highlight"><button className="btn btn-primary" onClick={() => {
            navigate("/register");
          }}>
            Register
          </button></div>
          <div className="p-2 bd-highlight"><button className="btn btn-dark login" onClick={() => {
            navigate("/login");
          }}>Login</button></div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-xs-12 content d-flex flex-column bd-highlight mb-3">
            <div className="p-2 bd-highlight">
              <p className="text1">Short links,big results</p>
            </div>
            <div className="p-2">
              <p className="text2">
                A URL shortener built with powerful tools to help you grow and
                protect your brand.
              </p>
            </div>
            <div className="py-2 btnn">
              <button className="btn btn-secondary p-3" onClick={() => {
                navigate("/register");
              }}>
                Get Started for Free
              </button>
            </div>
          </div>
          <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12">
            <img className="custom-img img-fluid mt-4" src={main} />
          </div>
        </div>
      </div>
    </div>
  );
}
export { Page };
