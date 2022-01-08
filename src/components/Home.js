import React from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import "../css/Home.css";
import Nav from './Nav';
function Home({ children }) {
    const { logOut, User, setUser } = useAuth();
    const navigate = useNavigate();
    // const handleLogOut = async () => {
    //     try {
    //         await logOut()
    //             .then(() => {
    //                 console.log("logged out");
    //                 setUser({});
    //                 navigate("/login");
    //             });
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };
    return (
        <div>
            <Nav/>
            <div className='container'>
                {!User?.emailVerified && <div className='row p-4'>
                    <div className='col-xl-12'>
                        <div className="card text-center">
                            <div className="card-header">
                                Warning
                            </div>
                            <div className="card-body">
                                <h5 className="card-title p-4">Your Email Has not Verified Yet !</h5>
                                <button className="btn btn-primary">Send Verification email</button>
                            </div>
                            <div className="card-footer text-muted">
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default Home
