import axios from "axios";

const instance = axios.create( {
    baseURL: process.env.REACT_APP_API_ENDPOINT
} );

export const config = () => {
    const TOKEN = localStorage.getItem( "authToken" );
    const headers = {};
    if ( TOKEN ) {
        headers.Authorization = "Bearer " + TOKEN;
    }
    return {
        headers: headers
    };
};

export default instance;
