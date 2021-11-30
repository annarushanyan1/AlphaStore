import React from "react";
import '../styles/AboutUs.css'

const AboutUs = () => {
    function goBackToHome() {
        window.history.back();
        window.scroll({
            top: 0
        });
    }
    function fetching(){

    
    fetch(
        '/api/justarushanian'
    )
        .then(
            res => res.json()
        )
        .then(
            data => {
                console.log(data)
            }
        )
    }
    return (
        <div className="about_us_main_block">
            <p onClick={goBackToHome} className="back"> &nbsp;&nbsp; <img className="backImage" src="https://www.pinclipart.com/picdir/big/521-5215772_transparent-left-arrow-png-left-arrow-black-and.png" alt="backImage" /></p>
          <button onClick={fetching}>fetchingggggggggg</button>
            <div className="about_us_inner_block">
                <br /><br />
                <h2 className="about_us_title">About Us</h2>
                <p className="text_about_us">
                    <b>AlfaStore</b> restores ancient Armenian cultural values, while creating new ones. We aim to spread the word about the rich Armenian culture to the Armenian youth and to people around the world in general. Founded by Sirusho, she pays detailed attention to every piece produced, from designing her own samples to giving a modern touch and breath to the ornaments used centuries ago. Conducting a lot of research and working with the best handicraftsmen of Armenia, we  try to help Armenians to adhere to their roots and meanwhile be trendy and original.
                    <br />
                    <br />
                    We are proud of our roots and our rich culture so rise and let the world know about it…
                    <br />
                    <br />
                    All <b>AlfaStore</b> pieces are a result of a thorough research of historical Armenian jewelry, in order to interpret the symbols, patterns and ornaments true to the original designs. Once familiar with the origin and meaning of a piece, a draft design is drawn by hand in several variations.
                    <br />
                    <br />
                    As modern fashion trends are crucial to <b>AlfaStore</b>'s values, we choose a sketch, which best meets the criteria of combining both, historical background, as well as, modern trends. The first sample of the jewelry is then made based on the agreed design. The main steps of making the pieces include soldering, hammering, ornament crafting, polishing, choosing the size and colors of the stones, clipping of the stones and testing the jewelry. All the steps are carried out by hand.
                    <br />
                    <br />
                    The final look of the piece is usually agreed on when 2 to 3 samples are produced. Some pieces require more samples before a final design is chosen. Furthermore, each component also passes a quality control. Overall each <b>AlfaStore</b> piece takes about one month.
                    <br />
                    <br />
                    The final step of the production is the naming of the pieces, for which, the team comes together to choose the best possible name based on the ornaments and the design characteristics of the piece. Each step of jewelry making at <b>AlfaStore</b> is filled with love, passion and a notion of giving new breath to the cultural heritage of humanity.
                </p>
            </div>
        </div>

    )

}

export default AboutUs