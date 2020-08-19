<template>
  <div ref="map" class="wrapper fill-height"></div>
</template>

<script>
import echarts from 'echarts';
import 'echarts-gl';
import huizhouJson from '@/config/441300_full.json';
const bg = require('@/assets/images/bg4.jpg');

echarts.registerMap('huizhou', huizhouJson);
let mapDom = null;

export default {
  name: 'AreaMap',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {
    console.log({ huizhouJson });
  },
  mounted() {
    mapDom = this.$refs.map;
    this.initMap();
  },
  methods: {
    initMap() {
      const echartMap = echarts.init(mapDom);
      const option = {
        title: {
          // 标题
          top: '0',
          text: '惠州市3D地图',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#ccc'
          }
        },

        tooltip: {
          // 提示框
          trigger: 'item',
          formatter: function(params) {
            return params.name;
          }
        },

        series: [
          {
            type: 'map3D', // 系列类型
            name: 'map3D', // 系列名称
            map: 'huizhou', // 地图类型
            top: '-10%',

            label: {
              // 标签的相关设置
              show: true, // (地图上的城市名称)是否显示标签 [ default: false ]
              //distance: 150,           // 标签距离图形的距离，在三维的散点图中这个距离是屏幕空间的像素值，其它图中这个距离是相对的三维距离
              //formatter:,              // 标签内容格式器
              textStyle: {
                // 标签的字体样式
                color: '#fff', // 地图初始化区域字体颜色
                fontSize: 20, // 字体大小
                opacity: 1, // 字体透明度
                backgroundColor: 'rgba(0,23,11,0)' // 字体背景色
              }
            },

            itemStyle: {
              // 三维地理坐标系组件 中三维图形的视觉属性，包括颜色，透明度，描边等。
              //  areaColor: 'rgba(95,158,160,0.9)', // 2d 地图
              // color: 'rgba(95,158,160,0.6)',// 地图板块的颜色
              opacity: 0.9, // 图形的不透明度 [ default: 1 ]
              borderWidth: 2, // (地图板块间的分隔线)图形描边的宽度。加上描边后可以更清晰的区分每个区域   [ default: 0 ]
              borderColor: '#fff' // 图形描边的颜色。[ default: #333 ]
            },

            shading: 'color',
            colorMaterial: {
              detailTexture: bg // 颜色纹理图，需 shading: 'color' 生效
            },

            emphasis: {},

            viewControl: {
              alpha: 45,
              beta: -45
            },

            data: [{
              name: '惠阳区',
              value: 60000000,
              regionHeight: 18000,
              itemStyle: {
                color: '#999'
              }
            },
            {
              name: '博罗县',
              value: 60000000,
              regionHeight: 18000,
              itemStyle: {
                color: '#999'
              }
            }]
          }
        ]
      };
      echartMap.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
}
</style>