import axios from "axios";
import React from "react";

const Footer = () => {
    const updateWines = () => {
        const getWines = async () => {
            try {
                const response = await axios.get('/getwines');
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }
        getWines()
        window.location.reload();
    }
    return (
        <div className="footer">
            <a href="http://www.sylvesterrovine.com"><img src="http://images.squarespace-cdn.com/content/v1/57573cac59827e8954e6acf9/1466729378387-AAPKYK0OANIG2L51J1KK/dark_logo_white_background.jpg?format=1500w" alt="Sylvester/Rovine Logo" /></a>
        </div >
    )
}

export default Footer