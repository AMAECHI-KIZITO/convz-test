import React, {useState, useEffect} from "react";
import Select from 'react-select';

function CreateReport({authAccessToken, authRefreshToken, setAuthAccessToken, setAuthRefreshToken}){
    document.title='Convz Backend Test - Create Report';

    const [allUsers, setAllUsers] = useState('loading');
    const [reportName, setReportName] = useState(null);
    const [reportUser, setReportUser] = useState('#');

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

    const getAllUsers = () => {
        fetch(`http://127.0.0.1:3300/api/v1/users`, {
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
            setAllUsers(data.users);
        })
    }

    useEffect( () => {
        refreshTokens();
        getAllUsers();
    }, []);

    const createReport = async (event) => {
        event.preventDefault();
        if(!reportName || reportUser == '#' || reportName.trim().length === 0){
            alert('Form inaccurately filled!')
            return;
        }

        let newReportCredentials = {
            reportName, reportUser
        };

        fetch("http://127.0.0.1:3300/api/v1/new-report",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authAccessToken}`,
                "Refresh-Token": `Bearer ${authRefreshToken}`
            },
            body: JSON.stringify(newReportCredentials)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Token Expired" || data.message === "Invalid authorization token!" || data.message === "Authorization token missing!") {
                setAuthAccessToken(null);
                setAuthRefreshToken(null);
            }
            alert(data.message);
            document.getElementById("reportNameInput").value = '';
            document.getElementById("reportUser").value = '#';
        });
    }

  return(
    <>
        <main className="container-fluid pt-3 px-4" style={{backgroundColor:"#d9d9d9"}}>
            <div className="mt-2 d-flex " style={{minHeight:"97vh", flexDirection:"column"}}>
                <div className="row py-4 mb-2">
                    <div className="col-12">
                        <h2 style={{color:"#592e83"}} className="ms-1 py-2">New Report</h2><hr/>
                    </div>
                    <div className="col-12">
                        <form onSubmit={createReport}>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="reportNameInput" placeholder="reportName" onChange={(event)=>setReportName(event.target.value)}/>
                                <label htmlFor="reportNameInput">Name of Report</label>
                            </div>
                            <div className="mb-3">
                                <select className="form-select" onChange={(event)=>setReportUser(event.target.value)} name="reportUser" id='reportUser'>
                                    <option value="#" key='#'>Choose the user to assign report</option>
                                    {Object.values(allUsers).map(user => <option value={user.userId} key={user.userId}>{user.firstname} {user.lastname}</option>)}
                                </select>
                            </div>
                            <div>
                                <button className="btn text-light form-control" id="btnCreateReport" style={{backgroundColor:"#592e83"}}>Create Report</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>                
        </main>
    </>
  )
}


export default CreateReport