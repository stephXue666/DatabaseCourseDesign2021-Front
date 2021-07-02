<template>
  <div style="background-color: #409EFF; height: 60px">
    <el-row>
      <el-col :span="6">
        <h2 style="color: white; margin-top: 10px">酒店预定平台</h2>
      </el-col>
      <!--未登录状态的导航栏-->
      <el-col :offset="13" :span="5">
        <el-menu v-if="!loginStatus" default-active='/home' mode="horizontal" background-color="#409EFF"
                 text-color="#fff" active-text-color="#ffd04b" style="border-bottom: 0" router>
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/login">登录/注册</el-menu-item>
      </el-menu>
      <!--已登录状态的导航栏-->
        <el-menu v-else :default-active="$route.path" mode="horizontal" background-color="#409EFF"
                 text-color="#fff" active-text-color="#ffd04b" style="border-bottom: 0" router>
        <el-menu-item index="/home">首页</el-menu-item>
        <el-submenu>
          <template #title>个人中心</template>
          <el-menu-item index="/info">个人信息管理</el-menu-item>
          <el-menu-item index="/history">浏览记录</el-menu-item>
          <el-menu-item index="/favorite">酒店收藏</el-menu-item>
          <el-menu-item index="/order">订单管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="/logout" @click="logOut">注销</el-menu-item>


      </el-menu>
      </el-col>
    </el-row>
  </div>
</template>


<script>
export default {
  data() {
    return {
      loginStatus: false,
      activeIndex: '',
    }
  },
  created() {
    this.getLoginStatus()
  },
  methods: {
    logOut() {
      //设置session中的id值为用户ID
      window.sessionStorage.setItem('uid', '0')
      this.loginStatus = false
    },
    getLoginStatus() {
      let status = window.sessionStorage.getItem('uid')
      switch (status) {
        case '0':
          break
        case '1':
          this.loginStatus = true
          break
      }
    },
  },
}
</script>


<style scoped>

</style>