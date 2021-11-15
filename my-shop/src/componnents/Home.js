
import React, { Component, useEffect, useState } from "react"

import ShopsList from "./ShopsList"
import '../styles/Home.css';
import '../styles/Products.css'
import logoA from './../images/logoA.png'
import EmptyHeart from './../images/heartEmp.png'
import Popup from 'reactjs-popup';


import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import Menu from "./Menu";
import { Link } from "react-router-dom";

// let addId = document.getElementById("btnAddId");
// let open = true;
const PopupError = () => {
    let active = localStorage.getItem("user");
    if (active == 1) {
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

const PopupItem = (props) => {
    let [img, setImg] = useState("");
    useEffect(() => {
        let prd = JSON.parse(localStorage.getItem("shopProducts"));
        console.log(prd)

        for (let i = 0; i < prd.length; i++) {
            if (prd[i]['id'] == props.id) {
                setImg(prd[i]['img'])
                console.log(img)

                break
            }

        }

    }, []);

    let active = localStorage.getItem("user");

    if (active == 0) {
        return (
            <Popup open={true} position="">
                {
                    close => (
                        <div className="popUpWindowItem">
                            <a href="http://localhost:3000/account">
                                <img className="imageH" src={img} alt="image" />
                            </a>
                            <p className="textAdded">Added</p>
                        </div>
                    )
                }
            </Popup>
        );
    }
    return null

}

export default class Home extends Component {
    state = {
        shown: false,
        id: 1,
        shown2: false,
        inputText: ""
    }
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            allProducts:[]
        }
        this.shown = true;
        this.ref = React.createRef()
        this.handleOnSearch = this.handleOnSearch.bind(this)
        this.handleOnSelect = this.handleOnSelect.bind(this)
        this.handleEnter = this.handleEnter.bind(this)
        this.addtocart = this.addtocart.bind(this)

        this.state.products = JSON.parse(localStorage.getItem("shopProducts"))
        this.state.allProducts =  this.state.products;
        this.state.products = this.state.products.slice(0,9)
        this.shownItems = [];
        this.givingPrices();
        // let prd = this.fetching();
        // this.state.products = prd
    }
    
    query = '';
    InputRef = React.createRef();


    // this.state.products

    filterPosts = (items) => {
        return items;
    };

    handleOnSearch = (string, results) => {

        this.query = string;
        this.setState({ inputText: string });

        console.log(this.InputRef)
        console.log(string, results)
    }

    // handleOnHover = (result) => {
    //     // the item hovered

    //     console.log(result);
    // }

    handleOnSelect = (item) => {
        this.shown = false;
        this.query = '';
        this.shownItems = [];
        let name = item['name'];

        this.state.allProducts.map(
            item => {
                if (item['name'] === name) {
                    this.shownItems.push(item)
                }
            }
        )
        console.log(this.state.inputText)
        // this.shownItems.push(item);
        setTimeout(() => {
            this.forceUpdate()
        }, 500);

        console.log(item)
    }
    handleEnter(event) {
        if (event.key === 'Enter') {
            console.log('enter');
            let obj = {
                name: this.state.inputText
            }
            this.handleOnSelect(obj)
        }
    }

    handleOnFocus = () => {
        window.scroll({
            top: 700,
            behavior: 'smooth'
          });

        console.log(this.query)
        if (!this.query) {
            this.shownItems = this.state.products;
            setTimeout(() => {
                this.forceUpdate()
            }, 1000);

        }
        console.log('Focused')
    }
    label() {
        let elem = document.getElementById('labelCount');
        elem.innerHTML += 1;
    }
    // formatResult = (item) => {
    //     return item;
    //     // return <div dangerouslySetInnerHTML={{__html: "<p>Your html code here.<p>"}} />;
    //     // return (<p dangerouslySetInnerHTML={{__html: '<strong>'+item+'</strong>'}}></p>); //To format result as html
    // }
    givingPrices() {
        let prices = [14, 10, 3, 22, 5, 25, 17, 16];
        for (let i = 0; i < this.state.products.length; i++) {
            let id = this.state.products[i]["id"];
            let index = id - 1;
            this.state.products[i]["price"] = prices[index]
            // .push(prices[index])
        }
        console.log(this.idsWithCount)
    }


    //_____________________________________
    addtocart(e) {
        let active = localStorage.getItem('user');
        if (active == 1) {
            this.setState({ shown: true })
            return
        }
        let itemId = e.target.parentElement.getAttribute("id");
        let userId = localStorage.getItem("userId");
        let token = localStorage.getItem("token");
        let sendingData = {
            itemId, userId, token
        }
        if (active == 0) {
            this.setState({ id: Number(itemId) });
            this.setState({ shown2: true })
            setTimeout(
                () => {
                    this.setState({ shown2: false })

                }, 1500
            )


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
    // HistoryPushState(id){
    // window.history.pushState({"id":id},'productId');
    // console.log(window.history)
    // // window.open("http://localhost:3000/product","_self")
    // }
    render() {
        let keys = new Map();
        this.state.allProducts.map(
            item => {
                keys.set(item["name"], item)
            }
        )
        let usingDate = Array.from(keys, ([name, value]) => (value));
        console.log("usingData: ", usingDate)

        if (this.shownItems == [] || this.shownItems == '') {
            this.shownItems = this.state.products;
        }

        if (1 == 0) {

        } else {


            return (
                <div className="home_main_div">
                    {this.state.shown2 ? <PopupItem id={this.state.id} /> : null}
                   <Menu/>
                    <div className="logoA_div">
                        <img className="logoA" src={logoA} />
                    </div>

                  

                    <div className="search searchFromAbove"
                        ref={this.InputRef}
                        onKeyPress={this.handleEnter}
                    >

                        <div>
                            <ReactSearchAutocomplete
                                items={usingDate}
                                onSearch={this.handleOnSearch}
                                onSelect={this.handleOnSelect}
                                onFocus={this.handleOnFocus}
                                // autoFocus
                                styling={
                                    {
                                        width: "400px",
                                    }
                                }
                            />
                        </div>
                    </div>


                    {
                        this.state.shown ? <PopupError /> : null
                    }
                    <div className="mainH"
                    >
                        {

                            this.shownItems.map(
                                (item) => {
                                    return (
                                        <div name={item['name']} className="productH" id={item['id']} key={item['id']}>
                                           <Link to={"/product/" + item['id']}>
                                            <img className="imageH"
                                                src={item['img']}
                                                alt="bag"
                                                onClick={() => {
                                                    window.scroll(
                                                        {
                                                            top:0
                                                        }
                                                    )
                                                }}
                                            />
                                            </Link>
                                            {/* <img className="heart" src={EmptyHeart}/> */}
                                            <br />
                                            <div className="priceLabel">
                                                <label>Name</label>
                                                <label>{item['name']}</label>
                                            </div>
                                            <div className="priceLabel">
                                                <label>Price</label>
                                                <label>{item['price']}$</label>
                                            </div>
                                            <button id="btnAddId" onClick={this.addtocart} className="btnAdd">Add to Cart</button>

                                        </div>
                                    )
                                }
                            )

                        }
                    </div>
                </div>

            )
        }
    }

}


