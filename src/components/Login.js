import React, { useState,useEffect } from 'react'
import "../css/Login.css";
import logo from '../assets/img/single_user.png';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import GoogleButton from 'react-google-button';
import { BeatLoader } from "react-spinners";
function Login({ children }) {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm();
    const { logIn, setUser, googleSignIn, getUserBymail, addUser } = useAuth();
    const [Err, setErr] = useState("");
    const [pflg, setPflg] = useState(false);
    const Submit = (data) => {
        logIn({ "Uemail": data.email, "Passwd": data.passwd })
            .then((response) => {
                localStorage.clear();
                setUser(response?.data);
                localStorage.setItem('user', JSON.stringify(response));
                navigate("/home");
                reset();
            })
            .catch(err =>{
                if(err?.message.indexOf("409")!==-1){
                    alert("User Already active in another device !");
                    reset();
                }
            });
    };
    useEffect(()=>{
        const data = localStorage.getItem('user');
        if(data!==null){
            navigate("/home/dash");
        };
    },[]);
    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        try {
            await googleSignIn()
                .then((Gldata) => {
                    setPflg(true);
                    getUserBymail(Gldata?.user.email)
                        .then((response) => {
                            if (response?.data.message === 0) {
                                const Prof = {
                                    "GId": Gldata?.user.uid,
                                    "FirstName": Gldata?.user.displayName,
                                    "LastName": "",
                                    "Mobile": "",
                                    "Email": Gldata?.user.email,
                                    "EmailVerified": 1,
                                    "SnType": "Google",
                                    "Passwd": "$"
                                };
                                addUser(Prof)
                                    .then(() => {
                                        localStorage.clear();
                                        logIn({ "Uemail": Gldata?.user.email, "Passwd": "$" })
                                            .then(result => {
                                                setPflg(false);
                                                setUser(result?.data);
                                                localStorage.setItem('user', JSON.stringify(result));
                                                navigate("/home");
                                            });
                                    });
                            }
                            else {
                                setUser(response?.data);
                                setPflg(false);
                                localStorage.clear();
                                localStorage.setItem('user', JSON.stringify(response));
                                navigate("/home");
                            }
                        });
                });
        } catch (err) {
            setErr(err?.message);
        }
    };
    return (
        <div className='container shadow mt-5 py-3 px-3 rounded'>
            <div className="row p-5">
                <div className='col-xl-12'>
                    <img className='image' src={logo} />
                </div>
            </div>
            <form className="Form" onSubmit={handleSubmit(Submit)}>
                <div className='row'>
                    <div className='col-xl-12'>
                        <div className="form-group py-3">
                            <input className="form-control field"
                                type="email"
                                name="email"
                                placeholder='Email ...'
                                {...register("email", {
                                    required: "Email is required!",
                                    pattern: {
                                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
                                        message: "Invalid Email!"
                                    }
                                })}
                                onKeyUp={() => {
                                    trigger("email");
                                }} />
                            {errors.email && <p className='errtext'>{errors.email.message}</p>}
                        </div>
                        <div className="form-group py-3">
                            <input className="form-control field"
                                type="password"
                                name="passwd"
                                placeholder='Passwd ...'
                                {...register("passwd", { required: "Password is required" })}
                                onKeyUp={() => {
                                    trigger("passwd");
                                }} />
                            {errors.passwd && <p className='errtext'>{errors.passwd.message}</p>}
                        </div>
                        <div className="form-group py-3">
                            <button className='form-control field'
                                type="submit" id='sub'>
                                Submit
                            </button>
                        </div>
                        <div className="row p-2">
                            <p className='link'>Don't Have an Account? <Link to="/register"> SignUp </Link></p>
                        </div>
                        {pflg &&
                            <div className='row p-2 justify-content-start'>
                                <div className='col'>
                                    <BeatLoader loading size={35} color='blue' />
                                </div>
                            </div>
                        }
                        {!pflg &&
                            <div className='row p-2'>
                                <div className='col-xl-12'>
                                    <GoogleButton className='g-btn' type='dark' onClick={handleGoogleLogin} />
                                </div>
                            </div>
                        }
                        <div className='row p-2'>
                            <div className='col-xl-12'>
                                <p className='link'><Link to='/reset'>Forgot passwd?</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login
