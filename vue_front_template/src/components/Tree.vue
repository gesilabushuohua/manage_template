<template>
  <div ref="wrapper" class="d-tree" :style="treeWrapperStyle" @scroll="onScroll">
    <div ref="phantom" class="d-tree-phantom">
      <!-- 没有节点时高度为0，所以不需要 v-else -->
      <div ref="nodesWrapper" class="d-tree-nodes">
        <div
          v-for="node in showData"
          :key="node.key || node.label"
          class="d-tree-node"
          :class="{ selected: node.selected }"
          :style="treeNodeStyle"
          @click="handleNodeClick(node)"
        >
          <!-- indent -->
          <!-- 不使用 width 是因为 white-space: nowrap 会将该元素宽度忽略 -->
          <span class="d-tree-node__indent" :style="{ paddingLeft: `${node.level * indent}px` }"></span>

          <!-- expand-icon -->
          <span
            class="d-tree-node__expand-icon"
            :class="{ 'is-leaf': node.isLeaf }"
            @click.stop="handleProcessNodeExpandOrCollapse(node)"
          >
            <template v-if="node.expanded">
              <slot name="expanded-icon">
                <i :class="expandedIcon"></i>
              </slot>
            </template>

            <template v-else>
              <slot name="collapsed-icon">
                <i :class="collapsedIcon"></i>
              </slot>
            </template>
          </span>

          <el-checkbox
            v-if="showCheckbox"
            v-model="node.checked"
            :indeterminate="node.indeterminate"
            class="mr10"
            @click.stop
            @change="handleNodeCheckChange(node, $event)"
          />

          <!-- lazy loading -->
          <span v-if="node.loading" class="d-tree-node__loading-icon el-icon-loading"></span>

          <!-- content -->
          <slot name="content" v-bind="{ node, data: node.originNode }">
            <span class="d-tree-node__content">{{ node.label }}</span>
          </slot>
        </div>
      </div>
    </div>

    <template v-if="!filteredNodes.length">
      <slot name="empty">
        <div
          class="d-tree-empty"
          :style="{ lineHeight: `${treeWrapperHeight}px` }"
        >{{ emptyText || '暂无数据' }}</div>
      </slot>
    </template>
  </div>
</template>

<script>
// eslint-disable-next-line
function throttle(fn, interval = 16, context) {
  let timer = null;
  let lastTime = 0;
  return function(...args) {
    timer && clearTimeout(timer);

    const diffTime = Date.now() - lastTime;

    if (diffTime >= interval) {
      timer = null;
      return fn.apply(context || this, args);
    }

    // 最后一次不足 interval 间隔的事件最后也触发一次
    timer = setTimeout(() => {
      timer = null;
      fn.apply(context || this, args);
    }, interval - diffTime);
  };
}

// 根据当前的 scrollTop 与 最大 scrollTop 对比，计算出正确的 scrollTop 值
// eslint-disable-next-line
function alignScrollTop(scrollTop, scrollRange) {
  if (scrollTop < 0) {
    return 0;
  }

  if (scrollTop >= scrollRange) {
    return scrollRange;
  }

  return scrollTop;
}

