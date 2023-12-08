import React from "react";
import logo from "../../assets/logo.png";
import {Link } from "react-router-dom";

function Navbar() {
   
      
    function setCookie()   
    {  
        //how to delete cookie
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log("cookie deleted");  
    }   
    return (
        <>
            <nav class="navbar is-transparent">
                <div class="navbar-brand">
                    <Link to="/" class="navbar-item">
                        <a class="navbar-item">
                            <img src={logo} alt="Bulma: a modern CSS framework based on Flexbox" style={{marginTop:"6px", width: "125px"}}/>
                        </a>
                    </Link>   
                    {/* <div class="navbar-burger" data-target="navbarExampleTransparentExample">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div> */}
                 </div>

                <div id="navbarExampleTransparentExample" class="navbar-menu">
                    <div class="navbar-start">
                        <a class="navbar-item" href="#" onClick={() => window.location.href = window.location.href}>
                            Dashboard
                        </a>
                
                    </div>
                    

                    <div class="navbar-end">
                        <div class="navbar-item">
                            <div class="field is-grouped">
                                <p class="control">
                                    
                                </p>
                                <p class="control">
                                    <Link to='/login' style={{width:'50%'}} >
                                        <button class="button is-success " onClick={() => {setCookie()}}>
                                            Log out
                                        </button>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;