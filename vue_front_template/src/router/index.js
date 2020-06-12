/*
 * @Description: des
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import('@/views/Login.vue');
const SideLayout = () => import('@/views/SideLayout.vue');
const TopLayout = () => import('@/views/TopLayout.vue');
const About = () => import('@/views/About.vue');
const Home = () => import('@/views/Home.vue');
const BaseTable = () => import('@/views/BaseTable.vue');


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/side',
    name: 'side',
    component: SideLayout,
    children: [
      {
        path: 'table',
        name: 'table',
        component: BaseTable
      }
    ]
  },
  {
    path: '/top',
    name: 'top',
    component: TopLayout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home
      },
      {
        path: 'h2',
        name: 'h2',
        component: Home
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
