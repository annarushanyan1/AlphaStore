
import React, { Component, useEffect, useState } from "react"

import '../styles/Home.css';
import '../styles/Products.css'
import logoA from '../images/logoA.png'
import Popup from 'reactjs-popup';
import NoResultImage from '../images/noResult.gif'

import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import Menu from "./Menu";
import { Link } from "react-router-dom";


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
        console.log(prd);
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
                            <p className="textAdded">Added</p>
                            <a href="http://localhost:3000/account">
                                <img className="imageH" src={img} alt="popup" />
                            </a>

                        </div>
                    )
                }
            </Popup>
        );
    }
    return null

}


export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            products: [],
            allProducts: [],
            noResult: false
        }
        this.ref = React.createRef()
        this.handleOnSearch = this.handleOnSearch.bind(this)
        this.handleOnSelect = this.handleOnSelect.bind(this)
        this.handleEnter = this.handleEnter.bind(this)
        this.addtocart = this.addtocart.bind(this)

        this.state.products = JSON.parse(localStorage.getItem("shopProducts"))
        this.state.allProducts = this.state.products;
        this.state.products = this.state.products.slice(0, 9)
        this.shownItems = [];

    }

    state = {
        shown: false,
        id: 1,
        shown2: false,
        inputText: ""
    }

    shown = true;
    query = '';
    InputRef = React.createRef();


    filterPosts = (items) => {
        return items;
    };

    handleOnSearch = (string, results) => {

        this.query = string;
        this.setState({ inputText: string });


        console.log(string, results)
    }
    handleOnSelect = (item) => {
        this.shown = false;
        this.query = '';
        this.shownItems = [];
        let name = item['name'];



        if (name === '') {

            this.setState({ noResult: false })

            this.state.products.map(
                (item) => {
                    this.shownItems.push(item);
                }
            )

        } else {
            this.state.allProducts.map(
                item => {
                    if (item['name'] === name) {
                        this.shownItems.push(item)
                    }
                }
            )
        }
        console.log(158, this.shownItems[0])
        if (this.shownItems[0] === undefined) {
            console.log(19, this.state.noResult)
            this.setState({ noResult: true })
        }

        this.setState({ inputText: "" });
        console.log(this.state.inputText);

        setTimeout(() => {
            this.forceUpdate()
        }, 500);
        console.log(item)
    }
    handleEnter(event) {
        console.log(this.state.inputText)
        if (this.state.inputText == undefined || this.state.inputText == "") {
            this.setState({ noResult: false })

        }
        if (event.key === 'Enter') {
            console.log('enter');
            let obj = {
                name: this.state.inputText
            }
            this.handleOnSelect(obj)
        }
    }

    handleOnFocus = () => {
        let elem = document.getElementsByClassName("search")[0]
        var rect = elem.getBoundingClientRect();
        if (rect.y < 100) {
            window.scroll({
                top: 770,
                behavior: 'smooth'
            });

        }


        console.log(this.query)
        if (this.query == "") {
            this.setState({ noResult: false })

            this.shownItems = this.state.products;
            setTimeout(() => {
                this.forceUpdate()
            }, 1000);

        }
    }

    //_____________________________________
    addtocart(e) {
        let active = localStorage.getItem('user');

        if (Number(active) === 1) {
            this.setState({ shown: true })
            return
        }

        let itemId = e.target.parentElement.parentElement.getAttribute("id");
        let userId = localStorage.getItem("userId");
        let token = localStorage.getItem("token");


        let sendingData = {
            itemId, userId, token
        }
        if (Number(active) === 0) {
            this.setState({ id: Number(itemId) });
            this.setState({ shown2: true })
            setTimeout(
                () => {
                    this.setState({ shown2: false })
                }, 1500
            )

            let labelCount = document.getElementById("labelCount");
            let newCount = Number(labelCount.value) + 1
            labelCount.value = newCount;
            localStorage.setItem("count", newCount);

            fetch(
                '/api/addToCart',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sendingData)
                })

        }
    }
    render() {
        let keys = new Map();

        this.state.allProducts.map(
            item => {
                keys.set(item["name"], item)
            }
        )
        let usingDate = Array.from(keys, ([name, value]) => (value));
        if (this.shownItems === [] || this.shownItems == '') {
            this.shownItems = this.state.products;
        }
        return (

            <div className="home_main_div">
                {this.state.shown2 ? <PopupItem id={this.state.id} /> : null}
                <Menu />
                <div className="logoA_div">
                    <img className="logoA" src={logoA} />
                </div>
                <hr />
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
                <p className="recommend_you" id="recommend_you"># We recommend you only the best products</p>
                <hr />
                <br />
                <div className="mainH"
                >

                    <div className="mainH_for_flex">
                        {
                            this.state.noResult ? (
                                <div className="noResult">



                                    <img className="noResult_image" src={NoResultImage} />
                                </div>
                            ) :



                                this.shownItems.map(
                                    (item) => {
                                        return (
                                            <div name={item['name']} className="productH" id={item['id']} key={item['id']}>
                                                <div className="aboveImage">
                                                    <Link to={"/product/" + item['id']}>
                                                        <img className="imageH"
                                                            src={item['img']}
                                                            alt="bag"
                                                            onClick={() => {
                                                                window.scroll(
                                                                    {
                                                                        top: 0
                                                                    }
                                                                )
                                                            }}
                                                        />
                                                    </Link>
                                                </div>
                                                <br />
                                                <div className="buttonsOfImage">
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

}

