import React, { useEffect, useState } from "react";
import './../styles/Dash.css'
import './../styles/Dashboard.css'
import EmptyCart from './../images/emptyCart.png'
import NoUserImage from './../images/NoUser.png'
const Dash = () => {
    const [products, setPrd] = useState([]);
    const [filtered, setFitered] = useState([]);
    const [totalAmount, setTotalAmount] = useState();

    let prdForUsing = [];

    const [isEmpty, setEmpty] = useState(false);

    const fetchData = async () => {

        let userId = localStorage.getItem("userId");
        if (userId == undefined || userId == null) {
            return
        }
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
            let filteredList = json["filteredList"];
            prdForUsing = filtered;
            if (prd.length == 0) {
                setEmpty(true)
            }
            let amount = 0;
            prd.map(
                (item) => {
                    amount += Number(item["price"])
                }
            )

            setTotalAmount(amount)
            console.log(totalAmount)
            setPrd(prd);
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
        console.log(id)
        let labelCount = document.getElementById("setCount" + id);
        let countAbove = document.getElementById("labelCount");

        let value = labelCount.innerHTML;

        let newCount = value - 1;

        if (Number(value) == 1) {
            let elem = document.getElementById("product" + id);
            elem.style.display = "none";

            localStorage.setItem("count", products.length - 1);

        } else {
            labelCount.innerHTML = newCount;

        }
        console.log(93, products.length)

        countAbove.value = products.length - 1;
        localStorage.setItem("count", products.length - 1)

        if (products.length == 1) {
            setEmpty(true)
        }
        console.log(products);

        for (let i = 0; i < products.length; i++) {
            if (Number(products[i]["id"]) === Number(id)) {
                products.splice(i, 1);
                break;
            }
        }
        let sendingData = {
            userId: localStorage.getItem('userId'),
            token: localStorage.getItem('token'),
            products: JSON.stringify(products)
        }
        fetchUpdate(sendingData)
    }

    const fetchUpdate = (data) => {
        fetch(
            '/api/update',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            }
        )
    }

    // memoizedCallback()
    let key = 0;
    let status = Number(localStorage.getItem("user"));
    return (
        status === 0 ? (

            <div className="Dash_main">
                <p className="clientName">Client: {localStorage.getItem("fullname")}</p>
                <p className="clientName">Shopping Cart</p>
                <div className="prdList">
                    {
                        isEmpty == true ? (
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
                                            <img className="image_cart"src={item["img"]} alt={item["name"]} />
                                            <div className="labelCount">
                                                <label>Quantity</label>
                                                <label className="colorCount" id={"setCount" + item["id"]}>{GiveCount(item["id"])}</label>
                                            </div>
                                            <div className="labelCount">
                                                <label>Price</label>
                                                <label className="colorPrice">{item['price']}$</label>
                                            </div>


                                            <br />
                                            <div className="_buttons">
                                                <button className="btnR" onClick={() => { Delete(item["id"]) }}>
                                                    Delete</button>

                                                <button className="btnR">
                                                    Buy
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                            )
                    }


                </div>
                {
                    products.length != 0 ? (
                        <div className="totalAmount_block">
                            <p className="text_total">Total Amount:</p>
                            <label>{totalAmount}$</label>
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