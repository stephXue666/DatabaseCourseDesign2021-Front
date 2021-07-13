<template>
  <el-container>
    <div style="
        background-image: url(//s2.hdslb.com/bfs/static/blive/blfe-dynamic-web/static/img/background.bc725153.png);
        background-repeat: no-repeat;
        height: 100%;
        background-attachment: fixed;
        background-size:100% 100%;">
    <el-header style="padding: 0">
      <top-nav/>
    </el-header>
    <el-main>
      <!--这里写代码-->
      <i 
    style="font-size: 25px;margin-bottom: 10px;margin-top: 10px;font-weight: bold;color: Orange;"
    class='el-icon-star-on'>
    </i>
    <h
    style="font-size: 25px;font-weight: bold;">
    酒店收藏夹</h>
    <div style="margin-bottom: 10px;"></div>
    <el-row>
    <el-col :span="4"></el-col>
    <el-col :span="16"><div>
    <el-card v-for="(item) in tableData" :key="item.hotelID" shadow="hover" :body-style="{ padding: '0px' }" style="margin-bottom: 5px;">
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
      <el-col :span="11">
      <el-form label-position="left" label-width="60px" style="margin-left:6px;">
        <el-form-item label="名称" style="margin-bottom:1px;text-align:left;"> <span class="hotelDescription">{{item.hotelName}}</span></el-form-item>
        <el-form-item label="地址" style="margin-bottom:1px;text-align:left;"> <span class="hotelDescription">{{item.address}}</span></el-form-item>
        <el-form-item label="最低价" style="margin-bottom:1px;text-align:left;"> <span class="lowestPriceStyle">￥{{item.lowestPrice}}</span></el-form-item>
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
      <el-col :span="3">
        <template v-slot>
         <el-button icon="el-icon-star-off" size="small" type="primary" @click="handleDeleteCollection(item.hotelID)" style="margin-top: 45px;margin-left: 20px;margin-right: 10px;">取消收藏</el-button>
        </template>
      </el-col>
      </el-row>
    </el-card>
  </div>
    </el-col>
    <el-col :span="4"> </el-col>
    </el-row>
    </el-main>
    </div>
    <el-footer style="background-color: #f6f9fa; height:100%">
    <p style="margin:0px; padding:30px 0px 40px 0px">
      Copyright ©2021 住哪儿-酒店预定平台
    </p>
  </el-footer>
  </el-container>
</template>

<script>
import TopNav from "../../components/TopNav";

export default {
	components: {
    TopNav,
	},

  methods:{
    getFavoriteTable(){
      //调用接口-列表显示收藏的酒店：传入（用户ID）返回（酒店简要信息）  
      //改
      this.axios.get('/zhunar/api/favorite/cid/'+this.c_id).then((favoriteResponse)=>{
      console.log(favoriteResponse);
      for(let item of favoriteResponse.data){
        this.tableData.push({
          hotelID: item.hotel_id,
          time: item.day_time,
          hotelName: item.myname,
          star: item.star_level,
          address: ((item.province === item.city)?item.province:(item.province+item.city)) + item.region + item.location,
          url:'http://121.196.223.20/'+item.hotel_id+'/酒店/0.jpg',
          score: item.score,
          lowestPrice: item.lowestPrice,
        });
        }
      })
    },

    //"取消收藏"操作
    handleDeleteCollection(hotel_id){
      console.log(hotel_id);
      this.$confirm('是否取消收藏？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //调用接口-取消收藏：传入（用户ID、酒店ID）返回（null）
        //改
        this.axios.delete('/zhunar'+'/api/favorite/delete/'+this.c_id+'/'+hotel_id).then(response =>{
          console.log(response)
          }).finally(() => {
          this.tableData=[],
          this.getFavoriteTable();//清空tableData，然后再次调用接口获取最新的收藏夹
          });
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          console.log(hotel_id);
      }).catch(() => {});
    },

    //单击酒店图片，"跳转"到对应"酒店详情"页面
    handleJumpToHotelPage(hotel_id){
      //"跳转"，用"酒店1"的详情页面测试
      //改
      console.log(hotel_id);
      this.$router.push({
        path: '/details',
        query: { id: hotel_id },
      });
    },
  },

  data() {
      return {
        tableData: [],
        c_id:window.sessionStorage.getItem('uid'),
      }
    },
  
  created(){  
    this.getFavoriteTable();
  },
}
</script>

<style scoped>
 .img{
   cursor: pointer;
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