import React, { useEffect, useState } from 'react';
import { useGSAP } from "@gsap/react";
import './Home.css';
import { FiShoppingCart } from "react-icons/fi"; // Import cart icon
import { gsap, Power3, Circ, Expo } from 'gsap';
import { RiMenu3Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import Slider from 'react-slick';
import { ThreeDots } from 'react-loader-spinner';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CustomArrow = ({ item, onClick, style, direction }) => (
    <div
      className={item}
      onClick={onClick}
      style={{
        ...style,
        display: 'block',
        zIndex: 2,
        fontSize: '24px',
        color: 'black',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [direction === 'left' ? 'left' : 'right']: '10px',
      }}
    >
      {direction === 'left' ? (
      <i className="fas fa-chevron-left" />
    ) : (
      <i className="fas fa-chevron-right" />
    )}
    </div>
  );

  export const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    arrows: true,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
  };

function Home() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
        
        <>
            <div className="body">
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

                <main className='main'>
                    <div className="hero-section" >
                        <div className="hero-content">

                            <h3 className="reveal">Akwaaba (Welcome)</h3>
                            <h1 className="reveal"> ELEVATE YOUR <br />MEDICAL <br /> Scrubs</h1>
                            <p className="reveal">Wear your scrubs with pride</p>
                            <a href={'./product'} className="reveal "><button className='button-onhover'>Buy Now</button></a>
                        </div>
                        <div className="hero-img">
                            <img src="/img/image2.jpeg" alt="" id="img1" className="img" />
                            <img src="/img/image3.jpeg" alt="" id="img2" className="img" />
                        </div>
                    </div>
                </main>


                <div>
                    <div className="item-section">
                        <div className="heading">
                            <h1>
                                Featured Products
                            </h1>
                        </div>

                        <div className="item-cont">
                        {isLoading ? (
                            // <p>Loading products...</p> // Show loading message while fetching data
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

                        {/* <div className="item-cont">
                            {products.map(product => (
                                <div className="item" key={product.id}>
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
                                        <p><b>Size</b> - {product.size.join(", ")}</p>
                                        <p><b>Price</b> - {product.price}$</p>
                                        <a href={`./buy?pid=${product._id}`}><button className='button-onhover'>Buy Now</button></a>
                                    </div>
                                </div>
                            ))}
                        </div> */}
                    </div>
                </div >



                <div>
                    <div className="offer">
                        <div className="heading">
                            <h1>What Mavy Scrubs <br />Offer</h1>
                        </div>

                        <div className="offer-section " id="left">
                            <img src="/img/image0 (1).jpeg" alt="" />
                            <div className="content">
                                <h2>Mavy Scrubs - Celebrating <br />Heritage Through Fashion</h2>
                                <p>At Mavy Scrubs, we're dedicated to creating beautiful, high-quality scrubs that honor the rich heritage and culture that inspire our designs. Our Mavy Scrubs made with Kente fabric are a testament to our commitment to celebrating the history and significance of this iconic textile.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rating-cont">
                    <div className="rating">
                        <div>
                            <h1>Ratings & Reviews (23)</h1>
                            <p>Showing <span>4</span> result out of <span>23</span></p>
                        </div>
                        <div>
                            <a href="#"><button className='button-onhover'>More</button></a>
                        </div>
                    </div>

                    <div className="rating-info">
                        <div className="review ">
                            <div className="r-img-cont"><img src="https://images.unsplash.com/photo-1455637935731-89621316d929?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YW1lcmljYW4lMjBwZW9wbGV8ZW58MHx8MHx8fDA%3D" style={{"objectFit":"cover"}} alt="" /><span>Jessica Brown</span></div>
                            <i></i>
                            <p>I recently purchased a few items from this website, and I am thoroughly impressed! The quality of the clothing is exceptional—soft fabrics and well-made seams.</p>
                            <h4>Reply</h4>
                        </div>

                        <div className="review ">
                            <div className="r-img-cont"><img src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGFtZXJpY2FuJTIwcGVvcGxlfGVufDB8fDB8fHww" style={{"objectFit":"cover"}} alt="" /><span>David Miller</span></div>
                            <i></i>
                            <p>I love the variety of styles available on this site. Whether I’m looking for casual wear or something a bit more formal, they have it all.</p>
                            <h4>Reply</h4>
                        </div>

                        <div className="review">
                            <div className="r-img-cont"><img src="https://media.istockphoto.com/id/1300972574/photo/millennial-male-team-leader-organize-virtual-workshop-with-employees-online.webp?a=1&b=1&s=612x612&w=0&k=20&c=zrbUynu9yxsQtWT1n5G9-GTyJZs11xhG3apO_e_2x5U=" style={{"objectFit":"cover"}} alt="" /><span>Michael Williams</span></div>
                            <i></i>
                            <p>The selection of clothing is impressive, and the quality is generally great. I found a stunning dress that I adore. However, there was a small delay in shipping. </p>
                            <h4>Reply</h4>
                        </div>

                        <div className="review">
                            <div className="r-img-cont"><img src="https://images.unsplash.com/photo-1729214718224-78174c0edd63?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1hbGUlMjAlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D" alt=""  style={{"objectFit":"cover"}} /><span>John Smith</span></div>
                            <i></i>
                            <p>I was pleasantly surprised by how affordable the clothing is without compromising on quality. The fabrics feel durable, and the designs are on-trend. </p>
                            <h4>Reply</h4>
                        </div>
                    </div>
                </div>





                <div id="contact">
                    <div className="connect">
                        <div> <h1>Contact for Bulk<br />Order</h1></div>
                        <a href="mailto:mavymannsllc@gmail.com" className="button"> Contact Me </a>
                    </div>
                </div>


                <footer>
                    <div className="footer-cont">
                        <div className="footer">
                            <div className="company"><img src="/img/qt=q_95.jpeg" alt="" /></div>
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

                        <div className="copyright">
                            <h4>Copyright @ 2024 Mavy Scrubs</h4>
                        </div>
                    </div>
                </footer>
            </div >
        </>
    )
}

export default Home;
