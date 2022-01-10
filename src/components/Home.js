import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
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
    return (<div className='container-fluid'>
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
export function Short({ children }) {
    const { register, handleSubmit, formState: { errors, dirtyFields }, trigger } = useForm();
    const Submit = async (data) => {
        console.log(data);
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
                        })} />
                    </div>
                    {errors.url && <p className='errtext'>{errors.url.message}</p>}
                    <div className='form-group p-3'>
                        <button type="submit" id='sub' className='form-control btn btn-secondary p-3'>Short</button>
                    </div>
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
