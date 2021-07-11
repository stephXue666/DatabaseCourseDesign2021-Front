<template>
  <el-container>
    <el-header style="padding: 0">
      <TopNav/>
    </el-header>
    <el-main>
      <!--这里写代码-->
    <i 
    style="font-size: 25px;margin-bottom: 10px;margin-top: 10px;font-weight: bold"
    class='el-icon-time'>
    浏览记录
    </i>
    <div style="margin-bottom: 10px;"></div>
    <el-row>
    <el-col :span="4"></el-col>
    <el-col :span="16"><div v-for="(item) in tableData" :key="item.hotelID">
    <div class="timeLabel"><el-tag type="info" size="mini">{{item.time}}</el-tag></div>
    <el-card shadow="hover" :body-style="{ padding: '0px' }" style="margin-bottom: 5px;">
      <el-row>
      <el-col :span="5">
      <template v-slot>
      <el-image
      class="img"
      :src="item.url"
      :fit="contain"
      @click="handleJumpToHotelPage(item.hotelID)"></el-image>
      </template>
      </el-col>
      <el-col :span="10">
      <el-form label-position="left" label-width="60px" style="margin-left:6px;">
        <el-form-item label="名称" style="margin-bottom:1px"> <span class="hotelDescription">{{item.hotelName}}</span></el-form-item>
        <el-form-item label="地址" style="margin-bottom:1px"> <span class="hotelDescription">{{item.address}}</span></el-form-item>
        <el-form-item label="最低价" style="margin-bottom:1px"> <span class="lowestPriceStyle">￥{{item.lowestPrice}}</span></el-form-item>
      </el-form>
      </el-col>
      <el-col :span="5">
      <el-form label-position="left" label-width="50px" style="margin-left:6px;">
        <el-form-item label="评分" style="margin-bottom:1px"> <span class="hotelScoreStyle">&nbsp;&nbsp;{{item.score}} 分</span></el-form-item>
        <el-form-item label="星级" style="margin-bottom:1px"> 
         <el-rate v-model="item.star" style="font-size: 35px;" disabled="true" show-score text-color="#ff9900" score-template="{value}"></el-rate>
        </el-form-item>
      </el-form>
      </el-col>
      <el-col :span="4">
        <template v-slot>
         <el-button icon="el-icon-delete" size="medium" type="info" @click="handleDeleteHistory(item.hotelID)" style="margin-top: 45px;margin-left: 20px;">删除</el-button>
        </template>
      </el-col>
      </el-row>
    </el-card>
  </div>
    </el-col>
    <el-col :span="4"> </el-col>
    </el-row>
    </el-main>
    <el-footer>Copyright ©2021 住哪儿-酒店预定平台</el-footer>
  </el-container>
</template>

<script>
import TopNav from "../../components/TopNav";

let historyList=[{
          hotelID:'h1',
          time: '2016-05-03 15:20:19',
          url:'http://121.196.223.20/106/酒店/0.jpg',
          hotelName: '同济招待中心',
          star: '4',
          address: '上海市普陀区金沙江路 1512 弄',
          score: 4.1,
          lowestPrice:400
        },
        {
          hotelID:'h2',
          time: '2016-05-03 15:20:20',
          url:'http://121.196.223.20/106/酒店/0.jpg',
          hotelName: '同济招待中心',
          star: '3',
          address: '上海市普陀区金沙江路 1513 弄',
          score: 4.2,
          lowestPrice:100
        },
        {
          hotelID:'h3',
          time: '2016-05-03 15:20:21',
          url:'http://121.196.223.20/106/酒店/0.jpg',
          hotelName: '同济招待中心',
          star: '2',
          address: '上海市普陀区金沙江路 1514 弄',
          score: 4.3,
          lowestPrice:500
        },
        {
          hotelID:'h4',
          time: '2016-05-03 15:20:22',
          url:'http://121.196.223.20/106/酒店/0.jpg',
          hotelName: '同济招待中心',
          star: '4',
          address: '上海市普陀区金沙江路 1516 弄',
          score: 4.4,
          lowestPrice:590
        },
        {
          hotelID:'h5',
          time: '2016-05-03 15:20:23',
          url:'http://121.196.223.20/106/酒店/0.jpg',
          hotelName: '同济招待中心',
          star: '5',
          address: '上海市普陀区金沙江路 1517 弄',
          score: 4.5,
          lowestPrice:510
        },
        {
          hotelID:'h6',
          time: '2016-05-03 15:20:29',
          url:'http://121.196.223.20/106/酒店/0.jpg',
          hotelName: '同济招待中心',
          star: '1',
          address: '上海市普陀区金沙江路 1517 弄',
          score: 4.9,
          lowestPrice:324
        },
        {
          hotelID:'h7',
          time: '2016-05-03 15:29:23',
          url:'http://121.196.223.20/106/酒店/0.jpg',
          hotelName: '同济招待中心',
          star: '5',
          address: '上海市普陀区金沙江路 1517 弄',
          score: 3.1,
          lowestPrice:498
        },
        {
          hotelID:'h8',
          time: '2016-05-03 15:30:23',
          url:'http://121.196.223.20/106/酒店/0.jpg',
          hotelName: '同济招待中心',
          star: '5',
          address: '上海市普陀区金沙江路 1517 弄',
          score: 4.5,
          lowestPrice:465
        },
        {
          hotelID:'h9',
          time: '2016-05-03 15:40:23',
          url:'http://121.196.223.20/106/酒店/0.jpg',
          hotelName: '同济招待中心',
          star: '5',
          address: '上海市普陀区金沙江路 1517 弄',
          score: 3.5,
          lowestPrice:455}]

export default {
	components: {
    TopNav,
	},
   methods: {
     //"删除"操作
      handleDeleteHistory(hotel_id){
        this.$confirm('是否删除该条记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //调用接口-删除历史足迹：传入（用户ID、酒店ID、时间）返回（null）
          console.log(hotel_id);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {});
      },

      //单击酒店图片，"跳转"到对应"酒店详情"页面
      handleJumpToHotelPage(hotel_id){
        //"跳转"，用"酒店1"的详情页面测试
        this.$router.push({
        path: '/details',
        query: { id: 1 }
        })
        console.log(hotel_id);
      },
   },

    data() {
      return {
        tableData: []
      }
    },

    created(){
      //调用接口-列表显示酒店历史足迹：传入（用户ID）返回（酒店简要信息+时间）
      //将变量historyList赋值给tableData
      for(let item of historyList){
        this.tableData.push(item);
    }
    },
 }
</script>

<style scoped>
 .img{
   cursor: pointer;
 }

 .timeLabel{
   padding: 10px 0px 5px 0px;
 }
 .hotelDescription{
   font-size: 16px;
   float:left;
 }
 .lowestPriceStyle{
   float:left;
   color: #ff7400;
   font-weight: bold;
   font-size: 18px;
 }
 .hotelScoreStyle{
   float:left;
   font-weight: 600 ;
   font-size: 18px; 
   color: #67C23A; 
 }
</style>