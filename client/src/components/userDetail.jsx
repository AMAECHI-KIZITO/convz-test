import React, {useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";


function UserDetail({authAccessToken, authRefreshToken, setAuthAccessToken, setAuthRefreshToken}){
    document.title='Convz Backend Test - User Profile';

    const {userId} = useParams();
    const[userdata, setUserData]=useState([]);
    const[loadData, setLoadData]=useState("loading");

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

    const getUserDetail = () => {
        fetch(`http://127.0.0.1:3300/api/v1/users/${userId}`, {
            headers:{
                "Authorization": `Bearer ${authAccessToken}`,
                "Refresh-Token": `Bearer ${authRefreshToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(rsp => rsp.json())
        .then(data => {
            if (data.message === "Token Expired" || data.message === "Invalid authorization token!" || data.message === "Authorization token missing!") {
                setAuthAccessToken(null);
                setAuthRefreshToken(null);
            }
            setUserData(data.userDetail);
            setLoadData("loaded");
        })
    }

    useEffect( () => {
        refreshTokens();
        getUserDetail();
    }, []);

    return(
        <>
            {
                loadData === "loading" 
                
                ? 
                
                <div className="row align-items-center" style={{minHeight:'400px'}}>
                    <div className="text-center">
                        <div className="spinner-border" style={{color:'#592e83'}} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>

                
                :
                <>
                    <h2 style={{color:"#592e83"}} className="py-2">
                        <span className="float-start me-3">
                            <Link to="/dashboard/users">
                                <button className="btn text-light btn-sm ms-1" style={{backgroundColor:"#592e83"}}>
                                    <i className="fa-solid fa-arrow-left" style={{fontSize:"12px"}}></i>
                                </button>
                            </Link>
                        </span>
                        User Profile
                        <Link to={`/dashboard/users/reports/${userId}`}>
                            <button className="btn btn-sm text-light float-end me-1" style={{backgroundColor:"#592e83"}}>View Reports</button>
                        </Link>
                    </h2> <hr/>

                    <div className="row">
                        <div className="col-md-11" style={{color:'#592e83'}}>
                            <p className="ms-1">Name: {userdata.firstname[0].toUpperCase() + userdata.firstname.substring(1).toLowerCase()} {userdata.lastname[0].toUpperCase() + userdata.lastname.substring(1).toLowerCase()}</p>
                            <p className="ms-1">Email: {userdata.email}</p>
                            <p className="ms-1">Organization: {userdata.organization[0].toUpperCase() + userdata.organization.substring(1)}</p>
                            <p className="ms-1">Verification Status: {userdata.verificationStatus}</p>
                            <p className="ms-1">Date registered: {userdata.dateCreated.toLocaleString()}</p><br/> <hr/>

                            <Link to={`/dashboard/users/connectors/${userId}`}>
                                <button className="btn btn-sm float-end text-light" style={{backgroundColor:"#592e83"}}>View Connectors</button>
                            </Link>
                            <Link to={`/dashboard/users/update/${userId}`}>
                                <button className="btn btn-sm text-light" style={{backgroundColor:"#592e83"}}>Update Profile</button>
                            </Link>
                        </div>
                    </div>
                </>
            }
        </>
    )
}


export default UserDetail