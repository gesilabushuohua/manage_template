/* 
@function 基于 element-UI 框架，表格生成器
使用说明
1、按要求填写json 数据结构，点击运行；
2、生产相应表格，点击复制，显示 templte 代码，复制即可
 */
<template>
  <div class="contain">
    <div class="default wrapper">
      <div class="inline-item">
        <p class="title">
          <span>表格</span>
          <span class="copy">复制代码</span>
        </p>
        <div class="table">
          <element-table-template
            :data-struct="jsxDataStruct"
            :table-struct="jsxTableStruct"
            :table-fun-columns="jsxFunColums"
            :operate-list="jsxOperateList"
          />
        </div>
      </div>
      <div class="inline-item">
        <p class="title">
          <span>操作</span>
          <span @click="handleUpdateFunColumns">运行</span>
        </p>
        <div class="text-area">
          <p>功能</p>
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="selection"></el-checkbox>
            <el-checkbox label="index"></el-checkbox>
          </el-checkbox-group>

          <p>操作</p>
          <el-checkbox-group v-model="operateList">
            <el-checkbox label="add"></el-checkbox>
            <el-checkbox label="edit"></el-checkbox>
            <el-checkbox label="delete"></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="inline-item" :class="visible.tableStructError?'block-error':''">
        <p class="title">
          <span>表格渲染结构</span>
          <span @click="handleUpdateByTableStructStr">运行</span>
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
          <span @click="handleUpdateByDataStructStr">运行</span>
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
import ClipboardJS from 'clipboard';
import { elementTableTemplate } from './TableEleJSX.js';
import { generateHtmlTemplate } from './Generate.js';

export default {
  name: 'TableBuilderEle',
  components: { elementTableTemplate },
  props: {},
  data() {
    return {
      // 表格渲染结构
      tableStruct: {
        columns: [
          { title: '日期', prop: 'date' },
          { title: '姓名', prop: 'name' },
          { title: '地址', prop: 'address' }
        ]
      },

      // 表格渲染结构字符串
      tableStructStr: '',

      // 表格自定义列，多选，序号
      checkList: [],
      // 增删改
      operateList: [],

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
      },

      jsxDataStruct: {},
      jsxTableStruct: {},
      jsxFunColums: [],
      jsxOperateList: []
    };
  },

  created() {
    this.dataStructStr = JSON.stringify(this.dataStruct, null, 2);
    this.tableStructStr = JSON.stringify(this.tableStruct, null, 2);
    this.jsxDataStruct = { ...this.dataStruct };
    this.jsxTableStruct = { ...this.tableStruct };
    this.jsxFunColums = [...this.checkList];
    this.jsxOperateList = [...this.operateList];
  },
  mounted() {
    const clipboard = new ClipboardJS('.copy', {
      text: trigger => {
        const codeStr = generateHtmlTemplate(
          this.jsxTableStruct,
          this.jsxFunColums,
          this.jsxOperateList
        );
        console.log(codeStr);
        return codeStr;
      }
    });

    clipboard.on('success', function(e) {
      console.info('Action:', e.action);
      console.info('Text:', e.text);
      console.info('Trigger:', e.trigger);

      e.clearSelection();
    });

    clipboard.on('error', function(e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });
  },
  methods: {
    // 更新表格功能列,(附：使用该方法减少 jsx 数据响应)
    handleUpdateFunColumns() {
      this.jsxFunColums = [...this.checkList];
      this.jsxOperateList = [...this.operateList];
    },

    // 更新渲染结构
    handleUpdateByTableStructStr() {
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

    // 根据 tablestructStr，更新 tableStruct、dataStruct、dataStructStr
    updateDataStructByTableStruct() {
      const {
        dataStruct,
        tableStruct: { columns }
      } = this;
      const addParamFn = () => 'val';
      const columnObj = this.changeArrayToObject(columns);
      const newStruct = this.changeFieldsByParams(
        addParamFn,
        dataStruct,
        columnObj
      );
     
      this.dataStruct = { ...newStruct };
      this.dataStructStr = JSON.stringify(this.dataStruct, null, 2);
      this.jsxDataStruct = { ...this.dataStruct };
      this.jsxTableStruct = { ...this.tableStruct };
    },

    // 根据 dataStructStr，更新 dataStruct、tableStruct、tableStructStr
    handleUpdateByDataStructStr() {
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
      this.dataStructUpdateTableStruct();
    },

    // 根据 datastruct，添加|删除列,更新 tableStruct，tableStructStr
    updateTableStructByDataStruct() {
      const {
        dataStruct,
        tableStruct: { columns }
      } = this;
      const addParamFn = key => {
        return { title: 'name', prop: key };
      };
      const columnObj = this.changeArrayToObject(columns);
      const newCol = this.changeFieldsByParams(
        addParamFn,
        columnObj,
        dataStruct
      );
      const colArray = this.changeObjectToArray(newCol);
      this.tableStruct.columns = [...colArray];
      this.tableStructStr = JSON.stringify(this.tableStruct, null, 2);
      this.jsxDataStruct = { ...this.dataStruct };
      this.jsxTableStruct = { ...this.tableStruct };
    },

    /* 
    @function 辅助，将数组转化为对象，便于对比两数据结构
    @param array 将转化数组
    @return object 返回对象结果
    */
    changeArrayToObject(array) {
      let obj = {};
      array.forEach(val => {
        if (val.prop) {
          obj[val.prop] = val;
        }
      });
      return obj;
    },

    /* 
    @function 辅助，将对象转化为数组，还原处理后的数据
    @param object 将转化数组
    @return array 返回对象结果
    */
    changeObjectToArray(object) {
      let array = [];
      for (let key in object) {
        array.push(object[key]);
      }
      return array;
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
::v-deep .el-checkbox {
  margin: 5px 0;
}

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
    width: 10%;
  }

  .inline-item:nth-child(3) {
    width: 20%;
  }

  .inline-item:nth-child(4) {
    width: 18%;
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

.table {
  margin: 20px;
}

.block-error {
  background-color: rgba(255, 0, 0, 0.1) !important;
}

.error {
  color: #f00;
}
</style>