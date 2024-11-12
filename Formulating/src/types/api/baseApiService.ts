import axios from 'axios';
import {userData} from "../../stores/userData";

export interface ApiResponse<T> {
    data: T;
    status: number;
}

export class BaseApiService {
    private apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    protected async get(url: string) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            if (userData().debug) {
                console.log(error);
            }
            // Handle error
        }
    }

    protected async post(url: string, data: any) {
        try {
            const response = await axios.post(url, data);
            return response.data;
        } catch (error) {
            if (userData().debug) {
                console.log(error)
            }
            // Handle error
        }
    }

    protected  async delete(url: string, id: number) {
        try {
            const response = await axios.delete(url + id)
            return response.data;
        } catch (error) {
            if (userData().debug) {
                console.log(error)
            }
            // TODO handle error! connect banner or similar...
        }
    }

    protected async update(url: string, data: any) {
        try {
            const response = await axios.post(url, data);
            return response.data;
        } catch (error) {
            if (userData().debug) {
                console.log(error);
            }
        }
    }
}