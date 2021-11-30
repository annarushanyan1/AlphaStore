import React, { useState, useEffect } from "react"

import '../styles/Header.css';
import '../styles/NavBar.css';

import {Link} from 'react-router-dom';

import Popup from 'reactjs-popup';

import Logo from '../images/logo.png'

import Cart from '../images/Cart.png'
let ref_log_out = React.createRef();
const PopupLogOut = () => {
    function logout() {
        let elem = document.getElementById("logOutMain");
        elem.style.display = 'none';
        localStorage.removeItem("products");
        localStorage.removeItem("fullname");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.setItem("user", 1);
        window.open("/", "_self")
    }
    function closing() {
        let elem = document.getElementById("logOutMain");
        elem.style.display = 'none';
    }
    return (
        <div ref={ref_log_out}>
            <Popup open={true} position="top left">
                {
                    close => (
                        <div id="logOutMain" className="popUpWindow_logOut">

                            <p className="popUpText_logOut">Are you sure to log out?</p>

                            <div className="buttons">
                                <button onClick={logout} className="popUp_buttons">Yes</button>
                                <button className="popUp_buttons" onClick={closing}>No</button>
                            </div>
                        </div>
                    )
                }
            </Popup>
        </div>
    );

}

const Header = (props) => {
    const [logOut, setLogOut] = useState(false)

    let myRef = React.createRef();
    useEffect(() => {

        if (Number(localStorage.getItem("user")) === 0) {
            let prd = JSON.parse(localStorage.getItem("count"));
            myRef.current.value = prd;
            console.log(myRef)
        }
    });

    function scrollToTop() {
        window.scroll({
            top: 0
        });
window.open("/account","_self")


    }
    let get = Number(localStorage.getItem("user"));

    function openLogOut() {
        setLogOut(true);
        setTimeout(
            () => {
                setLogOut(false)
            }, 4000
        )
    }
    return (
        <div className="header">
            <Link to="/">
                <img className="logo main_logo" src={Logo} alt="logo" />
            </Link>
            <p></p>
            <ul className="navbar">
                <li className="general">
                    <Link to="/">
                        <img className="nav home general" src="https://image.flaticon.com/icons/png/512/1946/1946488.png" alt="logoNav" />
                    </Link>
                </li>
                <li className="general">
                    {
                        get === 0 ? (
                            <div className="general">
                                <Link to="/account">
                                    <img className="nav general" src={Cart} alt="logoNav"
                                        onClick={scrollToTop}
                                    />
                                </Link>
                                <input className="mycount" id="labelCount" ref={myRef} value="0" readOnly />
                            </div>
                        ) : null
                    }
                </li>
                <li className="general">
                    {
                        get === 1 ? (
                            <Link to="/login">
                                <img className="nav login general" src="https://image.flaticon.com/icons/png/512/1784/1784590.png" alt="logoNav" />
                            </Link>) : null
                    }

                </li>
                <li className="general">
                    {
                        get === 0 ? (
                            <button
                                // label="Submit" onClick={logout}
                                label="Submit" onClick={openLogOut}
                                className="buttonLogOut"
                            >
                                <img className="log_out_img general" alt="log out" src="https://www.nicepng.com/png/full/271-2715115_exit-logout-comments-logout-icon-png-transparent.png" />
                            </button>) : null
                    }

                </li>
                {
                    logOut ? <PopupLogOut /> : null
                }
            </ul>


        </div>
    )
}


export default Header