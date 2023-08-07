import React, {useState,useEffect} from "react"

function Dashboard({authAccessToken, authRefreshToken, setAuthAccessToken, setAuthRefreshToken}){
    document.title = "Convz Backend Test- Dashboard";
    const [totalUsers, setTotalUsers] = useState(0);
    const [verifiedUsers, setVerifiedUsers] = useState(0);
    const [unverifiedUsers, setUnverifiedUsers] = useState(0);

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

    const getDashboardStatistics = () => {

        fetch(`http://127.0.0.1:3300/api/v1/dashboard-statistics`, {
            headers:{
                "Authorization": `Bearer ${authAccessToken}`,
                "Refresh-Token": `Bearer ${authRefreshToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(rsp=>rsp.json())
        .then(data => {
            if (data.message === "Token Expired" || data.message === "Invalid authorization token!" || data.message === "Authorization token missing!") {
                setAuthAccessToken(null);
                setAuthRefreshToken(null);
            }
            setTotalUsers(data.dashboardStats.totalUsers);
            setVerifiedUsers(data.dashboardStats.totalVerifiedUsers);
            setUnverifiedUsers(data.dashboardStats.totalUnverifiedUsers);
        })
    }

    useEffect( () => {
        refreshTokens()
        getDashboardStatistics();
    }, []);
  
    return(
        <div className="col-md-11">
            <div className="row">
                <div className="col-12">
                    <h2 style={{color:"#592e83"}} className="ms-1 py-2">Statistics</h2><hr/>
                </div>
            </div>
            <div className="row" style={{minHeight:"400px", alignItems:'center'}}>
                <div className="dashboardInfo col-md-3 offset-md-1" style={{backgroundColor:"#ffffff", boxShadow: '2px 2px grey'}}>
                    <h5 className="text-center">Number of Users</h5>
                    <p className="text-center">{totalUsers}</p>
                </div>
                <div className="dashboardInfo col-md-3 offset-md-1" style={{backgroundColor:"#ffffff", boxShadow: '2px 2px grey'}}>
                    <h5 className="text-center">Verified Users</h5>
                    <p className="text-center">{verifiedUsers}</p>
                </div>
                <div className="dashboardInfo col-md-3 offset-md-1" style={{backgroundColor:"#ffffff", boxShadow: '2px 2px grey'}}>
                    <h5 className="text-center">Unverified Users</h5>
                    <p className="text-center">{unverifiedUsers}</p>
                </div>
            </div>
        </div>
    )
}


export default Dashboard