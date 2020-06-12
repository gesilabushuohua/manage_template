/* 
  @function 账号操作面板，用户头像，修改密码，退出登录

 */
<template>
  <div class="account" :style="accountStyle">
    <img class="account-photo" src="@/assets/images/logo.jpeg" />
    <el-dropdown @command="selMenu">
      <span class="el-dropdown-link">
        admin
        <!--   <i class="el-icon-arrow-down el-icon--right"></i> -->
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="modifyPwd">修改密码</el-dropdown-item>
        <el-dropdown-item command="exit">退出平台</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      :visible.sync="showModifyPasswordDialog"
      title="修改密码"
      width="500px"
      @close="resetForm"
    >
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Account',
  props: {
    accountStyle: {
      type: String,
      default: ''
    }
  },
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
        oldPwd: [{ required: true }],
        newPwd: [{ required: true, validator: validateNewPwd, trigger: 'blur' }]
      },
      account: '',
      submiting: false
    };
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    selMenu(command) {
      switch (command) {
        case 'modifyPwd':
          this.modifyPassword();
          break;
        case 'exit':
          this.exitSystem();
          break;
        default:
          break;
      }
    },
    resetForm() {
      this.form = {
        account: '',
        oldPwd: '',
        newPwd: ''
      };
    },
    modifyPassword() {
      console.log('change password');
      this.showModifyPasswordDialog = true;
    },
    exitSystem() {
      console.log('exit current accout');
    },
    submitModifyPassword() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }

        const params = this.form;
        new Promise(params)
          .then(res => {
            console.log('submitModifyPassword success');
            if (this.$refs.form.resetFields) {
              this.$refs.form.resetFields();
            }
            this.showModifyPasswordDialog = false;
          })
          .catch(err => {
            console.error(err);
          });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$width: 120px;
$height: 40px;
$actived-color: #3c80ff;
.account {
  position: absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: $width;
  height: $height;
  line-height: $height;

  .account-photo {
    width: 30px;
    height: 30px;
    clip-path: circle(50%);
  }

  .el-dropdown-link {
    color: #fff;
  }

  .icon {
    display: block;
    width: 30px;
    height: $height;
    text-align: center;
    line-height: $height;
    font-size: 20px;
    cursor: pointer;
  }

  .icon:hover {
    color: $actived-color;
  }
}
</style>


