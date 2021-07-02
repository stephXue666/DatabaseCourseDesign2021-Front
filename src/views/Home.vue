<template>
  <el-container>
    <el-header style="padding: 0">
      <top-nav/>
    </el-header>
    <el-main>
      <!--这里写代码-->
      <h1>平台首页</h1>
      <!--测试暂时用代码代替，后续用表格存放酒店列表-->
      <el-button @click="toDetails(1)">酒店1</el-button>
      <el-button @click="toDetails(2)">酒店2</el-button>
      <el-button @click="toDetails(3)">酒店3</el-button>
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
  methods: {
    toDetails(hid) {
      this.$router.push({
        path: '/details',
        query: { id: hid }
      })
    }
  },
}
</script>
