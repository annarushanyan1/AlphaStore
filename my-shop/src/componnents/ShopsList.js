import React from "react"
import '../styles/ShopsList.css';


const ShopsList = () => {
    return (

        <div className="mainShop">
            <h2 className="title2   ">Best Shopping Stores</h2>

            <div className="collections">

                    <div><p><a href={'https://ru.shein.com/'}> <img className="shop" src="https://1000logos.net/wp-content/uploads/2020/02/Shein-symbol.jpg" target="_blank" alt="shop"/> </a></p></div>

                    {/* <div><p><a href={'http://www.zara.com/'}> <img className="shop" src="https://businesslinkpl.com/wp-content/uploads/2018/10/ZARA-LOGO.png" target="_blank" alt="shop"/> </a></p></div> */}

                    <div><p><a href={'https://www.pullandbear.com/'}> <img className="shop" src="https://im0-tub-ru.yandex.net/i?id=f1e8719a085cb90d1b2ba1af17f72d24-l&n=13" target="_blank" alt="shop"/> </a></p></div>
                    <div><p><a href={'https://www.stradivarius.com/'}> <img className="shop" src="https://im0-tub-ru.yandex.net/i?id=b93cb0a92f17d79372074893bd034033-l&n=13" target="_blank" alt="shop"/> </a></p></div>

            </div>


        </div>

    )
}

export default ShopsList