import React,{useState, useEffect} from "react"
import { Link } from "react-router-dom"


const AllUsers=({authAccessToken, authRefreshToken, setAuthAccessToken, setAuthRefreshToken}) => {
    const [allUsers, setAllUsers] = useState('loading');
    document.title = 'Convz Backend Test - All Users';

    const getAllUsers = () => {
        const adminRefreshToken = {authRefreshToken};
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
                fetch(`http://127.0.0.1:3300/api/v1/auth/refresh-tokens/`, {
                    method: "POST",
                    headers:{
                        "Refresh-Token": `Bearer ${authRefreshToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(adminRefreshToken)
                })
                .then(rsp => rsp.json())
                .then(data => {
                    if (data.status != 200) {
                        setAuthAccessToken(null);
                        setAuthRefreshToken(null);
                    }
                    setAuthAccessToken(data.userAuth.accessToken);
                    setAuthRefreshToken(data.userAuth.refreshToken);
                    getAllUsers()
                })
            }
            setAllUsers(data.users);
        })
    }

    useEffect( () => {
        getAllUsers()
    }, []);

    
    return(
        <>
            <div className="row">
                <div className="col-md-11">
                    <div className="row">
                        <div className="col-12">
                            <h2 style={{color:"#592e83"}} className="ms-1 py-2">All Users</h2><hr/>

                            {( typeof allUsers === 'string' )?(
                                    <div className="row" style={{minHeight:"300px", alignItems:"center"}}>
                                        <div className="col-12 text-center" style={{color:"#592e83"}}>
                                            <h3>No Users Registered</h3>
                                            <p>Create a user by clicking below</p>
                                            <Link to="/dashboard/register-user"><button className="btn btn-sm text-light" style={{backgroundColor: "#592e83"}}>Create User</button></Link>
                                        </div>
                                            
                                    </div>
                                ):(
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>S/N</th>
                                                <th>Name</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.values(allUsers).map(user => 
                                                <tr key={user.userId}>
                                                    <td>{user.serialNo}</td>
                                                    <td>{user.firstname} {user.lastname}</td>
                                                    <td>
                                                        <Link to={`/dashboard/users/${user.userId}`}>
                                                            <button className="btn btn-sm text-light" style={{backgroundColor: "#592e83"}}>View</button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AllUsers