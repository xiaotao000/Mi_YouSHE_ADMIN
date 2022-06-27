<template>
  <div>
    <draggable :value="value" filter=".forbid" :move="onMove" @input="$emit('input', $event)">
      <div v-for="(url, index) in value" :key="url" class="image-box">
        <el-image :src="url | imgurl" :preview-src-list="value | imgurl" />
        <div class="del-box">
          <el-button size="medium" type="text" icon="el-icon-close" @click="del(index)" />
        </div>
      </div>
      <template #footer>
        <el-upload :action="action" :on-success="success" :show-file-list="false" class="upload forbid" :before-upload="beforeUpload">
          <i class="el-icon-plus" />
        </el-upload>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'Uploads',
  components: {
    draggable
  },
  props: {
    action: {
      type: String,
      default: 'http://192.168.43.104:3000/api/cover'
    },
    value: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 9
    }
  },
  data() {
    return {}
  },
  methods: {
    del(i) {
      this.value.splice(i, 1)
      this.$emit('input', this.value)
      this.$emit('change', this.value)
    },
    success(req, file) {
      const name = req.files[0].name
      if (this.value.includes(name)) return this.$message.warning('不能上传重复图片')
      this.value.push(name)
      this.$emit('input', this.value)
      this.$emit('change', this.value)
    },
    onMove(e) {
      if (!e.relatedContext.element) return false
      return true
    },
    beforeUpload() {
      return this.value.length < this.limit
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-upload {
    width: 180px;
    height: 180px;
    .el-icon-plus {
      margin-top: calc(50% - 7px);
    }
  }
}
.image-box {
  position: relative;
  display: inline-block;
  overflow: hidden;
  width: 180px;
  height: 180px;
  margin-right: 8px;
  box-sizing: border-box;
  border: #409eff 1px dashed;
  border-radius: 6px;
  .el-image {
    width: 100%;
    height: 100%;
  }
  .del-box {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    border-top: 42px solid rgba($color: #666, $alpha: 0.3);
    border-left: 42px solid transparent;
    transition: 0.2s;
    .el-button {
      position: absolute;
      top: -47px;
      left: -19px;
      color: #fff;
    }
  }
  &:hover {
    .del-box {
      opacity: 1;
      &:hover {
        border-top: 42px solid rgba($color: #666, $alpha: 0.5);
      }
    }
  }
}
.upload {
  display: inline-block;
}
</style>
