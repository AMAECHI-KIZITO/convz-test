import React, { useState, useEffect } from 'react';
import {Route, Routes, BrowserRouter} from "react-router-dom";

import Loginpage from "./components/login";
import Signup from './components/signup';
import ProtectDashboard from './components/protectDashboard';
import SharedDashboardLinks from './components/sharedDashboardLinks';
import Dashboard from './components/dashboard';
import SharedUsersLayout from './components/sharedUsersLayout';
import AllUsers from './components/users';
import CreateUser from './components/createUser';
import CreateConnector from './components/createConnector';
import UserDetail from './components/userDetail';
import UserConnectors from './components/userConnectors';
import CreateReport from './components/createReport';
import UserReports from './components/userReports';
import UpdateUser from './components/updateUser';

function App() {
  const [authAccessToken, setAuthAccessToken] = useState(null);
  const [authRefreshToken, setAuthRefreshToken] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Loginpage setAuthAccessToken={setAuthAccessToken} setAuthRefreshToken={setAuthRefreshToken}/>} />

          <Route path="create-account" element={<Signup/>} />

          <Route path='dashboard' element={ 
            <ProtectDashboard authAccessToken={authAccessToken} authRefreshToken={authRefreshToken}>
              <SharedDashboardLinks authAccessToken={authAccessToken} authRefreshToken={authRefreshToken} setAuthAccessToken={setAuthAccessToken} setAuthRefreshToken={setAuthRefreshToken}/> 
            </ProtectDashboard>
          }>

            <Route index element = {<Dashboard authAccessToken={authAccessToken} authRefreshToken={authRefreshToken} setAuthAccessToken={setAuthAccessToken} setAuthRefreshToken={setAuthRefreshToken}/>} />

            <Route path="register-user" element={<CreateUser authAccessToken={authAccessToken} authRefreshToken={authRefreshToken} setAuthAccessToken={setAuthAccessToken} setAuthRefreshToken={setAuthRefreshToken}/>} />

            <Route path="new-connector" element={<CreateConnector authAccessToken={authAccessToken} authRefreshToken={authRefreshToken} setAuthAccessToken={setAuthAccessToken} setAuthRefreshToken={setAuthRefreshToken}/>} />

            <Route path="new-report" element={<CreateReport authAccessToken={authAccessToken} authRefreshToken={authRefreshToken} setAuthAccessToken={setAuthAccessToken} setAuthRefreshToken={setAuthRefreshToken}/>} />

            <Route path="users" element={<SharedUsersLayout authAccessToken={authAccessToken} authRefreshToken={authRefreshToken} setAuthAccessToken={setAuthAccessToken} setAuthRefreshToken={setAuthRefreshToken}/>}>

              <Route index element={ <AllUsers authAccessToken={authAccessToken} authRefreshToken={authRefreshToken} setAuthAccessToken={setAuthAccessToken} setAuthRefreshToken={setAuthRefreshToken}/> } />
              
              <Route path=":userId" element={ <UserDetail authAccessToken={authAccessToken} authRefreshToken={authRefreshToken} setAuthAccessToken={setAuthAccessToken} setAuthRefreshToken={setAuthRefreshToken}/> } />

              <Route path="connectors/:userId" element={ <UserConnectors authAccessToken={authAccessToken} authRefreshToken={authRefreshToken} setAuthAccessToken={setAuthAccessToken} setAuthRefreshToken={setAuthRefreshToken}/> } />

              <Route path="update/:userId" element={ <UpdateUser authAccessToken={authAccessToken} authRefreshToken={authRefreshToken} setAuthAccessToken={setAuthAccessToken} setAuthRefreshToken={setAuthRefreshToken}/> } />

              <Route path="reports/:userId" element={ <UserReports authAccessToken={authAccessToken} authRefreshToken={authRefreshToken} setAuthAccessToken={setAuthAccessToken} setAuthRefreshToken={setAuthRefreshToken}/> } />
            </Route>
            
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
