"use client";
import "./Cart.css";
import "../style/responsive-nav.css";
import React, { useState, useEffect } from 'react';
import { useGSAP } from "@gsap/react";
import { gsap, Power3, Circ, Expo } from 'gsap';
import { FiShoppingCart } from "react-icons/fi"; // Import cart icon
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { RiMenu3Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

 function Cart() {
    const [userId, setUserId] = useState(null); // Set this to your logged-in user ID 
    const [cartItems, setCartItems] = useState([]); // Contains productId and quantity
    const [productsDetails, setProductsDetails] = useState([]); // Contains fetched product details
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [couponCode, setCouponCode] = useState("");

    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [totalBill, setTotalBill] = useState(null);
    const shippingCharge = 10.99;

    const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
      const [cartLength, setCartLength] = useState(
        (JSON.parse(localStorage.getItem("cart")) || []).length
    );
    var calculateBill = 0;
    useGSAP(() => {
        let menu = document.querySelector("#nav i");
        let close = document.querySelector("#full i");

        let first = gsap.timeline();

        first.to("#full", {
            right: 0,
            duration: 0.5
        });

        first.from("#full h4", {
            x: 150,
            duration: 0.6,
            stagger: 0.2,
            opacity: 0
        });

        first.from("#full i", {
            opacity: 0
        });

        first.pause();

        menu.addEventListener("click", function () {
            first.play();
        });

        close.addEventListener("click", function () {
            first.reverse();
        });
    });

    // Fetch user data, cart items, and product details
   // Fetch user data, cart items, and product details
   useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch cart data from localStorage
            const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCartItems(storedCart); // Store cart items
            
            if (storedCart.length === 0) {
                setProductsDetails([]);
                setTotalBill(0);
                setIsLoading(false);
                return;
            }

            // Fetch product details for each productId
            const fetchedProductDetails = await Promise.all(
                storedCart.map(async (item) => {
                    try {
                        const productResponse = await fetch(`http://localhost:4000/user/products?pid=${item.productId}`, {
                            method: 'GET',
                            credentials: 'include'
                        });

                        if (!productResponse.ok) {
                            throw new Error(`Error fetching product data for ID ${item.productId}`);
                        }

                        const productDetails = await productResponse.json();
                        return {
                            productDetails,
                            quantity: item.quantity,
                            size: item.size,
                            color: item.color,
                            _id: item._id
                        };
                    } catch (error) {
                        console.error(`Error fetching product details for ${item.productId}:`, error);
                        return null;
                    }
                })
            );

            // Filter out any failed fetches (null values)
            const validProducts = fetchedProductDetails.filter(item => item !== null);
            setProductsDetails(validProducts);
            console.log("Fetched product details: ", validProducts);

            // Calculate total bill
            let total = 0;
            validProducts.forEach(element => {
                let price = (["S", "M", "L"].includes(element.size)) ? 24.99 : 34.99;
                total += element.quantity * price;
            });
           

            // Check for coupon
            const appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon"));
            if (appliedCoupon && appliedCoupon.discountPercent) {
                total = total - (total * appliedCoupon.discountPercent) / 100;
            }

            

            
            setTotalBill(parseFloat((total).toFixed(2)));


        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    fetchData();
}, []); // Run only on mount

    

