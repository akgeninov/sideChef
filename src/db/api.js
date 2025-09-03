import axios from 'axios';

const BASE_URL = 'http://192.168.56.1/sideChef/db_sideChef.php'; 

export const registerUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/?op=register_user`, {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        return { data: { result: 'User Register Failed' } };
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}?op=login_user`, {
            email,
            password
        });
        console.log('Login response:', BASE_URL);
        console.log('Login response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        return { data: { result: 'Login Failed' } };
    }
};

