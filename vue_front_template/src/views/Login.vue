<template>
  <div class="wrapper">
    <div class="contain">
      <div class="login-from">
        <h2 class="title">System Manage</h2>
        <h4 class="content">Sign in</h4>

        <!-- 登记表单 -->
        <div class="form">
          <el-form ref="form" :model="form" status-icon :rules="rules">
            <el-form-item prop="account">
              <el-input
                v-model="form.account"
                prefix-icon="el-icon-user"
                autocomplete="off"
                clearable
              />
            </el-form-item>
            <el-form-item prop="passWord">
              <el-input
                v-model="form.password"
                prefix-icon="el-icon-lock"
                type="password"
                autocomplete="off"
                clearable
              />
            </el-form-item>
            <el-form-item prop="passWord">
              <el-input v-model="form.captcha" prefix-icon="el-icon-key" clearable>
                <el-button slot="append" @click="getValidCodeImage">获取验证码</el-button>
              </el-input>
            </el-form-item>
          </el-form>
          <el-button v-loading="isLoging" class="btn" type="primary" @click="submitForm">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { BasicLogin, DigestLogin, GetCode } from '@/api/common/services.js';
import { generateAuthentication } from '@/utils/index.js';
export default {
  name: 'Login',
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
  created() {},
  mounted() {},
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
        })
        .finally(() => {
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
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 600px;
  min-height: 624px;
  background: url('../assets/images/bg6.jpg') no-repeat fixed;
  background-size: 100% 100%;
  padding: 1px;
  box-sizing: border-box;
}

.wrapper:after {
  content: '';
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: inherit;
  filter: blur(30px);
  z-index: 1;
}

.contain {
  position: absolute;
  width: 1000px;
  height: 450px;
  border-radius: 5px;
  text-align: center;
  background: inherit;
  z-index: 11;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.2);
}

.login-from {
  position: absolute;
  right: 0;
  width: 320px;
  height: 100%;
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

