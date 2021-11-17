import React, { useState, useEffect } from "react"

import '../styles/Header.css';
import '../styles/NavBar.css';

import {
    Link,
} from 'react-router-dom';

import Popup from 'reactjs-popup';

import Logo from './../images/logo.png'


const PopupLogOut = () => {
    function logout() {
        let elem = document.getElementById("logOutMain");
        elem.style.display = 'none';
        localStorage.removeItem("products");
        localStorage.removeItem("firstname");
        localStorage.removeItem("lastname");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.setItem("user", 1);
        window.open("/", "_self");
    }

    return (
        <div >
            <Popup open={true} position="top left">
                {
                    close => (
                        <div id="logOutMain" className="popUpWindow_logOut">

                            <p className="popUpText_logOut">Are you sure to log out?</p>

                            <div className="buttons">
                                <button onClick={logout} className="popUp_buttons">Yes</button>
                                <button className="popUp_buttons" onClick={close}>No</button>
                            </div>
                        </div>
                    )
                }
            </Popup>
        </div>
    );

}
const Header = (props) => {
    const [count, setCount] = useState(0);
    const [logOut, setLogOut] = useState(false);

    const fetchData = async () => {
        let userId = localStorage.getItem("userId");
        let token = localStorage.getItem("token");
        let sendingdata = {
            userId, token
        }
        try {
            const response = await fetch("/api/productsById", {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendingdata) // body data type must match "Content-Type" header
            });
            const json = await response.json();
            let prd = JSON.parse(json["products"]);
            setCount(prd.length)
            // let countAbove = document.getElementById("labelCount");
            // countAbove.value = prd.length;
        } catch (error) {
            console.log("error", error);
        }
    };

    function scrollToTop() {
        window.scroll({
            top: 0
        });

    }
    let get = Number(localStorage.getItem("user"));
    // setLocation(window.location.pathname);
    function openLogOut() {
        setLogOut(true);
        setTimeout(
            () => {
                setLogOut(false)

            }, 5000
        )
    }
    useEffect(
        () => {
            fetchData()
        }, [count]
    )
    return (
        <div className="header">

            <img className="logo main_logo" src={Logo} alt="logo" />
            <ul className="navbar">

                <li className="general">
                    <Link to="/">
                        <img className="nav home general" src="https://image.flaticon.com/icons/png/512/1946/1946488.png" alt="logoNav" />
                    </Link>
                </li>
                <li className="general">
                    {
                        get === 0 ? (
                            <div className="general cartBlock">
                                <Link to="/account">
                                    <img className="nav general" src="http://cdn.onlinewebfonts.com/svg/download_171149.png" alt="logoNav"
                                        onClick={scrollToTop}
                                    />
                                </Link>
                                <input className="mycount" id="labelCount"  value={count} readOnly />
                            </div>
                        ) : null
                    }
                </li>
                <li className="general" >
                    {
                        get === 0 ? (
                            <button
                                label="Submit"
                                className="buttonLogOut"
                                onClick={openLogOut}
                            >
                                <img className="log_out_img general" src="https://www.nicepng.com/png/full/271-2715115_exit-logout-comments-logout-icon-png-transparent.png" alt="log_out_img"

                                     />
                            </button>) : null
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
             


            </ul>

   {
                    logOut ? <PopupLogOut /> : null
                }
        </div>
    )
}






export default Header


