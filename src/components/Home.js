import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import "../css/Home.css";
import Nav from './Nav';
import * as RiIcons from 'react-icons/ri';
import * as FcIcons from 'react-icons/fc';
import http from "../config/http-common";
import { BounceLoader } from "react-spinners";
function Home({ children }) {
    return (
        <div>
            <Nav />
            <Outlet />
        </div>
    )
};
export function MainPage({ children }) {
    const { verifyEmail, getUserById, getUserSimple } = useAuth();
    const ustr = localStorage["user"];
    const user = JSON.parse(ustr)?.data;
    const [Vfy, setVfy] = useState(false);
    const [User, setUser] = useState({});
    const [pflg, setPflg] = useState(false);
    useEffect(() => {
        getUserSimple(user.id)
            .then((response) => {
                setUser(response?.data);
                setVfy(false);
            });
    }, []);
    const handleRefresh = () => {
        http.interceptors.request.use(
            _config => {
                _config.headers.authorization = `Bearer ${user.token}`;
                return _config;
            },
            error => {
                return Promise.reject(error);
            }
        );
        getUserSimple(user.id)
            .then((response) => {
                setUser(response?.data);
                setVfy(false);
            });
    };
    return (<>
        {(User?.emailVerified == 0) &&
            <div className='d-flex flex-row bd-highlight justify-content-end'>
                <div className='p-2 bd-highlight'>
                    <div className="card text-center">
                        <div className="card-body">
                            {!Vfy && <>
                                <h5 className="card-title p-2"><RiIcons.RiErrorWarningFill size={32} />Your Email Has not Verified Yet !</h5>
                                {!pflg &&
                                    <>
                                        <button className="btn btn-primary" onClick={() => {
                                            setPflg(true);
                                            const vfcDetail = {
                                                ToMail: User.email,
                                                Subject: "Verifcation link",
                                                Body: `<p style='font-size:18px'>To verify your mail ${User.email}</p><br><a style='font-size:15px' href='http://localhost:3000/vfc/${parseInt(user.id)}'>Click here to Verify</a>`
                                            };
                                            verifyEmail(vfcDetail)
                                                .then((result) => {
                                                    if (result?.data) {
                                                        setVfy(true);
                                                        setPflg(false);
                                                    }
                                                });
                                        }
                                        }>Send Verification email</button>
                                    </>
                                }
                                {pflg && <BounceLoader loading size={35} />}
                            </>
                            }
                            {Vfy && <><p className='text-success p-3 mx-3'>Verification Email has been sent check email !</p><a className='btn btn-secondary' onClick={handleRefresh}>Refresh</a></>}
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
    const { addUrl } = useAuth();
    const user = (JSON.parse(localStorage["user"]))?.data;
    const RandGen = () => {
        let rslt = "";
        const strRand = "A345opqMNOPQ6DEFjklBC012mnXYZabcdefghi78rstuvRSTUVWwxyzGHIJKL9";
        const strLen = strRand.length;
        for (var i = 0; i < 6; i++) {
            rslt += strRand.charAt(Math.floor(Math.random() * strLen));
        }
        return rslt;
    };
    const Submit = async (data) => {
        const UrlId = RandGen();
        const UserId = user?.id;
        const date = new Date();
        const CreatedDate = date.toISOString().slice(0, 19);
        http.interceptors.request.use(
            _config => {
                _config.headers.authorization = `Bearer ${user?.token}`;
                return _config;
            },
            error => {
                return Promise.reject(error);
            }
        );
        addUrl({ UrlId, "LongUrl": data?.url, UserId, CreatedDate })
            .then((response) => {
                setRslt(`bit.ly/${UrlId}`);
            })
            .catch((error) => {
                console.log(error?.message);
            });
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
    const { getUrls, delUrl } = useAuth();
    const [list, setList] = useState([]);
    const user = (JSON.parse(localStorage["user"]))?.data;
    const [temp, setTemp] = useState({});
    useEffect(() => {
        getUrls(user?.id)
            .then((response) => {
                setList(response?.data);
            });
    }, []);
    const handleDelete = async (e) => {
        http.interceptors.request.use(
            _config => {
                _config.headers.authorization = `Bearer ${user?.token}`;
                return _config;
            },
            error => {
                return Promise.reject(error);
            }
        );
        const Id = e?.target.getAttribute("id");
        setList(list.filter(element => element.urlId !== Id));
        delUrl(Id)
            ?.then((res) => {
                console.log(res);
            });
    };
    return (<>
        {
            /* {list?.length !== 0 &&
                <div className='container custom-cont'>
                    <div className='row'>
                        <div className='col-xl-12'>
                            {
                                list.map(item => {
                                    return (
                                        <div className="card p-2 my-2 custom-card" key={item.urlId}>
                                            <div className='card-body'>
                                                <div className="d-flex flex-row bd-highlight justify-content-around m-0">
                                                    <div className="px-5 bd-highlight"><Link className='custom-b' to={{ pathname: `/${item.urlId}` }} target="_blank">{"bit.ly/" + item.urlId}</Link></div>
                                                    <div className="px-5 bd-highlight"><p>{item.createdDate?.replace('T', ' ')}</p></div>
                                                    <div className="px-5 bd-highlight"><a className='btn btn-danger custom-a'>delete</a></div>
                                                </div>
                                            </div>
                                        </div>);
                                })
                            }
                        </div>
                    </div>
                </div>
            } */
        }
        {
            list?.map(item => {
                return (
                    <div className="container custom-cont py-3 px-5 my-3 shadow-sm bg-white rounded" key={item.urlId}>
                        <div className="row">
                            <div className="col-xl-4"><Link className='custom-b' to={{ pathname: `/${item.urlId}` }} target="_blank">{"bit.ly/" + item.urlId}</Link></div>
                            <div className="col-xl-5"><p>{item.createdDate?.replace('T', ' ')}</p></div>
                            <div className="col-xl-3"><a className='btn btn-danger custom-a' id={item?.urlId} onClick={handleDelete}>delete</a></div>
                        </div>
                    </div>
                );
            })
        }
    </>);
};
export function Edit({ children }) {
    const user = (JSON.parse(localStorage["user"]))?.data;
    const { getUserById } = useAuth();
    const [full, setFull] = useState({});
    useEffect(() => {
        const mthd = () => {
            getUserById(user?.id)
                .then((response) => {
                    setFull(response?.data);
                });
        }
        return mthd();
    }, []);
    return (
        <>
            {
                console.log(full)
            }
        </>
    );
};

export default Home;
