import React, {useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";


function UserConnectors({authAccessToken, authRefreshToken, setAuthAccessToken, setAuthRefreshToken}){
    document.title='Convz Backend Test - User Profile';

    const {userId} = useParams();
    const[userConnectors, setUserConnectors] = useState([]);
    const[userName, setUserName] = useState('');
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

    const getUserConnectors = () => {
        fetch(`http://127.0.0.1:3300/api/v1/connectors/${userId}`, {
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
            setUserConnectors(data.connectors);
            setUserName(data.userName);
            setLoadData("loaded");
        })
    }

    useEffect( () => {
        refreshTokens();
        getUserConnectors();
    }, []);

    const deleteConnector = (connId) => {
        fetch("http://127.0.0.1:3300/api/v1/delete-connector",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authAccessToken}`,
                "Refresh-Token": `Bearer ${authRefreshToken}`
            },
            body: JSON.stringify({connId: connId})
        })
        .then(response => response.json())
        .then(data => {
            alert("Connector Deleted Successfully");
            getUserConnectors();
            return
        })
    }

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
                        {userName} Connectors
                    </h2> <hr/>

                    <div className="row">
                        <div className="col-md-11" style={{color:'#592e83'}}>
                            {
                                userConnectors.length === 0
                                ?
                                <div className="row align-items-center" style={{minHeight:'400px'}}>
                                    <div className="col">
                                        <h4 className="text-center" style={{color:"grey"}}>No connectors mapped to this user</h4>
                                    </div>
                                </div>
                                :
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>S/N</th>
                                            <th>Name</th>
                                            <th>Service</th>
                                            <th>Sync</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            {/* <th>Action</th> */}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            userConnectors.map(connector=>
                                                <tr key={connector.connId}>
                                                    <td>{connector.serialNo}</td>
                                                    <td>{connector.name}</td>
                                                    <td>{connector.service}</td>
                                                    <td>{connector.sync}</td>
                                                    <td>{connector.status}</td>
                                                    <td>{connector.dateCreated}</td>
                                                    {/* <td><button className="btn btn-sm text-light" style={{backgroundColor: "#592e83"}} onClick={deleteConnector(connector.connId)}>Delete</button></td> */}
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </>
            }
        </>
    )
}


export default UserConnectors