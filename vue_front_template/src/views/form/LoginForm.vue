<template>
 
    <!-- 登记表单 -->
    <div class="form">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="account">
          <el-input v-model="form.account" prefix-icon="el-icon-user" autocomplete="off" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="form.password" prefix-icon="el-icon-lock" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input v-model="form.captcha" prefix-icon="el-icon-key">
            <el-button slot="append" @click="getValidCodeImage">获取验证码</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button v-loading="isLoging" class="btn" type="primary" @click="submitForm">登录</el-button>
    </div>
</template>

<script>

import { BasicLogin, DigestLogin, GetCode } from '@/api/common/services.js';
import { generateAuthentication } from '@/utils/index.js';
export default {
  name: 'LoginForm',
  components: {},
  props: {},
  data() {
    return {
      isLoging: false,
      form: {
        account: '',
        captcha: '',
        password: ''
      },
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    };
  },
  methods: {

    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          console.log('from validate error submit!!');
          return;
        }

        // 简单登录
        this.basicLogin();

        // 摘要登录
        /*  this.digestLogin(); */
      });
    },

    // 简单登录
    basicLogin() {
      const params = { ...this.from };
      this.isLoging = true;
      BasicLogin(params)
        .then(res => {
          this.$router.push('/home');
        }).catch(err => {

        }).finally(() => {
          this.isLoging = false;
        });
    },

    // 摘要登录
    async digestLogin() {
      const param = { ...this.from };
      this.isLoging = true;

      // 登录,请求获取 验证码
      const Authenticate = await new Promise();

      const digestLoginURL = '';

      //  TODO，未与后端商议，解析生成格式过程中有问题
      const Authorization = generateAuthentication(
        digestLoginURL,
        Authenticate
      );

      sessionStorage.setItem('Authorization', Authorization);

      // 结合验证码，登录
      DigestLogin({ captcha: param.captcha })
        .then(res => {
          this.$router.push('/home');
        })
        .catch(e => {
          const response = e.response || null;
          const msg = response && response.data && response.data.message;
          msg && this.$message.error(`${msg}`);
        })
        .finally(() => {
          this.isLoging = false;
        });
    },

    // 根据账号生成图片文件流
    getValidCodeImage() {
      const { account } = this.form;
      if (!account) {
        this.$refs.form.validateField(['account'], errorMessage => {
          console.error(this.form, { errorMessage });
        });
        return;
      }

      GetCode(account)
        .then(res => {
          console.log('get code image file steam', { res });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.form {
  margin: 20px auto;
  /*   position: absolute;
  left: 0;
  right: 0; */
  width: 320px;
  background-color: #fff;
}

.title {
  margin-top: 35px;
}

.form {
  margin: 10px 25px;
}

.btn {
  margin-top: 20px;
  width: 100%;
}
</style>

