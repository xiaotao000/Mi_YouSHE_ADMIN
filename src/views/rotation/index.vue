<template>
  <div>
    <h1>轮播图</h1>
    <uploads @input="updateImg">
      上传
    </uploads>
  </div>
</template>

<script>
import { uploads } from '@/views/update'
export default {
  name: 'Rotation',
  components: { uploads },
  methods: {
    updateImg() {
      console.log(121)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
