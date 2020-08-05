/*
 * @Description: 简单检索栏，包含 input、select 类型，依赖 elementUI el-input el-select
 * @Date: 2020-06-15 11:32:13
 * @Author: LB
 */
import Vue from 'vue';

/* 
query 数据结构
[
  // 输入框
  {
    type:'input', 
    key:'', 
    value:'', 
    label:'', // 标签
    placeholder:''
  },
  // 多选框
  {
    type:'select', 
    key:'', 
    value:'', 
    label:'', // 标签
    placeholder:'',
    options:[ // 选项
      {
        label:'',
        value:''
      }
    ] 
  }
]
*/

export const SimpleQuery = Vue.component('simple-query', {
  name: 'SimpleQueryJSX',
  props: {

    // 检索项
    querys: {
      type: Array,
      default: () => []
    }

  },
  data() {
    return {};
  },

  render(h) {

    const createOptions = (options) => {
      return options.map(option => h('el-option', {
        props: {
          label: option.label,
          value: option.value
        }
      }));
    };

    const createSelect = (item) => {
      let { value, placeholder, options } = item;
      return h('el-select', {
        props: {
          value,
          placeholder,
          size: 'small',
          clearable: true
        },
        on: {
          change: (val) => {
            item.value = val;
            this.search();
          }
        }
      }, createOptions(options));
    };

    const createInput = (item) => {
      return h('el-input', {
        props: {
          value: item.value,
          placeholder: item.placeholder,
          size: 'small',
          clearable: true
        },
        on: {
          input(val) {
            item.value = val;
          },
          keypress: (event) => {
            const { keyCode } = event;
            const enterKeyCode = 13;
            if (keyCode === enterKeyCode) {
              this.search();
            }
          }
        }
      });
    };

    const createLabel = (label) => h('span', {
      class: 'label',
      domProps: {
        innerHTML: label
      }
    });

    const children = this.querys.map(item => {
      const { type, label } = item;
      let res = null;

      switch (type) {
        case 'input':
          res = createInput(item);
          break;
        case 'select':
          res = createSelect(item);
          break;
        default:
          break;
      }

      if (res) {
        return h('div', { class: 'item' }, [createLabel(label), res]);
      }
      return '';
    });

    return h(
      'div',
      {
        class: 'simply-query'
      },
      children
    );

  },
  methods: {
    
    getQueryParams() {
      const params = {};
      this.querys.forEach(item => {
        const { key, value } = item;
        const arrayType = 'array';
        const isValidArray = typeof value === arrayType && value.length > 0;
        if (value !== '' || isValidArray) {
          params[key] = value;
        }
      });
      return params;
    },
    search() {
      this.$emit('search');
    }
  }
});

