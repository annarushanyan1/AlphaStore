
import React, { Component,useEffect, useState } from "react"

import ShopsList from "./ShopsList"
import '../styles/Home.css';
import '../styles/Products.css'


import Popup from 'reactjs-popup';


import { ReactSearchAutocomplete } from 'react-search-autocomplete'

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
    let [img,setImg] = useState("");
    useEffect(() => {
    let prd = JSON.parse(localStorage.getItem("shopProducts"));
    console.log(prd)

        for (let i = 0; i < prd.length; i++) {
            // console.log("innn")
            // console.log(id)
            if(prd[i]['id'] == props.id)
            {
                console.log("aaaaaaaaaaa")
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
                            <p className="text">Added</p>
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
        shown2:false
    }
    constructor(props) {
        super(props)
        this.state = {
            products: []
        }
        console.log(props)
        this.shown = true;
        this.ref = React.createRef()
        this.handleOnSelect = this.handleOnSelect.bind(this)
        this.addtocart = this.addtocart.bind(this)
        this.state.products = JSON.parse(localStorage.getItem("shopProducts"))
        this.shownItems = [];
        this.givingPrices();


    }
    query = '';


    // this.state.products

    filterPosts = (items) => {
        // shownItems = this.state.products;
        return items;
    };

    handleOnSearch = (string, results) => {
        this.query = string;
        // this.forceUpdate()
        // this.filterPosts(string,results);

        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        console.log(string, results)
    }

    // handleOnHover = (result) => {
    //     // the item hovered

    //     console.log(result)
    // }

    handleOnSelect = (item) => {
        this.shown = false;
        this.query = '';
        this.shownItems = [];
        let name = item['name'];

        this.state.products.map(
            item => {
                if (item['name'] === name) {
                    this.shownItems.push(item)
                }
            }
        )
        // this.shownItems.push(item);
        setTimeout(() => {
            this.forceUpdate()
        }, 500);

        console.log(item)
    }

    handleOnFocus = () => {
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


            // alert("You are not logged in")
            // window.location.href = 'login'
        }

        let itemId = e.target.parentElement.getAttribute("id");
        let userId = localStorage.getItem("userId")


        let sendingData = {
            itemId, userId
        }
        if (active == 0) {
            this.setState({ id: Number(itemId) })
            this.setState({ shown2: true })
setTimeout(
    ()=>{
        this.setState({ shown2: false })

    },1500
)


            let labelCount = document.getElementById("labelCount");
            labelCount.value = Number(labelCount.value) + 1;

            fetch('/api/addToCart', {
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
    render() {
        console.log(this.props);
        let keys = new Map();
        this.state.products.map(
            item => {
                keys.set(item["name"], item)
            }
        )
        let usingDate = Array.from(keys, ([name, value]) => (value));


        if (this.shownItems == [] || this.shownItems == '') {
            this.shownItems = this.state.products;
        }

        if (1 == 0) {
        } else {
            let nwobj = [];
            this.state.products.map(
                item => nwobj.push(item["name"])
            )

            return (
                <div>
                    {this.state.shown2 ? <PopupItem id={this.state.id}/> : null}
                    <ShopsList />
                    <p className="text">Product List
                    </p>
                    <div className="search">
                        <ReactSearchAutocomplete
                            //    resultStringKeyName={nwobj}
                            items={usingDate}

                            onSearch={this.handleOnSearch}
                            // onHover={this.handleOnHover}
                            onSelect={this.handleOnSelect}
                            onFocus={this.handleOnFocus}
                        // autoFocus
                        // formatResult={this.formatResult}
                        />
                    </div>
                    {
                        this.state.shown ? <PopupError /> : null
                    }
                    {/* <PopupError /> */}
                    <div className="mainH"
                    >
                        {

                            this.shownItems.map(
                                (item) => {
                                    return (
                                        <div name={item['name']} className="productH" id={item['id']} key={item['id']}><img className="imageH" src={item['img']} alt="bag" />
                                            <br />
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

