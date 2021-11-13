import React, { useState } from "react";
import "./../styles/Registration.css"


const Registration = () => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    let yn = localStorage.getItem('yn');

    console.log("yn = " + yn)

    function handleRegister() {
        var CryptoJS = require("crypto-js");
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(password), 'my-secret-key@123').toString();

        console.log(ciphertext)
        if (firstname != "" && lastname != "" && username != "" && password != "") {
            let sendingData = {
                firstname, lastname, username,
                "password": ciphertext
            }

            fetch(
                '/api/registration',
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
                        console.log(data)
                        if (data["success"] == true) {
                            yn = true;
                            localStorage.setItem('yn', yn)

                        }


                        console.log("13")
                        setFirstname("")
                        setLastname("")
                        setUsername("")
                        setPassword("")
                        if (data) {
                            alert("You are registered successfully")
                            setTimeout(
                                () => {

                                    window.location.reload()
                                }, 3000
                            )
                        } else {
                            alert("User with that username already exists")
                        }
                    }
                )
        } else {
            alert("All fields must be filled");
            window.location.reload()
        }

    }

    return (
        <div className="registerBlock">

            <div className="block">
                <form>
                    <p style={style}>Registration</p><br />
                    <br />
                    <input
                        placeholder="Your Firstname"
                        type="text"
                        onChange={(e) => setFirstname(e.target.value)}
                        className="inputStyle"
                        value={firstname}
                    />
                    <br />
                    <br />
                    <input
                        name="lastname"
                        type="text"
                        placeholder="Your Lastname"
                        className="inputStyle"
                        onChange={(e) => setLastname(e.target.value)}
                        value={lastname}

                    />
                    <br />
                    <br />
                    <input
                        name="username"
                        type="text"
                        placeholder="Your Username"
                        onChange={(e) => setUsername(e.target.value)}
                        className="inputStyle"
                        value={username}

                    />
                    <br />
                    <br />
                    <input
                        name="password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your Password"
                        className="inputStyle"
                        value={password}

                    />
                    <br />
                    <br />
                    <select name="gender" className="gender">
                        <option value="none" selected disabled>Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <br />

                    <div className="registerbtn">

                        <label className="btnRegister" onClick={handleRegister}>
                            Register
                        </label>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Registration


const style = {
    textAlign: 'center',
    fontSize: 25
}