const removeCartItem = (itemId, itemColor, itemSize) => {
    try {
        // Get cart from localStorage
        let storedCart = JSON.parse(localStorage.getItem("cart")) || [];

        // Remove only the item that matches productId, color, and size
        const updatedCartItems = storedCart.filter(item => 
            !(item.productId === itemId && item.color === itemColor && item.size === itemSize)
        );

        // Check if any item was actually removed
        if (updatedCartItems.length === storedCart.length) {
            console.warn("No matching item found to remove.");
            return;
        }

        // Update localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));
         setCartLength((JSON.parse(localStorage.getItem("cart")) || []).length) 
        // Update state with new cart items
        setCartItems([...updatedCartItems]); 

        // Remove the item from productsDetails
        setProductsDetails(prevProducts => 
            prevProducts.filter(product => 
                !(product.productDetails._id === itemId && product.color === itemColor && product.size === itemSize)
            )
        );

        // Recalculate total bill
        let total = 0;
        updatedCartItems.forEach(element => {
            let price = (["S", "M", "L"].includes(element.size)) ? 24.99 : 34.99;
            total += element.quantity * price;
        });

        setTotalBill(parseFloat((total).toFixed(2)));

        toast.success("Item removed from cart!");

    } catch (error) {
        console.error("Error removing item from cart:", error);
    }
};




      // Handle checkout
    const handleCheckout = async () => {
        if (!email) {
            setError("Email is required");
            return;
        }
        setError(""); // Clear error when email is valid
        // Proceed with checkout logic
        try {
           const response = await fetch('http://localhost:4000/user/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                //    'Authorization': `Bearer ${authToken}`, // Attach token in the Authorization header
                  },  
                credentials: 'include', // Include cookies
                body: JSON.stringify({
                    email, // Send the email from input
                    cartItems,
                    totalBill
                })
            });

            const result = await response.json();
            if (result.url) {
                // Redirect to Stripe Checkout page
                window.location.href = result.url;
            } else {
                console.error("Error creating Stripe Checkout session");
            }
           
        } catch (error) {
            console.error('Error during checkout:', error);
            alert("Error occurred while placing the order.");
        }
    };


    const handleApplyCoupon = () => {
        if (couponCode.trim() === "") {
            alert("Please enter a valid coupon code.");
        } else {
            if (couponCode === "MAVY20") {
                const discountAmount = (totalBill * 20) / 100;
                const newBill = totalBill - discountAmount;
                setTotalBill(newBill);
                localStorage.setItem("appliedCoupon", JSON.stringify({
                    code: couponCode,
                    discountPercent: 20
                }));
                alert("Coupon Applied: " + couponCode);
            } else {
                alert("Coupon Not valid: " + couponCode);
            }
        }
    };
    
      


    return (
        <div>
            <header>
                <div className="navbar">
                    <div id="nav">
                        <img src="img/qt=q_95.jpeg" alt="" />
                       <div>
                                                                         
                                                                         <a href="/cart" style={{ position: "relative", textDecoration: "none", color: "white" }}>
                                                                             <FiShoppingCart size={25} style={{ margin: "5px 10px" }} />
                                                                             <sup style={{position:"absolute",}}>{cartLength ? cartLength: ' '}</sup>
                                                                         </a>
                                                                         <i style={{marginLeft:"20px"}} ><RiMenu3Fill /></i>
                                                                      </div>
                                       
                    </div>
                    <div id="full">
                        <a href="/"><h4>Home</h4></a>
                        <a href="./about"><h4>About</h4></a>
                        <a href="./product"><h4>Products</h4></a>
                        <a href="./cart"><h4>Cart</h4></a>
                        {/* <a href="./login"><h4>Profile</h4></a> */}
                        <i><IoMdClose /></i>
                    </div>
                </div>
            </header>

            <div className="cart-container">
                <div className="cart-heading">
                    <h1>My Cart</h1>
                </div>
                <div className="cart-item-container">
                <div className="cart-left" key={cartItems.length}>
    {isLoading ? (
        <p>Loading your cart...</p> // Show loading indicator while data is being fetched
    ) : (
        productsDetails.length === 0 ? (
            <h2 className="empty">Your cart is empty.</h2>
        ) : (
            productsDetails.map((item) => {
                let price = 24.99; 
                let colorCode = 0;

                if (item.size === "XL" || item.size === "2XL" || item.size === "3XL") {
                    price = 34.99; 
                }

                if (item.color === "Navy Blue") {
                    colorCode = "#000080"; 
                } else if (item.color === "Black") {
                    colorCode = "#000000"; 
                } else {
                    colorCode = "#FFFFFF";
                }

                calculateBill = calculateBill + price;

                return (
                    <div className="cart-item" key={item.productDetails._id || item._id}>
                        <div className="item-img">
                            <img src={`img/${item.productDetails.imageUrl?.[0] || 'default-image.jpg'}`} alt={item.productDetails.name} />
                        </div>
                        <div className="item-info">
                            <h3>{item.productDetails.name}</h3>
                            <p>{item.productDetails.description}</p>
                            <p>${price }</p> {/* Display the price based on size */}
                            <p>Size: {item.size}</p>

                            {/* Display Selected Color */}
                            <p style={{ display: "flex", alignItems: "center" }}>
                                <span>Color: </span>
                                <span style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: colorCode,
                                    borderRadius: "50%",
                                    border: "1px solid #000",
                                    display: "inline-block",
                                    marginLeft: "10px"
                                }}></span>
                            </p>

                            <form action="#">
                                <label>Qty:</label>
                                <input type="number" min="1" value={item.quantity}
                                       onChange={(e) => console.log('Handle quantity change')} />
                            </form>
                        </div>
                        
                        <div className="close" onClick={() => removeCartItem(item.productDetails._id, item.color, item.size)}>
                            <i className="text-red-500 bg-transparent cross-icon"><b>X</b></i>
                        </div>
                    </div>
                );
            })
        )
    )}
