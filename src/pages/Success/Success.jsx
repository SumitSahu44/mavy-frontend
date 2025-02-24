"use client";
import { useEffect, useState } from 'react';
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import './Success.css';
const PaymentSuccess = () => {

    const [waitingTime, setwaitingTime] = useState(8)
    const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
    const [isValid, setIsValid] = useState(false);
    useEffect(() => {
        const checkPaymentStatus = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const sessionId = queryParams.get('session_id');
         
            console.log(sessionId)
            if(!sessionId)
            {
                window.location.href = './'
            }
              try {
                    const response = await fetch(`https://mavy-pxtx.onrender.com/user/checkout?session_id=${sessionId}`);
                    const data = await response.json();
    
                   
                    console.log(data)
                    if (data.success) {
                        setIsValid(true);

                        const mailResponse = await fetch('https://mavy-pxtx.onrender.com/user/checkout', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            //    'Authorization': `Bearer ${authToken}`, // Attach token in the Authorization header
                              },  
                            credentials: 'include', // Include cookies
                            body: JSON.stringify({
                                email, // Send the email from input
                             
                            })
                        });

                        if(mailResponse)
                        {
                            localStorage.removeItem("cart");
                            localStorage.clear();
                            
                             console.log("Cart cleared from localStorage.");
                        }

                        

                      

                    } 
                    else {
                       window.location.href="./"
                    }
                } catch (error) {
                    console.error("Session validation error:", error);
                    navigate("/"); // Redirect on any error
                }
                      
    
                  
        };

        checkPaymentStatus();
    }, []);


       {
        setTimeout(() => {
            window.location.href="/product"
         }, 8000);
      } 

       {
        setInterval(()=>{
            setwaitingTime(waitingTime - 1)
        },1000)
      }

    return (

  
        <div>
     {/* <IoCheckmarkDoneCircle className='success-icon' /> */}
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="message-box _success">
                            <i className="fa fa-check-circle" aria-hidden="true"></i>
                            <h2> Your payment was successful </h2>
                            <p>Thank you for choosing Mavy Scrubs! Each piece is handmade with care in Ghana using authentic kente fabric. Please allow 30-45 business days for delivery due to the handmade process and international shipping.

                                <br />
                                We appreciate your patience and support!
                                <br />

                                Mavy Scrubs Team
                            </p>
                                <br />
                             <small>Don't Refres page or Click back button</small>
                             <br />
                             <h4 className='redirect'>We Redirect you to Home page {waitingTime} secound</h4>  
                        </div>
                    </div>
                </div>
                {/* <hr /> */}
           </div>
        </div>
    );
};

export default PaymentSuccess;
