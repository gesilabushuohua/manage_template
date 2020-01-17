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
    return {};
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