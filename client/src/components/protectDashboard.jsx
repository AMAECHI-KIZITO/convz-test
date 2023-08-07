import React from "react"
import { Navigate } from "react-router-dom"


const ProtectDashboard = ({children, authRefreshToken, authAccessToken}) => {
    if(!authRefreshToken || !authAccessToken){
        return <Navigate to="/"/>
    }
    return children;
}

export default ProtectDashboard