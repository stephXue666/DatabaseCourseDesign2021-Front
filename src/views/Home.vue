<template>
<div style="
        background-image: url(//s2.hdslb.com/bfs/static/blive/blfe-dynamic-web/static/img/background.bc725153.png);
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size:100% 100%;">
  <el-container>
    <el-header style="padding: 0">
      <top-nav />
    </el-header>
    <el-main>
      <el-container style="height: 312px; margin-left: 9%; margin-top:30px">
        <el-card class="box-card" style="borfed-radius:10px; width: 33%; height: 97%; background: rgba(256, 256, 256, 0.85);">
          <el-form ref="form" :model="form" :rules="rules">
            <h2 style="margin: 0px">酒店搜索</h2>
            <div style="text-align: left; margin:23px 5px 20px;">
              <el-radio v-model="form.keyWord" label="目的地">目的地</el-radio>
              <el-radio v-model="form.keyWord" label="酒店名">酒店名</el-radio>
            </div>
            <el-form-item prop="search">
              <el-cascader
                v-model="place"
                placeholder="城市"
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
            <el-button
              type="primary"
              @click="onSubmit"
              style="width: 100%"
              round
              >搜索</el-button
            >
          </el-form>
        </el-card>
        <el-carousel style="height: 100%; width: 53.5%; margin-left: 3%;">
          <el-carousel-item v-for="item in imagelist.length" :key="item">
            <el-image
              style="height: 100%; width: 100%; border-radius: 5px"
              :src="imagelist[item - 1]"
            ></el-image>
          </el-carousel-item>
        </el-carousel>
      </el-container>
      <h2 style="text-align: left; font-size: 30px; margin-left: 9%">
        酒店推荐
      </h2>
      <el-container
        direction="vertical"
        style="margin-left: 9%; margin-right: 9%"
      >
        <el-container style="height: 350px">
          <div
            @click="onSubmitImage('重庆市','重庆市')"
            class="container"
            style="
              width: 50%;
              border-radius: 10px;
              background-image: url('http://121.196.223.20/首页城市/重庆.jpg');
              background-size: 100% 100%;
            "
          >
          <div>
            <p class="cityword" style="margin-top: 20%">重庆</p>
            <span class="citywords">—— ChongQing ——</span>
            </div>
            <div class="layer">
              <p class="cityword" style="margin-top: 20%">重庆</p>
              <span class="citywords">—— ChongQing ——</span>
              <br />
              <br />
              <span class="elbutton">查看详情</span>
            </div>
          </div>

          <div
            @click="onSubmitImage('广东省','广州市')"
            class="container"
            style="
              margin-left: 2px;
              width: 50%;
              border-radius: 10px;
              background-image: url('http://121.196.223.20/首页城市/广州.jpg');
              background-size: 100% 100%;
            "
          >
          <div>
            <p class="cityword" style="margin-top: 20%">广州</p>
            <span class="citywords">—— GuangZhou ——</span>
            </div>
            <div class="layer">
            <p class="cityword" style="margin-top: 20%">广州</p>
            <span class="citywords">—— GuangZhou ——</span>
            <br />
              <br />
              <span class="elbutton">查看详情</span>
            </div>
          </div>
        </el-container>

        <el-container style="height: 400px; margin-top: 2px">
          <el-container direction="vertical" style="width: 36%">
            <div
              @click="onSubmitImage('江苏省','南京市')"
              class="container"
              style="
                width: 100%;
                height: 50%;
                border-radius: 10px;
                background-image: url('http://121.196.223.20/首页城市/南京.jpg');
                background-size: 100% 100%;
              "
            >
            <div>
              <p class="cityword" style="font-size: 29px; margin-top: 11%">
                南京
              </p>
              <span class="citywords" style="font-size: 15px"
                >—— NanJing ——</span
              >
              </div>
              <div class="layer">
                  <p class="cityword" style="font-size: 29px; margin-top: 11%">
                南京
              </p>
              <span class="citywords" style="font-size: 15px"
                >—— NanJing ——</span
              >
              <br />
              <br />
              <span class="elbutton">查看详情</span>
              </div>
            </div>
            <div
              @click="onSubmitImage('广东省','深圳市')"
              class="container"
              style="
                margin-top: 2px
                width: 100%;
                height: 50%;
                border-radius: 10px;
                background-image: url('http://121.196.223.20/首页城市/深圳.jpg');
                background-size: 100% 100%;
              "
            >
              <div>
                <div>
                  <p class="cityword" style="font-size: 29px; margin-top: 11%">
                    深圳
                  </p>
                  <span class="citywords" style="font-size: 15px"
                    >—— ShenZhen ——</span
                  >
                </div>
                <div class="layer">
                  <p class="cityword" style="font-size: 29px; margin-top: 11%">
                    深圳
                  </p>
                  <span class="citywords" style="font-size: 15px"
                    >—— ShenZhen ——</span
                  >
                  <br />
                  <br />
                  <span class="elbutton">查看详情</span>
                </div>
              </div>
            </div>
          </el-container>

          <div
            @click="onSubmitImage('上海市','上海市')"
            class="container"
            style="
              margin-left: 3px;
              width: 64%;
              height: 99.8%;
              border-radius: 10px;
              background-image: url('http://121.196.223.20/首页城市/上海.jpg');
              background-size: 100% 100%;
            "
          >
            <div>
              <div>
                <p class="cityword" style="margin-top: 20%">上海</p>
                <span class="citywords">—— ShangHai ——</span>
              </div>
              <div class="layer">
                <p class="cityword" style="margin-top: 20%">上海</p>
                <span class="citywords">—— ShangHai ——</span>
                <br />
                <br />
                <span class="elbutton">查看详情</span>
              </div>
            </div>
          </div>
        </el-container>

        <el-container style="height: 360px; margin-top: 2px">
          <div
            @click="onSubmitImage('海南省','三亚市')"
            class="container"
            style="
              width: 75%;
              height: 100%;
              border-radius: 10px;
              background-image: url('http://121.196.223.20/首页城市/三亚.jpg');
              background-size: 100% 100%;
            "
          >
          <div>
            <p class="cityword" style="margin-top: 14%">三亚</p>
            <span class="citywords">—— SanYa ——</span>
            </div>
            <div class="layer">
            <p class="cityword" style="margin-top: 14%">三亚</p>
            <span class="citywords">—— SanYa ——</span>
            <br />
              <br />
              <span class="elbutton">查看详情</span>
            </div>
          </div>

          <div
          @click="onSubmitImage('北京市','北京市')"
            class="container"
            style="
              margin-left: 2px;
              width: 25%;
              height: 100%;
              border-radius: 10px;
              background-image: url('http://121.196.223.20/首页城市/北京.jpg');
              background-size: 100% 100%;
            "
          >
          <div >
            <p class="cityword" style="margin-top: 46%">北京</p>
            <span class="citywords">—— BeiJing ——</span>
            </div>
            <div class="layer" >
              <p class="cityword" style="margin-top: 46%">北京</p>
            <span class="citywords">—— BeiJing ——</span>
              <br />
              <br />
              <span class="elbutton">查看详情</span>
            </div>
          </div>
        </el-container>
      </el-container>
    </el-main>
    <el-footer style="background-color: #f6f9fa; height:100%">
    <p style="margin:0px; padding:30px 0px 40px 0px">
      Copyright ©2021 住哪儿-酒店预定平台
    </p>
  </el-footer>
  </el-container>
</div>
</template>

<script>
import TopNav from "../components/TopNav";
import { ElMessage } from "element-plus";
export default {
  components: {
    TopNav,
  },
  data() {
    return {
      activeName: "",
      place: "", //目的地
      KeyWordValue: "",
      imagelist: [
        "http://121.196.223.20/首页滚动图片/登高.jpg",
        "http://121.196.223.20/首页滚动图片/广告.jpg",
        "http://121.196.223.20/首页滚动图片/红色.jpg",
        "http://121.196.223.20/首页滚动图片/齐鲁.jpg",
      ],
      form: {
        search: "",
        keyWord: "目的地",
      },
      rules: {
        search: [
          { required: true, message: "请输入目的地名称", trigger: "blur" },
        ],
      },
      options: [
        {
          value: "北京市",
          label: "北京",
          children: [{ value: "北京市", label: "北京" }],
        },
        {
          value: "上海市",
          label: "上海",
          children: [{ value: "上海市", label: "上海" }],
        },
        {
          value: "广东省",
          label: "广东",
          children: [
            { value: "广州市", label: "广州" },
            { value: "深圳市", label: "深圳" },
          ],
        },
        {
          value: "江苏省",
          label: "江苏",
          children: [{ value: "南京市", label: "南京" }],
        },
      ],
    };
  },
  methods: {
    onSubmit() {
      console.log(this.place[0],this.place[1]);
      if (this.place.length == 0) {
        ElMessage.error("亲,请输入目的地哦");
      } else {
        this.$router.push({
          path: "./result",
          query: {
            province: this.place[0],
            city: this.place[1],
            searchRadio: this.form.keyWord == "目的地" ? "region" : "hotel",
            searchInput: this.KeyWordValue,
          },
        });
      }
    },
    onSubmitImage(Province,City)
    {
      console.log(Province,City)
      this.$router.push({
          path: "./result",
          query: {
            province: Province,
            city:City,
            searchRadio: this.form.keyWord == "目的地" ? "region" : "hotel",
            searchInput: "",
          },
        });
    },
  },
};
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
.cityword {
  margin-bottom: 5px;
  font-size: 35px;
  color: white;
}
.citywords {
  font-size: 15px;
  color: white;
  margin-top: 5%;
}
.container {
  position: relative;
  border-radius: 10px;
  display: inline;
}
.layer {
  position: absolute;
  border-radius: 10px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(8, 8, 8, 0.6);
  display: none;
}
.container:hover .layer {
  display: block;
  cursor: pointer;
}
.elbutton{
  text-align: center;
  width: 100px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid white;
  background-color: transparent;
  color:white;
}
</style>

