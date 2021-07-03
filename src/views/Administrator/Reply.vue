<template>
  <el-container style="height: 700px">
    <el-header style="background-color: #2c3e50; color: white">
      <back-nav/>
    </el-header>
    <el-container style="height: 100%" >
      <el-aside width="200px" style="background-color: #545c64">
        <SideNav/>
      </el-aside>
      <el-main>
        <el-card class="box-card">
          <!--这里写代码-->
          <h3>回复用户页面</h3>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideNav from "../../components/SideNav"
import BackNav from "../../components/BackNav"

export default {
	components: {
    SideNav,
    BackNav,
	},
  data() {
    return {

    }
  },
  methods: {

  },
}
</script>
