"use client";
import { useEffect, useState } from 'react';
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import './Failed.css';
const Failed = () => {

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
                    const response = await fetch(`http://localhost:4000/user/checkout?session_id=${sessionId}`);
                    const data = await response.json();
    
                   
                    if (data.success) {
                        setIsValid(true);

                        } else {
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
                   




    <div class="container">
        <div class="row justify-content-center">
                            <div class="col-md-5">
                                <div class="message-box _success _failed">
                                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                                    <h2> Your payment failed </h2>
                            <p>  Try again later </p> 
                        <p><a href="./">Click Here for Home Page</a></p>
                            </div> 
                        </div> 
        </div> 
                
</div> 



        </div>
    );
};

export default Failed;
