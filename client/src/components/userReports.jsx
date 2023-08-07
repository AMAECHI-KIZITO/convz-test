import React, {useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";


function UserReports({authAccessToken, authRefreshToken, setAuthAccessToken, setAuthRefreshToken}){
    document.title='Convz Backend Test - User Profile';

    const {userId} = useParams();
    const[userReports, setUserReports] = useState([]);
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

    const getUserReports = () => {
        fetch(`http://127.0.0.1:3300/api/v1/reports/${userId}`, {
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
            setUserReports(data.reports);
            setUserName(data.userName);
            setLoadData("loaded");
        })
    }

    useEffect( () => {
        refreshTokens();
        getUserReports();
    }, []);

    const deleteReport = (reportId) => {
        fetch("http://127.0.0.1:3300/api/v1/delete-connector",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authAccessToken}`,
                "Refresh-Token": `Bearer ${authRefreshToken}`
            },
            body: JSON.stringify({reportId: reportId})
        })
        .then(response => response.json())
        .then(data => {
            alert("Connector Deleted Successfully");
            getUserReports();
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
                        {userName} Reports
                    </h2> <hr/>

                    <div className="row">
                        <div className="col-md-11" style={{color:'#592e83'}}>
                            {
                                userReports.length === 0
                                ?
                                <div className="row align-items-center" style={{minHeight:'400px'}}>
                                    <div className="col">
                                        <h4 className="text-center" style={{color:"grey"}}>No Reports associated to this user</h4>
                                    </div>
                                </div>
                                :
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>S/N</th>
                                            <th>Name of Report</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            userReports.map(rep=>
                                                <tr key={rep.repId}>
                                                    <td>{rep.serialNo}</td>
                                                    <td>{rep.name}</td>
                                                    <td>{rep.dateCreated}</td>
                                                    <td>
                                                        <button className="btn btn-sm text-light" style={{backgroundColor: "#592e83"}}>Add Connector</button>
                                                    </td>
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


export default UserReports