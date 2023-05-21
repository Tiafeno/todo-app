import {RouteRecordRaw} from 'vue-router';
import {Auth} from 'src/services/Auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to: any, from: any, next: any) => {
      if (!Auth.isAuthenticated()) {
        next({name: 'login'});
      } else next();
    },
    children: [
      {path: '', name: 'task', component: () => import('pages/IndexPage.vue')},
      {path: '/edit/:id', name: 'task-edit', component: () => import('pages/EditTaskPage.vue')}
    ],
  },
  {
    path: '/login',
    beforeEnter: (to: any, from: any, next: any) => {
      if (!Auth.isAuthenticated()) {
        next();
      } else next({name: 'task'});
    },
    component: () => import('layouts/LoginLayout.vue'),
    children: [{path: '', name: 'login', component: () => import('pages/LoginPage.vue')}],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
