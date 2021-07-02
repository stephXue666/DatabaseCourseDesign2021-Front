<template>
  <el-container>
    <el-header style="padding: 0">
      <top-nav/>
    </el-header>
    <el-main>
      <!--这里写代码-->
      <h1>酒店详情页</h1>
      <h3>酒店ID：{{$route.query.id}}</h3>
    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>


<script>
import TopNav from "../components/TopNav";
export default {
  components: {
    TopNav,
  },
  data() {
    return {

    }
  },
  created() {
    console.log(this.$route.query.id)
  },
  methods: {

  },
}
</script>


<style scoped>

</style>