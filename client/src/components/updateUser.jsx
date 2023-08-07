import React, {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import validateEmail from "../helpers/validateEmail";


function UpdateUser({authAccessToken, authRefreshToken, setAuthAccessToken, setAuthRefreshToken}){
    document.title='Convz Backend Test - Update User';
    const {userId} = useParams();

    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [orgName, setOrgName] = useState(null);
    const [emailAddress, setEmailAddress] = useState(null);


    const refreshTokens = () => {
        fetch(`http://127.0.0.1:3300/api/v1/auth/refresh-tokens/`, {
            method: "POST",
            headers:{
                "Refresh-Token": `Bearer ${authRefreshToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({adminRefreshToken: authRefreshToken})
        })
        .then(rsp => rsp.json())
        .then(data => {
            if (data.status != 200) {
                setAuthAccessToken(null);
                setAuthRefreshToken(null);
            }
            setAuthAccessToken(data.userAuth.accessToken);
            setAuthRefreshToken(data.userAuth.refreshToken);
        })
    }

    const updateUser = (credentials) => {
        let updateUserCredentials = credentials;

        fetch("http://127.0.0.1:3300/api/v1/update-user",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authAccessToken}`,
                "Refresh-Token": `Bearer ${authRefreshToken}`
            },
            body: JSON.stringify(updateUserCredentials)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Token Expired" || data.message === "Invalid authorization token!" || data.message === "Authorization token missing!") {
                setAuthAccessToken(null);
                setAuthRefreshToken(null);
            }
            if (data.status != 200) {
                alert(data.message);
                return;
            }
            alert(data.message);
            document.getElementById("firstnameInput").value = '';
            document.getElementById("lastnameInput").value = '';
            document.getElementById("emailInput").value = '';
            document.getElementById("orgInput").value = '';
        });
    }
    
    const handleUpdate = async (event) => {
        event.preventDefault();
        if(!firstName || !lastName || !emailAddress || !orgName || firstName.trim().length == 0 || lastName.trim().length == 0 || orgName.trim().length == 0 || emailAddress.trim().length == 0){
            alert('Update failed! Kindly ensure form is filled accurately')
            return;
        }

        const isValidEmail = await validateEmail(emailAddress);
        if (!isValidEmail) {
            alert('Invalid email format');
            return
        }
        let updateUserCredentials = {
            firstName, lastName, orgName, emailAddress, userId
        }
        updateUser(updateUserCredentials);
    }

    useEffect( () => {
        refreshTokens();
    }, []);

  return(
    <>
        <main className="container-fluid pt-3 px-4 disclaimer" style={{backgroundColor:"#d9d9d9"}}>
            <div className="mt-2 d-flex " style={{minHeight:"97vh", flexDirection:"column"}}>
                <div className="row py-4 mb-2">
                    <div className="col-12">
                        <h2 style={{color:"#592e83"}} className="ms-1 py-2">Update User Profile</h2><hr/>
                    </div>
                    <div className="col-12">
                        <form onSubmit={handleUpdate}>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="firstnameInput" placeholder="firstname" onChange={(event)=>setFirstName(event.target.value)}/>
                                <label htmlFor="firstnameInput">Firstname</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="lastnameInput" placeholder="lastname" onChange={(event)=>setLastName(event.target.value)}/>
                                <label htmlFor="lastnameInput">Lastname</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="emailInput" placeholder="name@example.com" onChange={(event)=>setEmailAddress(event.target.value)}/>
                                <label htmlFor="emailInput">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="orgInput" placeholder="orgName" onChange={(event)=>setOrgName(event.target.value)}/>
                                <label htmlFor="orgInput">Organization Name</label>
                            </div>
                            <div>
                                <button className="btn text-light form-control" id="btnCreateUser" style={{backgroundColor:"#592e83"}}>Update User</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>                
        </main>
    </>
  )
}


export default UpdateUser