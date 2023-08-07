import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="container-fluid pt-3 px-4">
            <div className="row">
                <div className = "col-12">
                    <p className="text-center">&copy; {new Date().getFullYear()} Convz Technical Interview. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
export default Footer;