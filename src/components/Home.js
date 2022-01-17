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
    const { flg, verifyEmail, User, addUser, getUser } = useAuth();
    const ustr = localStorage["data"];
    const user = JSON.parse(ustr)?.user;
    const [Vfy, setVfy] = useState(false);
    useEffect(() => {
        const rslt =[];
        if (rslt?.length === 0) {
            const [firstName, lastName] = (ustr.slice(ustr.indexOf('"displayName":') + 15, ustr.indexOf(',"isAnonymous":') - 1)).split(" ");
            const Prof = {
                firstName,
                lastName,
                email: user?.email,
                mobile: "",
                uid: user?.uid,
                urls: []
            };
            addUser(Prof)
                .then(response => {
                    let tmp = JSON.parse(localStorage["data"]);
                    tmp["id"] = response?.data.id;
                    localStorage.setItem('data', JSON.stringify(tmp));
                    return;
                });
        }
        else {
            let tmp = JSON.parse(localStorage["data"]);
            tmp["id"] = rslt[0]?.id;
            localStorage.setItem('data', JSON.stringify(tmp));
        }
    }, []);
    return (<>
        {!user?.emailVerified &&
            <div className='d-flex flex-row bd-highlight justify-content-end'>
                <div className='p-2 bd-highlight'>
                    <div className="card text-center">
                        <div className="card-body">
                            {!Vfy && <>
                                <h5 className="card-title p-2">Your Email Has not Verified Yet !</h5>
                                <button className="btn btn-primary" onClick={() => {
                                    if (!User?.user) {
                                        verifyEmail(User)
                                            .then(() => {
                                                setVfy(true);
                                            });
                                    }
                                }
                                }>Send Verification email</button>
                            </>}
                            {Vfy && <p className='text-success p-4'>Verification Email has been sent check email !</p>}
                        </div>
                    </div>
                </div>
            </div>
        }
        {flg &&
            <div className='d-flex flex-row bd-highlight justify-content-end'>
                <div className='p-2 bd-highlight'>
                    <div className="card text-center">
                        <div className='card-header'>
                            <RiIcons.RiErrorWarningFill size={32} />
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
    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
    const RandGen = () => {

    };
    const Submit = async (data) => {
        setRslt(data?.url);
        reset();

    };
    const Clip = () => {
        navigator.clipboard.writeText(Rslt);
        setCpy(true);
    };
    const Urls = () => {

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
