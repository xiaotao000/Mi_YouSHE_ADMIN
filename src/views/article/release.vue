<template>
  <div class="edition">
    <div class="mhy-container">
      <div class="mhy-new-article__header">
        <h1>{{ formData.id ? '修改帖子' : '发布帖子' }}</h1>
      </div>
      <div class="mhy-new-article__editor">
        <el-form
          ref="ruleForm"
          action="none"
          :rules="rules"
          :label-position="'left'"
          :model="formData"
          label-width="100px"
          class="demo-ruleForm"
          @submit.native.prevent="submitArticle"
        >
          <el-form-item label="标题：" prop="title">
            <el-input
              v-model="formData.title"
              style="width: 750px"
              type="text"
              placeholder="标题（必填）"
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="内容">
            <el-tiptap v-model="formData.introduce" lang="zh" :extensions="extensions" height="350" placeholder="请输入文章内容" />
          </el-form-item>
          <el-form-item label="封面图">
            <el-upload
              action="http://172.19.10.137:3000/api/cover"
              name="cover"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :before-upload="beforeUpload"
              :on-remove="handleRemove"
              :file-list="imgUrlList"
              :on-success="successUpload"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>

          <el-form-item label="发布版块：" prop="category">
            <el-radio v-model="formData.category" label="酒馆">酒馆</el-radio>
            <el-radio v-model="formData.category" label="攻略">攻略</el-radio>
            <el-radio v-model="formData.category" label="硬核">硬核</el-radio>
            <el-radio v-model="formData.category" label="cos">cos</el-radio>
            <el-radio v-model="formData.category" label="官方">官方</el-radio>
            <el-radio v-model="formData.category" label="同人图">同人图</el-radio>
          </el-form-item>
          <el-form-item label="话题：" prop="section">
            <el-input
              v-model="formData.section"
              placeholder="请输入话题"
            />
          </el-form-item>
          <el-form-item style="text-align: center">
            <button type="submit" class="submit-button">{{ formData.id ? '修改' : '发布' }}</button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { reqAddArticle, uploadImage, seArticle, modifyArticle } from '@/api/article'
import { ElementTiptap, Doc, Text, Paragraph, Heading, Bold, Underline, Italic, Image, Strike, ListItem, BulletList, OrderedList, TodoItem, TodoList, HorizontalRule, Fullscreen, Preview, CodeBlock, TextColor } from 'element-tiptap'
import 'element-tiptap/lib/index.css'

export default {
  name: 'AddArticle',
  components: {
    elTiptap: ElementTiptap
  },
  data() {
    const validatorContent = (rule, value, callback) => {
      if (value === '<p></p>') {
        // 验证失败
        callback(new Error('请输入文章内容'))
      } else {
        // 验证通过
        callback()
      }
    }
    return {
      formData: {
        category: '',
        cover: []
      },
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      imgUrlList: [],
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          // 默认会把图片生成 base64 字符串和内容存储在一起，如果需要自定义图片上传
          uploadRequest(file) {
            // 如果接口要求 Content-Type 是 multipart/form-data，则请求体必须使用 FormData
            const fd = new FormData()
            fd.append('imgUrl', file)
            // 第1个 return 是返回 Promise 对象
            // 为什么？因为 axios 本身就是返回 Promise 对象
            return uploadImage(fd).then(res => {
              // console.log(res)
              // 这个 return 是返回最后的结果
              return 'http://172.19.10.137:3000' + res.data
            })
          } // 图片的上传方法，返回一个 Promise<url>
        }),
        new Underline(), // 下划线
        new Italic(), // 斜体
        new Strike(), // 删除线
        new HorizontalRule(), // 华丽的分割线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
        new Preview(),
        new CodeBlock(),
        new TextColor()
      ],
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入文章内容' },
          { validator: validatorContent }
        ],
        category: [{ required: true, message: '请选择版块', trigger: 'blur' }],
        section: [{ required: true, message: '请输入话题', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.formData.category = this.$route.query.category
    this.getArticle()
  },
  methods: {
    successUpload(res, file, fileList) {
      this.fileList = fileList
    },
    async getArticle() {
      if (!this.$route.query.id) return
      const res = await seArticle({ id: this.$route.query.id })
      const arr = res.data.map(item => ({ id: item.id, title: item.title, introduce: item.introduce, cover: item.cover, category: item.category, section: item.section }))
      this.formData = arr[0]
      console.log(arr[0].cover)
      arr[0].cover.forEach(item => {
        if (item.imgUrl.indexOf('http://172.19.10.137:3000')) {
          this.imgUrlList.push({ url: 'http://172.19.10.137:3000' + item.imgUrl })
        } else {
          this.imgUrlList.push({ url: item.imgUrl })
        }
      })
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.imgUrlList = fileList
    },
    // 预览图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 校验规则
    beforeUpload(file) {
      const { type, size } = file
      if (type !== 'image/jpeg' && type !== 'image/png') {
        this.$message.error('文件必须为JPEG | PNG')
        return false
      }
      if (size / 1024 / 1024 > 2) {
        this.$message.error('文件不能大于2MB')
        return false
      }
    },
    async submitArticle() {
      try {
        await this.$refs.ruleForm.validate()
        this.formData.cover = this.fileList.map(item => ({ imageName: item.name, imgUrl: (item.response && item.response.data[0].imgUrl) || item.url }))
        this.formData.id ? await modifyArticle(this.formData) : await reqAddArticle(this.formData)
        this.$message.success(this.formData.id ? '修改成功' : '发布成功！！！')
        this.$router.push('/manage')
        Object.assign(this.$data, this.$options.data())
      } catch (error) {
        console.log('添加失败！！', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mhy-container {
  margin-top: 30px;
  margin-bottom: 60px;
  background-color: #fff;
  border-radius: 4px;
  .mhy-new-article__header {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      font-size: 16px;
      font-weight: 600;
    }
  }
  .mhy-new-article__editor {
    width: auto;
    padding: 50px 80px 40px;
      .submit-button {
        width: 190px;
        height: 42px;
        margin: 0 auto;
        text-align: center;
        cursor: pointer;
        border: 0;
        outline: 0;
        background-color: #00c3ff;
        color: #fff;
        border-radius: 4px;    }
  }
}
</style>
