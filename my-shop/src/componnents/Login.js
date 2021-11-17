import React from 'react';
import './../styles/Login.css';
import { Component } from 'react';

var CryptoJS = require("crypto-js");

export default class Login extends Component {

    constructor(promps) {
        super(promps)
        this.state = {
            username: "",
            password: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    check() {
        if (this.state.username == "" || this.state.password == "") {
            alert("All the fields must be filled")
            return false
        }
        return true
    }

    async handleSubmit() {
        if (!this.check()) {
            return "Please fill all fields"
        }
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(this.state.password), 'my-secret-key@123').toString();
        let sendingdata = {
            'username': this.state.username,
            'password': ciphertext
        }
        fetch(
            '/api/login',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendingdata) // body data type must match "Content-Type" header
            })

            .then(
                res => res.json()

            )
            .then(
                data => {
                    localStorage.setItem("user", 1);
                    if (data['isUser'] == 0) {
                        console.log("isUser ..." + data["isUser"]);
                        localStorage.setItem('user', "0");
                        localStorage.setItem('userId', data['userId']);
                        localStorage.setItem('token', data['token']);
                        localStorage.setItem('fullname', data['fullname']);

                        localStorage.setItem("count", JSON.parse(JSON.parse(data["products"])).length)
                        // console.lastname(data["products"])
                        // productsCount
                        window.location = "/";

                    } 
                    
                    // else {
                    //     localStorage.setItem("error", 404);
                    //     window.location = "/"
                    // }


                }

            )
            .catch(
                err => console.log(err)
            )

        window.open("http://localhost:3000/account");

    }

    render() {

        let get = localStorage.getItem("user")

        // if (get == 0) {
        //     return (
        //         <Logout />
        //     )
        // } else {
        return (

            <div className="loginBlock">

                <div className="block">
                    <div className="log_block">
                    <form>
                        <p style={style}>Hello My Friend</p><br />
                        <input
                            name="username"
                            type="text"
                            placeholder="Your Username"
                            onChange={(e) => this.setState({ 'username': e.target.value })}
                            className="inputStyleLogin"
                            required="required"

                        />
                        <br />
                        <br />


                        <input
                            name="password"
                            type="password"
                            onChange={(e) => this.setState({ 'password': e.target.value })}
                            placeholder="Your Password"
                            className="inputStyleLogin"
                            required="required"
                        />
                        <br />
                        <br />

                        <button
                            label="Log In" className="LoginBtn" onClick={this.handleSubmit}
                        >

                            <a className="aHref2">Log In</a>


                        </button>
                        <br />
                        <div className="signupBlock">
                            <p>Don't have an account? <a href="http://localhost:3000/registration" className="aHref">Sign Up</a></p>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        );
    }
}




const style = {
    margin: 15,
    textAlign: 'center',
    fontSize: 25
};
