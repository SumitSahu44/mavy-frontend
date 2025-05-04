import './Product.css'
import "./Product.css"
import { useGSAP } from "@gsap/react";
import { gsap, Power3, Circ, Expo } from 'gsap';
import { RiMenu3Fill } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi"; // Import cart icon
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import Slider from 'react-slick';
import { ThreeDots } from 'react-loader-spinner';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { sliderSettings } from '../Home/Home';

function Product() {
    const [products, setProducts] = useState([]); // State to store product details
    const [isLoading, setIsLoading] = useState(true); // Loading state
 const [cartLength, setCartLength] = useState(
    (JSON.parse(localStorage.getItem("cart")) || []).length
);


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

    function truncateDescription(description, maxLength) {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + '...';
        }
        return description;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://mavy-pxtx.onrender.com/user/products`); // Fetch product data from backend
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data); // Set products data into state
                setIsLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false); // Set loading to false in case of error
            }
        };
        fetchData();
    }, []);

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

            <section>
                <div className="item-section">
                    <div className="p-heading"><h1>Featured Products</h1></div>
                    <div className="item-cont">
                        {isLoading ? (
                            <div className="spinner-container">
                                <ThreeDots 
                                    height="80" 
                                    width="80" 
                                    color="#3498db" 
                                    ariaLabel="loading"
                                />
                            </div>
                        ) : (
                            products.length > 0 ? (
                                products.map((product, index) => (
                                    <div className="item" key={index}>
                                        <Slider {...sliderSettings}>
                                            {product.imageUrl.map((image, indx) => (
                                                <div className='product-img' key={indx}>
                                                    <img
                                                        src={`img/${image || 'default-image.jpg'}`}
                                                        alt={product.name}
                                                    />
                                                </div>
                                            ))}
                                        </Slider>
                                        <div className="product-info">
                                            <h3>{product.name}</h3>
                                            <p className='description'>

                                                <b>Description</b> - {truncateDescription(product.description, 50)}
                                            </p>
                                            {/* <p>{product.description}</p> */}
                                            <p>Size: {product.size.join(', ')}</p>
                                            <p>Price: ${product.price + '.99'}</p>
                                            <a href={`buy?pid=${product._id}`}><button className='button-onhover'>Buy Now</button></a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No products available</p> // Show message if no products are found
                            )
                        )}
                    </div>
                </div>
            </section>


            <footer>
                <div className="footer-cont">
                    <div className="footer">
                        <div className="company">
                            <img src="/img/qt=q_95.jpeg" alt="" />
                        </div>
                        <div className="cust-care">
                            <h3>Customer Care</h3>
                            <ul>
                                <li><a href="#">Contact Us</a></li>
                                <li>Call +1 276-336-1681</li>
                                <li><a href="#">Address:</a> Virginia</li>
                            </ul>
                        </div>
                        <div className="link">
                            <h3>Links</h3>
                            <ul>
                                <li><a href="/">Home</a></li>
                                <li><a href="about.html">About</a></li>
                                <li><a href="product.html">Products</a></li>
                            </ul>
                        </div>
                        <div className="social">
                            <h3>Follow Us</h3>
                            <ul>
                                <li><a href="https://www.instagram.com/mavyscrubs?igsh=dWpvMWM3NGl4cGps&utm_source=qr">Instagram</a></li>
                                <li><a href="https://www.facebook.com/profile.php?id=61566524166958&mibextid=wwXIfr&mibextid=wwXIfr">Facebook</a></li>
                                {/* <li><a href="">Twitter</a></li> */}
                            </ul>
                        </div>
                    </div>

                    <div className="copyright">
                        <h4>Copyright @ 2024 Mavy Scrubs</h4>
                    </div>
                </div>
            </footer>
        </div>
    )
}
export default Product;
