import React, { useState } from "react";
import './../styles/ContactUs.css'

const ContactUs = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [selected, setSelected] = useState("");

    function goBackToHome(){
        window.scroll({
            top: 0
        });
        window.history.back();

    }

    function handleSend(e) {
        if (name !== "" && email !== "" && message !== "") {
            let sendingObject = {
                name,
                email,
                message,
                subscribed,
                selected
            }

            fetch(
                '/api/contactUs',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sendingObject)
                })
        }
    }
  
    return (
        <div className="formMain">
            <form id="contact_form" accept-charset="UTF-8" class="contact-form">
                <p onClick={goBackToHome} className="back"> &nbsp;&nbsp; <img className="backImage" alt="backImage" src="https://www.pinclipart.com/picdir/big/521-5215772_transparent-left-arrow-png-left-arrow-black-and.png"/></p>
                <br/>
                <br/>

                <p className="title_form_contact">Contact us</p>
                <p className="title_form_contact_text">Write an email to    alfaStore@gmail.com <br />
                    Or give a call +374 11 111 111 (WhatsApp, Viber) GMT+4
                </p>
                <hr class="hr--clear" />

                <div className="form_input_items">
                    <input
                        type="text"
                        name="utf8"
                        className="input_contact_name"
                        placeholder="Full Name"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        class="input_contact_email"
                        id="Form-page-contact-1"
                        name="contact[email]"
                        placeholder="Email"
                        autocorrect="off"
                        autocapitalize="off"
                        onChange={(e) => setEmail(e.target.value)}
                        required


                    />
                    <textarea
                        rows="10"
                        id="Form-page-contact-2"
                        class="input_contact_message"
                        name="contact[body]"
                        placeholder="Message"
                        onChange={(e) => setMessage(e.target.value)}
                        required

                    ></textarea>
                </div>
                <hr class="hr--clear" />

                <p class="optional">Optional:</p>


                <div class="custom-form__block">

                    <input
                        type="checkbox"
                        id="Form-page-contact-5"
                        class="contactFormCheckbox"
                        name="contact[subscribe-to-the-newsletter]"
                        value="Subscribe to the newsletter"
                        onClick={(e) => {
                            if (subscribed === false) {
                                setSubscribed(true)
                            }
                            else {
                                setSubscribed(false)

                            }
                        }
                        }
                    />
                    <p className="optional"> Subscribe to the newsletter </p>

                </div>


                <div className="select_block">
                    <p className="optional">How did you hear about us:</p>


                    <select
                        id="Form-page-contact-6"
                        class="contactFormSelect"
                        name="contact[how-did-you-hear-about-us]"
                        onChange={(e) => setSelected(e.target.value)}
                    >

                        <option value="- Pick an option -">- Pick an option -</option>
                        <option value="Instagram / Facebook">Instagram / Facebook</option>
                        <option value="Web search">Web search</option>
                        <option value="Print Ad">Print Ad</option>
                        <option value="From a friend">From a friend</option>

                    </select>

                </div>

                <div class="form-item">
                    {/* <label onClick={handleSend}>Bla bla bla</label> */}
                    <input
                        type="submit"
                        class="btn_send"
                        value="Send"
                        onClick={handleSend}

                    />

                </div>
            </form>
        </div>

    )
}

export default ContactUs
