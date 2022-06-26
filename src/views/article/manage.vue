<template>
  <div class="dashboard-container">
    <el-input
      v-model="search"
      placeholder="请输入内容"
      prefix-icon="el-icon-search"
      style="width:400px; margin-bottom:20px ;"
      @change="getSearch"
    />
    <el-button type="primary" style="margin-left:10px ;" @click="$router.push('/article/release')">添加发布文章</el-button>
    <el-form :model="formInline.article" inline>
      <el-form-item label="分类查询">
        <el-select v-model="formInline.region" placeholder="分类">
          <el-option v-for="item in formInline.type" :key="item.id" :label="item.alias_name" :value="item.alias_name" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getArticleTypeList">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table
      :data="articleList"
      style="width: 100%"
    >
      <el-table-column
        prop="time"
        label="日期"
        width="220"
      />
      <el-table-column
        prop="author"
        label="作者"
        width="180"
      />
      <el-table-column
        prop="title"
        width="280"
        label="标题"
      />
      <el-table-column
        label="封面图"
        width="400"
      >
        <template v-slot="{ row }">
          <img v-for="img in row.cover.slice(0,3)" :key="img.id" :src="img.imgUrl.startsWith('http://') ? img.imgUrl : `http://192.168.43.104:3000${img.imgUrl}`" alt="" width="100px" height="100px" style="margin-left: 10px">
        </template>
      </el-table-column>
      <el-table-column
        prop="category"
        label="分类"
      />
      <el-table-column
        label="操作"
        width="180"
      >
        <template v-slot="{ row }">
          <el-button v-a="'edit'" style="margin-right:10px" type="primary" icon="el-icon-edit" circle @click="editArticle(row)" />
          <el-button v-a="'remover'" type="danger" icon="el-icon-delete" circle @click="reqArticle(row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      style="text-align: center; margin-top: 20px;"
      background
      layout="prev, pager, next, jumper, ->, total, sizes"
      :total="total"
      :page-sizes="[5, 10, 20]"
      :page-size="limit"
      :current-page="pagenum"
      @current-change="pageChange"
      @size-change="sizeChange"
    />
  </div>
</template>

<script>
import { getType, ArticleList, ArticleTypeList, searchArticle, removeArticle } from '@/api/article'
export default {
  name: 'Manage',
  data() {
    return {
      search: '',
      formInline: {
        // 分类
        type: {}
      },
      // 文章数据
      articleList: [],
      pagenum: 1,
      limit: 5,
      total: 0
    }
  },
  mounted() {
    this.getType()
    this.getArticleList()
  },
  methods: {
    async getType() {
      const res = await getType()
      this.formInline.type = res.data
    },
    async getArticleList() {
      const res = await ArticleList({ pagenum: this.pagenum, limit: this.limit })
      console.log(res.data)
      this.articleList = res.data
      this.pagenum = res.pagenum
      this.limit = res.limit
      this.total = res.total
    },
    pageChange(page) {
      this.pagenum = page
      // 2. 重新获取品牌列表
      this.formInline.region ? this.getArticleTypeList() : this.getArticleList()
    },
    sizeChange(limit) {
      this.limit = limit
      // 1.1 还原页码
      this.pagenum = 1
      // 2. 重新获取品牌列表
      this.formInline.region ? this.getArticleTypeList() : this.getArticleList()
    },
    async getArticleTypeList() {
      const res = await ArticleTypeList({ category: this.formInline.region, pagenum: this.pagenum, limit: this.limit })
      console.log(res)
      this.search = ''
      this.articleList = res.data
      this.pagenum = res.pagenum
      this.limit = res.limit
      this.total = res.total
    },
    // 搜索文章
    async getSearch() {
      const res = await searchArticle({ search: this.search })
      console.log(res)
      this.articleList = res.data
      this.pagenum = res.pagenum
      this.limit = res.limit
      this.total = res.total
    },
    // 删除文章
    async reqArticle(id) {
      await removeArticle(id)
      this.$message.success('删除成功')
      if (this.search) {
        this.getSearch()
      } else {
        this.formInline.region ? this.getArticleTypeList() : this.getArticleList()
      }
    },
    editArticle(row) {
      this.$router.push({ path: '/release', query: { id: row.id }})
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
