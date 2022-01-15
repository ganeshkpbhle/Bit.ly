import "../css/Register.css";
import reg from "../assets/img/reg.png";
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { useState } from "react";
import { dB } from "../config/firbaseconfig";
import { BeatLoader } from "react-spinners";
function Reg() {
    const { register, handleSubmit, formState: { errors, dirtyFields }, trigger,reset } = useForm();
    const { signUp, User, setUser } = useAuth();
    const [Flg, setFlg] = useState(false);
    const [Err, setErr] = useState("");
    const navigate = useNavigate();
    const Submit = async (data, e) => {
        e.preventDefault();
        setFlg(true);
        await signUp(data.email, data.passwd).then((userData) => {
            const Prof = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                mobile: data.mobile,
                uid:userData?.user.uid,
                urls:[]
            };
            dB.push(
                Prof
                ,err=>{
                    setErr(err?.message);
                }
            ).then(()=>{
                reset();
                setFlg(false);
                navigate("/login");
            });
        })
            .catch((err) => {
                setErr(err?.message);
            });
    };
    return (
        <div className="container shadow-sm mt-5 py-3 px-3 rounded reg-bg">
            <div className="row p-2">
                <div className="col-xl-12">
                    <p className="header">Register Now To short Your Url</p>
                </div>
            </div>
            <form className="Form py-2" onSubmit={handleSubmit(Submit)}>
                <div className="row p-4">
                    <div className="col-xl-5">
                        <div className="form-group my-2 p-1">
                            <input
                                className={`form-control field ${errors.firstName ? 'Invalid' : dirtyFields.firstName ? 'valid' : ''}`}
                                type="text"
                                name="firstName"
                                placeholder="First Name..."
                                {...register("firstName", { required: "First Name is required!" })}
                                onKeyUp={() => {
                                    trigger("firstName");
                                }}
                            />
                            {errors.firstName && <p className="errtext">{errors.firstName.message}</p>}
                        </div>
                        <div className="form-group my-2 p-1">
                            <input
                                className={`form-control field ${errors.lastName ? '' : dirtyFields.lastName ? 'valid' : ''}`}
                                type="text"
                                name="lastName"
                                placeholder="Last Name..."
                                {...register("lastName")}
                                onKeyUp={() => {
                                    trigger("lastName");
                                }}
                            />
                        </div>
                        <div className="form-group my-2 p-1">
                            <input
                                className={`form-control field ${errors.email ? 'Invalid' : dirtyFields.email ? 'valid' : ''}`}
                                type="email"
                                name="email"
                                placeholder="Email ..."
                                {...register("email", {
                                    required: "Email is required!"
                                    , pattern: {
                                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
                                        message: "Invalid Email!"
                                    }
                                })}
                                onKeyUp={() => {
                                    trigger("email");
                                }}
                            />
                            {errors.email && <p className="errtext">{errors.email.message}</p>}
                        </div>
                        <div className={`form-group my-2 p-1`}>
                            <input
                                className={`form-control field ${errors.mobile ? 'Invalid' : dirtyFields.mobile ? 'valid' : ''}`}
                                type="text"
                                name="mobile"
                                placeholder="Mobile Number ..."
                                {...register("mobile", {
                                    required: "MobileNumber is required!"
                                    , minLength: {
                                        value: 10, message: "Mobile number should be 10 digits!"
                                    }
                                })}
                                onKeyUp={() => {
                                    trigger("mobile");
                                }}
                            />
                            {errors.mobile && <p className="errtext">{errors.mobile.message}</p>}
                        </div>
                        <div className="form-group my-2">
                            <input
                                className={`form-control field ${errors.passwd ? 'Invalid' : dirtyFields.passwd ? 'valid' : ''}`}
                                type="password"
                                name="passwd"
                                placeholder="Passwd"
                                {...register("passwd", {
                                    required: "Password is required!"
                                    , minLength: {
                                        value: 6,
                                        message: "Password should be atleast 6 digits!"
                                    }
                                    , maxLength: {
                                        value: 20,
                                        message: "Password should not exceed 20 digits!"
                                    }
                                    , pattern: {
                                        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/i,
                                        message: "Password should contain atleast one digit,one Uppercase and one LowerCase!"
                                    }
                                })}
                                onKeyUp={() => {
                                    trigger("passwd");
                                }}
                            />
                            {errors.passwd && <p className="errtext">{errors.passwd.message}</p>}
                        </div>
                        <div className="row p-3">
                            <div className="col-xl-12">
                                <div className="form-group mt-1">
                                    <button className="form-control" type="submit" id="sub">Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className="row p-2">
                            <div className="col-xl-12">
                                <p className="link">Already Have a Account ? <Link to="/login">Log In</Link></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 mx-1">
                        <img className="img-fluid mt-2" src={reg} alt="Oops Cannot load!" />
                    </div>
                </div>
                {Flg &&
                    <div className="row p-3">
                        <BeatLoader loading size={25} />
                    </div>
                }
            </form>
        </div>
    );
}
export { Reg };
