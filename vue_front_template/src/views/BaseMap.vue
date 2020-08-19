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
       <p>
        <el-button @click="addArea('惠州市')">惠州市</el-button>
        <el-button @click="addArea('惠城区')">惠城区</el-button>
        <el-button @click="addArea('惠州市博罗县')">博罗县石湾镇</el-button>
      </p>
       <p>
        <el-button @click="getCityAreas">获取城区</el-button>
        <el-button @click="drawAreasPolygon">描绘区域</el-button>
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
import BaiduMap from '@/components/baiduMap/BaiduMap';

// 地图实例
let mapInstance = null;

let areas = [];

export default {
  name: 'BaseTree',
  components: { BaiduMap },
  data() {
    return {};
  },
  created() {},
  mounted() {
    mapInstance = this.$refs.baiduMap;
  },
  methods: {
    addMarders() {
      const lnglats = this.$refs.baiduMap.ramdomCreateLngLats();
      mapInstance.removeMapMarkers();
      mapInstance.addMapMarkers({ lnglats });
    },
    addEvent() {
      mapInstance && mapInstance.addMarkersClickEvent(click);
    },
    removeEvent() {
      mapInstance && mapInstance.removeMarkersClickEvent();
    },
    addArea(name) {
      mapInstance.addAdminArea(name);
    },
    getCityAreas() {
      areas = mapInstance.getCityAreas();
    },
    drawAreasPolygon() {
      mapInstance.drawAreasPolygon(areas);
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