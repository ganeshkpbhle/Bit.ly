import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from '../context/Auth';
import * as MdIcons from 'react-icons/md';
function Pop_urls() {
    const { delUrl, list, setList, getUrls } = useAuth();
    const user = (JSON.parse(localStorage["user"]))?.data;
    const { month } = useParams();
    const [monthData, setData] = useState([]);
    const [monthIndex, setIndex] = useState(-1);
    const navigate=useNavigate();
    useEffect(() => {
        if (list?.length !== 0) {
            const thisMonth = (list?.filter(e => e.name === month))[0];
            setData(thisMonth?.urls);
            setIndex(list?.indexOf(thisMonth));
        }
        return () => {
            setData([]);
        };
    }, [list, month]);
    useEffect(() => {
        if (monthData?.length !== 0) {
            setData(list[monthIndex]?.urls);
        }
    }, [monthIndex]);
    const handleDelete = async (e) => {
        const Id = e?.target.getAttribute("id");
        let updtMonth = monthData.filter(element => element.urlId !== Id);
        let updtlist = [...list];
        if (updtMonth.length !== 0) {
            updtlist[monthIndex].urls = updtMonth;
            setList(updtlist);
        }
        else {
            if (monthIndex > 0) {
                updtlist.splice(monthIndex,1);
                setList(updtlist);
                navigate(`/home/list/${list[monthIndex-1]?.name}`);
            }
            else{
                navigate('/home/');
            }
        }
        delUrl(Id)
            .then(() => {
                getUrls(user?.id)
                    .then((response) => {
                        if (response?.data.del === 1) {
                            setList(response?.data);
                        }
                    });
            });
    };
    const renderUrls = (item, index) => {
        return (
            <div className="p-2 my-2 bd-highlight shadow-sm bg-body rounded" key={index}>
                <div className="d-inline-flex align-items-center flex-row p-2 bd-highlight flex-list">
                    <div className="p-2 bd-highlight list-item"><a href={item?.longUrl} target='_blank'>{`bit.ly/${item?.urlId}`}</a></div>
                    <div className="p-2 bd-highlight list-item"><p className='date-text'>{item?.createdDate.replaceAll('T', '  ')}</p></div>
                    <div className="p-2 bd-highlight list-item"><a className='btn btn-danger' id={item?.urlId} onClick={handleDelete}>Delete</a></div>
                </div>
            </div>
        );
    };
    return (
        <>
            {
                monthData?.length !== 0 &&
                <>
                    <div className="card">
                        <div className="card-header month-header">
                            <div className="d-inline-flex flex-row p-2 bd-highlight flex-list">
                                <div className="p-2 bd-highlight list-item">
                                    {
                                        (monthIndex > 0) &&
                                        <Link
                                            to={`/home/list/${list[monthIndex - 1]?.name}`}
                                        //to={"#"}
                                        >
                                            <MdIcons.MdOutlineArrowForwardIos style={{ transform: "rotate(180deg)", cursor: "pointer" }} size={32}
                                            // onClick={() => {
                                            //     if (monthIndex >= 0) {
                                            //         setIndex(prevst => prevst - 1);
                                            //     }
                                            // }} 
                                            />
                                        </Link>
                                    }
                                </div>
                                <div className="p-2 bd-highlight list-item">{list[monthIndex]?.name}</div>
                                <div className="p-2 bd-highlight list-item">
                                    {
                                        (monthIndex < list?.length - 1) &&
                                        <Link
                                            to={`/home/list/${list[monthIndex + 1]?.name}`}
                                        //to={"#"}
                                        >
                                            <MdIcons.MdOutlineArrowForwardIos style={{ cursor: "pointer" }} size={32}
                                            // onClick={() => {
                                            //     if (monthIndex >= 0 && monthIndex <= list?.length - 1) {
                                            //         setIndex(prevst => prevst + 1);
                                            //     }
                                            // }} 
                                            />
                                        </Link>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="d-flex flex-column-reverse bd-highlight">
                                {
                                    monthData?.map((item, index) => {
                                        return (renderUrls(item, index));
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
}

export default Pop_urls;
