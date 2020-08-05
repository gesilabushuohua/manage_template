<!--
 * @Description: 基本树状结构
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
--> 
<template>
  <div class="horizontal-layout">
    <section class="section side-width">
      <el-tree class="tree" :data="treeData" @node-click="handleNodeClick">
        <span slot-scope="{ node, data }">
          <span>{{node.label}}</span>
        </span>
      </el-tree>
    </section>
    <section class="section side-width">
      <tree :data="treeData" />
    </section>
    <main class="main">
      <p class="text">{{curNode.label}}</p>
    </main>
  </div>
</template>

<script>
import { get } from '@/api/treeRequset.js';
import Tree from '@/components/Tree.vue';

export default {
  name: 'BaseTree',
  components: { Tree },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      curNode: {
        label: '暂无'
      }
    };
  },
  created() {
    this.getTreeData();
  },
  methods: {
    getTreeData() {
      get()
        .then(res => {
          const { data } = res;
          this.treeData = data;
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleNodeClick(data) {
      this.curNode = data;
    }
  }
};
</script>

<style lang="scss" scoped>
.text {
  line-height: 100px;
  text-align: center;
  color: #2d2d2d;
}

.side-width {
  width: 200px;
}
</style>