export default {
  name: 'DTree',
  props: {
    data: {
      type: Array,
      required: true
    },
    height: {
      type: [Number, String]
    },
    nodeHeight: {
      type: Number,
      default: 26
    },
    nodeKey: {
      type: String
    },
    props: {
      type: Object,
      default: () => ({
        label: 'label',
        children: 'children'
      })
    },
    load: {
      type: Function
    },
    lazy: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    defaultCheckedKeys: {
      type: Array
    },
    defaultExpandedKeys: {
      type: Array
    },
    accordion: {
      type: Boolean,
      default: false
    },
    indent: {
      type: Number,
      default: 16
    },
    filterNodeMethod: {
      type: Function
    },
    emptyText: {
      type: String
    },
    expandedIcon: {
      type: String,
      default: 'el-icon-caret-bottom'
    },
    collapsedIcon: {
      type: String,
      default: 'el-icon-caret-right'
    },
    filterCheckStrictly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flattenedNodes: [],
      filteredNodes: [],
      scrollTop: 0,
      treeWrapperHeight: 0,
      startIndex: 0,
      endIndex: 0,
      selectedNode: null,
      isFiltering: false,
      paddingNumber: 1
    };
  },
  computed: {
    isLazyLoad() {
      return this.lazy && this.load && typeof this.load === 'function';
    },
    treeWrapperStyle() {
      const { height } = this;
      let computedHeight = '';

      if (typeof height === 'number') {
        computedHeight = `${height}px`;
      } else {
        // '200' => '200px'，'100%' => '100%，'calc(100% - 20px)' => 'calc(100% - 20px)'
        computedHeight = Number.isNaN(Number(height)) ? height : `${height}px`;
      }

      return { height: computedHeight };
    },
    treeNodeStyle() {
      const { nodeHeight } = this;

      if (!nodeHeight) {
        return {};
      }

      return { height: `${nodeHeight}px` };
    },
    showData() {
      return this.filteredNodes.slice(this.startIndex, this.endIndex);
    }
  },
  watch: {
    data() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 如果还没有数据，则不执行
      if (!this.data || !this.data.length) {
        return;
      }

      const data = this.flatten(this.data);
    
      this.flattenedNodes = data;
      this.filterFlattenedNodes();

      this.treeWrapperHeight = this.$refs.wrapper.clientHeight;
      this.setDOMRelated();
      this.onScroll();

      if (this.defaultCheckedKeys && this.defaultCheckedKeys.length) {
        this.setCheckedKeys(this.defaultCheckedKeys);
      }
    },

    onScroll: throttle(function onScroll() {
      const {
        $refs: {
          wrapper: { scrollTop }
        },
        filteredNodes: { length },
        nodeHeight,
        treeWrapperHeight,
        paddingNumber
      } = this;

      const shouldStartIndex = Math.floor(scrollTop / this.nodeHeight);
      const realStartIndex = Math.max(0, shouldStartIndex - paddingNumber);
      const shouldEndIndex = Math.ceil(
        (scrollTop + treeWrapperHeight) / nodeHeight
      );

      // 因为 slice 方法不会截取 end 的元素，所以这里 length 不需要 -1
      const realEndIndex = Math.min(length, shouldEndIndex + paddingNumber);

      this.startIndex = realStartIndex;
      this.endIndex = realEndIndex;

      this.$refs.nodesWrapper.style.transform = `translateY(${realStartIndex *
        nodeHeight}px)`;
    }),

    setDOMRelated() {
      const { nodeHeight, filteredNodes } = this;
      const scrollHeight = nodeHeight * filteredNodes.length;
      this.$refs.phantom.style.height = `${scrollHeight}px`;
    },

    /* events */
    // node-click
    handleNodeClick(flattenedNode) {
      const { isLeaf, originNode, hasFilteredChildren } = flattenedNode;
      flattenedNode.selected = true;

      if (this.selectedNode && this.selectedNode !== flattenedNode) {
        this.selectedNode.selected = false;
      }

      this.selectedNode = flattenedNode;
      this.$emit('current-change', flattenedNode.data, flattenedNode);

      if (
        isLeaf ||
        !this.expandOnClickNode ||
        (this.isFiltering && !hasFilteredChildren)
      ) {
        return;
      }

      // 没有子节点的时候才触发懒加载
      if (
        this.isLazyLoad &&
        (!flattenedNode.children || !flattenedNode.children.length)
      ) {
        this.handleLazyLoad(flattenedNode);
        return;
      }

      this.handleProcessNodeExpandOrCollapse(flattenedNode);

      this.$emit('node-click', originNode, flattenedNode);
    },

    handleLazyLoad(flattenedNode) {
      flattenedNode.loading = true;

      const resolve = data => {
        flattenedNode.loading = false;
        flattenedNode.loaded = true;

        // 没加载到数据则表明是叶子节点
        !data.length && (flattenedNode.isLeaf = true);

        // 将数据变为 node
        const flattenedNodes = this.flatten(data);

        // TODO: 优化代码
        // 加载的数据是可见的
        flattenedNodes.forEach(node => {
          node.visible = true;
          node.level = flattenedNode.level + 1;
        });

        // 建立和当前 node 的联系，并且添加到组件的节点数组中
        flattenedNode.children = flattenedNodes;
        const index =
          this.flattenedNodes.findIndex(node => node === flattenedNode) + 1;
        this.flattenedNodes.splice(index, 0, ...flattenedNodes);

        // 处理节点的展开收缩
        this.handleProcessNodeExpandOrCollapse(flattenedNode);
      };

      this.load(flattenedNode.originNode, resolve);
    },

    // expand-icon click
    handleProcessNodeExpandOrCollapse(flattenedNode) {
      const { expanded, children, originNode } = flattenedNode;
      const targetExpanded = !expanded;
      flattenedNode.expanded = targetExpanded;
      if (children) {
        targetExpanded
          ? this.handleNodeExpand(flattenedNode)
          : this.handleNodeCollapse(flattenedNode);
      }

      this.$emit(
        targetExpanded ? 'node-expand' : 'node-collapse',
        originNode,
        flattenedNode
      );

      this.filterFlattenedNodes();
      this.setDOMRelated();

      // 更新 index
      this.onScroll();
    },

    handleNodeExpand(flattenedNode) {
      const { children } = flattenedNode;

      if (children) {
        this.traverseChildren(flattenedNode, childNode => {
          childNode.visible = true;

          if (!childNode.expanded) {
            // 终止遍历该节点的子节点
            return true;
          }
        });
      }
    },

    handleNodeCollapse(flattenedNode) {
      this.traverseChildren(
        flattenedNode,
        childNode => (childNode.visible = false)
      );
    },

    handleNodeCheckChange(flattenedNode, checked) {
      flattenedNode.indeterminate = false;

      if (!this.checkStrictly) {
        // 只有在筛选的时候，并且是选中该节点，并且当前节点不是叶子节点的时候才走当前分支
        // 1. 如果是不选中该节点，则不用更具筛选判断父元素或者子元素状态，全部设置为 ckecked=false 即可
        // 2. 如果当前节点是叶子节点，则不用遍历子元素，更新祖先节点即可，所以走 else 分支
        if (
          this.isFiltering &&
          this.filterCheckStrictly &&
          checked &&
          !flattenedNode.isLeaf
        ) {
          this.traverseChildren(flattenedNode, chilNode => {
            // 如果节点是被筛选出来的
            if (chilNode.filtered) {
              chilNode.checked = checked;
              chilNode.indeterminate = false;
              return;
            }

            // 筛选之前就选中的，并且被筛选出去的节点，不做处理
            if (chilNode.checked) {
              return;
            }

            this.traverseParent(chilNode, parentNode => {
              parentNode.checked = false;
              parentNode.indeterminate = true;
            });
          });
        } else {
          this.traverseChildren(flattenedNode, childNode => {
            childNode.checked = checked;
            childNode.indeterminate = false;
          });

          this.traverseParent(flattenedNode, parentNode => {
            const isAllChecked = parentNode.children.every(
              ({ checked }) => checked
            );
            const hasChecked = parentNode.children.some(
              ({ checked, indeterminate }) => checked || indeterminate
            );

            parentNode.checked = isAllChecked;
            parentNode.indeterminate = hasChecked && !isAllChecked;
          });
        }
      }

      // 会导致渲染变慢，下一个 tick 执行，优先渲染
      this.$nextTick(() => {
        this.$emit('check', flattenedNode.originNode, {
          checkedNodes: this.getCheckedNodes(),
          checkedKeys: this.getCheckedKeys(),
          halfCheckedNodes: this.getHalfCheckedNodes(),
          halfCheckedKeys: this.getHalfCheckedKeys()
        });

        let hasChildrenChecked = false;

        if (!flattenedNode.isLeaf) {
          if (this.checkStrictly) {
            this.traverseChildren(flattenedNode, childNode => {
              if (childNode.checked) {
                hasChildrenChecked = true;
                return true;
              }
            });
          } else {
            // 如果父子节点勾选关联，则有无子节点选中的状态就是当前节点的选中状态
            hasChildrenChecked = checked;
          }
        }

        this.$emit(
          'check-change',
          flattenedNode.originNode,
          checked,
          hasChildrenChecked
        );
      });
    },

    traverseChildren(flattenedNode, fn) {
      if (!flattenedNode.children) {
        return;
      }

      flattenedNode.children.forEach(childNode => {
        const val = fn(childNode);
        !val && this.traverseChildren(childNode, fn);
      });
    },

    traverseParent(flattenedNode, fn) {
      if (!flattenedNode.parent) {
        return;
      }

      const val = fn(flattenedNode.parent);
      !val && this.traverseParent(flattenedNode.parent, fn);
    },

    traverseFlattenedNodes(fn) {
      const { flattenedNodes } = this;
      const len = flattenedNodes.length;

      for (let i = 0; i < len; i++) {
        const val = fn(flattenedNodes[i]);

        // 有返回值直接跳出
        if (val) {
          return;
        }
      }
    },

    // filter nodes
    filterFlattenedNodes() {
      const { flattenedNodes } = this;
      const filteredNodes = [];
      const len = flattenedNodes.length;

      for (let i = 0; i < len; i++) {
        const node = flattenedNodes[i];

        if (node.visible) {
          if (this.isFiltering && !node.filtered) {
            continue;
          }
          filteredNodes.push(node);
        }
      }

      this.filteredNodes = filteredNodes;
    },

    /* flat tree to array */
    flatten(tree) {
      const stack = tree.map(node => {
        return { originNode: node, parent: null, level: 0 };
      });

      const {
        props: { children }
      } = this;
      const flattenedNodes = [];

      // 深度优先遍历
      while (stack.length) {
        const curNode = stack.shift();
        const { originNode, parent, level } = curNode;
        const flattenedNode = this.getFlattenedNode(curNode);

        parent && parent.children.push(flattenedNode);
        flattenedNodes.push(flattenedNode);

        const computedChildren =
          typeof children === 'function'
            ? children(originNode, flattenedNode)
            : originNode[children];

        if (computedChildren) {

          // 若有子元素，存储子节点，继续遍历
          const mappedChildren = computedChildren.map(childNode => {
            return {
              originNode: childNode,
              parent: flattenedNode,
              level: level + 1
            };
          });
          
          stack.unshift(...mappedChildren);
        }
      }

      return flattenedNodes;
    },

    getFlattenedNode({ originNode, parent, level }) {
      const {
        defaultExpandAll,
        nodeKey,
        // defaultCheckedKeys,
        defaultExpandedKeys,
        props: { label, disabled, children, isLeaf },

        isLazyLoad
      } = this;

      const expanded = defaultExpandAll
        ? true
        : nodeKey && defaultExpandedKeys
        ? defaultExpandedKeys.includes(originNode[nodeKey])
        : false;
      const visible = level === 0 ? true : parent.expanded;
      // const checked = nodeKey ? (defaultCheckedKeys ? defaultCheckedKeys.includes(originNode[nodeKey]) : false) : false;
      const key = nodeKey ? originNode[nodeKey] : null;

      const flattenedNode = {
        key,
        originNode,
        parent,
        level,
        expanded,
        visible,
        checked: false,
        indeterminate: false,
        filtered: false,
        hasFilteredChildren: false,
        selected: false,
        loading: false,
        loaded: false
      };

      const computedLabel =
        typeof label === 'function'
          ? label(originNode, flattenedNode)
          : originNode[label];
      const computedChildren =
        typeof children === 'function'
          ? children(originNode, flattenedNode)
          : originNode[children];

      let isDisabled = false;
      if (originNode.disabled) {
        isDisabled = true;
      } else {
        if (disabled !== undefined) {
          if (typeof disabled === 'boolean') {
            isDisabled = disabled;
          } else if (typeof disabled === 'function') {
            isDisabled = disabled(originNode, flattenedNode);
          }
        }
      }

      let isLeafInner = false;
      if (isLeaf !== undefined) {
        if (typeof isLeaf === 'boolean') {
          isLeafInner = isLeaf;
        } else if (typeof isLeaf === 'function') {
          isLeafInner = isLeaf(originNode, flattenedNode);
        }
      }

      computedChildren &&
        computedChildren.length &&
        (flattenedNode.children = []);
      flattenedNode.label = computedLabel;
      flattenedNode.disabled = isDisabled;

      // 如果有 children ，则不是叶子节点，否则如果是懒加载，则是根据计算的值表示是否为叶子节点，否则表示为叶子节点
      flattenedNode.isLeaf =
        computedChildren && computedChildren.length
          ? false
          : isLazyLoad
          ? isLeafInner
          : true;

      return flattenedNode;
    },

    /* methods to expose */
    setCheckedKeys(keys, leafonly = false) {
      if (!keys || !Array.isArray(keys) || !this.nodeKey) {
        return;
      }

      const keyMap = keys.reduce((map, key) => {
        map[key] = 1;
        return map;
      }, {});

      this.traverseFlattenedNodes(flattenedNode => {
        const canSet = leafonly ? flattenedNode.isLeaf : true;

        if (canSet && keyMap[flattenedNode.key]) {
          flattenedNode.checked = true;
          flattenedNode.indeterminate = false;
          this.handleNodeCheckChange(flattenedNode, true);
        }
      });
    },

    setCheckedNodes(nodes) {
      if (!nodes || !Array.isArray(nodes) || !this.nodeKey) {
        return;
      }

      const keys = nodes.map(node => node[this.nodeKey]);

      this.setCheckedKeys(keys);
    },

    getCheckedKeys(leafonly = false) {
      if (!this.nodeKey) {
        return [];
      }
      const checkedKeys = [];

      this.traverseFlattenedNodes(flattenedNode => {
        const { key, checked, isLeaf } = flattenedNode;
        const canGet = leafonly ? isLeaf : true;

        canGet && checked && checkedKeys.push(key);
      });

      return checkedKeys;
    },

    getCheckedNodes(leafonly = false) {
      if (!this.nodeKey) {
        return [];
      }

      const checkedNodes = [];

      this.traverseFlattenedNodes(flattenedNode => {
        const { originNode, checked, isLeaf } = flattenedNode;
        const canGet = leafonly ? isLeaf : true;

        canGet && checked && checkedNodes.push(originNode);
      });

      return checkedNodes;
    },

    setChecked(keyOrData, checked, deep = false) {
      if (!keyOrData || !this.nodeKey) {
        return;
      }

      const isData = typeof keyOrData === 'object';
      const key = isData ? keyOrData[this.nodeKey] : keyOrData;

      this.traverseFlattenedNodes(flattenedNode => {
        if (flattenedNode.key === key) {
          flattenedNode.checked = checked;
          flattenedNode.indeterminate = false;

          deep && this.handleNodeCheckChange(flattenedNode, checked);
          return true;
        }
      });
    },

    getHalfCheckedNodes() {
      if (!this.showCheckbox) {
        return [];
      }

      const results = [];

      this.traverseFlattenedNodes(flattenedNode => {
        if (flattenedNode.indeterminate) {
          results.push(flattenedNode);
        }
      });

      return results;
    },

    getHalfCheckedKeys() {
      if (!this.showCheckbox || !this.nodeKey) {
        return [];
      }

      const results = [];

      this.traverseFlattenedNodes(flattenedNode => {
        if (flattenedNode.indeterminate) {
          results.push(flattenedNode.key);
        }
      });

      return results;
    },

    getCurrentKey() {
      if (!this.nodeKey) {
        return null;
      }

      let key = null;

      this.traverseFlattenedNodes(flattenedNode => {
        if (flattenedNode.selected) {
          key = flattenedNode.key;
          return true;
        }
      });

      return key;
    },

    getCurrentNode() {
      if (!this.nodeKey) {
        return null;
      }

      let currentNodeData = null;
      this.traverseFlattenedNodes(flattenedNode => {
        if (flattenedNode.selected) {
          currentNodeData = flattenedNode.originNode;
        }
      });

      return currentNodeData;
    },

    setCurrentKey(key) {
      if (!this.nodeKey) {
        return;
      }

      if (key === null) {
        this.selectedNode.selected = false;
        return;
      }

      this.traverseFlattenedNodes(flattenedNode => {
        flattenedNode.selected = false;

        if (key === flattenedNode.key) {
          flattenedNode.selected = true;
        }
      });
    },

    setCurrentNode(node) {
      if (!this.nodeKey || node === undefined) {
        return;
      }

      const key = node[this.nodeKey] || null;
      this.setCurrentKey(key);
    },

    filter(val) {
      if (!this.filterNodeMethod) {
        return;
      }

      if (val === '' || val === undefined) {
        this.isFiltering = false;
        this.traverseFlattenedNodes(flattenedNode => {
          flattenedNode.expanded = true;
          flattenedNode.visible = true;
          flattenedNode.filtered = false;
          flattenedNode.hasFilteredChildren = false;
        });

        this.filterFlattenedNodes();
        this.setDOMRelated();
        return;
      }

      this.isFiltering = true;
      const { filterNodeMethod } = this;

      this.traverseFlattenedNodes(flattenedNode => {
        // true 表示该节点可以显示
        const canShow = filterNodeMethod(
          val,
          flattenedNode.originNode,
          flattenedNode
        );
        flattenedNode.visible = canShow;
        flattenedNode.filtered = canShow;

        if (canShow) {
          this.traverseParent(flattenedNode, parentNode => {
            parentNode.expanded = true;
            parentNode.visible = true;
            parentNode.filtered = true;
            parentNode.hasFilteredChildren = true;
          });
        }
      });

      this.filterFlattenedNodes();
      this.setDOMRelated();
    },

    updateKeyChildren() {
      // 感觉很鸡肋的方法，暂不实现
      return;
    }
  }
};
</script>

<style lang="scss" scoped>
.mr10 {
  margin-right: 10px;
}

.d-tree {
  overflow: auto;
  position: relative;
  height: 100%;
}

.d-tree-empty {
  height: 100%;
  font-size: 14px;
  color: #aaa;
}

.d-tree-nodes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.d-tree-node {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 26px;
  white-space: nowrap;
  cursor: pointer;

  &:hover,
  &.selected {
    background-color: #f5f7fa;
  }
}

.d-tree-node__indent {
  display: inline-block;
}

.d-tree-node__expand-icon {
  padding: 6px;
  font-size: 12px;
  color: #c0c4cc;
  cursor: pointer;

  &.is-leaf {
    color: transparent;
    cursor: default;
  }
}

.d-tree-node__loading-icon {
  margin-right: 8px;
  font-size: 14px;
  color: #c0c4cc;
}

.d-tree-node__content {
  flex: 1;
  font-size: 14px;
  text-align: left;
  color: #606266;
  cursor: pointer;
}
</style>

