import axios from "axios";
import { jwtDecode } from 'jwt-decode'; 

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT
});

export const config = () => {
    const TOKEN = localStorage.getItem("authToken");
    const headers = {};
    
    if (TOKEN) {
        headers.Authorization = "Bearer " + TOKEN;
        
        // Decode the token and get the username from it
        const decodedToken = jwtDecode(TOKEN);  // Use jwtDecode here
        const username = decodedToken.username;

        // Optionally, you can store the decoded username in localStorage if needed
        if (username) {
            localStorage.setItem("username", username);
        }
    }

    return {
        headers: headers
    };
};

export default instance;
