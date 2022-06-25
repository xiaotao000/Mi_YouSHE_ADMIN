<template>
  <div class="dashboard-container">
    <div class="nmh">
      <div class="nm">编辑资料</div>
    </div>
    <div class="kmAdd">
      <!-- 头像 -->
      <div class="taoTuo">
        <el-upload
          class="avatar-uploader"
          action="http://192.168.43.104:3000/my/admin/update/avatar"
          :show-file-list="false"
          :headers="myHeaders"
          :on-success="scrubData"
          name="avatar"
        >
          <div class="mhy-avatar">
            <!-- 头像 -->
            <img :src="imgUrl" alt="">
          </div>
        </el-upload>
        <p>修改头像</p>
      </div>
      <el-form ref="formInput" :model="formInput" :rules="rules" @submit.prevent="submitForm">
        <el-form-item prop="nickname">
          <el-input v-model="formInput.nickname" type="text" placeholder="请输入昵称" maxlength="8" show-word-limit style="width:500px" />
        </el-form-item>
        <div style="margin-top:20px">
          <el-input v-model="juPassword" type="password" placeholder="请输入旧密码" maxlength="8" show-word-limit style="width:500px" />
        </div>
        <el-form-item prop="password1">
          <div style="margin-top:20px">
            <el-input v-model="formInput.password1" type="password" placeholder="输入更改密码" :disabled="juPassword===userInfo.password ? false : true" maxlength="8" show-word-limit style="width:500px" />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="nmpi">
      <el-button type="textarea" @click="submitForm('formInput')">保存</el-button>
    </div>
  </div>
</template>

<script>
// import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { mapState } from 'vuex'
import { getToken } from '@/utils/auth'
import { setData } from '@/api/user'
const token = getToken()
export default {
  // components: { ValidationProvider, ValidationObserver },
  data() {
    return {
      IsDialog: true,
      juPassword: '',
      formInput: {
        gender: '保密'
      },
      imgSrc: 'https://img-static.mihoyo.com/communityweb/upload/c9d11674eac7631d2210a1ba20799958.png',
      myHeaders: { authorization: 'Bearer ' + token },
      rules: {
        nickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password1: [
          { min: 6, max: 12, message: '长度在 6 到 12', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    imgUrl() {
      return this.userInfo.avatar ? 'http://192.168.43.104:3000' + this.userInfo.avatar : this.imgSrc
    },
    Ckname() {
      return this.formInput.nickname ? this.formInput.nickname : this.userInfo.nickname
    },
    Ckpassword() {
      return this.formInput.password1 ? this.formInput.password1 : this.userInfo.password
    }
  },
  mounted() {
    this.formInput = { ...this.userInfo }
    console.log(this.userInfo)
  },
  methods: {
    async submitForm(formInput) {
      const success = this.$refs[formInput].validate()
      if (!success) return
      console.log(this.Ckname)
      try {
        await setData({ nickname: this.Ckname, password: this.Ckpassword })
        this.$message.success('修改成功')
        this.$store.dispatch('user/getUserInfo')
      } catch (error) {
        this.$message.error('修改失败')
      }
    },
    scrubData() {
      this.$store.dispatch('user/getInfo')
    }
  }
}
</script>

<style scoped>
::v-deep .el-button--primary{
  background: #ffffff;
  width: 113px;
}
.nmpi{
  text-align: center;
  margin-top: 30px;
}
::v-deep .el-textarea__inner{
    height: 84px;
}
.lft{
  margin-right: 30px;
  display: inline-block;
  cursor: pointer;
}
.mhy-radio__icon {
    display: inline-block;
    height: 14px;
    width: 14px;
    /* border: 1px solid #b2b2b2; */
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 100%;
    margin-right: 8px;
    vertical-align: -0.15em;
}
.mhy-radio--active {
    border: 4px solid #00c3ff;
}
.plo{
  margin-left: 4px;
  cursor: pointer;
  color: #00b2ff;
}
.srKxaTao>img{
  margin-right: 6px;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
.nte{
  width: 60px;
    text-align: right;
    color: #999;
    margin-right: 30px;
}
.srKxaTao{
  color: #999;
    line-height: 16px;
    font-size: 12px;
    margin: 8px 0 21px 91px;
    display: flex;
    align-items: center;
}
.srKxa{
  display: flex;
  margin-bottom: 25px;
  position: relative;
}
.srKxa span{
  position: absolute;
  top: 35px;
  color: red;
  left: 90px;
}
.name{
  line-height: 44px;
    overflow: hidden;
}
.taoTuo>p{
  cursor: pointer;
    color: #00c3ff;
    font-size: 12px;
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
.taoTuo{
  position: relative;
    text-align: center;
    width: 120px;
    margin: 0 auto 23px;
}
.kmAdd{
  text-align: center;
  padding: 40px 30px 35px;
}
.nm{
margin-left: 30px;
}
.nmh{
  width: 100%;
    line-height: 50px;
    border-bottom: 1px solid #ebebeb;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
}
::v-deep .el-form-item__error{
  margin-left: 432px;
}
</style>
