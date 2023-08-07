import React from "react";
import { Link } from "react-router-dom";
import SideMenu from "./offcanvas"

function Navigation() {
    return (
        <div>
            <header className="container-fluid pt-3 px-4">
                <nav className="d-none d-md-flex" style={{display:"flex", justifyContent:'space-between'}}>
                    <div style={{display:"flex", justifyContent:'space-between'}}>
                        <div>
                            <h2 className="brandName">
                                <Link to="/" style={{textDecoration:"none", color:"#000000"}}>Convz</Link>
                            </h2>
                        </div>

                        <div>
                            <ul id='nav_links'>
                                <li>
                                    <Link to="/" style={{textDecoration:"none", color:"#000000"}}>Home</Link>
                                </li>
                                <li>
                                    <Link to="/how-it-works" style={{textDecoration:"none", color:"#000000"}}>How It Works</Link>
                                </li>
                                <li>
                                    <Link to="/pricing" style={{textDecoration:"none", color:"#000000"}}>Pricing</Link>
                                </li>
                            </ul>
                        </div>

                    </div>

                    
                    <div>
                        <Link to='/login' className="btn" style={{backgroundColor:'purple', color:'#fff'}}>Login</Link>
                    </div>
                </nav>

                {/* Small screens navigation */}
                <nav className="d-md-none">
                    <div className="row">
                        <div className="col-8">
                            <h2 className="brandName">
                                <Link to="/" style={{textDecoration:"none", color:"#000000"}}>HeadsUp</Link>
                            </h2>
                        </div>

                        <div className="col-4">
                            <Link className="btn float-end" style={{backgroundColor:'#d0b8ac', lineHeight:'2px'}} data-bs-toggle="offcanvas" data-bs-target="#sideMenu">
                                <i className="fa-solid fa-bars" style={{color:'#9d44b5'}}></i>
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>
            
            <SideMenu/>

        </div>
    )
}

export default Navigation;