import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

export default axios.create({
    baseURL: apiBaseUrl || '/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});
