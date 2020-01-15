import Vue from 'vue';
import VueRouter from 'vue-router';


const Login = () => import('@/views/Login');
const Layout = () => import('@/views/Layout');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Layout
  }
];

const router = new VueRouter({
  routes
});

export default router;
