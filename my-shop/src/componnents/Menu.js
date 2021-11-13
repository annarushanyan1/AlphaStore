import React from 'react';
import './../styles/Menu.css'


const Menu = () => {
    function openSelectList() {
        let elem = document.getElementById("category_select").style;
        elem.display = 'block';
    }
    function closeSelectList() {
        let elem = document.getElementById("category_select").style;

        elem.display = 'none';
    }
function Session(){
    sessionStorage.setItem("name",'Anna')
}

Session()
let loc = window.location.pathname;

    return (
        <div className="menu">
            <li
                onMouseEnter={openSelectList}
                onMouseLeave={closeSelectList}
                key="1">
                <p>Categories</p>
                <br />
                <div className="category_select" id="category_select">
                    <p className="category_text">Bags</p>
                    <p className="category_text">Shirt</p>
                    <p className="category_text">Cosmetics</p>

                </div>
            </li>
            <li key="2">
                <a href="http://localhost:3000/aboutUs" className="menu_href">
                    About Us</a>
            </li>
            <li key="3">
                <a href="http://localhost:3000/ContactUs" className="menu_href">
                    Contuct Us</a>
            </li>

        </div>
    )
}

export default Menu