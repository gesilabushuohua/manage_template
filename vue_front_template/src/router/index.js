import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import('@/views/Login');
const Layout = () => import('@/views/Layout');
const About = () => import('@/views/About');
const Home = () => import('@/views/Home');
const TableBuilderEle = () => import('@/views/builder/TableBuilderEle');

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
    component: Layout,
    children: [
      {
        path: '/about',
        name: 'about',
        component: About
      },
      {
        path: '/h2',
        name: 'h2',
        component: Home
      }
    ]
  },
  {
    path: '/tableBuilderEle',
    name: 'tableBuilderEle',
    component: TableBuilderEle
  }
];

const router = new VueRouter({
  routes
});

export default router;
