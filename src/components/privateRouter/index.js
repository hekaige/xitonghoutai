import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { getToken } from "../../utils/cookies";
console.log(getToken());
console.log("1111111111");
const PrivateRouter = ({component:Component,...rest})=>{
    return(
        <Route {...rest} render={routeProps =>(
            //返回ture有权限   返回flas没权限
            getToken ? <Component {...routeProps}/>:<Redirect to="/admin/NoAuth"/>
        )}
/>
    );
}

export default PrivateRouter;