import axios from 'axios';

export const normalizeApiBaseUrl = (baseUrl: string): string =>
    baseUrl.replace(/\/+$/, '').replace(/\/api$/, '');

const productionApiBaseUrl = 'https://api.tiles.town';
const resolvedApiBaseUrl = import.meta.env.PROD
    ? normalizeApiBaseUrl(productionApiBaseUrl)
    : '/';

export default axios.create({
    baseURL: resolvedApiBaseUrl,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});
