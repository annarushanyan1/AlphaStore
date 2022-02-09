import React, { useEffect, useState } from "react";
import '../styles/Dash.css'
import '../styles/Dashboard.css'
import EmptyCart from '../images/emptyCart.png'
import NoUserImage from '../images/NoUser.png'
import { Link } from "react-router-dom";
import LoadingImage from '../images/loading-buffer.gif'

const Dash = () => {
    const [products, setProducts] = useState([]);
    const [filtered, setFitered] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [checkArray, setCheckArray] = useState(new Set());
    const [loading, setLoading] = useState(false)
    const [isEmpty, setEmpty] = useState(false);

    const fetchData = async () => {
        let userId = localStorage.getItem("userId");
        if (userId === undefined || userId === null) {
            return
        }
        let token = localStorage.getItem("token");
        let sendingdata = {
            userId, token
        }

        try {
            const response = await fetch("/api/productsById", {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendingdata) 
            });
            const json = await response.json();
            let prd = JSON.parse(json["products"]);
            let filteredList = json["filteredList"];

            if (prd.length === 0) {
                setEmpty(true)
            } else {
                setEmpty(false)
            }
            setProducts(prd);
            setFitered(filteredList);

        } catch (error) {
            console.log("error", error);
        }
    };
    useEffect(
        () => {
            fetchData()
        }, []
    )

    const GiveCount = (id) => {
        let c;
        filtered.map(
            (item) => {
                if (Number(item["id"]) === Number(id)) {
                    c = item["count"];
                }
            }
        )
        return c
    }
    function goBackToHome() {
        window.scroll({
            top: 0
        });
        window.open('/login', "_self")

    }

    const Delete = (id) => {
        let countAbove = document.getElementById("labelCount");
        let labelCount = document.getElementById("setCount_" + id);

        let elem = document.getElementById("product" + id);

        if (products.length === 1) {
            setEmpty(true)
        }




        let value = labelCount.innerHTML;

        let newCount = Number(value) - 1;

        if (Number(value) === 1) {
            elem.style.display = "none";
            localStorage.setItem("count", products.length - 1);

        } else {
            let quantity_input = document.getElementById("quantity_input" + id);
            labelCount.innerHTML = newCount;
            quantity_input.value = newCount;
        }

        countAbove.value = products.length - 1;
        localStorage.setItem("count", products.length - 1)

        let prd = products;
        for (let i = 0; i < prd.length; i++) {
            if (Number(prd[i]["id"]) === Number(id)) {
                prd.splice(i, 1);
                break;
            }
        }
        setProducts(prd)
        let sendingData = {
            userId: localStorage.getItem('userId'),
            token: localStorage.getItem('token'),
            products: JSON.stringify(products)
        }
    
        fetch(
            '/api/update',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendingData) // body data type must match "Content-Type" header
            }
        )
    }


    const fetchBuy = async (itemId) => {
        let userId = localStorage.getItem("userId");
        let sendingData = {
            userId, itemId
        }
        fetch(
            '/api/buyItem',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendingData) // body data type must match "Content-Type" header
            }
        )
    }
    const addtocart = (e) => {

        let itemId = e.target.parentElement.getAttribute("id");
        let userId = localStorage.getItem("userId");
        let token = localStorage.getItem("token");

        let sendingData = {
            itemId, userId, token
        }
        let labelCount = document.getElementById("labelCount");
        let newCount = Number(labelCount.value) + 1;
        let quantityApart = document.getElementById("setCount_" + itemId);

        let quantity_input = document.getElementById("quantity_input" + itemId);


        quantityApart.innerHTML = Number(quantityApart.innerHTML) + 1;
        quantity_input.value = quantityApart.innerHTML;
        labelCount.value = newCount;
        localStorage.setItem("count", newCount);

        fetch(
            '/api/addToCart',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendingData) // body data type must match "Content-Type" header
            })
    }
    const buyByCheckBox = () => {
         setLoading(true);
        let arr = Array.from(checkArray);
        if (arr.length === 0) {
            alert("Nothing is selected");
            return
        }
  
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < filtered.length; j++) {
                if (Number(filtered[j]["id"]) === Number(arr[i])) {
                    arr[i] = [];
                    arr[i].push(filtered[j]["id"], filtered[j]["count"])
                }
            }
        }

        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < Number(arr[i][1]); j++) {
                setTimeout(
                    ()=>{
                const myPromise = new Promise((resolve, reject) => {

                            Delete(Number(arr[i][0]))
                })
                myPromise.then(
                    (res) => {
                        fetchBuy(Number(arr[i][0]));
                        
                    }
                )
            },i*100
            )

            }
        }
        setTimeout(
            () => {
                setLoading(false);
                window.open('/buy', '_self');
            },1000

        )

    }

    const onChangeCheckBox = (e) => {
        let set = checkArray;
        let itemId = Number(e.target.value);
        if (e.target.checked) {
            set.add(itemId);
        } else {
            set.delete(itemId);
        }
        setCheckArray(set);
    }

    const SetTotalF = (e) => {
        let arrayfromSet = Array.from(checkArray);
        let amount = 0;
        for (let i = 0; i < arrayfromSet.length; i++) {//id
            let itm = filtered.find(
                (item) => {
                    if (Number(item["id"]) === Number(arrayfromSet[i])) {
                        return item
                    }
                }
            )

            let price = itm['price'];
            for (let j = 0; j < Number(GiveCount(arrayfromSet[i])); j++) {//count
                amount += price;

            }
        }
        setTotalAmount(amount)

    }

    let key = 0;

    let status = Number(localStorage.getItem("user"));
    return (
        status === 0 ? (
            <div className="Dash_main">
                {
                    loading ? (<div>
                        <img className="loadingImage" src={LoadingImage} alt="loading" />
                    </div>
                    ) : null
                }
                <p className="clientName">Client: {localStorage.getItem("fullname")}</p>
                {
                    isEmpty === false ? (
                        <p className="clientName">Shopping Cart</p>
                    ) : null
                }

                <div className="prdList">
                    {
                        isEmpty === true ? (
                            <div>
                                <img className="emptytext_image" src={EmptyCart} alt="emptyCartImgae" />
                                <p className="emptytext">Your shopping Cart is empty</p>
                            </div>
                        )
                            :
                            filtered.map(
                                (item) => {
                                    return (
                                        <div className="product" key={key++} id={"product" + item["id"]}>
                                            <input className="dash_checkbox" id={"dash_checkbox_" + item["id"]} type="checkbox" value={item["id"]}
                                                onChange={
                                                    (e) => {
                                                        onChangeCheckBox(e)
                                                        SetTotalF(e)
                                                    }} />
                                            <Link to={"/product/" + item['id']}>
                                                <img className="image_cart" src={item["img"]} alt={item["name"]} />
                                            </Link>
                                            <div className="labelCount">
                                                <label>Quantity</label>

                                                <label className="colorCount" id={"setCount_" + item["id"]}>{GiveCount(item["id"])}</label>
                                            </div>
                                            <div className="labelCount">
                                                <label>Price</label>
                                                <label className="colorPrice">{item['price']}$</label>
                                            </div>
                                            <br />
                                            <div className="input-group" id={item["id"]}>
                                                <input type="button" value="-" readOnly className="button-minus" onClick={(e) => {
                                                    Delete(item["id"]);
                                                }} />
                                                <input type="number" max="" min="1" readOnly value={GiveCount(item["id"])} className="quantity-field" id={"quantity_input" + item["id"]} />
                                                <input type="button" value="+" readOnly className="button-plus" onClick={(e) => { addtocart(e) }} />
                                            </div>
                                        </div>
                                    )
                                }
                            )
                    }

                </div>
                {
                    products.length !== 0 ? (
                        <div>
                            <div className="totalAmount_block">
                                <p className="text_total">Total Amount:</p>
                                <label>{totalAmount}$</label><br />
                            </div>
                            <button className="bottomButton" onClick={() => buyByCheckBox()}>Buy</button>

                        </div>


                    ) : null
                }
            </div>

        ) : (
            <div className="noUser_block">
                <p onClick={goBackToHome} className="back"> &nbsp;&nbsp; <img className="backImage" src="https://www.pinclipart.com/picdir/big/521-5215772_transparent-left-arrow-png-left-arrow-black-and.png" alt="backImage" /></p>

                <img className="noUser_image" src={NoUserImage} alt="no_user" />
            </div>
        )

    )

}

export default Dash