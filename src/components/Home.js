import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import "../css/Home.css";
import Nav from './Nav';
import * as RiIcons from 'react-icons/ri';
import * as FcIcons from 'react-icons/fc';
function Home({ children }) {
    return (
        <div>
            <Nav />
            <Outlet />
        </div>
    )
};
export function MainPage({ children }) {
    const { userCred,checkProf,flg } = useAuth();
    const User=JSON.parse(localStorage["data"]);
    useEffect(() => {
        let methd = userCred(User.email)
            .then((data) => {
                for (const key in Object.keys(data)) {
                    if (data[key] === 'google.com') {
                        checkProf(User?.uid);
                    }
                }
            });
        return methd;
    }, []);
    return (<>
        {!User?.emailVerified &&
            <div className='d-flex flex-row bd-highlight justify-content-end'>
                <div className='p-2 bd-highlight'>
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title p-2">Your Email Has not Verified Yet !</h5>
                            <button className="btn btn-primary">Send Verification email</button>
                        </div>
                    </div>
                </div>
            </div>
        }
        {   flg &&
            <div className='d-flex flex-row bd-highlight justify-content-end'>
                <div className='p-2 bd-highlight'>
                    <div className="card text-center">
                        <div className='card-header'>
                            <RiIcons.RiErrorWarningFill size={32}/>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title p-2">Please Complete Your Profile from the left panel</h5>
                        </div>
                    </div>
                </div>
            </div>
        }
    </>);
};
export function Short({ children }) {
    const { register, handleSubmit, formState: { errors }, trigger, reset } = useForm();
    const [Rslt, setRslt] = useState("");
    const [Cpy, setCpy] = useState(false);
    const Submit = async (data) => {
        setRslt(data?.url);
        console.log(data);
        reset();
    };
    const Clip = () => {
        navigator.clipboard.writeText(Rslt);
        setCpy(true);
    };
    return (
        <div className='container-fluid shadow mt-5 py-3 px-3 rounded'>
            <div className='row'>
                <form onSubmit={handleSubmit(Submit)} className='Box'>
                    <div className='form-group px-5 py-3'>
                        <input type='text' name='url' placeholder='Enter Your URL Here ...' className='form-control urlBox' {...register("url", {
                            required: "Enter Valid URL !",
                            pattern: {
                                value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i,
                                message: "Invalid URL !"
                            }
                        })}
                            onKeyUp={() => {
                                setRslt("");
                                trigger("url");
                            }} />
                    </div>
                    {errors.url && <p className='errtext'>{errors.url.message}</p>}
                    <div className='form-group p-3'>
                        <div className="d-flex flex-row align-items-center justify-content-center">
                            <div className="p-2 bd-highlight">
                                <button type="submit" id='sub' className='form-control btn btn-secondary p-3'>Short</button>
                            </div>
                            <div className="p-2 bd-highlight">
                                <button className='form-control btn btn-primary p-3' onClick={() => {
                                    setRslt("");
                                    setCpy(false);
                                    reset();
                                }}>Clear</button>
                            </div>
                        </div>
                    </div>
                    {Rslt &&
                        <div className='form-group p-4'>
                            <div className="d-flex flex-row align-items-center justify-content-center">
                                <div className="p-2 bd-highlight"><input type={"text"} className='form-control' value={Rslt} readOnly /></div>
                                <div className="p-2 bd-highlight"><Link to={"#"} onClick={Clip}><RiIcons.RiFileCopyLine size={25} /></Link></div>
                                {Cpy && <div className='p-2 bd-highlight'><FcIcons.FcCheckmark size={25} /> Copied</div>}
                            </div>
                        </div>
                    }
                </form>
            </div>
        </div>
    );
};
export function List({ children }) {
    return (<>List Compnent</>);
};
export function Edit({ children }) {
    return (<>Edit Component</>);
};

export default Home;
