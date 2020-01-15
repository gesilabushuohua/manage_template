<template>
  <div class="wrapper">
    <div class="contain">
      <div class="login-from">
        <h2 class="title">System Manage</h2>
        <h4 class="content">Sign in</h4>
        <div class="form">
          <el-form ref="form" :model="form" status-icon :rules="rules">
            <el-form-item prop="account">
              <el-input v-model="form.account" prefix-icon="el-icon-user" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="passWord">
              <el-input
                v-model="form.password"
                prefix-icon="el-icon-lock"
                type="password"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item prop="passWord">
              <el-input v-model="form.captcha" prefix-icon="el-icon-key" autocomplete="off">
                <el-button slot="append" @click="requestGetCode">获取验证码</el-button>
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
import { basicLogin, digestLogin, getCode, digestLoginURL } from '@/api/index';
import { generateAuthentication } from '@/assets/js/generateAuthenticationByRules';

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
        password: [{ require: true, message: '请输入密码', trigger: 'blur' }],
        captcha: [{ require: true, message: '请输入验证码', trigger: 'blur' }]
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.requestBasicLogin();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    requestBasicLogin() {
      const param = { ...this.from };
      this.isLoging = true;
      basicLogin(param)
        .then(res => {
          this.isLoging = false;
          console.log({ res, param });
        })
        .catch(err => {
          this.isLoging = false;
        });
    },
    async requestDigestLogin() {
      const param = { ...this.from };
      this.isLoging = true;
      let Authenticate = await digestLogin();

      //  TODO，未与后端商议，解析生成格式过程中有问题
      const Authorization = generateAuthentication(
        digestLoginURL,
        Authenticate
      );
      sessionStorage.setItem('Authorization', Authorization);
      digestLogin({ captcha: param.captcha })
        .then(res => {
          this.isLoging = false;
          console.log({ res });

          /*  
           const {
            data: { code, message, data },
            headers: { authorization }
          } = res;

          if (code === 0) {
            const { role, id } = data;
            sessionStorage.setItem('token', authorization);
            sessionStorage.setItem('account', param.account);
            sessionStorage.setItem('account_id', id);
            this.$store.commit('setUserId', id);
            if (role) {
              const { permissions } = role;
              this.$store.commit('setRole', role.role);
              this.$store.commit('setPermisson', permissions);
            }
           
            
          } else {
            if (
              `${message}` === '验证码过时, 请重新获取' ||
              `${message}` === '验证码不正确 , 请重新输入'
            ) {
              if (`${message}` === '验证码过时, 请重新获取') {
                this.$message.error('验证码已过时');
                this.getCode();
              }
              if (`${message}` === '验证码不正确 , 请重新输入') {
                this.$message.error('验证码不正确');
              }
              return;
            }
            message && this.$message.error(message);
          } */
        })
        .catch(e => {
          this.isLoging = false;
          const response = e.response || null;
          const msg = response && response.data && response.data.message;
          msg && this.$message.error(`${msg}`);
        });
    },
    requestGetCode() {
      const { account } = this.form;
      if (!account) {
        this.$refs.form.validateField(['account'], errorMessage => {
          console.error(this.form, { errorMessage });
        });
        return;
      }
      getCode(account)
        .then(res => {
          console.log('get code', { res });
        })
        .catch(err => {});
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
  min-width: 1366px;
  min-height: 624px;
  background: url('../assets/images/bg6.jpg') no-repeat fixed;
  background-size: 100% auto;
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

