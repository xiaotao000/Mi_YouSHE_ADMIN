<template>
  <div class="dashboard-container">
    <h1>轮播图</h1>
    <el-button type="primary" @click="dialogVisible = true">新增轮播图</el-button>
    <!-- 当前显示轮播图列表 -->
    <el-table
      :data="articleList"
      style="width: 100%; margin-top: 20px"
      border
    >
      <el-table-column
        label="序号"
      >
        <template v-slot="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="addKlm"
        label="标题"
      />
      <el-table-column
        label="轮播图片"
      >
        <template v-slot="{ row }">
          <img style="width:100px;height:100px" :src="'http://172.19.10.109:3000'+ row.imgUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="addPlo"
        label="名字"
        width="500"
      />
      <el-table-column
        label="操作"
        width="180"
      >
        <template v-slot="{ row }">
          <el-button type="primary" icon="el-icon-edit" circle @click="modifyChart(row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="reqChart(row)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增弹窗 -->
    <el-dialog
      :title="a"
      :visible.sync="dialogVisible"
      width="40%"
      center
    >
      <div class="taoTuo">
        <el-upload
          class="avatar-uploader"
          action="http://172.19.10.109:3000/api/cover"
          :show-file-list="false"
          :headers="myHeaders"
          :on-success="a1"
          name="cover"
        >
          <div class="mhy-avatar">
            <!-- 头像 -->
            <img :src="formData.imgUrl.startsWith('https://gimg2.baidu.com/') ? formData.imgUrl : 'http://172.19.10.109:3000'+ formData.imgUrl" alt="" style="width:300px; height:200px">
          </div>
        </el-upload>
      </div>
      <div>
        <el-radio-group v-model="formData.addKlm">
          <el-radio :label="'活动'">活动</el-radio>
          <el-radio :label="'咨询'">咨询</el-radio>
          <el-radio :label="'资讯'">资讯</el-radio>
          <el-radio :label="'公告'">公告</el-radio>
        </el-radio-group>
      </div>
      <div v-if="formData.id" style="margin-top:20px">
        <el-input v-model="formData.serial" placeholder="请输入排列序号" style="width:350px" />
      </div>
      <div style="margin-top:20px">
        <el-input v-model="formData.addPlo" placeholder="请输入活动名称" style="width:350px" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="a2">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

import { reqAdtdm, addChart, modifyData, deleteChart } from '@/api/user'
const token = getToken()

export default {
  name: 'Rotation',
  data() {
    return {
      a: '新增',
      articleList: [],
      dialogVisible: false,
      myHeaders: { authorization: 'Bearer ' + token },
      formData: {
        imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.soutu123.cn%2Felement_origin_min_pic%2F01%2F40%2F65%2F61573d0bf6a3c2b.jpg%21%2Ffw%2F700%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue&refer=http%3A%2F%2Fpic.soutu123.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658903069&t=b7bdd3bf3baa27e58c88af5c5fc607d0'
      }
    }
  },
  mounted() {
    this.getImage()
  },
  methods: {
    updateImg() {
      console.log(121)
    },
    async getImage() {
      const res = await reqAdtdm()
      this.articleList = res.data
    },
    a1(response, file, fileList) {
      this.formData.imgUrl = response.data[0].imgUrl
      console.log(this.formData.imgUrl)
    },
    async a2() {
      try {
        this.formData.id ? await modifyData(this.formData) : await addChart(this.formData)
        this.$message.success(this.formData.id ? '修改成功' : '新增成功')
        this.dialogVisible = false
        this.formData = {
          imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.soutu123.cn%2Felement_origin_min_pic%2F01%2F40%2F65%2F61573d0bf6a3c2b.jpg%21%2Ffw%2F700%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue&refer=http%3A%2F%2Fpic.soutu123.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658903069&t=b7bdd3bf3baa27e58c88af5c5fc607d0'
        }
        this.getImage()
      } catch (error) {
        this.$message.error('新增失败')
      }
    },
    async modifyChart(row) {
      this.a = '修改'
      this.formData = { ...row }
      this.dialogVisible = true
      console.log(row)
    },
    // 删除轮播提
    async reqChart(row) {
      if (window.confirm('你确定要删除吗？')) {
        await deleteChart(row.id)
        this.$message.success('删除成功')
        this.getImage()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.taoTuo>p{
  cursor: pointer;
    color: #00c3ff;
    font-size: 12px;
}
.taoTuo{
  position: relative;
    text-align: center;
    // width: 120px;
    margin: 0 auto 23px;
}
::v-deep .el-dialog__body {
  text-align: center;
}
</style>
