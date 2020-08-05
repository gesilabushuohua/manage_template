<!--
 * @Description: 基本表格操作
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
--> 
<template>
  <div class="vertical-layout wapper-padding">
    <section class="table-top section gap">
      <div class="page-tag">页面标签</div>
      <div class="simply-query">
        <SimpleQuery ref="querys" :querys="querys" />
        <div class="opt-btns">
          <el-button type="primary" size="small" @click="updateOneSlecect">更新条件选项</el-button>
          <el-button type="primary" size="small">搜索</el-button>
          <el-button v-has-permission="'add'" type="primary" size="small" @click="showAddForm">添加</el-button>
          <el-button type="primary" size="small" @click="exportFile">导出</el-button>
          <el-button type="primary" size="small" @click="showImportDialog">导入</el-button>
        </div>
      </div>
    </section>
    <main class="main main-height">
      <el-table ref="table" :data="tableData" height="100%" border>
        <el-table-column fixed prop="date" label="日期" width="150" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="sex" label="性别" width="100" />
        <el-table-column prop="province" label="省份" width="120" />
        <el-table-column prop="city" label="市区" width="120" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="zip" label="邮编" width="120" />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small" @click="showEditForm(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="showDelConfirm">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <section class="section page-bottom">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[40, 100, 200, 300, 400]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </section>

    <el-dialog
      :visible.sync="baseFormVisible"
      width="500px"
      :title="baseFormTitle"
      :before-close="resetBaseForm"
    >
      <el-form :model="baseForm" :rules="baseRules" ref="baseForm" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="baseForm.name" />
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="baseForm.date"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="活动区域" prop="province">
          <el-select v-model="baseForm.province" placeholder="请选择省份" style="width: 100%;">
            <el-option label="上海" value="上海" />
            <el-option label="北京" value="北京" />
          </el-select>
        </el-form-item>
        <el-form-item label="市区" prop="city">
          <el-checkbox-group v-model="baseForm.city">
            <el-checkbox label="普陀区" name="city" />
            <el-checkbox label="AAA" name="city" />
            <el-checkbox label="BBB" name="city" />
            <el-checkbox label="CCC" name="city" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="baseForm.address" />
        </el-form-item>
        <el-form-item label="邮编" prop="zip">
          <el-input v-model="baseForm.zip" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="baseFormVisible = false">取 消</el-button>
        <el-button v-loading="submitting" type="primary" @click="verifyBaseForm">确 定</el-button>
      </span>
    </el-dialog>

    <import-dialog
      ref="importDialog"
      title="下载模板"
      templateLink="#"
      templateName="xxx模板"
      :import-file-fn="importFileFn"
    />
  </div>
</template>

<script>
import ImportDialog from '@/components/ImportDialog';
import tableCrud from '@/mixis/tableCrud.js';
import { SimpleQuery } from '@/components/simpleQueryJSX';
import {
  Get,
  Add,
  Edit,
  Del,
  ImportFile,
  ExportFile
} from '@/api/tableRequest/services.js';

export default {
  name: 'Home',
  components: { SimpleQuery, ImportDialog },
  mixins: [tableCrud],
  data() {
    return {
      // 非展示数据，冻结对象，减少数据监听
      requestGetFn: Object.freeze(Get),
      requestAddFn: Object.freeze(Add),
      requestEditFn: Object.freeze(Edit),
      requestDelFn: Object.freeze(Del),
      importFileFn: Object.freeze(ImportFile),
      exportFileFn: Object.freeze(ExportFile),

      baseFormTitle: '',

      baseForm: {
        date: '',
        name: '',
        province: '',
        city: [],
        address: '',
        zip: ''
      },

      baseRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请选择省份', trigger: 'change' }
        ],
        date: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        city: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个城市',
            trigger: 'change'
          }
        ],
        address: [{ required: true, message: '请填写地址', trigger: 'blur' }],
        zip: [{ required: true, message: '请填写邮编', trigger: 'blur' }]
      },

      // 检索条件
      querys: [
        {
          type: 'input',
          key: 'p1',
          value: '',
          label: '条件一'
        },
        {
          type: 'select',
          key: 'p2',
          value: '',
          label: '条件二',
          options: [
            {
              label: '选项一',
              value: 22
            },
            {
              label: '选项二',
              value: 33
            }
          ]
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    showImportDialog() {
      this.$refs.importDialog.open();
    },
    updateOneSlecect() {
      const index = 1;
      this.updateSelectOption(index);
    },

    // 设置选项
    updateSelectOption(index) {
      this.querys[index].value = '';
      this.querys[index].options = [
        {
          label: '选项三',
          value: 44
        },
        {
          label: '选项四',
          value: 55
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.simply-query {
  display: flex;
  vertical-align: top;
}

.table-top {
  height: 70px !important;
}
</style>