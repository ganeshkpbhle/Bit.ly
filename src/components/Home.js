import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { useForm } from 'react-hook-form';
import { Link,useNavigate } from 'react-router-dom';
import "../css/Home.css";
import Nav from './Nav';
import * as RiIcons from 'react-icons/ri';
import * as FcIcons from 'react-icons/fc';
import { BounceLoader } from "react-spinners";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Form } from "react-bootstrap";
function Home({ children }) {
    return (
        <div>
            <Nav />
            <Outlet />
        </div>
    )
};
export function MainPage({ children }) {
    const { verifyEmail, getUserSimple, User, setUser, REACT_APP_LOCAL, ComputeDate } = useAuth();
    const ustr = localStorage["user"];
    const user = JSON.parse(ustr)?.data;
    const [Vfy, setVfy] = useState(false);
    const [pflg, setPflg] = useState(false);
    const [dataFeed, setFeed] = useState([]);
    const [Opt,setOpt]=useState(1);
    useEffect(() => {
        dataFeed.length = 0;
        ComputeDate({ "Id": user?.id, Opt })
            .then((response) => {
                console.log(response);
                response?.data?.forEach(element => {
                    setFeed(prev => [...prev, element]);
                });
            });
    }, [Opt]);
    const handleRefresh = () => {
        getUserSimple(user.id)
            .then((response) => {
                setUser(response?.data);
                setVfy(false);
            });
    };
    const handleSelect = (e) => {
        dataFeed.length = 0;
        setOpt((e?.target.value==="month")?1:2);
    };
    return (<>
        {(User?.emailVerified === 0) &&
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
                                                Body: `<p style='font-size:18px'>To verify your mail ${User.email}</p><br><a style='font-size:15px' href='${REACT_APP_LOCAL}vfc/${parseInt(user.id)}'>Click here to Verify Your Email</a>`
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
                            {Vfy && <><p className='text-success p-3 mx-3'>Verification Email has been sent check email !</p><button className='btn btn-secondary' onClick={handleRefresh}>Refresh</button></>}
                        </div>
                    </div>
                </div>
            </div>
        }
        <div className='d-flex flex-row bd-highlight justify-content-end my-2'>
            <div className='p-2 bd-highlight'>
                <Form.Select onChange={handleSelect} value={(Opt===1)?"month":"week"}>
                    <option value="month">Month</option>
                    <option value="week">Last-7-Days</option>
                </Form.Select>
            </div>
        </div>
        <div className='container'>
            <div className='row Chart my-5'>
                <ResponsiveContainer aspect={2 / 1} width={1100}>
                    <LineChart margin={{ top: 5, right: 0, left: 0, bottom:0 }} data={dataFeed}>
                        <XAxis dataKey="name" stroke='#5550bd' />
                        <YAxis dataKey="active_Count"/>
                        <Line type="monotone" dataKey="active_Count" stroke='blue' />
                        <Tooltip />
                        <CartesianGrid stroke='white' />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
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
        const urlparam = { UrlId, "LongUrl": data?.url, UserId, CreatedDate };
        addUrl(urlparam)
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
                                value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i,
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
    useEffect(() => {
        const methd = getUrls(user?.id)
            .then((response) => {
                setList(response?.data);
            });
        return methd;
    }, []);
    const handleDelete = async (e) => {
        const Id = e?.target.getAttribute("id");
        setList(list.filter(element => element.urlId !== Id));
        delUrl(Id)
            ?.then((res) => {
                console.log(res);
            });
    };
    return (<>
        {
            list?.map(item => {
                return (
                    <div className="container custom-cont py-3 px-5 my-3 shadow-sm bg-white rounded" key={item.urlId}>
                        <div className="row">
                            <div className="col-xl-4"><Link className='custom-b' to={{ pathname: `/${item.urlId}` }} target="_blank">{"bit.ly/" + item.urlId}</Link></div>
                            <div className="col-xl-5"><p>{item.createdDate?.replace('T', ' ')}</p></div>
                            <div className="col-xl-3"><button className='btn btn-danger custom-a' id={item?.urlId} onClick={handleDelete}>delete</button></div>
                        </div>
                    </div>
                );
            })
        }
    </>);
};
export function Edit({ children }) {
    const { register, handleSubmit, formState: { errors, dirtyFields }, trigger,setValue } = useForm();
    const { updateUser,User,setUser,getUserSimple} = useAuth();
    const user=JSON.parse(localStorage['user'])?.data;
    const [Flg, setFlg] = useState(false);
    const [Err, setErr] = useState("");
    const navigate = useNavigate();
    useEffect(()=>{
        getUserSimple(user?.id)
        .then((response)=>{
            const arr={ 'firstName':response?.data.firstName,'lastName':response?.data.lastName,'email':response?.data.email,'mobile':response?.data.mobile }
            Object.keys(arr).forEach(element => {
                setValue(element.toString(),arr[element],{shouldValidate:true});
            });
        });
    },[]);
    const Submit = async (data,e) => {
        e.preventDefault();
        setErr("");
        updateUser(user?.id,{'Id':user?.id,'FirstName':data.firstName,'LastName':data.lastName,'Email':data.email,'Mobile':data.mobile})
        .then((response)=>{
            if(response?.data.update){
                setFlg(true);
            }
        });

    };
    return (
        <div className="container shadow-sm mt-5 py-3 px-3 rounded reg-bg">
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
                                    }, maxLength: {
                                        value: 10, message: "Mobile number should be 10 digits!"
                                    }
                                })}
                                onKeyUp={() => {
                                    trigger("mobile");
                                }}
                            />
                            {errors.mobile && <p className="errtext">{errors.mobile.message}</p>}
                        </div>
                        <div className="row p-3">
                            <div className="col-xl-12">
                                <div className="form-group mt-1">
                                    <button className="form-control" type="submit" id="sub">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {Err.length !== 0 &&
                    <p className="errtext">
                        {Err}
                    </p>
                }
                {
                    Flg && 
                    <p className='text-success'>
                        Details updated successfully
                    </p>
                }
            </form>
        </div>
    );
};

export default Home;
