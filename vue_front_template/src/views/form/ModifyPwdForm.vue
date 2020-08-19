<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" :rules="formRules" label-width="70px">
      <el-form-item prop="oldPwd" label="原密码">
        <el-input v-model="form.oldPwd" placeholder="请输入原密码" type="password" />
      </el-form-item>
      <el-form-item prop="newPwd" label="新密码">
        <el-input v-model="form.newPwd" placeholder="请输入新密码" type="password" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" v-loading="submiting" @click="submitModifyPassword">提交</el-button>
    </div>
  </div>
</template>

<script>
import { ModifyPwd } from '@/api/common/services.js';

export default {
  name: 'ModifyPwdForm',
  components: {},
  props: {},
  data() {
    const validateNewPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写新密码'));
      }
      if (value === this.form.oldPwd) {
        return callback(new Error('新旧密码不可以相同'));
      }
      const pwdRegex = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)[a-zA-Z0-9\W_]{8,16}$/;
      if (!pwdRegex.test(value)) {
        return callback(
          new Error('密码限制 8~16位,字母,数字,特殊符号至少含两种')
        );
      }
      callback();
    };
    return {
      showModifyPasswordDialog: false,
      form: {
        account: '',
        oldPwd: '',
        newPwd: ''
      },
      formRules: {
        oldPwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPwd: [{ required: true, validator: validateNewPwd, trigger: 'blur' }]
      },
      submiting: false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitModifyPassword() {
      this.submiting = true;
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.submiting = false;
          return;
        }

        const params = this.form;
        
        ModifyPwd(params)
          .then(res => {
            if (this.$refs.form.resetFields) {
              this.$refs.form.resetFields();
            }
          })
          .catch(err => {
            console.error(err);
          })
          .finally(() => {
            this.submiting = false;
          });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  margin: 20px;
  width: 400px;
}
</style>