<!--
 * @Description: 无数据
 * @Date: 2020-03-19 09:30:39
 * @Author: LB
 -->

<template>
  <div  v-show="visible" class="no-data-msg"></div>
</template>

<script>
export default {
  name: 'NoData',
  data() {
    return {
      visible: false
    };
  }
};
</script>
<style lang="scss" scoped>
.no-data-msg {
  width: 100%;
  height: 100%;
  background-image: url('./images/no-data.png');
  background-position: center;
  background-repeat: no-repeat;
}
</style>
