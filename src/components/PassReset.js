import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import "../css/PassReset.css";
import { Link } from 'react-router-dom';
import { useAuth } from '../context/Auth';
function PassReset({ children }) {
    const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm();
    const { PasswdReset } = useAuth();
    const [Err, setErr] = useState("");
    const [success, setSuccess] = useState("");
    const Submit = async (data) => {
        await PasswdReset(data.email)
        .then(()=>{
            setSuccess("Passoword reset link sent to mail pls check before trying again!");
            reset(); 
        })
        .catch((e)=>{
            setErr(e.message);
        });
    }
    return (
        <div className='container p-5'>
            <div className='row p-2'>
                <div className='col-xl-12'>
                    <p className='text-head'>Enter the registerd Email Address!</p>
                </div>
            </div>
            <div className='row p-2'>
                <div className='col-xl-12'>
                    <form className="Form" onSubmit={handleSubmit(Submit)}>
                        <div className="form-group py-3">
                            <input className="form-control field"
                                type="email"
                                name="email"
                                placeholder='Email ...'
                                {...register("email", {
                                    required: "Email is required!",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid Email!"
                                    }
                                })}
                                onKeyUp={() => {
                                    setErr("");
                                    setSuccess("");
                                    trigger("email");
                                }} />
                            {errors.email && <p className='errtext'>{errors.email.message}</p>}
                            {(Err.length !== 0) ? <p className='errtext'>{Err.toString()}</p> : <></>}
                            <p className={`pt-2 ${success.length===0?'':'text-success'}`}>{success}</p>
                        </div>
                        <div className="form-group py-3">
                            <button className='form-control field'
                                type="submit" id='sub'>
                                Send Link
                            </button>
                        </div>
                        <div className="row p-2">
                            <div className="col-xl-12">
                                <p className="link"><Link to="/login">&larr; Log In</Link></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PassReset
