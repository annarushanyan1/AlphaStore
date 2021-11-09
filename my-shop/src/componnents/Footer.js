import React from "react"
import '../styles/Footer.css';
const Footer = ()=>{
    return(
        <div className="mainFooter">
            <div className="customer">
            <p className="headerr">CUSTOMER SERVICE</p>
            <a className="href_footer" href="http://localhost:3000/contactUs">Contact</a><br/>
                </div>
                <div className="customer">
            <p className="headerr">BUSINESS</p>
            <div>
            <a className="href_footer" href="http://localhost:3000/aboutUs">About us</a><br/>
            <a className="href_footer" href="http://localhost:3000/contactUs">Work with us</a>

            </div>
            </div>
        </div>
            )
}

export default Footer