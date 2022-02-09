import React from "react"
import '../styles/Footer.css';

const Footer = () => {
  return (
    <div className="mainFooter">
      <div className="customer">
        <p className="headerr"><b>CUSTOMER SERVICE</b></p>
        <a className="href_footer" href="http://localhost:
                /contactUs">Contact</a><br />
      </div>
      <div className="customer business_part">
        <p className="headerr"><b>BUSINESS</b></p>
        <div>
          <a className="href_footer" href="http://localhost:3000/aboutUs">About us</a><br />
        </div>
      </div>
    </div>
  )
}

export default Footer