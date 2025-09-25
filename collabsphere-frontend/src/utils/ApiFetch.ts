import { store } from '../store/store';
/**
 * create centralized fetch function to overcome the set accesstoken headach and content-type
 */
export default async function apiFetch(url: string, options: RequestInit = {}) {
    const accessToken: string | null = store.getState().LoginReducer.accessToken;

    /**
     * set content type and token if not null
     */
    const headers = {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(options.headers || {}),
    }

    const apiResponse: Response = await fetch(url, { ...options, headers });
    return apiResponse;
}