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
import http from "../config/http-common";
function Nav({ children }) {
    const { getUserSimple, User, setUser } = useAuth();
    const [Err, setErr] = useState("");
    const handleLogOut = () => {
        navigate("/login");
        localStorage.clear();
        setUser({});
    };
    const data = (JSON.parse(localStorage["user"]))?.data;
    const [profilelogo, setProfilelogo] = useState(`https://avatars.dicebear.com/api/initials/${User?.email+User?.id}.svg`);
    useEffect(() => {
        if (data?.token) {
            setTimeout(() => {
                alert("Session Expired pls login again !");
                handleLogOut();
            }, 1800000);
            getUserSimple(data?.id)
                .then((response) => {
                    setProfilelogo(`https://avatars.dicebear.com/api/initials/${response?.data.email+response?.data.id}.svg`);
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
            <div className='container-fluid'>
                <div className='row'>
                    <div className='navbar'>
                        <div className='d-flex bd-highlight'>
                            <Link to="#" onClick={Side}><Svg prof={profilelogo} /></Link>
                        </div>
                        <div className='d-flex bd-highlight'>
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
                </div>
            </div>
        </IconContext.Provider>
    </>
    )
}

export default Nav
