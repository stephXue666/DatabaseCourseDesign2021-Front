<template>
  <el-container>
    <el-header style="padding: 0">
      <top-nav/>
    </el-header>
    <el-main>
      <!--这里写代码-->

      <el-row>
    <el-col :span="7" :offset="3">
      <el-card class="box-card">
        <el-form ref="form" :model="form" :rules="rules">
          <br />
          <el-divider><h2>酒店搜索</h2></el-divider>
          <el-form-item style="text-align: left">
            <el-radio v-model="form.keyWord" label="酒店名">酒店名</el-radio>
            <el-radio v-model="form.keyWord" label="关键词">关键词</el-radio>
          </el-form-item>
          <el-form-item prop="search">
            <el-cascader
           v-model="place"
              placeholder="目的地"
              :options="options"
              style="width: 100%"
              filterable
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-input
              :placeholder="form.keyWord"
              v-model="KeyWordValue"
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="onSubmit" style="width: 100%" round
            >搜索</el-button
          >
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="9" :offset="1">
      <el-carousel height="335px" width="590px">
        <el-carousel-item v-for="item in 4" :key="item">
          <el-image
            src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
          ></el-image>
        </el-carousel-item>
      </el-carousel>
    </el-col>
    <el-col :span="4"></el-col>
  </el-row>
  <el-row>
    <el-col :offset="3" :span="2">
      <p style="text-align: left; font-size: 25px">酒店推荐</p></el-col
    >
  </el-row>
  <el-row>
    <el-col :span="7" :offset="3"
      ><el-tabs v-model="activeName" @tab-click="changeCity">
        <el-tab-pane label="北京" name="first"></el-tab-pane>
        <el-tab-pane label="上海" name="second"></el-tab-pane>
        <el-tab-pane label="广州" name="third"></el-tab-pane>
        <el-tab-pane label="深圳" name="fourth"></el-tab-pane>
        <el-tab-pane label="南京" name="fifth"></el-tab-pane> </el-tabs
    ></el-col>
  </el-row>
  <el-space wrap :size="12" v-for="i in 4" :key="i">
    <el-card
      shadow="hover"
      class="hotelCardItem"
      :body-style="{ padding: '0px' }"
    >
      <el-image
        src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
        style="padding: 0px; border-radius: 10px"
      ></el-image>
      <p style="text-align: left; margin: 5px">{{ hotel[0].hotelName }}</p>
      <p style="text-align: left; margin: 5px" class="score">
        {{ hotel[0].hotelScore }}分
        <span class="pinglun">{{ hotel[0].hotelCommentsSum }}条评论</span>
      </p>
      <p style="text-align: right; margin: 6px" class="price">
        ￥{{ hotel[0].hotelPrice }}
        <span class="qi">起</span>
      </p>
    </el-card>
  </el-space>
  <br />
  <el-space wrap :size="12" v-for="i in 4" :key="i">
    <el-card
      shadow="hover"
      class="hotelCardItem"
      :body-style="{ padding: '0px' }"
    >
      <el-image
        src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
        style="padding: 0px; border-radius: 10px"
      ></el-image>
      <p style="text-align: left; margin: 5px">{{ hotel[0].hotelName }}</p>
      <p style="text-align: left; margin: 5px" class="score">
        {{ hotel[0].hotelScore }}分
        <span class="pinglun">{{ hotel[0].hotelCommentsSum }}条评论</span>
      </p>
      <p style="text-align: right; margin: 6px" class="price">
        ￥{{ hotel[0].hotelPrice }}
        <span class="qi">起</span>
      </p>
    </el-card>
  </el-space>
      <!--测试暂时用代码代替，后续用表格存放酒店列表-->
      <!-- <el-button @click="toDetails(1)">酒店1</el-button> -->
    </el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script>
import TopNav from "../components/TopNav";
import { ElMessage } from 'element-plus'
export default {
	components: {
    TopNav
	},
	data() {
    return {
      activeName: "",
      place:"",//目的地
      KeyWordValue: "",
      form: {
        search: "",
        keyWord: "酒店名",
      },
      rules: {
        search: [
          { required: true, message: "请输入目的地名称", trigger: "blur" },
        ],
      },
      hotel: [
        {
          hotelName: "上海田园酒店",
          hotelAddress: "",
          hotelScore: 5,
          hotelCommentsSum: 233,
          hotelPrice: 500,
        },
      ],
      options: [
        {
          value: "beijing",
          label: "北京",
          children: [{ value: "beijing", label: "北京" }],
        },
        {
          value: "shanghai",
          label: "上海",
          children: [{ value: "shanghai", label: "上海" }],
        },
        {
          value: "guangdong",
          label: "广东",
          children: [
            { value: "guangzhou", label: "广州" },
            { value: "shenzhen", label: "深圳" },
          ],
        },
        {
          value: "jiangsu",
          label: "江苏",
          children: [{ value: "nanjing", label: "南京" }],
        },
      ],
    };
  },
  methods: {
   onSubmit()
   {
     console.log(this.place)
     if(this.place.length==0)
     {
       ElMessage.error('亲,请输入目的地哦');
     }
   },
    changeCity() {

    },
    toDetails(hid) {
      this.$router.push({
        path: '/details',
        query: { id: hid }
      })
    }
  },
}
</script>

<style scoped>
.price {
  font-size: 22px;
  color: #ff714a;
}
.qi {
  font-size: 12px;
}
.score {
  color: #00afc7;
  font-size: 18px;
}
.pinglun {
  font-size: 14px;
  color: gray;
}
.hotelCardItem {
  border-radius: 6px;
  width: 260px;
  margin-bottom: 10px;
}
</style>

