import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Menu.css'


const Menu = () => {
  function openSelectList() {
    let elem = document.getElementById("category_select").style;
    elem.display = 'block';
  }
  function closeSelectList() {
    let elem = document.getElementById("category_select").style;

    elem.display = 'none';
  }

  return (
    <div className="menu">
      <li
        onMouseEnter={openSelectList}
        onMouseLeave={closeSelectList}
        key="1">
        <p>Categories</p>
        <br />
        <div className="category_select" id="category_select">
          <div className="collection_flex">
            <div className="clothes">
              <Link to={"/categories/jeans"} className="link_category">
                <p className="category_text">Jeans</p>
              </Link>
              <Link to={"/categories/shirt"} className="link_category">
                <p className="category_text">Shirt</p>
              </Link>

              <Link to={"/categories/boots"} className="link_category">

                <p className="category_text">Boots</p>
              </Link>
              <Link to={"/categories/winter%20coat"} className="link_category">
                <p className="category_text">Winter coat</p>
              </Link>
            </div>

            <div className="mixed">
              <Link to={"/categories/bag"} className="link_category">
                <p className="category_text">Bags</p>
              </Link>
              <Link to={"/categories/cosmetics"} className="link_category">
                <p className="category_text">Cosmetics</p>
              </Link>
            </div>
          </div>

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