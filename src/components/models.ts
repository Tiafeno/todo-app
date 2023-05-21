import {ref} from 'vue';

export interface UserEntity {
  uid: number;
  name: string;
  email: string;
}

export interface TokenEntity {
  access_token: string;
  expiresIn: number;
}

export interface AuthEntity {
  payload: UserEntity;
  key: TokenEntity
}

export interface TaskEntity {
  id: number;
  detail: string;
  priority: number;
  finished: boolean;
  createdAt: string;
  updatedAd: string;
  children?: TaskEntity[];
  parent?: TaskEntity;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface CreateTaskDto {
  detail: string;
  parentId?: number | null;
  priority?: number;
}

export interface UpdateTaskDto extends CreateTaskDto {
  id: number;
  priority?: number;
  finished?: boolean;
}


export const errorMessage = ref<string>('');
export  const userData = ref<UserEntity | undefined>(undefined);
