import {AuthEntity, LoginForm} from 'components/models';
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {Cookies} from 'quasar';

export const instanceAxios: AxiosInstance = axios.create({
  baseURL: process.env.SERVER_URI ?? '',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export class Auth {
  static async signIn({email, password}: LoginForm): Promise<AxiosResponse> {
    const data = {
        email,
        password
    }
    return await instanceAxios.post('/auth', data);
  }

  static isAuthenticated(): boolean {
    const token = Cookies.get('jwt-token');
    return !!token;
  }
}
