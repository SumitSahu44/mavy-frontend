"use client";
import { useEffect, useState } from 'react';
import { useGSAP } from "@gsap/react";
import { FiShoppingCart } from "react-icons/fi"; // Import cart icon
import { gsap, Power3, Circ, Expo } from 'gsap';
import { RiMenu3Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import Slider from 'react-slick';
import { ThreeDots } from 'react-loader-spinner';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Success.css';
import '../Home/home.css'

const PaymentSuccess = () => {

    const [waitingTime, setwaitingTime] = useState(8)
    const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
    const [isValid, setIsValid] = useState(false);
    const [sessionData, setSessionData] = useState(null);

    var cartLength;
    
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartLength = cartItems.length;
 

    useGSAP(() => {
        let menu = document.querySelector("#nav i");
        let close = document.querySelector("#full i");

        let first = gsap.timeline()

        first.to("#full", {
            right: 0,
            duration: 0.5
        })

        first.from("#full h4", {
            x: 150,
            duration: 0.6,
            stagger: 0.2,
            opacity: 0
        })

        first.from("#full i", {
            opacity: 0
        })


        first.pause()


        menu.addEventListener("click", function () {
            first.play()
        })

        close.addEventListener("click", function () {
            first.reverse()
        })
    })




    useEffect(() => {
        const checkPaymentStatus = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const sessionId = queryParams.get("session_id");

            console.log("Session ID inside checkPaymentStatus:", sessionId);

            if (!sessionId) {
                console.error("Session ID is missing. Redirecting...");
                return; // Prevent further execution if session_id is missing
            }

            try {
                // ✅ Validate Payment Session
                const response = await fetch(`http://localhost:4000/user/checkout?session_id=${sessionId}`);
                const data = await response.json();

                if (data.success) {
                    setIsValid(true);

                    // ✅ Fetch session data separately AFTER validation
                    fetch("http://localhost:4000/user/get-product-session", { credentials: "include" })
                        .then((res) => res.json())
                        .then((data) => setSessionData(data))
                        .catch((err) => console.error("Error fetching session data:", err));
                } else {
                    console.error("Invalid payment session.");
                }
            } catch (error) {
                console.error("Session validation error:", error);
            }
        };

        checkPaymentStatus();
    }, []);

    // ✅ Send data to PHP API only when sessionData updates
    useEffect(() => {
        if (sessionData) {
            console.log("Fetched Session Data:", sessionData);

            const formattedData = {
                userEmail: sessionData.userEmail,
                productData: sessionData.productData.map((item) => ({
                    name: item.price_data.product_data.name,
                    unit_price: item.price_data.unit_amount,
                    quantity: item.quantity
                }))
            };

            // ✅ Send to PHP API
            fetch("http://mavyscrubs.com/phpMail.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData)
            })
                .then((response) => response.json())
                .then((result) => console.log("Email Sent Successfully:", result))
                .catch((error) => console.error("Error Sending Email:", error));

            // ✅ Clear localStorage after successful API call
            localStorage.removeItem("cart");
            console.log("Cart cleared from localStorage.");
        }
    }, [sessionData]); // <-- Runs when sessionData updates

     
    return (

  
        <div>
           
                          <header>
                                <div className="navbar">
                                    <div id="nav">
                                        <img src="/img/qt=q_95.jpeg" alt="" />
                                        <div>
                                            
                                            <a href="/cart" style={{ position: "relative", textDecoration: "none", color: "white" }}>
                                                <FiShoppingCart size={25} style={{ margin: "5px 10px" }} />
                                                <sup style={{position:"absolute",}}>{cartLength?cartLength:''}</sup>
                                            </a>
                                            <i style={{marginLeft:"20px"}} ><RiMenu3Fill /></i>
                                         </div>
                                       </div>
                                    <div id="full">
                                        <a href="#"><h4>Home</h4></a>
                                        <a href="/about"><h4>About</h4></a>
                                        <a href="/product"><h4>Products</h4></a>
                                        <a href="/cart"><h4>Cart</h4></a>
                                        {/* <a href="/login"><h4>Profile</h4></a> */}
                                        <i><IoMdClose /></i>
                                    </div>
                                </div>
                            </header>

                            {
                                isValid ?   <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-md-5">
                                        <div className="message-box _success">
                                            <i className="fa fa-check-circle" aria-hidden="true"></i>
                                            <h2> Your payment was successful </h2>
                                            <p style={{"text-align":"justify"}}>Thank you for choosing Mavy Scrubs! Each piece is handmade with care in Ghana using authentic kente fabric. Please allow 30-45 business days for delivery due to the handmade process and international shipping.
                
                                             
                                            </p>
                                            <br />              
                                                <p style={{"text-align":"justify"}}> 
                                                We appreciate your patience and support!
                                                 Mavy Scrubs Team</p>
                
                                              <br />
                                             <h4 className='redirect'><a href="/">Back to MavyScrubs</a></h4>  
                                        </div>
                                    </div>
                                </div>
                                {/* <hr /> */}
                           </div> : <>
                                  {/* {window.location.href='/'} */}
                            </>
                            }

     {/* <IoCheckmarkDoneCircle className='success-icon' /> */}
          
        </div>
    );
};

export default PaymentSuccess;
