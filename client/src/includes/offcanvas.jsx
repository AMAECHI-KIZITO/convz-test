import React from "react";
import { Link } from "react-router-dom";

function SideMenu() {
    return (
        <>
        <div id="OffcanvasSection">
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="sideMenu" aria-labelledby="sideMenuLinks" style={{backgroundColor:"#EFE5DC"}}>

                <div className="offcanvas-header">
                    <h5 id="sideMenu" className="brandName" style={{color:"#3D405B"}}>
                        HeadsUp
                    </h5>

                    <button type="button" className="btn-close text-reset" id='closeOffCanvas' data-bs-dismiss="offcanvas" aria-label="Close" style={{backgroundColor:"#3D405B"}}></button>
                </div><hr/>

                <div className="row offcanvas-body">
                    <div className="col-12">
                        <p className="text-center">
                            <Link to="/" style={{textDecoration:"none", color:"#000000"}}>Home</Link>
                        </p>
                        <p className="text-center">
                            <Link to="/how-it-works" style={{textDecoration:"none", color:"#000000"}}>How It Works</Link>
                        </p>
                        <p className="text-center">
                            <Link to="/pricing" style={{textDecoration:"none", color:"#000000"}}>Pricing</Link>
                        </p>
                        <p className="text-center">
                            <Link to="/login" className="btn" style={{backgroundColor:'purple', color:'#fff'}}>Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default SideMenu;