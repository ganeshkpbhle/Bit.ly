import React from 'react'
import "../css/Home.css";
function Svg(props) {
    return (
        <div>
            <img width="62px" height="62px" className='custom-img' src={props.prof}>
            </img>
        </div>
    )
}

export default Svg
