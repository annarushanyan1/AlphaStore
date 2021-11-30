import React from 'react';
import '../styles/Login.css';
import { Component } from 'react';


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

    handleSubmit() {
        console.log("startin checkin")
        if (!this.check()) {
            return "Please fill all fields"
        }

        let sendingdata = {
            'username': this.state.username,
            'password': this.state.password
        }
        fetch(
            '/api/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendingdata)
            })
            .then(
                res => res.json()
            )
            .then(
                data => {
                    console.log(51, data)
                    localStorage.setItem("user", 1);
                    if (data['isUser'] == 0) {
                        console.log("isUser ..." + data["isUser"]);
                        localStorage.setItem('user', "0");
                        localStorage.setItem('userId', data['userId']);
                        localStorage.setItem('token', data['token']);
                        localStorage.setItem('fullname', data['fullname']);
                        localStorage.setItem("count", data['productsCount'])

                        window.open("http://localhost:3000/account");
                        window.open("http://localhost:3000/", "_self");

                    }


                }

            )
            .catch(
                err => console.log(err)
            )



    }

    render() {

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

                            <p onClick={this.handleSubmit} className="sign_in_Button"> Sign In</p>
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
