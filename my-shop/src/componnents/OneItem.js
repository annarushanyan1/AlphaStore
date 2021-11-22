import React, { useState } from "react"
import './../styles/OneItem.css'
import Popup from 'reactjs-popup';
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

import Star from "./../images/star.png"

const OneItem = (props) => {
    let [count, setCount] = useState(1);

    let [shown, setShown] = useState(false);
    let products = JSON.parse(localStorage.getItem("shopProducts"));
    let id = props.match.params.id;
    console.log(id);
    let prd = products.find(
        (item) => {
            if (Number(item['id']) === Number(id)) {
                return true
            }
        }
    )

    function goBackToHome() {
        window.scroll(
            {
                top: 0
            }
        );
        window.history.back();
        // window.scroll
    }


    console.log(prd);
    let name = prd["name"];
    let filterList = [];
    products.map(
        (item) => {
            if (item['name'] == name && item['id'] != id) {
                filterList.push(item)
            }
        }

    )
    console.log(filterList)
    function addtocart(e) {
        let active = localStorage.getItem('user');
        if (active == 1) {
            setShown(true);
        }
        let itemId = id;
        let userId = localStorage.getItem("userId");
        let token = localStorage.getItem("token");
        let sendingData = {
            itemId, userId, token
        }

        let itemCount = count;
        for (let i = 0; i < itemCount; i++) {
            if (active == 0) {
                let countAbove = document.getElementById("labelCount");
                countAbove.value = Number(localStorage.getItem("count")) + 1;

                localStorage.setItem("count", countAbove.value)

                fetch(
                    '/api/addToCart',
                    {
                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(sendingData) // body data type must match "Content-Type" header
                    })
                    .then(
                        res => res.json()
                    )

                // alert("Added")
            }
        }
    }
    return (
        <div className="one-item_main">
            {
                shown ? <PopupError /> : null
            }
            <p onClick={goBackToHome} className="back"> &nbsp;&nbsp; <img className="backImage" src="https://www.pinclipart.com/picdir/big/521-5215772_transparent-left-arrow-png-left-arrow-black-and.png" /></p>
            <br />
            <br />
            <div className="product_part">
                <img className="one-item_main_picture" src={prd["img"]} />

                <div className="description_main">
                    <div className="description">

                        <p className="product_name">{prd["name"]}</p>

                        <div>
                            <img className="star_img" src={Star} alt="star" />
                            <img className="star_img" src={Star} alt="star" />
                            <img className="star_img" src={Star} alt="star" />
                            <img className="star_img" src={Star} alt="star" />
                            <img className="star_img" src={Star} alt="star" />
                        </div>
                        <div className="separate">

                            <p className="product_price"> US{prd["price"]}$</p>
                            <div className="input-group">
                                <input type="button" value="-" readOnly className="button-minus" onClick={() => { if (count == 1) { console.log("minValue") } else { setCount(--count) } }} />
                                <input type="number" min="1" readOnly value={count} className="quantity-field" />
                                <input type="button" value="+" readOnly className="button-plus" onClick={() => { setCount(++count) }} />
                            </div>
                            <button id="btnAddId" onClick={addtocart} className="btnAddf">Add to Cart</button>

                        </div>
                    </div>

                </div>
            </div>
            <div className="similars">
                <p className="text recommended_text">Recommended For You</p>
                <div className="recommend_main">
                    {
                        filterList.map(
                            (item) => {
                                return (

                                    <div className="recomment_block" key={item["id"]}>
                                        <Link to={"/product/" + item['id']}>
                                            <img className="recommend_picture" src={item["img"]} onClick={() => { window.scroll({ top: 0 }) }} />
                                        </Link>

                                        <div className="priceLabel">
                                            <label>Price</label>
                                            <label>{item['price']}$</label>
                                        </div>
                                        {/* <button id="btnAddId" onClick={addtocart} className="btnAdd_from_under">Add to Cart</button> */}

                                    </div>

                                )
                            }
                        )
                    }
                </div>

            </div>
        </div>
    )
}

export default withRouter(OneItem)


const PopupError = () => {
    let active = localStorage.getItem("user");
    if (Number(active) === 1) {
        return (
            <Popup open={true} position="top left">
                {
                    close => (
                        <div className="popUpWindow">

                            <a className="close" onClick={close}>
                                <label className="closingLabel">X</label>
                            </a>

                            <p className="popUpText">You are not logged in,  Please,&nbsp; <a href="http://localhost:3000/login" className="aHref3"> Log In </a></p>


                        </div>
                    )}
            </Popup>
        );
    }
    return null

}
