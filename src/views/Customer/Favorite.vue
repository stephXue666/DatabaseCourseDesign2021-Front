<template>
  <el-container>
    <el-header style="padding: 0">
      <TopNav/>
    </el-header>
    <el-main>
      <!--这里写代码-->
      <h1>酒店收藏夹</h1>
    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script>
import TopNav from "../../components/TopNav";

export default {
	components: {
    TopNav,
	}

}
</script>
