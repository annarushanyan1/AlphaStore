import React, { useState, useEffect } from "react"

import '../styles/Header.css';
import '../styles/NavBar.css';

import {
    Link,
} from 'react-router-dom';


import Logo from './../images/logo.png'

const Header = (props) => {
    const [count, setCount] = useState(0);
    const [location, setLocation] = useState("/");
    let myRef = React.createRef();
    useEffect(() => {

        if (localStorage.getItem("user") == 0) {
            let prd = JSON.parse(localStorage.getItem("products"));
            myRef.current.value = prd.length;
            console.log(myRef)
        }
    });
    function logout() {
        localStorage.removeItem("products");
        localStorage.removeItem("firstname");
        localStorage.removeItem("lastname");
        localStorage.removeItem("userId");
        localStorage.setItem("user", 1);
        window.location.reload();
    }
    function scrollToTop() {
        window.scroll({
            top: 0
          });

    }
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


    // setLocation(window.location.pathname);

    return (
        <div className="header">
            <img className="logo main_logo" src={Logo} alt="logo" />
            <p></p>
            <ul className="navbar">

                <li className="general">
                    <Link to="/">
                        <img className="nav home general" src="https://image.flaticon.com/icons/png/512/1946/1946488.png" alt="logoNav" />
                    </Link>
                </li>

                <li className="general">
                    {
                        get == 0 ? (
                            <div className="general">
                                <Link to="/account">
                                    <img className="nav general" src="http://cdn.onlinewebfonts.com/svg/download_171149.png" alt="logoNav"
                                        onClick={scrollToTop}
                                    />
                                </Link>
                                <input className="mycount" id="labelCount" ref={myRef} value="0" />
                            </div>
                        ) : null
                    }
                </li>
                <li className="general">
                    {
                        get == 1 ? (
                            <Link to="/login">
                                <img className="nav login general" src="https://image.flaticon.com/icons/png/512/1784/1784590.png" alt="logoNav" />
                            </Link>) : null
                    }

                </li>
                <li className="general">
                    {
                        get == 0 && location == '/' ? (
                            <button
                                label="Submit" onClick={logout}
                                className="buttonLogOut"
                            >
                                <img className="log_out_img general" src="https://www.nicepng.com/png/full/271-2715115_exit-logout-comments-logout-icon-png-transparent.png" />
                            </button>) : null
                    }

                </li>

            </ul>


        </div>
    )
}


export default Header
