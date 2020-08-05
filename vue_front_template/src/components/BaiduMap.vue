
<!--
 * @Description: 百度地图组件
 * @Date: 2020-07-01 09:35:08
 * @Author: LB
--> 


<template>
  <div class="wrapper">
    <div id="baidu-map"></div>
    <div class="tool-bar"></div>
  </div>
</template>


<script>
/* 功能 
    地图定点
    设置定点
    获取定点
    定点操作
    操作点交互
    绘画区域
    设置区域
    获取区域
    操作区域交互
    地图轨迹
    轨迹操作，轨迹校验......

    */

// 地图实例
let mapInstance = null;
let markerClickEventFn = null;

// 地图坐标点
let mapMarkers = [];

// 手动设置 marker 内部存储的 click 事件名
const MARKER_CLICK_EVENT_ALIAS = 'MARKER-CLICK';

export default {
  name: 'BaiduMap',
  components: {},
  props: {},
  data() {
    return {
      mapMarkers2: []
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.initBaiduMap();
  },
  methods: {
    // 随机生成 经纬度
    ramdomCreateLngLats() {
      let lnglats = [];
      const size = 30;
      const bounds = mapInstance.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const lngSpan = Math.abs(sw.lng - ne.lng);
      const latSpan = Math.abs(ne.lat - sw.lat);
      for (let i = 0; i < size; i++) {
        const lng = sw.lng + lngSpan * (Math.random() * 0.7);
        const lat = ne.lat - latSpan * (Math.random() * 0.7);
        lnglats.push({ lng, lat });
      }

      return lnglats;
    },

    initBaiduMap() {
      // 百度地图API功能
      mapInstance = new BMap.Map('baidu-map', {
        // 让鼠标点击超市兼职等信息时出现
        enableMapClick: false,

        // 设置地图的最小缩小级别
        minZoom: 8,

        // 设置地图的最大方法级别
        maxZoom: 19,

        // 是否开启高清
        enableHighResolution: false
      });

      // 创建Map实例
      mapInstance.centerAndZoom(new BMap.Point(114.42, 23.12), 15);

      // 开启鼠标滚轮缩放
      mapInstance.enableScrollWheelZoom(true);

      /*   mapInstance.addEventListener('moveend', this.updateMapMarkers);
      mapInstance.addEventListener('zoomend', this.updateMapMarkers);
      mapInstance.addEventListener('dragend', this.updateMapMarkers); */
    },

    /**
     * @description: 添加地图点
     * @param lnglats { lng: number, lat:number}
     * @param MarkerOptions
     * @return
     */
    addMapMarkers({ lnglats, MarkerOptions }) {
      lnglats.forEach(lnglat => {
        const { lng, lat } = lnglat;
        const point = new BMap.Point(lng, lat);
        let marker = new BMap.Marker(point, MarkerOptions);
        mapInstance.addOverlay(marker);
        mapMarkers.push(marker);
      });
    },

    // 移除坐标点
    removeMapMarkers() {
      if (mapMarkers.length === 0) {
        return;
      }
      mapMarkers.forEach(marker => {
        this.removeMarkerClickEvent(marker);
        mapInstance.removeOverlay(marker);
      });
      mapMarkers = [];
    },

    addMarkerClickEvent(marker) {
      /* 指定绑定函数名 */
      marker.addEventListener('click', markerClickEventFn, MARKER_CLICK_EVENT_ALIAS);
    },

    removeMarkerClickEvent(marker) {
      marker.removeEventListener('onclick', markerClickEventFn);
    },

    addMarkersClickEvent(handleFn) {
      if (mapMarkers.length === 0) {
        return;
      }

      markerClickEventFn = handleFn;
      mapMarkers.forEach(marker => {
        this.addMarkerClickEvent(marker);
      });
    },

    removeMarkersClickEvent() {
      if (mapMarkers.length === 0) {
        return;
      }
      mapMarkers.forEach(marker => {
        this.removeMarkerClickEvent(marker);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  height: 100%;
}

#baidu-map {
  height: 100%;
}
</style>