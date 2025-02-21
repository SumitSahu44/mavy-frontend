
import React, { useState } from "react";
import "./Login.css"
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

export default function login(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
   
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page

        const formData = {
            email,
            password,
        };

        try {
            // Step 3: Make POST request to backend API
            const response = await fetch('https://mavy-pxtx.onrender.com/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include' // Include cookies0 
            });

            const data = await response.json();
           
            if (response.ok) {
                // Store the token in localStorage
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    toast.success("User logged in successfully!");
                } else {
                    toast.error("No token received!");
                    return;
                }
    
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                toast.error(data.message || "User Not Found!");
            }
    
        } catch (error) {
            console.error('Error:', error);
          }
    };

    return(
        <div className="login-body">
        <div className="login-box">
            <div className="login-header">
                <header>Login</header>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="email"
                        name="email"
                        className="input-field"
                        placeholder="Email"
                        autoComplete="off"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        name="password"
                        className="input-field"
                        placeholder="Password"
                        autoComplete="off"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="forgot">
                    <section>
                        <input type="checkbox" id="check" />
                        <label htmlFor="check">Remember Me</label>
                    </section>
                    <section>
                        <a href="">Forgot Password</a>
                    </section>
                </div>
                <div className="input-submit">
                    <button type="submit" className="submit-btn">
                        Log In
                    </button>
                </div>
            </form>
            <div className="sign-up-link">
                <p>Don't have an account? <a href="./signup">Sign Up</a></p>
            </div>
        </div>
        <ToastContainer/>
    </div>
    )
}
