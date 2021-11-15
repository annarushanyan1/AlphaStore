import React, { Component } from "react";

import './../styles/Dashbroad.css'
import { createUseStyles } from 'react-jss'
import { Link } from "react-router-dom";

let erk = window.innerHeight;

export default class Dashbroad extends Component {

    set = new Set();
    constructor() {
        super()
        this.keyN = 0;
        this.state = {
            counts: []

        };
        this.filteredProducts = [];
        this.idsWithCount = [];
        this.getingProducts = this.getingProducts.bind(this);
        this.filtering = this.filtering.bind(this);
        this.idAndCountFunction = this.idAndCountFunction.bind(this)
        this.givingPrices = this.givingPrices.bind(this);
        this.fetching = this.fetching.bind(this)
        //______________

        if (localStorage.getItem("user") == 0) {
            this.getingProducts()
            this.idAndCountFunction()
            this.filtering()
            this.givingPrices()
        }
    }


    fetching() {
        let prd = JSON.parse(localStorage.getItem("products"));
        delete prd["index"];
        delete prd["price"];
        delete prd["show"];
        prd = JSON.stringify(prd);
        let sendingData = {
            userId: localStorage.getItem('userId'),
            token: localStorage.getItem('token'),
            products: prd
        }
        if (sendingData) {
            fetch(
                '/api/update',
                {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sendingData) // body data type must match "Content-Type" header
                })


        }
    }

    getingProducts() {
        if (localStorage.getItem('products') !== null) {

            if (localStorage.getItem("products") !== '' || localStorage.getItem("products") !== "[]") {
                this.products = JSON.parse(localStorage.getItem("products"));
            } else {
                this.products = [];
            }
            for (let i = 0; i < this.products.length; i++) {
                this.products[i]["index"] = i;
                this.products[i]["show"] = true;
            }

        } else {
            this.setState({ "products": [] })
        }
    }
    setingCounts(id) {
        if (id) {
            this.idAndCountFunction()
            let array = this.idsWithCount;
            for (let i = 0; i < array.length; i++) {
                if (array[i][0] == id) {
                    this.idsWithCount = array;
                    return array[i][1]
                }

            }


        }

    }
    idAndCountFunction() {
        let products = this.products;
        this.idsWithCount = []
        if (!Array.isArray(products)) {
            products = []
        }
        for (let i = 0; i < products.length; i++) {
            this.set.add(products[i]['id'])
        }

        let arrayfromset = Array.from(this.set);

        for (let i = 0; i < arrayfromset.length; i++) {///1
            let array = [arrayfromset[i], 0];
            for (let j = 0; j < products.length; j++) {
                if (products[j]['id'] === array[0]) {
                    array[1] += 1;
                }
            }

            this.idsWithCount.push(array);
        }

        return this.idsWithCount

    }
    filtering() {
        this.filteredProducts = [];
        let products = this.products;

        let array = Array.from(this.set);//iderna filtracvac
        console.log(array)
        for (let i = 0; i < array.length; i++) {
            let id = array[i];

            let count = 0;
            for (let j = 0; j < products.length; j++) {
                if (products[j]['id'] == id) {
                    count = count + 1;
                    if (count == 1) {
                        this.filteredProducts.push(
                            products[j]
                        )

                    }
                }

            }
        }
    }
    isEmpty = true;
    status = localStorage.getItem("user");



    givingPrices() {
        let prices = [14, 10, 3, 22, 5, 25, 17, 16];
        for (let i = 0; i < this.products.length; i++) {
            let id = this.products[i]["id"];
            for (let k = 0; k < this.idsWithCount.length; k++) {
                if (this.idsWithCount[k][0] == id) {
                    this.products[i]["count"] = this.idsWithCount[k][1];
                }
            }
        }
        this.filtering();
    }

    logout() {
        localStorage.removeItem("products");
        localStorage.removeItem("firstname");
        localStorage.removeItem("lastname");
        localStorage.removeItem("userId");
        localStorage.setItem("user", 1);
        window.location.reload()
    }
    deleting(e) {
        //___________
        let labelCount = document.getElementById("labelCount");

        labelCount.value = Number(labelCount.value) - 1;
        //___________

        let id = e.target.parentElement.getAttribute("id");
        let howMuch = e.target.parentElement.getAttribute("count");
        if (howMuch == 1) {
            e.target.parentElement.parentElement.style.display = 'none';

        }

        let isDelete = false;
        let count = 0;
        let items = this.products.filter(item => {
            if (item['id'] == Number(id)) {
                count += 1;
                if (count == 1) {
                    let array = this.idsWithCount;
                    for (let k = 0; k < array.length; k++) {
                        if (array[k][0] == id) {
                            array[k][1] = item['count'];
                            if (item['count'] == 0) {
                                this.forceUpdate()
                            }
                            break
                        }
                    }
                    this.idsWithCount = array;
                    this.setState(
                        {
                            counts: array
                        }
                    )
                    return false;
                }
            }
            return true
        }
        );
        if (isDelete) {
            e.target.parentElement.parentElement.style.display = 'none';
        }


        this.products = items;
        localStorage.setItem("products", JSON.stringify(items))

        let sendingData = {
            userId: localStorage.getItem('userId'),
            products: localStorage.getItem("products")
        }
        this.fetching(sendingData);
    };

    index = 0;
    lhandi = 0;
    render() {
        if (localStorage.getItem("error") == 404) {
            return (
                <div className="Dashbroad">
                    <div className="blockL">
                        <p className="error">No such user</p><br />
                        <p> PLEASE  <a href="login" className="hrefL" onClick={() => { localStorage.removeItem("error") }}>Log In</a> Again</p>
                    </div>
                </div>
            )
        } else if (this.status == 1) {
            return (
                <div className="Dashbroad">
                    <div className="blockL">
                        <p>You are not logged in</p><br />
                        <p> PLEASE  <a href="login" className="hrefL" onClick={() => { localStorage.removeItem("error") }}>Log In</a></p>
                    </div>
                </div>
            )
        } else {
            this.idAndCountFunction()
            this.fetching()
            return (

                <div className="Dashbroad" style={styles.Dashbroad}>
                    <div className="block2">
                        <p>HI! dear &nbsp;&nbsp;
                            {localStorage.getItem("firstname")} {localStorage.getItem("lastname")}</p>
                    </div>
                    <p className="title">Shopping Cart</p>
                    <div className="prdMain">
                        <div className="prdList">
                            <React.Fragment>
                                {
                                    this.filteredProducts.map(
                                        (item) => {
                                            return (

                                                <div>
                                                    <div className="product" key={String(this.index++)} id={item['id']} index={item['index']} count={this.setingCounts(item['id'])}>
                                                        <Link to={"/product/" + item['id']}>
                                                        <img className="image" src={item['img']} alt="bag"
                                                        onClick={() => {
                                                            window.scroll(
                                                                {
                                                                    top:0
                                                                }
                                                            )
                                                        }}
    
                                                        />
                                                        </Link>
                                                        <br />
                                                        <div className="labelCount">

                                                            <label>Price</label>

                                                            <label className="colorPrice">{item['price']}$</label>
                                                        </div>
                                                        <div className="labelCount">
                                                            <label>Quantity</label>
                                                            <label class="colorCount">{this.setingCounts(item['id'])}</label>
                                                        </div>
                                                        <br />
                                                        <button className="btnR" onClick={this.deleting.bind(this)}>

                                                            Delete</button>

                                                    </div>

                                                </div>



                                            )

                                        }
                                    )
                                }
                            </React.Fragment>

                        </div>

                    </div>

                    <div className="amount">
                        <label>Subtotal</label>
                        <label></label>
                    </div>
                    <br />

                </div>
            )
        }
    }
}

const styles = createUseStyles({
    Dashbroad: {
        width: erk
    }
});