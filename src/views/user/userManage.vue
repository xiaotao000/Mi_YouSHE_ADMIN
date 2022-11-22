<template>
  <div class="dashboard-container">
    <el-input
      v-model="search"
      placeholder="请输入内容"
      prefix-icon="el-icon-search"
      style="width:400px; margin-bottom:20px ;"
      @change="searchData"
    />
    <!-- 文章列表 -->
    <el-table
      :data="articleList"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="序号"
      />
      <el-table-column
        prop="nickname"
        label="用户名"
      />
      <el-table-column
        label="头像"
      >
        <template v-slot="{ row }">
          <img style="width:100px;height:100px" :src="'http://172.19.10.109:3000' + row.avatar" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
      >
        <template v-slot="{ row }">
          <el-switch
            v-model="row.is_delete"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
            inactive-color="#ff4949"
            @change="q1(row)"
          />
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
import { userList, disableUser, getSearch } from '@/api/user'
export default {
  name: 'UserManage',
  data() {
    return {
      articleList: [],
      search: '',
      total: 0,
      pagenum: 1,
      limit: 5,
      dialogVisible: true,
      input: {
        nickname: '',
        password: ''
      }
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const res = await userList({ pagenum: this.pagenum, limit: this.limit })
      console.log(res)
      this.articleList = res.data
      this.pagenum = res.pagenum
      this.limit = res.limit
      this.total = res.total
    },
    pageChange(page) {
      console.log(page)
      this.pagenum = page
      // 2. 重新获取品牌列表
      this.getUserList()
    },
    sizeChange(limit) {
      this.limit = limit
      // 1.1 还原页码
      this.pagenum = 1
      // 2. 重新获取品牌列表
      this.getUserList()
    },
    scrubData(response, file, fileList) {
      this.$store.dispatch('user/getInfo')
    },
    async q1(row) {
      const res = await disableUser(row.id)
      console.log(res)
      this.$message({
        message: res.message,
        type: 'success'
      })
      this.getUserList()
    },
    async searchData() {
      const res = await getSearch({ search: this.search })
      this.articleList = res.data
      this.pagenum = res.pagenum
      this.limit = res.limit
      this.total = res.total
    }
  }
}
</script>

<style lang="scss" scoped>
.xz_user{
  text-align: center;
  margin: 0 auto;
}
.taoTuo{
  position: relative;
    text-align: center;
    width: 120px;
    margin: 0 auto 23px;
}
.mhy-avatar img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #ebebeb;
  vertical-align: top;
}
.mhy-avatar{
  cursor: pointer;
    width: 120px;
    height: 120px;
    margin-bottom: 23px;
}

::v-deep .el-form-item__error{
  margin-left: 45px;
}
</style>
