<template>
  <el-container style="height: 700px">
    <el-header style="background-color: #2c3e50; color: white">
      <back-nav/>
    </el-header>
    <el-container style="height: 100%" >
      <el-aside width="200px" style="background-color: #545c64">
        <side-nav/>
      </el-aside>
      <el-main :style="bg">
        <el-row :gutter="60" class="el-row" type="flex" style="width: 1200px;margin-left: 40px;margin-top: 40px;">
          <el-col :span="30">
            <!--第一张卡片，显示“今日所有房型剩余量”-->
            <el-card class="box-card" style="width: 520px;height: 400px;" shadow="hover">
              <h1 style="text-align:left">现在是 {{showTime}}，房源剩余：</h1>
              <!--"房型剩余量"表格，"point"用来实现光标在此悬浮时显示为"小手"-->
              <el-table  class="point" 
              :data="tableData" style="width = 100%;" max-height="300" 
              stripe 
              highlight-current-row
              @row-click="handleJumpToInfo"
              @current-change="handleCurrentChange"
              >
              <el-table-column prop="roomType" label="房间类型" width="225"></el-table-column>
              <el-table-column prop="totalSpareRoomNum" label="剩余/总数" width="225"></el-table-column>
              </el-table>
            <!--第二张卡片，显示“昨日流水、昨日入住率”-->
            </el-card>
          </el-col>
          <el-col :span="30"> 
        <el-card class="box-card" style="width: 520px;height: 400px;" shadow="hover">
          <div id="d1" style="margin-top: 25px ;">
            <i 
            style="icon-align:left;font-size: 30px;margin-bottom: 10px;margin-top: 10px;color: #1E90FF;" 
            class='el-icon-coin'></i>
            <h style="font-size: 25px;font-weight: bold"> 昨日流水：</h><br>
            <el-button @click="handleJumpToReport" style="font-size: 25px;" type="text">{{ yesterdayEarning }} (CNY)</el-button>
          </div>
          <div id="d2" style="margin-top: 25px ;">
            <i 
            style="icon-align:left;font-size: 30px;margin-bottom: 20px;margin-top: 10px;color: #1E90FF;" 
            class='el-icon-s-marketing'></i>
            <h style="font-size: 25px;font-weight: bold"> 昨日入住率：</h><br>
            <el-progress class="point" type="circle" :percentage="yesterdayOccupancyRate" @click="handleJumpToReport"></el-progress>
          </div>  
        </el-card>
        </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideNav from "../../components/SideNav"
import BackNav from "../../components/BackNav"

//变量roomTypeList用来接收后端发来的数据，在created()中将数据赋值给tableData
let roomTypeList=[{
        roomType:'豪华双人房',
        totalSpareRoomNum:'15/50',
      },{
        roomType:'舒适单人房',
        totalSpareRoomNum:'11/30',
      },{
        roomType:'钟点双人房',
        totalSpareRoomNum:'22/40',
      },{
        roomType:'钟点单人房',
        totalSpareRoomNum:'5/25',
      },{
        roomType:'总统套房',
        totalSpareRoomNum:'10/10',
      },{
        roomType:'经济钟点房',
        totalSpareRoomNum:'3/25',
      },{
        roomType:'常驻单人房',
        totalSpareRoomNum:'2/10',
      },{
        roomType:'_总统套房',
        totalSpareRoomNum:'10/10',
      },{
        roomType:'_经济钟点房',
        totalSpareRoomNum:'3/25',
      },{
        roomType:'_常驻单人房',
        totalSpareRoomNum:'2/10',
      },{
        roomType:'_总统套房',
        totalSpareRoomNum:'10/10',
      },{
        roomType:'_经济钟点房',
        totalSpareRoomNum:'3/25',
      },{
        roomType:'_常驻单人房',
        totalSpareRoomNum:'2/10',
      }]

export default {
	components: {
    BackNav,
    SideNav
	},
  data() {
    return {
      bg: {   //背景样式
        backgroundImage: "url(" + require("../../assets/loginBackground.jpg") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      },
      timer:'',
      showTime:'',
      yesterdayDate:'',
      yesterdayEarning:'',
      yesterdayOccupancyRate:'',
      tableData:[],
    }
  },
  created(){
    //调用接口-显示昨日流水和入住率：传入（酒店编号）返回（昨日总体流水，整体入住率）
    this.yesterdayOccupancyRate='70';
    this.yesterdayEarning='200000';
    this.timer = setInterval(this.showTimes, 1000);
    //调用接口-显示今日所有房型剩余数量：传入（酒店编号）返回（房间类型数，房间类型：数量	/总数）
    //将变量roomTypeList赋值给tableData
    for(let item of roomTypeList){
      this.tableData.push(item);
    }
  },
  beforeRouteLeave() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    //单击选中时，"点亮"当前行
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    
    //单击表格，"跳转"到"信息管理"页面
    handleJumpToInfo(row, event, column){
      this.$router.push('/hotel/info');
      console.log(row, event, column);
    },

    handleJumpToReport(){
      this.$router.push('/hotel/report');
    },
    
    // 显示当前时间
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? "0" + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds();
      let week = new Date(timeStamp).getDay();
      let weeks = ["日", "一", "二", "三", "四", "五", "六"];
      let getWeek = " (星期" + weeks[week] + ")";
      this.showTime=
        year +
        "年" +
        month +
        "月" +
        date +
        "日" +
        " " +
        hh +
        ":" +
        mm +
        ":" +
        ss +
        getWeek;
    },
    showTimes() {
      console.log(1);
      this.timeFormate(new Date());
    },
  },
}
</script>
<style scoped>
         .point{cursor: pointer;}
</style>