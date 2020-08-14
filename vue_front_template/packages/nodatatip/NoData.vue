<!--
 * @Description: 无数据
 * @Date: 2020-03-19 09:30:39
 * @Author: LB
 -->

<template>
  <div class="no-data-msg"></div>
</template>

<script>
export default {
  name: 'NoData',
  components: {},
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    noDataVisible() {
      return this.data.length === undefined || this.data.length === 0;
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  background-image: url('../images/no-data.png');
  background-position: center;
  background-repeat: no-repeat;
}
</style>
