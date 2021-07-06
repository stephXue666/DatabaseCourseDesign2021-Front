<template>
  <!--正常酒店的侧栏-->
  <el-menu v-if="character==='hotel'" :default-active="$route.path" background-color="#545c64" ref="menu"
           text-color="#fff" active-text-color="#ffd04b" style="border-right: 0" :unique-opened="true" router>
    <el-menu-item index="/hotel/home">
      <i class="el-icon-menu"></i>
      <template #title>酒店主页</template>
    </el-menu-item>
    <el-menu-item index="/hotel/info">
      <i class="el-icon-document"></i>
      <template #title>酒店管理</template>
    </el-menu-item>
    <el-menu-item index="/hotel/room">
      <i class="el-icon-document"></i>
      <template #title>房间管理</template>
    </el-menu-item>
    <el-menu-item index="/hotel/order">
      <i class="el-icon-document"></i>
      <template #title>订单管理</template>
    </el-menu-item>
    <el-menu-item index="/hotel/report">
      <i class="el-icon-setting"></i>
      <template #title>流水统计</template>
    </el-menu-item>
  </el-menu>
  <!--待审核酒店的侧栏-->
  <el-menu v-if="character==='wait'" default-active="/hotel/wait" background-color="#545c64"
           text-color="#fff" active-text-color="#ffd04b" style="border-right: 0" router>
    <el-menu-item index="/hotel/wait">
      <i class="el-icon-menu"></i>
      <template #title>审核酒店</template>
    </el-menu-item>
  </el-menu>
  <!--管理员的侧栏-->
  <el-menu v-if="character==='admin'" :default-active="$route.path" background-color="#545c64"
           text-color="#fff" active-text-color="#ffd04b" style="border-right: 0" router>
    <el-menu-item index="/admin/home">
      <i class="el-icon-menu"></i>
      <template #title>管理员主页</template>
    </el-menu-item>
    <el-menu-item index="/admin/evaluate">
      <i class="el-icon-menu"></i>
      <template #title>审核酒店</template>
    </el-menu-item>
    <el-menu-item index="/admin/manage">
      <i class="el-icon-menu"></i>
      <template #title>管理酒店</template>
    </el-menu-item>
    <el-menu-item index="/admin/reply">
      <i class="el-icon-menu"></i>
      <template #title>回复用户</template>
    </el-menu-item>
  </el-menu>
</template>


<script>
export default {
  data() {
    return {
      character: 'hotel',
      activeIndex: '',
    }
  },
  created() {
    this.getCharacter()
  },
  methods: {
    getCharacter() {
      let path = this.$route.path
      let len = path.length
      this.character = path.substring(1,6)
      let tail = path.substring(7,len)
      //console.log(character, tail)
      if(tail === 'wait') {
        this.character = 'wait'
      }
    },
  },
}
</script>


<style scoped>

</style>