</div>

{totalBill ? (
  <div className="cart-right">
    <h2>Cart Total</h2>
    <div className="c-info">
      <div className="c-r-info">
        <div>
          <p>Subtotal</p>
          <p>Discount</p>
          <p>Shipping</p>
          <p> <input
              type="text"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              style={{
                flex: 1,
                width: "100%",
                padding: "8px",
                outline: "none",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            /></p> {/* <-- New row heading */}
          <h4>Total Cost</h4>
        </div>
      </div>
      <div className="c-l-info">
        <div>
          <p>${parseFloat(totalBill.toFixed(2))}</p>
          <p>N/A</p>
          <p>{shippingCharge}</p>

          {/* Coupon Input and Add Button */}
          <div style={{ display: "flex", gap: "8px", margin: "8px 0" }}>
           
            <button
              onClick={handleApplyCoupon}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>

          <h4>${parseFloat((totalBill + shippingCharge).toFixed(2))}</h4>
        </div>
      </div>
    </div>

    <div>
      <input
        type="email"
        style={{ width: "100%", outline: "none", padding: "10px" }}
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required=""
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>

    <div className="order-btn">
      <button onClick={handleCheckout}>Place Order</button>
    </div>
  </div>
) : ''}

</div>

            </div>

            <footer>
                <div className="footer-cont">
                    <div className="footer">
                        <div className="company"><img src="img/qt=q_95.jpeg" alt="" /></div>
                        <div className="cust-care">
                            <h3>Customer Care</h3>
                            <ul>
                                <li><a href="#">Contact Us</a></li>
                                <li>Call +1 276-336-1681</li>
                                <li><a href="#">Address:</a> 3297 Bassett hgts rd ext
                                Bassett Va 24055</li>
                            </ul>
                        </div>
                        <div className="link">
                            <h3>Links</h3>
                            <ul>
                                <li><a href="/">Home</a></li>
                                <li><a href="./about">About</a></li>
                                <li><a href="./product">Product</a></li>
                            </ul>
                        </div>
                        <div className="social">
                            <h3>Follow Us</h3>
                            <ul>
                                <li><a href="https://www.instagram.com/mavyscrubs?igsh=dWpvMWM3NGl4cGps&utm_source=qr">Instagram</a></li>
                                <li><a href="https://www.facebook.com/profile.php?id=61566524166958&mibextid=wwXIfr&mibextid=wwXIfr">Facebook</a></li>
                                {/* <li><a href="#">Twitter</a></li> */}
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
            <ToastContainer/>
        </div>
    )
    

    }

    export default Cart;
    

