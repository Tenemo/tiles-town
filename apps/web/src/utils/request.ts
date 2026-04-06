import axios from 'axios';

export const normalizeApiBaseUrl = (baseUrl: string): string =>
    baseUrl.replace(/\/+$/, '').replace(/\/api$/, '');

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL as
    | string
    | undefined;
const resolvedApiBaseUrl = configuredApiBaseUrl?.trim()
    ? normalizeApiBaseUrl(configuredApiBaseUrl.trim()) || '/'
    : '/';

export default axios.create({
    baseURL: resolvedApiBaseUrl,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});
