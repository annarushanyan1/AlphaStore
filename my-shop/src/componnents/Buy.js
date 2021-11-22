import React from "react";

const Buy = () => {
    function goBackToHome() {
        window.history.back();
        window.scroll({
            top: 0
        });
    }
    return (
        <div className="thankYou_main">
            <p onClick={goBackToHome} className="back"> &nbsp;&nbsp; <img className="backImage" src="https://www.pinclipart.com/picdir/big/521-5215772_transparent-left-arrow-png-left-arrow-black-and.png" alt="backImage" /></p>           
            <div className="thankYou_block">
                <p className="thankYou_text">Thank you!</p>
                <p className="thankYou_text">Your order was completed successfully</p>
            </div>
        </div>
    )
}

export default Buy