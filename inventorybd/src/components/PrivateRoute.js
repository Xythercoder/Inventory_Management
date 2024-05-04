import React from "react";
import { Redirect } from "react-router-dom";
import { Route } from "react-router-dom";

const PrivateRoute = ( rest ) => {
    return (
        <Route
            {...rest}
            component={() => {
                if ( !localStorage.getItem( "authToken" ) ) {
                    return <Redirect to="/" />;
                }
                return <rest.component {...rest} />;
            }}
        />
    );
};

export default PrivateRoute;