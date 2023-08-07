import React from "react"
import {Link, Outlet} from "react-router-dom"


function SharedDashboardLinks({setAuthAccessToken, setAuthRefreshToken}){
    const logout=()=>{
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAuthAccessToken(null);
        setAuthRefreshToken(null);
    }

    const closeMenu = () => {
        document.getElementById('closeMenuOffCanvas').click();
    }

    return(
        <>
            <div className="row">
                <div className="col-12">
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <div className="container-fluid">
                            <a className="navbar-brand">Convz Backend Test</a>
                            <button className='btn btn-success float-end d-md-none' type="button" data-bs-toggle="offcanvas" data-bs-target="#convzBackendLinks" aria-controls="convzBackendLinks" style={{backgroundColor:"#592e83"}}>
                                <i className="fa-solid fa-bars"></i>
                            </button>
                        </div>
                    </nav>
                </div>
            </div>

            <div className="row dashboardlinks" style={{minHeight:'580px'}}>
                <div className="col-md-3 d-none d-md-block" id="dashboardNav">
                    <div className='row'>
                        <div className='col'>
                            <p className="text-center my-4"><Link to="/dashboard" style={{textDecoration: 'none', color: "#592e83"}}>Dashboard</Link></p>
                            <p className="text-center my-4"><Link to="/dashboard/users" style={{textDecoration: 'none', color: "#592e83"}}>All Users</Link></p>
                            <p className="text-center my-4"><Link to="/dashboard/register-user" style={{textDecoration: 'none', color: "#592e83"}}>Create User</Link></p>
                            <p className="text-center my-4"><Link to="/dashboard/new-connector" style={{textDecoration: 'none', color: "#592e83"}}>Create Connector</Link></p>
                            <p className="text-center my-4"><Link to="/dashboard/new-report" style={{textDecoration: 'none', color: "#592e83"}}>Create Report</Link></p>
                        </div>
                    </div>


                    <div className='row'>
                        <div className='col'>
                            <p className="text-center" style={{position:'sticky', bottom:'0px'}}><button className="btn btn-sm text-light" style={{backgroundColor: "#592e83"}} onClick={logout}>Sign Out</button></p>
                        </div>
                    </div>

                </div>


                


                <div className="col-md-9" style={{borderLeft:"1px solid"}}>
                    <Outlet/>
                </div>
            </div>


            <div id="OffcanvasSection">
                <div className="offcanvas offcanvas-start" tabIndex="-1" id="convzBackendLinks" aria-labelledby="debuggerApp" style={{backgroundColor:"#d9d9d9"}}>

                
                    <div className="offcanvas-header">
                        <h5 id="debuggerApp" className="text-dark">Quick Links</h5>
                        <button type="button" id="closeMenuOffCanvas" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" style={{backgroundColor:"#592e83"}}></button>
                    </div>


                    <div className="row offcanvas-body">
                        <p className="text-center"><Link to="/dashboard" onClick={closeMenu} style={{textDecoration: 'none', color: "#592e83"}}>Dashboard</Link></p>

                        <p className="text-center"><Link to="/dashboard/users" onClick={closeMenu} style={{textDecoration: 'none', color: "#592e83"}}>All Users</Link></p>

                        <p className="text-center"><Link to="/dashboard/register-user" onClick={closeMenu} style={{textDecoration: 'none', color: "#592e83"}}>Create User</Link></p>

                        <p className="text-center"><Link to="/dashboard/new-connector" onClick={closeMenu} style={{textDecoration: 'none', color: "#592e83"}}>Create Connector</Link></p>

                        <p className="text-center"><Link to="/dashboard/new-report" onClick={closeMenu} style={{textDecoration: 'none', color: "#592e83"}}>Create Report</Link></p>


                        <p className="text-center"><button className="btn text-light btn-sm" onClick={logout} style={{backgroundColor: "#592e83"}}>Sign Out</button></p>
                    </div>
                </div>
            </div>
        </>
    )
}


export default SharedDashboardLinks