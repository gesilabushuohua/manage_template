<!--
 * @Description: des
 * @Date: 2020-04-04 16:46:16
 * @Author: LB
 -->
<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="400px">
    <el-form ref="form" :model="formData" :rules="formRules" label-width="100px">
      <el-form-item label="模板下载:" style="text-align: center">
        <a :href="templateLink">点击下载{{ templateName }}</a>
      </el-form-item>
      <el-form-item label="文件上传:" style="text-align: center" prop="file">
        <el-upload
          ref="upload"
          :auto-upload="false"
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="true"
          :on-change="handleChange"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button size="small" type="primary" @click="verifyForm" :loading="isUploading">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'ImportDialog',
  props: {
    title: {
      type: String,
      default: '下载表格'
    },
    templateLink: {
      type: String,
      default: '#'
    },
    templateName: {
      type: String,
      default: '模板'
    },
    importFileFn: {
      type: [Function, Object],
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      isUploading: false,
      formData: {
        file: null
      },
      formRules: {
        file: [{ required: true, message: '请选择文件', trigger: 'change' }]
      }
    };
  },
  methods: {
    open() {
      this.dialogVisible = true;
      if (this.formData.file !== null) {
        this.formData = {
          file: null
        };
        this.$refs.upload.clearFiles();
      }
    },
    handleChange(file) {
      this.formData = { file: file.raw };
    },
    verifyForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitForm();
        }
      });
    },
    submitForm() {
      if (
        this.importFileFn === null ||
        typeof this.importFileFn !== 'function'
      ) {
        return;
      }

      const params = new FormData();
      for (let key in this.formData) {
        params.append(key, this.formData[key]);
      }

      this.isUploading = true;
      this.importFileFn(params)
        .then(res => {
          const { isSuccessed } = res;
          if (isSuccessed) {
            this.dialogVisible = false;
            this.$message({
              type: 'success',
              message: '上传成功'
            });
          }
        })
        .catch(err => {
          this.$message({
            type: 'warning',
            message: '上传失败，稍后再试'
          });
        })
        .finally(() => {
          this.isUploading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.download {
  cursor: pointer;
}
</style>