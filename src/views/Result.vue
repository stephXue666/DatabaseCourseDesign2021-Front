<template>
<div style="
        background-image: url(//s2.hdslb.com/bfs/static/blive/blfe-dynamic-web/static/img/background.bc725153.png);
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size:100% 100%;">
  <top-nav />
  <el-affix>
    <el-card style="border-radius: 0px;  background: rgba(256, 256, 256, 0.85);">
      <el-row>
        <el-col :span="6">
          <div class="topInfo" style="margin-left:10%">
            &nbsp;<i class="el-icon-place"></i><b>&nbsp;目的地</b>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="topInfo">
            &nbsp;<i class="el-icon-time"></i
            ><b>&nbsp;入店时间&nbsp;~&nbsp;退房时间</b>
          </div>
        </el-col>
        <el-col :span="9">
          <el-row>
            <el-col :span="6">
              <div class="topInfo">
                &nbsp;<i class="el-icon-aim"></i><b>&nbsp;关键词</b>
              </div>
            </el-col>
            <el-radio
              v-model="searchRadio"
              @change="searchRadioChanged"
              label="region"
              size="mini"
              style="padding-top: 4px; margin-right: 12px"
              >地点
            </el-radio>
            <el-radio
              v-model="searchRadio"
              @change="searchRadioChanged"
              label="hotel"
              size="mini"
              style="padding-top: 4px"
              >酒店名
            </el-radio>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-cascader
            v-model="searchCity"
            style="width:70%;"
            placeholder="选择城市"
            :options="cityOptions"
            filterable
          >
          </el-cascader>
        </el-col>
        <el-col :span="10">
          <el-date-picker
            v-model="searchHotelDate"
            style="width:80%;"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :disabled-date="getDisabledDate"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="9">
          <el-container>
            <el-autocomplete
              class="inline-input"
              style="width:85%"
              input-style="border-top-right-radius:0px; border-bottom-right-radius:0px;"
              v-model="searchInput"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              :trigger-on-focus="false"
            ></el-autocomplete>
            <el-button
              id="searchInputButton"
              type="primary"
              icon="el-icon-search"
              @click="searchButtonClicked"
              >搜索</el-button
            >
          </el-container>
        </el-col>
      </el-row>
    </el-card>
  </el-affix>

  <el-container style="margin-top: 20px; margin-left: 8%; margin-right: 8%;">
    <el-card style="height: 171px; width: 100%; border: 0px" class="cards">
      <!--筛选条件!-->
      <el-descriptions
        :column="1"
        style="width:100%; height:100% margin:0px; padding:0px"
        border
      >
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-star-off"></i>
            酒店星级
          </template>
          <el-radio
            v-model="hotelStars"
            @change="searchHotel"
            label="-1"
            border
            size="small"
            class="radios"
            style="margin-left: 4%"
            >不限</el-radio
          >
          <el-radio
            v-model="hotelStars"
            @change="searchHotel"
            label="5"
            border
            size="small"
            class="radios"
            >五星级</el-radio
          >
          <el-radio
            v-model="hotelStars"
            @change="searchHotel"
            label="4"
            border
            size="small"
            class="radios"
            >四星级</el-radio
          >
          <el-radio
            v-model="hotelStars"
            @change="searchHotel"
            label="3"
            border
            size="small"
            class="radios"
            >三星级</el-radio
          >
          <el-radio
            v-model="hotelStars"
            @change="searchHotel"
            label="0"
            border
            size="small"
            class="radios"
            >经济型</el-radio
          >
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-coin"></i>
            价格区间
          </template>
          <el-radio
            v-model="hotelPrice"
            @change="searchHotel"
            label="-1"
            border
            size="small"
            class="radios"
            style="margin-left: 4%"
            >不限</el-radio
          >
          <el-radio
            v-model="hotelPrice"
            @change="searchHotel"
            label="0"
            border
            size="small"
            class="radios"
            >200以下</el-radio
          >
          <el-radio
            v-model="hotelPrice"
            @change="searchHotel"
            label="1"
            border
            size="small"
            class="radios"
            >200~400</el-radio
          >
          <el-radio
            v-model="hotelPrice"
            @change="searchHotel"
            label="2"
            border
            size="small"
            class="radios"
            >400~600</el-radio
          >
          <el-radio
            v-model="hotelPrice"
            @change="searchHotel"
            label="3"
            border
            size="small"
            class="radios"
            >600以上</el-radio
          >
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-search"></i>
            排序方式
          </template>
          <el-radio
            style="margin-left: 4%"
            @change="sortBottonClicked"
            v-model="sortOption"
            label="defualt"
            border
            size="small"
            class="radios"
          >
            默认排序
          </el-radio>
          <el-radio
            v-model="sortOption"
            @change="sortBottonClicked"
            label="near"
            border
            size="small"
            class="radios"
          >
            距离优先
            <i class="el-icon-bottom"></i>
          </el-radio>
          <el-radio
            v-model="sortOption"
            @change="sortBottonClicked"
            label="highRate"
            border
            size="small"
            class="radios"
          >
            好评优先
            <i class="el-icon-top"></i>
          </el-radio>
          <el-radio
            v-model="sortOption"
            @change="sortBottonClicked"
            label="cheap"
            border
            size="small"
            class="radios"
          >
            低价优先
            <i class="el-icon-bottom"></i>
          </el-radio>
          <el-radio
            v-model="sortOption"
            @change="sortBottonClicked"
            label="expensive"
            border
            size="small"
            class="radios"
          >
            高价优先
            <i class="el-icon-top"></i>
          </el-radio>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-container>

  <el-container v-loading="loadingHotelData" style="margin-top: 10px; margin-left: 8%; margin-right: 8%">
    <div style="width: 65%">
      <el-card
        v-for="i of hotelIndex"
        :key="i"
        style="margin-top: 10px; width: 100%; height: 170px"
        class="cards"
      >
        <!--酒店列表!-->
        <el-container>
          <!--酒店图片!-->
          <el-image
            style="width: 37%; height: 100%"
            :src="hotelData[i].firsturl"
            class="image"
            :fit="cover"
          ></el-image>
          <el-container style="margin: 10px 16px 10px 15px; width: 50%">
            <el-container
              direction="vertical"
              style="width: 55%; margin-right: 5px"
            >
              <!--酒店名!-->
              <div style="text-align: left; font-weight: 600; font-size: 18px">
                {{ hotelData[i].myname }}
              </div>
              <!--星级!-->
              <el-rate
                v-show="hotelData[i].star_level > 0"
                style="text-align: left; margin-top: 5px"
                disabled-void-color="#ffffff"
                v-model="hotelData[i].star_level"
                disabled
              ></el-rate>
              <!--地区!-->
              <div style="margin-top: 3px" class="detailedInfo">
                {{ hotelData[i].region }}
              </div>
              <!--地址!-->
              <div class="detailedInfo">
                {{ hotelData[i].location }}
              </div> </el-container
            ><!--#DCDFE6#606266!-->

            <div
              style="width=0; heigth:100%; border-left:1px solid #DCDFE6"
            ></div>

            <el-container direction="vertical" style="margin-top: 5px">
              <!--评分!-->
              <span id="score">{{ hotelData[i].score }}</span>
              <!--评论数!-->
              <span id="comments" style="margin-top: 3px"
                >共{{ hotelData[i].esitimationCount }}条评价</span
              >
              <!--价格!-->
              <span id="price" style="padding-top: 24%">
                <b style="font-size: 24px">￥{{ hotelData[i].price }}</b>
                <span id="price" style="margin-left: 3px; font-size: 12"
                  >起</span
                >
              </span>
              <el-button
                size="small"
                @click="turnToDetailedPage(i)"
                type="primary"
                style="
                  border-radius: 2px;
                  text-align: right;
                  margin-left: 42%;
                  margin-top: 2%;
                "
                >查看详情</el-button
              >
            </el-container>
          </el-container>
        </el-container>
      </el-card>
    </div>
    <el-affix
      :offset="135"
      style="margin-top: 10px; margin-left: 3%; width: 32%"
    >
      <el-card id="mapCard" class="cards" style="width: 100%; height: 50vmin" :v-loading="loadingHotelData">
        <!--地图!-->
      </el-card>
    </el-affix>
  </el-container>
  <div style="margin-top: 30px;">
    <el-pagination
      @current-change="currentPageChange"
      @prev-click="currentPageChange"
      @next-click="currentPageChange"
      v-model:currentPage="currentPage"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="hotelNum"
      :hide-on-single-page="true"
    >
    </el-pagination>
    <p style="padding:10px 0px 30px;">
      Copyright ©2021 住哪儿-酒店预定平台
    </p>
  </div>
 </div>
</template>

<script>
import TopNav from "../components/TopNav";
import BMap from "BMap";

export default {
  components: {
    TopNav,
  },
  mounted() {
    this.searchCity = [this.$route.query.province,this.$route.query.city]; // 获取省市
    this.searchRadio = this.$route.query.searchRadio; // 获取关键字类型
    this.searchInput = this.$route.query.searchInput; // 获取用户输入的关键字
    if(this.searchCity[1] == undefined){
      this.searchCity = ['上海市','上海市'];
    }
    this.map = new BMap.Map("mapCard"); // 创建Map实例
    this.map.centerAndZoom(this.searchCity[1], 13); // 初始化地图,设置中心点坐标和地图级别
    this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    this.searchButtonClicked();
  },
  data() {
    return {
      // 设置酒店预定的时间范围
      getDisabledDate(time) {
        const curDate = new Date().getTime();
        // 这里算出一个月的毫秒数,
        // 使用30的平均值,实际中应根据具体的每个月有多少天计算
        const day = 30 * 24 * 3600 * 1000;
        const dateRegion = curDate + day;
        return (
          time.getTime() < Date.now() - 8.64e7 || time.getTime() > dateRegion
        );
      },
      map: null,

      searchCity: [], // 选择城市，（省、市）
      searchHotelDate: "", // 选择入住日期（装饰）
      searchRadio: "region", // 选择搜索方式，默认为地区
      searchInput: "", // 关键字搜索输入内容
      searchPanel: null, //
      searchPoint: {}, // 搜索地点坐标（或城市中心点坐标）
 
      hotelStars: "-1", // 选择星级，默认不限
      hotelPrice: "-1", // 选择价格区间，默认不限
      sortOption: "defualt", // 排序方式，默认全选
      myValue: "",

      hotelIndex: [], // 当前页面应当呈现的酒店的索引（即hotelData的索引）
      currentPage: 1, // 当前页面
      hotelNum: 0, // 酒店总数

      loadingHotelData: false, // 是否正在加载数据
      hotelData: [], // 酒店信息（通过接口获取）

      // 城市选项
      cityOptions: [
        {
          value: "北京市",
          label: "北京市",
          children: [
            {
              value: "北京市",
              label: "北京市",
            },
          ],
        },
        {
          value: "上海市",
          label: "上海市",
          children: [
            {
              value: "上海市",
              label: "上海市",
            },
          ],
        },
        {
          value: "广东省",
          label: "广东省",
          children: [
            {
              value: "广州市",
              label: "广州市",
            },
            {
              value: "深圳市",
              label: "深圳市",
            },
          ],
        },
        {
          value: "江苏省",
          label: "江苏省",
          children: [
            {
              value: "南京市",
              label: "南京市",
            },
          ],
        },
      ],
    };
  },
  methods: {

    // 自动联想
    querySearchAsync(queryString, cb){
      let autoCompleteData = [];
      if(this.searchInput === ""){
        cb(autoCompleteData);
      }
      else if(this.searchRadio === 'hotel'){ // 酒店自动联想
        let url = "/zhunar/api/hotel/get/";
        url += this.searchCity[0] + "?";
        url += "city=" + this.searchCity[1] + "&";
        url += "star=" + this.hotelStars + "&";
        url += "interval=" + this.hotelPrice + "&";
        if(this.searchRadio === "hotel"){
          url += "name=" + queryString + "&";
        }
        url += "lat=" + this.searchPoint.lat + "&";
        url += "lng=" + this.searchPoint.lng;

        // 调用酒店查询接口
        this.axios.get(url).then((response) => {
          let result = response.data;
          for(let i in result){
            autoCompleteData.push({value: result[i].myname});
          }
          cb(autoCompleteData); // 回调函数
        });
      }
      else { // 地点自动联想

        // 调用地点查询接口
        this.axios
          .get(
              "/baidu/place/v2/suggestion?query=" +
                queryString +
                "&region=" +
                this.searchCity[1] +
                "&city_limit=true&output=json&ak=psW2eLUlrAlTegyWFIbAGOZgOP2mTYMW"
            )
            .then((response) => {
              let result = response.data.result;
              for(let i in result){
                autoCompleteData.push({value: result[i].name});
              }
              cb(autoCompleteData); // 回调函数
            });
      }
    },

    // 响应搜索按钮
    searchButtonClicked() {
      window.scrollTo(0,0); // 窗口返回顶部
      this.loadingHotelData = true; // 设置为正在加载
      this.$router.push({ path: '/result', query: { 
        province:this.searchCity[0], city:this.searchCity[1], searchRadio:this.searchRadio, searchInput:this.searchInput }})
      if (this.searchRadio == "region" && !!this.searchInput) { // 如果输入地点，则找到此地点经纬度
        this.axios
        .get( // 调用地点查询接口
            "/baidu/place/v2/suggestion?query=" +
              this.searchInput +
              "&region=" +
              this.searchCity[1] +
              "&city_limit=true&output=json&ak=psW2eLUlrAlTegyWFIbAGOZgOP2mTYMW"
          )
          .then((response) => { // 得到此地点经纬度
            this.searchPoint = response.data.result[0].location;
            this.searchHotel();
          });
      } else { // 如果输入酒店名，则找城市中心点经纬度
        this.axios
          .get( // 调用地点查询接口
            "/baidu/place/v2/suggestion?query=" +
              this.searchCity[1] +
              "&region=" +
              this.searchCity[1] +
              "&city_limit=true&output=json&ak=psW2eLUlrAlTegyWFIbAGOZgOP2mTYMW"
          )
          .then((response) => { // 得到城市中心点经纬度
            this.searchPoint = response.data.result[0].location;
            this.searchHotel();
          });
      }
      // 查找酒店
    },

    // 切换搜索方式时，清空输入内容
    searchRadioChanged() {
      this.searchInput = "";
    },

    // 查询酒店
    searchHotel() {
      this.loadingHotelData = true; // 设置为正在加载
      this.hotelData = []; // 首先清空酒店数据
      this.hotelIndex = [];
      this.hotelNum = 0;

      this.map.clearOverlays(); // 地图清除覆盖物

      // 调用接口搜索酒店
      let url = "/zhunar/api/hotel/get/";
      url += this.searchCity[0] + "?";
      url += "city=" + this.searchCity[1] + "&";
      url += "star=" + this.hotelStars + "&";
      url += "interval=" + this.hotelPrice + "&";
      if(this.searchRadio === "hotel"){
        url += "name=" + this.searchInput + "&";
      }
      url += "lat=" + this.searchPoint.lat + "&";
      url += "lng=" + this.searchPoint.lng;

      this.axios.get(url).then((response) => {
        this.hotelData = response.data;
        this.hotelNum = this.hotelData.length;
        if(this.hotelNum === 0){ // 没有搜索结果
          this.$alert('没有搜索结果', '提示', {
            confirmButtonText: '确定',
          })
        }
        else{
          this.sort();
          this.currentPageChange();
          this.currentPage = 1; // 每次搜索后跳回第一页
        }
        this.loadingHotelData = false;
      });
    },

    // 响应排序按钮
    sortBottonClicked(){
      this.sort();
      this.currentPageChange();
    },

    // 响应页码改变按钮
    currentPageChange() { // 改变页数时
      window.scrollTo(0,0); // 窗口返回顶部
      let lowBound = (this.currentPage - 1) * 10;
      let upBound =
        this.currentPage * 10 < this.hotelNum
          ? this.currentPage * 10
          : this.hotelNum;
      this.hotelIndex = [];

      this.map.clearOverlays(); // 地图清除覆盖物

      // 设置地图标签样式
      let labelStyle = {
        position: "absolute",
        transform: "translateX(-50%)",
        backgroundColor: "#287dfa",
        borderRadius: "4px",
        padding: "4px 8px",
        fontSize: "10px",
        fontWeight: "700",
        boxSizing: "border-box",
        display: "inline-block",
        border: "1px solid transparent",
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,.2))",
        color: "#fff",
        whiteSpace: "nowrap",
      };

      for (let i = lowBound; i < upBound; i++) {
        this.hotelIndex.push(i); //找到当前页面应呈现的酒店index

        //添加每个酒店的label
        let label = new BMap.Label(this.hotelData[i].myname, {
          position: new BMap.Point( // 指定文本标注所在的地理位置
            this.hotelData[i].lng,
            this.hotelData[i].lat
          ), 
          offset: new BMap.Size(0, -10),
        });
        label.setStyle(labelStyle);
        this.map.addOverlay(label); // 地图添加label
      }

      // 画出当前位置的红点
      let point = new BMap.Point(this.searchPoint.lng, this.searchPoint.lat);
      this.map.addOverlay(new BMap.Marker(point));
      this.map.centerAndZoom(point, 13); // 设置中心点坐标和地图级别
    },
    sort() {
      //排序
      if (this.sortOption === "near") {
        this.hotelData.sort(this.compareUP("distance"));
      } else if (this.sortOption === "cheap") {
        this.hotelData.sort(this.compareUP("price"));
      } else if (this.sortOption === "expensive") {
        this.hotelData.sort(this.compareDOWN("price"));
      } else if (this.sortOption === "highRate") {
        this.hotelData.sort(this.compareDOWN("score"));
      } else {
        this.hotelData.sort(this.compareUP("hotel_id"));
      }
    },

    // 从小向大排序
    compareUP(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },

    //从大向小排序
    compareDOWN(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
      };
    },

    // 跳转至酒店详情页面
    turnToDetailedPage(i) {
      let hotelID = this.hotelData[i].hotel_id; // 得到酒店ID跳转页面
      this.$router.push({ path: '/details', query: { id: hotelID }});
    },
  },
};
</script>

<style scoped>
#searchInputButton {
  border-collapse: collapse;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
.topInfo {
  text-align: left;
  padding-bottom: 8px;
}
.cards {
  border-radius: 0px;
}
.cards :deep(.el-card__body) {
  padding: 0px;
}
.hotelCards {
  border-radius: 0px;
}
.hotelCards :deep(.el-card__body) {
  padding: 10px;
}
.detailedInfo {
  margin-top: 2px;
  color: #455873;
  text-align: left;
  font-size: 13px;
  line-height: 18px;
}
#score {
  text-align: right;
  color: #fff;
  background-color: #4978ce;
  border-radius: 2px;
  padding: 4px 8px 4px 8px;
  margin-left: 72%;
}
#price {
  color: #287dfa;
  text-align: right;
}
#comments {
  text-align: right;
  font-size: 7px;
  color: #8592a6;
}
</style>