import {instanceAxios} from 'src/services/Auth';
import { AxiosResponse} from 'axios';
import {CreateTaskDto, TaskEntity, UpdateTaskDto} from 'components/models';
import {Cookies} from 'quasar';

export class Task {
  static async getAll(): Promise<TaskEntity[]> {
    Task.HttpTokenHelper();
    const response: AxiosResponse<any, TaskEntity[]> = await instanceAxios.get('/task');
    return response.data;
  }

  static async create(data: CreateTaskDto): Promise<TaskEntity> {
    Task.HttpTokenHelper();
    const response: AxiosResponse<any, TaskEntity> = await instanceAxios.post('/task', data);
    return response.data;
  }

  static async update(data: UpdateTaskDto): Promise<TaskEntity> {
    Task.HttpTokenHelper();
    const {id, ...dataInput} = data;
    const response: AxiosResponse<any, TaskEntity> = await instanceAxios.patch(`/task/${id}`, dataInput);
    return response.data;
  }

  static async remove(id: number): Promise<boolean> {
    Task.HttpTokenHelper();
    const response: AxiosResponse = await instanceAxios.delete(`/task/${id}`, {});
    return !!(response.data);
  }

  static async findOne(id: number): Promise<TaskEntity> {
    Task.HttpTokenHelper();
    const response: AxiosResponse = await instanceAxios.get(`/task/${id}`);
    return response.data;
  }

  private static HttpTokenHelper() {
    const token = Cookies.get('jwt-token');
    instanceAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}
