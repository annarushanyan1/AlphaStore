import React, { useCallback, useEffect, useState } from "react"
import { withRouter } from "react-router";
import './../styles/ProductsFromCategories.css'
import Menu from "./Menu";
import { Link } from "react-router-dom";



const ProductsFromCategories = (props) => {
    let [products, setPorducts] = useState([])
    let name = props.match.params.name;

    let history = [];
    useEffect(
        () => {
            history.push(name)
            fetching()
        }, [name]
    )

    // if(name != history[history.length-1])
    // {

    //             fetching()

    // }

    function addtocart(e) {

        let active = localStorage.getItem('user');
        if (active == 1) {
            this.setState({ shown: true })
        }

        let itemId = e.target.parentElement.getAttribute("id");
        let userId = localStorage.getItem("userId");
        let token = localStorage.getItem("token");
        let sendingData = {
            itemId, userId, token
        }
        if (active == 0) {
           

            let labelCount = document.getElementById("labelCount");
            labelCount.value = Number(labelCount.value) + 1;

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
                .then(
                    data => {
                        console.log(data["sendingAgainToClient"])
                        let now = JSON.parse(localStorage.getItem("products"));

                        console.log(typeof now);
                        let list;

                        if (localStorage.getItem("products")) {
                            list = [];
                            console.log(localStorage.getItem("products"));
                            list = JSON.parse(localStorage.getItem("products"));
                        } else {
                            list = [];
                        }
                        console.log(list)
                        list.push(
                            data["sendingAgainToClient"]
                        )
                        localStorage.setItem('products', JSON.stringify(list))

                    }
                )
            // alert("Added")
        }
    }
    function goBackToHome() {
        window.history.back();
        window.scroll({
            top: 0
        });
    }

    // Run! Like go get some data from an API.
    function fetching() {
        fetch(
            '/api/getProductsByCategory', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        }
        )
            .then(
                res => res.json()
            )
            .then(
                data => {
                    let prd = JSON.parse(data['products']);
                    setPorducts(prd)
                    console.log(prd)
                }
            )
    }
    // fetching()
    console.log(name)
    // fetching()
    console.log(products)
    return (
        <div className='cat'>
            <Menu />
            <p onClick={goBackToHome} className="back"> &nbsp;&nbsp; <img className="backImage" src="https://www.pinclipart.com/picdir/big/521-5215772_transparent-left-arrow-png-left-arrow-black-and.png" /></p>
            <br />
            <br />

            <p className="text">Category:  {name}</p>

            <div className="cat_map">
                {
                    products.map(
                        (item) => {
                            return (
                                <div className="catg_product" key={item['id']} id={item['id']}>
                                    <Link to={"/product/" + item['id']}>
                                        <img className="catg_img" src={item['img']}/>
                                    </Link>
                                    <div className="priceLabel">
                                        {/* <label>Name</label> */}
                                        <label>{item['name']}</label>
                                    </div>
                                    <div className="priceLabel">
                                        <label>Price</label>
                                        <label>{item['price']}$</label>
                                    </div>
                                    <button id="btnAddId" onClick={addtocart} className="btnAdd">Add to Cart</button>

                                </div>
                            )
                        }
                    )
                }</div>

        </div>
    )

}

export default withRouter(ProductsFromCategories)