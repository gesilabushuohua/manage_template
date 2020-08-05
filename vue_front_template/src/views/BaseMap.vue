<!--
 * @Description: 基础地图操作
 * @Date: 2020-07-01 11:55:05
 * @Author: LB
--> 

<template>
  <div class="horizontal-layout">
    <section class="section">
      <p>
        <el-button @click="addMarders">多坐标打点</el-button>
        <el-button @click="addEvent">添加监听</el-button>
        <el-button @click="removeEvent">移除监听</el-button>
      </p>
      <p>地图中心</p>
      <p>设置坐标点</p>
      <p>设置坐标点</p>
    </section>
    <main class="main">
      <baidu-map ref="baiduMap" />
    </main>
  </div>
</template>

<script>
import BaiduMap from '@/components/BaiduMap';
function click(e) {
  console.log('addMarkersClickEvent', e);
}
// 地图实例
let mapInstance = null;
export default {
  name: 'BaseTree',
  components: { BaiduMap },
  data() {
    return {};
  },
  created() {},
  methods: {
    addMarders() {
      const lnglats = this.$refs.baiduMap.ramdomCreateLngLats();
      mapInstance = this.$refs.baiduMap;
      mapInstance.removeMapMarkers();
      mapInstance.addMapMarkers({ lnglats });
    },
    addEvent() {
      
      mapInstance.addMarkersClickEvent(click);
    },
    removeEvent() {
      mapInstance.removeMarkersClickEvent();
    }
  }
};
</script>

<style lang="scss" scoped>
.inline {
  line-height: 100px;
  text-align: center;
  color: #2d2d2d;
}
</style>