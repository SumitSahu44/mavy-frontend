import React from 'react'
import '../style/responsive-footer.css'
import '../style/responsive-nav.css'
import './About.css'
import { useGSAP } from "@gsap/react";
import { gsap, Power3, Circ,Expo } from 'gsap';
import { RiMenu3Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

const About = () => {
  
    useGSAP(()=>{
        let menu=document.querySelector("#nav i");
    let close=document.querySelector("#full i");
    
    let first=gsap.timeline()
    
    first.to("#full",{
    right:0,
    duration:0.5
    })
    
    first.from("#full h4",{
    x:150,
    duration:0.6,
    stagger:0.2,
    opacity:0
    })
    
    first.from("#full i",{
    opacity:0
    } )
    
    
    first.pause()
    
    
    menu.addEventListener("click",function(){
    first.play()
    })
    
    close.addEventListener("click",function(){
    first.reverse()
    })
    
    })
    return(
        <div>
        <div>
        <header>
        <div className="navbar">
            <div id="nav">
              <img src="img/qt=q_95.jpeg" alt=""/>
              <i ><RiMenu3Fill /></i>
            </div>
            <div id="full">
                  <a href="/"><h4>Home</h4></a>
                  <a href="#"><h4>About</h4></a>
                  <a href="./product"><h4>Products</h4></a>
                  <a href="./cart"><h4>Cart</h4></a>
                  <a href="./login"><h4>Profile</h4></a>
              <i><IoMdClose /></i>
            </div>
          </div>
    </header>
        </div>

    <div>
        <div className="story">
            <div className="inner">
            <p id="first">Our Story</p>
            <h1>Crafted with Care: Fine <br/>Materials, Thoughtful Design </h1>
            <p id="second">At MavyScrubs, we believe clothing is more than just fabric—it's an expression of individuality, creativity, and confidence. Our passion for craftsmanship and design drives us to create timeless, high-quality garments tailored for every occasion.</p>
            </div>
        </div>
    </div>

    <div>
        <div className="about-container">
            <div className="about">
                <div className="about-img">
                    <img src="img/image3 (1).jpeg" alt=""/>
                </div>
                <div className="about-content">
                    <p id="head">Our Product Quality</p>
                    <h2>We Make Things Comfy, <br/>Pretty, and Fancy</h2>
                    <p id="subhead">We use only premium materials like 100% cotton, linen, and sustainable blends for maximum comfort.</p>
                    <div className="bottom-section">
                        <div>
                            <h4>100% Cotton</h4>
                            <p>100% Pure Cotton: No blends, <br /> no synthetics—just pure comfort</p>
                        </div>
                        <div>
                            <h4>Breathable Fabric</h4>
                            <p>Enhanced airflow prevents overheating. <br/> Sustainably sourced fibers for a greener planet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div>
        <div className="about-info">
            <div className="a-img-gallery">
                <img src="img/image4.jpeg" alt=""/>
                <h3>Attention to Details</h3>
                <p>We hand pick the right Kente to match the uniform style</p>
            </div>

            <div className="a-img-gallery">
                <img src="img/image0 (1).jpeg" alt=""/>
                <h3>Choice of Kente Cloth</h3>
                <p>Our vision is to bring vibrant colors into your medical scrub wear</p>
            </div>
        </div>
    </div>
    <footer>
        <div className="footer-cont">
            <div className="footer">
                <div className="company">
                    <img src="img/qt=q_95.jpeg" alt=""/>
                </div>
                <div className="cust-care">
                    <h3>Customer Care</h3>
                    <ul>
                        <li><a href="#">Contact Us</a></li>
                        <li>Call +1 276-336-1681</li>
                        <li><a href="#">FAQ</a></li>
                    </ul>
                </div>
                <div className="link">
                    <h3>Links</h3>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Products</a></li>
                    </ul>
                </div>
                <div className="social">
                    <h3>Follow Us</h3>
                    <ul>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Twitter</a></li>
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

export default About