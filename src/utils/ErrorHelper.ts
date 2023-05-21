import axios from 'axios';
import {isArray, isObjectLike, join} from 'lodash';

export function ErrorHelper(e: any): string {
  if (axios.isAxiosError(e) && e.response) {
    const errorData = e.response.data;
    return isArray(errorData.message) ? join(errorData.message, ', ') : errorData.message;
  }
  return isObjectLike(e) ? (e?.message ?? '') : 'Une erreur s\'est produite';
}
