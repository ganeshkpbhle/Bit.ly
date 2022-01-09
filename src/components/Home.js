import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import "../css/Home.css";
import Nav from './Nav';
function Home({ children }) {
    return (
        <div>
            <Nav />
            <Outlet />
        </div>
    )
};
export function MainPage({ children }) {
    const { User } = useAuth();
    return (<div className='container'>
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
    </div>);
};
export function Short({children}){
    return(<>ShortComponent</>);
};
export function List({children}){
    return(<>List Compnent</>);
};
export function Edit({children}){
    return(<>Edit Component</>);
};

export default Home;
