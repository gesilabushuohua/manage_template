/*
 * @Description: des
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/element-variables.scss';
import './assets/css/common.scss';
import './assets/css/reset.css';
import './assets/css/element_reset.css';
import './assets/js/elmentImport.js';
import load from './assets/js/map_load.js';
import imgerr from '../packages/imgerrtip/index.js';
import hasPermission from './directive/permission.js';
import noDataTips from '../packages/nodatatip/noData.js';


// element组件导入
// import './assets/js/elmentImport';

// 自定义权限指令
Vue.directive('imgerr', imgerr);
Vue.directive('hasPermission', hasPermission);
Vue.directive('noDataTips', noDataTips);

Vue.config.productionTip = false;

load().then(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
});

