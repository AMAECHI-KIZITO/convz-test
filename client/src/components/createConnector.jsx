import React, {useState, useEffect} from "react";


function CreateConnector({authAccessToken, authRefreshToken, setAuthAccessToken, setAuthRefreshToken}){
    document.title='Convz Backend Test - Create Connector';

    const [allUsers, setAllUsers] = useState('loading');
    const [connectorName, setConnectorName] = useState(null);
    const [connectorService, setConnectorService] = useState('#');
    const [connectorUser, setConnectorUser] = useState("#");
    const [sync, setSync] = useState('#');
    const [connectorStatus, setConnectorStatus] = useState('#');

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

    const createConnector = async (event) => {
        event.preventDefault();
        if(!connectorName || connectorService == '#' || connectorUser == '#'|| sync=='#' || connectorStatus == '#' || connectorName.trim().length === 0){
            alert('Form inaccurately filled!')
            return;
        }

        let newConnectorCredentials = {
            connectorName, connectorService, connectorUser, sync, connectorStatus
        };

        fetch("http://127.0.0.1:3300/api/v1/new-connector",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authAccessToken}`,
                "Refresh-Token": `Bearer ${authRefreshToken}`
            },
            body: JSON.stringify(newConnectorCredentials)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Token Expired" || data.message === "Invalid authorization token!" || data.message === "Authorization token missing!") {
                setAuthAccessToken(null);
                setAuthRefreshToken(null);
            }
            alert(data.message);
            document.getElementById("connectorNameInput").value = '';
            document.getElementById("connectorService").value = '#';
            document.getElementById("connectorUser").value = '#';
            document.getElementById("syncStatus").value = '#';
            document.getElementById("connectorStatus").value = '#';
        });
    }

  return(
    <>
        <main className="container-fluid pt-3 px-4" style={{backgroundColor:"#d9d9d9"}}>
            <div className="mt-2 d-flex " style={{minHeight:"97vh", flexDirection:"column"}}>
                <div className="row py-4 mb-2">
                    <div className="col-12">
                        <h2 style={{color:"#592e83"}} className="ms-1 py-2">Create Connector</h2><hr/>
                    </div>
                    <div className="col-12">
                        <form onSubmit={createConnector}>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="connectorNameInput" placeholder="connectorName" onChange={(event)=>setConnectorName(event.target.value)}/>
                                <label htmlFor="connectorNameInput">Name of Connector</label>
                            </div>
                            <div className="mb-3">
                                <select className="form-select" onChange={(event)=>setConnectorService(event.target.value)} name="connectorService" id='connectorService'>
                                    <option value="#" key='#'>Choose the connector service</option>
                                    <option value="adjust" key='Adjust'>Adjust</option>
                                    <option value="asana" key='Asana'>Asana</option>
                                    <option value="magneto" key='Magneto'>Magneto</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <select className="form-select" onChange={(event)=>setConnectorUser(event.target.value)} name="connectorUser" id='connectorUser'>
                                    <option value="#" key='#'>Select the connector user</option>
                                    {Object.values(allUsers).map(user => <option value={user.userId} key={user.userId}>{user.firstname} {user.lastname}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <select className="form-select" onChange={(event)=>setSync(event.target.value)} name="syncStatus" id='syncStatus'>
                                    <option value="#" key='#'>Sync Status</option>
                                    <option value="ON" key='on'>ON</option>
                                    <option value="OFF" key='off'>OFF</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <select className="form-select" onChange={(event)=>setConnectorStatus(event.target.value)} name="connectorStatus" id='connectorStatus'>
                                    <option value="#" key='#'>Connector Status</option>
                                    <option value="Connected" key='connected'>Connected</option>
                                    <option value="In Progress" key='in progress'>In Progress</option>
                                </select>
                            </div>
                            <div>
                                <button className="btn text-light form-control" id="btnCreateConnector" style={{backgroundColor:"#592e83"}}>Create Connector</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>                
        </main>
    </>
  )
}


export default CreateConnector