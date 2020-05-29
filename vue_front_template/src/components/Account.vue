/* 
  @function 账号操作面板，用户头像，修改密码，退出登录
  @prop isRight 是否靠右
  @prop isBottom 是否底部
  @prop changePWRequestFn 提交修改密码请求方法
 */
<template>
  <div class="account" :class="postionClassList">
    <img src="@/assets/images/logo.jpeg" />
    <span class="icon el-icon-lock" @click="handleChangePW"></span>
    <span class="icon el-icon-s-unfold" @click="handleExit"></span>

    <el-dialog :visible.sync="showModifyPasswordDialog" width="500px" @close="resetForm">
      <span slot="title">修改密码</span>
      <el-form
        ref="modifyPasswordForm"
        :model="modifyPasswordForm"
        :rules="midifyPasswordFormRules"
        label-width="60px"
      >
        <el-form-item prop="oldPwd" label="原密码">
          <el-input v-model="modifyPasswordForm.oldPwd" placeholder="请输入原密码" type="password" />
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码">
          <el-input v-model="modifyPasswordForm.newPwd" placeholder="请输入新密码" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitModifyPassword">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    isRight: {
      type: Boolean,
      default: false
    },
    isBottom: {
      type: Boolean,
      default: false
    },
    changePWRequestFn: {
      type: Function,
      default: () => {}
    }
  },
  data() {
      const validateOldPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写旧密码'));
      }
      const params = {
        account: this.modifyPasswordForm.account,
        oldPwd: value
      };
      validateUserPassword(params).then(res => {
        const { code, data } = res.data;
        if (code === 0) {
          const { oldPwd } = data;

          // false 代表验证成功
          if (oldPwd) {
            return callback(new Error('旧密码错误'));
          }
        }
        callback();
      }).catch(() => {
        callback('旧密码错误');
      });
    };

    const validateNewPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写新密码'));
      }
      if (value === this.modifyPasswordForm.oldPwd) {
        return callback(new Error('新旧密码不可以相同'));
      }
      const pwdRegex = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)[a-zA-Z0-9\W_]{8,16}$/;
      if (!pwdRegex.test(value)) {
        return callback(new Error('密码限制 8~16位,字母,数字,特殊符号至少含两种'));
      }
      callback();
    };
    return {
      showModifyPasswordDialog: false,
      modifyPasswordForm: {
        account: '',
        oldPwd: '',
        newPwd: ''
      },
      midifyPasswordFormRules: {
        oldPwd: [{ validator: validateOldPwd, trigger: 'blur' }],
        newPwd: [{ validator: validateNewPwd, trigger: 'blur' }]
      },
      account: ''
    };
  },
  computed: {
    postionClassList() {
      let classList = '';
      if (this.isRight) {
        classList += 'right ';
      }
      if (this.isBottom) {
        classList += 'bottom';
      }
      return classList;
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleChangePW() {
      console.log('change password');
    },
    handleExit() {
      console.log('exit current accout');
    }
  }
};
</script>
<style lang="scss" scoped>
$width: 200px;
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

  > img {
    width: 30px;
    height: 30px;
  }

  .icon {
    display: block;
    width: 40px;
    height: $height;
    line-height: $height;
    font-size: 20px;
    cursor: pointer;
  }

  .icon:hover {
    color: $actived-color;
  }
}

.bottom {
  border-top: 1px solid #ebebeb;
  bottom: 0;
}

.right {
  border-left: 1px solid #ebebeb;
  right: 20px;
}
</style>