import React from "react";
import {Link } from "react-router-dom";
import '../App.css';

export default function LandingPage() {
    return (

        <div>
            <div className="background-image" >
            <div className="hero is-fullheight" >
               
                <div className="hero-body" >
                    <div className="container" >
                        <div className="column is-half is-offset-3" >
                            <div className="box" >
                                <div className="field">
                                    <h3 className="title has-text-centered has-text-black" style={{ fontSize: '40px' }}>Welcome to Healthvault </h3>                                    
                                    
                                    <h2 className="title has-text-centered has-text-black" style={{ fontSize: '25px' }}>A Secure BlockChain Solution for Data Management System </h2>                                    
                                </div>
                                <div className="buttons has-addons is-centered mt-5">
                                    <Link to='/login' style={{width:'50%'}} >
                                        <button className="button is-primary"  style={{width:'100%'}}>Login</button>
                                    </Link>
                                </div>
                                <div className="buttons has-addons is-centered mt-5">
                                    <Link to='/about' style={{width:'50%'}} >
                                        <button className="button is-primary"  style={{width:'100%'}}>About</button>
                                    </Link>
                                </div>
                            </div>
                        </div>    
                    </div>    
                </div>    
                </div>
            </div>


        </div>
    );
}