import React, { useState, useEffect } from "react"

import '../styles/Header.css';
import '../styles/NavBar.css';

import {
    Link,
} from 'react-router-dom';

import Popup from 'reactjs-popup';

import Logo from './../images/logo.png'


let ref_log_out = React.createRef();
const PopupLogOut = () => {
    function logout() {
        let elem = document.getElementById("logOutMain");
        elem.style.display = 'none';
        localStorage.removeItem("products");
        localStorage.removeItem("firstname");
        localStorage.removeItem("lastname");
        localStorage.removeItem("userId");
        localStorage.setItem("user", 1);
        window.location.reload();
    }
    function closing(){
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
    const [count, setCount] = useState(0);
    const [location, setLocation] = useState("/");
    const [logOut,setLogOut] = useState(false)

    let myRef = React.createRef();
    useEffect(() => {

        if (localStorage.getItem("user") == 0) {
            let prd = JSON.parse(localStorage.getItem("products"));
            myRef.current.value = prd.length;
            console.log(myRef)
        }
    });
 
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
   function openLogOut(){
    setLogOut(true) ;
    setTimeout(
           ()=>{
    setLogOut(false)

           },5000
       )
}
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
                                <input className="mycount" id="labelCount" ref={myRef} value="0" readOnly/>
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
                        get == 0  ? (
                            <button
                                // label="Submit" onClick={logout}
                                label="Submit" onClick={openLogOut}
                                className="buttonLogOut"
                            >
                                <img className="log_out_img general" src="https://www.nicepng.com/png/full/271-2715115_exit-logout-comments-logout-icon-png-transparent.png" />
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
