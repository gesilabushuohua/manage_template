/* 
@function 基于 element-UI 框架，表格生成器
 */
<template>
  <div class="contain">
    <div class="default wrapper">
      <div class="inline-item">
        <p class="title">
          <span>表格</span>
          <span>复制代码</span>
        </p>
      </div>
      <div class="inline-item" :class="visible.tableStructError?'block-error':''">
        <p class="title">
          <span>表格渲染结构</span>
          <span @click="handleUpdateTabelStruct">运行</span>
        </p>
        <div class="text-area">
          <el-input
            v-model="tableStructStr"
            clearable
            type="textarea"
            :autosize="{ minRows: 20,maxRows: 25}"
            placeholder="请输入内容"
          />
          <p v-show="visible.tableStructError" class="error">JSON 字符串有非法字符，解析失败</p>
        </div>
      </div>
      <div class="inline-item" :class="visible.dataStructError?'block-error':''">
        <p class="title">
          <span>数据结构</span>
          <span @click="handleUpdateDataStruct">运行</span>
        </p>
        <div class="text-area">
          <el-input
            v-model="dataStructStr"
            clearable
            type="textarea"
            :autosize="{ minRows: 20,maxRows: 25}"
            placeholder="请输入内容"
          />
          <p v-show="visible.dataStructError" class="error">JSON 字符串有非法字符，解析失败</p>
        </div>
      </div>
    </div>
    <!-- <div class="copy-wrapper"></div> -->
  </div>
</template>

<script>
export default {
  name: 'TableBuilderEle',
  components: {},
  props: {},
  data() {
    return {
      textarea1: '',
      textarea2: '',

      // 表格渲染结构
      tableStruct: {
        column: {
          date: { title: '日期', prop: 'date' },
          name: { title: '姓名', prop: 'name' },
          address: { title: '地址', prop: 'address' }
        }
      },

      // 表格渲染结构字符串
      tableStructStr: '',

      dataStruct: {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      },

      // 数据结构字符串
      dataStructStr: '',
      tableData: [],
      visible: {
        dataStructError: false,
        tableStructError: false
      }
    };
  },

  watch: {},
  created() {},
  mounted() {
    this.dataStructStr = JSON.stringify(this.dataStruct, null, 2);
    this.tableStructStr = JSON.stringify(this.tableStruct, null, 2);
  },
  methods: {
    
    // 更新表格渲染结构
    handleUpdateTabelStruct() {
      let obj = {};
      try {
        obj = JSON.parse(this.tableStructStr);
        this.tableStructStr = JSON.stringify(obj, null, 2);
      } catch (err) {
        this.visible.tableStructError = true;
        return;
      }
      this.visible.tableStructError = false;
      this.tableStruct = { ...obj };
      this.updateDataStructByTableStruct();
    },

    updateDataStructByTableStruct() {
      const {
        dataStruct,
        tableStruct: { column }
      } = this;
      const addParamFn = () => {
        return 'val';
      };
      const newStruct = this.changeFieldsByParams(
        addParamFn,
        dataStruct,
        column
      );
      this.dataStruct = { ...newStruct };
      this.dataStructStr = JSON.stringify(this.dataStruct, null, 2);
    },

    // 跟新数据结构
    handleUpdateDataStruct() {
      let obj = {};
      try {
        obj = JSON.parse(this.dataStructStr);
        this.dataStructStr = JSON.stringify(obj, null, 2);
      } catch (err) {
        this.visible.dataStructError = true;
        return;
      }
      this.visible.dataStructError = false;
      this.dataStruct = { ...obj };
      this.updateTableStructByDataStruct();
    },

    // 根据 datastruct，添加|删除列,更新 tableStruct，tableStructStr
    updateTableStructByDataStruct() {
      const {
        dataStruct,
        tableStruct: { column }
      } = this;
      const addParamFn = key => {
        return { title: 'name', prop: key };
      };
      const newCol = this.changeFieldsByParams(addParamFn, column, dataStruct);
      this.tableStruct.column = { ...newCol };
      this.tableStructStr = JSON.stringify(this.tableStruct, null, 2);
    },

    /* 
    @function 辅助，根据 byParams 字段结构，增|删 uParams 字段
    @param addParamFn 被添加默认值
    @param uParams 被编辑参数
    @param byParams 根据参数
    @return Object 返回结果对象
    */
    changeFieldsByParams(addParam, uParams, byParams) {
      uParams = this.removeFieldsByParams(uParams, byParams);
      uParams = this.addFieldsByParams(addParam, uParams, byParams);
      return uParams;
    },

    /* 
    @function 辅助，根据 byParams 字段结构，删 uParams 字段
    @param uParams 被编辑参数
    @param byParams 根据参数
    @return Object 返回结果对象
    */
    removeFieldsByParams(uParams, byParams) {
      for (let key in uParams) {
        if (!byParams[key]) {
          delete uParams[key];
        }
      }
      return uParams;
    },

    /* 
    @function 辅助，根据 byParams 字段结构，增 uParams 字段
    @param addParamFn 被添加默认值
    @param uParams 被编辑参数
    @param byParams 根据参数
    @return Object 返回结果对象
    */
    addFieldsByParams(addParamFn, uParams, byParams) {
      for (let key in byParams) {
        if (!uParams[key]) {
          uParams[key] = addParamFn(key);
        }
      }
      return uParams;
    }
  }
};
</script>
<style lang="scss" scoped>
.contain {
  height: 100%;
  background-color: #ebebeb;
}

.wrapper {
  display: flex;
  height: 100%;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;

  .inline-item {
    padding: 5px;
    height: 95vh;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: #fff;
  }

  .inline-item:nth-child(1) {
    width: 50%;
  }

  .inline-item:nth-child(2) {
    width: 23%;
  }

  .inline-item:nth-child(3) {
    width: 23%;
  }

  .title {
    margin: 10px 20px;
    padding-bottom: 2px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ebebeb;

    > span:nth-child(1) {
      float: left;
    }
    > span:nth-child(2) {
      float: right;
      padding: 0 5px;
      cursor: pointer;
      font-size: 14px;
      border-radius: 5px;
      color: #fff;
      background-color: #09c;
    }

    > span:nth-child(2):hover {
      background-color: #06c;
    }
  }

  .text-area {
    margin: 10px 20px;
  }
}

.block-error {
  background-color: rgba(255, 0, 0, 0.1) !important;
}

.error {
  color: #f00;
}
</style>