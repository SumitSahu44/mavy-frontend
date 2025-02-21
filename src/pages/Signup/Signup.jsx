"use client";
import React, { useState,Suspense } from "react";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { useSearchParams } from "react-router-dom";

import "./Signup.css"

const SignupPage=()=>{
    const [searchParams] = useSearchParams();
    const pid = searchParams.get("pid"); // Replace "paramName" with the actual parameter key
    
    const [name, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false);
 
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page

        if (!isChecked) {
            toast.error("You must agree to the terms and conditions.");
            
            return;
        }

        const formData = {
            name,
            email,
            password,
        };

        try {
            // Step 3: Make POST request to backend API
            const response = await fetch('https://mavy-pxtx.onrender.com/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify(formData),
                credentials: 'include' // Include cookies0 
            });

            const data = await response.json();
               console.log("data"+ JSON.stringify(data))
            if (response.ok) {
                
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    toast.success("User registered successfully!");
                }
               setTimeout(() => {
                    window.location.href = pid ? `./buy?pid=${pid}` : '/';
                }, 4000);
                
            } else {
               
                toast.error(data.message  || "Email Already Registered");
            }
        } catch (error) {
           toast.error("Error occurred while registering the user.");
        }
    };


    return (
        <div className="signup-body">
            <div className="signup-container">
                <div className="signup-header">
                    <header>Sign Up</header>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Username"
                            value={name}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            className="input-field"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div>
                        <section>
                            <input
                                type="checkbox"
                                id="check"
                                checked={isChecked}
                                onChange={() => setIsChecked(!isChecked)}
                            />
                            <label htmlFor="check">Agree to terms & conditions</label>
                        </section>
                    </div>

                    <div className="input-submit">
                        <button className="submit-btn" id="submit-btn" type="submit">
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer/>
        </div>
    )
}

const SignupWrapper = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <SignupPage />
    </Suspense>
);

export default SignupWrapper;
