import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import Svg from "./Svg"
import { } from "../css/Nav.css";
import { useAuth } from '../context/Auth';
import * as BiIcon from 'react-icons/bi';
import * as RiIcon from 'react-icons/ri';
import * as MdIcon from 'react-icons/md';
import * as CgIcon from 'react-icons/cg';
import * as FiIcon from 'react-icons/fi';
import { IconContext } from 'react-icons';
import jwt from 'jwt-decode';
function Nav({ children }) {
    const { getUserSimple, User, setUser, REACT_APP_DICEBEAR,logout } = useAuth();
    const [Err, setErr] = useState("");
    const handleLogOut = () => {
        console.log("User : "+JSON.stringify(User));
        logout(User?.id)
        .then((response)=>{
            if(response?.data.logout===1){
                navigate("/login");
                localStorage.clear();
                setUser({});
            }
        });

    };
    const [profilelogo, setProfilelogo] = useState(`${REACT_APP_DICEBEAR}${User?.firstName+User?.lastName + User?.id}.svg`);
    useEffect(() => {
        const data = (JSON.parse(localStorage["user"]))?.data;
        console.log("data : "+JSON.stringify(data));
        if (data?.token) {
            setTimeout(() => {
                alert("Session Expired pls login again !");
                handleLogOut();
            }, new Date((jwt(data?.token))?.exp * 1000) - new Date());
            getUserSimple(data?.id)
                .then((response) => {
                    setProfilelogo(`${REACT_APP_DICEBEAR}${response?.data.firstName + response?.data.lastName + response?.data.id}.svg`);
                    setUser(response?.data);
                })
                .catch((err) => {
                    setErr("Something went wrong !");
                    console.log(err?.message);
                });
        }
    }, []);
    const navigate = useNavigate();
    const [sidebar, setSidebar] = useState(false);
    const Side = () => {
        setSidebar(!sidebar);
    };
    const SideElements = [
        {
            title: "Home",
            path: '/home/dash',
            cName: 'nav-text',
            icon: <RiIcon.RiHome2Line size={32} />,
            active: "act",
            inactive: "inact"
        },
        {
            title: "Shorturl",
            path: '/home/short',
            cName: 'nav-text',
            icon: <BiIcon.BiCodeCurly size={32} />,
            active: "act",
            inactive: "inact"
        },
        {
            title: "History",
            path: '/home/list',
            cName: 'nav-text',
            icon: <MdIcon.MdHistoryToggleOff size={32} />,
            active: "act",
            inactive: "inact"
        },
        {
            title: "Profile",
            path: '/home/edit',
            cName: 'nav-text',
            icon: <CgIcon.CgProfile size={32} />,
            active: "act",
            inactive: "inact"
        }
    ];
    return (<>
            <IconContext.Provider value={{ color: 'blue' }}>
                    <div className='navbar'>
                        <div className='d-flex bd-highlight'>
                            <Link to="#" onClick={Side}><Svg prof={profilelogo} /></Link>
                        </div>
                        <div className='d-flex bd-highlight justify-self-center'>
                            <p className='icon'>Bit.ly</p>
                        </div>
                        <div className='d-flex bd-highlight'>
                            <button className='btn btn-danger' id='logout' onClick={handleLogOut}><FiIcon.FiLogOut size={'30px'} /> &emsp;Log out</button>
                        </div>
                    </div>
                    <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                        <ul className='nav-menu-items'>
                            <li className='navbar-toggle'>
                                <Link to="#" className='menu-bars'>
                                    <MdIcon.MdOutlineClose size={'30px'} onClick={Side} />
                                </Link>
                            </li>
                            {
                                SideElements.map((item, index) => {
                                    return (
                                        <li key={index} className={item.cName}>
                                            <NavLink to={item.path} className={({ isActive }) => isActive ? item.active || (item?.flg) : item.inactive}>
                                                {item.icon}
                                                <span>{item.title}</span>
                                            </NavLink>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </nav>
                </IconContext.Provider>
    </>
    )
}

export default Nav
