import React, { useEffect, useState } from "react"
import { withRouter } from "react-router";
import '../styles/ProductsFromCategories.css'
import Menu from "./Menu";
import { Link } from "react-router-dom";



const ProductsFromCategories = (props) => {
    let [products, setPorducts] = useState([])
    let name = props.match.params.name;

    useEffect(
        () => {
            fetching()
        }, [name]
    )

    function addtocart(e) {

        let active = localStorage.getItem('user');
        if (Number(active) === 1) {
            this.setState({ shown: true })
            return
        }
        
        let itemId = e.target.parentElement.getAttribute("id");
        let userId = localStorage.getItem("userId");
        let token = localStorage.getItem("token");

        let sendingData = {
            itemId, userId, token
        }
        if (Number(active) === 0) {
            let labelCount = document.getElementById("labelCount");
            labelCount.value++;
            localStorage.setItem("count",labelCount.value)

            fetch(
                '/api/addToCart',
                {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sendingData) // body data type must match "Content-Type" header
                })
                
            // alert("Added")
        }
    }
    function goBackToHome() {
        window.open('/','_self');
        window.scroll({
            top: 0
        });
    }

    // Run! Like go get some data from an API.
    function fetching() {
        console.log(61,name)
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
                                        <img className="catg_img" src={item['img']}
                                      alt="category"
                                      onClick={()=>{
                                            window.scroll(
                                                {
                                                    top:0
                                                }
                                            )
                                        }}
                                        
                                        />
                                    </Link>
                                    <div className="priceLabel">
                                        <label>{item['name']}</label>
                                    </div>
                                    <div className="priceLabel">
                                        <label>Price</label>
                                        <label>{item['price']}$</label>
                                    </div>
                                    <button id="btnAddId" onClick={addtocart} className="btnAdd btnAddCat">Add to Cart</button>

                                </div>
                            )
                        }
                    )
                }</div>

        </div>
    )

}

export default withRouter(ProductsFromCategories)