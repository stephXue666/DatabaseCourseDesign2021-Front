<template>
  <el-row>
    <el-col :span="3">
      <h1 style="margin-top: 10px">{{ title }}</h1>
    </el-col>
    <el-col :span="2" :offset="19">
      <el-button type="danger" style="margin-top: 10px" @click="logOut">注销</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      title: ''
    }
  },
  created() {
    this.getTitle()
  },
  methods: {
    logOut() {
      this.$router.push('/login')
      window.sessionStorage.setItem('uid', '0')
    },
    getTitle() {
      let character = this.$route.path
      if(character.substring(1,6) === 'admin')
        this.title = '管理员后台'
      else {
        if(character.substring(7,11) === 'wait')
          this.title = '酒店后台'
        else
          this.title = '酒店后台'
      }
    },
  },
}
</script>

<style scoped>

</style>