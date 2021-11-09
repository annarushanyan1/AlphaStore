import React, { Component, useState, useEffect } from "react"

import '../styles/Header.css';
import '../styles/NavBar.css';

import {
    Link,
} from 'react-router-dom';

// let labelCount = document.getElementById("labelCount");
// let prd = JSON.parse(localStorage.getItem("products"));
// if(prd != null)
// {
//     labelCount.innerHTML = prd.length;

// }


const Header = (props) => {

    const [count, setCount] = useState(0);

    // setCount(props.count);

    console.log(count)
    let myRef = React.createRef();

    // len = JSON.parse(localStorage.getItem("products")).length;

    useEffect(() => {

        // Update the document title using the browser API

        if (localStorage.getItem("user") == 0) {
            let prd = JSON.parse(localStorage.getItem("products"));
            myRef.current.value = prd.length;
            console.log(myRef)
        }
    });

    // state = {
    //     count: this.len;
    // }
    // constructor(props) {
    //     super()
    //     this.c = props.count
    //     console.log(this.len)
    // }
    // componentDidUpdate(){
    //     this.len = JSON.parse(localStorage.getItem("products")).length;
    //     this.setState(
    //     {'count':this.len}
    //     )
    //     this.forceUpdate()
    // }

    let get = localStorage.getItem("user");
    if (get === 1) {
        count = 0;

    }
    else {

        if (localStorage.getItem("products") != '' || localStorage.getItem("products") != []) {

            let list = JSON.parse(localStorage.getItem("products"));
            // console.log(list)    
        }


    }



    return (
        <div className="header">
            <img className="logo" src="https://pluspng.com/img-png/png-logo-design-fancy-png-logo-design-91-on-professional-logo-design-with-png-logo-design-734.png" alt="logo" />
            <p></p>
            <ul className="navbar">

                <li>
                    <Link to="/">
                        <img className="nav home" src="https://image.flaticon.com/icons/png/512/1946/1946488.png" alt="logoNav" />
                    </Link>
                </li>

                <li>
                    {
                        get == 0 ? (
                            <div>
                        <Link to="/account">
                            <img className="nav" src="http://cdn.onlinewebfonts.com/svg/download_171149.png" alt="logoNav" />
    
                        </Link>
                <input className="mycount" id="labelCount" ref={myRef} value="0" />
               </div>
                ) : null
                    }

                </li>

                <li>
                    {
                        get == 1 ? (
                            <Link to="/login">

                                <img className="nav login" src="https://image.flaticon.com/icons/png/512/1784/1784590.png" alt="logoNav" />
                            </Link>) : null
                    }

                </li>
<li>

</li>

            </ul>
            {/* <button onClick={() => setCount(count + 1)}>
        Click me
      </button> */}

        </div>
    )
}


export default Header
