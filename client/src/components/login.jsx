import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom"
import validateEmail from "../helpers/validateEmail";

function Loginpage({setAuthAccessToken, setAuthRefreshToken}) {
    document.title = "Convz Backend Test- Login";
    const navigate = useNavigate();

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    
    const handleLogin = async (event) => {
        event.preventDefault();
        if(!email ||!password || password.trim().length == 0 || email.trim().length == 0){
            return;
        }
        const isValidEmail = await validateEmail(email);
        if (!isValidEmail) {
            alert('Invalid email format');
            return
        }
        let loginCredentials={
            email, password
        }

        fetch("http://127.0.0.1:3300/api/v1/auth/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginCredentials)
        })
        .then(response => response.json())
        .then(data => {
            if (!data.status) {
                alert(data.message);
                return;
            }
            localStorage.setItem("accessToken", data.userAuth.accessToken);
            localStorage.setItem("refreshToken", data.userAuth.refreshToken);
            setAuthAccessToken(localStorage.getItem("accessToken"));
            setAuthRefreshToken(localStorage.getItem("refreshToken"));
            navigate("/dashboard");
        });
    }

    return (
        <>
            <main className="container-fluid pt-3 px-4 disclaimer" style={{backgroundColor:"#d9d9d9"}}>
                <div className="mt-2 d-flex justify-content-center align-items-center" style={{minHeight:"97vh", flexDirection:"column"}}>
                    <div className="row py-4 mb-2" style={{backgroundColor:"#ffffff", boxShadow: '2px 2px grey'}}>
                        <div className="col-12">
                            <h3 className='text-center'>
                                Log into your account
                            </h3>
                            <p className='text-center'>Welcome back, please enter your details</p>
                        </div>
                        <div className="col-12">
                            <form onSubmit={handleLogin}>
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" onChange={(event)=>setEmail(event.target.value)}/>
                                    <label htmlFor="floatingInput">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password"  onChange={(event)=>setPassword(event.target.value)}/>
                                    <label htmlFor="floatingPassword">Password</label>
                                </div>
                                <a className="float-end btn mb-3" style={{textDecoration:"None"}}>Forgot Password?</a>
                                <div>
                                    <button className="btn text-light form-control" id="btnLogin" style={{backgroundColor:"#592e83"}}>Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <p className='text-center'>Don't have an account yet? <Link to="/create-account" style={{textDecoration: 'none', color: "#592e83"}}>Sign up</Link></p>
                </div>                
            </main>
        </>
    )
}

export default Loginpage;