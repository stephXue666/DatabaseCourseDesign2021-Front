<template>
  <!--这里写代码-->
  <h1>登录页面</h1>
  <!--暂时用按钮跳转，后续用表单提交，结果正确时跳转-->
  <el-button @click="logIn(1)">登录住户成功</el-button>
  <el-button @click="logIn(2)">登录酒店成功</el-button>
  <el-button @click="logIn(4)">登录酒店未审核</el-button>
  <el-button @click="logIn(3)">登录管理员成功</el-button>
  <el-button @click="logIn(0)">返回</el-button>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    //登录函数
    logIn(character) {
      //设置session中的id值为用户ID
      switch (character) {
        case 0:
          this.$router.push('/home')
          break
        case 1:
          window.sessionStorage.setItem('uid', '1')
          this.$router.push('/home')
          break
        case 2:
          window.sessionStorage.setItem('uid', '2')
          this.$router.push('/hotel/home')
          break
        case 3:
          window.sessionStorage.setItem('uid', '3')
          this.$router.push('/admin/home')
          break
        case 4:
          window.sessionStorage.setItem('uid', '2')
          this.$router.push('/hotel/wait')
          break
      }

    },
  }
}
</script>

<style scoped>

</style>