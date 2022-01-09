import React, { useState } from 'react';
import { Link, useNavigate,NavLink } from 'react-router-dom';
import Svg from "./Svg"
import { } from "../css/Nav.css";
import { useAuth } from '../context/Auth';
import * as BiIcon from 'react-icons/bi';
import * as RiIcon from 'react-icons/ri';
import * as MdIcon from 'react-icons/md';
import * as CgIcon from 'react-icons/cg';
import { IconContext } from 'react-icons';
function Nav({ children }) {
    const { logOut, User, setUser } = useAuth();
    const navigate = useNavigate();
    const [sidebar, setSidebar] = useState(false);
    const Side = () => {
        setSidebar(!sidebar);
    };
    const SideElements = [
        {
            title: "Home",
            path: '/home',
            cName: 'nav-text',
            icon: <RiIcon.RiHome2Line size={'35px'} />,
            active:"act",
            inactive:"inact"
        },
        {
            title: "Shorturl",
            path: '/home/short',
            cName: 'nav-text',
            icon: <BiIcon.BiCodeCurly size={'35px'} />,
            active:"act",
            inactive:"inact"
        },
        {
            title: "History",
            path: '/home/list',
            cName: 'nav-text',
            icon: <MdIcon.MdHistoryToggleOff size={'35px'} />,
            active:"act",
            inactive:"inact"
        },
        {
            title: "Profile",
            path: '/home/edit',
            cName: 'nav-text',
            icon: <CgIcon.CgProfile size={'35px'} />,
            active:"act",
            inactive:"inact"
        }
    ];
    const handleLogOut = async () => {
        try {
            await logOut()
                .then(() => {
                    console.log("logged out");
                    localStorage.clear();
                    setUser({});
                    navigate("/login");
                });
        } catch (err) {
            console.log(err);
        }
    };
    const profilelogo = `https://avatars.dicebear.com/api/initials/${User?.email}.svg`;
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
                            <button className='btn btn-danger' id='logout' onClick={handleLogOut}>Log out</button>
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
                                            <NavLink to={item.path}>
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
