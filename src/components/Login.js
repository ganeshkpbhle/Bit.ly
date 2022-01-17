import React, { useState } from 'react'
import "../css/Login.css";
import logo from '../assets/img/single_user.png';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import GoogleButton from 'react-google-button';
function Login({ children }) {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, trigger } = useForm();
    const { logIn, setUser, googleSignIn } = useAuth();
    const [Err, setErr] = useState("");
    const Submit = async (data) => {
        try {
            await logIn(data.email, data.passwd)
                .then((datafromGl) => {
                    localStorage.clear();
                    localStorage.setItem('data', JSON.stringify(datafromGl));
                    setUser(datafromGl);
                    navigate("/home");
                });
        } catch (err) {
            setErr(err?.message);
        }
    };
    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        try {
            await googleSignIn()
                .then((Gldata) => {
                    const user = JSON.stringify(Gldata?.user);
                    localStorage.clear();
                    localStorage.setItem('data', JSON.stringify(Gldata));
                    setUser(Gldata);
                    navigate("/home");
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
                        <div className='row p-2'>
                            <div className='col-xl-12'>
                                <GoogleButton className='g-btn' type='dark' onClick={handleGoogleLogin} />
                            </div>
                        </div>
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
