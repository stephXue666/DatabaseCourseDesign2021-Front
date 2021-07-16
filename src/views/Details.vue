<template>
  <el-scrollbar>
    <el-container>
      <el-header style="padding: 0">
        <top-nav/>
      </el-header>
      <el-row><el-col :span="20" :offset="2">
        <el-main>
          <!--上方显示省市区的面包屑-->
          <el-divider content-position="left">
            <el-breadcrumb separator="/" style="margin-top: 10px; margin-bottom: 10px">
              <el-breadcrumb-item :to="{ path: '/home' }">酒店首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ hotelInfo.province }}</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/result', query: { province:hotelInfo.province, city: hotelInfo.city }}">
                {{ hotelInfo.city }}
              </el-breadcrumb-item>
              <el-breadcrumb-item>{{ hotelInfo.region }}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-divider>
          <!--标题、星级、地址、收藏按钮-->
          <el-row>
            <el-col :span="20" style="text-align: left">
              <el-space>
                <div style="font-size: 24px; font-weight: 900; text-align: left;">
                  {{ hotelInfo.name }}
                </div>
                <div style="text-align: left">
                  <el-rate v-model="hotelInfo.star" disabled-void-color="#ffffff"
                           disabled text-color="#ff9900" style="margin-top: 10px"/>
                </div>
              </el-space>
            </el-col>
            <el-col :span="4">
              <el-button v-if="isFav" type="info" @click="changeFavorite" icon="el-icon-star-on" round size="small">取消收藏</el-button>
              <el-button v-else type="warning" @click="changeFavorite" icon="el-icon-star-on" round size="small">收藏</el-button>
            </el-col>
          </el-row>
          <!--酒店图片、简要介绍-->
          <el-row  style="margin-top:15px">
            <el-col :span="12">
              <!-- 图片走马灯 -->
              <el-card v-loading="imgLoading" body-style="padding:0px" shadow="hover">
              <el-carousel trigger="click" height="360px">
                <el-carousel-item v-for="index in imgIter"  :key="index" initial-index="0">
                  <el-image :src="imgList[index]" style="width:100%;height:100%"></el-image>
                </el-carousel-item>
              </el-carousel>
              </el-card>
            </el-col>
            <el-col :span="11" style="margin-left: 16px">
              <el-card shadow="hover" style="height:360px; text-align: left" class="box-card">
                <!--酒店评分-->
                <span style="font-weight: 900 ;font-size: 30px; color: #67C23A">
                  {{ hotelInfo.score }}
                </span>
                <span style="font-weight: 600 ;font-size: 20px; color: #67C23A">分</span>
                <span style="font-size: 16px; font-weight: 500; margin-left:10px; text-align: left; color: #9f9f9f">
                  共有{{eAll.length}}条点评
                </span>
                <!--酒店地址-->
                <div style="margin-top:10px; font-size: 16px; font-weight: 500; text-align: left">
                  <i class="el-icon-location"></i>
                  <span style="font-weight: 600; margin-left: 2px;"> 详细地址:</span>
                  {{hotelInfo.city}} &nbsp; {{hotelInfo.region}} &nbsp; {{ hotelInfo.location }}</div>
                <!--酒店联系电话-->
                <div style="margin-top:10px; font-size: 16px; font-weight: 500; text-align: left">
                  <i class="el-icon-phone"></i>
                  <span style="font-weight: 600; margin-left: 2px;"> 联系电话:</span>
                  {{ hotelInfo.phone }}</div>
                <!-- 酒店介绍信息 -->
                <div style="margin-top:10px; font-size: 15px; font-weight: 500; text-align: left">
                  <i class="el-icon-info"></i>
                  <span style="font-size: 16px; font-weight: 600; margin-left: 2px;"> 酒店介绍:</span>
                  {{hotelInfo.briefInfo}}
                  <el-button @click="showDetail" style="margin-right:10px; float:right; padding:0px" type="text">查看更多</el-button>
                </div>
                  <!-- 点击查看详情后的dialog -->
                  <el-dialog body-style="padding:10px 20px;" :title="hotelInfo.myname" style="width:50%" v-model="detailDialogVisible">
                    <el-image :src="imgList[0]" style="width:100%"></el-image>
                    <p>{{ hotelInfo.details }}</p>
                  </el-dialog>
                <!-- 小地图 -->
                <el-tooltip class="item" effect="light" content="点击查看大图" placement="bottom">
                  <div @click="showLargeMap" id="mapSmall" style="height:110px; width:100%"></div>
                </el-tooltip>
                <!-- 大地图抽屉 -->
                <el-drawer
                  size="45%"
                  title="位置信息"
                  v-model="mapDrawerVisible"
                  direction="rtl">
                  <!-- 大地图 -->
                  <div id="mapLarge" style="height:40%; width:100%"></div>
                  <!-- 信息切换tab -->
                  <el-tabs v-model="activeMapTab" @tab-click="handleMapTabClick" style="margin:10px 20px 0px 20px">
                    <el-tab-pane label="公交站" name="bus">
                    </el-tab-pane>
                    <el-tab-pane label="地铁站" name="metro">
                    </el-tab-pane>
                    <el-tab-pane label="景点" name="scenery">
                    </el-tab-pane>
                    <el-tab-pane label="商场" name="market">
                    </el-tab-pane>
                  </el-tabs>
                  <!-- 信息展示列表 -->
                  <el-table
                    height="375"
                    v-loading="loadingLocalSearchData"
                    :show-header="isShowMapTableHeader"
                    style="width:98.5%; margin:0px 10px 10px 10px"
                    :data="localData"
                    stripe
                  >
                    <el-table-column>
                      <template #default="scope">
                        <div style="font-weight:600">{{ scope.row.name }}</div>
                        <div>{{ scope.row.detail }}</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-drawer>
              </el-card>
            </el-col>
          </el-row>
          <br><el-divider content-position="left">更多信息</el-divider>
          <el-tabs v-model="activePart" type="card" style="border-radius: 8px" @tab-click="refresh">
            <!--房型预定部分-->
            <el-tab-pane label="房间预定" name="room"
                         style="background-color: #ffdeb7; padding: 10px; border-radius: 6px">
              <el-card style="text-align: left; margin-bottom: 6px; padding: 0">
                <!--预定时间选择+合计天数,变更时自动刷新-->
                <el-date-picker range-separator="=>" start-placeholder="入住" end-placeholder="离店"
                                :disabledDate="getDisable" value-format="YYYY-MM-DD" v-model="dateRange"
                                type="daterange" @blur="getTimeSlot" :clearable="false"></el-date-picker>
                <span style="margin-left: 20px; margin-right: 25px ; font-weight: 700; color: darkgray">共 {{orderForm.days}} 晚</span>
                <el-divider direction="vertical"></el-divider>
                <!--预定房间数，变更时自动按剩余数修改是否可以预定-->
                <span style="margin-left: 25px; font-weight: 700; color: darkgray">预定房间数量</span>
                <el-input-number v-model="orderForm.number" style="margin-left: 20px; width: 12%"
                                 :min="1" :max="10" ></el-input-number>
              </el-card>
              <el-table :data="roomInfo" style="width: 100%" v-loading="roomLoading">
                <!--房间主图和房型-->
                <el-table-column label="房型" width="420px">
                  <template #default="scope">
                    <el-space>
                      <el-image :src="scope.row.pic" style="width: 240px; margin-right:6px"></el-image>
                      <span style="font-weight: bold; font-size: 16px">{{ scope.row.type }}<br><br><br><br><br></span>
                    </el-space>
                  </template>
                </el-table-column>
                <!--房间配置-->
                <el-table-column label="房间配置">
                  <template #default="scope">
                    <span class="room-details">房间面积：{{ scope.row.area }}㎡</span><br>
                    <span class="room-details">{{ scope.row.windows }}窗户</span><br>
                    <span class="room-details">{{ scope.row.wifi }}无线网络</span><br>
                    <span class="room-details">{{ scope.row.smoke }}吸烟</span><br><br>
                  </template>
                </el-table-column>
                <!--房间价格-->
                <el-table-column label="价格">
                  <template #default="scope">
                    <span style="font-weight: 700; font-size: 22px; color: dodgerblue">
                      ￥{{ scope.row.price }}<br><br><br><br>
                    </span>
                  </template>
                </el-table-column>
                <!--预定操作-->
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button round icon="el-icon-s-order" type="success" :disabled="scope.row.remain < orderForm.number"
                               @click="addOrder(scope.row)">
                      预定房间
                    </el-button>
                    <br><br><br><br>
                  </template>
                </el-table-column>
              </el-table>
              <!--预定房间窗口-->
              <el-dialog title="预定房间" v-model="newOrder" width="40%" @closed="cancelOrder">
                <!--预定时间确认-->
                <el-descriptions title="信息确认" :column="3" border
                                 style="margin-left: 2%; margin-right: 2%">
                  <el-descriptions-item>
                    <template #label>入住日期</template>
                    {{ dateRange[0] }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>离店日期</template>
                    {{ dateRange[1] }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>预定天数</template>
                    {{ orderForm.days }}
                  </el-descriptions-item>
                </el-descriptions>
                <!--订单信息确认-->
                <el-descriptions :column="2" border
                                 style="margin-left: 2%; margin-right: 2%; margin-bottom: 20px">
                  <el-descriptions-item>
                    <template #label>房间类型</template>
                    {{ orderForm.type }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>房间单价</template>
                    ￥ {{ orderForm.price }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>订房数量</template>
                    {{ orderForm.number }} 间
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>订单金额</template>
                    ￥ {{ orderForm.volume }}
                  </el-descriptions-item>
                </el-descriptions>
                <!--入住信息确认-->
                <el-form inline :model="orderForm" label-width="100px" style="margin-left: 0; margin-right: 2%">
                  <el-form-item label="入住人姓名">
                    <el-input v-model="orderForm.name" style="width: 110px"></el-input>
                  </el-form-item>
                  <el-form-item label="入住人电话">
                    <el-input type="tel" v-model="orderForm.phone" style="width: 160px; margin-right:10px"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-tooltip effect="light" content="使用当前用户信息" placement="right">
                      <el-button type="primary" @click="setInfo" icon="el-icon-user" circle></el-button>
                    </el-tooltip>
                  </el-form-item>
                  <el-button type="success" @click="submitOrder" style="width: 48%">确认</el-button>
                  <el-button type="danger" @click="newOrder = false" style="width: 48%">取消</el-button>
                </el-form>
              </el-dialog>
            </el-tab-pane>
            <!--用户评价部分-->
            <el-tab-pane label="用户评价" name="estimation"
                         style="background-color: #ffdeb7; padding: 10px; border-radius: 6px">
              <el-card style="text-align: left; margin-bottom: 6px" body-style="padding: 10px">
                <span style="font-weight: 800 ;font-size: 28px; color: #67C23A; margin-right: 3px; margin-left: 20px">
                  {{ hotelInfo.score }}
                </span>
                <span style="font-weight: 600 ;font-size: 18px; color: #67C23A; margin-right: 20px">分</span>
                <el-tag type="success" effect="dark">
                  好评率 {{ Math.floor(eHigh.length/eAll.length*100*100)/100 }}%
                </el-tag><br>
                <!--筛选评论类型-->
                <el-radio-group style="margin-left: 20px; margin-top: 10px; margin-bottom: 5px" v-model="estimationType" @change="filterEstimation">
                  <el-radio label="全部" style="width: 64px">全部（{{ eAll.length }}）</el-radio>
                  <el-radio label="好评" style="width: 64px">好评（{{ eHigh.length }}）</el-radio>
                  <el-radio label="中评" style="width: 64px">差评（{{ eMiddle.length }}）</el-radio>
                  <el-radio label="差评" style="width: 64px">差评（{{ eLow.length }}）</el-radio>
                </el-radio-group>
                <el-button v-if="eOrder" @click="sortEstimation" icon="el-icon-caret-bottom" style="margin-left: 400px" size="small" type="primary">按评论最新</el-button>
                <el-button v-else @click="sortEstimation" icon="el-icon-caret-top" style="margin-left: 400px" size="small" type="primary">按评论最早</el-button>
              </el-card>
              <!--评论内容-->
              <el-table :show-header="false" :data="estimation" style="width: 100%; min-height: 530px">
                <el-table-column width="120">
                  <template #default="scope">
                    <i class="el-icon-user" style="color:#409EFF;"></i>
                    <span style="margin-left: 10px; font-weight: 700; color: #409EFF">{{ scope.row.nickName }}</span><br><br><br>
                  </template>
                </el-table-column>
                <el-table-column width="800">
                  <template #default="scope">
                    <el-rate v-model="scope.row.star" :icon-classes="iconClasses" style="margin-left: 40px"
                             disabled-void-color='white' :colors="['#99A9BF', '#F7BA2A', '#FF9900']" disabled>
                    </el-rate>
                    <span style="margin-left: 10px; display:block;text-indent:2em">{{ scope.row.content }}</span>
                    <i class="el-icon-time" style="color: darkgray"></i>
                    <span style="margin-left: 10px; color: darkgray">发布于 {{ scope.row.time }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-col>
      <el-col :span="2">
        <!--快捷导航的固钉-->
        <el-affix :offset="74">
          <el-button type="primary" @click="goUp(0)" size="mini" style="margin-bottom: 4px">酒店详情</el-button><br>
          <el-button type="primary" @click="goUp(1)" size="mini">更多信息</el-button>
        </el-affix>
      </el-col></el-row>
      <el-footer style="background-color: #f6f9fa; height:100%">
        <p style="margin:0px; padding:30px 0px 40px 0px">
          Copyright ©2021 住哪儿-酒店预定平台
        </p>
      </el-footer>
    </el-container>
  </el-scrollbar>
</template>


<script>
import TopNav from "../components/TopNav";
import {ElMessage} from "element-plus";
import BMap from "BMap";
import BaseUrl from "../config";

export default {
  components: {
    TopNav,
  },
  data() {
    return {
      imgLoading: true,
      imgIter: [0,1,2],
      loadingLocalSearchData: false,
      isShowMapTableHeader: false,
      activeMapTab: "bus",
      localData: [],
      localMap: null,
      point: null,
      mapDrawerVisible: false,
      detailDialogVisible: false,
      mapSmall: null,
      mapLarge: null,
      imgList: [],
      uid: '',
      hid: '',
      hotelInfo: {},    //酒店详细
      isFav: false,
      activePart: 'room',   //选择的标签页：房间预定/用户评论
      //==房间预定数据==
      roomLoading: false,
      roomInfo: [],   //房型详情
      dateRange: [],    //预定日期
      //预定表单
      newOrder: false,    //控制预定窗口
      orderForm: {
        type: '',
        price: '',
        number: 1,
        days: 3,
        volume: '',
        name: '',
        phone: '',
        status:'进行中'
      },
      //==用户评论数据==
      estimationLoading: false,
      eOrder: true,
      estimationType: '全部',
      iconClasses: ['iconfont icon-chaping', 'iconfont icon-zhongping', 'iconfont icon-haoping'],
      estimation: [],
      eAll: [], eHigh: [], eMiddle: [], eLow: [],
    }
  },
  created() {
    this.uid = window.sessionStorage.getItem('uid')
    this.hid = this.$route.query.id
    const date1 = new Date(),
          time1 = date1.toLocaleDateString('chinese',{year:'numeric', month:'2-digit', day:'2-digit'})
              .replaceAll('/', '-')
    const date2 = new Date(date1)
    date2.setDate(date1.getDate()+3)
    const time2 = date2.toLocaleDateString('chinese',{year:'numeric', month:'2-digit', day:'2-digit'})
        .replaceAll('/', '-')
    this.dateRange = [time1, time2]
    if(this.uid !== '0')
      this.addHistory()
    this.getInfo()
    this.getRoom()
    this.getEstimation()
    window.scrollTo(0,0); // 窗口返回顶部
  },
  methods: {
    //获取酒店详情
    getInfo() {
      //调用接口+ 提供酒店ID，返回酒店信息
      this.axios.get(BaseUrl.ZHUNAR+"/api/hotel/id/"+this.hid).then((response) => {
        let rd = response.data[0]
        this.hotelInfo = rd
        this.hotelInfo.name = rd.myname
        this.hotelInfo.star = rd.star_level
        this.hotelInfo.lng = rd.lng
        this.hotelInfo.lat = rd.lat
        this.hotelInfo.briefInfo = rd.details.substr(0, 125)+'…'
        this.showSmallMap();
      })

      //调用接口+ 提供酒店ID、用户ID，返回是否收藏
      this.axios.get(BaseUrl.ZHUNAR+"/api/favorite/judge/"+this.uid+'/'+this.hid).then((response) => {
        this.isFav = response.data
      })

      let list = { // 参数列表
        "hotel_id": parseInt(this.hid),
        "picture_type": "酒店",
        "url": null,
        "sequence": -1
      }
      //调用接口+ 提供酒店ID、图片类型，返回酒店图片列表
      this.axios.post(BaseUrl.ZHUNAR+"/api/hotelpicture/picture", list).then((response)=>{
        this.imgList = response.data;
        this.imgIter = Array.from(new Array(this.imgList.length).keys());
        this.imgLoading = false;
      });
    },
    //进入页面时添加浏览记录
    addHistory() {
      //console.log('酒店ID:', this.hid, ' 用户ID:', this.uid)
      //调用接口+ 传入酒店id、用户id，无返回
      let sForm = {
        c_user_id: parseInt(this.uid),
        hotel_id: parseInt(this.hid),
      }
      this.axios.post(BaseUrl.ZHUNAR+"/api/track/add",sForm).then((response) => {
        console.log(response)
      })
    },
    //添加到收藏夹
    changeFavorite() {
      if(this.uid === '0') {
        ElMessage.warning('请先登录！')
        return
      }
      //调用接口+ 传入酒店ID、用户ID，无返回
      this.axios.put(BaseUrl.ZHUNAR+"/api/favorite/update/"+this.uid+'/'+this.hid).then((response) => {
        this.isFav = response.data
      })
    },
    //切换标签后的页面调整
    refresh(tab) {
      document.documentElement.scrollTop = 558
      console.log(tab.props.name)
      if(tab.props.name === 'room') {
        this.estimationType = '全部'
        this.filterEstimation('全部')
      }
    },
    //侧边用于滚动到固定位置的固钉
    goUp(i) {
      if(i ===0)
        document.documentElement.scrollTop = 0
      else
        document.documentElement.scrollTop = 558
    },

    //设置不可选时间段
    getDisable(time) {
      const curDate = (new Date()).getTime()
      // 这里算出一个月的毫秒数,
      //这里使用30的平均值,实际中应根据具体的每个月有多少天计算
      const day = 30 * 24 * 3600 * 1000
      const dateRegion = curDate + day
      return time.getTime() < Date.now() - 8.64e7 ||
          time.getTime() > dateRegion
    },
    //获取房间详情
    getRoom() {
      this.roomLoading = true
      //调用接口+ 传入酒店ID，返回所有房间信息
      this.axios.get(BaseUrl.ZHUNAR+"/api/roomtype/id/"+this.hid).then((response) => {
        let rd =response.data
        for(let i=0; i<rd.length; i++) {
          rd[i].type = rd[i].room_type
          rd[i].price = rd[i].today_price
          rd[i].remain = rd[i].remaining
          rd[i].pic = rd[i].url[0]
          rd[i].smoke = rd[i].smoke===0 ? '可':'不可'
          rd[i].windows = rd[i].windows===0 ? '无':'有'
          rd[i].wifi = rd[i].wifi===0 ? '无':'有'
        }
        this.roomInfo = rd
        this.roomLoading = false
      })
    },
    //获取选定时间段的房间价格与剩余量
    getTimeSlot() {
      this.roomLoading = true
      //获取预定天数
      let start = Date.parse(this.dateRange[0])
      let end = Date.parse(this.dateRange[1])
      this.orderForm.days = (end - start)/(24*3600*1000)
      //调用接口+ 传入酒店ID，两个时间点，返回所有房间剩余情况
      let sForm = {
        c_user_id: -1,
        room_quantity: -1,
        order_money: -1,
        room_type: null,
        phone_num: null,
        customer_name: null,
        order_status: null,
        hotel_id: parseInt(this.hid),
        day_time: this.dateRange[0]+'T00:00:00',
        start_date: this.dateRange[0]+'T00:00:00',
        end_date: this.dateRange[1]+'T00:00:00',
      }
      console.log(sForm)
      this.axios.post(BaseUrl.ZHUNAR+"/api/roomtimeslot/date", sForm).then((response) => {
        let rd = response.data
        for(let i=0;i<rd.length;i++) {
          this.roomInfo[i].price = rd[i].current_price
          this.roomInfo[i].remain = rd[i].remain
        }
        this.roomLoading = false
      })
    },
    //预定房间
    addOrder(row) {
      if(this.uid === '0') {
        ElMessage.warning('请先登录！')
        return
      }
      this.newOrder = true
      let form = this.orderForm
      form.type = row.type
      form.price = row.price
      form.volume = row.price * form.days * form.number
      form.time = new Date().toLocaleDateString('chinese',{year:'numeric', month:'2-digit', day:'2-digit'})
                            .replaceAll('/', '-')
      form.time += ' ' + new Date().toLocaleTimeString('chinese',{hour12:false})
      form.start = this.dateRange[0]
      form.end = this.dateRange[1]
    },
    //设置信息为当前用户的
    setInfo() {
      //调用接口+ 传入用户ID，返回该用户的姓名和电话
      this.axios.get(BaseUrl.ZHUNAR+"/api/customeraccount/customer/"+this.uid).then((response) => {
        let rd = response.data
        this.orderForm.name = rd.myname
        this.orderForm.phone = rd.phone_num
      })
    },
    //提交订单
    submitOrder() {
      if(this.orderForm.name === '' || this.orderForm.phone === '') {
        ElMessage.warning('请将入住信息填写完整！')
        return
      }
      console.log(this.orderForm)
      //调用接口+ 传入用户ID、酒店ID、所有信息，无返回
      let sForm = {
        'hotel_id': parseInt(this.hid),
        c_user_id: parseInt(this.uid),
        room_type: this.orderForm.type,
        room_quantity: this.orderForm.number,
        order_money: this.orderForm.volume,
        day_time: this.orderForm.start+'T00:00:00',
        start_date: this.orderForm.start+'T00:00:00',
        end_date: this.orderForm.end+'T00:00:00',
        phone_num: this.orderForm.phone,
        customer_name: this.orderForm.name,
        order_status: this.orderForm.status,
      }
      console.log(sForm)
      this.axios.post(BaseUrl.ZHUNAR+"/api/customerorder/add", sForm).then((response) => {
        console.log(response)
        ElMessage.success('预订成功！')
        this.newOrder = false
      })
    },
    //取消预定，清空表单
    cancelOrder() {
      this.orderForm.name = ''
      this.orderForm.phone = ''
    },

    //获取全部评论
    getEstimation() {
      //调用接口+ 传入酒店ID、返回所有评价
      this.axios.get(BaseUrl.ZHUNAR+"/api/estimation/id/"+this.hid).then((response) => {
        let rd = response.data
        for(let i=0;i<rd.length;i++) {
          rd[i].time = rd[i].day_time.replace('T', ' ')
          rd[i].star = rd[i].star_level
          rd[i].content = rd[i].details
          rd[i].nickName = rd[i].c_user_id
          //调用接口+ 传入用户ID、返回用户昵称
          this.axios.get(BaseUrl.ZHUNAR+"/api/customeraccount/customer/"+rd[i].nickName).then((res) => {
            rd[i].nickName = res.data.nickname
          })
        }
        const all = rd
        this.eAll = all
        this.estimation = all
        for(let i =0;i<all.length;i++) {
          if (all[i].star >= 4)
            this.eHigh.push(all[i])
          else if(all[i].star === 3)
            this.eMiddle.push(all[i])
          if (all[i].star <= 2)
            this.eLow.push(all[i])
        }
      })
    },
    //筛选评论类型
    filterEstimation(type) {
      switch (type) {
        case '全部':
          this.estimation = this.eAll
          break
        case '好评':
          this.estimation = this.eHigh
          break
        case '中评':
          this.estimation = this.eMiddle
          break
        case '差评':
          this.estimation = this.eLow
          break
      }
    },
    //评论按时间排序
    sortEstimation() {
      this.eOrder = !this.eOrder;		//
      this.estimation.sort(this.compare('time'));
    },
    //排序逻辑
    compare(attr) {
      let that = this;
      return function(a,b){
        let val1 = a[attr];
        let val2 = b[attr];
        if(that.eOrder){
          return new Date(val1.replace(/-/,'/')) - new Date(val2.replace(/-/,'/'));
        } else{
          return new Date(val2.replace(/-/,'/')) - new Date(val1.replace(/-/,'/'));
        }
      }
    },
    //显示小地图
    showSmallMap() {
      this.point = new BMap.Point(this.hotelInfo.lng, this.hotelInfo.lat);
      this.mapSmall = new BMap.Map("mapSmall",{ enableMapClick: false }); // 创建Map实例
      this.mapSmall.centerAndZoom(this.point, 14); // 初始化地图,设置中心点坐标和地图级别
      this.mapSmall.addOverlay(new BMap.Marker(this.point));
      this.mapSmall.disableDragging();
      this.mapSmall.setDefaultCursor('pointer');
    },
    //显示地图抽屉
    showLargeMap() {
      this.mapDrawerVisible = true;
      setTimeout(()=>{ // 设置延迟函数后以下代码才能执行
        this.loadingLocalSearchData = true;
        this.mapLarge = new BMap.Map("mapLarge"); // 创建Map实例
        //this.mapLarge.addOverlay(new BMap.Marker(this.point));
        this.mapLarge.centerAndZoom(this.point, 15); // 初始化地图,设置中心点坐标和地图级别
        this.mapLarge.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
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
        //添加酒店的label
        let label = new BMap.Label(this.hotelInfo.myname, {
          position: this.point,
          offset: new BMap.Size(0, -10),
          enableMassClear: false
        });
        label.setStyle(labelStyle);
        this.mapLarge.addOverlay(label); // 地图添加label

        this.localMap = new BMap.LocalSearch(this.mapLarge, 
        {
          renderOptions: {map: this.mapLarge, autoViewport: false},
          onSearchComplete: (result)=>{ // 返回搜索结果的回调函数
            this.localData = []; // 清空数据
            for(let item of result.Hr){ // 依次加入新数据
              this.localData.push({
                name: item.title,
                detail: item.address
              })
            }
            this.loadingLocalSearchData = false;
          }
        });
        this.localMap.searchNearby("公交站", this.point, 1000); // 首页是搜索公交站
      },50);
    },
    //显示详细信息dialog
    showDetail() {
      this.detailDialogVisible = true;
    },
    //响应大地图抽屉中的tab点击
    handleMapTabClick(tab) {
      this.loadingLocalSearchData = true;
      this.mapLarge.clearOverlays(); // 清除地图覆盖物
      this.localMap.searchNearby(tab.props.label, this.point, 1000); // 搜索
      this.localMap.clearResults(); // 清空搜索结果
    }
  },
}
</script>


<style scoped>
.room-details{
  color: darkgray;
}
</style>