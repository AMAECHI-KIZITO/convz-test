import React, {useState} from "react";
import {Link} from "react-router-dom"
import validateEmail from "../helpers/validateEmail";

function Signup() {
    document.title = "Convz Backend Test- Admin Signup";
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [emailAddress, setEmailAddress] = useState(null);
    const [passCode, setPasscode] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    
    const handleSignup = async (event) => {
        event.preventDefault();
        if(!firstName || !lastName || !emailAddress || !passCode || firstName.trim().length == 0 || lastName.trim().length == 0 || emailAddress.trim().length == 0 || passCode.trim().length == 0 || phoneNumber.trim().length == 0 || !phoneNumber){
            alert('Account creation failed! Kindly ensure form is filled accurately')
            return;
        }
        if (passCode.trim().length < 8) {
            alert('Minimum length of password is 8 characters excluding spaces')
            return
        }

        const isValidEmail = await validateEmail(emailAddress);
        if (!isValidEmail) {
            alert('Invalid email format');
            return
        }
        let signupCredentials = {
            firstName, lastName, emailAddress, passCode, phoneNumber
        }

        fetch("http://127.0.0.1:3300/api/v1/auth/signup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signupCredentials)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status != 200) {
                alert(data.message);
                return;
            }
            alert(data.message);
            document.getElementById("firstnameInput").value = '';
            document.getElementById("lastnameInput").value = '';
            document.getElementById("emailInput").value = '';
            document.getElementById("phoneInput").value = '';
            document.getElementById("passwordInput").value = '';
        });
    }

    return (
        <>
            <main className="container-fluid pt-3 px-4 disclaimer" style={{backgroundColor:"#d9d9d9"}}>
                <div className="mt-2 d-flex justify-content-center align-items-center" style={{minHeight:"97vh", flexDirection:"column"}}>
                    <div className="row py-4 mb-2" style={{backgroundColor:"#ffffff", boxShadow: '2px 2px grey'}}>
                        <div className="col-12">
                            <h3 className='text-center'>
                                Create an admin account
                            </h3>
                            <p className='text-center'>It takes less than one minute</p>
                        </div>
                        <div className="col-12">
                            <form onSubmit={handleSignup}>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="firstnameInput" placeholder="firstname" onChange={(event)=>setFirstName(event.target.value)}/>
                                    <label htmlFor="firstnameInput">Your Firstname</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="lastnameInput" placeholder="lastname" onChange={(event)=>setLastName(event.target.value)}/>
                                    <label htmlFor="lastnameInput">Your Lastname</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control" id="emailInput" placeholder="name@example.com" onChange={(event)=>setEmailAddress(event.target.value)}/>
                                    <label htmlFor="emailInput">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control" id="phoneInput" placeholder="phone" onChange={(event)=>setPhoneNumber(event.target.value)}/>
                                    <label htmlFor="phoneInput">Your Phonenumber</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control" id="passwordInput" placeholder="Password"  onChange={(event)=>setPasscode(event.target.value)}/>
                                    <label htmlFor="passwordInput">Your Password</label>
                                </div>
                                <div>
                                    <button className="btn text-light form-control" id="btnLogin" style={{backgroundColor:"#592e83"}}>Create Account</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <p className='text-center'>Already have an account? <Link to="/" style={{textDecoration: 'none', color: "#592e83"}}>Log in</Link></p>
                </div>                
            </main>
        </>
    )
}

export default Signup;