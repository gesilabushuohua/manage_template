<template>
  <div class="wrapper">
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
  </div>
</template>

<script>
import {
  Add,
  Edit
} from '@/api/tableRequest/services.js';

export default {
  name: 'BasicForm',
  components: {},
  props: {},
  data() {
    return {
      submitType: 'add',
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
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {

    // 提交 添加、编辑 表单
    async submitBaseForm() {
      const requestFn = this.submitType === 'add' ? Add : Edit;
      const params = { ...this.baseForm };
      const optSuccessFn = () => { console.log('optate success'); };
      this.submitting = true;
      await this.crudData(params, requestFn, optSuccessFn);
      this.submitting = false;
    },

    // 增、改、删数据提交
    crudData(params, optFn, optSuccessFn) {
      optFn(params)
        .then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          optSuccessFn && optSuccessFn(params);
          this.getTableData();
        })
        .catch(err => {
          this.$message({
            message: '操作失败',
            type: 'error'
          });
          console.error(err);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  margin: 20px;
  width: 600px;
}
</style>