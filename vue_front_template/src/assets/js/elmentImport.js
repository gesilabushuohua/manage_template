import {
  Input,
  Menu,
  MenuItem,
  Button,
  ButtonGroup,
  Select,
  Option,
  Form,
  FormItem,
  Checkbox,
  Tree,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Transfer,
  Tabs,
  TabPane,
  Loading,
  Message,
  MessageBox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Upload
} from 'element-ui';
import Vue from 'vue';

const components = {
  Input,
  Menu,
  MenuItem,
  Button,
  ButtonGroup,
  Select,
  Option,
  Form,
  FormItem,
  Checkbox,
  Tree,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Transfer,
  Tabs,
  TabPane,
  Loading,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Upload
};

for (let key in components) {
  Vue.use(components[key]);
}

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;

// Vue.use(Loading.directive);
// Vue.prototype.$loading = Loading.service;
// Vue.prototype.$messageBox = MessageBox;
