import React, { useEffect } from 'react'
import { useParams } from 'react-router';
import { useAuth } from '../context/Auth';
function Extract() {
    const { Id }=useParams();
    const {getUrlById}=useAuth();
    useEffect(()=>{
        getUrlById(Id)
        .then((response)=>{
            console.log(response?.data.longUrl);
            if(response?.data.longUrl){
                window.location.replace(response?.data.longUrl);
            }
        });
    },[]);
    return (<></>)
}

export default Extract
