/*
 * @Description: des
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import('@/views/Login.vue');
const Layout = () => import('@/views/Layout.vue');
const About = () => import('@/views/About.vue');
const Home = () => import('@/views/Home.vue');
const TableBuilderEle = () => import('@/views/builder/TableBuilderEle.vue');
const FormTemplateEle = () => import('@/views/template/FormTemplateEle.vue');

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
  },
  {
    path: '/formTemEle',
    name: 'FormTemplateEle',
    component: FormTemplateEle
  }
];

const router = new VueRouter({
  routes
});

export default router;
